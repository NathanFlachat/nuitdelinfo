import { useEffect, useRef } from "react";

export default function SnakeModal({ isOpen, onClose }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const tileSize = 20;
    const tileCount = 20;

    let snake = [{ x: 10, y: 10 }];
    let velocity = { x: 0, y: 0 };
    let food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    };

    const keyHandler = (e) => {
      if (e.key === "ArrowUp" && velocity.y !== 1) velocity = { x: 0, y: -1 };
      if (e.key === "ArrowDown" && velocity.y !== -1) velocity = { x: 0, y: 1 };
      if (e.key === "ArrowLeft" && velocity.x !== 1) velocity = { x: -1, y: 0 };
      if (e.key === "ArrowRight" && velocity.x !== -1) velocity = { x: 1, y: 0 };
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", keyHandler);

    const interval = setInterval(() => {

      // ⛔ Fix : ne pas jouer tant que le joueur n'a pas démarré
      if (velocity.x === 0 && velocity.y === 0) {
        // Affiche juste l'écran initial
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "lime";
        snake.forEach((p) => {
          ctx.fillRect(p.x * tileSize, p.y * tileSize, tileSize, tileSize);
        });

        ctx.fillStyle = "red";
        ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);
        return;
      }

      // new head position
      const head = {
        x: snake[0].x + velocity.x,
        y: snake[0].y + velocity.y,
      };

      if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        onClose();
        return;
      }

      if (snake.some((s) => s.x === head.x && s.y === head.y)) {
        onClose();
        return;
      }

      snake = [head, ...snake];

      if (head.x === food.x && head.y === food.y) {
        food = {
          x: Math.floor(Math.random() * tileCount),
          y: Math.floor(Math.random() * tileCount),
        };
      } else {
        snake.pop();
      }

      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "lime";
      snake.forEach((p) => {
        ctx.fillRect(p.x * tileSize, p.y * tileSize, tileSize, tileSize);
      });

      ctx.fillStyle = "red";
      ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);

    }, 100);

    return () => {
      clearInterval(interval);
      document.removeEventListener("keydown", keyHandler);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          padding: 20,
          borderRadius: 8,
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>🐍 Snake</h2>
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          style={{ border: "1px solid #aaa", background: "#000" }}
        />
        <button
          onClick={onClose}
          style={{
            marginTop: 16,
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
