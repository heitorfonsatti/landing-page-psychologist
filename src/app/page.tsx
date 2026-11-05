import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { Services } from '@/components/Services';
import styles from './page.module.css';

export default function Home() {
  return (
    <>
      <Header />
      <main id="inicio" className={styles.principal}>
        <Hero />
        <Services />
        <HowItWorks />
      </main>
    </>
  );
}
