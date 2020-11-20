import React, { useRef } from 'react';
import ReactPlayer from 'react-player/lazy';
import { notification } from 'antd';
import * as gtag from '../lib/gtag';

interface VideoPlayerProps {
	url: string;
	callback?: Function;
	play?: boolean;
}

export default function DDVideoPlayer({ url, callback, play = true }: VideoPlayerProps) {
	const videoRef = useRef(null);

	const endVideo = () => {
		gtag.event({
			category: 'Video',
			action: 'Play',
			label: url,
			value: Math.round(
				//@ts-ignore
				videoRef.current?.getCurrentTime()) + " seconds"
		});
		//@ts-ignore
		console.log("Video played for seconds: ", videoRef.current?.getCurrentTime());
		if (callback) callback();
	};

	return (
					<div style={{ position: 'relative', paddingTop: '56.25%' }}>
						<ReactPlayer
							ref={videoRef}
							style={{ position: 'absolute', top: 0, left: 0}}
							url={url}
							width="100%"
							height="100%"
							playing={url && play ? true : false}
              controls
							onEnded={endVideo}
							onError={() => {
								notification.error({
									message: 'Unable to Play Video',
									description: 'Sorry, an error occurred while trying to play the video!'
								});
								endVideo();
							}}
						/>
					</div>
	);
}
