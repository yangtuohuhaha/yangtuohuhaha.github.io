// Legacy button-based prototype kept for comparison. The active demo uses game.js.
const MAX_ACTION_POINTS = 2;
const SAVE_KEY = "kpop-management-demo-save";

const trainingOptions = {
  vocal: {
    label: "声乐训练",
    stat: "vocal",
    statLabel: "唱功",
    cost: 500,
    note: "提升 Ballad 与 R&B 表现"
  },
  dance: {
    label: "舞蹈训练",
    stat: "dance",
    statLabel: "舞蹈",
    cost: 400,
    note: "提升 Dance 舞台出圈率"
  },
  rap: {
    label: "Rap 训练",
    stat: "rap",
    statLabel: "Rap",
    cost: 600,
    note: "提升风格辨识度"
  },
  charm: {
    label: "形体管理",
    stat: "charm",
    statLabel: "魅力",
    cost: 300,
    note: "提升粉丝转化能力"
  }
};

const albumTypes = {
  single: { label: "单曲", cost: 1000, duration: 2, multiplier: 1 },
  mini: { label: "迷你专", cost: 2000, duration: 3, multiplier: 1.25 }
};

const genres = {
  dance: { label: "Dance", min: 1.2, max: 1.2 },
  ballad: { label: "Ballad", min: 1, max: 1 },
  rnb: { label: "R&B", min: 0.85, max: 1.35 }
};

const priceStrategies = {
  low: { label: "低价冲量", salesMultiplier: 1.3, unitPrice: 5 },
  normal: { label: "正常定价", salesMultiplier: 1, unitPrice: 10 }
};

const eventPool = [
  {
    title: "练习室直拍被转发",
    desc: "一段舞蹈练习视频突然被剪成短视频传播，评论区开始讨论练习生的舞台潜力。",
    choices: [
      {
        text: "追加短视频推广",
        result: "公司顺势投放，讨论度扩大。",
        effect: { money: -300, popularity: 10, fans: 6 }
      },
      {
        text: "自然发酵",
        result: "话题自然扩散，热度小幅上涨。",
        effect: { popularity: 5, fans: 2 }
      }
    ]
  },
  {
    title: "训练视频被吐槽划水",
    desc: "有网友截出训练视频里的失误片段，质疑练习生状态不够稳定。",
    choices: [
      {
        text: "安排公开练习",
        result: "公开练习挽回了一部分口碑，也暴露了短板。",
        effect: { money: -500, popularity: 4, dance: 2 }
      },
      {
        text: "冷处理",
        result: "争议没有扩大，但粉丝信心受到影响。",
        effect: { popularity: -5, fans: -3 }
      }
    ]
  },
  {
    title: "直播清唱片段出圈",
    desc: "练习生在直播里临时清唱，声音条件被路人夸奖。",
    choices: [
      {
        text: "剪成正式物料",
        result: "官方剪辑帮助声乐标签建立起来。",
        effect: { money: -200, popularity: 8, fans: 5, vocal: 1 }
      },
      {
        text: "保持随意感",
        result: "粉丝觉得自然，路人讨论保持在小范围。",
        effect: { popularity: 4, fans: 3 }
      }
    ]
  },
  {
    title: "同行合照引发猜测",
    desc: "练习生被拍到与异性同行，社交平台出现各种猜测。",
    choices: [
      {
        text: "发简短声明",
        result: "公司快速澄清，粉丝情绪稳定。",
        effect: { money: -300, popularity: -2, fans: 1 }
      },
      {
        text: "不回应",
        result: "话题继续升温，但核心粉丝有明显不满。",
        effect: { popularity: 10, fans: -6 }
      }
    ]
  },
  {
    title: "粉丝见面会售罄",
    desc: "小型见面会门票售罄，经纪部门建议追加一场。",
    choices: [
      {
        text: "追加一场",
        result: "现金流改善，粉丝黏性上升。",
        effect: { money: 1400, popularity: 6, fans: 8 }
      },
      {
        text: "保持稀缺",
        result: "没有额外成本，话题保持在可控范围。",
        effect: { money: 800, popularity: 3, fans: 3 }
      }
    ]
  },
  {
    title: "新歌 Demo 泄露",
    desc: "未完成 Demo 被小范围传播，评价两极分化。",
    choices: [
      {
        text: "提前释出片段",
        result: "公司抢回叙事权，热度明显上升。",
        effect: { money: -400, popularity: 14 }
      },
      {
        text: "要求下架",
        result: "泄露被压住，但讨论也随之降温。",
        effect: { money: -200, popularity: -2 }
      }
    ]
  },
  {
    title: "身材管理路透被夸",
    desc: "健身房路透照片流出，练习生的职业感被粉丝称赞。",
    choices: [
      {
        text: "发布训练日记",
        result: "形象变得更努力，粉丝增长。",
        effect: { popularity: 6, fans: 4, charm: 2 }
      },
      {
        text: "低调处理",
        result: "话题没有扩大，但好感留在核心粉丝圈。",
        effect: { popularity: 3, charm: 1 }
      }
    ]
  },
  {
    title: "训练状态预警",
    desc: "练习生连续高强度训练后状态下滑，团队建议降低强度。",
    choices: [
      {
        text: "安排恢复训练",
        result: "状态被稳住，但本月额外支出增加。",
        effect: { money: -300, charm: 1, popularity: -1 }
      },
      {
        text: "继续推进",
        result: "短期没有停摆，但舆论注意到疲态。",
        effect: { popularity: -4, fans: -2 }
      }
    ]
  }
];

let state = createInitialState();
let selectedType = "single";
let selectedGenre = "dance";
let selectedPrice = "normal";
let pendingEvent = null;

const elements = {
  monthLabel: document.querySelector("#monthLabel"),
  moneyValue: document.querySelector("#moneyValue"),
  fansValue: document.querySelector("#fansValue"),
  popularityValue: document.querySelector("#popularityValue"),
  actionValue: document.querySelector("#actionValue"),
  totalStatLabel: document.querySelector("#totalStatLabel"),
  statList: document.querySelector("#statList"),
  trainingGrid: document.querySelector("#trainingGrid"),
  typeOptions: document.querySelector("#typeOptions"),
  genreOptions: document.querySelector("#genreOptions"),
  priceOptions: document.querySelector("#priceOptions"),
  startComebackButton: document.querySelector("#startComebackButton"),
  endMonthButton: document.querySelector("#endMonthButton"),
  albumStatus: document.querySelector("#albumStatus"),
  logList: document.querySelector("#logList"),
  currentReport: document.querySelector("#currentReport"),
  eventModal: document.querySelector("#eventModal"),
  eventTitle: document.querySelector("#eventTitle"),
  eventDesc: document.querySelector("#eventDesc"),
  eventChoices: document.querySelector("#eventChoices"),
  reportModal: document.querySelector("#reportModal"),
  reportTitle: document.querySelector("#reportTitle"),
  reportLines: document.querySelector("#reportLines"),
  closeReportButton: document.querySelector("#closeReportButton"),
  saveButton: document.querySelector("#saveButton"),
  loadButton: document.querySelector("#loadButton"),
  resetButton: document.querySelector("#resetButton"),
  toast: document.querySelector("#toast")
};

function createInitialState() {
  return {
    month: 1,
    money: 5000,
    fans: 50,
    popularity: 20,
    actionPoints: MAX_ACTION_POINTS,
    trainee: {
      vocal: 20,
      dance: 20,
      rap: 20,
      charm: 20
    },
    album: null,
    logs: ["公司成立，练习生 A 进入正式培养期。"],
    lastReport: "尚未生成月报。"
  };
}

function init() {
  renderOptionButtons();
  render();
  bindEvents();
}

function bindEvents() {
  elements.startComebackButton.addEventListener("click", startComeback);
  elements.endMonthButton.addEventListener("click", openMonthlyEvent);
  elements.closeReportButton.addEventListener("click", () => {
    elements.reportModal.close();
    render();
  });
  elements.saveButton.addEventListener("click", saveGame);
  elements.loadButton.addEventListener("click", loadGame);
  elements.resetButton.addEventListener("click", resetGame);
  elements.eventModal.addEventListener("cancel", event => event.preventDefault());
  elements.reportModal.addEventListener("cancel", event => event.preventDefault());
}

function renderOptionButtons() {
  renderSegment(elements.typeOptions, albumTypes, selectedType, value => {
    selectedType = value;
    render();
  });
  elements.genreOptions.classList.add("three");
  renderSegment(elements.genreOptions, genres, selectedGenre, value => {
    selectedGenre = value;
    render();
  });
  renderSegment(elements.priceOptions, priceStrategies, selectedPrice, value => {
    selectedPrice = value;
    render();
  });
}

function renderSegment(container, options, activeKey, onSelect) {
  container.innerHTML = "";
  Object.entries(options).forEach(([key, option]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `choice-button${key === activeKey ? " active" : ""}`;
    button.textContent = option.label;
    button.addEventListener("click", () => {
      onSelect(key);
      renderOptionButtons();
    });
    container.appendChild(button);
  });
}

function render() {
  elements.monthLabel.textContent = `第 ${state.month} 月`;
  elements.moneyValue.textContent = formatNumber(state.money);
  elements.fansValue.textContent = formatNumber(state.fans);
  elements.popularityValue.textContent = formatNumber(state.popularity);
  elements.actionValue.textContent = `${state.actionPoints}/${MAX_ACTION_POINTS}`;
  elements.totalStatLabel.textContent = `总属性 ${getTotalStat()}`;
  elements.currentReport.innerHTML = `<p>${state.lastReport}</p>`;

  renderStats();
  renderTrainingButtons();
  renderAlbumStatus();
  renderLogs();
  renderComebackButton();
}

function renderStats() {
  const stats = [
    ["唱功", state.trainee.vocal],
    ["舞蹈", state.trainee.dance],
    ["Rap", state.trainee.rap],
    ["魅力", state.trainee.charm]
  ];

  elements.statList.innerHTML = "";
  stats.forEach(([label, value]) => {
    const row = document.createElement("div");
    row.className = "stat-row";
    row.innerHTML = `
      <span>${label}</span>
      <div class="stat-bar" aria-hidden="true">
        <div class="stat-fill" style="width: ${value}%"></div>
      </div>
      <strong>${value}</strong>
    `;
    elements.statList.appendChild(row);
  });
}

function renderTrainingButtons() {
  elements.trainingGrid.innerHTML = "";
  Object.entries(trainingOptions).forEach(([key, option]) => {
    const button = document.createElement("button");
    const canTrain = state.money >= option.cost && state.actionPoints >= 1;
    button.type = "button";
    button.className = "training-button";
    button.disabled = !canTrain;
    button.innerHTML = `
      <strong>${option.label}</strong>
      <span>费用 ${option.cost} / 行动点 1</span>
      <span>${option.statLabel}成长，${option.note}</span>
    `;
    button.addEventListener("click", () => train(key));
    elements.trainingGrid.appendChild(button);
  });
}

function renderAlbumStatus() {
  if (!state.album) {
    elements.albumStatus.textContent = "暂无项目";
    return;
  }

  const type = albumTypes[state.album.type].label;
  const genre = genres[state.album.genre].label;
  const progress = `${state.album.progress}/${state.album.duration}`;
  elements.albumStatus.textContent = `${type} · ${genre} · 进度 ${progress}`;
}

function renderComebackButton() {
  const type = albumTypes[selectedType];
  const hasAlbum = Boolean(state.album);
  const canStart = !hasAlbum && state.actionPoints === MAX_ACTION_POINTS && state.money >= type.cost;
  elements.startComebackButton.disabled = !canStart;
  elements.startComebackButton.textContent = hasAlbum
    ? "已有回归进行中"
    : `启动回归：${type.label} / ${type.cost}`;
}

function renderLogs() {
  elements.logList.innerHTML = "";
  state.logs.slice(-12).reverse().forEach(log => {
    const item = document.createElement("li");
    item.textContent = log;
    elements.logList.appendChild(item);
  });
}

function train(key) {
  const option = trainingOptions[key];
  if (state.money < option.cost || state.actionPoints < 1) {
    showToast("资源不足，无法安排这项训练。");
    return;
  }

  const currentValue = state.trainee[option.stat];
  const gain = getTrainingGain(currentValue);
  state.money -= option.cost;
  state.actionPoints -= 1;
  state.trainee[option.stat] = clamp(currentValue + gain, 0, 100);
  state.popularity = clamp(state.popularity + 1, 0, 999);
  addLog(`第 ${state.month} 月：${option.label}完成，${option.statLabel} +${gain}，热度 +1。`);

  if (Math.random() < 0.12) {
    const bonus = option.stat === "charm" ? "粉丝 +3" : "热度 +3";
    if (option.stat === "charm") {
      state.fans += 3;
    } else {
      state.popularity += 3;
    }
    addLog(`训练插曲：练习生 A 状态不错，${bonus}。`);
  }

  render();
}

function startComeback() {
  const type = albumTypes[selectedType];
  if (state.album) {
    showToast("已有回归项目在制作中。");
    return;
  }
  if (state.actionPoints !== MAX_ACTION_POINTS) {
    showToast("本月已经训练过，不能再启动回归。");
    return;
  }
  if (state.money < type.cost) {
    showToast("资金不足，无法启动回归。");
    return;
  }

  state.money -= type.cost;
  state.actionPoints = 0;
  state.album = {
    type: selectedType,
    genre: selectedGenre,
    price: selectedPrice,
    progress: 0,
    duration: type.duration,
    cost: type.cost
  };

  addLog(`第 ${state.month} 月：启动${type.label}回归，制作费 ${type.cost}，本月训练锁定。`);
  render();
}

function openMonthlyEvent() {
  pendingEvent = eventPool[randomInt(0, eventPool.length - 1)];
  elements.eventTitle.textContent = pendingEvent.title;
  elements.eventDesc.textContent = pendingEvent.desc;
  elements.eventChoices.innerHTML = "";

  pendingEvent.choices.forEach(choice => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button";
    button.textContent = choice.text;
    button.addEventListener("click", () => resolveEvent(choice));
    elements.eventChoices.appendChild(button);
  });

  elements.eventModal.showModal();
}

function resolveEvent(choice) {
  applyEffect(choice.effect);
  addLog(`热搜：${pendingEvent.title}。处理方式：${choice.text}。${choice.result}`);
  elements.eventModal.close();
  settleMonth(choice.result);
}

function settleMonth(eventResult) {
  const report = [];
  const finishedMonth = state.month;
  report.push(`事件处理：${eventResult}`);

  if (state.album) {
    state.album.progress += 1;
    if (state.album.progress >= state.album.duration) {
      const outcome = releaseAlbum();
      report.push(outcome.summary);
      report.push(`首周销量 ${outcome.sales}，销售回款 ${outcome.revenue}。`);
      report.push(`新增粉丝 ${outcome.fansGain}，新增热度 ${outcome.popularityGain}。`);
    } else {
      report.push(`回归制作推进：${state.album.progress}/${state.album.duration}。`);
    }
  } else {
    report.push("本月没有回归项目，训练成果等待后续转化。");
  }

  const baseIncome = 500 + state.fans * 5;
  state.money += baseIncome;
  report.push(`月度基础收入 ${baseIncome}。`);

  const oldPopularity = state.popularity;
  state.popularity = Math.floor(state.popularity * 0.9);
  report.push(`热度自然衰减：${oldPopularity} -> ${state.popularity}。`);

  state.actionPoints = MAX_ACTION_POINTS;
  state.month += 1;
  clampState();

  state.lastReport = report.join("<br>");
  addLog(`第 ${finishedMonth} 月结算完成。资金 ${state.money}，粉丝 ${state.fans}，热度 ${state.popularity}。`);
  openReport(finishedMonth, report);
}

function releaseAlbum() {
  const album = state.album;
  const type = albumTypes[album.type];
  const genre = genres[album.genre];
  const price = priceStrategies[album.price];
  const genreCoefficient = randomFloat(genre.min, genre.max);
  const totalStat = getTotalStat();
  const salesCap = state.fans * (1 + totalStat / 200);
  const sales = Math.max(0, Math.round(
    salesCap *
    type.multiplier *
    genreCoefficient *
    price.salesMultiplier *
    (1 + state.popularity / 100)
  ));
  const revenue = sales * price.unitPrice;
  const fansGain = Math.round(sales * 0.12 * (1 + state.trainee.charm / 300));
  const popularityGain = Math.round(sales * 0.06);
  const net = revenue - album.cost;

  state.money += revenue;
  state.fans += fansGain;
  state.popularity += popularityGain;
  state.album = null;

  const summary = `${type.label}发行完成，${genres[album.genre].label} 风格系数 ${genreCoefficient.toFixed(2)}，本次净收益 ${net}。`;
  addLog(`回归发行：${summary}`);

  return {
    summary,
    sales,
    revenue,
    fansGain,
    popularityGain
  };
}

function openReport(month, lines) {
  elements.reportTitle.textContent = `第 ${month} 月报告`;
  elements.reportLines.innerHTML = "";
  lines.forEach(line => {
    const p = document.createElement("p");
    p.innerHTML = line;
    elements.reportLines.appendChild(p);
  });
  elements.reportModal.showModal();
}

function applyEffect(effect) {
  Object.entries(effect).forEach(([key, value]) => {
    if (key in state.trainee) {
      state.trainee[key] = clamp(state.trainee[key] + value, 0, 100);
      return;
    }
    state[key] = (state[key] ?? 0) + value;
  });
  clampState();
}

function getTrainingGain(currentValue) {
  if (currentValue < 50) {
    return randomInt(6, 10);
  }
  if (currentValue < 75) {
    return randomInt(4, 7);
  }
  return randomInt(2, 5);
}

function getTotalStat() {
  return state.trainee.vocal + state.trainee.dance + state.trainee.rap + state.trainee.charm;
}

function addLog(text) {
  state.logs.push(text);
  if (state.logs.length > 80) {
    state.logs = state.logs.slice(-80);
  }
}

function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  showToast("存档完成。");
}

function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) {
    showToast("没有找到存档。");
    return;
  }
  try {
    state = JSON.parse(raw);
    clampState();
    showToast("读档完成。");
    render();
  } catch (error) {
    showToast("存档损坏，无法读取。");
  }
}

function resetGame() {
  state = createInitialState();
  localStorage.removeItem(SAVE_KEY);
  showToast("已重开。");
  render();
}

function clampState() {
  state.money = Math.max(0, Math.round(state.money));
  state.fans = Math.max(0, Math.round(state.fans));
  state.popularity = clamp(Math.round(state.popularity), 0, 999);
  state.actionPoints = clamp(Math.round(state.actionPoints), 0, MAX_ACTION_POINTS);
  Object.keys(state.trainee).forEach(key => {
    state.trainee[key] = clamp(Math.round(state.trainee[key]), 0, 100);
  });
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    elements.toast.classList.remove("visible");
  }, 1800);
}

function formatNumber(value) {
  return new Intl.NumberFormat("zh-CN").format(value);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

init();
