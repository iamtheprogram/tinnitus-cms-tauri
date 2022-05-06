import React, { forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToolbarIcons } from '@utils/icons';
import ReactTooltip from 'react-tooltip';
import { routes } from '@src/router/routes';
import { deleteAlbum } from '@src/services/album-services';

type ToolbarProps = {
    container?: string;
    itemId: string;
    item: any;
};

const Toolbar = forwardRef((props: ToolbarProps, ref?: any) => {
    const navigate = useNavigate();

    useImperativeHandle(ref, () => ({
        //
    }));

    function onReviewClick(): void {
        navigate(`/album/reviews/${props.itemId}`);
    }

    function onEditClick(): void {
        navigate(`/album/edit/${props.itemId}`);
    }

    async function onRequestDeleteClick(): Promise<void> {
        // setDialogbox(true);
        const clicked = await window.electron.showQuestionBox('', 'Are you sure you want to delete this item ?');
        if (clicked) {
            try {
                //Activate loading screen
                window.appendLoading();
                if (props.item !== undefined && props.itemId !== undefined) {
                    //Make an array with all filenames under the album
                    const filesToDelete = [];
                    for (const song of props.item.songs) {
                        filesToDelete.push(`${song.name}.${song.extension}`);
                    }
                    filesToDelete.push(`artwork.${props.item.extension}`);
                    //Delete album from storage and database
                    await deleteAlbum(props.itemId, { album: props.itemId, files: filesToDelete });
                    window.removeLoading();
                    navigate('/album/view/0');
                }
            } catch (error: any) {
                //Set message and notify user about occured error
                window.removeLoading();
                window.electron.showErrorMessage(error.message);
            }
        }
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
        </div>
    );
});

export default Toolbar;
