import { useEffect, useRef } from 'react';

export function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Brain shape parameters
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2.5;
    const brainRadius = 150;

    // Reduce number of nodes for better performance
    const nodes: { x: number; y: number; vx: number; vy: number }[] = [];
    const nodeCount = 80; // Reduced from 150 to 80

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
        vx: (Math.random() - 0.5) * 0.15, // Reduced velocity
        vy: (Math.random() - 0.5) * 0.15,
      });
    }

    let lastTime = 0;
    const fps = 30; // Limit FPS
    const frameInterval = 1000 / fps;

    function drawNode(x: number, y: number, isCenter: boolean = false) {
      if (!ctx) return;

      // Reduce glow effect for better performance
      if (isCenter) {
        ctx.shadowColor = 'rgba(147, 112, 219, 0.8)';
        ctx.shadowBlur = 10;
      }

      ctx.beginPath();
      ctx.arc(x, y, isCenter ? 3 : 2, 0, Math.PI * 2);
      ctx.fillStyle = isCenter 
        ? 'rgba(180, 130, 255, 0.9)'
        : 'rgba(130, 210, 255, 0.8)';
      ctx.fill();

      ctx.shadowBlur = 0;
    }

    function drawConnection(x1: number, y1: number, x2: number, y2: number, distance: number) {
      if (!ctx) return;

      // Only draw connections within brain area for better performance
      const d1 = Math.hypot(x1 - centerX, y1 - centerY);
      const d2 = Math.hypot(x2 - centerX, y2 - centerY);

      if (d1 > brainRadius * 2 || d2 > brainRadius * 2) return;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = `rgba(147, 112, 219, ${0.8 - distance / 150})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    function animate(currentTime: number) {
      if (!ctx || !canvas) return;

      // Limit frame rate
      const elapsed = currentTime - lastTime;
      if (elapsed < frameInterval) {
        frameRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTime = currentTime - (elapsed % frameInterval);

      ctx.fillStyle = 'rgba(0, 0, 25, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw nodes
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

      // Optimize connection drawing
      for (let i = 0; i < nodes.length; i++) {
        const node1 = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const node2 = nodes[j];
          const dx = node2.x - node1.x;
          const dy = node2.y - node1.y;
          const distance = Math.hypot(dx, dy);

          if (distance < 100) { // Reduced connection distance
            drawConnection(node1.x, node1.y, node2.x, node2.y, distance);
          }
        }
      }

      frameRef.current = requestAnimationFrame(animate);
    }

    frameRef.current = requestAnimationFrame(animate);

    const resizeHandler = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeHandler);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeHandler);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 bg-[#000019]"
    />
  );
}