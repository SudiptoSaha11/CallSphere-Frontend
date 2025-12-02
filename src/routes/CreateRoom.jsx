import React from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import styled from "styled-components";

const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1a1a1a 0%, #363636 100%);
  color: white;
  font-family: 'Inter', sans-serif;
  padding: 20px;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  max-width: 400px;
  width: 90%;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 10px;
  background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  color: #aaa;
  margin-bottom: 30px;
  font-size: 1.1rem;
`;

const Button = styled.button`
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
  border: none;
  padding: 15px 30px;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  width: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const CreateRoom = () => {
  const navigate = useNavigate();

  function create() {
    const id = uuidv4();
    navigate(`/room/${id}`);
  }

  return (
    <Container>
      <Card>
        <Title>VideoCall</Title>
        <Subtitle>Premium secure video meetings for everyone.</Subtitle>
        <Button onClick={create}>Create New Room</Button>
      </Card>
    </Container>
  );
};

export default CreateRoom;
