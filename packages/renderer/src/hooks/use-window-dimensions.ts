import { useState, useEffect } from 'react';

function getWindowDimensions(): { width: number; height: number } {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height,
    };
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function useWindowDimensions(): {
    width: number;
    height: number;
} {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize(): void {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return (): void => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}
