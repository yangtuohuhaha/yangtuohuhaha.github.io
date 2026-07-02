/* ============================================================
   THE LAST ARCHIVE — Civilization Artifact Database
   严格遵循 08_Course_Database.md 规范
   ============================================================ */

const ARTIFACTS = [
  {
    id: 'CN-MATH-001',
    artifactName: '大罗洞玄·因果律初解',
    realCourse: '高等数学（上）',
    realTeacher: '宋浩',
    dangerLevel: 5,
    dangerNote: '认知重构风险极高。观测者将永久失去对"无限"的天真理解。',
    epoch: 7,
    civilizationCode: 'Archive 001 · Epoch 7',
    category: 'mathematics',
    description: '记载了先民对连续变化与极限真理的终极理解。掌握此法则者，得以窥见宇宙运行的因果之链。',
    flavorText: '「万物皆流，因果不灭。微分以见微，积分以知著。」',
    bvid: 'BV1CAxaeHEeH',
  },
  {
    id: 'CN-MATH-002',
    artifactName: '张量空间操控教义',
    realCourse: '线性代数',
    realTeacher: '宋浩',
    dangerLevel: 4,
    dangerNote: '空间感知维度将发生不可逆扩展。',
    epoch: 5,
    civilizationCode: 'Archive 002 · Epoch 5',
    category: 'mathematics',
    description: '多维空间的操控法则。先民以此为基，构建了跨维度信息传输网络的理论根基。',
    flavorText: '「维度为牢，矩阵为钥。变换之间，万物归位。」',
    bvid: 'BV1ix411f7Yp',
  },
  {
    id: 'CN-MATH-003',
    artifactName: '概率分支收敛术',
    realCourse: '概率论与数理统计',
    realTeacher: '宋浩',
    dangerLevel: 4,
    dangerNote: '观测者将意识到所有事件都只是分支树上的一片叶子。',
    epoch: 7,
    civilizationCode: 'Archive 006 · Epoch 7',
    category: 'mathematics',
    description: '远古智者推演随机事件的神谕矩阵。在混沌中寻找秩序，在随机中看见必然。',
    flavorText: '「骰子已掷出，但概率的分布早已写定。」',
    bvid: 'BV1F64y1Z7Td',
  },
  {
    id: 'CN-MATH-004',
    artifactName: '离散逻辑矩阵法典',
    realCourse: '离散数学',
    realTeacher: '北京大学',
    dangerLevel: 3,
    dangerNote: '思维将从连续模式切换到离散模式。',
    epoch: 5,
    civilizationCode: 'Archive 008 · Epoch 5',
    category: 'mathematics',
    description: '一部记载了"非连续"真理的法典。逻辑、集合、图——这些都是宇宙的基本数据结构。此遗物的力量不在于计算，而在于教会观测者用正确的方式提出问题。',
    flavorText: '「真的对面是假，1 的对面是 0——但在这之间，藏着整个逻辑宇宙。」',
    bvid: 'BV1kTsizDE4Q',
  },
  {
    id: 'CN-CS-001',
    artifactName: '虚空计算创世协议',
    realCourse: 'Python 程序设计',
    realTeacher: '嵩天',
    dangerLevel: 3,
    dangerNote: '观测者将获得在虚空中创造逻辑实体的能力。',
    epoch: 8,
    civilizationCode: 'Archive 003 · Epoch 8',
    category: 'computation',
    description: '创世之初的语言碎片。以简洁语法调用虚无中的计算之力，从空无中生成万物。',
    flavorText: '「import universe — 一切从这一行开始。」',
    bvid: 'BV1RXqnYmEEP',
  },
  {
    id: 'CN-CS-002',
    artifactName: '数据结构天启录',
    realCourse: '数据结构',
    realTeacher: '王道论坛',
    dangerLevel: 5,
    dangerNote: '思维将被永久重组为节点与指针的形态。',
    epoch: 8,
    civilizationCode: 'Archive 007 · Epoch 8',
    category: 'computation',
    description: '信息如何在计算之海中结晶为有序形态的古老智慧。树非树，图非图，皆是思维的晶体。',
    flavorText: '「栈为记忆，队列为序，图即是世界的映射。」',
    bvid: 'BV1tNpbekEht',
  },
  {
    id: 'CN-ENG-001',
    artifactName: '电磁神圣审判系统',
    realCourse: '电路原理',
    realTeacher: '石群',
    dangerLevel: 4,
    dangerNote: '观测者将看见空气中无处不在的电磁场。',
    epoch: 6,
    civilizationCode: 'Archive 005 · Epoch 6',
    category: 'engineering',
    description: '掌控电磁之力的神圣法典。电流如神谕般在回路中流转，基尔霍夫即是这方宇宙的审判官。',
    flavorText: '「电压为势，电流为动。回路闭合，神判降临。」',
    bvid: 'BV1JJ4m1J74S',
  },
  {
    id: 'CN-LNG-001',
    artifactName: '跨文明语言学同步',
    realCourse: '大学英语',
    realTeacher: '刘晓艳',
    dangerLevel: 2,
    dangerNote: '轻微。观测者将获得第二套符号系统的访问权限。',
    epoch: 3,
    civilizationCode: 'Archive 004 · Epoch 3',
    category: 'language',
    description: '跨文明沟通的基础协议。先民发现的最古老互通法则，连接不同思维系统的桥梁。',
    flavorText: '「语言不是工具，是文明共享的思维操作系统。」',
    bvid: 'BV1GkTk6FE33',
  },
];

// Categories for filtering
const CATEGORIES = {
  all: { label: '全部档案', icon: '◆' },
  mathematics: { label: '因果律系', icon: '◈' },
  computation: { label: '创世协议', icon: '⬡' },
  engineering: { label: '物质法则', icon: '◎' },
  language: { label: '跨文明同步', icon: '◇' },
};

// Get unique categories from artifacts
function getCategories() {
  return [...new Set(ARTIFACTS.map(a => a.category))];
}

// Filter artifacts by category
function filterArtifacts(category) {
  if (category === 'all') return ARTIFACTS;
  return ARTIFACTS.filter(a => a.category === category);
}

// Get artifact by ID
function getArtifactById(id) {
  return ARTIFACTS.find(a => a.id === id);
}
