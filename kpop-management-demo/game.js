const SLOT_COUNT = 4;
const SAVE_KEY = "kpop-management-demo-schedule-save";

const statLabels = {
  vocal: "唱功",
  dance: "舞蹈",
  rap: "Rap",
  charm: "魅力"
};

const activityOptions = {
  vocal: {
    label: "声乐训练",
    type: "training",
    stat: "vocal",
    baseCost: 220,
    baseGain: 3.2,
    pressure: 4,
    note: "提升 Ballad 与 R&B 表现"
  },
  dance: {
    label: "舞蹈训练",
    type: "training",
    stat: "dance",
    baseCost: 200,
    baseGain: 3,
    pressure: 5,
    note: "提升舞台表现，少量带动热度"
  },
  rap: {
    label: "Rap 训练",
    type: "training",
    stat: "rap",
    baseCost: 240,
    baseGain: 3.1,
    pressure: 4,
    note: "提升风格辨识度"
  },
  charm: {
    label: "形体管理",
    type: "training",
    stat: "charm",
    baseCost: 180,
    baseGain: 2.8,
    pressure: 3,
    note: "提升粉丝转化能力"
  },
  content: {
    label: "内容拍摄",
    type: "exposure",
    baseCost: 260,
    fans: 3,
    popularity: 4,
    pressure: 4,
    note: "产出 vlog、练习室短片和物料"
  },
  promo: {
    label: "社媒宣传",
    type: "exposure",
    baseCost: 300,
    fans: 1,
    popularity: 7,
    pressure: 2,
    note: "快速拉热度，适合回归前"
  },
  albumWork: {
    label: "回归制作",
    type: "album",
    baseCost: 360,
    progress: 1,
    pressure: 5,
    requiresAlbum: true,
    note: "推进录音、编舞、视觉包装"
  },
  rest: {
    label: "休整",
    type: "rest",
    baseCost: 0,
    pressure: -12,
    note: "降低压力，牺牲当周产出"
  }
};

const albumTypes = {
  single: { label: "单曲", cost: 1000, duration: 5, multiplier: 1 },
  mini: { label: "迷你专", cost: 2000, duration: 8, multiplier: 1.25 }
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
    desc: "一段练习视频被剪成短视频传播，评论区开始讨论练习生的舞台潜力。",
    choices: [
      {
        text: "追加短视频推广",
        result: "公司顺势投放，讨论度扩大。",
        effect: { money: -300, popularity: 10, fans: 6, pressure: 2 }
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
        effect: { money: -500, popularity: 4, dance: 2, pressure: 4 }
      },
      {
        text: "冷处理",
        result: "争议没有扩大，但粉丝信心受到影响。",
        effect: { popularity: -5, fans: -3, pressure: -2 }
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
        effect: { money: -200, popularity: 8, fans: 5, vocal: 1, pressure: 1 }
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
        effect: { money: -300, popularity: -2, fans: 1, pressure: -2 }
      },
      {
        text: "不回应",
        result: "话题继续升温，但核心粉丝有明显不满。",
        effect: { popularity: 10, fans: -6, pressure: 3 }
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
        effect: { money: 1400, popularity: 6, fans: 8, pressure: 5 }
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
        effect: { money: -400, popularity: 14, pressure: 4 }
      },
      {
        text: "要求下架",
        result: "泄露被压住，但讨论也随之降温。",
        effect: { money: -200, popularity: -2, pressure: -1 }
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
        effect: { popularity: 6, fans: 4, charm: 2, pressure: 1 }
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
        effect: { money: -300, charm: 1, popularity: -1, pressure: -10 }
      },
      {
        text: "继续推进",
        result: "短期没有停摆，但舆论注意到疲态。",
        effect: { popularity: -4, fans: -2, pressure: 8 }
      }
    ]
  }
];

const hotSearchPool = [
  {
    id: "dance-practice",
    title: "练习室直拍挑战上升",
    tag: "舞蹈",
    trend: "上升",
    heat: 86,
    matches: ["dance", "content"],
    advice: "适合安排舞蹈训练或内容拍摄，走舞台出圈路线。",
    buyText: "买下后本月舞蹈/内容行程获得额外热度。",
    effect: { popularity: 8, fans: 2, pressure: 2 }
  },
  {
    id: "vocal-live",
    title: "清唱实力讨论升温",
    tag: "唱功",
    trend: "上升",
    heat: 78,
    matches: ["vocal", "content"],
    advice: "适合补声乐训练，或用内容拍摄放大实力标签。",
    buyText: "买下后本月声乐/内容行程获得额外粉丝。",
    effect: { popularity: 6, fans: 4, pressure: 1 }
  },
  {
    id: "comeback-rumor",
    title: "小公司新人回归传闻",
    tag: "回归",
    trend: "稳定",
    heat: 74,
    matches: ["albumWork", "promo"],
    advice: "适合推进回归制作，再配合社媒宣传预热。",
    buyText: "买下后本月回归制作/宣传行程获得额外收益。",
    effect: { popularity: 9, pressure: 3 }
  },
  {
    id: "visual-route",
    title: "路透图颜值出圈",
    tag: "颜值",
    trend: "上升",
    heat: 69,
    matches: ["charm", "content"],
    advice: "适合安排形体管理或内容拍摄，提升吸粉效率。",
    buyText: "买下后本月形体/内容行程获得额外粉丝。",
    effect: { popularity: 5, fans: 5, pressure: 1 }
  },
  {
    id: "fatigue-talk",
    title: "新人高强度训练争议",
    tag: "争议",
    trend: "上升",
    heat: 66,
    matches: ["rest"],
    advice: "适合安排休整，压力过高时不要硬冲。",
    buyText: "不建议主动买，除非你想用公关压住争议。",
    effect: { popularity: 4, fans: -3, pressure: 5 }
  },
  {
    id: "variety-open",
    title: "综艺新人位空缺",
    tag: "行业",
    trend: "稳定",
    heat: 58,
    matches: ["content", "promo"],
    advice: "适合做内容拍摄或社媒宣传，争取路人盘。",
    buyText: "买下后本月内容/宣传行程更容易涨粉。",
    effect: { popularity: 5, fans: 3, pressure: 2 }
  },
  {
    id: "rnb-niche",
    title: "小众 R&B 舞台被夸",
    tag: "曲风",
    trend: "上升",
    heat: 55,
    matches: ["vocal", "rap", "albumWork"],
    advice: "适合补声乐/Rap，或者把回归曲风往 R&B 靠。",
    buyText: "买下后本月声乐/Rap/回归制作获得小幅加成。",
    effect: { popularity: 6, fans: 2, pressure: 2 }
  }
];

const worldNewsPool = [
  {
    tags: ["舞蹈"],
    text: "短视频平台本周更偏好练习室挑战，舞蹈训练和内容拍摄更容易被传播。"
  },
  {
    tags: ["唱功"],
    text: "音乐社区开始讨论新人 live 实力，声乐训练和录音室物料更容易圈路人。"
  },
  {
    tags: ["回归"],
    text: "多家小公司正在抢下月回归窗口，提前预热会影响首周声量。"
  },
  {
    tags: ["颜值"],
    text: "粉丝社区本周路透图讨论增加，形体管理和视觉物料更容易转粉。"
  },
  {
    tags: ["争议"],
    text: "行业开始讨论新人高压训练，压力过高的团队更容易被负面解读。"
  },
  {
    tags: ["行业"],
    text: "综艺新人位出现空缺，社媒宣传和内容拍摄的路人收益提高。"
  },
  {
    tags: ["曲风"],
    text: "小众曲风舞台被剪辑传播，R&B 与 Rap 相关能力更容易被注意。"
  },
  {
    tags: ["通用"],
    text: "头部团体宣布新一轮宣传期，中小公司需要找差异化标签避开正面竞争。"
  },
  {
    tags: ["通用"],
    text: "粉丝平台提高活动页推荐权重，稳定更新内容能带来更高粉丝黏性。"
  }
];

const synergyNotes = {
  "dance-practice": {
    dance: "练习室直拍素材更容易传播",
    content: "本月物料适合剪成挑战视频"
  },
  "vocal-live": {
    vocal: "清唱片段强化实力派标签",
    content: "录音室物料更容易被路人接受"
  },
  "comeback-rumor": {
    albumWork: "回归传闻让制作进度更受关注",
    promo: "预热内容更像正式宣发"
  },
  "visual-route": {
    charm: "路透图放大视觉标签",
    content: "视觉物料更容易转粉"
  },
  "fatigue-talk": {
    rest: "休整降低过劳争议"
  },
  "variety-open": {
    content: "内容物料更像综艺试镜样片",
    promo: "社媒宣传更容易进入路人视野"
  },
  "rnb-niche": {
    vocal: "声乐细节更容易被小众听众认可",
    rap: "Rap 段落更容易形成风格记忆点",
    albumWork: "回归制作更容易打出曲风差异"
  }
};

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
  slotValue: document.querySelector("#slotValue"),
  pressureValue: document.querySelector("#pressureValue"),
  totalStatLabel: document.querySelector("#totalStatLabel"),
  statList: document.querySelector("#statList"),
  scheduleList: document.querySelector("#scheduleList"),
  estimateCost: document.querySelector("#estimateCost"),
  estimatePressure: document.querySelector("#estimatePressure"),
  estimateFocus: document.querySelector("#estimateFocus"),
  hotSearchStatus: document.querySelector("#hotSearchStatus"),
  hotSearchList: document.querySelector("#hotSearchList"),
  typeOptions: document.querySelector("#typeOptions"),
  genreOptions: document.querySelector("#genreOptions"),
  priceOptions: document.querySelector("#priceOptions"),
  createAlbumButton: document.querySelector("#createAlbumButton"),
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
    pressure: 20,
    trainee: {
      vocal: 20,
      dance: 20,
      rap: 20,
      charm: 20
    },
    album: null,
    schedule: createDefaultSchedule(),
    hotSearches: generateHotSearches(1),
    boughtHotSearchId: null,
    logs: ["公司成立，练习生 A 进入正式培养期。"],
    lastReport: "尚未生成月报。"
  };
}

function createDefaultSchedule() {
  return [
    { activity: "vocal", intensity: 2, budget: 400 },
    { activity: "dance", intensity: 2, budget: 400 },
    { activity: "content", intensity: 1, budget: 300 },
    { activity: "rest", intensity: 1, budget: 0 }
  ];
}

function init() {
  renderOptionButtons();
  render();
  bindEvents();
}

function bindEvents() {
  elements.createAlbumButton.addEventListener("click", createAlbumProject);
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

function render() {
  ensureScheduleShape();
  ensureHotSearchShape();
  const estimate = simulateSchedule(false);

  elements.monthLabel.textContent = `第 ${state.month} 月`;
  elements.moneyValue.textContent = formatNumber(state.money);
  elements.fansValue.textContent = formatNumber(state.fans);
  elements.popularityValue.textContent = formatNumber(state.popularity);
  elements.slotValue.textContent = `${state.schedule.length}/${SLOT_COUNT}`;
  elements.pressureValue.textContent = `${state.pressure}`;
  elements.totalStatLabel.textContent = `总属性 ${getTotalStat()}`;
  elements.currentReport.innerHTML = `<p>${state.lastReport}</p>`;
  elements.estimateCost.textContent = formatNumber(estimate.cost);
  elements.estimatePressure.textContent = formatSigned(estimate.pressureDelta);
  elements.estimateFocus.textContent = getScheduleFocus(estimate);
  elements.hotSearchStatus.textContent = state.boughtHotSearchId ? "本月已买" : "可买 1 条";
  elements.endMonthButton.disabled = estimate.cost > state.money;
  elements.endMonthButton.textContent = estimate.cost > state.money ? "资金不足，无法执行" : "执行本月行程";

  renderStats();
  renderSchedule();
  renderHotSearches();
  renderAlbumStatus();
  renderLogs();
  renderCreateAlbumButton();
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

function renderSchedule() {
  elements.scheduleList.innerHTML = "";
  state.schedule.forEach((slot, index) => {
    const activity = activityOptions[slot.activity] ?? activityOptions.rest;
    const row = document.createElement("div");
    row.className = "schedule-row";
    row.innerHTML = `
      <div class="week-label">第 ${index + 1} 周</div>
      <div class="schedule-main">
        <select aria-label="第 ${index + 1} 周行程"></select>
        <div class="schedule-preview">${activity.note}</div>
      </div>
      <div class="schedule-tuning">
        <div class="slider-row">
          <label>强度</label>
          <input type="range" min="1" max="3" step="1" value="${slot.intensity}" aria-label="第 ${index + 1} 周强度">
          <output>${slot.intensity}</output>
        </div>
        <div class="slider-row">
          <label>预算</label>
          <input type="range" min="0" max="1000" step="100" value="${slot.budget}" aria-label="第 ${index + 1} 周预算">
          <output>${slot.budget}</output>
        </div>
      </div>
    `;

    const select = row.querySelector("select");
    Object.entries(activityOptions).forEach(([key, option]) => {
      const item = document.createElement("option");
      item.value = key;
      item.textContent = option.label;
      item.selected = key === slot.activity;
      item.disabled = option.requiresAlbum && !state.album;
      select.appendChild(item);
    });
    select.addEventListener("change", event => {
      const nextActivity = event.target.value;
      state.schedule[index].activity = nextActivity;
      if (nextActivity === "rest") {
        state.schedule[index].budget = 0;
      }
      render();
    });

    const [intensityInput, budgetInput] = row.querySelectorAll("input");
    intensityInput.addEventListener("input", event => {
      state.schedule[index].intensity = Number(event.target.value);
      render();
    });
    budgetInput.disabled = slot.activity === "rest";
    budgetInput.addEventListener("input", event => {
      state.schedule[index].budget = Number(event.target.value);
      render();
    });

    elements.scheduleList.appendChild(row);
  });
}

function renderHotSearches() {
  elements.hotSearchList.innerHTML = "";
  state.hotSearches.forEach((item, index) => {
    const cost = getHotSearchCost(item, index);
    const isBought = state.boughtHotSearchId === item.id;
    const canBuy = !state.boughtHotSearchId && state.money >= cost;
    const row = document.createElement("div");
    row.className = `hot-search-item${isBought ? " bought" : ""}`;
    row.innerHTML = `
      <div class="hot-rank">#${index + 1}</div>
      <div class="hot-content">
        <div class="hot-title-row">
          <p class="hot-topic">${item.title}</p>
        </div>
        <div class="hot-meta">
          <span>${item.tag}</span>
          <span>${item.trend}</span>
          <span>热度 ${item.heat}</span>
        </div>
        <p class="hot-advice">${item.advice}</p>
        <button class="hot-buy-button" type="button"${canBuy ? "" : " disabled"}>${isBought ? "已买热搜" : `买热搜 ${cost}`}</button>
      </div>
    `;
    row.querySelector("button").addEventListener("click", () => buyHotSearch(item.id));
    elements.hotSearchList.appendChild(row);
  });
}

function buyHotSearch(id) {
  if (state.boughtHotSearchId) {
    showToast("本月已经买过热搜。");
    return;
  }

  const index = state.hotSearches.findIndex(item => item.id === id);
  const item = state.hotSearches[index];
  if (!item) return;

  const cost = getHotSearchCost(item, index);
  if (state.money < cost) {
    showToast("资金不足，买不起这个热搜。");
    return;
  }

  state.money -= cost;
  state.boughtHotSearchId = item.id;
  applyEffect(item.effect);
  addLog(`第 ${state.month} 月：买下热搜“${item.title}”，花费 ${cost}。${item.buyText}`);
  render();
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

function renderAlbumStatus() {
  if (!state.album) {
    elements.albumStatus.textContent = "暂无项目";
    return;
  }

  const type = albumTypes[state.album.type].label;
  const genre = genres[state.album.genre].label;
  elements.albumStatus.textContent = `${type} · ${genre} · 进度 ${state.album.progress}/${state.album.duration}`;
}

function renderCreateAlbumButton() {
  const type = albumTypes[selectedType];
  const hasAlbum = Boolean(state.album);
  const canCreate = !hasAlbum && state.money >= type.cost;
  elements.createAlbumButton.disabled = !canCreate;
  elements.createAlbumButton.textContent = hasAlbum
    ? "已有回归项目"
    : `创建回归项目：${type.label} / ${type.cost}`;
}

function renderLogs() {
  elements.logList.innerHTML = "";
  state.logs.slice(-12).reverse().forEach(log => {
    const item = document.createElement("li");
    item.textContent = log;
    elements.logList.appendChild(item);
  });
}

function createAlbumProject() {
  const type = albumTypes[selectedType];
  if (state.album) {
    showToast("已有回归项目在制作中。");
    return;
  }
  if (state.money < type.cost) {
    showToast("资金不足，无法创建回归项目。");
    return;
  }

  state.money -= type.cost;
  state.album = {
    type: selectedType,
    genre: selectedGenre,
    price: selectedPrice,
    progress: 0,
    duration: type.duration,
    cost: type.cost
  };
  addLog(`第 ${state.month} 月：创建${type.label}回归项目，立项成本 ${type.cost}。`);
  render();
}

function openMonthlyEvent() {
  const estimate = simulateSchedule(false);
  if (estimate.cost > state.money) {
    showToast("本月行程预算超过当前资金，先降低预算或调整行程。");
    return;
  }

  pendingEvent = pickEvent();
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

function pickEvent() {
  if (state.pressure >= 70 && Math.random() < 0.45) {
    return eventPool.find(event => event.title === "训练状态预警");
  }
  return eventPool[randomInt(0, eventPool.length - 1)];
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
  const hotSearchSnapshot = state.hotSearches.map(item => ({ ...item }));
  const boughtHotSearchId = state.boughtHotSearchId;
  const monthlyNews = generateWorldNews(hotSearchSnapshot, state.month);

  report.push("本月热搜榜：");
  getHotSearchReportLines(hotSearchSnapshot, boughtHotSearchId).forEach(line => report.push(line));
  report.push("本月世界新闻：");
  monthlyNews.forEach(line => report.push(line));
  report.push(`事件处理：${eventResult}`);

  const execution = simulateSchedule(true);
  report.push("本月行程：");
  execution.lines.forEach(line => report.push(line));

  if (state.album && state.album.progress >= state.album.duration) {
    const outcome = releaseAlbum();
    report.push(outcome.summary);
    report.push(`首周销量 ${outcome.sales}，销售回款 ${outcome.revenue}。`);
    report.push(`新增粉丝 ${outcome.fansGain}，新增热度 ${outcome.popularityGain}。`);
  } else if (state.album) {
    report.push(`回归制作进度：${state.album.progress}/${state.album.duration}。`);
  } else {
    report.push("当前没有回归项目。");
  }

  const baseIncome = 500 + state.fans * 5;
  state.money += baseIncome;
  report.push(`月度基础收入 ${baseIncome}。`);

  const oldPopularity = state.popularity;
  state.popularity = Math.floor(state.popularity * 0.9);
  report.push(`热度自然衰减：${oldPopularity} -> ${state.popularity}。`);
  report.push(`压力结算后为 ${state.pressure}。`);

  state.month += 1;
  state.schedule = createDefaultSchedule();
  state.hotSearches = generateHotSearches(state.month);
  state.boughtHotSearchId = null;
  clampState();

  state.lastReport = report.join("<br>");
  addLog(`第 ${finishedMonth} 月结算完成。资金 ${state.money}，粉丝 ${state.fans}，热度 ${state.popularity}，压力 ${state.pressure}。`);
  openReport(finishedMonth, report);
}

function simulateSchedule(commit) {
  const result = {
    cost: 0,
    pressureDelta: 0,
    statGains: { vocal: 0, dance: 0, rap: 0, charm: 0 },
    fansGain: 0,
    popularityGain: 0,
    albumProgress: 0,
    lines: []
  };

  state.schedule.forEach((slot, index) => {
    const activity = activityOptions[slot.activity] ?? activityOptions.rest;
    const intensity = clamp(Number(slot.intensity) || 1, 1, 3);
    const budget = activity.type === "rest" ? 0 : clamp(Number(slot.budget) || 0, 0, 1000);
    const market = getMarketBonus(slot.activity);
    const boost = (1 + budget / 1000 * 0.5) * (1 + market.multiplier);
    const marketNote = market.text ? `（${market.text}）` : "";
    const cost = Math.round(activity.baseCost * intensity + budget);

    if (activity.requiresAlbum && !state.album) {
      result.lines.push(`第 ${index + 1} 周：回归制作无效，没有进行中的回归项目。`);
      return;
    }

    result.cost += cost;

    if (activity.type === "training") {
      const pressurePenalty = state.pressure >= 70 ? 0.75 : 1;
      const gain = Math.max(1, Math.round(activity.baseGain * intensity * boost * pressurePenalty));
      result.statGains[activity.stat] += gain;
      const heat = activity.stat === "dance" ? Math.round(1.5 * intensity * boost) : Math.round(0.8 * intensity * boost);
      result.popularityGain += heat;
      result.pressureDelta += activity.pressure * intensity;
      result.lines.push(`第 ${index + 1} 周：${activity.label} 强度 ${intensity} 预算 ${budget}${marketNote} -> ${statLabels[activity.stat]} +${gain}，热度 +${heat}，压力 +${activity.pressure * intensity}。`);
    }

    if (activity.type === "exposure") {
      const fans = Math.round((activity.fans + state.trainee.charm / 45) * intensity * boost);
      const popularity = Math.round(activity.popularity * intensity * boost);
      result.fansGain += fans;
      result.popularityGain += popularity;
      result.pressureDelta += activity.pressure * intensity;
      result.lines.push(`第 ${index + 1} 周：${activity.label} 强度 ${intensity} 预算 ${budget}${marketNote} -> 粉丝 +${fans}，热度 +${popularity}，压力 +${activity.pressure * intensity}。`);
    }

    if (activity.type === "album") {
      const progress = Math.round((activity.progress * intensity + budget / 500) * (1 + market.multiplier));
      result.albumProgress += progress;
      result.pressureDelta += activity.pressure * intensity;
      result.lines.push(`第 ${index + 1} 周：${activity.label} 强度 ${intensity} 预算 ${budget}${marketNote} -> 回归进度 +${progress}，压力 +${activity.pressure * intensity}。`);
    }

    if (activity.type === "rest") {
      const recovery = Math.round(Math.abs(activity.pressure) * intensity * (1 + market.multiplier));
      result.pressureDelta -= recovery;
      result.lines.push(`第 ${index + 1} 周：休整 强度 ${intensity}${marketNote} -> 压力 -${recovery}。`);
    }
  });

  if (commit) {
    state.money -= result.cost;
    Object.entries(result.statGains).forEach(([stat, gain]) => {
      state.trainee[stat] += gain;
    });
    state.fans += result.fansGain;
    state.popularity += result.popularityGain;
    state.pressure += result.pressureDelta;
    if (state.album) {
      state.album.progress += result.albumProgress;
    }
    clampState();
  }

  return result;
}

function releaseAlbum() {
  const album = state.album;
  const type = albumTypes[album.type];
  const genre = genres[album.genre];
  const price = priceStrategies[album.price];
  const genreCoefficient = randomFloat(genre.min, genre.max);
  const totalStat = getTotalStat();
  const salesCap = state.fans * (1 + totalStat / 200);
  const pressurePenalty = state.pressure >= 70 ? 0.85 : 1;
  const sales = Math.max(0, Math.round(
    salesCap *
    type.multiplier *
    genreCoefficient *
    price.salesMultiplier *
    (1 + state.popularity / 100) *
    pressurePenalty
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
    const isHeading = line.endsWith("：") && !line.includes("->");
    const node = document.createElement(isHeading ? "h3" : "p");
    node.innerHTML = line;
    elements.reportLines.appendChild(node);
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

function generateHotSearches(month) {
  return shuffle(hotSearchPool)
    .slice(0, 5)
    .map(item => ({
      ...item,
      heat: clamp(item.heat + randomInt(-10, 12) + (month % 3) * 2, 35, 99)
    }))
    .sort((a, b) => b.heat - a.heat);
}

function ensureHotSearchShape() {
  if (!Array.isArray(state.hotSearches) || state.hotSearches.length === 0) {
    state.hotSearches = generateHotSearches(state.month);
  }
  state.hotSearches = state.hotSearches
    .map(saved => {
      const source = hotSearchPool.find(item => item.id === saved.id);
      return source ? { ...source, heat: saved.heat ?? source.heat } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.heat - a.heat)
    .slice(0, 5);
  if (state.hotSearches.length < 5) {
    state.hotSearches = generateHotSearches(state.month);
  }
  if (!state.hotSearches.some(item => item.id === state.boughtHotSearchId)) {
    state.boughtHotSearchId = null;
  }
}

function getHotSearchCost(item, index) {
  return Math.round((360 + item.heat * 8 + (5 - index) * 90) / 10) * 10;
}

function getHotSearchReportLines(hotSearches, boughtId) {
  return hotSearches.map((item, index) => {
    const boughtMark = item.id === boughtId ? " 已买" : "";
    return `#${index + 1} ${item.title}｜${item.tag}｜${item.trend}｜热度 ${item.heat}${boughtMark}。建议：${item.advice}`;
  });
}

function generateWorldNews(hotSearches, month) {
  const hotTags = hotSearches.map(item => item.tag);
  const matched = worldNewsPool.filter(news => news.tags.some(tag => hotTags.includes(tag)));
  const general = worldNewsPool.filter(news => news.tags.includes("通用"));
  const picked = [];

  shuffle(matched).slice(0, 2).forEach(news => picked.push(news.text));
  shuffle(general).some(news => {
    if (picked.length >= 3) return true;
    picked.push(news.text);
    return false;
  });

  if (picked.length < 3) {
    picked.push(`第 ${month} 月行业观察：中小公司新人需要尽快形成可传播标签，否则容易被大公司宣发淹没。`);
  }

  return picked.slice(0, 3).map(text => `- ${text}`);
}

function getMarketBonus(activityKey) {
  const natural = state.hotSearches.find(item => item.matches.includes(activityKey));
  const bought = state.hotSearches.find(item => item.id === state.boughtHotSearchId && item.matches.includes(activityKey));

  if (bought) {
    const combo = getSynergyText(bought, activityKey);
    return {
      multiplier: 0.3,
      text: `买热搜“${bought.title}”放大：${combo}`
    };
  }
  if (natural) {
    const combo = getSynergyText(natural, activityKey);
    return {
      multiplier: 0.1,
      text: `蹭到榜单趋势“${natural.title}”：${combo}`
    };
  }
  return { multiplier: 0, text: "" };
}

function getSynergyText(hotSearch, activityKey) {
  return synergyNotes[hotSearch.id]?.[activityKey] ?? "行程结果被当前舆论环境放大";
}

function getScheduleFocus(estimate) {
  const trainingTotal = Object.values(estimate.statGains).reduce((sum, value) => sum + value, 0);
  const exposureTotal = estimate.fansGain + estimate.popularityGain;
  if (estimate.albumProgress >= 4) return "集中推进回归";
  if (trainingTotal >= exposureTotal && trainingTotal >= 12) return "集中培养能力";
  if (exposureTotal > trainingTotal && exposureTotal >= 12) return "集中拉曝光";
  if (estimate.pressureDelta < 0) return "恢复状态";
  return "均衡经营";
}

function ensureScheduleShape() {
  if (!Array.isArray(state.schedule)) {
    state.schedule = createDefaultSchedule();
  }
  while (state.schedule.length < SLOT_COUNT) {
    state.schedule.push({ activity: "rest", intensity: 1, budget: 0 });
  }
  state.schedule = state.schedule.slice(0, SLOT_COUNT);
  state.schedule.forEach(slot => {
    if (!activityOptions[slot.activity]) slot.activity = "rest";
    slot.intensity = clamp(Number(slot.intensity) || 1, 1, 3);
    slot.budget = slot.activity === "rest" ? 0 : clamp(Number(slot.budget) || 0, 0, 1000);
    if (activityOptions[slot.activity].requiresAlbum && !state.album) {
      slot.activity = "rest";
      slot.budget = 0;
    }
  });
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
    ensureScheduleShape();
    ensureHotSearchShape();
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
  state.pressure = clamp(Math.round(state.pressure ?? 20), 0, 100);
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

function formatSigned(value) {
  if (value > 0) return `+${value}`;
  return `${value}`;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

init();
