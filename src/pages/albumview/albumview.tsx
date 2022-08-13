import React, { createRef, useEffect, useRef, useState } from 'react';
import { Container } from 'react-bootstrap';
import SearchBar from '@src/components/searchbar/searchbar';
import Toolbar from '@src/components/toolbar/toolbar';
import { useSelector } from 'react-redux';
import { CombinedStates } from '@src/store/reducers/custom';
import Sidebar from '@components/sidebar/sidebar';
import { useNavigate, useParams } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { app, db } from '@config/firebase';
import Artwork from '@components/artwork/artwork';
import AlbumInfoView from '@components/albuminfo/albuminfo';
import '@components/modal-search/modal-search.css';
import { SongData } from '@src/types/album';
import { Table } from '@components/table/table';
import { Icons } from '@src/utils/icons';
import { doc, getDoc, collection } from 'firebase/firestore';
import Player from '@components/player/player';
import { useLoading } from '@pages/loading/loading';
import { createObjectStoragePath } from '@src/utils/helpers';
import { dialog } from '@tauri-apps/api';
import { routes } from '@src/router/routes';

const AlbumView: React.FC = () => {
    const { appendLoading, removeLoading } = useLoading();
    const { id } = useParams<{ id: string }>();
    const [albumData, setAlbumData] = useState<any>(null);
    const [dataFetched, setDataFetched] = useState(false);
    const auth = useSelector<CombinedStates>((state) => state.generalReducer.auth) as any;
    const navigate = useNavigate();
    const searchbarRef = createRef<any>();
    const playerRef = createRef<any>();
    const container = useRef(null);
    const preauthreq = useSelector<CombinedStates>((state) => state.ociReducer.config.prereq) as string;

    useEffect(() => {
        if (auth) {
            if (id !== '0') {
                setDataFetched(false);
                //Load data for selected album
                fetchAlbumData(id as string);
            }
        } else {
            navigate('/login');
        }
    }, [getAuth(app).currentUser, id]);

    useEffect(() => {
        if (dataFetched) {
            getSongUrl(albumData.songs[0]);
        }
    }, [dataFetched]);

    async function fetchAlbumData(id: string): Promise<void> {
        try {
            appendLoading();
            //Fetch all album data
            const docRef = doc(collection(db, 'albums'), id);
            const docRes = await getDoc(docRef);
            const data = docRes.data()!;
            data.artwork = createObjectStoragePath(preauthreq, ['albums', id, `artwork.jpeg`]);
            data.upload_date = data.upload_date.toDate().toDateString();
            setAlbumData(data);
            //Loading is done
            setDataFetched(true);
            removeLoading();
        } catch (error) {
            //! Undefined behaviour on error handling
        }
    }

    async function getSongUrl(song: SongData): Promise<void> {
        try {
            playerRef.current.setSong(createObjectStoragePath(preauthreq, ['albums', id!, `${song.name}.wav`]));
        } catch (error) {
            dialog.message('Error fetching audio file');
        }
    }

    function displayPage(): JSX.Element {
        if (dataFetched && albumData !== undefined) {
            return (
                <div className="page" id="page-album-view">
                    <Sidebar />
                    <div className="page-content" ref={container}>
                        <h2 className="page-title">Album information</h2>
                        <div className="SearchBarDiv">
                            <SearchBar type="album" pathToSearch="albums" navigate="/album/view/" ref={searchbarRef} />
                        </div>
                        <Container>
                            <Toolbar
                                itemId={id as string}
                                upload={routes.ALBUM_CREATE}
                                edit={`/album/edit/${id}`}
                                reviews={`/album/reviews/${id}`}
                                categories={routes.ALBUM_CATEGORIES}
                                return={routes.SAMPLE_LIST}
                                delete="album"
                            />
                            <div className="section-album-content">
                                <div>
                                    <Artwork type="view" img={albumData.artwork} />
                                    <Player ref={playerRef} />
                                </div>
                                <AlbumInfoView data={albumData} />
                            </div>
                            <Table
                                type="view"
                                headers={[
                                    'Position',
                                    'Name',
                                    'Length',
                                    'Category',
                                    <img src={Icons.Views} />,
                                    <img src={Icons.Likes} />,
                                    <img src={Icons.Favorites} />,
                                ]}
                                data={albumData.songs}
                                onRowSelected={getSongUrl}
                            />
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

export default AlbumView;
