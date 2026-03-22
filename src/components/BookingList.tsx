"use client"

import { useAppSelector, RootState } from "@/redux/store";
import { useDispatch } from "react-redux";
import { removeBooking } from "@/redux/features/bookSlice";
import { BookingItem } from "@/../interface";

export default function BookingList() {

    const bookItems = useAppSelector(
        (state: RootState) => state.bookSlice.bookItems
    );

    const dispatch = useDispatch();

    if (bookItems.length === 0) {
        return (
            <div className="text-center text-xl font-semibold mt-10 text-gray-500">
                No Venue Booking
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto mt-10 space-y-4">

            {bookItems.map((item: BookingItem) => (
                <div
                    key={`${item.venue}-${item.bookDate}`}
                    className="bg-slate-100 rounded-lg px-10 py-5 shadow-sm border border-gray-200"
                >
                    <div className="text-xl font-bold mb-2 text-blue-800">
                        {item.venue}
                    </div>

                    <div className="space-y-1 text-gray-700">
                        <div>
                            <span className="font-semibold">Name-Lastname:</span>{" "}
                            {item.nameLastname}
                        </div>

                        <div>
                            <span className="font-semibold">Contact-Number:</span>{" "}
                            {item.tel}
                        </div>

                        <div>
                            <span className="font-semibold">Booking Date:</span>{" "}
                            {item.bookDate}
                        </div>
                    </div>

                    <button
                        className="mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md"
                        onClick={() => dispatch(removeBooking(item))}
                    >
                        Remove Booking
                    </button>
                </div>
            ))}
        </div>
    );
}