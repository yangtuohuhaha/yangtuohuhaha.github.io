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

    // Start with elements invisible
    gsap.set([titleContainer, subtitle, button, hint], { opacity: 0, y: 30 });

    // Staggered entrance
    const tl = gsap.timeline({ delay: 0.5 });

    tl.to(titleContainer, {
      opacity: 1, y: 0, duration: 1.8, ease: 'power3.out',
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

    btn.addEventListener('click', async () => {
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

      <div class="card-real">
        ▸ ${artifact.realCourse} · ${artifact.realTeacher}
      </div>

      <div class="card-activate">激活遗物</div>
    `;

    // Card click → artifact activation
    card.addEventListener('click', async () => {
      await transitions.activateArtifact(card, artifact);
      this.observerCount++;
      this.updateObserverCount();
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
