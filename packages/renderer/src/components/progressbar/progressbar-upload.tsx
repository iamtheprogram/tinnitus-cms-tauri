import React, { forwardRef, useEffect, useRef, useState, useImperativeHandle } from 'react';
import './progressbar.css';
import Modal from 'react-modal';
import { progressStyles } from '@src/styles/styles';
import { ProgressBar, Button } from 'react-bootstrap';
import { Icons } from '@utils/icons';

type ProgressType = {
    abort: CallableFunction;
};

const ProgressbarUpload = forwardRef((props: ProgressType, ref: any) => {
    const types = React.useRef(
        new Map<string, { color: string; img: string }>([
            ['danger', { color: '#FF0000', img: Icons.ErrorProgress }],
            ['success', { color: '#00FF00', img: Icons.SuccessProgress }],
            ['info', { color: '#00FFFF', img: Icons.InfoProgress }],
        ]),
    );
    const btnDisabled = useRef('0.5');
    const btnEnabled = useRef('1');
    const btnContinue = useRef<any>(null);
    const btnAbort = useRef<any>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [variant, setVariant] = useState('success');
    const [log, setLog] = useState(Array<{ type: string; value: any }>());

    useEffect(() => {
        if (btnContinue.current != null && btnAbort.current != null) {
            btnContinue.current.style.opacity = btnDisabled.current;
            btnAbort.current.style.opacity = btnEnabled.current;
        }
    }, [btnContinue.current, btnAbort.current]);

    useEffect(() => {
        if (progress === 100) {
            if (btnContinue.current != null && btnAbort.current != null) {
                btnContinue.current.style.opacity = btnEnabled.current;
                btnAbort.current.style.opacity = btnDisabled.current;
            }
        }
    }, [progress]);

    useImperativeHandle(ref, () => ({
        enable: (value: boolean): void => {
            setIsOpen(value);
        },

        setProgress: (value: number): void => {
            if (progress > 100) {
                setProgress(100);
            } else {
                setProgress(value);
            }
        },

        setVariant: (value: string): void => {
            setVariant(value);
        },

        logMessage: (type: string, value: any): void => {
            setLog((prev) => [...prev, { type, value }]);
        },

        operationFailed: (message: string): void => {
            setVariant('danger');
            setLog((prev) => [...prev, { type: 'danger', value: message }]);
        },

        cleanState: (): void => {
            setProgress(0);
            setVariant('success');
            setLog([]);
            setIsOpen(false);
        },
    }));

    function cleanState(): void {
        setProgress(0);
        setVariant('success');
        setLog([]);
        setIsOpen(false);
    }

    function close(): void {
        btnContinue.current.style.opacity = btnDisabled.current;
        btnAbort.current.style.opacity = btnEnabled.current;
        props.abort();
        cleanState();
    }

    function onContinue(): void {
        if (btnContinue.current.style.opacity === btnEnabled.current) {
            btnContinue.current.style.opacity = btnDisabled.current;
            btnAbort.current.style.opacity = btnEnabled.current;
            cleanState();
        }
    }

    function onAbort(): void {
        if (btnAbort.current.style.opacity === btnEnabled.current) {
            btnContinue.current.style.opacity = btnEnabled.current;
            btnAbort.current.style.opacity = btnDisabled.current;
            setVariant('danger');
            setProgress(100);
            props.abort();
        }
    }

    function getColor(type: string): string {
        if (type != '') {
            return types.current.get(type)!.color;
        } else {
            return '#FFFFFF';
        }
    }

    function getImg(type: string): string {
        if (type != '') {
            return types.current.get(type)!.img;
        } else {
            return Icons.InfoProgress;
        }
    }

    return (
        <Modal isOpen={isOpen} style={progressStyles} contentLabel="Progressbar" ariaHideApp={false}>
            <div className="progress-container">
                <ProgressBar variant={variant} className="progressbar" animated now={progress} label={`${progress}%`} />
            </div>
            <div className="progress-log">
                <ul className="progress-log-info">
                    {log.map((item, index) => (
                        <li
                            key={index}
                            style={{
                                color: getColor(item.type),
                                fontSize: '15px',
                                marginBottom: '10px',
                            }}
                        >
                            <img src={getImg(item.type)} />
                            {item.value}
                        </li>
                    ))}
                </ul>
            </div>
            <p className="modal-title">Upload</p>
            <img src={Icons['CancelIcon']} className="cancel-icon" onClick={(): void => close()} />
            <Button ref={btnAbort} className="btn-progress-abort" onClick={onAbort}>
                <p className="btn-progress-txt">Abort</p>
            </Button>
            <Button ref={btnContinue} className="btn-progress-continue" onClick={onContinue}>
                <p className="btn-progress-txt">Continue</p>
            </Button>
        </Modal>
    );
});

export default ProgressbarUpload;
