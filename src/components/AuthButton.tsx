"use client"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"

export default function AuthButton() {
    const { data: session } = useSession()

    if (session) {
        return (
            <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm font-medium px-4 py-1.5
                           text-yellow-500 border border-yellow-500
                           hover:bg-yellow-500 hover:text-black
                           transition-all duration-200"
            >
                Sign-Out
            </button>
        )
    }

    return (
        <div className="flex items-center gap-2">
            <Link
                href="/register"
                   className="text-sm font-medium px-4 py-1.5
                           text-yellow-500 border border-yellow-500
                           hover:bg-yellow-500 hover:text-black
                           transition-all duration-200"
            >
                Register
            </Link>
            <Link
                href="/signin"
                className="text-sm font-medium px-4 py-1.5
                            bg-yellow-500
                           text-black border border-yellow-500
                           hover:bg-yellow-500 hover:text-black
                           transition-all duration-200"
            >
                Sign-In
            </Link>
        </div>
    )
}