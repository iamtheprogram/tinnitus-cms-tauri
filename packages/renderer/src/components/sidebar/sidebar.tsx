import React from 'react';
import { Icons } from '@src/utils/icons';
import { useNavigate } from 'react-router-dom';
import { routes } from '@src/router/routes';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <img src={Icons.LogoIcon} />
                <p>Tinnitus CMS Menu</p>
            </div>
            <div className="sidebar-menu-content">
                <div
                    className="sidebar-menu-item"
                    onClick={(): void => navigate(routes.ALBUM_VIEW.slice(0, routes.ALBUM_VIEW.lastIndexOf(':')) + '0')}
                >
                    <img src={Icons.AudioIcon} />
                    <p>Albums</p>
                </div>
                <div className="sidebar-menu-item" /**onClick={(): void => navigate(routes.GENERATOR_VIEW)}**/>
                    <img src={Icons.GeneratorIcon} />
                    <p>Generator</p>
                </div>
                <div className="sidebar-menu-item" /**onClick={(): void => navigate('/statistics')}**/>
                    <img src={Icons.StatisticsIcon} />
                    <p>Statistics and reports</p>
                </div>
                <div
                    className="sidebar-menu-item"
                    onClick={(): Window => window.open('https://www.youtube.com/channel/UCIygYFvZg8xH3S05mS7xzNg')!}
                >
                    <img src={Icons.ChannelIcon} />
                    <p>YouTube channel</p>
                </div>
                <div className="sidebar-menu-item" onClick={(): Window => window.open('https://www.earsbuzzing.com')!}>
                    <img src={Icons.EarsbuzzingSite} />
                    <p>Ears Buzzing site</p>
                </div>
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
