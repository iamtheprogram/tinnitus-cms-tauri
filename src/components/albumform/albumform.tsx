import { db } from '@src/config/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { forwardRef, useState, useImperativeHandle, useEffect } from 'react';
import { InputGroup, FormControl } from 'react-bootstrap';
import Dropdown from '@components/dropdown/dropdown';
import { getDurationFormat, parseTags } from '@utils/helpers';
import { AlbumCategory, AlbumFormData } from '@src/types/album';
import { useSelector } from 'react-redux';

type FormProps = {
    type: string;
    data?: AlbumFormData;
};

const AlbumForm = forwardRef((props: FormProps, ref?: any) => {
    const categories = useSelector<any>((state) => state.generalReducer.categories) as AlbumCategory[];
    const [name, setName] = useState('');
    const [nameinvalid, setNameInvalid] = useState('');
    const [description, setDescription] = useState('');
    const [descInvalid, setDescInvalid] = useState('');
    const [notification, setNotification] = useState('');
    const [category, setCategory] = useState(categories[0].name);
    const [tags, setTags] = useState('');
    const [length, setLength] = useState('');

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
                        const q = query(collection(db, 'albums'), where('name', '==', name));
                        const querySnapshot = await getDocs(q);
                        if (querySnapshot.docs.length > 0) {
                            setNameInvalid('An album with this name already exists');
                            retVal++;
                        } else {
                            setNameInvalid('');
                        }
                    }
                } else if (props.type === 'create') {
                    const q = query(collection(db, 'albums'), where('name', '==', name));
                    const querySnapshot = await getDocs(q);
                    if (querySnapshot.docs.length > 0) {
                        setNameInvalid('An album with this name already exists');
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

    return (
        <div className="upload-album-info">
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
                <p className="invalid-input invalid-name">{nameinvalid}</p>
            </InputGroup>
            <div className="category">
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
    );
});

export default AlbumForm;
