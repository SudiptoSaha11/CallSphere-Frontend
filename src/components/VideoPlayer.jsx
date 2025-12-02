import React, { useEffect, useRef } from "react";
import styled from "styled-components";

const Container = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #202124;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scaleX(-1); /* Mirror effect for natural feel */
`;

const InfoBar = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.5);
  padding: 4px 8px;
  border-radius: 4px;
  color: white;
  font-size: 12px;
  backdrop-filter: blur(4px);
`;

const VideoPlayer = ({ peer, stream, isLocal, userName }) => {
    const videoRef = useRef();

    useEffect(() => {
        if (videoRef.current) {
            if (isLocal && stream) {
                videoRef.current.srcObject = stream;
            } else if (peer) {
                peer.on("stream", (remoteStream) => {
                    videoRef.current.srcObject = remoteStream;
                });
            }
        }
    }, [peer, stream, isLocal]);

    return (
        <Container>
            <Video playsInline autoPlay muted={isLocal} ref={videoRef} />
            {userName && <InfoBar>{userName}</InfoBar>}
        </Container>
    );
};

export default VideoPlayer;
