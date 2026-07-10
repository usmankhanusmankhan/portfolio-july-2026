import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './bottomMenu.module.css';
import links from './links.json';
import { useProject } from '../contexts/ProjectContext';

type Link = {
    name: string;
    href: string;
    opensPopover?: boolean;
    opensDrawer?: boolean;
}

type LinksData = {
    links: Link[];
}

type BottomMenuProps = {
    fixed?: boolean;
};

const BottomMenu: React.FC<BottomMenuProps> = ({ fixed = true }) => {
    const navigate = useNavigate();
    const linksData = links as LinksData;
    const linksArray = linksData.links;
    const [openPopover, setOpenPopover] = useState<string | null>(null);

    const handleLinkClick = (e: React.MouseEvent, link: Link) => {
        if (link.name === 'Fun!') {
            // Navigate directly to projects page with "Art & writing" selected
            setSelectedProject('Art & writing');
            navigate('/projects');
        } else if (link.opensPopover) {
            setOpenPopover(openPopover === link.name ? null : link.name);
        }
    }

    const { setSelectedProject } = useProject();

    const getPopoverContent = (linkName: string) => {
        switch (linkName) {
            default:
                return null;
        }
    }

    return (
        <>
        <nav className={`${styles.navbar} ${!fixed ? styles.navbarStatic : ''}`}>
            <div className={styles['logo-container']}>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        margin: 0,
                        cursor: 'pointer'
                    }}
                >
                    <img src="/logo.svg" alt="logo" height="32px" width="32px" style={{ display: 'block' }}/>
                </button>
            </div>
            <div className={styles['menu-container']}>
                {linksArray.map((link: Link) => (
                    <div key={link.href} className={styles['link']}>
                        {link.name === 'Fun!' || link.opensPopover ? (
                            <button
                                onClick={(e) => handleLinkClick(e, link)}
                                className={styles['link-button']}
                            >
                                {link.name}
                            </button>
                        ) : (
                        <a href={link.href}>
                            {link.name}
                        </a>
                        )}
                    </div>
                ))}
            </div>
        </nav>
    </>
    );
};

export default BottomMenu;
