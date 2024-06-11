import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '@/lib/db';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: {
		template: '%s | Carrot Market',
		default: 'Carrot Market',
	},
	description: 'Sell and buy all the things!',
	icons: {
		icon: '/carrot.ico',
	},
};

export default function RootLayout({
	children,
	// @ts-ignore
	potato,
}: Readonly<{
	children: React.ReactNode;
}>) {
	console.log(potato);
	return (
		<html lang='en'>
			<body
				className={`${inter.className} min-h-[100vh] bg-neutral-900 text-white max-w-screen-sm mx-auto`}>
				{potato}
				{children}
			</body>
		</html>
	);
}
