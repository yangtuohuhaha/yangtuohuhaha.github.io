/* ============================================================
   THE LAST ARCHIVE — Main App Orchestration
   ============================================================ */

class TheLastArchive {
  constructor() {
    this.currentScene = 'entry';
    this.observerCount = 1;
    this.filteredCategory = 'all';

    this.init();
  }

  async init() {
    // Initialize space scene
    spaceScene = new SpaceScene();

    // Setup event listeners
    this.setupEntryScene();
    this.setupFilters();
    this.renderCards();

    // Entry animation
    this.animateEntryIn();

    // Update observer count display
    this.updateObserverCount();

    // Show random civilization broadcast
    this.showRandomBroadcast();
  }

  /* ================================================================
     SCENE 1: ENTRY
     ================================================================ */

  animateEntryIn() {
    const entryEl = document.getElementById('scene-entry');
    const titleContainer = entryEl.querySelector('.title-container');
    const subtitle = entryEl.querySelector('.subtitle');
    const button = entryEl.querySelector('.entry-actions');
    const hint = entryEl.querySelector('.entry-hint');

    // Start with elements invisible, title blurred
    gsap.set([subtitle, button, hint], { opacity: 0, y: 30 });
    gsap.set(titleContainer, { opacity: 0, filter: 'blur(12px)', letterSpacing: '0.5em' });

    // Staggered entrance
    const tl = gsap.timeline({ delay: 0.5 });

    tl.to(titleContainer, {
      opacity: 1,
      filter: 'blur(0px)',
      letterSpacing: '0em',
      duration: 2.2,
      ease: 'power3.out',
    })
    .to(subtitle, {
      opacity: 1, y: 0, duration: 1.2, ease: 'power2.out',
    }, '-=0.8')
    .to(button, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
    }, '-=0.4')
    .to(hint, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
    }, '-=0.2');
  }

  setupEntryScene() {
    const btn = document.getElementById('btn-accept-legacy');

    // Breathing glow hint after 5s idle
    const idleTimer = setTimeout(() => {
      btn.classList.add('idle-hint');
    }, 5000);

    btn.addEventListener('click', async () => {
      clearTimeout(idleTimer);
      btn.classList.remove('idle-hint');
      // Initialize audio on first user interaction
      audio.init();
      audio.startAmbient();
      audio.playImpact();

      // Transition to sync scene
      await transitions.entryToSync();
      this.currentScene = 'sync';

      // Start sync progress
      await this.runSyncSequence();

      // Transition to archive
      await transitions.syncToArchive();
      this.currentScene = 'archive';
      this.animateArchiveIn();
    });
  }

  /* ================================================================
     SCENE 2: CONSCIOUSNESS SYNC
     ================================================================ */

  async runSyncSequence() {
    await transitions.runSyncProgress(
      (progress) => {
        // Optional: update external UI
        if (spaceScene && progress > 50) {
          spaceScene.intensify(1 + (progress - 50) / 100);
        }
      },
      (status) => {
        // Status change callback — could log or display elsewhere
        console.log('[Sync]', status);
      }
    );
  }

  /* ================================================================
     SCENE 3: ARCHIVE INTERFACE
     ================================================================ */

  animateArchiveIn() {
    const archiveEl = document.getElementById('scene-archive');
    const header = archiveEl.querySelector('.archive-header');
    const filters = archiveEl.querySelector('.archive-filters');
    const cards = archiveEl.querySelectorAll('.artifact-card');

    gsap.set([header, filters], { opacity: 0, y: -20 });
    gsap.set(cards, { opacity: 0, y: 30 });

    const tl = gsap.timeline();

    tl.to(header, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
    })
    .to(filters, {
      opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
    }, '-=0.3');

    // Staggered card entrance
    cards.forEach((card, i) => {
      tl.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
      }, `-=0.${Math.min(i, 5)}`);
    });
  }

  setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.filteredCategory = btn.dataset.filter;
        this.renderCards();
        audio.playPulse();
      });
    });
  }

  /* ================================================================
     CARD RENDERING
     ================================================================ */

  renderCards() {
    const grid = document.getElementById('cards-grid');
    grid.innerHTML = '';

    const artifacts = filterArtifacts(this.filteredCategory);

    artifacts.forEach((artifact, index) => {
      const card = this.createCardElement(artifact, index);
      grid.appendChild(card);
    });

    // Animate new cards in
    const cards = grid.querySelectorAll('.artifact-card');
    gsap.fromTo(cards,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power2.out',
      }
    );
  }

  createCardElement(artifact, index) {
    const card = document.createElement('div');
    card.className = 'artifact-card';
    card.setAttribute('data-id', artifact.id);

    // Corner accents
    card.innerHTML = `
      <div class="card-corner tl"></div>
      <div class="card-corner tr"></div>
      <div class="card-corner bl"></div>
      <div class="card-corner br"></div>

      <div class="card-code">${artifact.civilizationCode}</div>
      <div class="card-name">${artifact.artifactName}</div>
      <div class="card-desc">${artifact.description}</div>

      <div class="card-danger">
        <span class="danger-label">危险等级</span>
        <span class="danger-stars">
          ${this.renderDangerStars(artifact.dangerLevel)}
        </span>
        <span class="danger-note">${artifact.dangerNote}</span>
      </div>

      <div class="card-activate">触碰以同步</div>
    `;

    // Randomize floating animation per card
    const floatDuration = 4 + Math.random() * 2; // 4-6s
    const floatDelay = Math.random() * -6; // negative delay = random start phase
    card.style.animation = `float-card ${floatDuration}s ease-in-out ${floatDelay}s infinite`;

    // Card click → artifact activation
    card.addEventListener('click', () => {
      // Mobile: flash hint then open Bilibili
      const isMobile = window.innerWidth < 768 || 'ontouchstart' in window;
      if (isMobile) {
        card.style.boxShadow = '0 0 30px rgba(201,169,110,0.6)';
        setTimeout(() => {
          window.open(`https://www.bilibili.com/video/${artifact.bvid}/`, '_blank');
          card.style.boxShadow = '';
        }, 400);
        this.observerCount++;
        this.updateObserverCount();
        return;
      }

      // Desktop: full animation sequence
      transitions.activateArtifact(card, artifact).then(() => {
        this.observerCount++;
        this.updateObserverCount();
      });
    });

    // Hover effects
    card.addEventListener('mouseenter', () => {
      audio.playPulse();
    });

    return card;
  }

  renderDangerStars(level) {
    let html = '';
    for (let i = 0; i < 5; i++) {
      if (i < level) {
        html += '<span class="danger-star">★</span>';
      } else {
        html += '<span class="danger-star empty">★</span>';
      }
    }
    return html;
  }

  updateObserverCount() {
    const el = document.getElementById('observer-count');
    if (el) {
      el.textContent = this.observerCount;
    }
  }

  showRandomBroadcast() {
    const broadcasts = [
      '今日 127 名观测者与"张量空间操控教义"建立同步。',
      '警告：Archive 005 检测到异常知识潮汐。建议观测者提前同步。',
      '文明预言：下一个觉醒周期将在 Epoch 7 降临。',
      '档案记录：连续 72 小时无观测者退出同步。文明稳定。',
      '"大罗洞玄·因果律初解"今日被 203 名观测者同时访问。知识共鸣场正在形成。',
      '注意：观测者同步深度已达历史最高水平。建议适当休息。',
      'Archive 003 报告：虚空计算创世协议被高频调用。创世之力正在觉醒。',
      '跨文明广播：检测到另一个文明分支正在接近本档案库。来源未知。',
    ];
    const el = document.getElementById('broadcast-text');
    if (el) {
      el.textContent = broadcasts[Math.floor(Math.random() * broadcasts.length)];
    }
  }
}

/* ================================================================
   BOOTSTRAP
   ================================================================ */

// Wait for DOM and fonts
window.addEventListener('DOMContentLoaded', () => {
  // Small delay to ensure fonts load
  document.fonts.ready.then(() => {
    new TheLastArchive();
  });

  // Close projection button
  const btnClose = document.getElementById('btn-close-projection');
  if (btnClose) {
    btnClose.addEventListener('click', () => {
      transitions.closeProjection();
    });
  }

  // Keyboard: Esc to close projection
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const overlay = document.getElementById('projection-overlay');
      if (overlay && overlay.classList.contains('active')) {
        transitions.closeProjection();
      }
    }
  });
});

// Handle visibility change — pause/resume audio
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    audio.mute();
  } else {
    audio.unmute();
  }
});
