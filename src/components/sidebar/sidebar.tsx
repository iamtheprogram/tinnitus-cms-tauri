import React from 'react';
import { Icons } from '@src/utils/icons';
import { useNavigate } from 'react-router-dom';
import { routes } from '@src/router/routes';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();

    function toggleSubmenu(menu: string): void {
        const submenu = document.getElementById(menu);

        if (submenu) {
            if (submenu.style.display === 'flex') {
                submenu.style.display = 'none';
            } else {
                submenu.style.display = 'flex';
            }
        }
    }

    return (
        <div className="sidebar">
            <div className="sidebar-navigate">
                <img src={Icons.Previous} onClick={(): void => navigate(-1)} />
                <img src={Icons.Next} onClick={(): void => navigate(1)} />
            </div>
            <div className="sidebar-logo">
                <img src={Icons.LogoIcon} />
                <p>Tinnitus CMS Menu</p>
            </div>
            <div className="sidebar-menu-content">
                <div>
                    <div
                        className="sidebar-menu-item"
                        onClick={(): void => {
                            toggleSubmenu('sidebar-submenu-albums');
                        }}
                    >
                        <img src={Icons.AudioIcon} />
                        <p>Albums</p>
                    </div>
                    <div className="sidebar-submenu" id="sidebar-submenu-albums">
                        <ul>
                            <li>
                                <p onClick={(): void => navigate(routes.ALBUM_LIST)}>View albums</p>
                                <p onClick={(): void => navigate(routes.ALBUM_CREATE)}>Upload album</p>
                                <p onClick={(): void => navigate(routes.ALBUM_CATEGORIES)}>Categories</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div>
                    <div
                        className="sidebar-menu-item"
                        onClick={(): void => {
                            toggleSubmenu('sidebar-submenu-generator');
                        }}
                    >
                        <img src={Icons.GeneratorIcon} />
                        <p>Generator</p>
                    </div>
                    <div className="sidebar-submenu" id="sidebar-submenu-generator">
                        <ul>
                            <li>
                                <p>View samples</p>
                                <p>View presets</p>
                                <p>Upload sample</p>
                                <p>Upload preset</p>
                                <p onClick={(): void => navigate(routes.SAMPLE_CATEGORIES)}>Categories samples</p>
                                <p>Categories presets</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="sidebar-menu-item" /**onClick={(): void => navigate('/statistics')}**/>
                    <img src={Icons.StatisticsIcon} />
                    <p>Statistics and reports</p>
                </div>
                <a
                    className="sidebar-menu-item"
                    href="https://www.youtube.com/channel/UCIygYFvZg8xH3S05mS7xzNg"
                    target="_blank"
                >
                    <img src={Icons.ChannelIcon} />
                    <p style={{ color: '#00ffff' }}>YouTube channel</p>
                </a>
                <a className="sidebar-menu-item" href="https://www.earsbuzzing.com" target="_blank">
                    <img src={Icons.EarsbuzzingSite} />
                    <p style={{ color: '#00ffff' }}>Ears Buzzing site</p>
                </a>
                <div className="sidebar-menu-item" /**onClick={(): void => navigate('/tutorial')}**/>
                    <img src={Icons.Tutorial} />
                    <p>Tutorial</p>
                </div>
            </div>
            <p className="sidebar-copyright">Copyright © 2022 Tinnitus Sounds</p>
        </div>
    );
};

export default Sidebar;
