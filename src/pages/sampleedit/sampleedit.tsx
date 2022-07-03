import React, { useEffect, useRef, useState } from 'react';
import { app, db } from '@src/config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { routes } from '@src/router/routes';
import { CombinedStates } from '@store/reducers/custom';
import { useLoading } from '@pages/loading/loading';
import { SampleInfo } from 'types/sample';
import Sidebar from '@components/sidebar/sidebar';
import SampleForm from '@components/sampleform/sampleform';

const SampleEdit: React.FC = () => {
    const auth = useSelector<CombinedStates>((state: CombinedStates) => state.generalReducer.auth) as any;
    const { appendLoading, removeLoading } = useLoading();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const sampleData = useRef<any>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (auth) {
            //Fetch data
            fetchSampleData();
        } else {
            navigate(routes.LOGIN);
        }
    }, [getAuth(app).currentUser]);

    async function fetchSampleData(): Promise<void> {
        try {
            appendLoading();
            const docRef = await getDoc(doc(db, 'samples', id as string));
            sampleData.current = docRef.data() as SampleInfo;
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
                        <h3 className="page-title">Sample edit</h3>
                        <SampleForm type={'edit'} data={sampleData.current} id={id} />
                    </div>
                </div>
            );
        } else {
            return <div></div>;
        }
    }

    return displayPage();
};

export default SampleEdit;
