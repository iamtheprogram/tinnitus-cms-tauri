import { db } from '@config/firebase';
import { updateDoc, doc, arrayUnion, getDoc } from 'firebase/firestore';
import { Category } from '@src/types/general';
import axios from 'axios';

export async function addCategory(category: Category, path: string): Promise<void> {
    try {
        await updateDoc(doc(db, 'misc', path), {
            categories: arrayUnion(category),
        });
    } catch (error) {
        throw error;
    }
}

export async function editCategory(category: Category, path: string): Promise<void> {
    try {
        const albums = await getDoc(doc(db, 'misc', path));
        const categories = albums.data()!.categories;
        for (let i = 0; i < categories.length; i++) {
            if (categories[i].id === category.id) {
                categories[i] = category;
            }
        }
        await updateDoc(doc(db, 'misc', path), {
            categories: categories,
        });
    } catch (error) {
        throw error;
    }
}

export async function deleteCategory(category: Category, path: string): Promise<void> {
    try {
        const albums = await getDoc(doc(db, 'misc', path));
        const categories = albums.data()!.categories;
        for (let i = 0; i < categories.length; i++) {
            if (categories[i].id === category.id) {
                categories.splice(i, 1);
            }
        }
        await updateDoc(doc(db, 'misc', path), {
            categories: categories,
            deleted_categories: arrayUnion(category.id),
        });
    } catch (error) {
        throw error;
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
