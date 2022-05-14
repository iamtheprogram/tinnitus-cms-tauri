/* eslint-disable max-len */
import { getDurationFormat } from '@src/utils/helpers';
import { Icons } from '@utils/icons';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

type PlayerProps = {
    song?: string;
};

const Player = forwardRef((props: PlayerProps, ref: any) => {
    const [song, setSong] = useState(props.song);
    const [songName, setSongName] = useState('');
    const [currentTime, setCurrentTime] = useState('0:00');
    const [duration, setDuration] = useState('0:00');
    const isSongLoaded = useRef<any>(false);
    const playBtn = useRef<any>(null);
    const audio = useRef<any>(null);
    const timeline = useRef<any>(null);
    const slider = useRef<any>(null);
    const playIcon = useRef<any>(null);
    const dragActive = useRef<any>(false);

    useImperativeHandle(ref, () => ({
        setSong: (url: string): void => {
            setSong(url);
        },
    }));

    useEffect(() => {
        //Init player state
        if (song !== undefined) {
            isSongLoaded.current = false;
            playIcon.current.src = Icons.Play;
            setCurrentTime(getDurationFormat(Math.floor(audio.current.currentTime)));
            slider.current.style.width = '0px';
            setSongName(getSongName(song));
        }
    }, [song]);

    function getSongName(song: string): string {
        let name = song.slice(song.lastIndexOf('/') + 1);
        name = name.slice(0, name.lastIndexOf('.'));

        return name;
    }

    function toggleAudio(): void {
        if (audio.current.paused) {
            playIcon.current.src = Icons.Pause;
            audio.current.play();
        } else {
            audio.current.pause();
            playIcon.current.src = Icons.Play;
        }
        playBtn.current.classList.add('player-btn-bounce');
    }

    function changeTimelinePosition(): void {
        if (isSongLoaded.current) {
            //Calculate slider based on percentage
            const percentagePosition = (100 * audio.current.currentTime) / audio.current.duration;
            //Update time
            setCurrentTime(getDurationFormat(Math.floor(audio.current.currentTime)));
            setDuration(getDurationFormat(Math.floor(audio.current.duration)));
            if (dragActive.current === false) {
                slider.current.style.width = `${percentagePosition}%`;
            }
        }
    }

    function audioEnded(): void {
        //Reset player
        playIcon.current.src = Icons.Play;
        slider.current.style.width = '0px';
        setCurrentTime(getDurationFormat(Math.floor(0)));
    }

    function updateSlider(event: any): void {
        const bounds = timeline.current.getBoundingClientRect();
        const x = event.clientX - bounds.left - 10;
        const timelineVal = getValueFromWidth(x);
        audio.current.currentTime = Math.floor((timelineVal * audio.current.duration) / 100);
    }

    function getValueFromWidth(width: number): number {
        const totalWidth = timeline.current.offsetWidth;
        return (width * 100) / totalWidth;
    }

    function onTimelineClick(event: any): void {
        updateSlider(event);
    }

    function onThumbMouseDown(): void {
        dragActive.current = true;
    }

    function onTimelineMouseUp(event: any): void {
        if (dragActive.current) {
            updateSlider(event);
            dragActive.current = false;
        }
    }

    function onTimelineMouseMove(event: any): void {
        if (dragActive.current) {
            document.getElementById('thumb')!.style.cursor = 'pointer';
            timeline.current.style.cursor = 'pointer';
            const bounds = timeline.current.getBoundingClientRect();
            let x = event.clientX - bounds.left;
            if (x >= timeline.current.offsetWidth) {
                x = timeline.current.offsetWidth;
            }
            slider.current.style.width = `${x - 10}px`;
            const timelineVal = getValueFromWidth(x);
            setCurrentTime(getDurationFormat(Math.floor((timelineVal * audio.current.duration) / 100)));
        }
    }

    function onTimelineMouseLeave(event: any): void {
        if (dragActive.current) {
            document.getElementById('thumb')!.style.cursor = 'pointer';
            timeline.current.style.cursor = 'pointer';
            const bounds = timeline.current.getBoundingClientRect();
            const x = event.clientX - bounds.left;
            const timelineVal = getValueFromWidth(x);
            setCurrentTime(getDurationFormat(Math.floor((timelineVal * audio.current.duration) / 100)));
            dragActive.current = false;
        }
    }

    function onSongLoaded(): void {
        setDuration(getDurationFormat(Math.floor(audio.current.duration)));
        isSongLoaded.current = true;
    }

    function onPlayerBtnAnimationEnd(): void {
        playBtn.current.classList.remove('player-btn-bounce');
    }

    return (
        <div className="audio-player">
            <audio
                ref={audio}
                src={song}
                onTimeUpdate={changeTimelinePosition}
                onEnded={audioEnded}
                onLoadedData={onSongLoaded}
            ></audio>
            <div className="controls">
                <button
                    ref={playBtn}
                    className="player-button"
                    onClick={toggleAudio}
                    onAnimationEnd={onPlayerBtnAnimationEnd}
                >
                    <img ref={playIcon} src={Icons.Play} />
                </button>
                <div className="time-duration">
                    <p>{currentTime}</p>
                    <p style={{ marginLeft: '4px', marginRight: '4px' }}>/</p>
                    <p>{duration}</p>
                </div>
                <div
                    ref={timeline}
                    className="timeline"
                    onClick={onTimelineClick}
                    onMouseUp={onTimelineMouseUp}
                    onMouseMove={onTimelineMouseMove}
                    onMouseLeave={onTimelineMouseLeave}
                >
                    <div className="slider" ref={slider}></div>
                    <div id="thumb" className="thumb" onMouseDown={onThumbMouseDown}></div>
                </div>
            </div>
            <div className="song-name-section">
                <p>{songName}</p>
            </div>
        </div>
    );
});

export default Player;
