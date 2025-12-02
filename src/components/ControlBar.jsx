import React from "react";
import styled from "styled-components";
import micIcon from "../assets/micunmute.svg"; // Assuming these exist based on Room.jsx
import micOffIcon from "../assets/micmute.svg";
import camIcon from "../assets/webcam.svg";
import camOffIcon from "../assets/webcamoff.svg";

const BarContainer = styled.div`
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 16px;
  padding: 12px 24px;
  background: rgba(32, 33, 36, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 100;
`;

const Button = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: ${props => props.$active ? '#3c4043' : '#ea4335'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$active ? '#505458' : '#d93025'};
    transform: scale(1.05);
  }

  img {
    width: 24px;
    height: 24px;
    filter: invert(1); /* Make icons white if they aren't already */
  }
`;

const EndCallButton = styled(Button)`
  background: #ea4335;
  width: 60px;
  padding: 0 20px;
  border-radius: 30px;
  
  &:hover {
    background: #d93025;
  }
`;

const ControlBar = ({
  audioEnabled,
  videoEnabled,
  onToggleAudio,
  onToggleVideo,
  onEndCall,
  onCopyId
}) => {
  return (
    <BarContainer>
      <Button $active={audioEnabled} onClick={onToggleAudio} title={audioEnabled ? "Mute" : "Unmute"}>
        <img src={audioEnabled ? micIcon : micOffIcon} alt="Mic" />
      </Button>

      <Button $active={videoEnabled} onClick={onToggleVideo} title={videoEnabled ? "Stop Video" : "Start Video"}>
        <img src={videoEnabled ? camIcon : camOffIcon} alt="Camera" />
      </Button>

      <EndCallButton onClick={onEndCall} $active={false}>
        End
      </EndCallButton>

      {/* Optional: Copy ID button */}
      {onCopyId && (
        <Button $active={true} onClick={onCopyId} title="Copy Room ID" style={{ background: '#3c4043' }}>
          📋
        </Button>
      )}
    </BarContainer>
  );
};

export default ControlBar;
