import React from 'react';
import styles from './Drawer.module.css';

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
        <div className={styles['drawer-overlay']} onClick={onClose}>
            <div className={styles['drawer']} onClick={(e) => e.stopPropagation()}>
            <button 
                    className={styles['drawer-close']}
                    onClick={onClose}
                    aria-label="Close drawer"
                >
                    ×
                </button>
                <div className={styles['drawer-content']}>
                    {children}
                </div>
            </div>

        </div>
    )
};

export default Drawer;