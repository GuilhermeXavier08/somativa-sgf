import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 style={{ marginBottom: "1rem" }}>
          Sistema de Gestão LogiMax Transportes
        </h1>
        <p style={{ marginBottom: "2rem", fontSize: "1.2rem" }}>
          Controle sua frota, motoristas e viagens em um só lugar.
        </p>

        <div className={styles.ctas}>
          <Link
            href="/login"
            className={styles.primary}
          >
            Acessar o Sistema
          </Link>
        </div>
      </main>
    </div>
  );
}