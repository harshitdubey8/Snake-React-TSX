import React from "react";
import "./GameOverModal.css";

interface GameOverModalProps {
  score: number;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ score }) => {
  return (
    <div className="modal-overlay">
      <div className="game-over-modal">
        <h2 style={{ fontSize: "22px" }}>Game Over</h2>
        <p style={{ fontSize: "22px" }}>Your Score: {score}</p>
        <button onClick={() => window.location.reload()}>Restart</button>
      </div>
    </div>
  );
};

export default GameOverModal;
