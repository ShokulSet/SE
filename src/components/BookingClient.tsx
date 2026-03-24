"use client";

import DateReserve from '@/components/DateReserve';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { addBooking } from '@/redux/features/bookSlice';
import { BookingItem } from '@/../interface';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';

export default function BookingClient() {
    const dispatch = useDispatch<AppDispatch>();

    const [name, setName] = useState("");
    const [tel, setTel] = useState("");
    const [venue, setVenue] = useState("");
    const [bookDate, setBookDate] = useState<Dayjs | null>(null);
    const [guests, setGuests] = useState("");
    const [eventType, setEventType] = useState("");
    const [specialReq, setSpecialReq] = useState("");

    const handleBooking = () => {
        if (name && tel && venue && bookDate) {
            const item: BookingItem = {
                nameLastname: name,
                tel: tel,
                venue: venue,
                bookDate: dayjs(bookDate).format("YYYY/MM/DD"),
            };
            dispatch(addBooking(item));
            alert("Booking Confirmed!");
        } else {
            alert("Please fill in all fields");
        }
    };

    return (
        <main className="min-h-screen bg-black text-white px-6 py-12">
            <div className="max-w-7xl px-6 mx-auto">

                {/* Breadcrumb */}
                <p className="text-gray-600 text-xs tracking-widest uppercase mb-8">
                    Home / Venues /
                    <span className="text-gray-400 ml-1">Booking</span>
                </p>

                <div className="flex flex-col md:flex-row gap-10">

                    {/* ซ้าย */}
                    <div className="w-full md:w-1/2 flex flex-col gap-6">
                        <h1 className="font-playfair text-3xl font-bold text-white">
                            {venue || "Select a Venue"}
                        </h1>
                        <div className="bg-[#2D2D2D] px-5 py-4">
                            <p className="text-gray-400 text-xs tracking-widest uppercase mb-1">Daily Rate</p>
                            <p className="text-yellow-500 text-2xl font-bold">฿—</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-yellow-500 text-xs tracking-widest uppercase mb-1">Location</p>
                            <p className="text-gray-400 text-sm">Please select a venue to view location</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-yellow-500 text-xs tracking-widest uppercase mb-1">Contact</p>
                            <p className="text-gray-400 text-sm">{tel || "—"}</p>
                        </div>
                    </div>

                    {/* ขวา */}
                    <div className="w-full md:w-1/2 flex flex-col gap-5">
                        <h2 className="font-playfair text-xl font-bold text-yellow-500">
                            Book Your Event
                        </h2>

                        <div className="flex flex-col gap-1">
                            <label className="text-gray-500 text-xs tracking-widest uppercase">Name - Lastname</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-[#1a1a1a] border border-gray-700 text-white text-sm px-4 py-2.5 outline-none focus:border-yellow-500 transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-gray-500 text-xs tracking-widest uppercase">Contact Number</label>
                            <input
                                type="text"
                                value={tel}
                                onChange={(e) => setTel(e.target.value)}
                                className="bg-[#1a1a1a] border border-gray-700 text-white text-sm px-4 py-2.5 outline-none focus:border-yellow-500 transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-gray-500 text-xs tracking-widest uppercase">Venue</label>
                            <select
                                value={venue}
                                onChange={(e) => setVenue(e.target.value)}
                                className="bg-[#1a1a1a] border border-gray-700 text-white text-sm px-4 py-2.5 outline-none focus:border-yellow-500 transition"
                            >
                                <option value="" disabled>Select Venue</option>
                                <option value="Bloom">The Bloom Pavilion</option>
                                <option value="Spark">Spark Space</option>
                                <option value="GrandTable">The Grand Table</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-gray-500 text-xs tracking-widest uppercase">Select Date</label>
                            <div className="bg-[#1a1a1a] border border-gray-700 p-3">
                                <DateReserve onDateChange={(value: Dayjs | null) => setBookDate(value)} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-gray-500 text-xs tracking-widest uppercase">Number of Guests</label>
                            <input
                                type="number"
                                value={guests}
                                onChange={(e) => setGuests(e.target.value)}
                                className="bg-[#1a1a1a] border border-gray-700 text-white text-sm px-4 py-2.5 outline-none focus:border-yellow-500 transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-gray-500 text-xs tracking-widest uppercase">Event Type</label>
                            <input
                                type="text"
                                value={eventType}
                                onChange={(e) => setEventType(e.target.value)}
                                placeholder="e.g. Wedding, Corporate Event"
                                className="bg-[#1a1a1a] border border-gray-700 text-white text-sm px-4 py-2.5 outline-none focus:border-yellow-500 transition placeholder:text-gray-600"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-gray-500 text-xs tracking-widest uppercase">Special Requirements</label>
                            <textarea
                                value={specialReq}
                                onChange={(e) => setSpecialReq(e.target.value)}
                                placeholder="Any special requests or requirements..."
                                rows={3}
                                className="bg-[#1a1a1a] border border-gray-700 text-white text-sm px-4 py-2.5 outline-none focus:border-yellow-500 transition placeholder:text-gray-600 resize-none"
                            />
                        </div>

                        <button
                            onClick={handleBooking}
                            className="w-full py-3 bg-yellow-500 text-black text-sm font-semibold
                                       tracking-widest uppercase hover:bg-yellow-400
                                       transition-all duration-200 mt-2"
                        >
                            Confirm Reservation
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}