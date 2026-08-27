// components/AuthRedirectorWrapper.tsx
import { Suspense } from 'react';
import AuthRedirector from './AuthRedirector';

// This wrapper is necessary to prevent Next.js build error:
// "useSearchParams() should be wrapped in a suspense boundary"
export default function AuthRedirectorWrapper() {
  return (
    <Suspense fallback={null}>
      <AuthRedirector />
    </Suspense>
  );
}