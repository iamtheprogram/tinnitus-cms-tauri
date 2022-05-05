export type UploadAlbumSong = {
    album: string;
    name: string;
    extension: string;
    filePath: string;
};

export type UploadAlbumArtwork = {
    album: string;
    extension: string;
    filePath: string;
};

export type DeleteAlbum = {
    album: string;
    files: string[];
};
