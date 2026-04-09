"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";

const TAGS = [
  { e: "📢", l: "Campaign" },
  { e: "✅", l: "Checklist task" },
  { e: "🎯", l: "Strategy" },
  { e: "💡", l: "Generate Ideas" },
  { e: "✍️", l: "Write a blog post" },
  { e: "🔥", l: "Trending" },
  { e: "✨", l: "Creativity" },
  { e: "🚀", l: "Launch" },
];

export default function CampaignCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // Toggle active state
  useEffect(() => {
    if (isHovered && !isActive) {
      setIsActive(true);
    } else if (!isHovered && isActive) {
      // Remove ground so pills fall out
      if (engineRef.current) {
        const bodies = Matter.Composite.allBodies(engineRef.current.world);
        const ground = bodies.find(b => b.label === 'ground');
        if (ground) {
          Matter.Composite.remove(engineRef.current.world, ground);
        }
      }
      
      const timer = setTimeout(() => {
        setIsActive(false);
      }, 1000); // Wait 1 second for them to fall out before destroying
      return () => clearTimeout(timer);
    }
  }, [isHovered, isActive]);

  // Setup / Teardown Matter.js
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const Engine = Matter.Engine,
          Render = Matter.Render,
          Runner = Matter.Runner,
          MouseConstraint = Matter.MouseConstraint,
          Mouse = Matter.Mouse,
          World = Matter.World,
          Bodies = Matter.Bodies,
          Composite = Matter.Composite;

    const engine = Engine.create();
    engineRef.current = engine;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const render = Render.create({
      element: containerRef.current,
      engine: engine,
      options: {
        width,
        height,
        background: 'transparent',
        wireframes: false,
      }
    });
    renderRef.current = render;

    // Boundaries
    const ground = Bodies.rectangle(width / 2, height + 30, width + 100, 60, { isStatic: true, label: 'ground', render: { visible: false } });
    const leftWall = Bodies.rectangle(-30, height / 2, 60, height * 2, { isStatic: true, render: { visible: false } });
    const rightWall = Bodies.rectangle(width + 30, height / 2, 60, height * 2, { isStatic: true, render: { visible: false } });

    // Pills
    const pills = TAGS.map((tag, i) => {
      // Approximate width based on text
      const pillWidth = 35 + tag.l.length * 8;
      const x = Math.random() * (width - pillWidth) + (pillWidth / 2);
      const y = -50 - (i * 30); // Drop from above sequentially
      return Bodies.rectangle(x, y, pillWidth, 34, {
        chamfer: { radius: 17 },
        render: {
          fillStyle: "rgba(250,229,216,.15)",
          strokeStyle: "rgba(250,229,216,.4)",
          lineWidth: 1,
        },
        restitution: 0.6,
        friction: 0.05,
      });
    });

    Composite.add(engine.world, [ground, leftWall, rightWall, ...pills]);

    // Mouse constraint for dragging
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });

    Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    Render.run(render);
    
    // Create runner
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    // Custom render loop just to draw text on bodies
    const context = render.context;
    Matter.Events.on(render, 'afterRender', () => {
      context.font = "600 12px Inter, sans-serif";
      context.textAlign = "center";
      context.textBaseline = "middle";
      
      pills.forEach((pill, i) => {
        const { x, y } = pill.position;
        const angle = pill.angle;
        
        context.save();
        context.translate(x, y);
        context.rotate(angle);
        context.fillStyle = "#FAE5D8";
        context.fillText(`${TAGS[i].e} ${TAGS[i].l}`, 0, 1); // 1px offset for visual center
        context.restore();
      });
    });

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      if (render.canvas) render.canvas.remove();
      World.clear(engine.world, false);
      Engine.clear(engine);
      engineRef.current = null;
    };
  }, [isActive]);

  return (
    <div
      style={{
        background: "var(--card-campaign)",
        borderRadius: "1.25rem",
        padding: "1.25rem",
        display: "flex",
        flexWrap: "wrap",
        gap: ".5rem",
        alignContent: "flex-start",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.2s",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 80%, rgba(130,77,105,.6) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      
      {/* Matter.js Canvas Container */}
      <div 
        ref={containerRef} 
        style={{ 
          position: "absolute", 
          inset: 0, 
          zIndex: 10,
          opacity: isActive ? 1 : 0,
          pointerEvents: isHovered ? "auto" : "none"
        }}
      />

      {/* Static content underneath (fades out when physics kicks in) */}
      <div style={{ 
        display: "flex", 
        flexWrap: "wrap", 
        gap: ".5rem", 
        alignContent: "flex-start",
        opacity: isActive ? 0 : 1,
        transition: "opacity 0.2s"
      }}>
        {TAGS.slice(0, 5).map((t) => (
          <span
            key={t.l}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: ".35rem",
              padding: ".35rem .8rem",
              borderRadius: 999,
              background: "rgba(250,229,216,.12)",
              color: "#FAE5D8",
              fontSize: ".75rem",
              fontWeight: 500,
              backdropFilter: "blur(4px)",
              zIndex: 1,
            }}
          >
            {t.e} {t.l}
          </span>
        ))}
      </div>
      
      <div
        style={{
          width: 34, height: 34,
          borderRadius: "50%",
          background: "var(--mauve)",
          color: "#FAE5D8",
          fontWeight: 700,
          fontSize: ".95rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
          position: "absolute",
          bottom: "1.25rem",
          right: "1.25rem",
          opacity: isActive ? 0 : 1,
          transition: "opacity 0.2s"
        }}
      >
        N
      </div>
    </div>
  );
}
