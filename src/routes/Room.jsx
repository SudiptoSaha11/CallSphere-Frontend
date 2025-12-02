import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import VideoPlayer from "../components/VideoPlayer";
import ControlBar from "../components/ControlBar";

const RoomContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: #202124;
  padding: 20px;
  overflow-y: auto;
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  align-content: center;
  flex-grow: 1;
  padding-bottom: 100px; /* Space for control bar */

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Room = () => {
  const [peers, setPeers] = useState([]);
  const [audioFlag, setAudioFlag] = useState(true);
  const [videoFlag, setVideoFlag] = useState(true);
  const [userUpdate, setUserUpdate] = useState([]);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const { roomID } = useParams();
  const navigate = useNavigate();
  const [stream, setStream] = useState(null);

  const videoConstraints = {
    minAspectRatio: 1.333,
    minFrameRate: 60,
    height: window.innerHeight / 1.8,
    width: window.innerWidth / 2,
  };

  useEffect(() => {
    socketRef.current = io("https://callsphere-backend.onrender.com", { transports: ["websocket"] });

    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (userVideo.current) {
          userVideo.current.srcObject = currentStream;
        }

        socketRef.current.emit("join room", roomID);

        function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });
    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", { userToSignal, callerID, signal });
    });
    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });
    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });
    peer.signal(incomingSignal);
    return peer;
  }
  
        socketRef.current.on("all users", (users) => {
          const peersArr = [];
          users.forEach((userID) => {
            const peer = createPeer(userID, socketRef.current.id, currentStream);
            peersRef.current.push({ peerID: userID, peer });
            peersArr.push({ peerID: userID, peer });
          });
          setPeers(peersArr);
        });

        socketRef.current.on("user joined", (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, currentStream);
          peersRef.current.push({ peerID: payload.callerID, peer });
          setPeers((users) => [...users, { peer, peerID: payload.callerID }]);
        });

        socketRef.current.on("user left", (id) => {
          const peerObj = peersRef.current.find((p) => p.peerID === id);
          if (peerObj) peerObj.peer.destroy();
          const filteredPeers = peersRef.current.filter((p) => p.peerID !== id);
          peersRef.current = filteredPeers;
          setPeers(filteredPeers);
        });

        socketRef.current.on("receiving returned signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          if (item) item.peer.signal(payload.signal);
        });

        socketRef.current.on("change", (payload) => {
          setUserUpdate(payload);
        });
      });

    return () => {
      socketRef.current.disconnect();
      peersRef.current.forEach((p) => p.peer && p.peer.destroy());
      if (userVideo.current && userVideo.current.srcObject) {
        userVideo.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line
  }, []); // Empty dependency array - only run once on mount

  

  const toggleVideo = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        if (track.kind === "video") {
          track.enabled = !videoFlag;
          setVideoFlag(!videoFlag);
          socketRef.current.emit("change", [
            ...userUpdate,
            {
              id: socketRef.current.id,
              videoFlag: !videoFlag,
              audioFlag,
            },
          ]);
        }
      });
    }
  };

  const toggleAudio = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        if (track.kind === "audio") {
          track.enabled = !audioFlag;
          setAudioFlag(!audioFlag);
          socketRef.current.emit("change", [
            ...userUpdate,
            {
              id: socketRef.current.id,
              videoFlag,
              audioFlag: !audioFlag,
            },
          ]);
        }
      });
    }
  };

  const endCall = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    navigate("/");
    // window.location.reload(); // No longer needed if we cleanup properly, but keeping it for a hard reset isn't terrible. 
    // However, React Router navigation is smoother. Let's try without reload first.
  };

  const copyId = () => {
    navigator.clipboard.writeText(roomID);
    alert("Room ID copied!");
  };

  return (
    <RoomContainer>
      <VideoGrid>
        {/* Local Video */}
        <VideoPlayer
          stream={stream}
          isLocal={true}
          userName="You"
        />

        {/* Remote Videos */}
        {peers.map((peer) => {
          return (
            <VideoPlayer
              key={peer.peerID}
              peer={peer.peer}
              userName={`User ${peer.peerID.substring(0, 5)}`}
            />
          );
        })}
      </VideoGrid>

      <ControlBar
        audioEnabled={audioFlag}
        videoEnabled={videoFlag}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
        onEndCall={endCall}
        onCopyId={copyId}
      />
    </RoomContainer>
  );
};

export default Room;
