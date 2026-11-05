import { About } from '@/components/About';
import { Faq } from '@/components/Faq';
import { FinalCta } from '@/components/FinalCta';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { Pilha } from '@/components/Pilha';
import { Services } from '@/components/Services';
import styles from './page.module.css';

export default function Home() {
  return (
    <>
      <Header />
      <main id="inicio" className={styles.principal}>
        <Hero />
        <Services />
        <About />
        <HowItWorks />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <Pilha />
    </>
  );
}
