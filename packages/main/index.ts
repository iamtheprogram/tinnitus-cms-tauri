/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { app, BrowserWindow, ipcMain, shell, dialog } from 'electron';
import { release } from 'os';
import { join } from 'path';
import * as fs from 'fs';
import './samples/electron-store';
import './samples/npm-esm-packages';
import { deleteAlbum, uploadAlbumArtwork, uploadAlbumSong } from './services/album-services';
import { DeleteAlbum, UploadAlbumArtwork, UploadAlbumSong } from './types/album';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import * as remoteMain from '@electron/remote/main';
import { createResources, initProvider, isKeyAvailable } from './config/oci';

remoteMain.initialize();

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
    app.quit();
    process.exit(0);
}

let win: BrowserWindow | null = null;

async function createWindow() {
    win = new BrowserWindow({
        width: 1200,
        height: 1000,
        title: 'Tinnitus CMS',
        webPreferences: {
            preload: join(__dirname, '../preload/index.cjs'),
        },
    });

    if (app.isPackaged) {
        win.loadFile(join(__dirname, '../renderer/index.html'));
    } else {
        // 🚧 Use ['ENV_NAME'] avoid vite:define plugin
        const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`;

        win.loadURL(url);
        // win.webContents.openDevTools()
    }

    // Test active push message to Renderer-process
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', new Date().toLocaleString());
    });

    // Make all links open with the browser, not with the application
    win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https:')) shell.openExternal(url);
        return { action: 'deny' };
    });

    remoteMain.enable(win.webContents);
}

app.whenReady().then(createWindow);

app.on('ready', () => {
    if (process.env.NODE_ENV === 'development') {
        dialog.showMessageBox({
            type: 'warning',
            title: 'Tinnitus CMS',
            message: 'Tinnitus CMS is running in development mode.\n\nPlease use the production build of Tinnitus CMS.',
            buttons: ['OK'],
        });
    }
});

app.on('window-all-closed', () => {
    win = null;
    if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
    if (win) {
        // Focus on the main window if the user tried to open another
        if (win.isMinimized()) win.restore();
        win.focus();
    }
});

app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows();
    if (allWindows.length) {
        allWindows[0].focus();
    } else {
        createWindow();
    }
});

ipcMain.handle('key-available', () => {
    return isKeyAvailable();
});

ipcMain.handle('provide-key', async (event, key: string, config: string) => {
    try {
        await createResources(key, config);
    } catch (error) {
        throw error;
    }
});

ipcMain.handle('init-provider', () => {
    try {
        initProvider();
    } catch (error) {
        throw error;
    }
});

ipcMain.handle('show-error-message', (event, message: string) => {
    dialog.showErrorBox('Error', message);
});

ipcMain.handle('show-message-box', (event, message: string, title: string) => {
    dialog.showMessageBox({
        type: 'info',
        title: title,
        message: message,
        buttons: ['OK'],
    });
});

ipcMain.handle('show-question-box', async (event, message: string, title: string) => {
    const retVal = await dialog.showMessageBox({
        type: 'question',
        title: title,
        message: title,
        buttons: ['Cancel', 'Yes'],
    });
    //Check if the user clicked on the "Yes" button
    if (retVal.response === 1) {
        return true;
    } else {
        return false;
    }
});

ipcMain.handle('upload-song', async (event, id: string, song: UploadAlbumSong): Promise<string> => {
    try {
        return await uploadAlbumSong(id, song);
    } catch (error) {
        throw error;
    }
});

ipcMain.handle('upload-artwork', async (event, id: string, arwork: UploadAlbumArtwork): Promise<string> => {
    try {
        return await uploadAlbumArtwork(id, arwork);
    } catch (error) {
        throw error;
    }
});

ipcMain.handle('delete-album', async (event, payload: DeleteAlbum) => {
    try {
        await deleteAlbum(payload.album, payload);
    } catch (error) {
        throw error;
    }
});

ipcMain.handle('dialog-artwork', async (event) => {
    const res = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Images', extensions: ['jpg', 'png', 'jpeg'] }],
    });

    if (res.canceled) {
        return;
    } else {
        const result = {
            data: fs.readFileSync(res.filePaths[0]),
            extension: res.filePaths[0].split('.').pop(),
            path: res.filePaths[0],
        };
        return result;
    }
});

ipcMain.handle('dialog-songs', async (event) => {
    const res = await dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections'],
        filters: [{ name: 'Audio', extensions: ['mp3', 'wav'] }],
    });

    if (res.canceled) {
        return;
    } else {
        const files = [];
        for (let i = 0; i < res.filePaths.length; i++) {
            files.push({
                path: res.filePaths[i],
                extension: res.filePaths[i].split('.').pop(),
                name: res.filePaths[i].slice(res.filePaths[i].lastIndexOf('/') + 1, res.filePaths[i].lastIndexOf('.')),
                duration: await getAudioDurationInSeconds(res.filePaths[i]),
            });
        }
        return files;
    }
});
