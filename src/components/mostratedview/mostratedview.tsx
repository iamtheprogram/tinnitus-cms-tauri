import React from 'react';
import { FormControl } from 'react-bootstrap';

const MostRatedView: React.FC = () => {
    return (
        <div className="mostrated-div">
            <div className="mostrated-toolbar">
                <div className="toolbar-section-div">
                    <p style={{ marginRight: '5px' }}>Top</p>
                    <FormControl as="select" className="mostrated-select">
                        <option>1</option>
                        <option>3</option>
                        <option>5</option>
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                        <option>100</option>
                        <option>500</option>
                    </FormControl>
                </div>
                <div className="toolbar-section-div toolbar-div-margin">
                    <p style={{ marginRight: '5px' }}>Class</p>
                    <FormControl as="select" className="mostrated-select">
                        <option>Views</option>
                        <option>Likes</option>
                        <option>Favourites</option>
                        <option>Reviews</option>
                        <option>Categories</option>
                    </FormControl>
                </div>
                <div className="toolbar-section-div toolbar-div-margin">
                    <p style={{ marginRight: '5px' }}>Category</p>
                    <FormControl as="select" className="mostrated-select">
                        <option>Albums</option>
                        <option>Samples</option>
                        <option>Presets</option>
                    </FormControl>
                </div>
            </div>
            <div className="mostrated-table-div">
                <table className="mostrated-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Name</th>
                            <th>Views</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Album test 1</td>
                            <td>100000</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MostRatedView;
