/* ============================================================
   THE LAST ARCHIVE — Cinematic Transition System
   ============================================================ */

class TransitionManager {
  constructor() {
    this.overlay = document.getElementById('transition-overlay');
    this.portalContainer = document.getElementById('portal-container');
    this.flash = this.overlay.querySelector('.transition-flash');
    this.vortex = this.overlay.querySelector('.transition-vortex');
    this.cracks = this.overlay.querySelector('.transition-cracks');
    this.ring = document.getElementById('transition-ring');
    this.isTransitioning = false;
  }

  /**
   * Scene fade transition: fade out current, fade in target.
   */
  async sceneFade(fromSelector, toSelector, duration = 800) {
    const fromEl = typeof fromSelector === 'string'
      ? document.querySelector(fromSelector)
      : fromSelector;
    const toEl = typeof toSelector === 'string'
      ? document.querySelector(toSelector)
      : toSelector;

    if (!fromEl || !toEl) return;

    return new Promise(resolve => {
      gsap.to(fromEl, {
        opacity: 0,
        duration: duration / 2000,
        ease: 'power2.in',
        onComplete: () => {
          fromEl.classList.remove('active');
          toEl.classList.add('active');
          gsap.fromTo(toEl,
            { opacity: 0 },
            {
              opacity: 1,
              duration: duration / 2000,
              ease: 'power2.out',
              onComplete: resolve,
            }
          );
        },
      });
    });
  }

  /**
   * Entry → Sync transition with lightning flash.
   */
  async entryToSync() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    const entryEl = document.getElementById('scene-entry');
    const syncEl = document.getElementById('scene-sync');

    // Flash overlay
    this.overlay.classList.add('active');
    await this.animateFlash(0.7, 0.05);

    // Add screen shake
    document.body.classList.add('screen-shake');
    audio.playImpact();

    // Switch scenes
    entryEl.classList.remove('active');
    syncEl.classList.add('active');
    syncEl.style.opacity = '0';

    // Fade out flash
    await this.animateFlash(0, 0.6);

    // Fade in sync scene
    gsap.to(syncEl, { opacity: 1, duration: 0.6, ease: 'power2.out' });

    document.body.classList.remove('screen-shake');
    this.overlay.classList.remove('active');
    this.isTransitioning = false;
  }

  /**
   * Sync → Archive transition with wormhole effect.
   */
  async syncToArchive() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    const syncEl = document.getElementById('scene-sync');
    const archiveEl = document.getElementById('scene-archive');

    audio.playChime();

    // Brief pause after sync completion
    await this.delay(1200);

    // Vortex in
    this.overlay.classList.add('active');
    await this.animateVortex(300, 0.5);

    // White flash
    await this.animateFlash(1, 0.15);
    audio.playWhoosh(0.6);

    // Switch scenes
    syncEl.classList.remove('active');
    archiveEl.classList.add('active');
    archiveEl.style.opacity = '0';

    // Vanish
    await this.animateFlash(0, 0.8);
    this.overlay.classList.remove('active');
    this.resetVortex();

    // Fade in archive
    gsap.to(archiveEl, { opacity: 1, duration: 0.8, ease: 'power2.out' });

    this.isTransitioning = false;
  }

  /**
   * Artifact activation → Portal → Open Knowledge Projection.
   */
  async activateArtifact(cardElement, artifactData) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    // 1. Highlight the card
    audio.playPulse();
    gsap.to(cardElement, {
      scale: 1.03,
      boxShadow: '0 0 60px rgba(240,208,104,0.4), 0 0 120px rgba(200,164,78,0.2)',
      borderColor: 'rgba(240,208,104,0.8)',
      duration: 0.3,
      ease: 'power2.out',
    });

    await this.delay(300);

    // 2. Screen shake
    document.body.classList.add('screen-shake');
    audio.playImpact();
    await this.delay(400);
    document.body.classList.remove('screen-shake');

    // 3. Crack effect
    this.overlay.classList.add('active');
    this.cracks.style.opacity = '1';
    await this.delay(400);

    // 4. Expand ring from card position
    const cardRect = cardElement.getBoundingClientRect();
    const centerX = cardRect.left + cardRect.width / 2;
    const centerY = cardRect.top + cardRect.height / 2;

    this.ring.style.left = centerX + 'px';
    this.ring.style.top = centerY + 'px';
    this.ring.style.transform = 'translate(-50%, -50%)';
    this.ring.style.opacity = '1';
    this.ring.style.width = '100px';
    this.ring.style.height = '100px';

    audio.playPortal();

    // 5. Expand ring to cover screen
    gsap.to(this.ring, {
      width: window.innerWidth * 2.5,
      height: window.innerWidth * 2.5,
      duration: 1.2,
      ease: 'power3.in',
    });

    // 6. Portal vortex effect
    await this.delay(600);
    await this.animateFlash(1, 0.4);
    audio.playWhoosh(0.5);

    // 7. Text reveal: "知识载体连接中……" → "BILIBILI"
    await this.revealText('知识载体连接中……', 1000);
    await this.revealText('BILIBILI', 800);

    // 8. Cleanup transition effects
    await this.delay(200);
    await this.animateFlash(0, 0.5);
    this.cracks.style.opacity = '0';
    this.ring.style.opacity = '0';
    this.ring.style.width = '0';
    this.ring.style.height = '0';
    this.overlay.classList.remove('active');
    this.resetVortex();
    this.hideRevealText();

    // Reset card
    gsap.to(cardElement, {
      scale: 1,
      boxShadow: '',
      borderColor: '',
      duration: 0.5,
      ease: 'power2.out',
    });

    // 9. Open Knowledge Projection (fullscreen Bilibili player)
    this.openProjection(artifactData);

    this.isTransitioning = false;
  }

  /**
   * Open knowledge projection player with Bilibili iframe.
   */
  openProjection(artifactData) {
    const bvid = artifactData.bvid;
    const directUrl = `https://www.bilibili.com/video/${bvid}/`;

    // Mobile: skip embedded player, go straight to Bilibili
    const isMobile = window.innerWidth < 768 || 'ontouchstart' in window;
    if (isMobile) {
      window.open(directUrl, '_blank');
      return;
    }

    const overlay = document.getElementById('projection-overlay');
    const iframe = document.getElementById('projection-iframe');
    const nameEl = document.getElementById('projection-name');
    const codeEl = document.getElementById('projection-code');
    const fallbackBtn = document.getElementById('btn-fallback-bilibili');

    // Player embed URL
    const playerUrl = `https://player.bilibili.com/player.html?bvid=${bvid}&page=1&autoplay=1&high_quality=1&as_wide=1&danmaku=0`;

    // Set metadata
    nameEl.textContent = artifactData.artifactName;
    codeEl.textContent = artifactData.civilizationCode;

    // Update fallback button link
    if (fallbackBtn) {
      fallbackBtn.href = directUrl;
    }

    // Track if iframe loads successfully
    let iframeLoaded = false;
    const onLoad = () => { iframeLoaded = true; };
    iframe.addEventListener('load', onLoad, { once: true });

    // Fallback: if iframe fails to load in 3s, open in new tab
    this._projectionTimeout = setTimeout(() => {
      if (!iframeLoaded) {
        window.open(directUrl, '_blank');
      }
    }, 3000);

    // Load iframe
    iframe.src = playerUrl;

    // Show overlay
    overlay.classList.add('active');
    overlay.classList.remove('closing');

    audio.playChime();
  }

  /**
   * Close knowledge projection player.
   */
  closeProjection() {
    const overlay = document.getElementById('projection-overlay');
    const iframe = document.getElementById('projection-iframe');

    if (this._projectionTimeout) {
      clearTimeout(this._projectionTimeout);
      this._projectionTimeout = null;
    }

    overlay.classList.add('closing');

    audio.playImpact();

    setTimeout(() => {
      overlay.classList.remove('active');
      overlay.classList.remove('closing');
      iframe.src = ''; // Stop video
    }, 400);
  }

  /**
   * Progress bar animation for sync.
   */
  async runSyncProgress(onUpdate, onStatusChange) {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const statusText = document.getElementById('sync-status-text');
    const syncComplete = document.getElementById('sync-complete');

    const statusMessages = [
      '正在初始化神经链接...',
      '正在校准意识频率...',
      '正在建立档案库连接...',
      '正在解码文明签名...',
      '正在绘制知识拓扑...',
      '正在验证观测者身份...',
      '正在同步记忆碎片...',
      '正在协调认知共振...',
      '正在加载神器索引...',
      '正在完成同步...',
    ];

    // Simulate progress with irregular steps for realism
    const steps = [
      { target: 8, duration: 400 },
      { target: 12, duration: 600 },
      { target: 23, duration: 500 },
      { target: 31, duration: 800 },
      { target: 38, duration: 400 },
      { target: 41, duration: 700 },
      { target: 55, duration: 500 },
      { target: 62, duration: 600 },
      { target: 70, duration: 700 },
      { target: 76, duration: 500 },
      { target: 85, duration: 600 },
      { target: 89, duration: 400 },
      { target: 94, duration: 500 },
      { target: 97, duration: 400 },
      { target: 100, duration: 300 },
    ];

    let currentProgress = 0;
    let msgIndex = 0;

    for (const step of steps) {
      await this.delay(step.duration);

      currentProgress = step.target;
      progressFill.style.width = currentProgress + '%';
      progressText.textContent = currentProgress + '%';

      if (onUpdate) onUpdate(currentProgress);

      // Update status message at intervals
      if (currentProgress > msgIndex * (100 / statusMessages.length) && msgIndex < statusMessages.length) {
        statusText.textContent = statusMessages[msgIndex];
        if (onStatusChange) onStatusChange(statusMessages[msgIndex]);
        msgIndex++;
      }
    }

    // Completion
    await this.delay(400);
    statusText.textContent = '';
    syncComplete.classList.remove('hidden');
    progressFill.style.background = '#c9a96e';
    progressFill.style.boxShadow = '0 0 20px rgba(201,169,110,0.5)';

    // Fade sync UI to transparency
    const syncContent = document.querySelector('.sync-content');
    if (syncContent) {
      gsap.to(syncContent, {
        opacity: 0.3,
        duration: 1.5,
        ease: 'power2.out',
      });
    }

    audio.playChime();
  }

  /* --- Internal helpers --- */

  animateFlash(targetOpacity, duration) {
    return new Promise(resolve => {
      gsap.to(this.flash, {
        opacity: targetOpacity,
        duration,
        ease: targetOpacity > 0 ? 'power2.in' : 'power2.out',
        onComplete: resolve,
      });
    });
  }

  animateVortex(targetSize, duration) {
    return new Promise(resolve => {
      gsap.to(this.vortex, {
        width: targetSize,
        height: targetSize,
        duration,
        ease: 'power3.in',
        onComplete: resolve,
      });
    });
  }

  resetVortex() {
    this.vortex.style.width = '0';
    this.vortex.style.height = '0';
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Reveal text in the center of the transition overlay.
   */
  revealText(text, displayMs) {
    const el = document.getElementById('transition-reveal-text');
    if (!el) return this.delay(displayMs);

    return new Promise(resolve => {
      // Set text and show
      el.textContent = text;
      el.classList.add('visible');

      // Fade out after display duration
      setTimeout(() => {
        el.classList.remove('visible');
        setTimeout(resolve, 400); // wait for CSS transition
      }, displayMs);
    });
  }

  hideRevealText() {
    const el = document.getElementById('transition-reveal-text');
    if (el) {
      el.classList.remove('visible');
      el.textContent = '';
    }
  }
}

// Global transition manager
const transitions = new TransitionManager();
