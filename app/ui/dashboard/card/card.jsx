import styles from "./card.module.css";

const Card = ({ count, title }) => {
  return (
    <div className={styles.container}>
      <div className={styles.texts}>
        <span className={styles.title}>{title}</span>
        <span className={styles.number}>{count}</span>
      </div>
    </div>
  );
};

export default Card;
