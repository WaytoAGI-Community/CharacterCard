import { Character, RuleCard, StoryNode } from './types';

// Updated with high-fidelity, reliable artistic references matching the "Tarot/Dark Fantasy" aesthetic.
export const CHARACTERS: Character[] = [
  {
    id: 'c1',
    name: '森西',
    title: '伊兹干达的',
    description: '一位矮人厨师骑士，他相信地下城的生态系统就是一个等待收获的食材库。“只有吃掉它，才能理解它。”',
    imageUrl: 'https://images.unsplash.com/photo-1560706560-59f7df8da891?q=80&w=1200&auto=format&fit=crop', // Rugged, bearded texture
    stats: { strength: 8, wits: 7, charm: 5 },
    traits: ['魔物料理', '艾德曼合金锅', '生态平衡'],
    weakness: '对禁忌食材的渴望'
  },
  {
    id: 'c2',
    name: '艾拉',
    title: '发条骑士',
    description: '一个被禁锢在腐朽机械外壳中的高贵灵魂。她寻找着“永恒齿轮”，只为给她永恒的心脏上发条。',
    imageUrl: 'https://images.unsplash.com/photo-1535581652167-3d6693c0326e?q=80&w=1200&auto=format&fit=crop', // Metallic armor abstract
    stats: { strength: 9, wits: 5, charm: 3 },
    traits: ['痛觉免疫', '蒸汽喷射', '精准打击'],
    weakness: '生锈与维护'
  },
  {
    id: 'c3',
    name: '维斯帕',
    title: '低语大盗',
    description: '一个用记忆代替金币进行交易的街头顽童。他能听到锁在古老石头里的秘密。',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200&auto=format&fit=crop', // Shadowy, hooded silhouette vibe
    stats: { strength: 3, wits: 9, charm: 8 },
    traits: ['灵物测定', '暗影步', '情报贩子'],
    weakness: '记忆过载'
  },
  {
    id: 'c4',
    name: '莫里根',
    title: '沼泽女巫',
    description: '钢铁世界中旧习俗的守护者。她在坩埚中酿造命运，与溺亡者交谈。',
    imageUrl: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=1200&auto=format&fit=crop', // Mystic forest/witchy
    stats: { strength: 4, wits: 8, charm: 6 },
    traits: ['诅咒编织', '使魔', '沼泽行者'],
    weakness: '铁过敏'
  },
  {
    id: 'c5',
    name: '凯尔',
    title: '堕落圣骑士',
    description: '曾经的光明灯塔，现在是一个只为出价最高者而战的雇佣兵。他深知“正义”只是胜利者讲述的故事。',
    imageUrl: 'https://images.unsplash.com/photo-1636217989679-2c70092c7251?q=80&w=1200&auto=format&fit=crop', // Dark Knight/Helmet
    stats: { strength: 9, wits: 4, charm: 6 },
    traits: ['背誓者', '重甲', '威慑凝视'],
    weakness: '负罪的噩梦'
  },
  {
    id: 'c6',
    name: '莱拉',
    title: '织歌者',
    description: '一位吟游诗人，她的歌声可以短暂地重塑现实。她在逃离一种威胁要吞噬世界的寂静。',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop', // Atmospheric night sky/stars
    stats: { strength: 3, wits: 7, charm: 10 },
    traits: ['共鸣', '声东击西', '博学'],
    weakness: '寂静'
  },
  {
    id: 'c7',
    name: '索恩',
    title: '兽王',
    description: '由狼群抚养长大，他信任野兽胜过人类。城市对他来说是一座需要用掠食本能来探索的石头丛林。',
    imageUrl: 'https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?q=80&w=1200&auto=format&fit=crop', // Wolf/Wild nature
    stats: { strength: 7, wits: 8, charm: 2 },
    traits: ['动物亲和', '追踪', '生存专家'],
    weakness: '社交障碍'
  },
  {
    id: 'c8',
    name: '伊索尔德',
    title: '通灵者',
    description: '她游走在生与死的边缘。亡灵聚集在她的光芒周围，寻求正义或复仇。',
    imageUrl: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=1200&auto=format&fit=crop', // Ghostly/Skull/Candle
    stats: { strength: 2, wits: 10, charm: 4 },
    traits: ['灵视', '寒冷之触', '通灵术'],
    weakness: '附身风险'
  }
];

export const INITIAL_RULES: RuleCard[] = [
  // Reality Mapping (Social/Physical Laws)
  {
    id: 'r1',
    title: '等价交换法则',
    type: 'CONSTRAINT',
    description: '魔法消耗物理资源（生命值或物品）。你不能凭空创造东西。',
    active: true
  },
  {
    id: 'r2',
    title: '社会信誉',
    type: 'REALITY',
    description: '低信誉度（<3）会使NPC产生敌意。高压力（>8）会触发“幻觉”事件。',
    active: true
  },
  {
    id: 'r3',
    title: '迷雾',
    type: 'RISK',
    description: '世界正在腐朽。休息可以恢复生命值，但会增加“腐化”计数。',
    active: true
  },
  // Gameplay/Narrative Rules
  {
    id: 'r4',
    title: '墨菲定律',
    type: 'RISK',
    description: '如果一个计划依赖于超过2个步骤，第3个步骤将会失败。',
    active: true
  },
  {
    id: 'r5',
    title: '主角光环',
    type: 'BONUS',
    description: '每局游戏一次，在受到致命一击时保留1点生命值。',
    active: true
  },
  {
    id: 'r6',
    title: '八卦网络',
    type: 'REALITY',
    description: '消息传得比你快。你的名声会先于你到达每个城镇。',
    active: false
  },
  {
    id: 'r7',
    title: '血债',
    type: 'CONSTRAINT',
    description: '你欠公会一条命。他们会在你最意想不到的时候来讨债。',
    active: false
  },
  {
    id: 'r8',
    title: '铁律物理',
    type: 'CONSTRAINT',
    description: '跌落伤害是真实的。护甲会降低敏捷度。',
    active: true
  },
  {
    id: 'r9',
    title: '奥术共鸣',
    type: 'BONUS',
    description: '在魔法异常点附近，法术威力加倍，但狂野魔法浪涌几率为50%。',
    active: false
  },
  {
    id: 'r10',
    title: '商人的贪婪',
    type: 'REALITY',
    description: '你在城市里每待一天，价格就上涨10%。',
    active: false
  },
  {
    id: 'r11',
    title: '夜惊',
    type: 'RISK',
    description: '黑暗并不是空的。在夜间行动需要进行理智检定。',
    active: true
  },
  {
    id: 'r12',
    title: '神圣干预',
    type: 'BONUS',
    description: '掷出大失败可能会召唤神灵的怜悯（或娱乐）。',
    active: false
  }
];

export const INTRO_STORY: StoryNode = {
  text: "橡树港的宏伟城门矗立在你面前，腐烂像常春藤一样爬上铁栏杆。你此行是为了寻找“余烬之心”，据说这件神器可以逆转世界的腐朽。但橡树港是一个充满规则的城市——无论是明文规定的还是潜规则。守卫怀疑地盯着你的装备，雨水中隐约散发着硫磺味。要进入城市，你必须支付过路费，但不一定是用金币。",
  choices: [
    {
      id: 'opt1',
      text: "提供一段家乡的记忆作为报酬。",
      consequence: "牺牲个人历史以换取进入。",
      cost: "记忆",
      risk: "身份丧失"
    },
    {
      id: 'opt2',
      text: "用武器恐吓守卫。",
      consequence: "确立威慑力但提高警戒等级。",
      risk: "社会敌意"
    },
    {
      id: 'opt3',
      text: "从下水道溜进去。",
      consequence: "恶心但隐蔽。",
      cost: "尊严",
      risk: "疾病"
    }
  ]
};