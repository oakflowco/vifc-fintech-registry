"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function LoginPage() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    router.push("/account");
    router.refresh();
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>{isSignup ? "Create Account" : "Login"}</CardTitle>
          <CardDescription>
            {isSignup
              ? "Sign up to access premium features"
              : "Sign in to your VIFC account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : isSignup
                  ? "Create Account"
                  : "Login"}
            </button>
          </form>

          <div className="mt-4 text-center space-y-2">
            <button
              onClick={() => { setIsSignup(!isSignup); setError(""); }}
              className="text-sm text-muted-foreground hover:text-foreground block w-full"
            >
              {isSignup
                ? "Already have an account? Login"
                : "Don't have an account? Sign up"}
            </button>
            {!isSignup && (
              <a
                href="/forgot-password"
                className="text-xs text-muted-foreground hover:text-foreground block"
              >
                Forgot password?
              </a>
            )}
          </div>

          <div className="mt-6 border-t pt-4">
            <div className="flex items-center gap-2 justify-center">
              <Badge variant="outline" className="text-[10px]">Premium</Badge>
              <span className="text-xs text-muted-foreground">
                250,000₫/month via MoMo — Trends + CSV Export
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
