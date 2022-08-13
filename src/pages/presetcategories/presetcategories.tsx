import Sidebar from '@components/sidebar/sidebar';
import React, { useRef, useState } from 'react';
import { Icons, ToolbarIcons } from '@src/utils/icons';
import { useSelector, useDispatch } from 'react-redux';
import { CombinedStates } from '@store/reducers/custom';
import Modal from 'react-modal';
import { categoryStyles } from '@src/styles/styles';
import { InputGroup, FormControl } from 'react-bootstrap';
import { SketchPicker } from 'react-color';
import { v4 as uuid } from 'uuid';
import { dialog, invoke } from '@tauri-apps/api';
import { addCategory, editCategory, deleteCategory } from '@services/general-services';
import Artwork from '@components/artwork/artwork';
import { Category } from '@src/types/general';
import { createObjectStoragePath } from '@src/utils/helpers';

const PresetCategories: React.FC = () => {
    const dispatch = useDispatch();
    const categories = useSelector<CombinedStates>((state) => state.presetReducer.categories) as Category[];
    const preauthreq = useSelector<CombinedStates>((state) => state.ociReducer.config.prereq) as string;
    const [addCategoryModal, setAddCategoryModal] = useState(false);
    const [name, setName] = useState('');
    const [nameInvalid, setNameInvalid] = useState('');
    const [description, setDescription] = useState('');
    const [descInvalid, setDescInvalid] = useState('');
    const [colorPicker, setColorPicker] = useState(false);
    const [color, setColor] = useState('#FFFFFF');
    const [type, setType] = useState('Add');
    const currentIt = useRef(0);
    const [inputDisabled, setInputDisabled] = useState(false);
    const [modalType, setModalType] = useState('create');
    const artworkRef = useRef<any>(null);
    const [categoryImg, setCategoryImg] = useState('');

    function onPlusClick(): void {
        setInputDisabled(false);
        setType('Add');
        setModalType('create');
        setAddCategoryModal(true);
    }

    function onModalClose(): void {
        setName('');
        setDescription('');
        setNameInvalid('');
        setDescInvalid('');
        setColor('#FFFFFF');
        setColorPicker(false);
        setAddCategoryModal(false);
    }

    function onColorChange(color: any): void {
        setColor(color.hex);
    }

    function onCategoryEdit(it: number): void {
        setName(categories[it].name);
        setDescription(categories[it].description);
        setColor(categories[it].color);
        currentIt.current = it;
        setInputDisabled(true);
        setType('Edit');
        const preview = createObjectStoragePath(preauthreq, [
            'presets',
            'categories',
            categories[it].id,
            'preview.jpeg',
        ]);
        setCategoryImg(preview);
        setModalType('edit');
        setAddCategoryModal(true);
    }

    async function addNewCategory(): Promise<void> {
        try {
            const file = artworkRef.current.getData() as string;
            const data = {
                name: name,
                id: uuid(),
                description: description,
                color: color,
            };
            const urlPath = createObjectStoragePath(preauthreq, [
                'presets',
                'categories',
                data.id,
                `preview.${file.split('.').pop()}`,
            ]);
            const result = (await invoke('upload_file', {
                name: 'cover art',
                path: urlPath,
                file: file,
            })) as any;
            if (result[0]) {
                await addCategory(data, 'presets');
                const temp = categories.map((x: any) => x);
                temp.push(data);
                dispatch({
                    type: 'preset/categories',
                    payload: temp,
                });
                dialog.message('Category added successfully!');
                onModalClose();
            } else {
                throw new Error('Could not upload category preview image');
            }
        } catch (error: any) {
            dialog.message(error.message);
        }
    }

    async function uploadChanges(category: Category): Promise<void> {
        try {
            const data = {
                name: category.name,
                id: category.id,
                description: description,
                color: color,
            };
            await editCategory(data, 'presets');
            const temp = categories.map((x: any) => x);
            temp[currentIt.current] = data;
            dispatch({
                type: 'preset/categories',
                payload: temp,
            });
            dialog.message('Category edited successfully!');
            onModalClose();
        } catch (error: any) {
            dialog.message(error.message);
        }
    }

    async function onAddCategory(): Promise<void> {
        let counter = 0;

        if (type === 'Add') {
            if (artworkRef.current.getInputValidation() === false) {
                counter++;
            }
        }
        if (name === '') {
            setNameInvalid('This field is mandatory');
            counter++;
        } else if (categories.find((x: any) => x.name === name) !== undefined) {
            if (type === 'Add') {
                setNameInvalid('Category already exists');
                counter++;
            }
        }
        if (description === '') {
            setDescInvalid('This field is mandatory');
            counter++;
        }

        if (counter === 0) {
            if (type === 'Add') {
                await addNewCategory();
            } else if (type === 'Edit') {
                await uploadChanges(categories[currentIt.current]);
            }
        }
    }

    async function onCategoryDelete(it: number): Promise<void> {
        try {
            await deleteCategory(categories[it], 'presets');
            const temp = categories.map((x: any) => x);
            temp.splice(it, 1);
            dispatch({
                type: 'preset/categories',
                payload: temp,
            });
        } catch (error: any) {
            dialog.message(error.message);
        }
    }

    return (
        <div className="page" id="page-upload-edit">
            <Sidebar />
            <div className="page-content">
                <h2 className="page-title">Preset categories</h2>
                <div className="categories-section">
                    <table className="table" id="categories-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>
                                    <img src={Icons.Palette} />
                                </th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories !== undefined &&
                                categories.map((row: any, i: number) => {
                                    return (
                                        <tr key={`${i}`} id={`${i}`}>
                                            <td>{i + 1}</td>
                                            <td>
                                                <p>{row.name}</p>
                                            </td>
                                            <td>
                                                <p>{row.description}</p>
                                            </td>
                                            <td>
                                                <div
                                                    className="color-table-btn"
                                                    style={{ background: row.color, cursor: 'default' }}
                                                />
                                            </td>
                                            <td>
                                                <img
                                                    src={Icons.DeleteRow}
                                                    onClick={(): Promise<void> => onCategoryDelete(i)}
                                                />
                                                <img
                                                    src={ToolbarIcons.EditIcon}
                                                    onClick={(): void => onCategoryEdit(i)}
                                                    style={{ marginLeft: '10px' }}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                    <div className="plus-body" onClick={onPlusClick}>
                        <img src={Icons.Plus} className="plus" />
                    </div>
                </div>
            </div>
            <Modal
                isOpen={addCategoryModal}
                onRequestClose={onModalClose}
                style={categoryStyles}
                ariaHideApp={false}
                shouldCloseOnOverlayClick={true}
                shouldCloseOnEsc={true}
                shouldReturnFocusAfterClose={true}
                contentLabel="Add category"
            >
                <p className="modal-title">Album categories</p>
                <img src={Icons['CancelIcon']} className="cancel-icon" onClick={onModalClose} />
                <div className="categories-wrapper">
                    <div className="category-image-div">
                        <Artwork
                            ref={artworkRef}
                            type={modalType}
                            className="category-image"
                            message="Please select an image for category"
                            img={categoryImg}
                        />
                    </div>
                    <div className="categories-modal-form">
                        <InputGroup hasValidation className="input-group input-group-area">
                            <InputGroup.Text className="label">Name</InputGroup.Text>
                            <FormControl
                                className="input"
                                disabled={inputDisabled}
                                required
                                value={name}
                                onChange={(event: any): void => {
                                    setName(event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1));
                                    setNameInvalid('');
                                }}
                            />
                            <p className="invalid-input invalid-name">{nameInvalid}</p>
                        </InputGroup>
                        <div className="color-group">
                            <InputGroup.Text className="label">Color</InputGroup.Text>
                            <div
                                className="color-picker-btn"
                                onClick={(): void => setColorPicker(!colorPicker)}
                                style={{ background: color }}
                            />
                            {colorPicker && (
                                <SketchPicker
                                    className="color-picker"
                                    color={color}
                                    onChange={onColorChange}
                                    width={'160px'}
                                />
                            )}
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
                    </div>
                    <button
                        className="category-add-btn"
                        onClick={(): void => {
                            onAddCategory();
                        }}
                    >
                        {type}
                    </button>
                    <button className="category-close-btn" onClick={onModalClose}>
                        Close
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default PresetCategories;
