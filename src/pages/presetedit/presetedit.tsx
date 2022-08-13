import React, { useEffect, useRef, useState } from 'react';
import { app, db } from '@src/config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { routes } from '@src/router/routes';
import { CombinedStates } from '@store/reducers/custom';
import { useLoading } from '@pages/loading/loading';
import { PresetInfo } from '@src/types/preset';
import Sidebar from '@components/sidebar/sidebar';
import PresetForm from '@components/presetform/presetform';

const PresetEdit: React.FC = () => {
    const auth = useSelector<CombinedStates>((state: CombinedStates) => state.generalReducer.auth) as any;
    const { appendLoading, removeLoading } = useLoading();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const presetData = useRef<any>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (auth) {
            //Fetch data
            fetchPresetData();
        } else {
            navigate(routes.LOGIN);
        }
    }, [getAuth(app).currentUser]);

    async function fetchPresetData(): Promise<void> {
        try {
            appendLoading();
            const docRef = await getDoc(doc(db, 'presets', id as string));
            presetData.current = docRef.data() as PresetInfo;
            //Done fetching data
            setLoaded(true);
            removeLoading();
        } catch (error) {
            removeLoading();
            //dialog.message(error.message);
        }
    }

    function displayPage(): JSX.Element {
        if (loaded) {
            return (
                <div className="page">
                    <Sidebar />
                    <div className="page-content">
                        <h2 className="page-title">Preset edit</h2>
                        <PresetForm type={'edit'} data={presetData.current} id={id} />
                    </div>
                </div>
            );
        } else {
            return <div></div>;
        }
    }

    return displayPage();
};

export default PresetEdit;
