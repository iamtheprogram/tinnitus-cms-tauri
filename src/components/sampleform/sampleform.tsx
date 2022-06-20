import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { SampleFormData } from '@src/types/sample';
import { useSelector } from 'react-redux';
import { Category } from '@src/types/general';
import { createObjectStoragePath, getDurationFormat, parseTags } from '@utils/helpers';
import { db } from '@config/firebase';
import { query, collection, where, getDocs, doc } from 'firebase/firestore';
import { AlbumFormData } from 'types/album';
import { InputGroup, FormControl } from 'react-bootstrap';
import Dropdown from '@components/dropdown/dropdown';
import { invoke } from '@tauri-apps/api';
import Artwork from '@components/artwork/artwork';
import { CombinedStates } from '@store/reducers/custom';
import { deleteSample, uploadSampleInfo } from '@services/sample-services';
import ProgressbarUpload from '@components/progressbar/progressbar-upload';
import axios from 'axios';

type FormProps = {
    type: string;
    data?: SampleFormData;
};

const SampleForm = forwardRef((props: FormProps, ref?: any) => {
    const categories = useSelector<CombinedStates>((state) => state.sampleReducer.categories) as Category[];
    const preauthreq = useSelector<CombinedStates>((state: CombinedStates) => state.ociReducer.config.prereq) as string;
    const [name, setName] = useState('');
    const [nameinvalid, setNameInvalid] = useState('');
    const [description, setDescription] = useState('');
    const [descInvalid, setDescInvalid] = useState('');
    const [notification, setNotification] = useState('');
    const [category, setCategory] = useState(categories[0].name);
    const [tags, setTags] = useState('');
    const [length, setLength] = useState('');
    const file = useRef<string>('');
    const [fileInvalid, setFileInvalid] = useState('');
    const extension = useRef<string>();
    const artworkRef = useRef<any>(null);
    const progressbarRef = useRef<any>(null);
    const cancelSource = useRef(axios.CancelToken.source());

    useEffect(() => {
        if (props.data !== undefined && props.type === 'edit') {
            setName(props.data.name);
            setDescription(props.data.description);
            setTags(parseTags('string', props.data.tags));
            setLength(props.data.length);
            setCategory(props.data.category);
        }
    }, []);

    useImperativeHandle(ref, () => ({
        getData: (): AlbumFormData => {
            return {
                name: name,
                description: description,
                extension: '',
                tags: parseTags('array', tags),
                length: length,
                notification: notification,
                category: category,
            };
        },

        setTotalDuration: (value: Array<string>): void => {
            setLength(getDurationFormat(calculateTotalLength(value)));
        },

        clearInternalStates: (): void => {
            setName('');
            setDescription('');
            setTags('');
            setLength('');
            setNotification('');
            setCategory(categories[0].name);
        },

        getInputValidation: async (): Promise<boolean> => {
            let retVal = 0;

            if (name === '') {
                setNameInvalid('This field is mandatory');
                retVal++;
            } else {
                //Different behaviour depending on the type
                if (props.type === 'edit') {
                    //Check if new provided name is different from the old one
                    if (name !== props.data!.name) {
                        const q = query(collection(db, 'samples'), where('name', '==', name));
                        const querySnapshot = await getDocs(q);
                        if (querySnapshot.docs.length > 0) {
                            setNameInvalid('A sample with this name already exists');
                            retVal++;
                        } else {
                            setNameInvalid('');
                        }
                    }
                } else if (props.type === 'create') {
                    const q = query(collection(db, 'samples'), where('name', '==', name));
                    const querySnapshot = await getDocs(q);
                    if (querySnapshot.docs.length > 0) {
                        setNameInvalid('A sample with this name already exists');
                        retVal++;
                    } else {
                        setNameInvalid('');
                    }
                }
            }
            if (description === '') {
                setDescInvalid('This field is mandatory');
                retVal++;
            } else {
                setDescInvalid('');
            }
            if (retVal === 0) {
                return true;
            } else {
                return false;
            }
        },
    }));

    function onCategoryChange(value: string): void {
        const temp = categories.find((c) => c.name === value);
        setCategory(temp!.name);
    }

    function calculateTotalLength(songs: Array<string>): number {
        let seconds = 0;
        let minutes = 0;
        let hours = 0;
        //Extract hours, minutes and seconds
        for (let i = 0; i < songs.length; i++) {
            hours += parseInt(songs[i].slice(0, 2));
            minutes += parseInt(songs[i].slice(3, 5));
            seconds += parseInt(songs[i].slice(6));
        }
        //Calculate total length in seconds
        return hours * 3600 + minutes * 60 + seconds;
    }

    async function onBrowseClick(): Promise<void> {
        const dialog = (await invoke('get_audio_files')) as any;
        if (dialog[0] !== undefined) {
            const sampleData = dialog[1][0];
            file.current = sampleData.file;
            extension.current = sampleData.extension;
            setName(sampleData.name);
            setLength(getDurationFormat(sampleData.duration));
            setNameInvalid('');
            setFileInvalid('');
        }
    }

    async function validateInputs(): Promise<boolean> {
        let counter = 0;
        const artworkValidation = await artworkRef.current.getInputValidation();

        if (name === '') {
            setNameInvalid('This field is mandatory');
            counter++;
        } else {
            //Different behaviour depending on the type
            if (props.type === 'edit') {
                //Check if new provided name is different from the old one
                if (name !== props.data!.name) {
                    const q = query(collection(db, 'samples'), where('name', '==', name));
                    const querySnapshot = await getDocs(q);
                    if (querySnapshot.docs.length > 0) {
                        setNameInvalid('A sample with this name already exists');
                        counter++;
                    } else {
                        setNameInvalid('');
                    }
                }
            } else if (props.type === 'create') {
                const q = query(collection(db, 'samples'), where('name', '==', name));
                const querySnapshot = await getDocs(q);
                if (querySnapshot.docs.length > 0) {
                    setNameInvalid('A sample with this name already exists');
                    counter++;
                } else {
                    setNameInvalid('');
                }
            }
        }
        if (description === '') {
            setDescInvalid('This field is mandatory');
            counter++;
        }
        if (file === undefined || file.current === '') {
            setFileInvalid('Please select an audio file');
            counter++;
        }
        if (artworkValidation === false) {
            counter++;
        }

        if (counter === 0) {
            return true;
        } else {
            return false;
        }
    }

    async function onUploadClick(): Promise<void> {
        if (await validateInputs()) {
            const docRef = doc(collection(db, 'samples'));
            try {
                let progress = 10;
                //Initialize progress bar and start uploading
                progressbarRef.current.enable(true);
                updateProgress(progress, 'info', 'Uploading sample...');
                //Upload sample audio
                let urlPath = createObjectStoragePath(preauthreq, [
                    'samples',
                    docRef.id,
                    `${name}.${extension.current}`,
                ]);
                const result = (await invoke('upload_file', {
                    name: name,
                    path: urlPath,
                    file: file.current,
                })) as any;
                if (result[0]) {
                    updateProgress((progress += 50), 'success', `Sample ${name} uploaded successfully`);
                } else {
                    throw new Error(result[1]);
                }
                //Upload artwork
                const preview = artworkRef.current.getData();
                urlPath = createObjectStoragePath(preauthreq, [
                    'samples',
                    docRef.id,
                    `preview.${preview.split('.').pop()}`,
                ]);
                const previewResult = (await invoke('upload_file', {
                    name: name,
                    path: urlPath,
                    file: preview,
                })) as any;
                if (previewResult[0]) {
                    updateProgress((progress += 20), 'success', `Preview for sample ${name} uploaded successfully`);
                } else {
                    throw new Error(previewResult[1]);
                }
                //Register sample in db
                const formData = {
                    name: name,
                    description: description,
                    tags: parseTags('array', tags),
                    extension: extension.current,
                    length: length,
                    category: category,
                };
                const response = await uploadSampleInfo(docRef.id, formData);
                updateProgress(100, 'success', response);
                progressbarRef.current.logMessage('info', 'All sample data uploaded successfully!');
                clearStates();
            } catch (error: any) {
                deleteSample(docRef.id);
                progressbarRef.current.operationFailed(error.message);
                //Create a new cancel token
                cancelSource.current = axios.CancelToken.source();
            }
        }
    }

    function onUploadCancelled(): void {
        cancelSource.current.cancel('User cancelled upload');
    }

    function clearStates(): void {
        artworkRef.current.clearInternalStates();
        file.current = '';
        extension.current = '';
        setName('');
        setDescription('');
        setTags('');
        setLength('');
        setNotification('');
        setCategory(categories[0].name);
    }

    function updateProgress(progress: number, type: string, message: string): void {
        progressbarRef.current.setProgress(progress);
        progressbarRef.current.logMessage(type, message);
    }

    return (
        <div className="sample-form">
            <div className="coverart-div">
                <Artwork
                    ref={artworkRef}
                    type="create"
                    className="sample-preview-image"
                    message="Please select a preview image for info"
                />
            </div>
            <div className="inputs-div">
                <div className="form-items">
                    <InputGroup hasValidation className="input-group">
                        <InputGroup.Text className="label">Name</InputGroup.Text>
                        <FormControl
                            disabled={props.type === 'edit' ? true : false}
                            className="input"
                            required
                            value={name}
                            onChange={(event: any): void => {
                                setName(event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1));
                                setNameInvalid('');
                            }}
                        />
                    </InputGroup>
                    <p className="invalid-input invalid-name">{nameinvalid}</p>
                    <div className="category-sample">
                        <p>Category</p>
                        <Dropdown
                            items={categories.map((c) => c.name)}
                            className="dropdown-margin"
                            onChange={onCategoryChange}
                            current={category}
                        />
                    </div>
                    <InputGroup hasValidation className="input-group input-group-area">
                        <InputGroup.Text className="label">Description</InputGroup.Text>
                        <FormControl
                            className="input-description"
                            required
                            as="textarea"
                            value={description}
                            onChange={(event): void => {
                                setDescription(event.target.value);
                                setDescInvalid('');
                            }}
                        />
                        <p className="invalid-input invalid-desc">{descInvalid}</p>
                    </InputGroup>
                    <InputGroup hasValidation className="input-group input-group-area">
                        <InputGroup.Text className="label">Tags (optional)</InputGroup.Text>
                        <FormControl
                            className="input-tag"
                            required
                            as="textarea"
                            value={tags}
                            placeholder="#tag1 #tag2 #tag3"
                            onChange={(event): void => setTags(event.target.value)}
                        />
                    </InputGroup>
                    {props.type === 'create' ? (
                        <InputGroup hasValidation className="input-group input-group-area">
                            <InputGroup.Text className="label">Notification (optional)</InputGroup.Text>
                            <FormControl
                                className="input-notification"
                                required
                                as="textarea"
                                value={notification}
                                onChange={(event): void => setNotification(event.target.value)}
                            />
                        </InputGroup>
                    ) : null}
                    <p className="album-total-duration">Duration: {length}</p>
                </div>
                <div className="form-btns">
                    <button className="browse-btn-sample" onClick={onBrowseClick}>
                        Browse
                    </button>
                    <p className="invalid-input-sample">{fileInvalid}</p>
                    <button className="upload-btn-sample" onClick={onUploadClick}>
                        Upload
                    </button>
                </div>
            </div>
            <ProgressbarUpload ref={progressbarRef} abort={onUploadCancelled} />
        </div>
    );
});

export default SampleForm;
