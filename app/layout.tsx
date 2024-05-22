import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '@/lib/db';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Carrot Market',
	description: 'Generated by create next app',
	icons: {
		icon: '/carrot.ico',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body
				className={`${inter.className} bg-neutral-800 h-screen text-white max-w-screen-sm mx-auto`}>
				{children}
			</body>
		</html>
	);
}
