import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer: React.FC<{}> = () => {
    return (
        <div className={styles.footer}>
            <p style={{fontSize: 12, color: 'var(--color-text)', maxWidth: '400px'}}>BUILT WITH TYPESCRIPT, REACT, AND VITE. CURSOR WAS HELPFUL.</p>
            <p style={{fontSize: 12, color: 'var(--color-text)', maxWidth: '400px'}}>I'm Usman Khan, a product designer based in New York City with 2 years of experience.</p>
        </div>
    );
};

export default Footer;