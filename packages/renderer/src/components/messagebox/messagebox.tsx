import React from 'react';
import { Button } from 'react-bootstrap';
import { Icons } from '@utils/icons';

type MessageboxProps = {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    message: string;
};

export const MessageBox: React.FC<MessageboxProps> = (props: MessageboxProps) => {
    return (
        <>
            <div className="MessageHeader">
                <p style={{ margin: '4px' }}>Message</p>
            </div>
            <p style={{ marginLeft: '10px' }}>{props.message}</p>
            <Button className="BtnOk" onClick={(): void => props.setIsOpen(false)}>
                OK
            </Button>
            <img src={Icons['CancelIcon']} className="cancel-icon" onClick={(): void => props.setIsOpen(false)} />
        </>
    );
};
