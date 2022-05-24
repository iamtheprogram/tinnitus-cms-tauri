import React, { useEffect } from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import logoIcon from '@src/icons/logo.png';
import { Icons } from '@utils/icons';
import { getAuth } from 'firebase/auth';
import { app } from '@src/config/firebase';
import { CombinedStates } from '@store/reducers/custom';
import { useSelector } from 'react-redux';
import { routes } from '@src/router/routes';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const auth = useSelector<CombinedStates>((state) => state.generalReducer.auth) as any;

    useEffect(() => {
        if (auth) {
            //Continue in page
        } else {
            navigate('/login');
        }
    }, [getAuth(app).currentUser]);

    function goToRoute(route: string): void {
        navigate(route);
    }

    return (
        <div className="Stack">
            <div className="header-div">
                <img src={logoIcon} alt="logo" />
                <h2>Content Management System</h2>
            </div>
            <div className={'GridActions GridMove'}>
                <ButtonGroup vertical className="ButtonGroup">
                    <Button
                        className="GridButton GridButtonText"
                        onClick={(): void =>
                            goToRoute(routes.ALBUM_VIEW.slice(0, routes.ALBUM_VIEW.lastIndexOf(':')) + '0')
                        }
                    >
                        <img src={Icons['AudioIcon']} className="ButtonIcon" />
                        Albums
                    </Button>
                    <Button
                        // eslint-disable-next-line max-len
                        className="GridButton GridButtonText" /**onClick={(): void => goToRoute(routes.GENERATOR_VIEW)}**/
                    >
                        <img src={Icons['GeneratorIcon']} className="ButtonIcon" />
                        Generator
                    </Button>
                    <Button className="GridButton GridButtonText">
                        <img src={Icons['StatisticsIcon']} className="ButtonIcon" />
                        Statistics and reports
                    </Button>
                    <Button
                        className="GridButton GridButtonText"
                        onClick={(): Window => window.open('https://www.youtube.com/c/TinnitusSounds')!}
                    >
                        <img src={Icons['ChannelIcon']} className="ButtonIcon" />
                        YouTube channel
                    </Button>
                    <Button
                        className="GridButton GridButtonText"
                        onClick={(): Window => window.open('https://earsbuzzing.com/')!}
                    >
                        <img src={Icons['EarsbuzzingSite']} className="ButtonIcon" />
                        Ears Buzzing site
                    </Button>
                    <Button className="GridButton GridButtonText">
                        <img src={Icons['Tutorial']} className="ButtonIcon" />
                        Tutorial
                    </Button>
                </ButtonGroup>
            </div>

            <p
                style={{
                    position: 'absolute',
                    bottom: '1px',
                }}
            >
                Copyright © 2022 Tinnitus Sounds
            </p>
        </div>
    );
};

export default Home;
