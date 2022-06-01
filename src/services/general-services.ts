import { db } from '@config/firebase';
import { updateDoc, doc, arrayUnion, increment, getDoc } from 'firebase/firestore';
import { Category } from '@src/types/general';

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
            total: increment(-1),
        });
    } catch (error) {
        throw error;
    }
}
