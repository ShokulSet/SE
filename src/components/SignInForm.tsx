"use client"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SignInForm() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async () => {
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        })

        if (result?.error) {
            setError("Invalid email or password")
        } else {
            router.push("/")
        }
    }

    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#1a1a1a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <div style={{
                backgroundColor: "#2a2a2a",
                padding: "48px 40px",
                width: "100%",
                maxWidth: "380px",
                borderRadius: "4px",
            }}>
                {/* Title */}
                <div style={{ textAlign: "center", marginBottom: "36px" }}>
                    <h1 style={{
                        color: "#ffffff",
                        fontSize: "36px",
                        fontWeight: "400",
                        fontFamily: "serif",
                        marginBottom: "8px",
                    }}>Login</h1>
                    <div style={{
                        width: "40px",
                        height: "2px",
                        backgroundColor: "#c8a84b",
                        margin: "0 auto",
                    }} />
                </div>

                {/* Error */}
                {error && (
                    <p style={{
                        color: "#ff6b6b",
                        fontSize: "13px",
                        marginBottom: "12px",
                        textAlign: "center",
                    }}>{error}</p>
                )}

                {/* Form */}
                <div>
                    {/* Email */}
                    <div style={{ marginBottom: "24px" }}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: "100%",
                                backgroundColor: "transparent",
                                border: "none",
                                borderBottom: "1px solid #555",
                                color: "#ffffff",
                                fontSize: "14px",
                                padding: "8px 0",
                                outline: "none",
                                boxSizing: "border-box",
                            }}
                        />
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: "32px" }}>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: "100%",
                                backgroundColor: "transparent",
                                border: "none",
                                borderBottom: "1px solid #555",
                                color: "#ffffff",
                                fontSize: "14px",
                                padding: "8px 0",
                                outline: "none",
                                boxSizing: "border-box",
                            }}
                        />
                    </div>

                    {/* Sign In Button */}
                    <button
                        type="button"
                        onClick={handleSubmit}
                        style={{
                            width: "100%",
                            padding: "14px",
                            background: "linear-gradient(135deg, #c8a84b, #e8c55a, #c8a84b)",
                            border: "none",
                            borderRadius: "4px",
                            color: "#1a1a1a",
                            fontSize: "16px",
                            fontWeight: "600",
                            cursor: "pointer",
                            marginBottom: "24px",
                        }}
                    >
                        Sign In
                    </button>
                </div>

                {/* Forgot Password */}
                <div style={{ textAlign: "center", marginBottom: "12px" }}>
                    <a href="#" style={{
                        color: "#aaaaaa",
                        fontSize: "13px",
                        textDecoration: "none",
                    }}>Forgot Password?</a>
                </div>

                {/* Register */}
                <div style={{ textAlign: "center" }}>
                    <span style={{ color: "#aaaaaa", fontSize: "13px" }}>
                        Don't have an account?{" "}
                    </span>
                    <a href="/register" style={{
                        color: "#aaaaaa",
                        fontSize: "13px",
                        textDecoration: "none",
                        display: "block",
                    }}>Register</a>
                </div>
            </div>
        </div>
    )
}