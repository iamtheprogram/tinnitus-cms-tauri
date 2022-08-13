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
import AlbumList from '@pages/albumlist/albumlist';
import SampleCategories from '@pages/samplecategories/samplecategories';
import PresetCategories from '@pages/presetcategories/presetcategories';
import SampleCreate from '@pages/samplecreate/samplecreate';
import SampleList from '@pages/samplelist/samplelist';
import SampleView from '@pages/sampleview/sampleview';
import SampleEdit from '@pages/sampleedit/sampleedit';
import PresetCreate from '@pages/presetcreate/presetcreate';
import PresetList from '@pages/presetlist/presetlist';
import PresetView from '@pages/presetview/presetview';
import PresetEdit from '@pages/presetedit/presetedit';
import Dashboard from '@pages/dashboard/dashboard';

const Router: React.FC = () => {
    return (
        <HashRouter>
            <Routes>
                <Route path={routes.HOME} element={<Welcome />} />
                <Route path={routes.LOGIN} element={<Login />} />
                <Route path={routes.ALBUM_LIST} element={<AlbumList />} />
                <Route path={routes.ALBUM_VIEW} element={<AlbumView />} />
                <Route path={routes.ALBUM_CREATE} element={<AlbumCreate />} />
                <Route path={routes.ALBUM_EDIT} element={<AlbumEdit />} />
                <Route path={routes.ALBUM_REVIEWS} element={<AlbumReviews />} />
                <Route path={routes.ALBUM_CATEGORIES} element={<AlbumCategories />} />
                <Route path={routes.SAMPLE_CATEGORIES} element={<SampleCategories />} />
                <Route path={routes.PRESET_CATEGORIES} element={<PresetCategories />} />
                <Route path={routes.SAMPLE_CREATE} element={<SampleCreate />} />
                <Route path={routes.SAMPLE_LIST} element={<SampleList />} />
                <Route path={routes.SAMPLE_VIEW} element={<SampleView />} />
                <Route path={routes.SAMPLE_EDIT} element={<SampleEdit />} />
                <Route path={routes.PRESET_CREATE} element={<PresetCreate />} />
                <Route path={routes.PRESET_LIST} element={<PresetList />} />
                <Route path={routes.PRESET_VIEW} element={<PresetView />} />
                <Route path={routes.PRESET_EDIT} element={<PresetEdit />} />
                <Route path={routes.DASHBOARD} element={<Dashboard />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </HashRouter>
    );
};

export default Router;
