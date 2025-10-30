import { Injectable, signal, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { 
  Auth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  UserCredential
} from '@angular/fire/auth';
import { 
  Firestore, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot,
  serverTimestamp,
  Timestamp
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable, fromEvent, merge, Subscription } from 'rxjs';
import { filter, debounceTime } from 'rxjs/operators';
import { NotificationService } from '../../services/notification.service';

interface AdminSession {
  userId: string;
  sessionId: string;
  deviceInfo: string;
  lastActivity: Timestamp | any;
  loginTime: Timestamp | any;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private firestore = inject(Firestore);
  private notificationService = inject(NotificationService);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  isAuthenticated = signal<boolean>(false);
  currentUser = signal<User | null>(null);
  isLoading = signal<boolean>(true);

  // Session management
  private sessionId: string = this.generateSessionId();
  private sessionUnsubscribe: (() => void) | null = null;
  private inactivityTimer: any = null;
  private activitySubscription: Subscription | null = null;
  private routeSubscription: Subscription | null = null;
  private isLoggingOut: boolean = false; // Flag to prevent duplicate logouts
  
  // Configuration
  private readonly INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds
  private readonly SESSION_CHECK_INTERVAL = 30 * 1000; // Check every 30 seconds

  constructor(
    private auth: Auth,
    private router: Router
  ) {
    this.initAuthStateListener();
    this.initRouteListener();
  }

  /**
   * Initialize authentication state listener
   */
  private initAuthStateListener(): void {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser.set(user);
      this.currentUserSubject.next(user);
      this.isAuthenticated.set(!!user);
      this.isLoading.set(false);

      if (user) {
        this.startSessionMonitoring(user);
      } else {
        this.stopSessionMonitoring();
      }
    });
  }

  /**
   * Initialize route listener to logout when leaving admin area
   */
  private initRouteListener(): void {
    this.routeSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects || event.url;
      
      // If user navigates away from admin area while logged in, logout
      if (this.isAuthenticated() && !url.startsWith('/admin')) {
        console.log('🚪 User navigated away from admin area - logging out');
        this.logout();
      }
    });
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get device information for session tracking
   */
  private getDeviceInfo(): string {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    return `${platform} - ${userAgent.substring(0, 100)}`;
  }

  /**
   * Start monitoring session for single-device login and inactivity
   */
  private async startSessionMonitoring(user: User): Promise<void> {
    const sessionRef = doc(this.firestore, `admin-sessions/${user.uid}`);

    // First, check if there's an existing session
    const existingSession = await getDoc(sessionRef);
    const existingData = existingSession.data() as AdminSession | undefined;

    // If there's an active session with a different sessionId, it means we're the new login
    // We should NOT set up the listener yet, just update the session
    const isNewLogin = existingData && existingData.isActive && existingData.sessionId !== this.sessionId;

    // Create or update session in Firestore with our new session ID
    const sessionData: AdminSession = {
      userId: user.uid,
      sessionId: this.sessionId,
      deviceInfo: this.getDeviceInfo(),
      lastActivity: serverTimestamp(),
      loginTime: serverTimestamp(),
      isActive: true
    };

    await setDoc(sessionRef, sessionData);

    // Listen for session changes (detect if another device logs in AFTER us)
    this.sessionUnsubscribe = onSnapshot(sessionRef, (snapshot) => {
      const data = snapshot.data() as AdminSession;
      
      // Only logout if:
      // 1. Session data exists
      // 2. The sessionId in Firestore is different from ours (another device logged in)
      // 3. We're not already in the process of logging out
      // 4. The session is marked as active
      if (data && 
          data.sessionId !== this.sessionId && 
          !this.isLoggingOut && 
          data.isActive) {
        console.log('🚨 Another device has logged in - logging out this session');
        this.notificationService.warning('Your session has been terminated because you logged in from another device.');
        this.forceLogout();
      }
    });

    // Start inactivity monitoring
    this.startInactivityMonitoring();
  }

  /**
   * Start monitoring user activity for auto-logout
   */
  private startInactivityMonitoring(): void {
    // Clear any existing timer
    this.clearInactivityTimer();

    // Activity events to monitor
    const activityEvents = merge(
      fromEvent(document, 'mousedown'),
      fromEvent(document, 'keydown'),
      fromEvent(document, 'scroll'),
      fromEvent(document, 'touchstart')
    ).pipe(debounceTime(1000)); // Debounce to avoid too many updates

    // Subscribe to activity events
    this.activitySubscription = activityEvents.subscribe(() => {
      this.updateLastActivity();
      this.resetInactivityTimer();
    });

    // Set initial inactivity timer
    this.resetInactivityTimer();
  }

  /**
   * Update last activity timestamp in Firestore
   */
  private async updateLastActivity(): Promise<void> {
    const user = this.getCurrentUser();
    if (!user) return;

    const sessionRef = doc(this.firestore, `admin-sessions/${user.uid}`);
    try {
      await setDoc(sessionRef, { 
        lastActivity: serverTimestamp(),
        isActive: true 
      }, { merge: true });
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  }

  /**
   * Reset inactivity timer
   */
  private resetInactivityTimer(): void {
    this.clearInactivityTimer();
    
    this.inactivityTimer = setTimeout(() => {
      console.log('⏰ Inactivity timeout - logging out');
      this.notificationService.info('You have been logged out due to inactivity.');
      this.logout();
    }, this.INACTIVITY_TIMEOUT);
  }

  /**
   * Clear inactivity timer
   */
  private clearInactivityTimer(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
  }

  /**
   * Stop all session monitoring
   */
  private stopSessionMonitoring(): void {
    // Unsubscribe from session snapshot FIRST to prevent triggers
    if (this.sessionUnsubscribe) {
      this.sessionUnsubscribe();
      this.sessionUnsubscribe = null;
    }

    // Clear inactivity timer
    this.clearInactivityTimer();

    // Unsubscribe from activity events
    if (this.activitySubscription) {
      this.activitySubscription.unsubscribe();
      this.activitySubscription = null;
    }

    // DON'T clean up session in Firestore when being forced out by another device
    // Only clean up if we're the active session
    if (!this.isLoggingOut) {
      this.cleanupSession();
    }
  }

  /**
   * Clean up session document in Firestore
   * Only called when this device voluntarily logs out (not when forced out)
   */
  private async cleanupSession(): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) return;

    const sessionRef = doc(this.firestore, `admin-sessions/${user.uid}`);
    try {
      // First check if we're still the active session
      const currentSession = await getDoc(sessionRef);
      const currentData = currentSession.data() as AdminSession | undefined;
      
      // Only mark as inactive if we're still the current session
      // This prevents Device A from interfering when Device B has taken over
      if (currentData && currentData.sessionId === this.sessionId) {
        await setDoc(sessionRef, { 
          isActive: false
        }, { merge: true });
      }
      // If sessionId doesn't match, another device has taken over - don't touch the session
    } catch (error) {
      console.error('Error cleaning up session:', error);
    }
  }

  /**
   * Force logout (called when another device logs in)
   */
  private async forceLogout(): Promise<void> {
    if (this.isLoggingOut) return; // Prevent duplicate calls
    
    this.isLoggingOut = true; // Set flag to prevent duplicate logouts
    
    // Unsubscribe from session snapshot FIRST to prevent any further triggers
    if (this.sessionUnsubscribe) {
      this.sessionUnsubscribe();
      this.sessionUnsubscribe = null;
    }

    // Clear inactivity timer
    this.clearInactivityTimer();

    // Unsubscribe from activity events
    if (this.activitySubscription) {
      this.activitySubscription.unsubscribe();
      this.activitySubscription = null;
    }
    
    // DON'T call stopSessionMonitoring() or cleanupSession() here
    // The new device has already taken over the session
    
    try {
      await signOut(this.auth);
      this.router.navigate(['/admin/login'], { 
        queryParams: { reason: 'session-terminated' } 
      });
    } catch (error) {
      console.error('Force logout error:', error);
    } finally {
      this.isLoggingOut = false; // Reset flag
    }
  }

  /**
   * Login with email and password
   * @param email - Admin email
   * @param password - Admin password
   * @param rememberMe - Whether to persist session across browser restarts
   */
  async login(email: string, password: string, rememberMe: boolean = false): Promise<UserCredential> {
    try {
      // Set persistence based on remember me
      const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(this.auth, persistence);

      // Sign in
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      
      // Session will be created automatically by onAuthStateChanged listener
      
      return userCredential;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Logout current admin
   */
  async logout(): Promise<void> {
    try {
      this.isLoggingOut = true; // Set flag to prevent duplicate logouts
      this.stopSessionMonitoring();
      await signOut(this.auth);
      this.router.navigate(['/admin/login']);
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error('Failed to logout. Please try again.');
    } finally {
      this.isLoggingOut = false; // Reset flag
    }
  }

  /**
   * Cleanup when service is destroyed
   */
  ngOnDestroy(): void {
    this.stopSessionMonitoring();
    
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  /**
   * Check if user is authenticated
   */
  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUser();
  }

  /**
   * Get current user email
   */
  getCurrentUserEmail(): string | null {
    return this.currentUser()?.email || null;
  }

  /**
   * Handle authentication errors
   */
  private handleAuthError(error: any): Error {
    let message = 'An error occurred during authentication.';

    switch (error.code) {
      case 'auth/invalid-email':
        message = 'Invalid email address format.';
        break;
      case 'auth/user-disabled':
        message = 'This account has been disabled.';
        break;
      case 'auth/user-not-found':
        message = 'Invalid email or password.';
        break;
      case 'auth/wrong-password':
        message = 'Invalid email or password.';
        break;
      case 'auth/invalid-credential':
        message = 'Invalid email or password.';
        break;
      case 'auth/too-many-requests':
        message = 'Too many failed attempts. Please try again later.';
        break;
      case 'auth/network-request-failed':
        message = 'Network error. Please check your connection.';
        break;
      case 'auth/operation-not-allowed':
        message = 'Email/password authentication is not enabled.';
        break;
      default:
        message = error.message || 'Authentication failed. Please try again.';
    }

    return new Error(message);
  }

  /**
   * Wait for authentication state to be initialized
   */
  async waitForAuthInit(): Promise<void> {
    if (!this.isLoading()) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(this.auth, () => {
        unsubscribe();
        resolve();
      });
    });
  }
}
