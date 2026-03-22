import BookingList from "@/components/BookingList";

export default function MyBookingPage() {
    return (
        <main className="p-10 w-full flex flex-col items-center">
            {/* หัวข้อหน้าแสดงข้อมูลการจอง */}
            <h1 className="text-3xl font-bold text-blue-900 mb-8 mt-10">
                My Venue Bookings
            </h1>

            {/* นำ Component BookingList มาวางไว้บนหน้านี้ */}
            <div className="w-full">
                <BookingList />
            </div>
        </main>
    );
}