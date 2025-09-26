import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({ subsets: ['latin'] });
const geistMono = Geist_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bryo-Comté',
  description: 'Atlas et outil d’identification des bryophytes – Forêt de la Comté',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      {/* on utilise les deux fonts pour éviter les warnings */}
      <body className={`${geistSans.className} ${geistMono.className} antialiased`}>
        <header style={{ padding: 12, borderBottom: '1px solid #eee' }}>
          <nav style={{ display: 'flex', gap: 16 }}>
            <Link href="/">Accueil</Link>
            <Link href="/taxa">Taxons</Link>
            <Link href="/identify">Identifier</Link>
            <Link href="/matrix">Matrix</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
