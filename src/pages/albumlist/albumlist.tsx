import { getAuth } from 'firebase/auth';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CombinedStates } from '@store/reducers/custom';
import { app } from '@config/firebase';
import { useLoading } from '@pages/loading/loading';
import { dialog } from '@tauri-apps/api';
import SearchBar from '@components/searchbar/searchbar';
import Sidebar from '@components/sidebar/sidebar';
import { AlbumInfo } from '@src/types/album';
import { getAlbums } from '@services/album-services';
import { Container } from 'react-bootstrap';

const AlbumList: React.FC = () => {
    const auth = useSelector<CombinedStates>((state) => state.generalReducer.auth) as any;
    const navigate = useNavigate();
    const { appendLoading, removeLoading } = useLoading();
    const searchbarRef = useRef<any>(null);
    const [albums, setAlbums] = React.useState<AlbumInfo[]>([]);

    useEffect(() => {
        if (auth) {
            fetchAlbums();
        } else {
            navigate('/login');
        }
    }, [getAuth(app).currentUser]);

    async function fetchAlbums(): Promise<void> {
        //Fetch all albums
        try {
            appendLoading();
            const albums = await getAlbums();
            albums.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
            setAlbums(albums);
            //Loading is done
            removeLoading();
        } catch (error: any) {
            removeLoading();
            dialog.message(error.message);
        }
    }

    function displayAlbums(): JSX.Element {
        if (albums.length === 0) {
            return (
                <Container>
                    <div className="section-album-content">
                        <p>No album data</p>
                    </div>
                </Container>
            );
        } else {
            return (
                <Container>
                    <div className="section-album-content">
                        <ul>
                            {albums.map((album: AlbumInfo) => (
                                <li key={album.id}>
                                    <a href={`/album/${album.id}`}>{album.name}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Container>
            );
        }
    }

    return (
        <div className="page">
            <Sidebar />
            <div className="section-album">
                <div className="SearchBarDiv">
                    <SearchBar type="album" ref={searchbarRef} />
                </div>
                {displayAlbums()}
            </div>
        </div>
    );
};

const AlbumsTable: React.FC = () => {
    return <div></div>;
};

export default AlbumList;
