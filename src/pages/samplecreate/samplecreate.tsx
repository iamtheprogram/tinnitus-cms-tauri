import React, { useRef, useEffect } from 'react';
import ProgressbarUpload from '@components/progressbar/progressbar-upload';
import Sidebar from '@components/sidebar/sidebar';
import { useNavigate } from 'react-router-dom';
import { CombinedStates } from '@store/reducers/custom';
import { Category } from '@src/types/general';
import Artwork from '@components/artwork/artwork';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { routes } from '@src/router/routes';
import { getAuth } from 'firebase/auth';
import { app } from '@src/config/firebase';
import SampleForm from '@components/sampleform/sampleform';

const SampleCreate: React.FC = () => {
    const navigate = useNavigate();
    const preauthreq = useSelector<CombinedStates>((state: CombinedStates) => state.ociReducer.config.prereq) as string;
    const categories = useSelector<CombinedStates>(
        (state: CombinedStates) => state.sampleReducer.categories,
    ) as Category[];
    const auth = useSelector<CombinedStates>((state: CombinedStates) => state.generalReducer.auth) as any;
    const artworkRef = useRef<any>(null);
    const formRef = useRef<any>(null);
    const content = useRef<any>(null);
    const progressbarRef = useRef<any>(null);
    const cancelSource = useRef(axios.CancelToken.source());

    useEffect(() => {
        if (auth) {
            //Done loading
        } else {
            navigate(routes.LOGIN);
        }
    }, [getAuth(app).currentUser]);

    function onUploadCancelled(): void {
        cancelSource.current.cancel('User cancelled upload');
    }

    function displayContent(): JSX.Element {
        if (categories.length > 0) {
            return (
                <div className="upload-section" ref={content}>
                    <h3 className="upload-sample-title">Sample upload</h3>
                    <SampleForm type={'create'} ref={formRef} />
                </div>
            );
        } else {
            return (
                <div className="section-no-content">
                    <h3 className="upload-sample-title">Sample upload</h3>
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
            <ProgressbarUpload ref={progressbarRef} abort={onUploadCancelled} />
        </div>
    );
};

export default SampleCreate;
