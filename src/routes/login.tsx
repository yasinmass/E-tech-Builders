import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { HardHat, Eye, EyeOff, Loader2 } from "lucide-react";
import { login, saveTokens } from "@/api/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — BuildOps" },
      { name: "description", content: "Sign in to the BuildOps Supervisor Suite." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;

    setError("");
    setLoading(true);
    try {
      const res = await login({ username: username.trim(), password });
      saveTokens(res.access, res.refresh);
      await router.navigate({ to: "/buildings" });
    } catch (err: any) {
      console.error("Login failed:", err);
      const serverMsg = err.response?.data?.detail;
      setError(typeof serverMsg === "string" ? serverMsg : "Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      {/* Background gradient blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center mb-4 shadow-soft">
            <HardHat className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold font-display text-foreground">BuildOps</h1>
          <p className="text-muted-foreground mt-1 text-sm">Supervisor Suite — Sign in to continue</p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-3xl shadow-soft p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Username */}
            <label className="block">
              <span className="text-sm font-medium text-foreground mb-1.5 block">Username</span>
              <input
                id="login-username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="admin"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background outline-none text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:ring-4 focus:ring-primary/15"
              />
            </label>

            {/* Password */}
            <label className="block">
              <span className="text-sm font-medium text-foreground mb-1.5 block">Password</span>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="admin123"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-border bg-background outline-none text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:ring-4 focus:ring-primary/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </label>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading || !username.trim() || !password}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-primary text-primary-foreground font-semibold shadow-soft hover:shadow-lift hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-soft"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          BuildOps · Local Supervisor Management System
        </p>
      </motion.div>
    </div>
  );
}
