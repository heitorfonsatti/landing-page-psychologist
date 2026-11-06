import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <main className={styles.page}>
      <div className="container">
        <p className={styles.code}>404</p>
        <h1>Esta página não existe</h1>
        <p className={styles.text}>
          O endereço que você abriu não está aqui. Pode ter sido um link antigo ou um erro de
          digitação.
        </p>
        <Link className={styles.back} href="/">
          Voltar para o início
        </Link>
      </div>
    </main>
  );
}
