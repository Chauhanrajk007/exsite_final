"use client";

import { Canvas } from "@react-three/fiber";
import { useGLTF, Stage, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";

function Model() {
  const { scene } = useGLTF("/cart.glb");
  return <primitive object={scene} />;
}

export default function ThreeDCart() {
  return (
    <div
      className="anim-float"
      style={{
        position: "absolute",
        top: "5%",
        left: "72%",
        width: 190,
        height: 190,
        zIndex: 5,
        pointerEvents: "auto",
        filter: "drop-shadow(0px 20px 30px rgba(0,0,0,0.2))"
      }}
    >
      <Canvas
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 1.5, 5], fov: 40 }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Stage
            intensity={0.6}
            adjustCamera={1.2}
            shadows={false}
          >
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <Model />
          </Stage>
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={3}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/cart.glb");

