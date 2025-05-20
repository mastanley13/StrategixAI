'use client';

import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

// Define shape type
interface Shape {
  mesh: THREE.Mesh;
  rotationSpeed: {
    x: number;
    y: number;
    z: number;
  };
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Skip effect during SSR
    if (typeof window === 'undefined') return;
    
    // Check if canvas exists
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Ensure canvas fills container
    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }
    
    // Basic Three.js setup with direct access
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    renderer.setSize(canvas.width, canvas.height);
    renderer.setClearColor(0x000000, 0);
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      canvas.width / canvas.height,
      0.1,
      1000
    );
    camera.position.z = 20;
    
    // Simple particles for background
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 500;
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Random position
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100 - 20;
      
      // Random color (blues and cyans)
      const colorChoice = Math.random();
      if (colorChoice < 0.7) {
        colors[i * 3] = 0.1 + Math.random() * 0.2; // R
        colors[i * 3 + 1] = 0.3 + Math.random() * 0.4; // G
        colors[i * 3 + 2] = 0.7 + Math.random() * 0.3; // B
      } else {
        colors[i * 3] = 0.8 + Math.random() * 0.2; // R
        colors[i * 3 + 1] = 0.4 + Math.random() * 0.3; // G
        colors[i * 3 + 2] = 0.1 + Math.random() * 0.1; // B
      }
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    
    // Add some basic objects
    const geometry = new THREE.IcosahedronGeometry(2, 0);
    const material = new THREE.MeshBasicMaterial({
      color: 0x0088ff,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    
    // Create a few shapes
    const shapes: Shape[] = [];
    for (let i = 0; i < 10; i++) {
      const shape = new THREE.Mesh(geometry, material.clone());
      shape.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40 - 10
      );
      shape.scale.setScalar(Math.random() * 2 + 0.5);
      scene.add(shape);
      shapes.push({
        mesh: shape,
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.01,
          y: (Math.random() - 0.5) * 0.01,
          z: (Math.random() - 0.5) * 0.01
        }
      });
    }
    
    // Animation loop
    let animationFrameId: number;
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Rotate particles
      particles.rotation.y += 0.001;
      
      // Animate shapes
      shapes.forEach(shape => {
        shape.mesh.rotation.x += shape.rotationSpeed.x;
        shape.mesh.rotation.y += shape.rotationSpeed.y;
        shape.mesh.rotation.z += shape.rotationSpeed.z;
      });
      
      // Slowly move camera
      camera.position.x = Math.sin(Date.now() * 0.0001) * 2;
      
      renderer.render(scene, camera);
    };
    
    // Start animation
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!canvas || !container) return;
      
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      
      camera.aspect = canvas.width / canvas.height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(canvas.width, canvas.height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      
      // Dispose resources
      scene.remove(particles);
      particleGeometry.dispose();
      particleMaterial.dispose();
      
      shapes.forEach(shape => {
        scene.remove(shape.mesh);
        geometry.dispose();
        if (shape.mesh.material) {
          // Type guard to check if material is an array
          if (Array.isArray(shape.mesh.material)) {
            shape.mesh.material.forEach(mat => {
              if (mat.dispose) mat.dispose();
            });
          } else {
            // Single material
            shape.mesh.material.dispose();
          }
        }
      });
      
      renderer.dispose();
    };
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden min-h-[90vh] flex items-center">
        {/* 3D Animation Canvas Container */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <canvas 
            ref={canvasRef} 
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              display: 'block',
              top: 0,
              left: 0
            }}
          />
        </div>
        
        {/* Dark overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/50 z-10"></div>
        
        {/* Content */}
        <div className="container mx-auto px-4 relative z-20">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            {/* Text Content - Takes 3 columns on large screens */}
            <div className="lg:col-span-3">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 border border-blue-600/20 mb-4">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse mr-2"></span>
                <span className="text-sm font-medium">AI-Powered Solutions</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-white">
                Turn Bottlenecks into <br/>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-400">
                  Breakthroughs
                </span>
              </h1>
              
              <p className="mt-6 text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl">
                Strategix AI uncovers your biggest process pain points, designs the right automation, and delivers working solutions—so you grow revenue and win back time without the trial‑and‑error.
              </p>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a
                  href="/contact"
                  className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition"
                >
                  Book a 30-minute Discovery Call
                </a>
                <a
                  href="#"
                  className="px-6 py-3 bg-white text-gray-800 rounded-md font-medium hover:bg-gray-200 transition"
                >
                  Download AI Action-Plan
                </a>
              </div>
            </div>
            
            {/* Visual Element - Takes 2 columns on large screens */}
            <div className="lg:col-span-2 relative">
              <div className="relative rounded-xl overflow-hidden">
                {/* AI Visualization Placeholder */}
                <div className="relative z-10 bg-black/30 backdrop-blur-sm p-7 rounded-xl border border-white/10">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Metrics Cards */}
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10 backdrop-blur-sm">
                      <div className="flex justify-between items-start mb-3">
                        <div className="h-8 w-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                          </svg>
                        </div>
                        <span className="text-xs text-cyan-300">+82%</span>
                      </div>
                      <h4 className="text-white font-medium">Revenue Growth</h4>
                      <p className="text-xs text-white/60">After automation</p>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10 backdrop-blur-sm">
                      <div className="flex justify-between items-start mb-3">
                        <div className="h-8 w-8 rounded-lg bg-orange-400/20 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-xs text-orange-300">-70%</span>
                      </div>
                      <h4 className="text-white font-medium">Time Savings</h4>
                      <p className="text-xs text-white/60">Hours reclaimed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Our Services</h2>
            <p className="text-gray-600 mt-4">
              Comprehensive AI solutions tailored to your business needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3">AI Strategy Consulting</h3>
              <p className="text-gray-600">Custom roadmaps for implementing AI in your organization</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3">Process Automation</h3>
              <p className="text-gray-600">Streamline operations with intelligent automation solutions</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3">Training & Integration</h3>
              <p className="text-gray-600">Empower your team with the skills to leverage AI tools</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Ready to Transform Your Business?</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Contact us today to schedule a consultation and discover how AI can drive growth for your organization.
            </p>
          </div>
          
          <div className="flex justify-center">
            <a
              href="/contact"
              className="px-8 py-4 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition text-lg"
            >
              Contact Us Today
            </a>
          </div>
        </div>
      </section>
    </>
  );
} 