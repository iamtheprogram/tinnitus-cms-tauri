import { Icons } from '@src/utils/icons';
import React, { useState, useRef, useEffect } from 'react';

type DropdownProps = {
    id?: string;
    className?: string;
    items: Array<string>;
    onChange?: any;
    current?: string;
};

const Dropdown: React.FC<DropdownProps> = (props: DropdownProps) => {
    const [toggle, setToggle] = useState(true);
    const list = useRef<any>(null);
    const [selected, setSelected] = useState(props.current !== null ? props.current : 'General');

    useEffect(() => {
        setSelected(props.current);
    }, [props.current]);

    function onDropdownClick(): void {
        if (toggle === true) {
            list.current.style.height = '200px';
            list.current.style.border = '1px solid aquamarine';
            list.current.style.overflowY = 'auto';
        } else {
            list.current.style.height = '0px';
            list.current.style.border = 'none';
            list.current.style.overflowY = 'hidden';
        }

        setToggle(!toggle);
    }

    function onListClick(value: string): void {
        setSelected(value);
        props.onChange(value, props.id);
    }

    return (
        <div className={`dropdown ${props.className}`} onClick={onDropdownClick}>
            <p>{selected}</p>
            <img src={Icons.ArrowDown} />
            <ul ref={list}>
                {props.items.map((item, key) => {
                    return (
                        <li key={key} onClick={(): void => onListClick(item)}>
                            {item}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Dropdown;
