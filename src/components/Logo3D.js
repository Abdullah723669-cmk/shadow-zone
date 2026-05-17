'use client';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, MeshTransmissionMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';

function CosmicLogo() {
  const planetRef = useRef();
  const atmosphereRef = useRef();
  const orbitGroupRef = useRef();
  const textRef = useRef();
  const textMaterialRef = useRef();
  const starParticlesRef = useRef();

  // Animating the components inside the frame loop
  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Rotate the central "Earth-like" planet
    if (planetRef.current) {
      planetRef.current.rotation.y = t * 0.15;
      planetRef.current.rotation.x = Math.sin(t * 0.05) * 0.1;
    }

    // Rotate the outer grid atmosphere in the opposite direction
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y = -t * 0.1;
      atmosphereRef.current.rotation.z = Math.cos(t * 0.05) * 0.05;
    }

    // Rotate the entire orbit group (the circle that rounds around the planet)
    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.y = t * 0.6; // Orbits around Y axis
    }

    // Make the "Shadow Zone" text face the camera slightly and twinkle like a star
    if (textMaterialRef.current) {
      // Rapid flicker + smooth wave to create a gorgeous natural twinkle effect
      const twinkle = 1.8 + Math.sin(t * 12) * 1.0 + Math.cos(t * 22) * 0.5;
      textMaterialRef.current.emissiveIntensity = Math.max(0.3, twinkle);
      
      // Dynamic color shifting for premium aesthetic
      const hue = (t * 0.05) % 1;
      textMaterialRef.current.color.setHSL(hue, 0.9, 0.6);
      textMaterialRef.current.emissive.setHSL(hue, 0.9, 0.7);
    }

    // Make star particles twinkle
    if (starParticlesRef.current) {
      starParticlesRef.current.rotation.y = -t * 0.05;
    }
  });

  return (
    <group>
      {/* 1. CENTRAL EARTH-LIKE PLANET CORE */}
      <group>
        {/* Deep glass core */}
        <mesh ref={planetRef}>
          <sphereGeometry args={[1.2, 64, 64]} />
          <MeshTransmissionMaterial
            backside
            backsideThickness={0.5}
            thickness={0.8}
            chromaticAberration={0.6}
            anisotropy={0.5}
            distortion={0.3}
            distortionScale={0.4}
            temporalDistortion={0.1}
            metalness={0.2}
            roughness={0.1}
            color="#4f46e5"
          />
        </mesh>

        {/* Earth-like Latitude/Longitude wireframe grid overlay */}
        <mesh ref={atmosphereRef}>
          <sphereGeometry args={[1.35, 18, 18]} />
          <meshBasicMaterial color="#a78bfa" wireframe transparent opacity={0.35} />
        </mesh>

        {/* Outer glowing atmospheric shield */}
        <mesh>
          <sphereGeometry args={[1.4, 32, 32]} />
          <meshBasicMaterial
            color="#818cf8"
            transparent
            opacity={0.12}
            side={THREE.BackSide}
          />
        </mesh>
      </group>

      {/* 2. THE ORBITING SYSTEM (Tilted Orbiting Ring & Text) */}
      {/* Tilt the entire orbiting plane by 23.5 degrees (like Earth's axis) */}
      <group rotation={[0.4, 0, 0.2]}>
        
        {/* Glowing orbital path line */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.4, 0.012, 16, 100]} />
          <meshBasicMaterial
            color="#8b5cf6"
            transparent
            opacity={0.4}
          />
        </mesh>

        {/* Orbit Group that rotates */}
        <group ref={orbitGroupRef}>
          {/* Sparkly pointer particle leading the text */}
          <mesh position={[2.4, 0, 0]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>

          {/* Twinkling "Shadow Zone" text attached to the orbiting circle */}
          {/* Position is placed at -2.4 (opposite of the leading star) so it circles perfectly */}
          <group position={[-2.4, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <Float speed={5} floatIntensity={0.2} rotationIntensity={0.1}>
              <Text
                ref={textRef}
                fontSize={0.34}
                anchorX="center"
                anchorY="middle"
                letterSpacing={0.05}
              >
                SHADOW ZONE
                <meshStandardMaterial
                  ref={textMaterialRef}
                  color="#c084fc"
                  emissive="#a78bfa"
                  emissiveIntensity={2}
                  toneMapped={false}
                  roughness={0.1}
                  metalness={0.9}
                />
              </Text>
            </Float>
          </group>

          {/* Additional sparkling star particles floating with the orbit */}
          {[...Array(6)].map((_, i) => {
            const angle = (i / 6) * Math.PI * 2 + 0.5;
            const radius = 2.4 + (Math.random() - 0.5) * 0.15;
            return (
              <mesh
                key={i}
                position={[
                  Math.cos(angle) * radius,
                  (Math.random() - 0.5) * 0.1,
                  Math.sin(angle) * radius,
                ]}
              >
                <sphereGeometry args={[0.025, 8, 8]} />
                <meshStandardMaterial
                  color="#ffffff"
                  emissive="#ffffff"
                  emissiveIntensity={1.5}
                />
              </mesh>
            );
          })}
        </group>
      </group>

      {/* 3. TWINKLING BACKGROUND STARS */}
      <group ref={starParticlesRef}>
        {[...Array(40)].map((_, i) => {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos((Math.random() * 2) - 1);
          const dist = 4 + Math.random() * 4;
          return (
            <mesh
              key={i}
              position={[
                dist * Math.sin(phi) * Math.cos(theta),
                dist * Math.sin(phi) * Math.sin(theta),
                dist * Math.cos(phi),
              ]}
            >
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshBasicMaterial
                color={i % 2 === 0 ? '#c084fc' : '#ffffff'}
                transparent
                opacity={0.3 + Math.random() * 0.7}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

export default function Logo3D({ size = 'default' }) {
  const heights = {
    small: 80,
    default: 150,
    large: 280,
    hero: 480, // Taller hero canvas so the entire earth and orbiting text fits perfectly
  };

  return (
    <div style={{
      width: '100%',
      height: heights[size] || heights.default,
      position: 'relative',
    }}>
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-4, 3, 4]} intensity={2.5} color="#818cf8" />
        <pointLight position={[4, -3, 3]} intensity={2.0} color="#a78bfa" />
        <spotLight
          position={[0, 8, 0]}
          angle={0.4}
          penumbra={1}
          intensity={3}
          color="#c084fc"
        />
        <CosmicLogo />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
