import React, { createRef, forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { Icons } from '@utils/icons';
import { dialogStyles, tableStyles } from '@src/styles/styles';
import Modal from 'react-modal';
import { MessageBox } from '@src/components/messagebox/messagebox';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { db } from '@src/config/firebase';
import { useNavigate } from 'react-router-dom';
import Reslist from '../reslist/reslist';
import { useSelector } from 'react-redux';
import { CombinedStates } from '@store/reducers/custom';
import { createObjectStoragePath } from '@src/utils/helpers';

type SearchProps = {
    type: string;
};

const SearchBar = forwardRef((props: SearchProps, ref?: any) => {
    const navigate = useNavigate();
    const [searchVal, setSearchVal] = useState('');
    const [tableOpen, setTableOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [tableElements, setTableElements] = useState<any>([]);
    const [selected, setSelected] = useState({ name: '' });
    const [searchedAlbums, setSearchedAlbums] = useState<any[]>([]);
    const reslistRef = createRef<any>();
    const preauthreq = useSelector<CombinedStates>((state) => state.ociReducer.config.prereq) as string;

    useEffect(() => {
        if (selected !== null && selected.name != searchVal) {
            getResourceData();
        } else {
            document.getElementById('searchbar-results')!.style.display = 'none';
        }
    }, [searchVal]);

    useImperativeHandle(ref, () => ({
        setSearchValue: (value: string): void => {
            setSearchVal(value);
        },
    }));

    async function getResourceData(): Promise<void> {
        if (searchVal != '') {
            try {
                //Convert first letter to uppercase
                const temp = searchVal[0].toUpperCase() + searchVal.slice(1);
                const albums = [];
                //Search for album starting with the given string
                const albumsRef = collection(db, 'albums');
                const q = query(albumsRef, where('name', '>=', temp), limit(7));
                const q1 = query(q, where('name', '<=', temp + '\uf8ff'), limit(7));
                const querySnapshot = await getDocs(q1);
                const docs = querySnapshot.docs;
                if (docs.length > 0) {
                    //Take all data now to avoid doing an additional request
                    for (const doc of docs) {
                        const data = doc.data();
                        const arworkUrl = createObjectStoragePath(preauthreq, [
                            'albums',
                            doc.id,
                            `artwork.${data.extension}`,
                        ]);
                        albums.push({
                            id: doc.id,
                            name: data.name,
                            upload_date: data.upload_date.toDate().toDateString(),
                            category: data.category,
                            description: data.description,
                            tags: data.tags,
                            length: data.length,
                            artwork: arworkUrl,
                            songs: data.songs,
                            total_songs: data.total_songs,
                            likes: data.likes,
                            favorites: data.favorites,
                            reviews: data.reviews,
                        });
                    }
                    setSearchedAlbums(albums);
                    //Show search results
                    document.getElementById('searchbar-results')!.style.display = 'flex';
                } else {
                    //No results found
                    document.getElementById('searchbar-results')!.style.display = 'none';
                }
            } catch (error: any) {
                //Notify user about error
                setMessage(error.message);
                setDialogOpen(true);
            }
        } else {
            //No input given
            document.getElementById('searchbar-results')!.style.display = 'none';
            setSearchedAlbums([]);
        }
    }

    // async function getListOfResources(): Promise<void> {
    //     const albumsRef = collection(db, 'albums');
    //     const docs = await getDocs(albumsRef);
    //     const temp = [];
    //     //Get all albums documents
    //     for (const doc of docs.docs) {
    //         const data = doc.data();
    //         temp.push({
    //             id: doc.id,
    //             name: data.name,
    //             artwork: `${prereq}${doc.id}/artwork.${data.extension}`,
    //             upload_date: data.upload_date.toDate().toDateString(),
    //             upload_sort: data.upload_date.toDate(),
    //         });
    //     }
    //     //Sort elements by date
    //     temp.sort(compareByDateDesc);
    //     //Provide data to basic resource table
    //     setTableElements(temp);
    //     setTableOpen(true);
    // }

    function compareByDateDesc(a: any, b: any): number {
        if (a.upload_sort < b.upload_sort) {
            return 1;
        }
        if (a.upload_sort > b.upload_sort) {
            return -1;
        }
        return 0;
    }

    function closeListView(): void {
        setTableOpen(false);
    }

    function cancelList(): void {
        setTableOpen(false);
    }

    function okList(): void {
        //Get selected item from resource table
        const item = reslistRef.current.getSelectedItem();
        if (item !== undefined) {
            navigate(`/album/view/${item.id}`);
        }
        setTableOpen(false);
    }

    function onItemClick(name: string): void {
        setSearchVal(name);
        if (searchedAlbums.length > 0) {
            //Get selected album from search results
            const selectedItem = searchedAlbums.find((item) => item.name === name);
            setSelected(selectedItem);
            document.getElementById('searchbar-results')!.style.display = 'none';
            setSearchVal('');
            navigate(`/album/view/${selectedItem.id}`);
        }
    }

    async function onSearchBtnClick(): Promise<void> {
        await getResourceData();
        if (searchedAlbums.length > 0) {
            //Get selected album from given input
            const selectedItem = searchedAlbums.find((item) => item.name === searchVal);
            document.getElementById('searchbar-results')!.style.display = 'none';
            if (selectedItem !== undefined) {
                setSelected(selectedItem);
                setSearchVal('');
                navigate(`/album/view/${selectedItem.id}`);
            }
        }
    }

    return (
        <InputGroup className="SearchGroup">
            <div
                className="searchbar-div"
                // onBlur={(): void => {
                //     document.getElementById('searchbar-results').style.display = 'none';
                // }}
            >
                <FormControl
                    id="searchbar-albums"
                    placeholder={'Album name...'}
                    autoComplete="off"
                    autoCapitalize="on"
                    autoCorrect="off"
                    aria-label={`${props.type}`}
                    aria-describedby="basic-addon2"
                    className="SearchBar"
                    value={searchVal}
                    onChange={(event: any): void => {
                        setSearchVal(event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1));
                    }}
                />
                <div id="searchbar-results">
                    {searchedAlbums.map((album: any, key: number) => (
                        <div
                            className="searchbar-result-item"
                            key={key}
                            onClick={(): void => onItemClick(album.name)}
                            id={album.name}
                        >
                            <img src={album.artwork} />
                            <p className="album-name">{album.name}</p>
                            <p className="album-upload-date">{album.upload_date}</p>
                        </div>
                    ))}
                </div>
            </div>
            <Button className="SearchButton" onClick={onSearchBtnClick}>
                <img src={Icons['MagnifierIcon']} className="SearchIcon"></img>
            </Button>
            {/* <Button className="SearchButton" style={{ marginLeft: '5px' }} onClick={getListOfResources}>
                <img src={Icons['ListIcon']} className="SearchIcon"></img>
            </Button> */}
            <Modal style={dialogStyles} isOpen={dialogOpen} ariaHideApp={false}>
                <MessageBox setIsOpen={setDialogOpen} message={message} />
            </Modal>
            <Modal style={tableStyles} isOpen={tableOpen} ariaHideApp={false}>
                <Reslist ref={reslistRef} entries={tableElements} onSelectFromList={onItemClick} />
                <p className="modal-title">Albums</p>
                <img src={Icons['CancelIcon']} className="cancel-icon" onClick={closeListView} />
                <Button className="ListOk" onClick={okList}>
                    OK
                </Button>
                <Button className="ListCancel" onClick={cancelList}>
                    Cancel
                </Button>
            </Modal>
        </InputGroup>
    );
});

export default SearchBar;
