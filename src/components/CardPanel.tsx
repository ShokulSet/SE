"use client";
import React, { useReducer } from 'react';
import Card from './Card';

const venuesData = [
  { vid: "001", name: "The Bloom Pavilion", img: "/img/bloom.jpg" },
  { vid: "002", name: "Spark Space", img: "/img/sparkspace.jpg" },
  { vid: "003", name: "The Grand Table", img: "/img/grandtable.jpg" },
];

const initialRatings = {
  "001": 0,
  "002": 0,
  "003": 0,
};

function ratingReducer(state: any, action: { type: string, venueName: string, rating?: number | null }) {
  // เปลี่ยน action.venueName เป็น action.vid ให้สื่อความหมายตรงกัน
  switch (action.type) {
    case 'UPDATE_RATING':
      return { ...state, [action.venueName]: action.rating };
    case 'REMOVE_VENUE':
      const newState = { ...state };
      delete newState[action.venueName];
      return newState;
    default:
      return state;
  }
}

export default function CardPanel() {
  const [ratings, dispatch] = useReducer(ratingReducer, initialRatings);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 justify-items-center">
        {venuesData.map((venue) => (
          <Card 
            key={venue.vid} // ใช้ vid เป็น key
            venueName={venue.name} 
            imgSrc={venue.img} 
            rating={ratings[venue.vid]} // ดึง rating จาก vid
            dispatch={dispatch}
            vid={venue.vid} // ส่ง vid เข้าไปใน Card
          />
        ))}
      </div>

      {/* ในส่วนล่าง ให้ map ข้อมูลจาก venuesData เพื่อแสดงชื่อให้ตรงกับ vid */}
      <div className="mt-10 p-5 border-t">
        {venuesData.map((venue) => (
          <div 
            key={venue.vid}
            onClick={() => dispatch({ type: 'REMOVE_VENUE', venueName: venue.vid })}
            className="cursor-pointer"
          >
            {venue.name} Rating : {ratings[venue.vid]}
          </div>
        ))}
      </div>
    </div>
  );
}