import { Icons } from '@src/utils/icons';
import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import Dropdown from '@components/dropdown/dropdown';
import { SongData } from '@src/types/album';
import ReactTooltip from 'react-tooltip';
import { getDurationFormat } from '@utils/helpers';
import { CombinedStates } from '@store/reducers/custom';
import { useSelector } from 'react-redux';
import { invoke } from '@tauri-apps/api';

type TableProps = {
    type: string;
    headers: Array<any>;
    data?: Array<SongData>;
    calculateDuration?: CallableFunction;
    onRowSelected?: CallableFunction;
};

export const Table = forwardRef((props: TableProps, ref: any) => {
    const categories = useSelector<CombinedStates>((state) => state.generalReducer.categories) as string[];
    const [invalid, setInvalid] = useState('');
    const table = useRef(null);
    const [tableData, setTableData] = useState(Array<SongData>());
    const loadingEl = (
        <div id="table-loading">
            <img src={Icons.Loading} className="table-loading-anim" />
        </div>
    );

    useEffect(() => {
        if (props.type === 'view' || props.type === 'edit') {
            setTableData(props.data!);
        } else {
            //No data to be displayed
        }
    }, [props.data]);

    useEffect(() => {
        if (props.type === 'create' || props.type === 'edit') {
            const durations = new Array<string>();
            for (const song of tableData) {
                durations.push(song.length);
            }
            props.calculateDuration!(durations);
        } else if (props.type === 'view') {
            //For view mode double-click event needs to be set to pass selected song back to parent
            for (let i = 0; i < tableData.length; i++) {
                const element = document.getElementById(i.toString())!;
                //Set
                element.style.cursor = 'pointer';
                element.addEventListener('click', () => {
                    //Pass selected song back to parent
                    props.onRowSelected!(tableData[i]);
                    //Start animation
                    element.classList.add('table-row-animation');
                });
            }
        }
    }, [tableData]);

    function verifyHeaders(): Array<any> {
        const temp = Object.assign([], props.headers);
        if (props.type === 'create' || props.type === 'edit') {
            temp.push(loadingEl);
        }

        return temp;
    }

    useImperativeHandle(ref, () => ({
        getData: (): Array<SongData> => {
            return tableData;
        },

        clearInternalStates: (): void => {
            setTableData([]);
        },

        getInputValidation: async (): Promise<boolean> => {
            if (tableData.length === 0) {
                setInvalid('Please add at least one item');
                return false;
            } else {
                for (const entry of tableData) {
                    if (entry.name === '' || entry.category === '') {
                        setInvalid('All fields are mandatory');
                        return false;
                    } else {
                        setInvalid('');
                        return true;
                    }
                }
            }
            return false;
        },
    }));

    function onCategoryChange(value: string, id: string): void {
        const temp = tableData.map((x) => x);
        const index = id[id.length - 1] as unknown as number;
        temp[index].category = value;
        setTableData(temp);
    }

    function onRowAnimationStart(id: number): void {
        if (props.type === 'edit' || props.type === 'create') {
            //Also set animation to the input fields in the row
            document.getElementById(`row-name-${id}`)!.classList.add('table-row-animation');
            document.getElementById(`row-category-${id}`)!.classList.add('table-row-animation');
        }
    }

    function onRowAnimationEnd(id: number): void {
        if (props.type === 'edit' || props.type === 'create') {
            //Remove animations from row level and inputs inside the row
            document.getElementById(`row-name-${id}`)!.classList.remove('table-row-animation');
            document.getElementById(`row-category-${id}`)!.classList.remove('table-row-animation');
        }
        document.getElementById(`${id}`)!.classList.remove('table-row-animation');
    }

    function displayName(type: string, index: number, name: string): any {
        if (type === 'view' || type === 'edit') {
            return <td>{name}</td>;
        } else if (type === 'create') {
            return (
                <td>
                    <input
                        id={`row-name-${index}`}
                        className="input-name"
                        value={name}
                        onChange={(event): void => onChangeName(event, index)}
                    />
                </td>
            );
        }
    }

    function onChangeName(event: any, id: number): void {
        const temp = tableData.map((x) => x);
        temp[id].name = event.target.value;
        setTableData(temp);
    }

    function displayCategory(type: string, id: number, category?: string): any {
        if (type === 'view') {
            return <p>{category}</p>;
        } else if (type === 'create' || type === 'edit') {
            return (
                <Dropdown
                    id={`row-category-${id}`}
                    items={categories}
                    className="dropdown-category"
                    onChange={onCategoryChange}
                    current={tableData[id].category}
                />
            );
        }
    }

    function deleteEntry(id: number): void {
        const temp = tableData.map((x) => x);
        temp.splice(id, 1);
        //Replace all positions
        for (let i = 0; i < temp.length; i++) {
            temp[i].pos = i + 1;
        }

        setTableData(temp);
    }

    async function onPlusClick(): Promise<void> {
        const dialog = (await invoke('get_audio_files')) as any;
        if (dialog[0] !== undefined) {
            document.getElementById('table-loading')!.style.display = 'flex';
            const temp = [];
            let position = tableData.length > 0 ? tableData.length + 1 : 1;
            for (const song of dialog[1]) {
                temp.push({
                    file: song.file,
                    extension: song.extension,
                    name: song.name,
                    pos: position++,
                    length: getDurationFormat(song.duration),
                    category: categories[0],
                    likes: 0,
                    favorites: 0,
                    views: 0,
                });
            }
            setTableData([...tableData, ...temp]);
            setInvalid('');
            //Loading ended
            document.getElementById('table-loading')!.style.display = 'none';
            //Trigger animation for new inserted entry
            // document.getElementById(`${tableData.length}`)!.classList.add('table-row-animation');
        }
    }

    function moveUp(id: number): void {
        const temp = tableData.map((x) => x);
        const tempEl = temp[id];
        let currentRowHtml;

        if (id === 0) {
            //Already the first position
        } else {
            //Interchange elements and change positions in album
            temp[id] = temp[id - 1];
            temp[id].pos = (temp[id].pos as number) + 1;
            temp[id - 1] = tempEl;
            temp[id - 1].pos = (temp[id - 1].pos as number) - 1;
            //Set highlight animation
            currentRowHtml = document.getElementById(`${id - 1}`)!;
            currentRowHtml.classList.add('table-row-animation');
            setTableData(temp);
        }
    }

    function moveDown(id: number): void {
        const temp = tableData.map((x) => x);
        const tempEl = temp[id];
        let currentRowHtml;

        if (id == temp.length - 1) {
            //Already the last position
        } else {
            //Interchange elements and change positions in album
            temp[id] = temp[id + 1];
            temp[id].pos = (temp[id].pos as number) - 1;
            temp[id + 1] = tempEl;
            temp[id + 1].pos = (temp[id + 1].pos as number) + 1;
            //Set highlight animation
            currentRowHtml = document.getElementById(`${id + 1}`)!;
            currentRowHtml.classList.add('table-row-animation');
            setTableData(temp);
        }
    }

    return (
        <div className="table-section">
            <table className="table" id="album-table" ref={table}>
                <thead>
                    <tr>
                        {verifyHeaders().map((header, i) => (
                            <th id={`table-edit-header-${i}`} key={`${i}`}>
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row, i) => {
                        return (
                            <tr
                                id={`${i}`}
                                key={`${i}`}
                                onAnimationStart={(): void => {
                                    onRowAnimationStart(i);
                                }}
                                onAnimationEnd={(): void => {
                                    onRowAnimationEnd(i);
                                }}
                            >
                                <td>{row.pos}</td>
                                {displayName(props.type, i, row.name)}
                                <td>{row.length}</td>
                                <td id={`row-category-${i}`} className="category">
                                    {displayCategory(props.type, i, row.category)}
                                </td>
                                {props.type === 'view' ? <td> {row.views}</td> : null}
                                {props.type === 'view' ? <td> {row.likes}</td> : null}
                                {props.type === 'view' ? <td> {row.favorites}</td> : null}
                                {props.type === 'create' || props.type === 'edit' ? (
                                    <td>
                                        <div className="table-row-func">
                                            {/* Delete icon */}
                                            {props.type === 'create' ? (
                                                <img
                                                    src={Icons.DeleteRow}
                                                    className="remove-icon"
                                                    onClick={(): void => deleteEntry(i)}
                                                />
                                            ) : null}
                                            {/* Up & Down buttons */}
                                            <div className="nav-section">
                                                <img src={Icons.Up} onClick={(): void => moveUp(i)} />
                                                <img
                                                    src={Icons.Down}
                                                    className="down"
                                                    onClick={(): void => moveDown(i)}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                ) : null}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <p className="invalid-input invalid-table">{invalid}</p>
            {props.type === 'create' ? (
                <div className="plus-body" onClick={onPlusClick}>
                    <img src={Icons.Plus} className="plus" />
                    {/* <input
                        ref={inputSong}
                        className="input-plus"
                        type="file"
                        accept="audio/*"
                        onChange={(event): Promise<void> => getSong(event)}
                    /> */}
                </div>
            ) : null}
            <ReactTooltip />
        </div>
    );
});
