import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import TopMenu from '@/components/TopMenu';
import "./globals.css";
import NextAuthProvider from "@/providers/NextAuthProvider";
import ReduxProvider from "@/redux/ReduxProvider";   // ⭐ เพิ่มบรรทัดนี้
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Venue Explorer",
    description: "Explore and book your favorite venues",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <NextAuthProvider session={session}>
                    
                    <ReduxProvider>   {/* ⭐ เพิ่มตัวนี้ */}
                        <TopMenu />
                        <main className="pt-16">
                            {children}
                        </main>
                    </ReduxProvider>

                </NextAuthProvider>
            </body>
        </html>
    );
}