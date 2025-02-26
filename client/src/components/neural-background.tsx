import { useEffect, useRef } from 'react';

export function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const nodes: { x: number; y: number; vx: number; vy: number }[] = [];
    const nodeCount = 100; // Increased node count for denser network

    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      });
    }

    function drawNode(x: number, y: number) {
      if (!ctx) return;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      // Bright blue color matching the image
      ctx.fillStyle = 'rgba(100, 200, 255, 0.8)';
      ctx.fill();
    }

    function drawConnection(x1: number, y1: number, x2: number, y2: number, distance: number) {
      if (!ctx) return;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      // Purple gradient for connections
      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, `rgba(147, 112, 219, ${0.8 - distance / 150})`);
      gradient.addColorStop(1, `rgba(100, 200, 255, ${0.8 - distance / 150})`);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.fillStyle = 'rgba(0, 0, 20, 0.2)'; // Dark blue background with slight transparency
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        drawNode(node.x, node.y);
      });

      nodes.forEach((node1, i) => {
        nodes.slice(i + 1).forEach((node2) => {
          const dx = node2.x - node1.x;
          const dy = node2.y - node1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) { // Increased connection distance
            drawConnection(node1.x, node1.y, node2.x, node2.y, distance);
          }
        });
      });

      requestAnimationFrame(animate);
    }

    animate();

    const resizeHandler = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 bg-[#000014]" // Dark blue background base
    />
  );
}