import React, { useEffect, useRef } from "react";

export default function HeroCloudErase() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const setDimensions = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    setDimensions();

    const fog = document.createElement("canvas");
    const fogCtx = fog.getContext("2d");

    const updateFogDimensions = () => {
      fog.width = canvas.width;
      fog.height = canvas.height;
    };
    updateFogDimensions();

    function generateFog() {
      fogCtx.clearRect(0, 0, fog.width, fog.height);
      fogCtx.fillStyle = "rgba(255,255,255,0.96)"; 
      fogCtx.fillRect(0, 0, fog.width, fog.height);

      for (let i = 0; i < 8000; i++) {
        fogCtx.fillStyle = "rgba(255,255,255,0.05)";
        fogCtx.beginPath();
        fogCtx.arc(Math.random() * fog.width, Math.random() * fog.height, Math.random() * 25, 0, Math.PI * 2);
        fogCtx.fill();
      }
    }
    generateFog();

    const handleMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // --- BRUSH SIZE ADJUSTMENT ---
      const brushSize = 120; // Decreased from 160 to 60 for more precision

      fogCtx.globalCompositeOperation = "destination-out";
      
      // Create a gradient that matches the new smaller brush size
      const gradient = fogCtx.createRadialGradient(x, y, 0, x, y, brushSize);
      gradient.addColorStop(0, "rgba(0,0,0,1)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      
      fogCtx.fillStyle = gradient;
      fogCtx.beginPath();
      fogCtx.arc(x, y, brushSize, 0, Math.PI * 2);
      fogCtx.fill();
      fogCtx.globalCompositeOperation = "source-over";
    };

    window.addEventListener("mousemove", handleMove);

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
      sky.addColorStop(0, "#38bdf8"); 
      sky.addColorStop(1, "#0ea5e9");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(255,255,255,0.4)";
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.arc((canvas.width * 0.1) + i * (canvas.width * 0.2), canvas.height * 0.3, 80, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.drawImage(fog, 0, 0);
      
      for (let i = 0; i < 50; i++) {
        fogCtx.fillStyle = "rgba(255,255,255,0.01)";
        fogCtx.beginPath();
        fogCtx.arc(Math.random() * fog.width, Math.random() * fog.height, 20, 0, Math.PI * 2);
        fogCtx.fill();
      }

      requestAnimationFrame(animate);
    }
    animate();

    const handleResize = () => {
      setDimensions();
      updateFogDimensions();
      generateFog();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        zIndex: 0, 
        width: '100%', 
        height: '100%',
        pointerEvents: 'none' 
      }} 
    />
  );
}