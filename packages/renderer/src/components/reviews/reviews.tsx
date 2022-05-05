import { getAlbumReviews } from '@services/album-services';
import { ReviewData } from '@src/types/album';
import React, { forwardRef, useState, useEffect } from 'react';
import { MessageBox } from '../messagebox/messagebox';
import Modal from 'react-modal';
import { dialogStyles } from '@src/styles/styles';
import Dropdown from '@components/dropdown/dropdown';
import { ToolbarIcons } from '@src/utils/icons';

type ViewProps = {
    id: string;
};

type ToolbarProps = {
    onUpdate: CallableFunction;
};

type ReviewItem = {
    data: ReviewData;
};

const ReviewView: React.FC<ViewProps> = (props: ViewProps) => {
    const [reviews, setReviews] = useState<ReviewData[]>([]);
    const [message, setMessage] = useState<string>('');
    const [messageOpen, setMessageOpen] = useState<boolean>(false);

    useEffect(() => {
        getAlbumReviews(props.id, new Date())
            .then((reviews) => {
                setReviews(reviews);
            })
            .catch((error) => {
                setMessage(error.message);
                setMessageOpen(true);
            });
    }, []);

    function onUpdate(): void {
        // TODO: Update reviews
    }

    return (
        <div className="review-container">
            <ReviewToolbar onUpdate={onUpdate} />
            <ul className="review-list">
                {reviews.map((review, key) => {
                    return (
                        <li key={key}>
                            <ReviewItem data={review} />
                        </li>
                    );
                })}
            </ul>
            <Modal isOpen={messageOpen} style={dialogStyles} contentLabel="Upload" ariaHideApp={false}>
                <MessageBox setIsOpen={setMessageOpen} message={message} />
            </Modal>
        </div>
    );
};

const ReviewToolbar = forwardRef((props: ToolbarProps, ref?: any) => {
    const [month, setMonth] = useState<number>(new Date().getMonth());
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [checked, setChecked] = useState(false);
    const [checkLabel, setCheckLabel] = useState<string>('Select all');
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    const years = ['2022'];

    function onBtnUpdate(): void {
        //Convert from month + year to timestamp
        props.onUpdate();
    }

    function onYearChange(value: string): void {
        setYear(parseInt(value));
    }

    function onMonthChange(value: string): void {
        setMonth(parseInt(value));
    }

    function onSelectAll(event: any): void {
        if (event.target.checked) {
            setChecked(true);
            setCheckLabel('Deselect all');
        } else {
            setChecked(false);
            setCheckLabel('Select all');
        }
    }

    return (
        <div className="review-toolbar">
            <p className="label">Month</p>
            <Dropdown items={months} className="dropdown-margin" onChange={onMonthChange} current={months[0]} />
            <p className="label">Year</p>
            <Dropdown items={years} className="dropdown-margin" onChange={onYearChange} current={years[0]} />
            <div className="checkbox-div">
                <input type="checkbox" onChange={onSelectAll} />
                <p className="label">{checkLabel}</p>
            </div>
            <img src={ToolbarIcons.DeleteIcon} />
            <button>Update</button>
        </div>
    );
});

const ReviewItem = forwardRef((props: ReviewItem, ref?) => {
    return (
        <div className="review-item">
            <div className="header">
                <p>{props.data.email}</p>
                <p>{props.data.date.toDateString()}</p>
            </div>
            <div className="section">
                <p>{props.data.comment}</p>
            </div>
        </div>
    );
});

export default ReviewView;
