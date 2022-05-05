import { db } from '@src/config/firebase';
import { AlbumFormData, SongData } from '@src/types/album';
import axios from 'axios';
import { deleteDoc, doc, setDoc } from 'firebase/firestore';

export async function uploadAlbumInfo(id: string, info: AlbumFormData, tableData: SongData[]): Promise<string> {
    try {
        const albumDocRef = doc(db, 'albums', id);
        const temp = tableData.map((x) => x);
        //Copy songs URL
        for (let i = 0; i < temp.length; i++) {
            delete temp[i].file;
        }
        //Upload general information about album
        await setDoc(albumDocRef, {
            name: info.name,
            upload_date: new Date(),
            extension: info.extension,
            category: info.category,
            description: info.description,
            tags: info.tags,
            length: info.length,
            songs: temp,
            total_songs: temp.length,
            likes: 0,
            favorites: 0,
            reviews: 0,
        });
        return 'Album registered in database';
    } catch (error) {
        throw error;
    }
}

export async function editAlbumData(id: string, info: AlbumFormData, tableData: SongData[]): Promise<string> {
    try {
        const albumDocRef = doc(db, 'albums', id);
        await setDoc(
            albumDocRef,
            {
                name: info.name,
                description: info.description,
                tags: info.tags,
                category: info.category,
                length: info.length,
                songs: tableData,
            },
            { merge: true },
        );
        return 'Album updated in database';
    } catch (error: any) {
        return error.message;
    }
}

export async function uploadNotification(id: string, notification: string): Promise<void> {
    try {
        //Send notification to all users
        await axios.post(
            'https://us-central1-tinnitus-50627.cloudfunctions.net/sendNotification',
            {},
            {
                params: {
                    title: 'New album added',
                    body: notification,
                    // eslint-disable-next-line max-len
                    icon: 'https://firebasestorage.googleapis.com/v0/b/tinnitus-50627.appspot.com/o/logo.png?alt=media&token=b7fe80c7-2b6f-4bd8-8c57-637a5e404591',
                },
            },
        );
    } catch (error) {
        throw error;
    }
}

export async function deleteAlbum(id: string, album: { album: string; files: string[] }): Promise<void> {
    try {
        //Delete everyting related to this album
        await deleteDoc(doc(db, 'albums', id));
        await window.ipcRenderer.invoke('delete-album', album);
    } catch (error) {
        throw error;
    }
}

export async function getAlbumReviews(id: string, date: Date): Promise<any[]> {
    try {
        return [];
    } catch (error) {
        throw error;
    }
}