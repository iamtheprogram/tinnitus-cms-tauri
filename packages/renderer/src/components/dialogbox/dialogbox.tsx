import React from 'react';
import { Button } from 'react-bootstrap';
import { Icons } from '@src/utils/icons';

type DialogboxProps = {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    message: string;
    setAccepted: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DialogBox: React.FC<DialogboxProps> = (props: DialogboxProps) => {
    function onBtnOkClick(): void {
        //Accept action
        props.setAccepted(true);
        //Close dialog box
        props.setIsOpen(false);
    }

    return (
        <>
            <div className="DialHeader">
                <p style={{ margin: '4px' }}>Message</p>
            </div>
            <p style={{ marginLeft: '10px' }}>{props.message}</p>
            <Button className="BtnOkDialog" onClick={onBtnOkClick}>
                OK
            </Button>
            <Button
                className="BtnCancel"
                onClick={(): void => {
                    props.setIsOpen(false);
                }}
            >
                Cancel
            </Button>
            <img src={Icons['CancelIcon']} className="cancel-icon" onClick={(): void => props.setIsOpen(false)} />
        </>
    );
};
