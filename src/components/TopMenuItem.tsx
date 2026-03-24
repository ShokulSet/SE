import Link from 'next/link';

export default function TopMenuItem({ title, href }: { title: string, href: string }) {
    return (
        <Link
            href={href}
            className="text-sm font-medium px-4 py-1.5
                       text-yellow-500 border border-yellow-500
                       hover:bg-yellow-500 hover:text-black
                       transition-all duration-200"
        >
            {title}
        </Link>
    );
}