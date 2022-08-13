import React, { useRef, useEffect } from 'react';
import Sidebar from '@components/sidebar/sidebar';
import { useNavigate } from 'react-router-dom';
import { CombinedStates } from '@store/reducers/custom';
import { Category } from '@src/types/general';
import { useSelector } from 'react-redux';
import { routes } from '@src/router/routes';
import { getAuth } from 'firebase/auth';
import { app } from '@src/config/firebase';
import SampleForm from '@components/sampleform/sampleform';

const SampleCreate: React.FC = () => {
    const navigate = useNavigate();
    const categories = useSelector<CombinedStates>(
        (state: CombinedStates) => state.sampleReducer.categories,
    ) as Category[];
    const auth = useSelector<CombinedStates>((state: CombinedStates) => state.generalReducer.auth) as any;
    const formRef = useRef<any>(null);
    const content = useRef<any>(null);

    useEffect(() => {
        if (auth) {
            //Done loading
        } else {
            navigate(routes.LOGIN);
        }
    }, [getAuth(app).currentUser]);

    function displayContent(): JSX.Element {
        if (categories.length > 0) {
            return (
                <div className="page-content" ref={content}>
                    <h2 className="page-title">Sample upload</h2>
                    <SampleForm type={'create'} ref={formRef} />
                </div>
            );
        } else {
            return (
                <div className="section-no-content">
                    <p>There are no categories available. Click below to add a category</p>
                    <button className="goto-categories-btn" onClick={(): void => navigate(routes.SAMPLE_CATEGORIES)}>
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
        </div>
    );
};

export default SampleCreate;
