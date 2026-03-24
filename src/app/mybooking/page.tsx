import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import BookingList from "@/components/BookingList";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function MyBookingPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/signin")
    }

    return (
        <main className="min-h-screen bg-black text-white px-6 py-12">
            <div className="max-w-7xl px-6 mx-auto">

                {/* Header */}
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h1 className="text-2xl text-yellow-500 font-normal">
                            My Bookings
                        </h1>
                        <p className="text-gray-600 text-xs tracking-widest uppercase mt-1">
                            Manage your reservations
                        </p>
                    </div>
                    <Link
                        href="/booking"
                        className="flex items-center gap-2 text-xs font-medium px-5 py-2
                                   text-yellow-500 border border-yellow-500
                                   hover:bg-yellow-500 hover:text-black
                                   transition-all duration-200 tracking-widest uppercase"
                    >
                        <Plus size={14} />
                        New Booking
                    </Link>
                </div>

                {/* List */}
                <BookingList />

            </div>
        </main>
    );
}