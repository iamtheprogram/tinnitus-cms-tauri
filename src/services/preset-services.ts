import { db } from '@src/config/firebase';
import { PresetFormData, PresetInfo } from '@src/types/preset';
import { arrayUnion, collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';

export async function getPresets(): Promise<PresetInfo[]> {
    try {
        const presets = new Array<PresetInfo>();
        const ref = collection(db, 'presets');
        const q = await getDocs(ref);
        const docs = q.docs;
        for (const doc of docs) {
            const preset = doc.data() as PresetInfo;
            preset.id = doc.id;
            presets.push(preset);
        }
        return presets;
    } catch (error) {
        throw error;
    }
}

export async function uploadPresetInfo(id: string, info: PresetFormData): Promise<string> {
    try {
        const presetDocRef = doc(db, 'presets', id);
        await setDoc(presetDocRef, {
            name: info.name,
            upload_date: new Date(),
            category: info.category,
            description: info.description,
            tags: info.tags,
            length: info.length,
            likes: 0,
            favorites: 0,
            reviews: 0,
            views: 0,
        });
        return 'Preset registered in database';
    } catch (error) {
        throw error;
    }
}

export async function editPresetData(id: string, info: PresetFormData): Promise<string> {
    try {
        const presetDocRef = doc(db, 'presets', id);
        await setDoc(
            presetDocRef,
            {
                name: info.name,
                category: info.category,
                description: info.description,
                tags: info.tags,
            },
            { merge: true },
        );
        return 'Preset updated in database';
    } catch (error) {
        throw error;
    }
}

export async function deletePreset(id: string): Promise<string> {
    try {
        const presetDocRef = doc(collection(db, 'presets'), id);
        await deleteDoc(presetDocRef);
        //Temporary store in db the id of deleted album
        await updateDoc(doc(db, 'misc', 'presets'), {
            deleted_samples: arrayUnion(id),
        });
        return 'Preset deleted from database';
    } catch (error) {
        throw error;
    }
}

export async function getPresetReviews(id: string, date: Date): Promise<any[]> {
    try {
        return [];
    } catch (error) {
        throw error;
    }
}
