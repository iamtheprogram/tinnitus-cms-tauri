import { db } from '@src/config/firebase';
import { AlbumFormData, SongData, AlbumInfo } from '@src/types/album';
import axios from 'axios';
import { arrayUnion, collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';

export async function getAlbums(): Promise<AlbumInfo[]> {
    try {
        const albums = new Array<AlbumInfo>();
        const ref = collection(db, 'albums');
        const q = await getDocs(ref);
        const docs = q.docs;
        for (const doc of docs) {
            const album = doc.data() as AlbumInfo;
            album.id = doc.id;
            albums.push(album);
        }
        return albums;
    } catch (error) {
        throw error;
    }
}

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

export async function deleteAlbum(
    id: string,
    album: { id: string; files: string[] },
): Promise<{ result: boolean; message: string }> {
    try {
        //Delete everyting related to this album
        await deleteDoc(doc(db, 'albums', id));
        //Temporary store in db the id of deleted album
        await updateDoc(doc(db, 'misc', 'albums'), {
            deleted_albums: arrayUnion(album.id),
        });
        //! Does not work with pre-authenticated requests
        // const res = (await invoke('delete_album', { album: album.id, files: album.files })) as any;
        // if (res[0] === false) {
        //     throw new Error(res[1]);
        // } else {
        //     return { result: true, message: 'Album deleted' };
        // }
        return { result: true, message: 'Album deleted' };
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
