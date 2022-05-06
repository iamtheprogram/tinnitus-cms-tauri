export {};

declare global {
    interface Window {
        // Expose some Api through preload script
        fs: typeof import('fs');
        appendLoading: () => void;
        removeLoading: () => void;
        ipcRenderer: import('electron').IpcRenderer;
        dialog: import('electron').Dialog;
        electron: {
            isKeyAvailable: () => Promise<boolean>;
            provideKey: (key: string, config: string) => Promise<any>;
            initProvider: () => Promise<any>;
            openDialogArtowrk: () => Promise<any>;
            openDialogSongs: () => Promise<any>;
            showErrorMessage: (message: string) => void;
            showMessagBox: (message: string, title: string) => void;
            showQuestionBox: (message: string, title: string) => Promise<boolean>;
        };
    }
}
