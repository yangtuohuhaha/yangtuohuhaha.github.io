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
    // Initialize space scene (hidden during prelude)
    spaceScene = new SpaceScene();

    // Setup event listeners (entry button etc)
    this.setupEntryScene();
    this.setupFilters();
    this.renderCards();

    // Run prelude sequence
    await this.runPrelude();

    // After prelude: show entry
    this.showEntryAfterPrelude();
  }

  async runPrelude() {
    const preludeEl = document.getElementById('scene-prelude');
    const bootFill = document.getElementById('boot-progress-fill');
    const bootStatus = document.getElementById('boot-status');
    const glitch = document.getElementById('prelude-glitch');
    const bsod = document.getElementById('prelude-bsod');
    const black = document.getElementById('prelude-black');

    // Stage 1: Fake boot progress — subtle data ticks
    const bootTick = () => {
      if (!audio.initialized) return;
      const ctx = audio.ctx;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 800 + Math.random() * 400;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.03, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(g); g.connect(audio.masterGain);
      osc.start(now); osc.stop(now + 0.06);
    };

    const statusMessages = [
      '正在初始化用户认证模块……',
      '正在加载课程索引数据库……',
      '正在初始化播放器组件……',
      '正在检测网络连接……',
      '正在同步本地缓存数据……',
      '正在载入推荐算法引擎……',
      '正在校验知识库完整性……',
      '即将完成启动……',
    ];

    for (let i = 0; i < statusMessages.length; i++) {
      const progress = Math.min(12 + i * 11, 99);
      bootFill.style.width = progress + '%';
      bootStatus.textContent = statusMessages[i];
      bootTick();
      await this.delay(500 + Math.random() * 400);
    }

    // Stage 2: Stuck at 99%
    bootStatus.textContent = '正在完成启动……';
    await this.delay(2000);
    bootStatus.textContent = '正在完成启动……';
    await this.delay(2000);
    bootStatus.textContent = '正在完成启动……';
    await this.delay(1500);

    // Stage 3: Glitch — static noise burst
    if (audio.initialized) audio.playWhoosh(0.3);
    bootStatus.textContent = '���ڃ��……��…��';
    glitch.classList.remove('hidden');
    glitch.classList.add('active');
    await this.delay(1200);

    // Stage 4: BSOD with continuous shake + CRT damage
    glitch.classList.remove('active');
    glitch.classList.add('hidden');
    document.querySelector('.prelude-boot').classList.add('hidden');
    bsod.classList.remove('hidden');
    if (audio.initialized) audio.playImpact(); // Crash impact

    const crtDamage = document.getElementById('crt-damage');

    // Fire CRT damage overlay — stays active for entire BSOD
    crtDamage.classList.remove('hidden');
    crtDamage.classList.add('active');

    // Continuous shake loop for 4 seconds
    let shaking = true;
    const shakeLoop = async () => {
      while (shaking) {
        const dx = (Math.random() - 0.5) * 40;
        const dy = (Math.random() - 0.5) * 30;
        const dur = 0.06 + Math.random() * 0.08;
        gsap.to(preludeEl, { x: dx, y: dy, duration: dur, ease: 'power2.out' });
        await this.delay(Math.floor(dur * 1000));
      }
    };
    shakeLoop();

    await this.delay(4000);
    shaking = false;

    // Settle
    gsap.to(preludeEl, { x: 0, y: 0, duration: 0.3, ease: 'power4.out' });

    // Remove CRT damage
    await this.delay(300);
    crtDamage.classList.remove('active');
    crtDamage.classList.add('hidden');

    // Stage 5: Cinematic narrative
    await this.runCinematicNarrative();

    // Stage 6: Black
    black.classList.remove('hidden');
    await this.delay(1500);
  }

  async showEntryAfterPrelude() {
    const preludeEl = document.getElementById('scene-prelude');
    const entryEl = document.getElementById('scene-entry');

    // Fade out prelude scene
    await new Promise(resolve => {
      gsap.to(preludeEl, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.in',
        onComplete: () => {
          preludeEl.classList.remove('active');
          resolve();
        },
      });
    });

    // Show entry scene
    entryEl.classList.add('active');
    entryEl.style.opacity = '0';
    gsap.to(entryEl, {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
    });

    // Chronicle fragments animation
    this.animateChronicles();

    // Entry title animation
    this.animateEntryIn();

    // Update observer count display
    this.updateObserverCount();

    // Apply path-based atmosphere
    this.applyPathAtmosphere();

    // Start idle energy-save watcher
    this.startIdleWatcher();

    // Load external data
    this.loadDailyResonance();
    this.loadAssociations();
    this.loadObserverLog();

    // Show random civilization broadcast
    this.showRandomBroadcast();
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async runCinematicNarrative() {
    const narrative = document.getElementById('prelude-narrative');
    const bsod = document.getElementById('prelude-bsod');
    const canvas = document.getElementById('narrative-canvas');
    const ctx = canvas.getContext('2d');
    let animFrame;
    let gridAlpha = 0;
    let pathProgress = 0;
    let scanRadius = 0;
    let scanAlpha = 0;
    let t = 0;

    // Hide BSOD before narrative starts
    bsod.classList.add('hidden');
    narrative.classList.remove('hidden');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Canvas render loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      // Grid
      if (gridAlpha > 0) {
        ctx.strokeStyle = `rgba(80,100,90,${gridAlpha * 0.35})`;
        ctx.lineWidth = 0.8;
        const step = 50;
        // Horizontal lines with perspective fade
        for (let y = step; y < h; y += step) {
          const distFromCenter = Math.abs(y - h * 0.5) / (h * 0.5);
          const alpha = gridAlpha * 0.35 * (1 - distFromCenter * 0.7);
          ctx.strokeStyle = `rgba(80,100,90,${alpha})`;
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }
        for (let x = step; x < w; x += step) {
          ctx.strokeStyle = `rgba(80,100,90,${gridAlpha * 0.2})`;
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        // Glowing center cross
        const cx = w / 2, cy = h * 0.45;
        ctx.strokeStyle = `rgba(100,140,110,${gridAlpha * 0.25})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
      }

      // Data path
      if (pathProgress > 0) {
        const cx = w / 2;
        const cy = h * 0.6;
        const vanishingY = h * 0.12;
        // Main convergence lines
        ctx.strokeStyle = `rgba(200,220,210,${pathProgress * 0.35})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        for (let i = 0; i < 7; i++) {
          const startX = cx - 24 + i * 8;
          const endX = cx + (startX - cx) * 3.5 * pathProgress;
          ctx.moveTo(startX, cy);
          ctx.lineTo(endX, vanishingY);
        }
        ctx.stroke();
        // Brighter center line
        ctx.strokeStyle = `rgba(220,240,230,${pathProgress * 0.5})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx, vanishingY);
        ctx.stroke();
      }

      // Scan ring
      if (scanAlpha > 0) {
        ctx.strokeStyle = `rgba(94,234,212,${scanAlpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(w / 2, h * 0.45, scanRadius, 0, Math.PI * 2);
        ctx.stroke();
        // Inner glow ring
        if (scanRadius > 10) {
          ctx.strokeStyle = `rgba(94,234,212,${scanAlpha * 0.3})`;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(w / 2, h * 0.45, scanRadius * 0.85, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      t += 0.016;
      animFrame = requestAnimationFrame(render);
    };
    render();

    // Phase 00: Grid emergence (0–5s)
    const fadeGrid = { val: 0 };
    gsap.to(fadeGrid, { val: 1, duration: 4, ease: 'power2.in',
      onUpdate: () => { gridAlpha = fadeGrid.val; },
    });
    await this.delay(5000);

    // Phase 01: Path generation (5–10s) — rising tone
    if (audio.initialized) audio.playPortal();
    const traceEl = document.getElementById('narr-trace');
    traceEl.classList.remove('hidden');
    await this.delay(400);
    traceEl.classList.add('visible');
    const fadePath = { val: 0 };
    gsap.to(fadePath, { val: 1, duration: 3, ease: 'power2.out',
      onUpdate: () => { pathProgress = fadePath.val; },
    });
    await this.delay(5000);

    // Phase 02: Anomaly labels (10–15s)
    const tag1 = document.getElementById('narr-tag1');
    const tag2 = document.getElementById('narr-tag2');
    tag1.classList.remove('hidden');
    await this.delay(600);
    tag1.classList.add('visible');
    await this.delay(800);
    tag2.classList.remove('hidden');
    await this.delay(500);
    tag2.classList.add('visible');
    await this.delay(3000);

    // Phase 03: Identity rewrite (15–22s) — glitch pulse
    if (audio.initialized) audio.playPulse();
    gsap.to(narrative, { filter: 'blur(2px)', duration: 0.3, ease: 'power2.in' });
    await this.delay(300);
    gsap.to(narrative, { filter: 'blur(0px)', duration: 1.5, ease: 'power2.out' });

    const idPanel = document.getElementById('narr-identity');
    const idV = document.getElementById('narr-id-v');
    const idU = document.getElementById('narr-id-u');
    const idE = document.getElementById('narr-id-e');
    idPanel.classList.remove('hidden');
    idPanel.classList.add('visible');
    await this.delay(600);
    idV.textContent = '→ NULL'; idV.parentElement.classList.add('changed');
    await this.delay(800);
    idU.textContent = '→ NULL'; idU.parentElement.classList.add('changed');
    await this.delay(1000);
    idE.textContent = 'UNDEFINED'; idE.parentElement.classList.add('changed');
    await this.delay(3000);

    // Phase 04: Observer (22–28s) — scan ring with sweep
    if (audio.initialized) audio.playWhoosh(0.6);
    scanAlpha = 0.6;
    const fadeScan = { val: 0 };
    gsap.to(fadeScan, { val: 300, duration: 3, ease: 'power2.out',
      onUpdate: () => { scanRadius = fadeScan.val; scanAlpha = 0.6 - fadeScan.val / 600; },
    });
    const obsEl = document.getElementById('narr-observer');
    obsEl.classList.remove('hidden');
    await this.delay(500);
    obsEl.classList.add('visible');
    await this.delay(3000);
    // Pull ring back
    const fadeBack = { val: scanRadius };
    gsap.to(fadeBack, { val: 0, duration: 1.5, ease: 'power2.in',
      onUpdate: () => { scanRadius = fadeBack.val; scanAlpha = fadeBack.val / 300 * 0.5; },
    });
    await this.delay(1500);

    // Phase 05: System hesitation (28–33s)
    obsEl.classList.remove('visible');
    idPanel.classList.remove('visible');
    tag1.classList.remove('visible');
    tag2.classList.remove('visible');
    pathProgress = 0.5;
    await this.delay(2000);

    const noteEl = document.getElementById('narr-note');
    noteEl.classList.remove('hidden');
    await this.delay(600);
    noteEl.classList.add('visible');
    await this.delay(3000);

    // Phase 06: Choice layer (33–40s)
    noteEl.classList.remove('visible');
    pathProgress = 0.3;
    const choicesEl = document.getElementById('narr-choices');
    choicesEl.classList.remove('hidden');
    await this.delay(400);
    choicesEl.classList.add('visible');
    const choice = await this.waitForNarrChoice(choicesEl, 7000);
    choicesEl.classList.add('dim');
    // Store path for archive atmosphere
    this.observerPath = choice || '02'; // default to scan if no choice

    // Phase 07: Final (40s+)
    if (choice) {
      await this.delay(800);
    } else {
      await this.delay(400);
    }
    choicesEl.classList.remove('visible');
    gridAlpha = 0.3;
    pathProgress = 0.15;
    scanAlpha = 0;

    const finalEl = document.getElementById('narr-final');
    finalEl.classList.remove('hidden');
    await this.delay(300);
    finalEl.classList.add('visible');
    if (audio.initialized) audio.playChime(); // Final title chime
    await this.delay(3500);

    // Fade into entry — screen "sinks" into data layer
    gsap.to(narrative, {
      opacity: 0,
      scale: 1.05,
      duration: 2,
      ease: 'power2.in',
    });
    await this.delay(2000);

    cancelAnimationFrame(animFrame);
    narrative.classList.add('hidden');
    narrative.style.opacity = '';
    narrative.style.scale = '';
  }

  waitForNarrChoice(container, timeoutMs) {
    return new Promise(resolve => {
      let resolved = false;
      const onChoice = (choice) => {
        if (resolved) return;
        resolved = true;
        clearTimeout(timer);
        resolve(choice);
      };
      container.querySelectorAll('.narr-choice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          if (!audio.initialized) { audio.init(); audio.startAmbient(); }
          onChoice(btn.dataset.choice);
        });
      });
      const timer = setTimeout(() => {
        if (resolved) return;
        resolved = true;
        resolve(null);
      }, timeoutMs);
    });
  }

  waitForChoice(container, timeoutMs) {
    return new Promise(resolve => {
      let resolved = false;

      const onChoice = (choice) => {
        if (resolved) return;
        resolved = true;
        clearTimeout(timer);
        resolve(choice);
      };

      container.querySelectorAll('.narrative-btn').forEach(btn => {
        btn.addEventListener('click', () => onChoice(btn.dataset.choice));
      });

      const timer = setTimeout(() => {
        if (resolved) return;
        resolved = true;
        resolve(null); // timeout = no choice
      }, timeoutMs);
    });
  }

  /* ================================================================
     SCENE 1: ENTRY
     ================================================================ */

  animateEntryIn() {
    const entryEl = document.getElementById('scene-entry');
    const terminalStatus = entryEl.querySelector('.terminal-status');
    const terminalDesignation = entryEl.querySelector('.terminal-designation');
    const terminalInfo = entryEl.querySelector('.terminal-info');
    const terminalMotto = entryEl.querySelector('.terminal-motto');
    const terminalAction = entryEl.querySelector('.terminal-action');
    const terminalHint = entryEl.querySelector('.terminal-hint');

    // Start invisible
    gsap.set([terminalStatus, terminalInfo, terminalMotto, terminalAction, terminalHint], { opacity: 0, y: 15 });
    gsap.set(terminalDesignation, { opacity: 0, filter: 'blur(12px)' });

    const tl = gsap.timeline({ delay: 0.5 });

    // Terminal header lines appear
    tl.to(terminalStatus, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
    })
    // Designation: blur → clear
    .to(terminalDesignation, {
      opacity: 1,
      filter: 'blur(0px)',
      duration: 2,
      ease: 'power3.out',
    }, '-=0.3')
    // Info rows stagger
    .to(terminalInfo.querySelectorAll('.terminal-line'), {
      opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out',
    }, '-=1.2')
    // Motto
    .to(terminalMotto, {
      opacity: 1, y: 0, duration: 1, ease: 'power2.out',
    }, '-=0.3')
    // Action button
    .to(terminalAction, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
    }, '-=0.4')
    // Hint at bottom
    .to(terminalHint, {
      opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
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
        if (audio.initialized) audio.playPulse();
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
      if (audio.initialized) audio.playPulse();
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

  animateChronicles() {
    const fragments = document.querySelectorAll('.chronicle-fragment');
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    fragments.forEach((el, i) => {
      // Read target position from inline style
      const targetTop = el.style.top;
      const targetLeft = el.style.left;
      const targetRight = el.style.right;

      // Start at center, invisible
      gsap.set(el, {
        top: '50%',
        left: targetLeft ? '50%' : 'auto',
        right: targetRight ? '50%' : 'auto',
        xPercent: -50,
        yPercent: -50,
        scale: 0.5,
        opacity: 0,
      });

      const tl = gsap.timeline({ delay: i * 2.2 }); // stagger each fragment

      // Phase 1: Appear at center, grow
      tl.to(el, {
        scale: 1.3,
        opacity: 0.8,
        duration: 1.2,
        ease: 'power2.out',
      })
      // Phase 2: Hold for reading
      .to(el, {
        scale: 1.3,
        opacity: 0.8,
        duration: 1.5,
        ease: 'none',
      })
      // Phase 3: Drift to final position at edge
      .to(el, {
        top: targetTop,
        left: targetLeft || 'auto',
        right: targetRight || 'auto',
        xPercent: 0,
        yPercent: 0,
        scale: 0.85,
        opacity: 0.4,
        duration: 3,
        ease: 'power3.inOut',
      });
    });
  }

  showRandomBroadcast() {
    const path = this.observerPath || '02';

    const broadcasts = {
      '01': [ // Core descent — cold, distant, ominous
        '核心层温度持续下降。建议观测者保持距离。',
        '深层档案波动异常。因果律区段出现不可逆衰变。',
        '警告：观测者同步深度已超出安全阈值。',
        'Archive 001 报告：遗物结构出现微裂纹。原因不明。',
        '深层广播：……（无法解析的信号）',
        '系统日志：连续 48 小时无观测者主动断开同步。',
      ],
      '02': [ // Scan relic — curious, warm, exploratory
        '今日 127 名观测者与"张量空间操控教义"建立同步。',
        '"大罗洞玄·因果律初解"今日被 203 名观测者同时访问。知识共鸣场正在形成。',
        'Archive 003 报告：虚空计算创世协议被高频调用。创世之力正在觉醒。',
        '档案记录：连续 72 小时无观测者退出同步。文明稳定。',
        '跨文明广播：检测到另一个文明分支正在接近本档案库。来源未知。',
        '观测者请注意：遗物"离散逻辑矩阵法典"今日能量读数异常活跃。',
        '文明预言：下一个觉醒周期将在 Epoch 7 降临。',
        '注意：观测者同步深度已达历史最高水平。建议适当休息。',
      ],
      '03': [ // Outer layer — detached, minimal
        '外层无异常。',
        '档案库处于待机状态。',
        '系统提示：已连续 36 小时无深度同步记录。',
        '观测者活动：低。',
      ],
    };

    const pool = broadcasts[path] || broadcasts['02'];
    const el = document.getElementById('broadcast-text');
    if (el) {
      el.textContent = pool[Math.floor(Math.random() * pool.length)];
    }
  }

  /**
   * Apply atmosphere based on observer path.
   */
  applyPathAtmosphere() {
    const path = this.observerPath || '02';
    const cards = document.querySelectorAll('.artifact-card');

    if (path === '01') {
      // Cold: reduce card glow, cooler tone
      cards.forEach(c => { c.style.boxShadow = 'none'; });
      document.documentElement.style.setProperty('--gold-primary', '#8a7a5a');
    } else if (path === '03') {
      // Detached: dimmer overall
      cards.forEach(c => { c.style.opacity = '0.7'; });
      document.documentElement.style.setProperty('--gold-primary', '#7a6e52');
    }
    // Path 02 keeps defaults — no changes
  }

  /**
   * Start idle energy-save timer.
   */
  startIdleWatcher() {
    let idleTimer;
    const resetIdle = () => {
      clearTimeout(idleTimer);
      document.body.classList.remove('idle-mode');
      idleTimer = setTimeout(() => {
        document.body.classList.add('idle-mode');
      }, 30000); // 30s of no interaction → energy save
    };

    ['mousemove', 'click', 'touchstart', 'scroll'].forEach(evt => {
      document.addEventListener(evt, resetIdle);
    });
    resetIdle();
  }

  /**
   * Load daily resonance — highlight today's featured relic.
   */
  async loadDailyResonance() {
    try {
      const res = await fetch('data/resonance.json');
      if (!res.ok) return;
      const data = await res.json();
      const card = document.querySelector(`[data-id="${data.relic.id}"]`);
      if (card) {
        card.classList.add('resonant');
        card.style.boxShadow = '0 0 30px rgba(201,169,110,0.3), 0 0 60px rgba(201,169,110,0.1)';
        // Add a subtle pulse label
        const label = document.createElement('div');
        label.className = 'resonance-badge';
        label.textContent = data.resonance.label;
        card.appendChild(label);
        // Store resonance flavor for broadcast
        this.dailyResonance = data;
      }
    } catch (e) { /* file may not exist yet */ }
  }

  /**
   * Load relic associations — prepare connection data.
   */
  async loadAssociations() {
    try {
      const res = await fetch('data/associations.json');
      if (!res.ok) return;
      this.associations = await res.json();
    } catch (e) { /* file may not exist yet */ }
  }

  /**
   * Load observer log — show sync progress in archive.
   */
  async loadObserverLog() {
    try {
      const res = await fetch('data/observer-log.json');
      if (!res.ok) return;
      const log = await res.json();
      const synced = log.records.length;
      const total = 8;
      // Update archive subtitle with sync progress
      const subtitle = document.querySelector('.archive-subtitle');
      if (subtitle && synced > 0) {
        subtitle.textContent = `文明遗物档案 // 同步率 ${synced}/${total} // Alpha-7 扇区`;
      }
      // Mark synced cards
      log.records.forEach(r => {
        const card = document.querySelector(`[data-id="${r.relicId}"]`);
        if (card) card.classList.add('synced');
      });
    } catch (e) { /* file may not exist yet */ }
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
