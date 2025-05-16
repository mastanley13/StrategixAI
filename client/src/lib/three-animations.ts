import * as THREE from 'three';

export function setupHeroAnimation(canvas: HTMLCanvasElement): () => void {
  // Create renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });
  
  // Create scene
  const scene = new THREE.Scene();
  
  // Create camera
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 20;
  
  // Add floating particles
  const particleGeometry = new THREE.BufferGeometry();
  const particleCount = 200;
  
  const positionArray = new Float32Array(particleCount * 3);
  const scaleArray = new Float32Array(particleCount);
  
  for (let i = 0; i < particleCount; i++) {
    // Position
    positionArray[i * 3] = (Math.random() - 0.5) * 60;
    positionArray[i * 3 + 1] = (Math.random() - 0.5) * 40;
    positionArray[i * 3 + 2] = (Math.random() - 0.5) * 10;
    
    // Scale
    scaleArray[i] = Math.random() * 0.5 + 0.5;
  }
  
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
  particleGeometry.setAttribute('scale', new THREE.BufferAttribute(scaleArray, 1));
  
  const particleMaterial = new THREE.PointsMaterial({
    color: 0x0066CC,
    size: 0.4,
    transparent: true,
    opacity: 0.7,
  });
  
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);
  
  // Create larger glowing particles
  const glowGeometry = new THREE.SphereGeometry(0.5, 16, 16);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0x00AAFF,
    transparent: true,
    opacity: 0.4
  });
  
  const glowCount = 10;
  const glowSpheres: { mesh: THREE.Mesh; speed: number }[] = [];
  
  for (let i = 0; i < glowCount; i++) {
    const sphere = new THREE.Mesh(glowGeometry, glowMaterial);
    sphere.position.set(
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 5
    );
    sphere.scale.setScalar(Math.random() * 2 + 1);
    scene.add(sphere);
    glowSpheres.push({
      mesh: sphere,
      speed: Math.random() * 0.01 + 0.005
    });
  }
  
  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    
    // Rotate entire particle system
    particles.rotation.y += 0.0005;
    
    // Animate individual particles slightly
    const positions = particles.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 1] += Math.sin(Date.now() * 0.001 + i) * 0.01;
    }
    particles.geometry.attributes.position.needsUpdate = true;
    
    // Animate glowing spheres
    glowSpheres.forEach(gs => {
      gs.mesh.position.y += Math.sin(Date.now() * 0.001) * gs.speed;
    });
    
    renderer.render(scene, camera);
  }
  
  // Handle resize
  function handleResize() {
    const parent = canvas.parentElement;
    if (parent) {
      camera.aspect = parent.clientWidth / parent.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(parent.clientWidth, parent.clientHeight);
    }
  }
  
  // Set initial size
  handleResize();
  
  // Add resize listener
  window.addEventListener('resize', handleResize);
  
  // Start animation loop
  animate();
  
  // Cleanup function to remove event listeners
  return () => {
    window.removeEventListener('resize', handleResize);
    // Dispose of geometries and materials
    particleGeometry.dispose();
    particleMaterial.dispose();
    glowGeometry.dispose();
    glowMaterial.dispose();
  };
}
