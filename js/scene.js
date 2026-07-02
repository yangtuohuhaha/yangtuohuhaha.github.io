/* ============================================================
   THE LAST ARCHIVE — Three.js Space Scene
   ============================================================ */

class SpaceScene {
  constructor() {
    this.canvas = document.getElementById('bg-canvas');
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.rings = [];
    this.stars = null;
    this.runeParticles = null;
    this.centralGlow = null;
    this.clock = new THREE.Clock();
    this.animationId = null;
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;

    this.init();
  }

  init() {
    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0.5, 8);
    this.camera.lookAt(0, 0, 0);

    // Create all scene elements
    this.createStarfield();
    this.createNebulaDust();
    this.createCentralStructure();
    this.createRuneParticles();
    this.createAmbientLights();

    // Events
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));

    // Start animation
    this.animate();
  }

  createStarfield() {
    // Main star field: 3000 particles in a large sphere
    const count = 3000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Random position on a large sphere
      const radius = 15 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Varied sizes
      sizes[i] = Math.random() * 2.5 + 0.3;

      // Color: white/blue/violet mix
      const colorChoice = Math.random();
      if (colorChoice < 0.6) {
        colors[i * 3] = 0.7 + Math.random() * 0.3;
        colors[i * 3 + 1] = 0.7 + Math.random() * 0.3;
        colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
      } else if (colorChoice < 0.8) {
        colors[i * 3] = 0.4 + Math.random() * 0.3;
        colors[i * 3 + 1] = 0.5 + Math.random() * 0.3;
        colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
      } else {
        colors[i * 3] = 0.7 + Math.random() * 0.3;
        colors[i * 3 + 1] = 0.55 + Math.random() * 0.2;
        colors[i * 3 + 2] = 0.3 + Math.random() * 0.2;
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom shader or PointsMaterial
    const material = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.8,
    });

    this.stars = new THREE.Points(geometry, material);
    this.scene.add(this.stars);
  }

  createNebulaDust() {
    // Closer, larger dust particles for volumetric feel
    const count = 500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const radius = 3 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.08,
      color: new THREE.Color(0x3a2a6a),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.3,
    });

    this.nebulaDust = new THREE.Points(geometry, material);
    this.scene.add(this.nebulaDust);
  }

  createCentralStructure() {
    const ringGroup = new THREE.Group();

    // Ring 1: Large golden ring (horizontal / slight tilt)
    const ring1Geo = new THREE.TorusGeometry(2.4, 0.015, 16, 180);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0xc8a44e,
      transparent: true,
      opacity: 0.5,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI * 0.45;
    ring1.rotation.y = Math.PI * 0.15;
    ringGroup.add(ring1);
    this.rings.push({ mesh: ring1, speed: 0.08, axis: 'y' });

    // Ring 2: Medium cyan ring
    const ring2Geo = new THREE.TorusGeometry(1.8, 0.012, 16, 150);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x00c8e8,
      transparent: true,
      opacity: 0.4,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI * 0.65;
    ring2.rotation.z = Math.PI * 0.3;
    ringGroup.add(ring2);
    this.rings.push({ mesh: ring2, speed: -0.12, axis: 'x' });

    // Ring 3: Inner thin gold ring
    const ring3Geo = new THREE.TorusGeometry(1.3, 0.01, 16, 120);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: 0xf0d068,
      transparent: true,
      opacity: 0.55,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.x = Math.PI * 0.25;
    ring3.rotation.z = Math.PI * 0.55;
    ringGroup.add(ring3);
    this.rings.push({ mesh: ring3, speed: 0.15, axis: 'z' });

    // Ring 4: Wireframe outer ring
    const ring4Geo = new THREE.TorusGeometry(2.8, 0.008, 8, 200);
    const ring4Mat = new THREE.MeshBasicMaterial({
      color: 0x888898,
      transparent: true,
      opacity: 0.2,
    });
    const ring4 = new THREE.Mesh(ring4Geo, ring4Mat);
    ring4.rotation.y = Math.PI * 0.7;
    ring4.rotation.x = Math.PI * 0.2;
    ringGroup.add(ring4);
    this.rings.push({ mesh: ring4, speed: -0.05, axis: 'y' });

    // Central glowing sphere
    const sphereGeo = new THREE.SphereGeometry(0.15, 32, 32);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
    });
    this.centralGlow = new THREE.Mesh(sphereGeo, sphereMat);
    ringGroup.add(this.centralGlow);

    // Outer glow (larger transparent sphere)
    const glowGeo = new THREE.SphereGeometry(0.35, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xf0d068,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const glowSphere = new THREE.Mesh(glowGeo, glowMat);
    ringGroup.add(glowSphere);

    // Second glow layer (cyan)
    const glow2Geo = new THREE.SphereGeometry(0.5, 32, 32);
    const glow2Mat = new THREE.MeshBasicMaterial({
      color: 0x00c8e8,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const glowSphere2 = new THREE.Mesh(glow2Geo, glow2Mat);
    ringGroup.add(glowSphere2);

    this.ringGroup = ringGroup;
    this.scene.add(ringGroup);
  }

  createRuneParticles() {
    // Small orbiting particles around the rings
    const count = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const radius = 1.3 + Math.random() * 2.5;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 3;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.03,
      color: 0xf0d068,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.5,
    });

    this.runeParticles = new THREE.Points(geometry, material);
    this.scene.add(this.runeParticles);
  }

  createAmbientLights() {
    // Subtle ambient
    const ambient = new THREE.AmbientLight(0x111122, 0.5);
    this.scene.add(ambient);

    // Point light at center
    const pointLight = new THREE.PointLight(0xf0d068, 1.5, 6, 1);
    pointLight.position.set(0, 0, 0);
    this.scene.add(pointLight);

    // Secondary cyan light
    const pointLight2 = new THREE.PointLight(0x00c8e8, 0.8, 8, 1);
    pointLight2.position.set(1, 1, -1);
    this.scene.add(pointLight2);
  }

  onMouseMove(event) {
    this.targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
    this.targetMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());

    const dt = this.clock.getDelta();
    const elapsed = this.clock.elapsedTime;

    // Smooth mouse follow
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.02;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.02;

    // Camera gentle orbit + mouse parallax
    const orbitRadius = 7;
    const orbitSpeed = 0.08;
    const camX = Math.cos(elapsed * orbitSpeed) * orbitRadius * 0.3 + this.mouseX * 1.5;
    const camY = Math.sin(elapsed * orbitSpeed * 0.7) * 2 + this.mouseY * 0.8;
    const camZ = Math.sin(elapsed * orbitSpeed) * orbitRadius * 0.3 + 7;

    this.camera.position.x += (camX - this.camera.position.x) * 0.01;
    this.camera.position.y += (camY - this.camera.position.y) * 0.01;
    this.camera.position.z += (camZ - this.camera.position.z) * 0.01;
    this.camera.lookAt(0, 0, 0);

    // Rotate rings
    this.rings.forEach(ring => {
      if (ring.axis === 'y') ring.mesh.rotation.y += ring.speed * dt;
      if (ring.axis === 'x') ring.mesh.rotation.x += ring.speed * dt;
      if (ring.axis === 'z') ring.mesh.rotation.z += ring.speed * dt;
    });

    // Rotate star field slowly
    if (this.stars) {
      this.stars.rotation.y += 0.015 * dt;
      this.stars.rotation.x += 0.005 * dt;
    }

    // Rotate nebula dust
    if (this.nebulaDust) {
      this.nebulaDust.rotation.y -= 0.02 * dt;
      this.nebulaDust.rotation.z += 0.01 * dt;
    }

    // Animate rune particles
    if (this.runeParticles) {
      this.runeParticles.rotation.y += 0.2 * dt;
      this.runeParticles.rotation.x += 0.1 * dt;
    }

    // Central glow pulsation
    if (this.centralGlow) {
      const pulse = 1 + Math.sin(elapsed * 2) * 0.3;
      this.centralGlow.scale.setScalar(pulse);
      this.centralGlow.material.opacity = 0.7 + Math.sin(elapsed * 2.5) * 0.3;
    }

    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Increase scene intensity (for sync/activation sequences).
   */
  intensify(factor = 1.5) {
    if (this.stars) {
      this.stars.material.opacity = Math.min(1, 0.8 * factor);
    }
    if (this.ringGroup) {
      this.ringGroup.children.forEach(child => {
        if (child.material && child.material.opacity !== undefined) {
          child.material.opacity = Math.min(1, child.material.opacity * factor);
        }
      });
    }
  }

  /**
   * Reset scene intensity to normal.
   */
  normalize() {
    if (this.stars) {
      this.stars.material.opacity = 0.8;
    }
  }

  /**
   * Cleanup.
   */
  dispose() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.renderer.dispose();
    // Dispose geometries and materials
    this.scene.traverse(child => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
  }
}

// Global space scene instance
let spaceScene = null;
