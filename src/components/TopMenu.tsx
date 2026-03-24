import TopMenuItem from './TopMenuItem';
import AuthButton from './AuthButton';
import Link from 'next/link';

export default function TopMenu() {
    return (
        <div className="h-16 bg-black fixed top-0 w-full z-50 border-b border-yellow-600/40">
            <div className="max-w-7xl mx-auto h-full px-6 flex justify-between items-center">

                {/* Logo */}
                <Link href="/">
                    <div className='flex items-center gap-2'>
                        <h1 className="font-playfair text-xl font-bold tracking-widest text-yellow-500">
                            NEWWAVE
                        </h1>
                        <h3 className='text-white'>restaurant</h3>
                    </div>
                </Link>

                <div className="flex items-center gap-2">
                    <TopMenuItem title="Booking" href="/booking" />
                    <TopMenuItem title="My Booking" href="/mybooking" />
                    <AuthButton />
                </div>
            </div>
        </div>
    );
}