import React from 'react';
import styles from './ContactCard.module.css';
import { Mail, Phone, User, Calendar } from 'lucide-react';

const Contactcard = () => {
  return (
    <div className={styles.cardWrapper}>
      <div className={styles.contactCard}>
        <h2 className={styles.header}>User  Info</h2>
        <div className={styles.infoItem}>
          <User className={styles.icon} />
          <span>Ahamed Thaiyub A</span>
        </div>
        <div className={styles.infoItem}>
          <Calendar className={styles.icon} />
          <span>Age: 21</span>
        </div>
        <div className={styles.infoItem}>
          <Phone className={styles.icon} />
          <span>890097289270</span>
        </div>
        <div className={styles.infoItem}>
          <Mail className={styles.icon} />
          <span>aha@gmail.com</span>
        </div>
      </div>
    </div>
  );
};

export default Contactcard;
