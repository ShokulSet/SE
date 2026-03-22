"use client";
import InteractiveCard from './InteractiveCard';
import { Rating, Box, Button } from '@mui/material'; // เพิ่ม Button
import Link from 'next/link';

// 1. กำหนด Interface พร้อม prop onCompare ที่เป็น Optional (?)
interface CardProps {
  venueName: string;
  imgSrc: string;
  vid: string;
  rating?: number | null;
  dispatch?: Function;
  onCompare?: (venueName: string) => void; // เพิ่ม prop สำหรับปุ่ม Compare
}

export default function Card({ venueName, imgSrc, rating, dispatch, vid, onCompare }: CardProps) {
  return (
    <InteractiveCard>
      <Link href={`/venue/${vid}`} className="block">
        <div className="relative w-full h-48">
          <img src={imgSrc} alt={venueName} className="w-full h-full object-cover" />
        </div>
        <div className="p-5 text-black">
          <h2 className="text-xl font-bold">{venueName}</h2>
        </div>
      </Link>

      <div className="px-5 pb-5">
        {/* ส่วนที่ 1: แสดง Rating เฉพาะเมื่อมี rating และ dispatch */}
        {
          (rating !== undefined && dispatch !== undefined) && (
            <Box sx={{ mt: 2 }} data-testid={`${venueName} Rating`}>
              <Rating
                id={`${venueName} Rating`}
                name={`${venueName} Rating`}
                value={rating}
                onChange={(event, newValue) => {
                  dispatch({ 
                    type: 'UPDATE_RATING', 
                    venueName: vid, 
                    rating: newValue 
                  });
                }}
              />
            </Box>
          )
        }
        {
          onCompare && (
            <Button 
              variant="contained" 
              className="mt-3 w-full bg-blue-600 hover:bg-blue-800 text-white"
              onClick={(e) => {
                e.stopPropagation(); // กันไม่ให้ Link ทำงาน
                e.preventDefault();
                onCompare(venueName); // เรียกฟังก์ชันที่ส่งมา
              }}
            >
              Compare
            </Button>
          )
        }
      </div>
    </InteractiveCard>
  );
}