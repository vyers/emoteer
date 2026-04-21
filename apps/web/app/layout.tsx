import { appName } from '@/lib/shared';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { Metadata } from 'next';
import { Geist_Mono, Manrope } from 'next/font/google';
import './global.css';

export const metadata: Metadata = {
  title: {
    template: `%s | ${appName}`,
    default: appName
  }
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
