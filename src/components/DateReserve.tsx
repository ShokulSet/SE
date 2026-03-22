'use client'
import { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';

// 1. สร้าง Interface กำหนด Props
interface DateReserveProps {
    onDateChange: (value: Dayjs | null) => void;
}

// 2. รับ Props เข้ามาใช้งานในฟังก์ชัน
export default function DateReserve({ onDateChange }: DateReserveProps) {
    const [reserveDate, setReserveDate] = useState<Dayjs | null>(null);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker 
                label="Select Booking Date" 
                value={reserveDate}
                onChange={(newValue) => {
                    setReserveDate(newValue); // เก็บใน Local State เพื่อโชว์บนหน้าจอ
                    onDateChange(newValue);   // ส่งค่ากลับไปที่ไฟล์แม่ (Booking Page)
                }}
                slotProps={{ textField: { fullWidth: true, variant: 'standard' } }}
            />
        </LocalizationProvider>
    );
}