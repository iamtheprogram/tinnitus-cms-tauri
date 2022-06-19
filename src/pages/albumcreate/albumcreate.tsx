import React, { useRef, useEffect, createRef } from 'react';
import Sidebar from '@components/sidebar/sidebar';
import { Table } from '@components/table/table';
import { useNavigate } from 'react-router-dom';
import { db, app } from '@config/firebase';
import { collection, doc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { CombinedStates } from '@src/store/reducers/custom';
import { getAuth } from 'firebase/auth';
import ProgressbarUpload from '@components/progressbar/progressbar-upload';
import AlbumForm from '@src/components/albumform/albumform';
import Artwork from '@components/artwork/artwork';
import { deleteAlbum, uploadAlbumInfo } from '@src/services/album-services';
import axios from 'axios';
import { SongData } from '@src/types/album';
import { invoke } from '@tauri-apps/api';
import { createObjectStoragePath } from '@src/utils/helpers';
import { Category } from '@src/types/general';
import { routes } from '@src/router/routes';

const AlbumCreate: React.FC = () => {
    const navigate = useNavigate();
    const preauthreq = useSelector<CombinedStates>((state) => state.ociReducer.config.prereq) as string;
    const categories = useSelector<CombinedStates>((state) => state.albumReducer.categories) as Category[];
    const auth = useSelector<CombinedStates>((state) => state.generalReducer.auth) as any;
    const filesUploaded = useRef<any>([]);
    const tableRef = createRef<any>();
    const formRef = createRef<any>();
    const artworkRef = createRef<any>();
    const progressbarRef = createRef<any>();
    const cancelSource = useRef(axios.CancelToken.source());
    const content = useRef(null);

    useEffect(() => {
        if (auth) {
            //Done loading
        } else {
            navigate('/');
        }
    }, [getAuth(app).currentUser]);

    function calculateDuration(songs: Array<string>): void {
        formRef.current.setTotalDuration(songs);
    }

    function onUploadCancelled(): void {
        cancelSource.current.cancel('User cancelled upload');
    }

    function clearChildrenStates(): void {
        formRef.current.clearInternalStates();
        tableRef.current.clearInternalStates();
        artworkRef.current.clearInternalStates();
    }

    function updateProgress(progress: number, type: string, message: string): void {
        progressbarRef.current.setProgress(progress);
        progressbarRef.current.logMessage(type, message);
    }

    async function onUpload(): Promise<void> {
        //Verify if all inputs are valid
        const formValidation = await formRef.current.getInputValidation();
        const artworkValidation = await artworkRef.current.getInputValidation();
        const tableValidation = await tableRef.current.getInputValidation();
        if (formValidation && artworkValidation && tableValidation) {
            //Reset list of uploaded files
            filesUploaded.current = [];
            const docRef = doc(collection(db, 'albums'));

            try {
                let progress = 10;
                //Iniitialize progress bar and start uploading
                progressbarRef.current.enable(true);
                updateProgress(progress, 'info', 'Uploading album...');
                //Upload album songs to OCI storage
                const tableData: SongData[] = tableRef.current.getData();
                const step = Math.floor(80 / tableData.length);
                for (const song of tableData) {
                    filesUploaded.current.push(`${song.name}.${song.extension}`);
                    const songToUpload = {
                        album: docRef.id,
                        name: song.name,
                        extension: song.extension,
                        filePath: song.file,
                    };
                    const urlPath = createObjectStoragePath(preauthreq, [
                        'albums',
                        songToUpload.album,
                        `${songToUpload.name}.${songToUpload.extension}`,
                    ]);
                    console.log(urlPath);
                    const res = (await invoke('upload_file', {
                        name: song.name,
                        path: urlPath,
                        file: song.file,
                    })) as any;
                    if (res[0]) {
                        updateProgress((progress += step), 'success', `Album song ${song.name} uploaded successfully`);
                    } else {
                        throw new Error(res[1]);
                    }
                }
                //Upload album artwork to OCI storage
                const artwork = artworkRef.current.getData() as string;
                const artworkToUpload = {
                    album: docRef.id,
                    extension: artwork.split('.').pop(),
                    filePath: artwork,
                };
                const urlPath = createObjectStoragePath(preauthreq, [
                    'albums',
                    artworkToUpload.album,
                    `artwork.${artworkToUpload.extension}`,
                ]);
                let res = (await invoke('upload_file', {
                    name: 'cover art',
                    path: urlPath,
                    file: artworkToUpload.filePath,
                })) as any;
                if (res[0]) {
                    updateProgress(95, 'success', 'Album cover art uploaded successfully');
                } else {
                    throw new Error(res[1]);
                }
                //Register album in database
                const albumData = formRef.current.getData();
                albumData.extension = artwork.split('.').pop();
                res = await uploadAlbumInfo(docRef.id, albumData, tableData);
                updateProgress(100, 'success', res);
                progressbarRef.current.logMessage('info', 'All album data uploaded successfully!');
                //Clear all states to avoid uploading the same album again
                clearChildrenStates();
            } catch (error: any) {
                deleteAlbum(docRef.id, { id: docRef.id, files: filesUploaded.current });
                progressbarRef.current.operationFailed(error.message);
                //Create a new cancel token
                cancelSource.current = axios.CancelToken.source();
            }
        }
    }

    function displayContent(): JSX.Element {
        if (categories.length > 0) {
            return (
                <div className="upload-section" ref={content}>
                    <h3 className="upload-album-title">Album upload</h3>
                    {/* Album details */}
                    <div className="upload-album">
                        {/* Artwork */}
                        <Artwork ref={artworkRef} type="create" />
                        {/* General info */}
                        <AlbumForm type={'create'} ref={formRef} />
                    </div>
                    {/* Table with songs */}
                    <Table
                        type="create"
                        headers={['Position', 'Name', 'Duration', 'Category']}
                        ref={tableRef}
                        calculateDuration={calculateDuration}
                    />
                    <button className="upload-btn-album" onClick={onUpload}>
                        Upload
                    </button>
                </div>
            );
        } else {
            return (
                <div className="section-no-content">
                    <h3 className="upload-album-title">Album upload</h3>
                    <p>There are no categories available. Click below to add a category</p>
                    <button className="goto-categories-btn" onClick={(): void => navigate(routes.ALBUM_CATEGORIES)}>
                        Create
                    </button>
                </div>
            );
        }
    }

    return (
        <div className="page" id="page-upload-create">
            <Sidebar />
            {displayContent()}
            <ProgressbarUpload ref={progressbarRef} abort={onUploadCancelled} />
        </div>
    );
};

export default AlbumCreate;
