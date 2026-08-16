"use client";

import { useActionState } from "react";
import { login, signup } from "./actions";

export default function LoginPage() {
  const [loginState, loginAction, isLoginPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const res = await login(formData);
      return res || prevState;
    },
    null
  );

  const [signupState, signupAction, isSignupPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const res = await signup(formData);
      return res || prevState;
    },
    null
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-white/10 bg-[#1e1e2e]/50 p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] to-[#7DD3FC]">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Sign in to access your recruitment pipeline
          </p>
        </div>

        <form className="mt-8 space-y-6" action={loginAction}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label
                htmlFor="email-address"
                className="mb-1 block text-sm font-medium text-[var(--text-secondary)]"
              >
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full appearance-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[var(--text-primary)] placeholder-white/30 focus:border-[#A78BFA] focus:outline-none focus:ring-1 focus:ring-[#A78BFA] sm:text-sm"
                placeholder="recruiter@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-[var(--text-secondary)]"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full appearance-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[var(--text-primary)] placeholder-white/30 focus:border-[#A78BFA] focus:outline-none focus:ring-1 focus:ring-[#A78BFA] sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          {(loginState?.error || signupState?.error) && (
            <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400">
              {loginState?.error || signupState?.error}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={isLoginPending}
              className="flex w-full justify-center rounded-lg bg-gradient-to-r from-[#A78BFA] to-[#7DD3FC] px-4 py-2 text-sm font-medium text-black transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:ring-offset-2 focus:ring-offset-[#0f0f13] disabled:opacity-50"
            >
              {isLoginPending ? "Signing in..." : "Sign In"}
            </button>
            <button
              formAction={signupAction}
              disabled={isSignupPending}
              className="flex w-full justify-center rounded-lg border border-white/10 bg-transparent px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition-all hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:ring-offset-2 focus:ring-offset-[#0f0f13] disabled:opacity-50"
            >
              {isSignupPending ? "Signing up..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
