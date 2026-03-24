"use client";
import InteractiveCard from './InteractiveCard';
import { Rating, Box, Button } from '@mui/material';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

interface CardProps {
    venueName: string;
    imgSrc: string;
    vid: string;
    address?: string;
    district?: string;
    province?: string;
    rating?: number | null;
    dispatch?: Function;
    onCompare?: (venueName: string) => void;
}

export default function Card({ venueName, imgSrc, rating, dispatch, vid, address, district, province, onCompare }: CardProps) {
    return (
        <InteractiveCard>
            <Link href={`/venue/${vid}`} className="block">
                {/* รูปภาพ */}
                <div className="relative w-full h-56 overflow-hidden">
                    <img
                        src={imgSrc}
                        alt={venueName}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                {/* ชื่อ + ที่อยู่ */}
                <div className="p-4 bg-neutral-800 border-t border-yellow-600/30">
                    <h2 className="font-playfair text-lg font-medium text-yellow-500 tracking-wide">
                        {venueName}
                    </h2>

                    {/* Address */}
                    {(address || district || province) && (
                        <div className="flex items-start gap-1.5 mt-2">
                            <MapPin size={13} className="text-yellow-600/70 mt-0.5 flex-shrink-0" />
                            <p className="text-gray-400 text-xs leading-relaxed">
                                {[address, district, province].filter(Boolean).join(", ")}
                            </p>
                        </div>
                    )}
                </div>
            </Link>

            {/* ปุ่ม */}
            <div className="px-4 pb-4 bg-neutral-800 flex flex-col gap-2">

                {/* ปุ่ม New Booking */}
                <Link href={`/booking?vid=${vid}&venue=${encodeURIComponent(venueName)}`}>
                    <button className="w-full text-sm font-medium py-1.5
                                       text-yellow-500 border border-yellow-500
                                       hover:bg-yellow-500 hover:text-black
                                       transition-all duration-200">
                        New Booking
                    </button>
                </Link>

                {rating !== undefined && dispatch !== undefined && (
                    <Box data-testid={`${venueName} Rating`}>
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
                            sx={{ color: '#D4AF37' }}
                        />
                    </Box>
                )}

                {onCompare && (
                    <Button
                        variant="outlined"
                        fullWidth
                        sx={{
                            color: '#D4AF37',
                            borderColor: '#D4AF37',
                            '&:hover': { backgroundColor: '#D4AF37', color: '#000' },
                            borderRadius: 0,
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            onCompare(venueName);
                        }}
                    >
                        Compare
                    </Button>
                )}
            </div>
        </InteractiveCard>
    );
}