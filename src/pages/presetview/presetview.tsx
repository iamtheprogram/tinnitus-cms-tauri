import React, { createRef, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { useSelector } from 'react-redux';
import { app, db } from '@config/firebase';
import { useLoading } from '@pages/loading/loading';
import { CombinedStates } from '@store/reducers/custom';
import { doc, collection, getDoc } from 'firebase/firestore';
import { createObjectStoragePath } from '@utils/helpers';
import Artwork from '@components/artwork/artwork';
import Player from '@components/player/player';
import SearchBar from '@components/searchbar/searchbar';
import Sidebar from '@components/sidebar/sidebar';
import Toolbar from '@components/toolbar/toolbar';
import { Container } from 'react-bootstrap';
import PresetInfoView from '@components/presetinfo/presetinfo';
import { routes } from '@src/router/routes';

const PresetView: React.FC = () => {
    const { appendLoading, removeLoading } = useLoading();
    const { id } = useParams<{ id: string }>();
    const [presetData, setPresetData] = useState<any>(null);
    const [dataFetched, setDataFetched] = useState(false);
    const auth = useSelector<CombinedStates>((state) => state.generalReducer.auth) as any;
    const navigate = useNavigate();
    const searchbarRef = createRef<any>();
    const playerRef = useRef<any>(null);
    const container = useRef(null);
    const preauthreq = useSelector<CombinedStates>((state) => state.ociReducer.config.prereq) as string;

    useEffect(() => {
        if (auth) {
            if (id !== '0') {
                //Load data for selected album
                fetchPresetData(id as string);
            }
        } else {
            navigate('/login');
        }
    }, [getAuth(app).currentUser, id]);

    useEffect(() => {
        if (playerRef.current && dataFetched) {
            getAudioFile(presetData.name);
        }
    });

    async function fetchPresetData(id: string): Promise<void> {
        try {
            appendLoading();
            //Fetch all preset data
            const docRef = doc(collection(db, 'presets'), id);
            const docRes = await getDoc(docRef);
            const data = docRes.data()!;
            data.artwork = createObjectStoragePath(preauthreq, ['presets', id, `preview.jpeg`]);
            data.upload_date = data.upload_date.toDate().toDateString();
            setPresetData(data);
            //Loading is done
            setDataFetched(true);
            removeLoading();
        } catch (error) {
            //! Undefined behaviour on error handling
        }
    }

    async function getAudioFile(name: string): Promise<void> {
        playerRef.current.setSong(createObjectStoragePath(preauthreq, ['presets', id!, `${name}.wav`]));
    }

    function displayPage(): JSX.Element {
        if (dataFetched && presetData !== undefined) {
            return (
                <div className="page" id="page-album-view">
                    <Sidebar />
                    <div className="page-content" ref={container}>
                        <h3 className="page-title">Preset information</h3>
                        <div className="SearchBarDiv">
                            <SearchBar
                                type="preset"
                                pathToSearch="presets"
                                navigate="/generator/preset/view/"
                                ref={searchbarRef}
                            />
                        </div>
                        <Container>
                            <Toolbar
                                itemId={id as string}
                                upload={routes.PRESET_CREATE}
                                edit={`/generator/preset/edit/${id}`}
                                reviews={`/generator/preset/reviews/${id}`}
                                categories={routes.PRESET_CATEGORIES}
                                return={routes.PRESET_LIST}
                                delete="preset"
                            />
                            <div className="section-album-content">
                                <div>
                                    <Artwork type="view" className="preset-preview-image" img={presetData.artwork} />
                                </div>
                                <div className="preset-info-player">
                                    <PresetInfoView data={presetData} />
                                    <div className="player">
                                        <Player ref={playerRef} />
                                    </div>
                                </div>
                            </div>
                        </Container>
                    </div>
                </div>
            );
        } else {
            return <div className="page"></div>;
        }
    }

    return displayPage();
};

export default PresetView;
