import { Icons } from '@src/utils/icons';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';

type ArtworkProps = {
    type: string;
    img?: any;
};

const Artwork = forwardRef((props: ArtworkProps, ref: any) => {
    const [thumbnail, setThumbnail] = useState<any>(null);
    const [thumbnailInvalid, setThumbnailInvalid] = useState<any>('');
    const thumbnailFile = useRef<any>(null);

    useImperativeHandle(ref, () => ({
        getInputValidation: (): boolean => {
            if (thumbnail === null) {
                setThumbnailInvalid('Album cover art is mandatory');
                return false;
            } else {
                setThumbnailInvalid('');
                return true;
            }
        },

        getData: (): File => {
            return thumbnailFile.current;
        },

        clearInternalStates: (): void => {
            thumbnailFile.current = null;
            setThumbnail(null);
        },
    }));

    async function onPlusClick(): Promise<void> {
        const result = await window.electron.openDialogArtowrk();
        if (result !== undefined) {
            //Convert file data to blob
            const blob = new Blob([result.data], { type: `image/${result.extension}` });
            const urlCreator = window.URL || window.webkitURL;
            //Create a URL based on the blob for image tag
            const imageUrl = urlCreator.createObjectURL(blob);
            //Store the data for further use
            thumbnailFile.current = result.path;
            setThumbnail(imageUrl);
            setThumbnailInvalid('');
        }
    }

    function displayThumbnail(): JSX.Element {
        if (thumbnail) {
            return <img src={thumbnail} />;
        } else {
            return <p>Please select a cover art for album</p>;
        }
    }

    function display(): JSX.Element {
        if (props.type === 'view' || props.type === 'edit') {
            return (
                <div className="upload-album-artwork">
                    <img src={props.img} />
                </div>
            );
        } else if (props.type === 'edit' || props.type === 'create') {
            return (
                <div className="upload-album-artwork-div">
                    <div className="upload-album-artwork">
                        <div className="plus-body" onClick={onPlusClick}>
                            <img src={Icons.Plus} className="plus" />
                        </div>
                        {displayThumbnail()}
                    </div>
                    <p className="invalid-input invalid-thumbnail">{thumbnailInvalid}</p>
                </div>
            );
        } else {
            return <></>;
        }
    }

    return display();
});

export default Artwork;