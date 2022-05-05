import React from 'react';
import './modal-search.css';
import Modal from 'react-modal';
import { hourglassStyle } from '@src/styles/styles';

type ModalSearchProps = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ModalSearch: React.FC<ModalSearchProps> = (props: ModalSearchProps) => {
    return (
        <Modal isOpen={props.isOpen} style={hourglassStyle} ariaHideApp={false}>
            <div className="hourglass"></div>
        </Modal>
    );
};
