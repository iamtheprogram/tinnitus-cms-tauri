import React from 'react';
import { useParams } from 'react-router-dom';
import ReviewView from '@components/reviews/reviews';
import Sidebar from '@src/components/sidebar/sidebar';

const AlbumReviews: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <div className="page" id="page-upload-edit">
            <Sidebar />
            <div className="album-review">
                <ReviewView id={id as string} />
            </div>
        </div>
    );
};

export default AlbumReviews;
