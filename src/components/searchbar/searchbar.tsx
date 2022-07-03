import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { Icons } from '@utils/icons';
import { dialogStyles } from '@src/styles/styles';
import Modal from 'react-modal';
import { MessageBox } from '@src/components/messagebox/messagebox';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { db } from '@src/config/firebase';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CombinedStates } from '@store/reducers/custom';
import { createObjectStoragePath } from '@src/utils/helpers';

type SearchProps = {
    type: string;
    pathToSearch: string;
    navigate: string;
};

const SearchBar = forwardRef((props: SearchProps, ref?: any) => {
    const navigate = useNavigate();
    const [searchVal, setSearchVal] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [selected, setSelected] = useState({ name: '' });
    const [searchedAlbums, setSearchedAlbums] = useState<any[]>([]);
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
                const albumsRef = collection(db, props.pathToSearch);
                const q = query(albumsRef, where('name', '>=', temp), limit(7));
                const q1 = query(q, where('name', '<=', temp + '\uf8ff'), limit(7));
                const querySnapshot = await getDocs(q1);
                const docs = querySnapshot.docs;
                if (docs.length > 0) {
                    //Take all data now to avoid doing an additional request
                    for (const doc of docs) {
                        const data = doc.data();
                        const arworkUrl = createObjectStoragePath(preauthreq, ['albums', doc.id, `artwork.jpeg`]);
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

    function onItemClick(name: string): void {
        setSearchVal(name);
        if (searchedAlbums.length > 0) {
            //Get selected album from search results
            const selectedItem = searchedAlbums.find((item) => item.name === name);
            setSelected(selectedItem);
            document.getElementById('searchbar-results')!.style.display = 'none';
            setSearchVal('');
            navigate(`${props.navigate}${selectedItem.id}`);
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
                navigate(`${props.navigate}${selectedItem.id}`);
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
                    id="searchbar-items"
                    placeholder={`Search ${props.type}...`}
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
                            {props.type === 'album' && <img src={album.artwork} />}
                            <p className="item-name">{album.name}</p>
                            <p className="item-upload-date">{album.upload_date}</p>
                        </div>
                    ))}
                </div>
            </div>
            <Button className="SearchButton" onClick={onSearchBtnClick}>
                <img src={Icons['MagnifierIcon']} className="SearchIcon"></img>
            </Button>
            <Modal style={dialogStyles} isOpen={dialogOpen} ariaHideApp={false}>
                <MessageBox setIsOpen={setDialogOpen} message={message} />
            </Modal>
        </InputGroup>
    );
});

export default SearchBar;
