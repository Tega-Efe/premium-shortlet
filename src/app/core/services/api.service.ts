import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry, shareReplay, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl || '/api';
  
  // Cache store
  private cache = new Map<string, Observable<any>>();
  
  // Loading state
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  /**
   * GET request with caching
   */
  get<T>(endpoint: string, params?: any, useCache: boolean = true): Observable<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    const cacheKey = this.getCacheKey(url, params);

    if (useCache && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const httpParams = this.buildHttpParams(params);
    const request$ = this.http.get<T>(url, { params: httpParams }).pipe(
      retry(2),
      shareReplay(1),
      catchError(this.handleError),
      tap(() => this.setLoading(false))
    );

    if (useCache) {
      this.cache.set(cacheKey, request$);
      // Clear cache after 5 minutes
      setTimeout(() => this.cache.delete(cacheKey), 5 * 60 * 1000);
    }

    this.setLoading(true);
    return request$;
  }

  /**
   * POST request
   */
  post<T>(endpoint: string, body: any): Observable<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    this.setLoading(true);

    return this.http.post<T>(url, body).pipe(
      catchError(this.handleError),
      tap(() => this.setLoading(false))
    );
  }

  /**
   * PUT request
   */
  put<T>(endpoint: string, body: any): Observable<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    this.setLoading(true);

    return this.http.put<T>(url, body).pipe(
      catchError(this.handleError),
      tap(() => this.setLoading(false))
    );
  }

  /**
   * PATCH request
   */
  patch<T>(endpoint: string, body: any): Observable<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    this.setLoading(true);

    return this.http.patch<T>(url, body).pipe(
      catchError(this.handleError),
      tap(() => this.setLoading(false))
    );
  }

  /**
   * DELETE request
   */
  delete<T>(endpoint: string): Observable<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    this.setLoading(true);

    return this.http.delete<T>(url).pipe(
      catchError(this.handleError),
      tap(() => this.setLoading(false))
    );
  }

  /**
   * Clear specific cache entry
   */
  clearCache(endpoint: string, params?: any): void {
    const url = `${this.baseUrl}/${endpoint}`;
    const cacheKey = this.getCacheKey(url, params);
    this.cache.delete(cacheKey);
  }

  /**
   * Clear all cache
   */
  clearAllCache(): void {
    this.cache.clear();
  }

  /**
   * Build HTTP params from object
   */
  private buildHttpParams(params?: any): HttpParams {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          if (Array.isArray(params[key])) {
            params[key].forEach((value: any) => {
              httpParams = httpParams.append(key, value.toString());
            });
          } else {
            httpParams = httpParams.set(key, params[key].toString());
          }
        }
      });
    }

    return httpParams;
  }

  /**
   * Generate cache key
   */
  private getCacheKey(url: string, params?: any): string {
    return params ? `${url}?${JSON.stringify(params)}` : url;
  }

  /**
   * Set loading state
   */
  private setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (typeof ErrorEvent !== 'undefined' && error.error instanceof ErrorEvent) {
      // Client-side error (browser only)
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error or SSR environment
      errorMessage = error.error?.message || `Server Error: ${error.status} - ${error.statusText}`;
    }

    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
