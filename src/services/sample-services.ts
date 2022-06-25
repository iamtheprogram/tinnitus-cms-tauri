import { db } from '@src/config/firebase';
import { SampleFormData, SampleInfo } from '@src/types/sample';
import { arrayUnion, collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';

export async function getSamples(): Promise<SampleInfo[]> {
    try {
        const samples = new Array<SampleInfo>();
        const ref = collection(db, 'samples');
        const q = await getDocs(ref);
        const docs = q.docs;
        for (const doc of docs) {
            const sample = doc.data() as SampleInfo;
            sample.id = doc.id;
            samples.push(sample);
        }
        return samples;
    } catch (error) {
        throw error;
    }
}

export async function uploadSampleInfo(id: string, info: SampleFormData): Promise<string> {
    try {
        const sampleDocRef = doc(db, 'samples', id);
        await setDoc(sampleDocRef, {
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
        return 'Sample registered in database';
    } catch (error) {
        throw error;
    }
}

export async function editSampleData(info: SampleFormData): Promise<string> {
    try {
        const sampleDocRef = doc(collection(db, 'samples'));
        await setDoc(
            sampleDocRef,
            {
                name: info.name,
                description: info.description,
                tags: info.tags,
            },
            { merge: true },
        );
        return 'Sample updated in database';
    } catch (error) {
        throw error;
    }
}

export async function deleteSample(id: string): Promise<string> {
    try {
        const sampleDocRef = doc(collection(db, 'samples'), id);
        await deleteDoc(sampleDocRef);
        //Temporary store in db the id of deleted album
        await updateDoc(doc(db, 'misc', 'samples'), {
            deleted_samples: arrayUnion(id),
        });
        return 'Sample deleted from database';
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
