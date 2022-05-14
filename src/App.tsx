import React from 'react';
import { app } from '@src/config/firebase';
import '@src/app.sass';
import Router from '@src/router/router';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const App: React.FC<{ title: string; version: string }> = (props: { title: string; version: string }) => {
    app;
    return <Router />;
};

export default App;
