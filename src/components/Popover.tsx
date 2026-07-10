import React, { useEffect, useRef } from 'react';
import styles from './Popover.module.css';

interface PopoverProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Popover: React.FC<PopoverProps> = ({ isOpen, onClose, children }) => {
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            // Add event listener after a small delay to avoid immediate closure
            const timeoutId = setTimeout(() => {
                document.addEventListener('mousedown', handleClickOutside);
            }, 0);

            return () => {
                clearTimeout(timeoutId);
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div 
            ref={popoverRef}
            className={styles['popover']} 
            onClick={(e) => e.stopPropagation()}
        >
            <div className={styles['popover-content']}>
                {children}
            </div>
        </div>
    );
};

export default Popover;