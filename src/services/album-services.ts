import { db } from '@src/config/firebase';
import { AlbumFormData, SongData, AlbumCategory, AlbumInfo } from '@src/types/album';
import axios from 'axios';
import { arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';

export async function getAlbums(): Promise<AlbumInfo[]> {
    try {
        const ref = collection(db, 'albums');
        const q = await getDocs(ref);
        const albums = q.docs.map((d) => d.data() as AlbumInfo);
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

export async function deleteAlbum(
    id: string,
    album: { id: string; files: string[] },
): Promise<{ result: boolean; message: string }> {
    try {
        //Delete everyting related to this album
        await deleteDoc(doc(db, 'albums', id));
        //Temporary store in db the id of deleted album
        await updateDoc(doc(db, 'misc', 'albums'), {
            deleted: arrayUnion(album.id),
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

export async function addAlbumCategory(category: AlbumCategory): Promise<void> {
    try {
        await updateDoc(doc(db, 'misc', 'albums'), {
            categories: arrayUnion(category),
        });
    } catch (error) {
        throw error;
    }
}

export async function editAlbumCategory(category: AlbumCategory): Promise<void> {
    try {
        const albums = await getDoc(doc(db, 'misc', 'albums'));
        const categories = albums.data()!.categories;
        for (let i = 0; i < categories.length; i++) {
            if (categories[i].id === category.id) {
                categories[i] = category;
            }
        }
        await updateDoc(doc(db, 'misc', 'albums'), {
            categories: categories,
        });
    } catch (error) {
        throw error;
    }
}

export async function deleteAlbumCategory(category: AlbumCategory): Promise<void> {
    try {
        const albums = await getDoc(doc(db, 'misc', 'albums'));
        const categories = albums.data()!.categories;
        for (let i = 0; i < categories.length; i++) {
            if (categories[i].id === category.id) {
                categories.splice(i, 1);
            }
        }
        await updateDoc(doc(db, 'misc', 'albums'), {
            categories: categories,
        });
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
