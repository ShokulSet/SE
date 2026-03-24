import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import BookingClient from "@/components/BookingClient";

export default async function BookingPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/signin")
    }

    return <BookingClient />
}