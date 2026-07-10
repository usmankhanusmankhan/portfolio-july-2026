import React from 'react';

import styles from './ListItem.module.css';

interface ListItemProps {
    isSelected: boolean;
    name: string;
    hasIcon: boolean;
    hasLink: boolean;
    onClick?: () => void;
}

const ListItem: React.FC<ListItemProps> = ({ isSelected, name, onClick }) => {
    if (name === 'Art & writing') {
            if (isSelected) {
                return (
                    <div 
                    className={styles['list-item-selected']}
                    onClick={onClick}
                    style={{cursor: onClick ? 'pointer' : 'default'}}
                    >
                        <div className={styles['list-item-selected-bullet']}></div>
                        {name}
                    </div>
                );
            } else {
            return (
                <div 
                    className={styles['list-item']}
                    onClick={onClick}
                    style={{cursor: onClick ? 'pointer' : 'default'}}
                >
                        <div>{name}</div>
                    </div>
                );
            }
        } else {
            return (
                <div className={styles['list-item']} 
                     onClick={onClick} 
                     style={{cursor: onClick ? 'pointer' : 'default'}}>
                    <div>{name}</div>
                </div>
            )
        }
};

export default ListItem;