import React from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { routes } from './routes';
import AlbumView from '@pages/albumview/albumview';
import Login from '@pages/login/login';
import AlbumCreate from '@pages/albumcreate/albumcreate';
import Welcome from '@pages/home/home';
import AlbumEdit from '@pages/albumedit/albumedit';
import AlbumReviews from '@pages/albumreview/albumreview';
import AlbumCategories from '@pages/albumcategories/albumcategories';

const Router: React.FC = () => {
    return (
        <HashRouter>
            <Routes>
                <Route path={routes.HOME} element={<Welcome />} />
                <Route path={routes.LOGIN} element={<Login />} />
                <Route path={routes.ALBUM_VIEW} element={<AlbumView />} />
                <Route path={routes.ALBUM_CREATE} element={<AlbumCreate />} />
                <Route path={routes.ALBUM_EDIT} element={<AlbumEdit />} />
                <Route path={routes.ALBUM_REVIEWS} element={<AlbumReviews />} />
                <Route path={routes.ALBUM_CATEGORIES} element={<AlbumCategories />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </HashRouter>
    );
};

export default Router;
