"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { removeBooking, editBooking } from "@/redux/features/bookSlice";
import { BookingItem } from "@/../interface";
import { Calendar, User, Phone, Trash2, Pencil, Check, X } from "lucide-react";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import DateReserve from "@/components/DateReserve";

export default function BookingList() {
    const dispatch = useDispatch<AppDispatch>();
    const bookItems = useSelector((state: RootState) => state.bookSlice.bookItems);

    // track ว่า item ไหนกำลัง edit อยู่
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<BookingItem & { bookDateDayjs: Dayjs | null }>({
        nameLastname: "",
        tel: "",
        venue: "",
        bookDate: "",
        bookDateDayjs: null,
    });

    const startEdit = (item: BookingItem, index: number) => {
        setEditingIndex(index);
        setEditForm({
            ...item,
            bookDateDayjs: dayjs(item.bookDate),
        });
    };

    const cancelEdit = () => {
        setEditingIndex(null);
    };

    const saveEdit = (original: BookingItem) => {
        if (!editForm.nameLastname || !editForm.tel || !editForm.venue || !editForm.bookDateDayjs) {
            alert("Please fill in all fields");
            return;
        }
        const updated: BookingItem = {
            nameLastname: editForm.nameLastname,
            tel: editForm.tel,
            venue: editForm.venue,
            bookDate: dayjs(editForm.bookDateDayjs).format("YYYY/MM/DD"),
        };
        dispatch(editBooking({ original, updated }));
        setEditingIndex(null);
    };

    if (bookItems.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-600 text-sm tracking-widest uppercase">No Venue Booking</p>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-3">
            {bookItems.map((item: BookingItem, index: number) => (
                <div
                    key={`${item.venue}-${item.bookDate}-${index}`}
                    className="bg-[#111] border border-yellow-600/20 p-6"
                >
                    {editingIndex === index ? (
                        /* ── Edit Mode ── */
                        <div className="flex flex-col gap-4">
                            <h3 className="text-yellow-500 text-sm tracking-widest uppercase mb-1">
                                Editing Reservation
                            </h3>

                            {/* Venue */}
                            <div className="flex flex-col gap-1">
                                <label className="text-gray-500 text-xs tracking-widest uppercase">Venue</label>
                                <select
                                    value={editForm.venue}
                                    onChange={(e) => setEditForm({ ...editForm, venue: e.target.value })}
                                    className="bg-[#1a1a1a] border border-gray-700 text-white text-sm px-4 py-2.5 outline-none focus:border-yellow-500 transition"
                                >
                                    <option value="" disabled>Select Venue</option>
                                    <option value="Bloom">The Bloom Pavilion</option>
                                    <option value="Spark">Spark Space</option>
                                    <option value="GrandTable">The Grand Table</option>
                                </select>
                            </div>

                            {/* Date */}
                            <div className="flex flex-col gap-1">
                                <label className="text-gray-500 text-xs tracking-widest uppercase">Date</label>
                                <div className="bg-[#1a1a1a] border border-gray-700 p-3">
                                    <DateReserve
                                        onDateChange={(value: Dayjs | null) =>
                                            setEditForm({ ...editForm, bookDateDayjs: value })
                                        }
                                    />
                                </div>
                            </div>

                            {/* Name */}
                            <div className="flex flex-col gap-1">
                                <label className="text-gray-500 text-xs tracking-widest uppercase">Name - Lastname</label>
                                <input
                                    type="text"
                                    value={editForm.nameLastname}
                                    onChange={(e) => setEditForm({ ...editForm, nameLastname: e.target.value })}
                                    className="bg-[#1a1a1a] border border-gray-700 text-white text-sm px-4 py-2.5 outline-none focus:border-yellow-500 transition"
                                />
                            </div>

                            {/* Tel */}
                            <div className="flex flex-col gap-1">
                                <label className="text-gray-500 text-xs tracking-widest uppercase">Contact Number</label>
                                <input
                                    type="text"
                                    value={editForm.tel}
                                    onChange={(e) => setEditForm({ ...editForm, tel: e.target.value })}
                                    className="bg-[#1a1a1a] border border-gray-700 text-white text-sm px-4 py-2.5 outline-none focus:border-yellow-500 transition"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 justify-end mt-2">
                                <button
                                    onClick={cancelEdit}
                                    className="flex items-center gap-1.5 px-4 py-2 border border-gray-600 text-gray-400 hover:border-gray-400 hover:text-white text-xs tracking-widest uppercase transition"
                                >
                                    <X size={13} /> Cancel
                                </button>
                                <button
                                    onClick={() => saveEdit(item)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-yellow-500 text-black hover:bg-yellow-400 text-xs tracking-widest uppercase font-semibold transition"
                                >
                                    <Check size={13} /> Save
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* ── View Mode ── */
                        <div className="flex justify-between items-center">
                            {/* ซ้าย */}
                            <div className="flex flex-col gap-2">
                                <h3 className="text-yellow-500 text-lg">{item.venue}</h3>
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                                        <Calendar size={12} className="text-yellow-600/60" />
                                        {item.bookDate}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                                        <User size={12} className="text-yellow-600/60" />
                                        {item.nameLastname}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                                        <Phone size={12} className="text-yellow-600/60" />
                                        {item.tel}
                                    </div>
                                </div>
                            </div>

                            {/* ขวา */}
                            <div className="flex items-center gap-2">
                                <span className="text-yellow-600/60 text-xs tracking-widest uppercase border border-yellow-600/20 px-3 py-1">
                                    Upcoming
                                </span>
                                <button
                                    onClick={() => startEdit(item, index)}
                                    className="p-2 border border-yellow-600/30 text-yellow-600/60 hover:border-yellow-500 hover:text-yellow-500 transition"
                                >
                                    <Pencil size={14} />
                                </button>
                                <button
                                    onClick={() => dispatch(removeBooking(item))}
                                    className="p-2 border border-red-900/40 text-red-700/60 hover:border-red-500 hover:text-red-500 transition"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}