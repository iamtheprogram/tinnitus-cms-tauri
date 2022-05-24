import React from 'react';
import { AlbumInfo } from '@src/types/album';
import { Icons } from '@src/utils/icons';
import { parseTags } from '@utils/helpers';

type AlbumInfoProps = {
    data: AlbumInfo;
};

const AlbumInfoView: React.FC<AlbumInfoProps> = (props: AlbumInfoProps) => {
    return (
        <div className="album-info-div">
            <div className="first-section">
                <div className="general-info">
                    <p>{`Name: ${props.data.name}`}</p>
                    <p>{`Category: ${props.data.category}`}</p>
                    <p>{`Total songs: ${props.data.total_songs}`}</p>
                    <p>{`Duration: ${props.data.length}`}</p>
                    <p>{`Upload date: ${props.data.upload_date}`}</p>
                    <p>{`Tags: ${props.data.tags[0] === '' ? 'N/A' : parseTags('string', props.data.tags)}`}</p>
                </div>
                <div className="usage-info">
                    <div className="usage-info-block">
                        <div className="usage-div">
                            <img src={Icons.Likes} />
                            <p>{props.data.likes}</p>
                        </div>
                        <div className="usage-div">
                            <img src={Icons.Favorites} />
                            <p>{props.data.favorites}</p>
                        </div>
                        <div className="usage-div">
                            <img src={Icons.Reviews} />
                            <p>{props.data.reviews}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="second-section">
                <p>Description:</p>
                <p>
                    <span style={{ fontFamily: 'Reboto' }}>{props.data.description}</span>
                </p>
            </div>
        </div>
    );
};

export default AlbumInfoView;
