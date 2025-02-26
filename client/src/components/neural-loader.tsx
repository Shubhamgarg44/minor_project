import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface NeuralLoaderProps {
  message?: string;
}

export function NeuralLoader({ message = "Processing..." }: NeuralLoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 200;
    canvas.height = 200;

    const nodes: { x: number; y: number; phase: number }[] = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Create nodes in a circular pattern
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const radius = 60;
      nodes.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        phase: i * Math.PI / 4
      });
    }

    // Add center node
    nodes.push({ x: centerX, y: centerY, phase: 0 });

    function drawNode(x: number, y: number, intensity: number) {
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(130, 210, 255, ${0.3 + intensity * 0.7})`;
      ctx.fill();

      // Glow effect
      ctx.shadowColor = 'rgba(147, 112, 219, 0.8)';
      ctx.shadowBlur = 15 * intensity;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    function drawConnection(x1: number, y1: number, x2: number, y2: number, intensity: number) {
      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, `rgba(180, 130, 255, ${intensity})`);
      gradient.addColorStop(1, `rgba(130, 210, 255, ${intensity})`);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2 * intensity;
      
      // Glow effect
      ctx.shadowColor = 'rgba(147, 112, 219, 0.4)';
      ctx.shadowBlur = 8 * intensity;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    let animationFrame: number;
    function animate(timestamp: number) {
      ctx.fillStyle = 'rgba(0, 0, 25, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerNode = nodes[nodes.length - 1];
      
      // Update and draw nodes
      nodes.forEach((node, i) => {
        if (i === nodes.length - 1) return; // Skip center node in this loop
        
        const time = timestamp / 1000;
        const intensity = Math.sin(time + node.phase) * 0.5 + 0.5;
        
        // Draw connection to center
        drawConnection(node.x, node.y, centerNode.x, centerNode.y, intensity);
        drawNode(node.x, node.y, intensity);
      });

      // Draw center node last
      drawNode(centerNode.x, centerNode.y, 1);

      animationFrame = requestAnimationFrame(animate);
    }

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        width={200}
        height={200}
        className="max-w-[200px]"
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-primary font-medium"
      >
        {message}
      </motion.p>
    </div>
  );
}
