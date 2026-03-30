import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://agentget.sh'),
  title: {
    default: 'agentget — The AI Agents Package Manager',
    template: '%s | agentget',
  },
  description:
    'Discover, install, and manage AI agents, skills, and instructions from GitHub. The open-source package manager for AI coding agents — supports 41+ tools.',
  keywords: [
    'ai agent',
    'ai agents',
    'agent management',
    'ai agent package manager',
    'install ai agents',
    'ai agent directory',
    'ai agent marketplace',
    'manage ai agents',
    'ai coding agents',
    'agent skills',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://agentget.sh',
    siteName: 'agentget',
    title: 'agentget — The AI Agents Package Manager',
    description: 'Discover, install, and manage AI agents from GitHub with a single command.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'agentget — The AI Agents Package Manager',
    description: 'Discover, install, and manage AI agents from GitHub with a single command.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
