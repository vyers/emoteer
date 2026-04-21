import { Bento } from './_components/bento';
import { CodeExample } from './_components/code-example';
import { CTA } from './_components/cta';
import { Faq } from './_components/faq';
import { Footer } from './_components/footer';
import { Hero } from './_components/hero';
import { Principles } from './_components/principles';
import { Stats } from './_components/stats';
import { ThemingShowcase } from './_components/theming-showcase';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <Stats />
      <Principles />
      <Bento />
      <ThemingShowcase />
      <CodeExample />
      <Faq />
      <CTA />
      <Footer />
    </main>
  );
}
