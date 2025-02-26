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

    // Brain shape parameters
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2.5;
    const brainRadius = 150;

    const nodes: { x: number; y: number; vx: number; vy: number }[] = [];
    const nodeCount = 150;

    // Create nodes with more concentration around brain shape
    for (let i = 0; i < nodeCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * brainRadius * 2;

      const x = Math.random() > 0.3 
        ? centerX + Math.cos(angle) * radius
        : Math.random() * canvas.width;
      const y = Math.random() > 0.3
        ? centerY + Math.sin(angle) * radius
        : Math.random() * canvas.height;

      nodes.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
      });
    }

    function drawNode(x: number, y: number, isCenter: boolean = false) {
      if (!ctx) return;

      // Add glow effect
      ctx.shadowColor = isCenter 
        ? 'rgba(147, 112, 219, 0.8)'
        : 'rgba(100, 200, 255, 0.6)';
      ctx.shadowBlur = isCenter ? 20 : 10;

      ctx.beginPath();
      ctx.arc(x, y, isCenter ? 3 : 2, 0, Math.PI * 2);
      ctx.fillStyle = isCenter 
        ? 'rgba(180, 130, 255, 0.9)' // Brighter purple for center nodes
        : 'rgba(130, 210, 255, 0.8)'; // Brighter blue for other nodes
      ctx.fill();

      ctx.shadowBlur = 0;
    }

    function drawConnection(x1: number, y1: number, x2: number, y2: number, distance: number) {
      if (!ctx) return;

      // Add glow effect
      ctx.shadowColor = 'rgba(147, 112, 219, 0.4)';
      ctx.shadowBlur = 8;

      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, `rgba(180, 130, 255, ${1 - distance / 200})`);
      gradient.addColorStop(1, `rgba(130, 210, 255, ${1 - distance / 200})`);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      ctx.shadowBlur = 0;
    }

    function drawBrainOutline() {
      if (!ctx) return;

      // Outer glow
      ctx.shadowColor = 'rgba(147, 112, 219, 0.6)';
      ctx.shadowBlur = 40;

      ctx.beginPath();
      ctx.ellipse(centerX, centerY, brainRadius, brainRadius * 1.2, 0, 0, Math.PI * 2);

      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, brainRadius * 2
      );
      gradient.addColorStop(0, 'rgba(130, 210, 255, 0.3)');
      gradient.addColorStop(0.5, 'rgba(180, 130, 255, 0.2)');
      gradient.addColorStop(1, 'rgba(180, 130, 255, 0)');

      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.shadowBlur = 0;
    }

    function animate() {
      if (!ctx || !canvas) return;

      // Very dark blue background with stronger fade
      ctx.fillStyle = 'rgba(0, 0, 25, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawBrainOutline();

      nodes.forEach((node) => {
        const dx = centerX - node.x;
        const dy = centerY - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > brainRadius * 2) {
          node.vx += dx * 0.00001;
          node.vy += dy * 0.00001;
        }

        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        const isCenter = distance < brainRadius;
        drawNode(node.x, node.y, isCenter);
      });

      nodes.forEach((node1, i) => {
        nodes.slice(i + 1).forEach((node2) => {
          const dx = node2.x - node1.x;
          const dy = node2.y - node1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150 && 
              (Math.sqrt(Math.pow(node1.x - centerX, 2) + Math.pow(node1.y - centerY, 2)) < brainRadius * 1.5 ||
               Math.sqrt(Math.pow(node2.x - centerX, 2) + Math.pow(node2.y - centerY, 2)) < brainRadius * 1.5)) {
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
      className="fixed inset-0 -z-10 bg-[#000019]"
    />
  );
}