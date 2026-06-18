const app = document.querySelector("#app");
const toast = document.querySelector("#toast");
const LOCAL_PLAYER_NAMES_KEY = "aiGuessParty:localPlayerNames";

function savedLocalPlayerNames() {
  try {
    const names = JSON.parse(localStorage.getItem(LOCAL_PLAYER_NAMES_KEY) || "[]");
    return Array.isArray(names) ? names.map((name) => String(name || "").slice(0, 8)) : [];
  } catch {
    return [];
  }
}

function rememberLocalPlayerNames(names) {
  const values = names.map((name) => String(name || "").trim().slice(0, 8)).filter(Boolean).slice(0, 4);
  if (values.length) localStorage.setItem(LOCAL_PLAYER_NAMES_KEY, JSON.stringify(values));
}

const items = [
  ["大象", "🐘", ["大象", "象", "elephant"], { alive: 1, animal: 1, mammal: 1, pet: 0, wild: 1, canFly: 0, aquatic: 0, fourLegs: 1, biggerThanBread: 1, biggerThanPerson: 1, foundInChina: 1, manMade: 0, food: 0, electronic: 0, vehicle: 0, canHold: 0, gray: 1, hasTail: 1, natural: 1 }],
  ["熊猫", "🐼", ["熊猫", "大熊猫", "panda"], { alive: 1, animal: 1, mammal: 1, pet: 0, wild: 1, canFly: 0, aquatic: 0, fourLegs: 1, biggerThanBread: 1, biggerThanPerson: 0, foundInChina: 1, manMade: 0, food: 0, electronic: 0, vehicle: 0, canHold: 0, blackWhite: 1, hasTail: 1, natural: 1 }],
  ["海豚", "🐬", ["海豚", "dolphin"], { alive: 1, animal: 1, mammal: 1, pet: 0, wild: 1, canFly: 0, aquatic: 1, fourLegs: 0, biggerThanBread: 1, biggerThanPerson: 1, foundInChina: 1, manMade: 0, food: 0, electronic: 0, vehicle: 0, canHold: 0, gray: 1, hasTail: 1, natural: 1 }],
  ["企鹅", "🐧", ["企鹅", "penguin"], { alive: 1, animal: 1, mammal: 0, pet: 0, wild: 1, canFly: 0, aquatic: 1, fourLegs: 0, biggerThanBread: 1, biggerThanPerson: 0, foundInChina: 0, manMade: 0, food: 0, electronic: 0, vehicle: 0, canHold: 0, blackWhite: 1, hasTail: 1, natural: 1 }],
  ["苹果", "🍎", ["苹果", "apple"], { alive: 0, plant: 1, animal: 0, food: 1, manMade: 0, electronic: 0, vehicle: 0, foundInChina: 1, natural: 1, canFly: 0, aquatic: 0, fourLegs: 0, biggerThanBread: 0, biggerThanPerson: 0, canHold: 1, red: 1, round: 1, inKitchen: 1 }],
  ["冰箱", "🧊", ["冰箱", "电冰箱", "fridge"], { alive: 0, animal: 0, food: 0, manMade: 1, electronic: 1, vehicle: 0, foundInChina: 1, natural: 0, canFly: 0, aquatic: 0, fourLegs: 0, biggerThanBread: 1, biggerThanPerson: 1, canHold: 0, inKitchen: 1, madeOfMetal: 1, cold: 1 }],
  ["自行车", "🚲", ["自行车", "单车", "脚踏车", "bike"], { alive: 0, animal: 0, food: 0, manMade: 1, electronic: 0, vehicle: 1, foundInChina: 1, natural: 0, canFly: 0, aquatic: 0, fourLegs: 0, biggerThanBread: 1, biggerThanPerson: 0, canHold: 0, madeOfMetal: 1, hasWheels: 1 }],
  ["飞机", "✈️", ["飞机", "客机", "airplane", "plane"], { alive: 0, animal: 0, food: 0, manMade: 1, electronic: 1, vehicle: 1, foundInChina: 1, natural: 0, canFly: 1, aquatic: 0, fourLegs: 0, biggerThanBread: 1, biggerThanPerson: 1, canHold: 0, madeOfMetal: 1, hasWheels: 1 }],
  ["雨伞", "☂️", ["雨伞", "伞", "umbrella"], { alive: 0, animal: 0, food: 0, manMade: 1, electronic: 0, vehicle: 0, foundInChina: 1, natural: 0, canFly: 0, aquatic: 0, fourLegs: 0, biggerThanBread: 1, biggerThanPerson: 0, canHold: 1, madeOfMetal: 1, usefulInRain: 1 }],
  ["吉他", "🎸", ["吉他", "guitar"], { alive: 0, animal: 0, food: 0, manMade: 1, electronic: 0, vehicle: 0, foundInChina: 1, natural: 0, canFly: 0, aquatic: 0, fourLegs: 0, biggerThanBread: 1, biggerThanPerson: 0, canHold: 1, musical: 1, madeOfWood: 1 }],
  ["篮球", "🏀", ["篮球", "basketball"], { alive: 0, animal: 0, food: 0, manMade: 1, electronic: 0, vehicle: 0, foundInChina: 1, natural: 0, canFly: 0, aquatic: 0, fourLegs: 0, biggerThanBread: 1, biggerThanPerson: 0, canHold: 1, sports: 1, round: 1 }],
  ["向日葵", "🌻", ["向日葵", "sunflower"], { alive: 1, plant: 1, animal: 0, food: 0, manMade: 0, electronic: 0, vehicle: 0, foundInChina: 1, natural: 1, canFly: 0, aquatic: 0, fourLegs: 0, biggerThanBread: 1, biggerThanPerson: 0, canHold: 0, yellow: 1 }]
].map(([name, emoji, aliases, attrs], index) => ({ id: `item_${index}`, name, emoji, aliases, attrs }));

const extraItems = [
  ["猫", "🐱", ["猫", "猫咪", "小猫", "cat"], { alive: 1, animal: 1, mammal: 1, pet: 1, wild: 0, canFly: 0, aquatic: 0, fourLegs: 1, biggerThanBread: 1, biggerThanPerson: 0, foundInChina: 1, manMade: 0, food: 0, electronic: 0, vehicle: 0, canHold: 1, hasTail: 1, natural: 1 }],
  ["狗", "🐶", ["狗", "小狗", "狗狗", "dog"], { alive: 1, animal: 1, mammal: 1, pet: 1, wild: 0, canFly: 0, aquatic: 0, fourLegs: 1, biggerThanBread: 1, biggerThanPerson: 0, foundInChina: 1, manMade: 0, food: 0, electronic: 0, vehicle: 0, canHold: 1, hasTail: 1, natural: 1 }],
  ["老虎", "🐯", ["老虎", "虎", "tiger"], { alive: 1, animal: 1, mammal: 1, pet: 0, wild: 1, canFly: 0, aquatic: 0, fourLegs: 1, biggerThanBread: 1, biggerThanPerson: 0, foundInChina: 1, manMade: 0, food: 0, electronic: 0, vehicle: 0, canHold: 0, yellow: 1, hasTail: 1, natural: 1 }],
  ["兔子", "🐰", ["兔子", "兔", "小兔", "rabbit"], { alive: 1, animal: 1, mammal: 1, pet: 1, wild: 1, canFly: 0, aquatic: 0, fourLegs: 1, biggerThanBread: 1, biggerThanPerson: 0, foundInChina: 1, manMade: 0, food: 0, electronic: 0, vehicle: 0, canHold: 1, natural: 1 }],
  ["乌龟", "🐢", ["乌龟", "龟", "turtle"], { alive: 1, animal: 1, mammal: 0, pet: 1, wild: 1, canFly: 0, aquatic: 1, fourLegs: 1, biggerThanBread: 0, biggerThanPerson: 0, foundInChina: 1, manMade: 0, food: 0, electronic: 0, vehicle: 0, canHold: 1, natural: 1 }],
  ["鲨鱼", "🦈", ["鲨鱼", "鲨", "shark"], { alive: 1, animal: 1, mammal: 0, pet: 0, wild: 1, canFly: 0, aquatic: 1, fourLegs: 0, biggerThanBread: 1, biggerThanPerson: 1, foundInChina: 1, manMade: 0, food: 0, electronic: 0, vehicle: 0, canHold: 0, gray: 1, hasTail: 1, natural: 1 }],
  ["香蕉", "🍌", ["香蕉", "banana"], { alive: 0, plant: 1, animal: 0, food: 1, manMade: 0, electronic: 0, vehicle: 0, foundInChina: 1, natural: 1, canFly: 0, aquatic: 0, fourLegs: 0, biggerThanBread: 0, biggerThanPerson: 0, canHold: 1, yellow: 1, inKitchen: 1 }],
  ["西瓜", "🍉", ["西瓜", "watermelon"], { alive: 0, plant: 1, animal: 0, food: 1, manMade: 0, electronic: 0, vehicle: 0, foundInChina: 1, natural: 1, canFly: 0, aquatic: 0, fourLegs: 0, biggerThanBread: 1, biggerThanPerson: 0, canHold: 1, round: 1, inKitchen: 1 }],
  ["面包", "🍞", ["面包", "bread"], { alive: 0, animal: 0, food: 1, manMade: 1, electronic: 0, vehicle: 0, foundInChina: 1, natural: 0, canFly: 0, aquatic: 0, fourLegs: 0, biggerThanBread: 0, biggerThanPerson: 0, canHold: 1, inKitchen: 1 }],
  ["牛奶", "🥛", ["牛奶", "奶", "milk"], { alive: 0, animal: 0, food: 1, manMade: 1, electronic: 0, vehicle: 0, foundInChina: 1, natural: 0, canFly: 0, aquatic: 0, fourLegs: 0, biggerThanBread: 0, biggerThanPerson: 0, canHold: 1, inKitchen: 1 }],
  ["手机", "📱", ["手机", "智能手机", "电话", "phone"], { alive: 0, animal: 0, food: 0, manMade: 1, electronic: 1, vehicle: 0, foundInChina: 1, natural: 0, canFly: 0, aquatic: 0, fourLegs: 0, biggerThanBread: 0, biggerThanPerson: 0, canHold: 1, madeOfMetal: 1 }],
  ["电脑", "💻", ["电脑", "笔记本电脑", "计算机", "computer", "laptop"], { alive: 0, animal: 0, food: 0, manMade: 1, electronic: 1, vehicle: 0, foundInChina: 1, natural: 0, canFly: 0, aquatic: 0, fourLegs: 0, biggerThanBread: 1, biggerThanPerson: 0, canHold: 1, madeOfMetal: 1 }],
  ["书", "📖", ["书", "书本", "图书", "book"], { alive: 0, animal: 0, food: 0, manMade: 1, electronic: 0, vehicle: 0, foundInChina: 1, natural: 0, canFly: 0, aquatic: 0, fourLegs: 0, biggerThanBread: 1, biggerThanPerson: 0, canHold: 1 }],
  ["椅子", "🪑", ["椅子", "座椅", "chair"], { alive: 0, animal: 0, food: 0, manMade: 1, electronic: 0, vehicle: 0, foundInChina: 1, natural: 0, canFly: 0, aquatic: 0, fourLegs: 1, biggerThanBread: 1, biggerThanPerson: 0, canHold: 0, madeOfWood: 1 }],
  ["汽车", "🚗", ["汽车", "轿车", "车", "car"], { alive: 0, animal: 0, food: 0, manMade: 1, electronic: 1, vehicle: 1, foundInChina: 1, natural: 0, canFly: 0, aquatic: 0, fourLegs: 0, biggerThanBread: 1, biggerThanPerson: 1, canHold: 0, madeOfMetal: 1, hasWheels: 1 }],
  ["火车", "🚆", ["火车", "列车", "train"], { alive: 0, animal: 0, food: 0, manMade: 1, electronic: 1, vehicle: 1, foundInChina: 1, natural: 0, canFly: 0, aquatic: 0, fourLegs: 0, biggerThanBread: 1, biggerThanPerson: 1, canHold: 0, madeOfMetal: 1, hasWheels: 1 }],
  ["杯子", "🥤", ["杯子", "水杯", "杯", "cup"], { alive: 0, animal: 0, food: 0, manMade: 1, electronic: 0, vehicle: 0, foundInChina: 1, natural: 0, canFly: 0, aquatic: 0, fourLegs: 0, biggerThanBread: 0, biggerThanPerson: 0, canHold: 1, round: 1, inKitchen: 1 }],
  ["牙刷", "🪥", ["牙刷", "toothbrush"], { alive: 0, animal: 0, food: 0, manMade: 1, electronic: 0, vehicle: 0, foundInChina: 1, natural: 0, canFly: 0, aquatic: 0, fourLegs: 0, biggerThanBread: 0, biggerThanPerson: 0, canHold: 1 }],
  ["剪刀", "✂️", ["剪刀", "scissors"], { alive: 0, animal: 0, food: 0, manMade: 1, electronic: 0, vehicle: 0, foundInChina: 1, natural: 0, canFly: 0, aquatic: 0, fourLegs: 0, biggerThanBread: 0, biggerThanPerson: 0, canHold: 1, madeOfMetal: 1 }],
  ["蜡烛", "🕯️", ["蜡烛", "candle"], { alive: 0, animal: 0, food: 0, manMade: 1, electronic: 0, vehicle: 0, foundInChina: 1, natural: 0, canFly: 0, aquatic: 0, fourLegs: 0, biggerThanBread: 0, biggerThanPerson: 0, canHold: 1, yellow: 1 }]
];

extraItems.forEach(([name, emoji, aliases, attrs], index) => {
  items.push({ id: `extra_${index}`, name, emoji, aliases, attrs });
});

if (window.AnswerBank) {
  items.splice(0, items.length, ...window.AnswerBank.buildAnswerBank(1000));
}

const questionBank = [
  ["manMade", "它是人造的吗？", "early", 9], ["natural", "它天然存在吗？", "early", 9],
  ["animal", "它是动物吗？", "early", 9], ["plant", "它和植物有关吗？", "early", 8],
  ["food", "它能被当作食物吗？", "early", 8], ["vehicle", "它是交通工具吗？", "early", 8],
  ["electronic", "它需要用电吗？", "early", 7], ["countryRelated", "它和某个国家有关吗？", "early", 10],
  ["documentRelated", "它像证件、地图、卡片或票据这类东西吗？", "early", 9], ["cityRelated", "它和某个城市有关吗？", "early", 9],
  ["chemicalElement", "它是化学元素吗？", "early", 10], ["cardGameRelated", "它和扑克牌或纸牌游戏有关吗？", "early", 10],
  ["planetRelated", "它和行星有关吗？", "early", 9], ["sports", "它和运动有关吗？", "early", 7],
  ["musical", "它和音乐有关吗？", "early", 7], ["mammal", "它是哺乳动物吗？", "middle", 7],
  ["pet", "它通常会被当作宠物吗？", "middle", 6], ["wild", "它主要生活在野外吗？", "middle", 6],
  ["canFly", "它能飞吗？", "middle", 6], ["aquatic", "它能在水里生活吗？", "middle", 7],
  ["freshwaterRelated", "它主要生活在淡水里吗？", "late", 10], ["saltwaterRelated", "它主要生活在海水里吗？", "late", 10],
  ["fishRelated", "它属于鱼类吗？", "late", 9], ["crustaceanRelated", "它属于螃蟹、虾、龙虾这类甲壳动物吗？", "late", 9],
  ["shellfishRelated", "它是贝类动物吗？", "late", 9], ["molluskRelated", "它是章鱼、鱿鱼、墨鱼这类软体动物吗？", "late", 9],
  ["amphibianRelated", "它属于青蛙这类两栖动物吗？", "late", 9], ["reptileRelated", "它属于龟或鳄鱼这类爬行动物吗？", "late", 9],
  ["marineMammalRelated", "它是海豚、鲸鱼、海豹这类海洋哺乳动物吗？", "late", 9],
  ["hasLegs", "它有腿吗？", "late", 7], ["hasTail", "它有明显的尾巴吗？", "late", 7],
  ["fourLegs", "它有四条腿吗？", "middle", 6], ["biggerThanBread", "它比一块面包大吗？", "middle", 5],
  ["biggerThanPerson", "它比成年人还大吗？", "middle", 6], ["canHold", "一个人能把它拿起来吗？", "middle", 5],
  ["usedDaily", "它常出现在日常生活里吗？", "middle", 5], ["inKitchen", "它常出现在厨房里吗？", "middle", 5],
  ["madeOfMetal", "它通常含有金属吗？", "middle", 5], ["hasWheels", "它有轮子吗？", "middle", 6],
  ["round", "它通常是圆形的吗？", "middle", 4], ["flagRelated", "它是旗帜类物品吗？", "middle", 10],
  ["mapRelated", "它和地图有关吗？", "middle", 10], ["passportRelated", "它是护照类物品吗？", "middle", 10],
  ["nationalSymbol", "它有国家象征意义吗？", "middle", 9], ["provinceRelated", "它和省级行政区有关吗？", "middle", 8],
  ["licensePlateRelated", "它和车牌有关吗？", "middle", 9], ["transitLine", "它是一条交通线路吗？", "middle", 10],
  ["stationRelated", "它是车站或站点类地点吗？", "middle", 9], ["transportCard", "它是交通卡类物品吗？", "middle", 10],
  ["playingCard", "它是一张具体的扑克牌吗？", "middle", 10], ["zodiacRelated", "它和生肖有关吗？", "middle", 8],
  ["constellationRelated", "它和星座有关吗？", "middle", 8], ["modelRelated", "它是模型类物品吗？", "middle", 7],
  ["publicPlace", "它是公共场所吗？", "middle", 7], ["asiaRelated", "它和亚洲有关吗？", "late", 8],
  ["europeRelated", "它和欧洲有关吗？", "late", 8], ["africaRelated", "它和非洲有关吗？", "late", 8],
  ["northAmericaRelated", "它和北美洲有关吗？", "late", 8], ["southAmericaRelated", "它和南美洲有关吗？", "late", 8],
  ["oceaniaRelated", "它和大洋洲有关吗？", "late", 8], ["blackSuit", "它是黑色花色的扑克牌吗？", "late", 9],
  ["redSuit", "它是红色花色的扑克牌吗？", "late", 9], ["faceCard", "它是J、Q、K这类人头像牌吗？", "late", 9],
  ["aceCard", "它是A牌吗？", "late", 8], ["numberCard", "它是数字牌吗？", "late", 8],
  ["gray", "它通常是灰色的吗？", "late", 4], ["blackWhite", "它有明显的黑白配色吗？", "late", 4],
  ["red", "它常见颜色是红色吗？", "late", 3], ["yellow", "它常见颜色是黄色吗？", "late", 3],
  ["cold", "它和低温有关吗？", "late", 3], ["usefulInRain", "下雨时经常会用到它吗？", "late", 3],
  ["madeOfWood", "它通常含有木头吗？", "late", 3]
].map(([attr, text, stage, weight]) => ({ attr, text, stage, weight }));

const questionTree = {
  manMade: { layer: 1 },
  natural: { layer: 1 },
  animal: { layer: 1 },
  plant: { layer: 1 },
  food: { layer: 1 },
  vehicle: { layer: 1 },
  electronic: { layer: 1, parents: ["manMade"] },
  countryRelated: { layer: 1 },
  documentRelated: { layer: 1, parents: ["manMade"] },
  cityRelated: { layer: 1 },
  chemicalElement: { layer: 1 },
  cardGameRelated: { layer: 1 },
  planetRelated: { layer: 1 },
  sports: { layer: 1 },
  musical: { layer: 1 },
  mammal: { layer: 2, parents: ["animal"] },
  pet: { layer: 2, parents: ["animal"] },
  wild: { layer: 2, parents: ["animal"] },
  canFly: { layer: 2, parents: ["animal", "vehicle"] },
  aquatic: { layer: 2, parents: ["animal"] },
  freshwaterRelated: { layer: 3, parents: ["aquatic"] },
  saltwaterRelated: { layer: 3, parents: ["aquatic"] },
  fishRelated: { layer: 3, parents: ["aquatic"] },
  crustaceanRelated: { layer: 3, parents: ["aquatic"] },
  shellfishRelated: { layer: 3, parents: ["aquatic"] },
  molluskRelated: { layer: 3, parents: ["aquatic"] },
  amphibianRelated: { layer: 3, parents: ["aquatic"] },
  reptileRelated: { layer: 3, parents: ["aquatic"] },
  marineMammalRelated: { layer: 3, parents: ["aquatic", "mammal"] },
  hasLegs: { layer: 3, parents: ["animal", "aquatic"] },
  hasTail: { layer: 3, parents: ["animal", "aquatic"] },
  fourLegs: { layer: 2, parents: ["animal"] },
  biggerThanBread: { layer: 2 },
  biggerThanPerson: { layer: 2 },
  canHold: { layer: 2 },
  usedDaily: { layer: 2, parents: ["manMade", "food"] },
  inKitchen: { layer: 2, parents: ["food", "usedDaily"] },
  madeOfMetal: { layer: 2, parents: ["manMade", "vehicle"] },
  hasWheels: { layer: 2, parents: ["vehicle"] },
  round: { layer: 2 },
  flagRelated: { layer: 2, parents: ["countryRelated"] },
  mapRelated: { layer: 2, parents: ["countryRelated", "documentRelated", "provinceRelated", "constellationRelated"] },
  passportRelated: { layer: 2, parents: ["countryRelated", "documentRelated"] },
  nationalSymbol: { layer: 3, parents: ["countryRelated", "flagRelated"] },
  provinceRelated: { layer: 2, parents: ["documentRelated"] },
  licensePlateRelated: { layer: 3, parents: ["provinceRelated", "vehicle"] },
  transitLine: { layer: 2, parents: ["cityRelated", "vehicle"] },
  stationRelated: { layer: 2, parents: ["cityRelated"] },
  transportCard: { layer: 2, parents: ["cityRelated", "documentRelated"] },
  playingCard: { layer: 2, parents: ["cardGameRelated"] },
  zodiacRelated: { layer: 2, parents: ["documentRelated"] },
  constellationRelated: { layer: 2, parents: ["documentRelated", "planetRelated"] },
  modelRelated: { layer: 2, parents: ["planetRelated", "manMade"] },
  publicPlace: { layer: 2, parents: ["cityRelated"] },
  asiaRelated: { layer: 3, parents: ["countryRelated"] },
  europeRelated: { layer: 3, parents: ["countryRelated"] },
  africaRelated: { layer: 3, parents: ["countryRelated"] },
  northAmericaRelated: { layer: 3, parents: ["countryRelated"] },
  southAmericaRelated: { layer: 3, parents: ["countryRelated"] },
  oceaniaRelated: { layer: 3, parents: ["countryRelated"] },
  blackSuit: { layer: 3, parents: ["playingCard"] },
  redSuit: { layer: 3, parents: ["playingCard"] },
  faceCard: { layer: 3, parents: ["playingCard"] },
  aceCard: { layer: 3, parents: ["playingCard"] },
  numberCard: { layer: 3, parents: ["playingCard"] },
  gray: { layer: 3, parents: ["animal", "madeOfMetal"] },
  blackWhite: { layer: 3, parents: ["animal"] },
  red: { layer: 3 },
  yellow: { layer: 3 },
  cold: { layer: 3, parents: ["food", "electronic"] },
  usefulInRain: { layer: 3, parents: ["usedDaily"] },
  madeOfWood: { layer: 3, parents: ["manMade", "musical"] }
};

for (const question of questionBank) {
  const meta = questionTree[question.attr] || {};
  question.layer = meta.layer || 1;
  question.parents = meta.parents || [];
}

let game = null;

function html(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

function createGame(names) {
  const players = names.filter(Boolean).map((name, index) => ({ id: `p_${index}`, name, cards: [], seenCardAttrs: [], selected: null, guess: "", skipped: false, score: 0 }));
  game = {
    players,
    item: pick(items),
    round: 1,
    maxRounds: 10,
    phase: "select",
    clues: [],
    reveal: [],
    results: [],
    usedCardAttrs: [],
    winnerIds: []
  };
  dealCards();
  render();
}

function stageForRound(round) {
  if (round <= 2) return ["early"];
  if (round <= 5) return ["middle", "early"];
  if (round <= 7) return ["middle", "late"];
  return ["late", "middle"];
}

function targetLayer(round) {
  if (round <= 2) return 1;
  if (round <= 5) return 2;
  return 3;
}

function positiveAttrs() {
  return new Set(game.clues.filter((clue) => clue.answer).map((clue) => clue.attr));
}

function parentsAreOpen(question, confirmed) {
  if (!question.parents.length) return true;
  return question.parents.some((parent) => confirmed.has(parent));
}

const branchRootAttrs = new Set([
  "animal", "plant", "food", "vehicle", "countryRelated", "documentRelated", "cityRelated",
  "chemicalElement", "cardGameRelated", "planetRelated", "sports", "musical", "manMade", "natural"
]);

const genericQuestionAttrs = new Set([
  "biggerThanBread", "biggerThanPerson", "canHold", "round"
]);

function hasConfirmedBranch(confirmed) {
  return Array.from(branchRootAttrs).some((attr) => confirmed.has(attr));
}

function questionIsContextual(item, question, confirmed, round) {
  if (!parentsAreOpen(question, confirmed)) return false;
  const answerIsYes = questionAnswer(item, question);
  if (answerIsYes) return true;
  if (question.parents.some((parent) => confirmed.has(parent))) return true;
  if (genericQuestionAttrs.has(question.attr) && round >= 3) return true;
  if (!hasConfirmedBranch(confirmed)) return question.layer === 1 || round <= 2;
  return false;
}

function questionAnswer(item, question) {
  return typeof question.test === "function" ? Boolean(question.test(item)) : Boolean(item.attrs[question.attr]);
}

function answerAttr(item, attr) {
  const [kind, value] = String(attr).split(":");
  if (!value) return Boolean(item.attrs[attr]);
  if (kind === "countryValue" || kind === "cityValue" || kind === "provinceValue") return item.name.includes(value);
  if (kind === "elementValue") return item.name === `${value}元素`;
  if (kind === "suitValue") return item.name.startsWith(value);
  if (kind === "rankValue") return item.name.endsWith(value);
  if (kind === "itemValue") return item.name === value;
  return Boolean(item.attrs[attr]);
}

function remainingCandidates() {
  return items.filter((item) => game.clues.every((clue) => answerAttr(item, clue.attr) === Boolean(clue.answer)));
}

function usefulness(question) {
  const remaining = remainingCandidates();
  if (remaining.length <= 1) return questionAnswer(game.item, question) ? 1 : 0;
  let yes = 0;
  for (const item of remaining) {
    if (questionAnswer(item, question)) yes += 1;
  }
  const no = remaining.length - yes;
  if (!yes || !no) return 0;
  return Math.min(yes, no) / remaining.length;
}

function progressiveRank(question, confirmed) {
  if (!question.parents.length) return 0;
  return Math.max(0, ...question.parents.map((parent) => confirmed.has(parent) ? (questionTree[parent]?.layer || 1) : 0));
}

function dynamicPrecisionQuestions() {
  if (game.round < 6) return [];
  const confirmed = positiveAttrs();
  const allNames = items.map((item) => item.name);
  const dynamic = [];
  const addValueQuestions = (kind, parent, pattern) => {
    if (!confirmed.has(parent)) return;
    const values = Array.from(new Set(allNames.map((name) => {
      const match = name.match(pattern);
      return match ? match[1] : "";
    }).filter(Boolean)));
    for (const value of values) {
      dynamic.push({
        attr: `${kind}:${value}`,
        text: `它和${value}有关吗？`,
        stage: "late",
        layer: 3,
        parents: [parent],
        weight: 16,
        yesText: `和${value}有关`,
        noText: `和${value}无关`,
        test: (item) => item.name.includes(value)
      });
    }
  };

  addValueQuestions("countryValue", "countryRelated", /^(.+?)(国旗|地图|护照)$/);
  addValueQuestions("cityValue", "cityRelated", /^(.+?)(地铁1号线|火车站|公交卡)$/);
  addValueQuestions("provinceValue", "provinceRelated", /^(.+?(?:省|市|自治区|特别行政区))(地图|车牌)$/);

  if (confirmed.has("chemicalElement")) {
    const elements = Array.from(new Set(allNames.map((name) => name.match(/^(.+?)元素$/)?.[1]).filter(Boolean)));
    for (const element of elements) {
      dynamic.push({
        attr: `elementValue:${element}`,
        text: `它是${element}元素吗？`,
        stage: "late",
        layer: 3,
        parents: ["chemicalElement"],
        weight: 18,
        yesText: `是${element}元素`,
        noText: `不是${element}元素`,
        test: (item) => item.name === `${element}元素`
      });
    }
  }

  if (confirmed.has("playingCard")) {
    for (const suit of ["黑桃", "红桃", "梅花", "方块"]) {
      dynamic.push({
        attr: `suitValue:${suit}`,
        text: `它是${suit}花色吗？`,
        stage: "late",
        layer: 3,
        parents: ["playingCard"],
        weight: 18,
        yesText: `是${suit}花色`,
        noText: `不是${suit}花色`,
        test: (item) => item.name.startsWith(suit)
      });
    }
    for (const rank of ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]) {
      dynamic.push({
        attr: `rankValue:${rank}`,
        text: `它的牌面是${rank}吗？`,
        stage: "late",
        layer: 3,
        parents: ["playingCard"],
        weight: 18,
        yesText: `牌面是${rank}`,
        noText: `牌面不是${rank}`,
        test: (item) => item.name.endsWith(rank)
      });
    }
  }

  return dynamic;
}

function candidateQuestions(used) {
  const asked = new Set(game.clues.map((clue) => clue.attr));
  const askedTopics = window.QuestionProfile.expandedBlockedTopics(game.clues.map((clue) => clue.topic || window.QuestionProfile.topicForQuestionAttr(clue.attr)).filter(Boolean));
  const minSize = Math.max(14, game.players.length * 2 + 2);
  const pools = [
    window.QuestionProfile.buildRoundQuestionPool(game.item, game.round, { minSize }),
    window.QuestionProfile.buildRoundQuestionPool(game.item, Math.max(1, game.round - 1), { minSize }),
    window.QuestionProfile.buildRoundQuestionPool(game.item, Math.min(game.maxRounds, game.round + 1), { minSize })
  ];
  const availableQuestion = (q) => !asked.has(q.attr) && !used.has(q.attr) && !askedTopics.has(q.topic || window.QuestionProfile.topicForQuestionAttr(q.attr));
  for (const pool of pools) {
    const available = pool.filter(availableQuestion);
    if (available.some((q) => q.answer !== false) && available.some((q) => q.answer === false)) return available;
    if (available.length >= 2) return available;
  }
  return pools.flat().filter(availableQuestion);
}

function candidateQuestionsForPlayer(player, used) {
  const seen = new Set(player.seenCardAttrs || []);
  const candidates = candidateQuestions(used);
  const fresh = candidates.filter((q) => !seen.has(q.attr));
  if (fresh.length >= 2) return fresh;
  if (candidates.length) return candidates;
  const asked = new Set(game.clues.map((clue) => clue.attr));
  const askedTopics = window.QuestionProfile.expandedBlockedTopics(game.clues.map((clue) => clue.topic || window.QuestionProfile.topicForQuestionAttr(clue.attr)).filter(Boolean));
  return window.QuestionProfile.buildRoundQuestionPool(game.item, game.round, { minSize: 14 })
    .filter((q) => !asked.has(q.attr) && !used.has(q.attr) && !askedTopics.has(q.topic || window.QuestionProfile.topicForQuestionAttr(q.attr)));
}

function questionScore(question, used) {
  let score = question.weight || 1;
  if (question.layer === game.round) score += 50;
  if (used.has(question.attr)) score -= 20;
  return score;
}

function dealCards() {
  const used = new Set();
  for (const player of game.players) {
    const candidates = shuffle(candidateQuestionsForPlayer(player, used))
      .sort((a, b) => questionScore(b, used) - questionScore(a, used));
    const chosen = [];
    const pickOne = (answerValue) => {
      for (const q of candidates) {
        if ((q.answer === false) !== (answerValue === false)) continue;
        if (!chosen.some((x) => x.attr === q.attr)) {
          chosen.push(q);
          used.add(q.attr);
          return true;
        }
      }
      return false;
    };
    pickOne(true);
    pickOne(false);
    for (const q of candidates) {
      if (chosen.length >= 2) break;
      if (!chosen.some((x) => x.attr === q.attr)) chosen.push(q);
    }
    player.cards = chosen.map((q, index) => {
      used.add(q.attr);
      if (!player.seenCardAttrs) player.seenCardAttrs = [];
      if (!player.seenCardAttrs.includes(q.attr)) player.seenCardAttrs.push(q.attr);
      return { id: `${player.id}_c_${game.round}_${index}`, attr: q.attr, topic: q.topic || window.QuestionProfile.topicForQuestionAttr(q.attr), question: q.text, answer: q.answer !== false, resultText: q.answer === false ? q.noText : q.yesText };
    });
    player.selected = null;
    player.guess = "";
    player.skipped = false;
  }
}

function selectCard(playerId, cardId) {
  const player = game.players.find((p) => p.id === playerId);
  player.selected = player.cards.find((card) => card.id === cardId);
  render();
}

function revealAnswers() {
  for (const player of game.players) {
    if (!player.selected) player.selected = pick(player.cards);
  }
  game.reveal = game.players.map((player) => ({
    round: game.round,
    playerName: player.name,
    question: player.selected.question,
    answer: player.selected.answer,
    attr: player.selected.attr,
    topic: player.selected.topic,
    resultText: player.selected.resultText
  }));
  game.clues.push(...game.reveal);
  game.phase = "reveal";
  render();
}

function startGuess() {
  game.phase = "guess";
  render();
}

function normalize(value) {
  return String(value || "").trim().toLowerCase().replace(/[，。！？!?、,.~`'"“”‘’\s-]/g, "");
}

function isCorrect(guess) {
  const value = normalize(guess);
  return game.item.aliases.map(normalize).includes(value);
}

function submitGuesses(form) {
  const data = new FormData(form);
  game.results = game.players.map((player) => {
    const guess = String(data.get(player.id) || "").trim();
    const skipped = !guess;
    const correct = !skipped && isCorrect(guess);
    if (correct) game.winnerIds.push(player.id);
    return { playerId: player.id, playerName: player.name, guess, skipped, correct };
  });
  if (game.winnerIds.length || game.round >= game.maxRounds) {
    for (const player of game.players) {
      player.score = game.winnerIds.includes(player.id) ? 100 : 10;
    }
    game.phase = "gameOver";
  } else {
    game.phase = "roundResult";
  }
  render();
}

function nextRound() {
  game.round += 1;
  game.phase = "select";
  game.reveal = [];
  game.results = [];
  dealCards();
  render();
}

function restartWithSamePlayers() {
  const names = game.players.map((player) => player.name);
  createGame(names);
  showToast("新一局已开始");
}

function renderHome() {
  const defaults = ["小明", "大壮", "小红", ""];
  const names = defaults.map((name, index) => savedLocalPlayerNames()[index] || name);
  app.innerHTML = `
    <section class="home">
      <div class="hero">
        <h1>AI猜物派对</h1>
        <p>本地试玩版：多人共用一台设备完成选卡、公开线索、提交猜测和结算。</p>
        <div class="object-cloud" aria-hidden="true">
          <span>?</span><span>AI</span><span>是</span><span>否</span><span>Q</span>
          <span>?</span><span>10</span><span>A</span><span>!</span><span>?</span>
        </div>
      </div>
      <div class="panel entry-panel">
        <form class="form" id="startForm">
          <label class="field"><span>玩家 1</span><input class="input" name="name" value="${html(names[0])}" maxlength="8" required></label>
          <label class="field"><span>玩家 2</span><input class="input" name="name" value="${html(names[1])}" maxlength="8" required></label>
          <label class="field"><span>玩家 3</span><input class="input" name="name" value="${html(names[2])}" maxlength="8"></label>
          <label class="field"><span>玩家 4</span><input class="input" name="name" value="${html(names[3])}" maxlength="8" placeholder="可选"></label>
          <button class="primary" type="submit">🎮 开始试玩</button>
        </form>
      </div>
    </section>
  `;
  app.querySelector("#startForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const names = [...new FormData(event.currentTarget).getAll("name")].map((name) => name.trim()).slice(0, 4);
    rememberLocalPlayerNames(names);
    createGame(names);
  });
}

function renderGame() {
  app.innerHTML = `
    <section class="layout">
      <aside class="panel side">
        <h2 class="section-title">已知线索</h2>
        <div class="clues">
          ${game.clues.length ? game.clues.slice().reverse().map(renderClue).join("") : `<div class="small">暂无线索</div>`}
        </div>
      </aside>
      <section class="panel main-panel">
        <div class="game-head">
          <div>
            <h2 class="phase-title">第 ${game.round}/${game.maxRounds} 轮 · ${phaseText(game.phase)}</h2>
            <div class="small">答案由系统保密，直到有人猜中或 10 轮结束</div>
          </div>
          <button class="ghost" id="restart">重新开始</button>
        </div>
        ${renderPhase()}
      </section>
    </section>
  `;
  app.querySelector("#restart").addEventListener("click", () => { game = null; render(); });
  bindEvents();
}

function phaseText(phase) {
  return { select: "选卡", reveal: "公开线索", guess: "猜测", roundResult: "结果", gameOver: "结算" }[phase];
}

function clueResultText(clue) {
  if (clue.resultText) return clue.resultText;
  const textByAttr = {
    alive: ["是活物", "不是活物"],
    animal: ["是动物", "不是动物"],
    plant: ["和植物有关", "和植物无关"],
    food: ["能当食物", "不能当食物"],
    manMade: ["是人造物", "不是人造物"],
    electronic: ["需要用电", "不需要用电"],
    vehicle: ["是交通工具", "不是交通工具"],
    foundInChina: ["中国能见到", "中国不常见"],
    natural: ["天然存在", "不是天然存在"],
    mammal: ["是哺乳动物", "不是哺乳动物"],
    pet: ["通常是宠物", "通常不是宠物"],
    wild: ["主要生活在野外", "不主要生活在野外"],
      canFly: ["能飞", "不能飞"],
      aquatic: ["能在水里生活", "不能在水里生活"],
      freshwaterRelated: ["主要生活在淡水里", "不主要生活在淡水里"],
      saltwaterRelated: ["主要生活在海水里", "不主要生活在海水里"],
      fishRelated: ["属于鱼类", "不属于鱼类"],
      crustaceanRelated: ["属于甲壳动物", "不属于甲壳动物"],
      shellfishRelated: ["是贝类动物", "不是贝类动物"],
      molluskRelated: ["是软体动物", "不是软体动物"],
      amphibianRelated: ["属于两栖动物", "不属于两栖动物"],
      reptileRelated: ["属于爬行动物", "不属于爬行动物"],
      marineMammalRelated: ["是海洋哺乳动物", "不是海洋哺乳动物"],
      hasLegs: ["有腿", "没有腿"],
      hasTail: ["有明显尾巴", "没有明显尾巴"],
      fourLegs: ["有4条腿", "不是4条腿"],
    biggerThanBread: ["比面包大", "不比面包大"],
    biggerThanPerson: ["比成年人还大", "不比成年人大"],
    canHold: ["一个人能拿起来", "一个人拿不起来"],
    usedDaily: ["日常生活常见", "日常生活不常见"],
    inKitchen: ["常出现在厨房", "不常出现在厨房"],
    madeOfMetal: ["通常含金属", "通常不含金属"],
    hasWheels: ["有轮子", "没有轮子"],
    round: ["通常是圆形", "通常不是圆形"],
    makesSound: ["会发出声音", "不会发出声音"],
    gray: ["通常是灰色", "通常不是灰色"],
    blackWhite: ["有明显黑白配色", "没有明显黑白配色"],
    red: ["常见颜色是红色", "常见颜色不是红色"],
    yellow: ["常见颜色是黄色", "常见颜色不是黄色"],
    cold: ["和低温有关", "和低温无关"],
    usefulInRain: ["下雨时常用", "下雨时不常用"],
    musical: ["和音乐有关", "和音乐无关"],
    sports: ["和运动有关", "和运动无关"],
    madeOfWood: ["通常含木头", "通常不含木头"],
    countryRelated: ["和某个国家有关", "和国家无关"],
    nationalSymbol: ["有国家象征意义", "没有国家象征意义"],
      flagRelated: ["是旗帜类物品", "不是旗帜类物品"],
      mapRelated: ["和地图有关", "和地图无关"],
      passportRelated: ["是护照类物品", "不是护照类物品"],
      currencyRelated: ["是货币或钱币类物品", "不是货币或钱币类物品"],
      callingCodeRelated: ["和国际电话区号有关", "和国际电话区号无关"],
      domainRelated: ["和互联网顶级域名有关", "和互联网顶级域名无关"],
      nationalTeamRelated: ["和国家队运动服饰有关", "和国家队运动服饰无关"],
      stampRelated: ["是邮票类物品", "不是邮票类物品"],
      documentRelated: ["像证件、地图、卡片或票据", "不像证件、地图、卡片或票据"],
    provinceRelated: ["和省级行政区有关", "和省级行政区无关"],
    licensePlateRelated: ["和车牌有关", "和车牌无关"],
    cityRelated: ["和某个城市有关", "和城市无关"],
    transitLine: ["是一条交通线路", "不是交通线路"],
    stationRelated: ["是车站或站点类地点", "不是车站或站点类地点"],
    transportCard: ["是交通卡类物品", "不是交通卡类物品"],
    chemicalElement: ["是化学元素", "不是化学元素"],
    playingCard: ["是一张具体的扑克牌", "不是扑克牌"],
    cardGameRelated: ["和纸牌游戏有关", "和纸牌游戏无关"],
    blackSuit: ["是黑色花色扑克牌", "不是黑色花色扑克牌"],
    redSuit: ["是红色花色扑克牌", "不是红色花色扑克牌"],
    faceCard: ["是J、Q、K这类人头像牌", "不是人头像牌"],
    aceCard: ["是A牌", "不是A牌"],
    numberCard: ["是数字牌", "不是数字牌"],
    zodiacRelated: ["和生肖有关", "和生肖无关"],
    constellationRelated: ["和星座有关", "和星座无关"],
    planetRelated: ["和行星有关", "和行星无关"],
    modelRelated: ["是模型类物品", "不是模型类物品"],
    publicPlace: ["是公共场所", "不是公共场所"],
    asiaRelated: ["和亚洲有关", "和亚洲无关"],
    europeRelated: ["和欧洲有关", "和欧洲无关"],
    africaRelated: ["和非洲有关", "和非洲无关"],
    northAmericaRelated: ["和北美洲有关", "和北美洲无关"],
    southAmericaRelated: ["和南美洲有关", "和南美洲无关"],
    oceaniaRelated: ["和大洋洲有关", "和大洋洲无关"]
  };
  const pair = textByAttr[clue.attr];
  if (pair) return pair[clue.answer ? 0 : 1];
  return clue.answer ? "答案是肯定的" : "答案是否定的";
}

function renderClue(clue) {
  return `<div class="clue clue--direct ${clue.answer ? "yes" : "no"}"><div class="clue__direct">${html(clueResultText(clue))}</div></div>`;
}

function renderPhase() {
  if (game.phase === "select") {
    return `
      ${game.players.map((player) => `
        <h3 class="section-title">${html(player.name)} 请选择问题卡</h3>
        <div class="cards">
          ${player.cards.map((card) => `<button class="question-card ${player.selected?.id === card.id ? "selected" : player.selected ? "dim" : ""}" data-player="${player.id}" data-card="${card.id}"><p>${html(card.question)}</p><span>${player.selected?.id === card.id ? "已选择" : "选择此卡"}</span></button>`).join("")}
        </div>
      `).join("")}
      <button class="primary" id="reveal" ${game.players.every((p) => p.selected) ? "" : "disabled"}>公开 AI 回答</button>
    `;
  }
  if (game.phase === "reveal") {
    return `<div class="reveal-list">${game.reveal.map((clue) => `<div class="bubble"><strong>${html(clue.playerName)}</strong> 问：${html(clue.question)}<div>${clue.answer ? "✅ 是的" : "❌ 不是"}</div></div>`).join("")}</div><div class="toolbar" style="margin-top:18px"><button class="primary" id="guess">进入猜测</button></div>`;
  }
  if (game.phase === "guess") {
    return `<form class="guess-box" id="guessForm">${game.players.map((player) => `<label class="field"><span>${html(player.name)} 的猜测</span><input class="input" name="${player.id}" maxlength="24" placeholder="留空表示跳过"></label>`).join("")}<button class="primary" type="submit">提交本轮猜测</button></form>`;
  }
  if (game.phase === "roundResult") {
    return `<h3 class="section-title">本轮无人猜中</h3><div class="result-list">${game.results.map((r) => `<div class="bubble"><strong>${html(r.playerName)}</strong> ${r.skipped ? "跳过了本轮" : `猜了「${html(r.guess)}」 · 未命中`}</div>`).join("")}</div><div class="toolbar" style="margin-top:18px"><button class="primary" id="next">下一轮</button></div>`;
  }
  return `<div class="answer"><div><div class="answer__emoji">${game.item.emoji}</div><h2>${html(game.item.name)}</h2><div class="small">用了 ${game.round} 轮，共揭示 ${game.clues.length} 条线索</div></div></div><h3 class="section-title">排名</h3><div class="ranking">${game.players.sort((a, b) => b.score - a.score).map((p, i) => `<div class="rank-row"><div class="avatar">${i + 1}</div><strong>${html(p.name)}</strong><span class="badge ${game.winnerIds.includes(p.id) ? "ok" : ""}">${p.score} 分</span></div>`).join("")}</div><div class="toolbar" style="margin-top:18px"><button class="primary" id="again">再来一局</button></div>`;
}

function bindEvents() {
  app.querySelectorAll("[data-card]").forEach((button) => button.addEventListener("click", () => selectCard(button.dataset.player, button.dataset.card)));
  app.querySelector("#reveal")?.addEventListener("click", revealAnswers);
  app.querySelector("#guess")?.addEventListener("click", startGuess);
  app.querySelector("#guessForm")?.addEventListener("submit", (event) => { event.preventDefault(); submitGuesses(event.currentTarget); });
  app.querySelector("#next")?.addEventListener("click", nextRound);
  app.querySelector("#again")?.addEventListener("click", restartWithSamePlayers);
}

function render() {
  if (!game) renderHome();
  else renderGame();
}

render();
