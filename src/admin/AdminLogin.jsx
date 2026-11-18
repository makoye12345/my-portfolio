import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./Admin.css";

function AdminLogin() {
    const navigate = useNavigate();

    // Form states
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Handle administrator login
    async function handleLogin(event) {
        event.preventDefault();

        setLoading(true);
        setError("");

        try {
            // Authenticate with Supabase
            const { data, error: loginError } =
                await supabase.auth.signInWithPassword({
                    email: email.trim(),
                    password,
                });

            if (loginError) {
                throw loginError;
            }

            if (!data.user) {
                throw new Error("Unable to verify your account.");
            }

            // Verify administrator membership
            const { data: admin, error: adminError } =
                await supabase
                    .from("portfolio_admins")
                    .select("user_id")
                    .eq("user_id", data.user.id)
                    .maybeSingle();

            if (adminError) {
                throw adminError;
            }

            if (!admin) {
                await supabase.auth.signOut();

                throw new Error(
                    "This account is not authorized as an administrator."
                );
            }

            // Open dashboard
            navigate("/admin/dashboard", {
                replace: true,
            });

        } catch (err) {
            setError(
                err.message || "Unable to sign in. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="admin-login-page">

            <form
                className="admin-login-card"
                onSubmit={handleLogin}
            >
                {/* Heading */}
                <div className="admin-login-header">
                    <div className="admin-login-icon">🔐</div>

                    <h2>Portfolio Admin</h2>

                    <p>
                        Sign in to manage your portfolio
                    </p>
                </div>

                {/* Email */}
                <div className="admin-form-group">
                    <label htmlFor="admin-email">
                        Email Address
                    </label>

                    <input
                        id="admin-email"
                        type="email"
                        placeholder="Enter your admin email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        autoComplete="username"
                        required
                    />
                </div>

                {/* Password */}
                <div className="admin-form-group">
                    <label htmlFor="admin-password">
                        Password
                    </label>

                    <input
                        id="admin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        autoComplete="current-password"
                        required
                    />
                </div>

                {/* Show password */}
                <label className="show-password-label">
                    <input
                        type="checkbox"
                        checked={showPassword}
                        onChange={(event) =>
                            setShowPassword(event.target.checked)
                        }
                    />

                    <span>Show Password</span>
                </label>

                {/* Error message */}
                {error && (
                    <p className="admin-error" role="alert">
                        {error}
                    </p>
                )}

                {/* Login button */}
                <button
                    type="submit"
                    className="admin-login-button"
                    disabled={loading}
                >
                    {loading ? "Signing in..." : "Login"}
                </button>

                {/* Return to website */}
                <a
                    href="/"
                    className="admin-back-link"
                >
                    ← Back to Portfolio
                </a>

            </form>

        </div>
    );
}

export default AdminLogin;