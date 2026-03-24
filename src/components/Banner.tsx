"use client";
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Banner() {
    const router = useRouter();
    const { data: session } = useSession();

    return (
        <div className="relative w-full h-screen overflow-hidden">
            <img
                src="/banner2.png"
                alt="banner2"
                className="w-full h-full opacity-50 object-cover absolute inset-0"
            />

            {/* รวมทุกอย่างไว้ใน div เดียว เรียงบนลงล่าง */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                            flex flex-col items-center gap-4 text-center">
                
                {/* Heading — เปลี่ยนตามสถานะ login */}
                <div className="font-playfair font-medium text-5xl flex gap-2">
                    {session ? (
                        <h1 className="text-white">
                            Welcome <span className="text-yellow-500 font-bold">{session.user?.name}</span>
                        </h1>
                    ) : (
                        <>
                            <h1 className="text-white">The Pinnacle of</h1>
                            <h1 className="text-yellow-500 font-bold ">Culinary Art</h1>
                        </>
                    )}
                </div>

                {/* Subtext */}
                <p className="text-white text-lg font-thin max-w-lg mt-2 tracking-wide">
                    Experience unparalleled luxury dining where every dish is a masterpiece
                </p>

                {/* ปุ่ม */}
                <button
                    className="mt-2 text-sm font-medium px-6 py-2
                               text-white border border-yellow-500
                             bg-yellow-500 hover:text-black
                               transition-all duration-200"
                    onClick={() => router.push('/venue')}
                >
                    Select Venue
                </button>
            </div>
        </div>
    );
}