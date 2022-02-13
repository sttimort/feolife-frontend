import { Injectable } from '@angular/core';

const AUTH_TOKEN_KEY = "feolife.auth-token"

@Injectable({
  providedIn: 'root'
})
export class AuthTokenStorageService {

  private token: string | null = null;

  constructor() { }

  public get() {
    return localStorage.getItem(AUTH_TOKEN_KEY)
      ?? sessionStorage.getItem(AUTH_TOKEN_KEY)
      ?? this.token;
  }

  public save(token: string) {
    let saved = false;

    try {
      localStorage?.setItem(AUTH_TOKEN_KEY, token);
      saved = true;
    } catch (e: any) {
      console.error('failed to save token to local storage, will fall back to session storage', e)
    }

    if (!saved) {
      try {
        sessionStorage?.setItem(AUTH_TOKEN_KEY, token)
        saved = true;
      } catch (e: any) {
        console.error('failed to save token to session storage', e)
      }
    }

    if (!saved) {
      this.token = token;
    }
  }

  public remove() {
    localStorage?.removeItem(AUTH_TOKEN_KEY)
    sessionStorage?.removeItem(AUTH_TOKEN_KEY)
    this.token = null;
  }
}
