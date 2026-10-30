import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: "LingoSphere - Ko'p Tilli Til O'rganish Platformasi",
  description: "3 ta bepul til (O'zbek, Rus, Ingliz) va 17 ta jahon tili uchun $10-$20 obunali ta'lim platformasi. 1,000+ so'zlar, Web Speech API talaffuz va dark rejim.",
  openGraph: {
    title: "LingoSphere - Ko'p Tilli Til O'rganish Platformasi",
    description: "3 ta bepul til (O'zbek, Rus, Ingliz) va 17 ta jahon tili uchun $10-$20 obunali ta'lim platformasi. 1,000+ so'zlar, Web Speech API talaffuz va dark rejim.",
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "LingoSphere - Ko'p Tilli Til O'rganish Platformasi",
    description: "3 ta bepul til (O'zbek, Rus, Ingliz) va 17 ta jahon tili uchun $10-$20 obunali ta'lim platformasi. 1,000+ so'zlar, Web Speech API talaffuz va dark rejim.",
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
