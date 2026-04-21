import { appName } from '@/lib/shared';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { Metadata } from 'next';
import { Geist_Mono, Manrope } from 'next/font/google';
import './global.css';

export const metadata: Metadata = {
  title: {
    template: `%s | ${appName}`,
    default: `${appName} | The emoji toolkit for the modern web`
  },
  openGraph: {
    type: 'website',
    title: `${appName} - The emoji toolkit for the modern web`,
    description: "Emoji pickers, reactions, autocomplete and inputs. Headless primitives and styled components. Framework-agnostic core, one source of truth for emojis across your stack.",
    url: 'https://emoteer.vyers.dev',
    siteName: appName,
    images: [
      {
        url: 'https://emoteer.vyers.dev/banner-emoteer.png',
        alt: `${appName} - The emoji toolkit for the modern web`,
      },
    ],
    locale: 'en_US',
  },
}

const manrope = Manrope({
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  subsets: ['latin']
})

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${manrope.className}${geistMono.className}`} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
