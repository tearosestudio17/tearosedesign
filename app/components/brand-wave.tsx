import Image from "next/image";
import { brandMarks } from "@/lib/brand-marks";
import styles from "./brand-wave.module.css";

export function BrandWave() {
  return <section id="brand-worlds" className={styles.section} aria-labelledby="brand-wave-heading">
    <div className={styles.top}><span>Selected identities</span><span>Tea Rose Design Studio</span></div>
    <h2 id="brand-wave-heading" className={styles.heading}>Brand <em>worlds.</em></h2>
    <div className={styles.viewport}>
      <div className={styles.track}>
        {[false, true].map(duplicate => <ul key={String(duplicate)} className={styles.group} aria-hidden={duplicate || undefined}>
          {brandMarks.map((brand, index) => <li key={brand.slug} className={styles.mark} style={{ animationDelay: `${(-index * 10 / 3).toFixed(3)}s` }}>
            <div className={styles.card}><Image src={`/brands/${brand.slug}.webp`} alt={duplicate ? "" : `${brand.name} logo`} width={480} height={320} sizes="(max-width: 600px) 136px, 190px" /></div>
          </li>)}
        </ul>)}
      </div>
    </div>
  </section>;
}
