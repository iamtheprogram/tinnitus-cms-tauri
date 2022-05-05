import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToolbarIcons } from '@utils/icons';
import ReactTooltip from 'react-tooltip';
import Modal from 'react-modal';
import { MessageBox } from '../messagebox/messagebox';
import { DialogBox } from '../dialogbox/dialogbox';
import { dialogStyles } from '@src/styles/styles';
import { routes } from '@src/router/routes';
import { deleteAlbum } from '@src/services/album-services';

type ToolbarProps = {
    container?: string;
    itemId: string;
    item: any;
};

const Toolbar = forwardRef((props: ToolbarProps, ref?: any) => {
    const navigate = useNavigate();
    const [messageOpen, setMessageOpen] = useState(false);
    const [messageboxMsg, setMessageboxMsg] = useState('');
    const [dialogbox, setDialogbox] = useState(false);
    const [accept, setAccept] = useState(false);

    useImperativeHandle(ref, () => ({
        //
    }));

    useEffect(() => {
        if (accept == true) {
            requestResourceDeletion();
            //Reset action accept state
            setAccept(false);
        }
    }, [accept]);

    async function requestResourceDeletion(): Promise<void> {
        //Activate loading screen
        try {
            if (props.item !== undefined && props.itemId !== undefined) {
                //Make an array with all filenames under the album
                const filesToDelete = [];
                for (const song of props.item.songs) {
                    filesToDelete.push(`${song.name}.${song.extension}`);
                }
                filesToDelete.push(`artwork.${props.item.extension}`);
                //Delete album from storage and database
                await deleteAlbum(props.itemId, { album: props.itemId, files: filesToDelete });
                navigate('/album/view/0');
            }
        } catch (error: any) {
            //Set message and notify user about occured error
            setMessageboxMsg(error.message);
            setMessageOpen(true);
        }
    }

    function onReviewClick(): void {
        navigate(`/album/reviews/${props.itemId}`);
    }

    function onEditClick(): void {
        navigate(`/album/edit/${props.itemId}`);
    }

    function onRequestDeleteClick(): void {
        setDialogbox(true);
    }

    return (
        <div className={props.container + ' ToolbarContainer '}>
            <ReactTooltip place="top" type="dark" effect="float" delayShow={500} />
            <div className="toolbar-action" onClick={(): void => navigate(routes.ALBUM_CREATE)}>
                <img src={ToolbarIcons.UploadIcon} className="ActionIcon" />
                <p>Upload</p>
            </div>
            <div className="toolbar-action" onClick={onEditClick}>
                <img src={ToolbarIcons.EditIcon} className="ActionIcon" />
                <p>Edit</p>
            </div>
            <div className="toolbar-action" onClick={onRequestDeleteClick}>
                <img src={ToolbarIcons.DeleteIcon} className="ActionIcon" />
                <p>Delete</p>
            </div>
            <div className="toolbar-action" onClick={onReviewClick}>
                <img src={ToolbarIcons.Reviews} className="ActionIcon" />
                <p>Reviews</p>
            </div>
            <Modal isOpen={messageOpen} style={dialogStyles} contentLabel="Upload" ariaHideApp={false}>
                <MessageBox setIsOpen={setMessageOpen} message={messageboxMsg} />
            </Modal>
            <Modal isOpen={dialogbox} style={dialogStyles} contentLabel="Dialog box" ariaHideApp={false}>
                <DialogBox
                    setIsOpen={setDialogbox}
                    message="Are you sure you want to delete this item ?"
                    setAccepted={setAccept}
                />
            </Modal>
        </div>
    );
});

export default Toolbar;
