'use client'
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

interface DateReserveProps {
    onDateChange: (value: Dayjs | null) => void;
}

export default function DateReserve({ onDateChange }: DateReserveProps) {
    const today = dayjs().format('YYYY-MM-DD');

    return (
        <input
            type="date"
            min={today}
            onChange={(e) => {
                const val = e.target.value;
                onDateChange(val ? dayjs(val) : null);
            }}
            className="w-full bg-transparent text-white text-sm outline-none [color-scheme:dark] cursor-pointer"
        />
    );
}
