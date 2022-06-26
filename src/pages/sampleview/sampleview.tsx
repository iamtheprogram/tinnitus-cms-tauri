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
import SampleInfoView from '@components/sampleinfo/sampleinfo';

const SampleView: React.FC = () => {
    const { appendLoading, removeLoading } = useLoading();
    const { id } = useParams<{ id: string }>();
    const [sampleData, setSampleData] = useState<any>(null);
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
                fetchSampleData(id as string);
            }
        } else {
            navigate('/login');
        }
    }, [getAuth(app).currentUser, id]);

    useEffect(() => {
        if (playerRef.current && dataFetched) {
            getAudioFile(sampleData.name);
        }
    });

    async function fetchSampleData(id: string): Promise<void> {
        try {
            appendLoading();
            //Fetch all sample data
            const docRef = doc(collection(db, 'samples'), id);
            const docRes = await getDoc(docRef);
            const data = docRes.data()!;
            data.artwork = createObjectStoragePath(preauthreq, ['samples', id, `preview.jpeg`]);
            data.upload_date = data.upload_date.toDate().toDateString();
            setSampleData(data);
            //Loading is done
            setDataFetched(true);
            removeLoading();
        } catch (error) {
            //! Undefined behaviour on error handling
        }
    }

    async function getAudioFile(name: string): Promise<void> {
        playerRef.current.setSong(createObjectStoragePath(preauthreq, ['samples', id!, `${name}.wav`]));
    }

    function displayPage(): JSX.Element {
        if (dataFetched && sampleData !== undefined) {
            return (
                <div className="page" id="page-album-view">
                    <Sidebar />
                    <div className="page-content" ref={container}>
                        <h3 className="page-title">Sample information</h3>
                        <div className="SearchBarDiv">
                            <SearchBar
                                type="sample"
                                pathToSearch="samples"
                                navigate="/generator/sample/view/"
                                ref={searchbarRef}
                            />
                        </div>
                        <Container>
                            <Toolbar itemId={id as string} item={sampleData} />
                            <div className="section-album-content">
                                <div>
                                    <Artwork type="view" className="sample-preview-image" img={sampleData.artwork} />
                                </div>
                                <div className="sample-info-player">
                                    <SampleInfoView data={sampleData} />
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

export default SampleView;
