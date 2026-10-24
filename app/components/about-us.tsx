import styles from "./about-us.module.css";
import { AnimatedHeading, AnimatedReveal } from "./animated-heading";

export default function AboutUs() {
  return (
    <div className={`about-content ${styles.content}`}>
      <div className={styles.heading}>
        <p className="st-label">01 / The studio</p>
        <p className="st-label">India & beyond</p>
      </div>
      <div className={styles.layout}>
        <div className={styles.copy}>
          <AnimatedHeading
            className={styles.title}
            lines={[
              { text: "A creative agency." },
              { text: "Brewed on" },
              { text: "strategy.", accentWords: ["strategy."] },
            ]}
          />
          <AnimatedReveal delay={0.22}>
            <p className={styles.intro}>
              We’re <span>Tea Rose Design Studio.</span> We mix research, design and
              marketing to help brands look sharper, sound clearer and grow faster.
            </p>
            <p className={styles.story}>
              We believe tea solves everything. A good conversation leads to a good
              idea, and a good idea leads to design that works.
            </p>
            <p className={styles.signoff}>Good conversations. Great brands.</p>
          </AnimatedReveal>
        </div>
        <div className={styles.visual} data-particle-art="0" aria-hidden="true" />
      </div>
      <div className={styles.footer}>
        <p>One team. From first thought to launch day.</p>
        <span className="st-label">Keep brewing</span>
      </div>
    </div>
  );
}
