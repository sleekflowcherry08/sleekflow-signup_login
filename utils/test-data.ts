import { readFileSync } from 'fs';
import { join } from 'path';

export type Expected = 'success' | 'error' | 'blocked';

export interface LoginCase {
  name: string;
  email: string;
  password: string;
  expected: Expected;
  errorCode?: string;
}

export interface SignupCase {
  name: string;
  email: string;
  acceptTerms: boolean;
  password?: string;
  expected: Expected;
  errorId?: string;
}

// Data files live in test-data/. Add a new object there and a new test appears automatically.
export function loadCases<T>(fileName: string): T[] {
  return JSON.parse(readFileSync(join(__dirname, '..', 'test-data', fileName), 'utf8'));
}

// "$E2E_USER_EMAIL" -> process.env.E2E_USER_EMAIL, "{timestamp}" -> unique number.
export function resolveValue(value: string): string {
  const raw = value.startsWith('$') ? process.env[value.slice(1)] ?? '' : value;
  return raw.replace(/\{timestamp\}/g, Date.now().toString());
}
