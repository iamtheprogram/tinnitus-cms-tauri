export type SampleFormData = {
    name: string;
    file?: string;
    description: string;
    extension?: string;
    tags?: string[];
    length: string;
    category: string;
    notification?: string;
};

export type SampleInfo = {
    id: string;
    name: string;
    description: string;
    extension: string;
    tags: string[];
    length: string;
    category: string;
    likes: number;
    reviews: number;
    upload_date: any;
    favorites: number;
    views: number;
};
