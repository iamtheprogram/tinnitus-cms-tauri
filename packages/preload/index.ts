/* eslint-disable @typescript-eslint/explicit-function-return-type */
import fs from 'fs';
import { contextBridge, ipcRenderer } from 'electron';
import { domReady } from './utils';
import { useLoading } from './loading';
import remote from '@electron/remote';

remote.app.commandLine.appendSwitch('js-flags', '--max-old-space-size=6096');

const { appendLoading, removeLoading } = useLoading();

(async () => {
    await domReady();

    appendLoading();
})();

// --------- Expose some API to the Renderer process. ---------
contextBridge.exposeInMainWorld('fs', fs);
contextBridge.exposeInMainWorld('removeLoading', removeLoading);
contextBridge.exposeInMainWorld('appendLoading', appendLoading);
contextBridge.exposeInMainWorld('ipcRenderer', withPrototype(ipcRenderer));
contextBridge.exposeInMainWorld('electron', {
    isKeyAvailable: () => ipcRenderer.invoke('key-available'),
    provideKey: (key: string, config: string) => ipcRenderer.invoke('provide-key', key, config),
    initProvider: () => ipcRenderer.invoke('init-provider'),
    openDialogArtowrk: () => ipcRenderer.invoke('dialog-artwork'),
    openDialogSongs: () => ipcRenderer.invoke('dialog-songs'),
    showErrorMessage: (message: string) => ipcRenderer.invoke('show-error-message', message),
    showMessagBox: (message: string, title: string) => ipcRenderer.invoke('show-message-box', message, title),
    showQuestionBox: (message: string, title: string) => ipcRenderer.invoke('show-question-box', message, title),
});

// `exposeInMainWorld` can't detect attributes and methods of `prototype`, manually patching it.
function withPrototype(obj: Record<string, any>) {
    const protos = Object.getPrototypeOf(obj);

    for (const [key, value] of Object.entries(protos)) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) continue;

        if (typeof value === 'function') {
            // eslint-disable-next-line max-len
            // Some native APIs, like `NodeJS.EventEmitter['on']`, don't work in the Renderer process. Wrapping them into a function.
            obj[key] = function (...args: any) {
                return value.call(obj, ...args);
            };
        } else {
            obj[key] = value;
        }
    }
    return obj;
}
