"use client"; // 1. ปรับให้เป็น Client Component

import { useState } from 'react';
import { TextField, MenuItem, Button, Select, FormGroup } from '@mui/material';
import DateReserve from '@/components/DateReserve'; 
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { addBooking } from '@/redux/features/bookSlice';
import { BookingItem } from '@/../interface'; // มั่นใจว่า path ถูกต้องและใส่ export ใน interface แล้ว
import dayjs, { Dayjs } from 'dayjs';

// 2. ไม่เป็น async component ตามโจทย์
export default function BookingPage() {

    const dispatch = useDispatch<AppDispatch>();

    // สร้าง State สำหรับเก็บค่าจากฟอร์ม (เพราะเป็น Client Component แล้ว)
    const [name, setName] = useState("");
    const [tel, setTel] = useState("");
    const [venue, setVenue] = useState("");
    const [bookDate, setBookDate] = useState<Dayjs | null>(null);

    // ฟังก์ชันทำงานเมื่อกดปุ่ม Book Venue
    const handleBooking = () => {
        if (name && tel && venue && bookDate) {
            // สร้าง Object สำหรับการจอง
            const item: BookingItem = {
                nameLastname: name,
                tel: tel,
                venue: venue,
                bookDate: dayjs(bookDate).format("YYYY/MM/DD")
            };
            
            // ส่งข้อมูลไปเก็บไว้ใน Redux Store
            dispatch(addBooking(item));
            alert("Booking Saved to Redux Store!");
        } else {
            alert("Please fill in all fields");
        }
    };

    return (
        <main className="p-15 w-[100%] flex flex-col items-center">
            {/* ลบส่วนแสดงข้อมูล User Profile ออกตามโจทย์ */}

            <h1 className="text-4xl font-bold mt-20 mb-10">Booking Venue</h1>
            
            <FormGroup className="space-y-4 w-1/2">
                <TextField 
                    name="Name-Lastname" 
                    label="Name-Lastname" 
                    variant="standard" 
                    fullWidth 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                
                <TextField 
                    name="Contact-Number" 
                    label="Contact-Number" 
                    variant="standard" 
                    fullWidth 
                    value={tel}
                    onChange={(e) => setTel(e.target.value)}
                />

                <Select 
                    variant='standard' 
                    id='venue' 
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    fullWidth
                    displayEmpty
                >
                    <MenuItem value="" disabled>Select Venue</MenuItem>
                    <MenuItem value="Bloom">The Bloom Pavilion</MenuItem>
                    <MenuItem value="Spark">Spark Space</MenuItem>
                    <MenuItem value="GrandTable">The Grand Table</MenuItem>
                </Select>

                {/* ส่ง function ไปรับค่าวันที่จาก DateReserve */}
                <DateReserve onDateChange={(value: Dayjs | null) => setBookDate(value)} />

                <Button 
                    variant="contained" 
                    name="Book Venue" 
                    className="mt-5 bg-blue-600"
                    onClick={handleBooking} // เมื่อกดปุ่มให้รันฟังก์ชันเก็บข้อมูล
                >
                    Book Venue
                </Button>
            </FormGroup>
        </main>
    );
}