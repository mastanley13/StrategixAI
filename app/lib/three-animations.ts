import * as THREE from 'three';

export function setupHeroAnimation(canvas: HTMLCanvasElement): () => void {
  // Ensure canvas has dimensions
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  
  // Create renderer with enhanced settings
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0); // Transparent background
  
  // Create scene with fog for depth
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0e1538, 0.001);
  
  // Create camera with more dramatic perspective
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 25;
  camera.position.y = 5;
  camera.rotation.x = -Math.PI * 0.05;
  
  // Create a grid for tech effect
  const gridHelper = new THREE.GridHelper(100, 50, 0x0044ff, 0x0044ff);
  gridHelper.position.y = -10;
  gridHelper.material.opacity = 0.15;
  gridHelper.material.transparent = true;
  scene.add(gridHelper);

  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0x101080, 0.5);
  scene.add(ambientLight);
  
  // Add directional light
  const directionalLight = new THREE.DirectionalLight(0x4466ff, 0.8);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  
  // Enhanced particle effect
  const particleGeometry = new THREE.BufferGeometry();
  const particleCount = 800; // More particles
  
  const positionArray = new Float32Array(particleCount * 3);
  const scaleArray = new Float32Array(particleCount);
  const opacityArray = new Float32Array(particleCount);
  const colorArray = new Float32Array(particleCount * 3);
  
  // Create more interesting particle distribution
  for (let i = 0; i < particleCount; i++) {
    // Position with more depth and clusters
    const radius = Math.random() * 60 + 5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI - Math.PI/2;
    
    // Use spherical distribution with perturbation
    positionArray[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
    positionArray[i * 3 + 1] = radius * Math.sin(phi) + (Math.random() - 0.5) * 20;
    positionArray[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi) - 20;
    
    // Dynamic sizes based on position
    scaleArray[i] = Math.random() * 1 + 0.2;
    
    // Varying opacities
    opacityArray[i] = Math.random() * 0.8 + 0.2;
    
    // Multiple colors for tech effect
    const colorChoice = Math.random();
    if (colorChoice < 0.5) {
      // Blue tones
      colorArray[i * 3] = 0.1 + Math.random() * 0.2; // R
      colorArray[i * 3 + 1] = 0.3 + Math.random() * 0.5; // G
      colorArray[i * 3 + 2] = 0.7 + Math.random() * 0.3; // B
    } else if (colorChoice < 0.8) {
      // Cyan tones
      colorArray[i * 3] = 0.1 + Math.random() * 0.2; // R
      colorArray[i * 3 + 1] = 0.7 + Math.random() * 0.3; // G
      colorArray[i * 3 + 2] = 0.8 + Math.random() * 0.2; // B
    } else {
      // Accent color (orange)
      colorArray[i * 3] = 0.9 + Math.random() * 0.1; // R
      colorArray[i * 3 + 1] = 0.5 + Math.random() * 0.3; // G
      colorArray[i * 3 + 2] = 0.1; // B
    }
  }
  
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
  particleGeometry.setAttribute('scale', new THREE.BufferAttribute(scaleArray, 1));
  particleGeometry.setAttribute('opacity', new THREE.BufferAttribute(opacityArray, 1));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
  
  // Custom shader material for particles
  const particleMaterial = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      time: { value: 0 }
    },
    vertexShader: `
      attribute float scale;
      attribute float opacity;
      attribute vec3 color;
      
      varying float vOpacity;
      varying vec3 vColor;
      
      uniform float time;
      
      void main() {
        vOpacity = opacity;
        vColor = color;
        
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        
        // Animated scaling based on time
        float scaleVar = scale * (1.0 + 0.2 * sin(time * 0.5 + position.x + position.y));
        
        gl_PointSize = scaleVar * 2.0 * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying float vOpacity;
      varying vec3 vColor;
      
      void main() {
        // Soft circle shape
        float r = 0.5;
        vec2 center = vec2(0.5, 0.5);
        float dist = length(gl_PointCoord - center);
        float alpha = smoothstep(r, r - 0.05, dist);
        
        gl_FragColor = vec4(vColor, vOpacity * alpha);
      }
    `
  });
  
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);
  
  // Types for geometric shapes
  interface ShapeItem {
    mesh: THREE.Mesh;
    rotationSpeed: {
      x: number;
      y: number;
      z: number;
    };
    movementSpeed: number;
    movementOffset: number;
  }
  
  interface Connection {
    line: THREE.Line;
    start: number;
    end: number;
  }
  
  const shapes: ShapeItem[] = [];
  const geometries = [
    new THREE.IcosahedronGeometry(1, 0), // Low poly sphere
    new THREE.TetrahedronGeometry(1, 0), // Tetrahedron
    new THREE.OctahedronGeometry(1, 0)  // Octahedron
  ];
  
  // Create materials with different colors
  const materials = [
    new THREE.MeshPhongMaterial({ 
      color: 0x0088ff, 
      transparent: true, 
      opacity: 0.7,
      wireframe: Math.random() > 0.5,
      emissive: 0x002255
    }),
    new THREE.MeshPhongMaterial({ 
      color: 0x00ffcc, 
      transparent: true, 
      opacity: 0.7,
      wireframe: Math.random() > 0.5,
      emissive: 0x005522
    }),
    new THREE.MeshPhongMaterial({ 
      color: 0xff6600, 
      transparent: true, 
      opacity: 0.7,
      wireframe: Math.random() > 0.7,
      emissive: 0x551100
    })
  ];
  
  // Create and position shapes
  for (let i = 0; i < 15; i++) {
    const geometryIndex = Math.floor(Math.random() * geometries.length);
    const materialIndex = Math.floor(Math.random() * materials.length);
    
    const mesh = new THREE.Mesh(geometries[geometryIndex], materials[materialIndex]);
    
    // Position in clusters around space
    const distance = Math.random() * 40 + 10;
    const angle = Math.random() * Math.PI * 2;
    const height = (Math.random() - 0.5) * 30;
    
    mesh.position.set(
      Math.cos(angle) * distance,
      height,
      Math.sin(angle) * distance - 10
    );
    
    mesh.scale.setScalar(Math.random() * 2 + 0.5);
    mesh.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    
    scene.add(mesh);
    shapes.push({
      mesh,
      rotationSpeed: {
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.01
      },
      movementSpeed: Math.random() * 0.02 + 0.01,
      movementOffset: Math.random() * Math.PI * 2
    });
  }
  
  // Add connecting lines between some objects
  const lineMaterial = new THREE.LineBasicMaterial({ 
    color: 0x0088ff, 
    transparent: true, 
    opacity: 0.3
  });
  
  // Create connections
  const connections: Connection[] = [];
  
  // Animation loop
  function animate() {
    // Update uniforms
    (particleMaterial.uniforms.time as {value: number}).value += 0.01;
    
    // Animate floating shapes
    shapes.forEach(shape => {
      // Apply rotation
      shape.mesh.rotation.x += shape.rotationSpeed.x;
      shape.mesh.rotation.y += shape.rotationSpeed.y;
      shape.mesh.rotation.z += shape.rotationSpeed.z;
      
      // Apply floating movement
      const time = Date.now() * 0.001;
      shape.mesh.position.y += Math.sin(time * shape.movementSpeed + shape.movementOffset) * 0.01;
    });
    
    // Update camera
    camera.position.x = Math.sin(Date.now() * 0.0001) * 2;
    
    // Render scene
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  
  // Handle window resize
  function handleResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height, false);
  }
  
  // Initial setup
  handleResize();
  window.addEventListener('resize', handleResize);
  
  // Start animation loop
  animate();
  
  // Return cleanup function
  return () => {
    window.removeEventListener('resize', handleResize);
    renderer.dispose();
    
    // Dispose geometries and materials
    geometries.forEach(geometry => geometry.dispose());
    materials.forEach(material => material.dispose());
    
    // Clear scene
    while(scene.children.length > 0) { 
      const object = scene.children[0];
      if (object instanceof THREE.Mesh) {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      }
      scene.remove(object); 
    }
  };
} 