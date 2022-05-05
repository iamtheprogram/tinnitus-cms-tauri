import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './_reslist.sass';

type ReslistProps = {
    entries?: any[];
    onSelectFromList?: any;
};

type AlbumItem = {
    id: string;
    name: string;
    artwork: string;
    upload_date: string;
};

const Reslist = forwardRef((props: ReslistProps, ref?: any) => {
    const [selected, setSelected] = useState('');
    const navigate = useNavigate();

    useImperativeHandle(ref, () => ({
        getSelectedItem: (): AlbumItem => {
            return props.entries!.find((entry: AlbumItem) => entry.name === selected);
        },
    }));

    function itemSelected(name: string): void {
        setSelected(name);
    }

    function onItemDblClick(id: string): void {
        navigate(`/album/view/${id}`);
    }

    function displayList(): JSX.Element {
        if (props.entries!.length > 0) {
            //Return a list of resources for this category
            return (
                <ul className="ListView">
                    {props.entries!.map((item, index) => (
                        <li
                            key={index}
                            tabIndex={-1}
                            onClick={(): void => itemSelected(item.name)}
                            onDoubleClick={(): void => onItemDblClick(item.id)}
                        >
                            <div className="ListItem">
                                <img src={item.artwork} className="list-item-artwork" />
                                <div className="ListItemInfo">
                                    <h4>{item.name}</h4>
                                    <p>{'Upload date: ' + item.upload_date}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            );
        }
        //Let user know that there is no resource for this category
        else {
            return <p>There is no item in the album collection or application failed to fetch data.</p>;
        }
    }

    return <div className="ListContainer">{displayList()}</div>;
});

export default Reslist;
