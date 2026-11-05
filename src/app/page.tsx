import { Header } from '@/components/Header';
import styles from './page.module.css';

export default function Home() {
  return (
    <>
      <Header />
      <main id="inicio" className={styles.principal} />
    </>
  );
}
