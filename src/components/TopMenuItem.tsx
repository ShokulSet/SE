import Link from 'next/link';

export default function TopMenuItem({ title, href }: { title: string, href: string }) {
    return (
        <Link href={href} className='text-gray-700 hover:text-blue-600 font-medium px-4'>
            {title}
        </Link>
    );
}
