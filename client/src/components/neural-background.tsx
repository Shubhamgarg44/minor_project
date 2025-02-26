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
    const centerY = canvas.height / 2.5; // Position brain slightly above center
    const brainRadius = 150;

    const nodes: { x: number; y: number; vx: number; vy: number }[] = [];
    const nodeCount = 150; // More nodes for denser network

    // Create nodes with more concentration around brain shape
    for (let i = 0; i < nodeCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * brainRadius * 2;

      // 70% of nodes around brain shape, 30% scattered
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
      ctx.beginPath();
      ctx.arc(x, y, isCenter ? 3 : 2, 0, Math.PI * 2);
      ctx.fillStyle = isCenter 
        ? 'rgba(147, 112, 219, 0.9)' // Brighter purple for center nodes
        : 'rgba(100, 200, 255, 0.8)'; // Bright blue for other nodes
      ctx.fill();

      // Add glow effect
      if (isCenter) {
        ctx.shadowColor = 'rgba(147, 112, 219, 0.6)';
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function drawConnection(x1: number, y1: number, x2: number, y2: number, distance: number) {
      if (!ctx) return;
      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, `rgba(147, 112, 219, ${0.8 - distance / 200})`);
      gradient.addColorStop(1, `rgba(100, 200, 255, ${0.8 - distance / 200})`);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 0.5;

      // Add glow effect to connections
      ctx.shadowColor = 'rgba(147, 112, 219, 0.3)';
      ctx.shadowBlur = 5;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    function drawBrainOutline() {
      if (!ctx) return;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, brainRadius, brainRadius * 1.2, 0, 0, Math.PI * 2);

      // Create gradient for brain outline
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, brainRadius * 1.5
      );
      gradient.addColorStop(0, 'rgba(100, 200, 255, 0.2)');
      gradient.addColorStop(0.5, 'rgba(147, 112, 219, 0.15)');
      gradient.addColorStop(1, 'rgba(147, 112, 219, 0)');

      ctx.fillStyle = gradient;
      ctx.shadowColor = 'rgba(100, 200, 255, 0.5)';
      ctx.shadowBlur = 30;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    function animate() {
      if (!ctx || !canvas) return;

      // Dark blue background with slight fade effect
      ctx.fillStyle = 'rgba(0, 0, 20, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw brain outline first
      drawBrainOutline();

      // Update and draw nodes
      nodes.forEach((node) => {
        // Add slight attraction to center for brain shape
        const dx = centerX - node.x;
        const dy = centerY - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > brainRadius * 2) {
          node.vx += dx * 0.00001;
          node.vy += dy * 0.00001;
        }

        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        const isCenter = distance < brainRadius;
        drawNode(node.x, node.y, isCenter);
      });

      // Draw connections
      nodes.forEach((node1, i) => {
        nodes.slice(i + 1).forEach((node2) => {
          const dx = node2.x - node1.x;
          const dy = node2.y - node1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150 && // Shorter connection distance for denser network
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
      className="fixed inset-0 -z-10 bg-[#000014]"
    />
  );
}