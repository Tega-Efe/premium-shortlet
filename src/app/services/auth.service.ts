import { Injectable, inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  user,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  user$ = user(this.auth);

  // Get current user
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  // Sign up with email and password
  async signUp(email: string, password: string, displayName?: string): Promise<User | null> {
    try {
      const credential = await createUserWithEmailAndPassword(this.auth, email, password);
      if (displayName && credential.user) {
        await updateProfile(credential.user, { displayName });
      }
      return credential.user;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<User | null> {
    try {
      const credential = await signInWithEmailAndPassword(this.auth, email, password);
      return credential.user;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  // Sign in with Google
  async signInWithGoogle(): Promise<User | null> {
    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(this.auth, provider);
      return credential.user;
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  }

  // Send password reset email
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  // Send email verification
  async sendVerificationEmail(): Promise<void> {
    const user = this.getCurrentUser();
    if (user) {
      try {
        await sendEmailVerification(user);
      } catch (error) {
        console.error('Email verification error:', error);
        throw error;
      }
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.auth.currentUser !== null;
  }
}
