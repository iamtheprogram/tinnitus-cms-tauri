export type SongData = {
    file?: string;
    extension?: string;
    name: string;
    pos: string | number;
    length: string;
    category: string;
    likes?: number;
    favorites?: number;
    views?: number;
};

export type AlbumFormData = {
    name: string;
    description: string;
    extension?: string;
    tags?: string[];
    length: string;
    category: string;
    notification?: string;
};

export type AlbumInfo = {
    id: string;
    name: string;
    extension: string;
    description: string;
    tags: string[];
    length: string;
    category: string;
    likes: number;
    reviews: number;
    upload_date: any;
    artwork: string;
    total_songs: number;
    favorites: number;
    songs: Array<SongData>;
};

export type ReviewData = {
    uid: string;
    email: string;
    comment: string;
    date: Date;
};

export type AlbumCategory = {
    name: string;
    id: string;
    description: string;
    color: string;
};
