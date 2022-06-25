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
import { Icons } from '@src/utils/icons';
import { createObjectStoragePath } from '@src/utils/helpers';

const AlbumList: React.FC = () => {
    const auth = useSelector<CombinedStates>((state) => state.generalReducer.auth) as any;
    const navigate = useNavigate();
    const { appendLoading, removeLoading } = useLoading();
    const searchbarRef = useRef<any>(null);
    const [albums, setAlbums] = React.useState<AlbumInfo[]>([]);
    const preauthreq = useSelector<CombinedStates>((state) => state.ociReducer.config.prereq) as string;

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
            //Add cover art paths
            albums.forEach((album) => {
                album.artwork = createObjectStoragePath(preauthreq, ['albums', album.id, `artwork.${album.extension}`]);
            });
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
                <div className="section-no-content">
                    <p>You have no albums uploaded. Click below to add your first album</p>
                    <button className="btn-create-album" onClick={(): void => navigate('/album/create')}>
                        Create
                    </button>
                </div>
            );
        } else {
            return (
                <div className="section-album">
                    <div className="SearchBarDiv">
                        <SearchBar type="album" pathToSearch="albums" navigate="/album/view/" ref={searchbarRef} />
                    </div>
                    <Container>
                        <div className="section-album-content">
                            <div className="albums-table">
                                <AlbumsTable albums={albums} />
                            </div>
                        </div>
                    </Container>
                </div>
            );
        }
    }

    return (
        <div className="page">
            <Sidebar />
            {displayAlbums()}
        </div>
    );
};

type AlbumTableProps = {
    albums: AlbumInfo[];
};

const AlbumsTable: React.FC<AlbumTableProps> = (props: AlbumTableProps) => {
    const navigate = useNavigate();

    function onAlbumClick(id: string): void {
        navigate(`/album/view/${id}`);
    }

    return (
        <table className="table" id="albums-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Cover</th>
                    <th>Name</th>
                    <th>Created</th>
                    <th>Songs</th>
                    <th>Duration</th>
                    <th>
                        <img src={Icons.Likes} />
                    </th>
                    <th>
                        <img src={Icons.Favorites} />
                    </th>
                    <th>
                        <img src={Icons.Reviews} />
                    </th>
                </tr>
            </thead>
            <tbody>
                {props.albums !== undefined &&
                    props.albums.map((row: AlbumInfo, i: number) => {
                        return (
                            <tr key={`${i}`} id={`${i}`} onClick={(): void => onAlbumClick(row.id)}>
                                <td>{i + 1}</td>
                                <td>
                                    <img src={row.artwork} alt="albums-cover" />
                                </td>
                                <td>
                                    <p>{row.name}</p>
                                </td>
                                <td>
                                    <p>{row.upload_date.toDate().toDateString()}</p>
                                </td>
                                <td>
                                    <p>{row.songs.length}</p>
                                </td>
                                <td>
                                    <p>{row.length}</p>
                                </td>
                                <td>
                                    <p>{row.likes}</p>
                                </td>
                                <td>
                                    <p>{row.favorites}</p>
                                </td>
                                <td>
                                    <p>{row.reviews}</p>
                                </td>
                            </tr>
                        );
                    })}
            </tbody>
        </table>
    );
};

export default AlbumList;
