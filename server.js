const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

function loadEnvFile() {
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index <= 0) continue;
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile();

const PORT = Number(process.env.PORT || 5173);
const PUBLIC_DIR = __dirname;

const ROUND_LIMIT = 10;
const SELECT_SECONDS = 30;
const GUESS_SECONDS = 20;
const RESULT_SECONDS = 5;
const MIN_PLAYERS = 2;
const MAX_PLAYERS = 6;
const AI_API_URL = process.env.AI_API_URL || "https://api.openai.com/v1/chat/completions";
const AI_API_KEY = process.env.AI_API_KEY || process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || "";
const AI_MODEL = process.env.AI_MODEL || "gpt-4.1-mini";
const AI_FAST_MODEL = process.env.AI_FAST_MODEL || process.env.AI_CHEAP_MODEL || AI_MODEL;
const AI_QUALITY_MODEL = process.env.AI_QUALITY_MODEL || AI_MODEL;
const AI_CARDS_PER_ROUND = Math.max(20, Math.min(80, Number(process.env.AI_CARDS_PER_ROUND || 50)));
const MIN_AI_CARDS_PER_ROUND = Math.max(12, Math.min(AI_CARDS_PER_ROUND, Number(process.env.MIN_AI_CARDS_PER_ROUND || 20)));
const AI_REQUEST_TIMEOUT_MS = Math.max(15000, Number(process.env.AI_REQUEST_TIMEOUT_MS || 60000));
const AI_THINKING = process.env.AI_THINKING || "";
const AI_REASONING_EFFORT = process.env.AI_REASONING_EFFORT || "";
const AI_FAST_THINKING = process.env.AI_FAST_THINKING || "disabled";
const AI_FAST_REASONING_EFFORT = process.env.AI_FAST_REASONING_EFFORT || "";
const AI_QUALITY_THINKING = process.env.AI_QUALITY_THINKING || AI_THINKING;
const AI_QUALITY_REASONING_EFFORT = process.env.AI_QUALITY_REASONING_EFFORT || AI_REASONING_EFFORT;
const AI_TEMPERATURE = Math.max(0, Math.min(1, Number(process.env.AI_TEMPERATURE || 0.25)));
const AI_MAX_TOKENS = Math.max(1024, Number(process.env.AI_MAX_TOKENS || 8192));

const rooms = new Map();

const items = [
  {
    id: "elephant",
    name: "大象",
    emoji: "🐘",
    aliases: ["大象", "象", "elephant"],
    attrs: {
      alive: true, animal: true, mammal: true, pet: false, wild: true, canFly: false,
      aquatic: false, hasLegs: true, fourLegs: true, biggerThanBread: true,
      biggerThanPerson: true, foundInChina: true, manMade: false, food: false,
      electronic: false, vehicle: false, canHold: false, gray: true, hasTail: true,
      makesSound: true, usedDaily: false, natural: true
    }
  },
  {
    id: "panda",
    name: "熊猫",
    emoji: "🐼",
    aliases: ["熊猫", "大熊猫", "panda"],
    attrs: {
      alive: true, animal: true, mammal: true, pet: false, wild: true, canFly: false,
      aquatic: false, hasLegs: true, fourLegs: true, biggerThanBread: true,
      biggerThanPerson: false, foundInChina: true, manMade: false, food: false,
      electronic: false, vehicle: false, canHold: false, gray: false, blackWhite: true,
      hasTail: true, makesSound: true, usedDaily: false, natural: true
    }
  },
  {
    id: "dolphin",
    name: "海豚",
    emoji: "🐬",
    aliases: ["海豚", "dolphin"],
    attrs: {
      alive: true, animal: true, mammal: true, pet: false, wild: true, canFly: false,
      aquatic: true, hasLegs: false, fourLegs: false, biggerThanBread: true,
      biggerThanPerson: true, foundInChina: true, manMade: false, food: false,
      electronic: false, vehicle: false, canHold: false, gray: true, hasTail: true,
      makesSound: true, usedDaily: false, natural: true
    }
  },
  {
    id: "penguin",
    name: "企鹅",
    emoji: "🐧",
    aliases: ["企鹅", "penguin"],
    attrs: {
      alive: true, animal: true, mammal: false, pet: false, wild: true, canFly: false,
      aquatic: true, hasLegs: true, fourLegs: false, biggerThanBread: true,
      biggerThanPerson: false, foundInChina: false, manMade: false, food: false,
      electronic: false, vehicle: false, canHold: false, blackWhite: true, hasTail: true,
      makesSound: true, usedDaily: false, natural: true
    }
  },
  {
    id: "apple",
    name: "苹果",
    emoji: "🍎",
    aliases: ["苹果", "apple"],
    attrs: {
      alive: false, plant: true, animal: false, mammal: false, pet: false, wild: false,
      canFly: false, aquatic: false, hasLegs: false, fourLegs: false,
      biggerThanBread: false, biggerThanPerson: false, foundInChina: true,
      manMade: false, food: true, electronic: false, vehicle: false, canHold: true,
      red: true, round: true, usedDaily: true, natural: true, inKitchen: true
    }
  },
  {
    id: "refrigerator",
    name: "冰箱",
    emoji: "🧊",
    aliases: ["冰箱", "电冰箱", "fridge", "refrigerator"],
    attrs: {
      alive: false, animal: false, mammal: false, pet: false, wild: false, canFly: false,
      aquatic: false, hasLegs: false, fourLegs: false, biggerThanBread: true,
      biggerThanPerson: true, foundInChina: true, manMade: true, food: false,
      electronic: true, vehicle: false, canHold: false, usedDaily: true,
      inKitchen: true, madeOfMetal: true, cold: true, natural: false
    }
  },
  {
    id: "bicycle",
    name: "自行车",
    emoji: "🚲",
    aliases: ["自行车", "单车", "脚踏车", "bike", "bicycle"],
    attrs: {
      alive: false, animal: false, mammal: false, pet: false, wild: false, canFly: false,
      aquatic: false, hasLegs: false, fourLegs: false, biggerThanBread: true,
      biggerThanPerson: false, foundInChina: true, manMade: true, food: false,
      electronic: false, vehicle: true, canHold: false, usedDaily: true,
      madeOfMetal: true, hasWheels: true, natural: false
    }
  },
  {
    id: "airplane",
    name: "飞机",
    emoji: "✈️",
    aliases: ["飞机", "客机", "airplane", "plane"],
    attrs: {
      alive: false, animal: false, mammal: false, pet: false, wild: false, canFly: true,
      aquatic: false, hasLegs: false, fourLegs: false, biggerThanBread: true,
      biggerThanPerson: true, foundInChina: true, manMade: true, food: false,
      electronic: true, vehicle: true, canHold: false, usedDaily: false,
      madeOfMetal: true, hasWheels: true, natural: false
    }
  },
  {
    id: "umbrella",
    name: "雨伞",
    emoji: "☂️",
    aliases: ["雨伞", "伞", "umbrella"],
    attrs: {
      alive: false, animal: false, mammal: false, pet: false, wild: false, canFly: false,
      aquatic: false, hasLegs: false, fourLegs: false, biggerThanBread: true,
      biggerThanPerson: false, foundInChina: true, manMade: true, food: false,
      electronic: false, vehicle: false, canHold: true, usedDaily: true,
      madeOfMetal: true, natural: false, usefulInRain: true
    }
  },
  {
    id: "guitar",
    name: "吉他",
    emoji: "🎸",
    aliases: ["吉他", "guitar"],
    attrs: {
      alive: false, animal: false, mammal: false, pet: false, wild: false, canFly: false,
      aquatic: false, hasLegs: false, fourLegs: false, biggerThanBread: true,
      biggerThanPerson: false, foundInChina: true, manMade: true, food: false,
      electronic: false, vehicle: false, canHold: true, usedDaily: false,
      musical: true, natural: false, madeOfWood: true
    }
  },
  {
    id: "basketball",
    name: "篮球",
    emoji: "🏀",
    aliases: ["篮球", "basketball"],
    attrs: {
      alive: false, animal: false, mammal: false, pet: false, wild: false, canFly: false,
      aquatic: false, hasLegs: false, fourLegs: false, biggerThanBread: true,
      biggerThanPerson: false, foundInChina: true, manMade: true, food: false,
      electronic: false, vehicle: false, canHold: true, usedDaily: false,
      sports: true, round: true, natural: false
    }
  },
  {
    id: "sunflower",
    name: "向日葵",
    emoji: "🌻",
    aliases: ["向日葵", "sunflower"],
    attrs: {
      alive: true, plant: true, animal: false, mammal: false, pet: false, wild: false,
      canFly: false, aquatic: false, hasLegs: false, fourLegs: false,
      biggerThanBread: true, biggerThanPerson: false, foundInChina: true,
      manMade: false, food: false, electronic: false, vehicle: false, canHold: false,
      yellow: true, natural: true, makesSound: false
    }
  }
];

items.push(
  {
    id: "cat",
    name: "猫",
    emoji: "🐱",
    aliases: ["猫", "猫咪", "小猫", "cat"],
    attrs: {
      alive: true, animal: true, mammal: true, pet: true, wild: false, canFly: false,
      aquatic: false, hasLegs: true, fourLegs: true, biggerThanBread: true,
      biggerThanPerson: false, foundInChina: true, manMade: false, food: false,
      electronic: false, vehicle: false, canHold: true, gray: false, hasTail: true,
      makesSound: true, usedDaily: false, natural: true
    }
  },
  {
    id: "dog",
    name: "狗",
    emoji: "🐶",
    aliases: ["狗", "小狗", "狗狗", "dog"],
    attrs: {
      alive: true, animal: true, mammal: true, pet: true, wild: false, canFly: false,
      aquatic: false, hasLegs: true, fourLegs: true, biggerThanBread: true,
      biggerThanPerson: false, foundInChina: true, manMade: false, food: false,
      electronic: false, vehicle: false, canHold: true, hasTail: true,
      makesSound: true, usedDaily: false, natural: true
    }
  },
  {
    id: "tiger",
    name: "老虎",
    emoji: "🐯",
    aliases: ["老虎", "虎", "tiger"],
    attrs: {
      alive: true, animal: true, mammal: true, pet: false, wild: true, canFly: false,
      aquatic: false, hasLegs: true, fourLegs: true, biggerThanBread: true,
      biggerThanPerson: false, foundInChina: true, manMade: false, food: false,
      electronic: false, vehicle: false, canHold: false, yellow: true, hasTail: true,
      makesSound: true, usedDaily: false, natural: true
    }
  },
  {
    id: "rabbit",
    name: "兔子",
    emoji: "🐰",
    aliases: ["兔子", "兔", "小兔", "rabbit"],
    attrs: {
      alive: true, animal: true, mammal: true, pet: true, wild: true, canFly: false,
      aquatic: false, hasLegs: true, fourLegs: true, biggerThanBread: true,
      biggerThanPerson: false, foundInChina: true, manMade: false, food: false,
      electronic: false, vehicle: false, canHold: true, makesSound: false,
      usedDaily: false, natural: true
    }
  },
  {
    id: "turtle",
    name: "乌龟",
    emoji: "🐢",
    aliases: ["乌龟", "龟", "turtle"],
    attrs: {
      alive: true, animal: true, mammal: false, pet: true, wild: true, canFly: false,
      aquatic: true, hasLegs: true, fourLegs: true, biggerThanBread: false,
      biggerThanPerson: false, foundInChina: true, manMade: false, food: false,
      electronic: false, vehicle: false, canHold: true, makesSound: false,
      usedDaily: false, natural: true
    }
  },
  {
    id: "shark",
    name: "鲨鱼",
    emoji: "🦈",
    aliases: ["鲨鱼", "鲨", "shark"],
    attrs: {
      alive: true, animal: true, mammal: false, pet: false, wild: true, canFly: false,
      aquatic: true, hasLegs: false, fourLegs: false, biggerThanBread: true,
      biggerThanPerson: true, foundInChina: true, manMade: false, food: false,
      electronic: false, vehicle: false, canHold: false, gray: true, hasTail: true,
      makesSound: false, usedDaily: false, natural: true
    }
  },
  {
    id: "banana",
    name: "香蕉",
    emoji: "🍌",
    aliases: ["香蕉", "banana"],
    attrs: {
      alive: false, plant: true, animal: false, mammal: false, canFly: false,
      aquatic: false, hasLegs: false, fourLegs: false, biggerThanBread: false,
      biggerThanPerson: false, foundInChina: true, manMade: false, food: true,
      electronic: false, vehicle: false, canHold: true, yellow: true,
      usedDaily: true, natural: true, inKitchen: true
    }
  },
  {
    id: "watermelon",
    name: "西瓜",
    emoji: "🍉",
    aliases: ["西瓜", "watermelon"],
    attrs: {
      alive: false, plant: true, animal: false, mammal: false, canFly: false,
      aquatic: false, hasLegs: false, fourLegs: false, biggerThanBread: true,
      biggerThanPerson: false, foundInChina: true, manMade: false, food: true,
      electronic: false, vehicle: false, canHold: true, round: true,
      usedDaily: true, natural: true, inKitchen: true
    }
  },
  {
    id: "bread",
    name: "面包",
    emoji: "🍞",
    aliases: ["面包", "bread"],
    attrs: {
      alive: false, animal: false, canFly: false, aquatic: false, hasLegs: false,
      fourLegs: false, biggerThanBread: false, biggerThanPerson: false,
      foundInChina: true, manMade: true, food: true, electronic: false,
      vehicle: false, canHold: true, usedDaily: true, natural: false, inKitchen: true
    }
  },
  {
    id: "milk",
    name: "牛奶",
    emoji: "🥛",
    aliases: ["牛奶", "奶", "milk"],
    attrs: {
      alive: false, animal: false, canFly: false, aquatic: false, hasLegs: false,
      fourLegs: false, biggerThanBread: false, biggerThanPerson: false,
      foundInChina: true, manMade: true, food: true, electronic: false,
      vehicle: false, canHold: true, usedDaily: true, natural: false, inKitchen: true
    }
  },
  {
    id: "phone",
    name: "手机",
    emoji: "📱",
    aliases: ["手机", "智能手机", "电话", "mobile phone", "phone"],
    attrs: {
      alive: false, animal: false, canFly: false, aquatic: false, hasLegs: false,
      fourLegs: false, biggerThanBread: false, biggerThanPerson: false,
      foundInChina: true, manMade: true, food: false, electronic: true,
      vehicle: false, canHold: true, usedDaily: true, madeOfMetal: true, natural: false
    }
  },
  {
    id: "computer",
    name: "电脑",
    emoji: "💻",
    aliases: ["电脑", "笔记本电脑", "计算机", "computer", "laptop"],
    attrs: {
      alive: false, animal: false, canFly: false, aquatic: false, hasLegs: false,
      fourLegs: false, biggerThanBread: true, biggerThanPerson: false,
      foundInChina: true, manMade: true, food: false, electronic: true,
      vehicle: false, canHold: true, usedDaily: true, madeOfMetal: true, natural: false
    }
  },
  {
    id: "book",
    name: "书",
    emoji: "📖",
    aliases: ["书", "书本", "图书", "book"],
    attrs: {
      alive: false, animal: false, canFly: false, aquatic: false, hasLegs: false,
      fourLegs: false, biggerThanBread: true, biggerThanPerson: false,
      foundInChina: true, manMade: true, food: false, electronic: false,
      vehicle: false, canHold: true, usedDaily: true, natural: false
    }
  },
  {
    id: "chair",
    name: "椅子",
    emoji: "🪑",
    aliases: ["椅子", "座椅", "chair"],
    attrs: {
      alive: false, animal: false, canFly: false, aquatic: false, hasLegs: true,
      fourLegs: true, biggerThanBread: true, biggerThanPerson: false,
      foundInChina: true, manMade: true, food: false, electronic: false,
      vehicle: false, canHold: false, usedDaily: true, madeOfWood: true, natural: false
    }
  },
  {
    id: "car",
    name: "汽车",
    emoji: "🚗",
    aliases: ["汽车", "轿车", "车", "car"],
    attrs: {
      alive: false, animal: false, canFly: false, aquatic: false, hasLegs: false,
      fourLegs: false, biggerThanBread: true, biggerThanPerson: true,
      foundInChina: true, manMade: true, food: false, electronic: true,
      vehicle: true, canHold: false, usedDaily: true, madeOfMetal: true,
      hasWheels: true, natural: false
    }
  },
  {
    id: "train",
    name: "火车",
    emoji: "🚆",
    aliases: ["火车", "列车", "train"],
    attrs: {
      alive: false, animal: false, canFly: false, aquatic: false, hasLegs: false,
      fourLegs: false, biggerThanBread: true, biggerThanPerson: true,
      foundInChina: true, manMade: true, food: false, electronic: true,
      vehicle: true, canHold: false, usedDaily: false, madeOfMetal: true,
      hasWheels: true, natural: false
    }
  },
  {
    id: "cup",
    name: "杯子",
    emoji: "🥤",
    aliases: ["杯子", "水杯", "杯", "cup"],
    attrs: {
      alive: false, animal: false, canFly: false, aquatic: false, hasLegs: false,
      fourLegs: false, biggerThanBread: false, biggerThanPerson: false,
      foundInChina: true, manMade: true, food: false, electronic: false,
      vehicle: false, canHold: true, usedDaily: true, round: true, inKitchen: true,
      natural: false
    }
  },
  {
    id: "toothbrush",
    name: "牙刷",
    emoji: "🪥",
    aliases: ["牙刷", "toothbrush"],
    attrs: {
      alive: false, animal: false, canFly: false, aquatic: false, hasLegs: false,
      fourLegs: false, biggerThanBread: false, biggerThanPerson: false,
      foundInChina: true, manMade: true, food: false, electronic: false,
      vehicle: false, canHold: true, usedDaily: true, natural: false
    }
  },
  {
    id: "scissors",
    name: "剪刀",
    emoji: "✂️",
    aliases: ["剪刀", "scissors"],
    attrs: {
      alive: false, animal: false, canFly: false, aquatic: false, hasLegs: false,
      fourLegs: false, biggerThanBread: false, biggerThanPerson: false,
      foundInChina: true, manMade: true, food: false, electronic: false,
      vehicle: false, canHold: true, usedDaily: true, madeOfMetal: true, natural: false
    }
  },
  {
    id: "candle",
    name: "蜡烛",
    emoji: "🕯️",
    aliases: ["蜡烛", "candle"],
    attrs: {
      alive: false, animal: false, canFly: false, aquatic: false, hasLegs: false,
      fourLegs: false, biggerThanBread: false, biggerThanPerson: false,
      foundInChina: true, manMade: true, food: false, electronic: false,
      vehicle: false, canHold: true, usedDaily: false, yellow: true, natural: false
    }
  }
);

const { buildAnswerBank } = require("./answer-bank.js");
const { AVATARS, avatarById, makeSpeech } = require("./avatar-data.js");
items.length = 0;
items.push(...buildAnswerBank(1000));

const questions = [
  ["manMade", "它是人造的吗？", "early", 9],
  ["natural", "它天然存在吗？", "early", 9],
  ["animal", "它是动物吗？", "early", 9],
  ["plant", "它和植物有关吗？", "early", 8],
  ["food", "它能被当作食物吗？", "early", 8],
  ["vehicle", "它是交通工具吗？", "early", 8],
  ["electronic", "它需要用电吗？", "early", 7],
  ["countryRelated", "它和某个国家有关吗？", "early", 10],
  ["documentRelated", "它像证件、地图、卡片或票据这类东西吗？", "early", 9],
  ["cityRelated", "它和某个城市有关吗？", "early", 9],
  ["chemicalElement", "它是化学元素吗？", "early", 10],
  ["cardGameRelated", "它和扑克牌或纸牌游戏有关吗？", "early", 10],
  ["planetRelated", "它和行星有关吗？", "early", 9],
  ["sports", "它和运动有关吗？", "early", 7],
  ["musical", "它和音乐有关吗？", "early", 7],
  ["mammal", "它是哺乳动物吗？", "middle", 7],
  ["pet", "它通常会被当作宠物吗？", "middle", 6],
  ["wild", "它主要生活在野外吗？", "middle", 6],
  ["canFly", "它能飞吗？", "middle", 6],
  ["aquatic", "它能在水里生活吗？", "middle", 7],
  ["freshwaterRelated", "它主要生活在淡水里吗？", "late", 10],
  ["saltwaterRelated", "它主要生活在海水里吗？", "late", 10],
  ["fishRelated", "它属于鱼类吗？", "late", 9],
  ["crustaceanRelated", "它属于螃蟹、虾、龙虾这类甲壳动物吗？", "late", 9],
  ["shellfishRelated", "它是贝类动物吗？", "late", 9],
  ["molluskRelated", "它是章鱼、鱿鱼、墨鱼这类软体动物吗？", "late", 9],
  ["amphibianRelated", "它属于青蛙这类两栖动物吗？", "late", 9],
  ["reptileRelated", "它属于龟或鳄鱼这类爬行动物吗？", "late", 9],
  ["marineMammalRelated", "它是海豚、鲸鱼、海豹这类海洋哺乳动物吗？", "late", 9],
  ["hasLegs", "它有腿吗？", "late", 7],
  ["hasTail", "它有明显的尾巴吗？", "late", 7],
  ["fourLegs", "它有四条腿吗？", "middle", 6],
  ["biggerThanBread", "它比一块面包大吗？", "middle", 5],
  ["biggerThanPerson", "它比成年人还大吗？", "middle", 6],
  ["canHold", "一个人能把它拿起来吗？", "middle", 5],
  ["usedDaily", "它常出现在日常生活里吗？", "middle", 5],
  ["inKitchen", "它常出现在厨房里吗？", "middle", 5],
  ["madeOfMetal", "它通常含有金属吗？", "middle", 5],
  ["hasWheels", "它有轮子吗？", "middle", 6],
  ["round", "它通常是圆形的吗？", "middle", 4],
  ["flagRelated", "它是旗帜类物品吗？", "middle", 10],
  ["mapRelated", "它和地图有关吗？", "middle", 10],
  ["passportRelated", "它是护照类物品吗？", "middle", 10],
  ["nationalSymbol", "它有国家象征意义吗？", "middle", 9],
  ["provinceRelated", "它和省级行政区有关吗？", "middle", 8],
  ["licensePlateRelated", "它和车牌有关吗？", "middle", 9],
  ["transitLine", "它是一条交通线路吗？", "middle", 10],
  ["stationRelated", "它是车站或站点类地点吗？", "middle", 9],
  ["transportCard", "它是交通卡类物品吗？", "middle", 10],
  ["playingCard", "它是一张具体的扑克牌吗？", "middle", 10],
  ["zodiacRelated", "它和生肖有关吗？", "middle", 8],
  ["constellationRelated", "它和星座有关吗？", "middle", 8],
  ["modelRelated", "它是模型类物品吗？", "middle", 7],
  ["publicPlace", "它是公共场所吗？", "middle", 7],
  ["asiaRelated", "它和亚洲有关吗？", "late", 8],
  ["europeRelated", "它和欧洲有关吗？", "late", 8],
  ["africaRelated", "它和非洲有关吗？", "late", 8],
  ["northAmericaRelated", "它和北美洲有关吗？", "late", 8],
  ["southAmericaRelated", "它和南美洲有关吗？", "late", 8],
  ["oceaniaRelated", "它和大洋洲有关吗？", "late", 8],
  ["blackSuit", "它是黑色花色的扑克牌吗？", "late", 9],
  ["redSuit", "它是红色花色的扑克牌吗？", "late", 9],
  ["faceCard", "它是J、Q、K这类人头像牌吗？", "late", 9],
  ["aceCard", "它是A牌吗？", "late", 8],
  ["numberCard", "它是数字牌吗？", "late", 8],
  ["gray", "它通常是灰色的吗？", "late", 4],
  ["blackWhite", "它有明显的黑白配色吗？", "late", 4],
  ["red", "它常见颜色是红色吗？", "late", 3],
  ["yellow", "它常见颜色是黄色吗？", "late", 3],
  ["cold", "它和低温有关吗？", "late", 3],
  ["usefulInRain", "下雨时经常会用到它吗？", "late", 3],
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

for (const question of questions) {
  const meta = questionTree[question.attr] || {};
  question.layer = meta.layer || 1;
  question.parents = meta.parents || [];
}

function uid(prefix = "") {
  return prefix + crypto.randomBytes(8).toString("hex");
}

function makeRoomId() {
  let id;
  do {
    id = String(Math.floor(100000 + Math.random() * 900000));
  } while (rooms.has(id));
  return id;
}

function json(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(JSON.stringify(body));
}

function normalizeName(name) {
  return String(name || "").trim().slice(0, 8) || "玩家";
}

function normalizeAvatarId(avatarId) {
  return avatarById(avatarId).id;
}

function normalizePlayerLimit(value) {
  const limit = Math.floor(Number(value) || MIN_PLAYERS);
  return Math.max(MIN_PLAYERS, Math.min(MAX_PLAYERS, limit));
}

function normalizeDifficulty(value) {
  if (value === "medium") return "medium";
  if (value === "hard") return "hard";
  return "normal";
}

function roundsForDifficulty(value) {
  return {
    normal: 10,
    medium: 8,
    hard: 6
  }[normalizeDifficulty(value)] || ROUND_LIMIT;
}

function createPlayer(name, host = false, avatarId) {
  return {
    id: uid("p_"),
    name: normalizeName(name),
    avatarId: normalizeAvatarId(avatarId),
    score: 0,
    isReady: host,
    cards: [],
    seenCardAttrs: [],
    selectedCardId: null,
    guess: null,
    skipped: false,
    isConnected: true,
    lastSeen: Date.now(),
    wantsRematch: false
  };
}

function createRoom(hostName, avatarId) {
  const player = createPlayer(hostName, true, avatarId);
  const room = {
    id: makeRoomId(),
    players: [player],
    status: "waiting",
    phase: "waiting",
    difficulty: "normal",
    playerLimit: MIN_PLAYERS,
    currentRound: 0,
    gameSeq: 0,
    maxRounds: roundsForDifficulty("normal"),
    secretItem: null,
    aiStatus: "idle",
    aiError: "",
    aiQuestionBank: {},
    aiRoundSizes: {},
    aiGeneratingRounds: [],
    aiGenerationId: 0,
    usedItemIds: [],
    revealedClues: [],
    lastReveal: [],
    lastResults: [],
    speeches: [],
    roundCardAttrs: [],
    usedCardAttrs: [],
    hostId: player.id,
    phaseEndsAt: null,
    timer: null,
    createdAt: Date.now()
  };
  room.secretItem = pickSecretItem(room);
  rooms.set(room.id, room);
  prepareAiQuestionBank(room);
  return { room, player };
}

function publicRoom(room, viewerId) {
  refreshConnections(room);
  const viewer = room.players.find((p) => p.id === viewerId);
  if (viewer) ensurePlayerCards(room, viewer);
  const aiReadyRound = room.currentRound > 0 ? room.currentRound : 1;
  return {
    id: room.id,
    status: room.status,
    phase: room.phase,
    difficulty: room.difficulty,
    playerLimit: normalizePlayerLimit(room.playerLimit),
    currentRound: room.currentRound,
    gameSeq: room.gameSeq,
    maxRounds: room.maxRounds,
    aiStatus: room.aiStatus,
    aiError: room.aiError,
    aiReady: hasAiRound(room, aiReadyRound),
    aiCardsPerRound: aiCardsNeededPerRound(room),
    hostId: room.hostId,
    phaseEndsAt: room.phaseEndsAt,
    players: room.players.map((p) => ({
      id: p.id,
      name: p.name,
      avatar: avatarById(p.avatarId),
      score: p.score,
      isReady: p.isReady,
      isConnected: p.isConnected,
      selected: Boolean(p.selectedCardId),
      guessed: Boolean(p.guess || p.skipped),
      skipped: p.skipped,
      wantsRematch: p.wantsRematch
    })),
    me: viewer ? {
      id: viewer.id,
      name: viewer.name,
      avatar: avatarById(viewer.avatarId),
      isHost: viewer.id === room.hostId,
      cards: viewer.cards.map((card) => ({ id: card.id, question: card.question })),
      selectedCardId: viewer.selectedCardId,
      guessed: Boolean(viewer.guess || viewer.skipped)
    } : null,
    revealedClues: room.revealedClues,
    lastReveal: room.lastReveal,
    lastResults: room.lastResults,
    speeches: room.speeches.slice(-40),
    final: room.phase === "gameOver" ? {
      answer: room.secretItem ? {
        name: room.secretItem.name,
        emoji: room.secretItem.emoji,
        aliases: room.secretItem.aliases
      } : null,
      rankings: buildRankings(room)
    } : null
  };
}

function refreshConnections(room) {
  const now = Date.now();
  for (const player of room.players) {
    player.isConnected = now - player.lastSeen < 35000;
  }
}

function clearRoomTimer(room) {
  if (room.timer) clearTimeout(room.timer);
  room.timer = null;
}

function setPhaseTimer(room, seconds, callback) {
  clearRoomTimer(room);
  room.phaseEndsAt = Date.now() + seconds * 1000;
  room.timer = setTimeout(() => callback(room), seconds * 1000);
}

function pickSecretItem(room) {
  const candidates = items.filter((item) => !room.usedItemIds.includes(item.id));
  const pool = candidates.length ? candidates : items;
  const item = pool[Math.floor(Math.random() * pool.length)];
  room.usedItemIds.push(item.id);
  return item;
}

function hashText(value) {
  return crypto.createHash("sha1").update(String(value || "")).digest("hex").slice(0, 12);
}

function directAnswerLeak(item, text) {
  const source = String(text || "").toLowerCase();
  return (item.aliases || [item.name])
    .filter((alias) => String(alias || "").trim().length >= 2)
    .some((alias) => source.includes(String(alias).toLowerCase()));
}

function normalizeAiBool(value) {
  if (value === true || value === "true" || value === "yes" || value === "正确" || value === "是") return true;
  if (value === false || value === "false" || value === "no" || value === "错误" || value === "否") return false;
  return Boolean(value);
}

function extractJsonArray(text) {
  const raw = String(text || "").trim();
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray(parsed.questions)) return parsed.questions;
  } catch {}
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("AI没有返回JSON数组");
  const parsed = JSON.parse(match[0]);
  if (!Array.isArray(parsed)) throw new Error("AI返回格式不是数组");
  return parsed;
}

function aiSystemPrompt() {
  return [
    "你是一个10岁小孩也能听懂的猜物游戏出题员。",
    "你只输出JSON数组，不要解释，不要Markdown。",
    "每个对象必须包含：question, answer, clue, topic。",
    "question是给玩家看到的问题，必须是是/否问题。",
    "answer是布尔值，表示“目标答案”对这个问题的回答，true代表目标答案符合，false代表目标答案不符合。",
    "clue是系统回答后加入已知线索栏的短句，最多12个汉字。",
    "topic是去重主题，最多8个汉字。",
    "这不是知识问答游戏，禁止出常识题、考试题、历史题、科学题、百科题。",
    "每个question都必须是在问“目标答案本身是否有某个特点、用途、外形、场景或关联”。",
    "不能直接出现答案名字、别名、谐音、首字、字数、拼音、英文名。",
    "不要问专业问题，不要使用专业术语。",
    "问题必须围绕目标答案，从宽到窄逐步定位。",
    "前3轮问大类、常见场景；4到6轮问用途、形状、材料、位置；7到8轮问更明显的特征；9到10轮问接近答案的独有用途、外观、使用方式或强关联。",
    "每轮必须同时有正确线索和错误干扰，正确线索略多于错误干扰。",
    "错误干扰也要和同类东西相关，不能乱问。",
    "不要重复已经表达过的同一类意思。"
  ].join("\n");
}

function aiRoundPrompt(item, round, count) {
  const broadness = round <= 2
    ? "这一轮可以问大方向，但仍必须围绕这个答案。"
    : round <= 5
      ? "这一轮要开始问用途、外形、常见场景。"
      : round <= 8
        ? "这一轮要更具体，帮助玩家明显缩小范围。"
        : "这一轮要接近答案，但不能直接说出答案名。";
  return [
    `目标答案：${item.name}`,
    `答案别名：${(item.aliases || []).join("、")}`,
    `当前轮次：第${round}轮，共10轮。`,
    `请生成${count}张不重复的问题卡。`,
    broadness,
    "要求：",
    "1. 全部问题都要简单，10岁小孩能懂。",
    "2. 不要出现答案名字或别名。",
    "3. 不要问首字、字数、拼音、英文名。",
    "4. 不要问需要专业知识才能回答的问题。",
    "5. answer必须按目标答案判断，不是判断问题里的常识句真假。",
    "6. clue要像“能冷藏食物”“不是交通工具”这样短。",
    "7. topic用于去重，比如“冷藏”“做饭”“交通”。",
    "8. 每张卡都必须能帮助玩家排除一批答案或靠近目标答案。",
    "9. false问题必须是同类干扰，比如目标是家电，就用其他家电或生活用品的特征来干扰。",
    "10. true问题数量约60%，false问题数量约40%。",
    "错误示例：目标是地图，却问“地球是太阳系第三颗行星吗？”这是知识问答，禁止。",
    "正确示例：目标是地图，可以问“它能帮助人找路吗？”",
    "只返回JSON数组，示例：",
    `[{"question":"它常在家里用吗？","answer":true,"clue":"家里常用","topic":"家庭"}]`
  ].join("\n");
}

function aiModelConfigForRound(room, round) {
  if (round > Math.max(0, room.maxRounds - 2)) {
    return {
      model: AI_QUALITY_MODEL,
      thinking: AI_QUALITY_THINKING,
      reasoningEffort: AI_QUALITY_REASONING_EFFORT
    };
  }
  return {
    model: AI_FAST_MODEL,
    thinking: AI_FAST_THINKING,
    reasoningEffort: AI_FAST_REASONING_EFFORT
  };
}

function activePlayerCount(room) {
  const connected = room.players.filter((player) => player.isConnected).length;
  if (room.status === "waiting") return normalizePlayerLimit(room.playerLimit);
  return Math.max(MIN_PLAYERS, connected || normalizePlayerLimit(room.playerLimit));
}

function aiCardsNeededPerRound(room) {
  return Math.max(4, Math.min(12, activePlayerCount(room) * 2));
}

function aiCardsRequestCount(room) {
  const needed = aiCardsNeededPerRound(room);
  return Math.max(needed + 4, Math.min(24, needed * 2));
}

function hasAiRound(room, round) {
  const needed = aiCardsNeededPerRound(room);
  return Array.isArray(room.aiQuestionBank?.[round]) && room.aiQuestionBank[round].length >= needed;
}

function aiWindowStart(room, startRound) {
  return Math.max(1, Math.min(room.maxRounds, Number(startRound || room.currentRound || 1)));
}

function aiWindowRounds(room, startRound) {
  const start = aiWindowStart(room, startRound);
  return [start, start + 1].filter((round) => round >= 1 && round <= room.maxRounds);
}

function hasAiWindow(room, startRound) {
  return aiWindowRounds(room, startRound).every((round) => hasAiRound(room, round));
}

function updateAiStatus(room, startRound = room.currentRound || 1) {
  if (room.aiError && !hasAiRound(room, aiWindowStart(room, startRound))) {
    room.aiStatus = "error";
    return;
  }
  room.aiStatus = hasAiWindow(room, startRound) ? "ready" : "generating";
}

function continueAfterAiReady(room) {
  if (room.phase !== "loading") return;
  if (room.status === "playing" && room.currentRound > 0) {
    dealRound(room);
    return;
  }
  beginGame(room);
}

async function callAiForRound(room, item, round, count) {
  if (!AI_API_KEY) throw new Error("未配置AI_API_KEY、DEEPSEEK_API_KEY或OPENAI_API_KEY，无法生成AI题库");
  const modelConfig = aiModelConfigForRound(room, round);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), AI_REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(AI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AI_API_KEY}`
      },
      body: JSON.stringify({
        model: modelConfig.model,
        temperature: AI_TEMPERATURE,
        max_tokens: AI_MAX_TOKENS,
        stream: false,
        ...(modelConfig.thinking ? { thinking: { type: modelConfig.thinking } } : {}),
        ...(modelConfig.reasoningEffort ? { reasoning_effort: modelConfig.reasoningEffort } : {}),
        messages: [
          { role: "system", content: aiSystemPrompt() },
          { role: "user", content: aiRoundPrompt(item, round, count) }
        ]
      }),
      signal: controller.signal
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = data?.error?.message || data?.message || `AI接口错误 ${response.status}`;
      throw new Error(message);
    }
    const content = data?.choices?.[0]?.message?.content || data?.output_text || data?.content || "";
    return extractJsonArray(content);
  } finally {
    clearTimeout(timer);
  }
}

function normalizeAiQuestion(item, round, raw, index) {
  const question = String(raw?.question || raw?.text || "").trim().slice(0, 60);
  const clue = String(raw?.clue || raw?.resultText || raw?.yesText || raw?.answerText || "").trim().slice(0, 24);
  const topic = String(raw?.topic || raw?.type || `线索${index + 1}`).trim().slice(0, 16);
  if (!question || !clue || !topic) return null;
  if (!/[吗？?]$/.test(question)) return null;
  if (directAnswerLeak(item, `${question} ${clue} ${topic}`)) return null;
  const answer = normalizeAiBool(raw?.answer);
  const attr = `ai:${hashText(question)}`;
  return {
    attr,
    text: question,
    stage: round <= 3 ? "early" : round <= 7 ? "middle" : "late",
    layer: round,
    weight: answer ? 80 : 70,
    yesText: clue,
    noText: clue,
    topic,
    answer,
    parents: [],
    test: () => answer
  };
}

function validateAiRound(item, round, rawQuestions, minCount, maxCount) {
  const seenText = new Set();
  const cards = [];
  for (const raw of rawQuestions || []) {
    const card = normalizeAiQuestion(item, round, raw, cards.length);
    if (!card) continue;
    const textKey = card.text.replace(/\s+/g, "");
    if (seenText.has(textKey)) continue;
    seenText.add(textKey);
    cards.push(card);
  }
  const yesCount = cards.filter((card) => card.answer).length;
  const noCount = cards.length - yesCount;
  const minYes = Math.max(1, Math.floor(minCount * 0.35));
  const minNo = Math.max(1, Math.floor(minCount * 0.2));
  if (cards.length < maxCount || yesCount < minYes || noCount < minNo) {
    throw new Error(`第${round}轮AI题卡不足：需要${maxCount}张，实际有效${cards.length}张`);
  }
  return cards.slice(0, maxCount);
}

async function generateValidatedAiRound(room, item, round, minCount, maxCount) {
  const raw = [];
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const count = attempt === 0 ? maxCount : Math.max(4, maxCount - raw.length + 4);
    raw.push(...await callAiForRound(room, item, round, count));
    try {
      return validateAiRound(item, round, raw, minCount, maxCount);
    } catch (error) {
      if (attempt === 1) throw error;
    }
  }
  return validateAiRound(item, round, raw, minCount, maxCount);
}

async function generateAiRounds(room, generationId, startRound) {
  const item = room.secretItem;
  const requiredCount = aiCardsNeededPerRound(room);
  const requestCount = aiCardsRequestCount(room);
  const generating = new Set(room.aiGeneratingRounds || []);
  const rounds = aiWindowRounds(room, startRound)
    .filter((round) => !hasAiRound(room, round) && !generating.has(round));
  if (!rounds.length) {
    updateAiStatus(room, startRound);
    continueAfterAiReady(room);
    return;
  }
  room.aiGeneratingRounds = Array.from(new Set([...(room.aiGeneratingRounds || []), ...rounds]));
  updateAiStatus(room, startRound);
  const entries = await Promise.all(rounds.map((round) => (
    generateValidatedAiRound(room, item, round, requiredCount, requestCount)
      .then((cards) => [round, cards])
  )));
  if (room.aiGenerationId !== generationId) return;
  if (!room.aiQuestionBank) room.aiQuestionBank = {};
  if (!room.aiRoundSizes) room.aiRoundSizes = {};
  for (const [round, cards] of entries) {
    room.aiQuestionBank[round] = cards;
    room.aiRoundSizes[round] = cards.length;
  }
  room.aiGeneratingRounds = (room.aiGeneratingRounds || []).filter((round) => !rounds.includes(round));
  room.aiError = "";
  updateAiStatus(room, startRound);
  continueAfterAiReady(room);
}

function prepareAiQuestionBank(room, force = false, startRound = room.currentRound || 1) {
  if (!room.secretItem) room.secretItem = pickSecretItem(room);
  const round = aiWindowStart(room, startRound);
  if (force) {
    room.aiQuestionBank = {};
    room.aiRoundSizes = {};
    room.aiGeneratingRounds = [];
    room.aiGenerationId = (room.aiGenerationId || 0) + 1;
  }
  if (!room.aiQuestionBank) room.aiQuestionBank = {};
  if (!room.aiRoundSizes) room.aiRoundSizes = {};
  if (!room.aiGeneratingRounds) room.aiGeneratingRounds = [];
  const generationId = room.aiGenerationId || 0;
  room.aiError = "";
  if (!force && hasAiWindow(room, round)) {
    updateAiStatus(room, round);
    return;
  }
  updateAiStatus(room, round);
  generateAiRounds(room, generationId, round).catch((error) => {
    if (room.aiGenerationId !== generationId) return;
    room.aiGeneratingRounds = [];
    room.aiStatus = "error";
    room.aiError = error.message || "AI题库生成失败";
    if (room.phase === "loading") {
      room.status = "waiting";
      room.phase = "waiting";
      room.currentRound = 0;
      clearRoomTimer(room);
      room.phaseEndsAt = null;
    }
  });
}

function aiRoundPool(room, round) {
  if (!room.aiQuestionBank || !hasAiRound(room, round)) return [];
  return room.aiQuestionBank[round] || [];
}

function topicForQuestionAttr(attr) {
  const value = String(attr || "");
  if (value.startsWith("ai:")) return value;
  return value.split(":")[1] || value || "unknown";
}

function expandedBlockedTopics(topics) {
  return new Set(Array.from(topics || []).filter(Boolean));
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

function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

function pushSpeeches(room, scenario, candidates, context) {
  const pool = shuffle((candidates && candidates.length ? candidates : room.players).filter((player) => player.isConnected !== false));
  const player = pool[0];
  if (!player) return;
  const seed = `${room.id}:${room.currentRound}:${scenario}:${player.id}:${room.speeches.length}:${context || ""}`;
  room.speeches.push({
    id: uid("talk_"),
    at: Date.now(),
    round: room.currentRound,
    scenario,
    playerId: player.id,
    playerName: player.name,
    avatar: avatarById(player.avatarId),
    text: makeSpeech(player.avatarId, scenario, seed)
  });
  room.speeches = room.speeches.slice(-80);
}

function positiveAttrs(room) {
  return new Set(room.revealedClues.filter((clue) => clue.answer).map((clue) => clue.attr));
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

function remainingCandidates(room) {
  return items.filter((item) => room.revealedClues.every((clue) => answerAttr(item, clue.attr) === Boolean(clue.answer)));
}

function usefulness(question, room) {
  const remaining = remainingCandidates(room);
  if (remaining.length <= 1) return questionAnswer(room.secretItem, question) ? 1 : 0;
  let yes = 0;
  for (const item of remaining) {
    if (questionAnswer(item, question)) yes += 1;
  }
  const no = remaining.length - yes;
  if (!yes || !no) return 0;
  const smallerSide = Math.min(yes, no);
  return smallerSide / remaining.length;
}

const weakClueTopics = new Set([
  "generic", "mapBasics", "naturalBasics", "lifeBasics", "workBasics", "personBasics",
  "manMade", "canHold", "biggerThanBread", "documentRelated", "mapCategory", "naturalCategory",
  "asiaRelated", "europeRelated", "africaRelated", "northAmericaRelated", "southAmericaRelated", "oceaniaRelated",
  "country:region"
]);

function isUsefulQuestion(question, room) {
  if (!question) return false;
  const topic = question.topic || topicForQuestionAttr(question.attr);
  if (weakClueTopics.has(topic)) return false;
  if (room.currentRound >= 5 && question.weight >= 18) return true;
  if (room.currentRound >= 5 && question.weight >= 12) return true;
  if (room.currentRound >= 5 && question.weight >= 8 && !String(topic).endsWith("Basics")) return true;
  if (room.currentRound >= 5 && question.answer !== false && !String(topic).endsWith("Basics")) return true;
  if (room.currentRound >= 4 && question.weight >= 14 && !String(topic).endsWith("Basics")) return true;
  return false;
}

function isUsefulClue(clue) {
  if (!clue || clue.round < 5) return false;
  if (clue.useful) return true;
  const topic = clue.topic || topicForQuestionAttr(clue.attr);
  return !weakClueTopics.has(topic) && Number(clue.weight || 0) >= 8;
}

function lateUsefulStats(room, extraClues = []) {
  const clues = room.revealedClues.concat(extraClues).filter((clue) => clue.round >= 5);
  const useful = clues.filter(isUsefulClue).length;
  return {
    total: clues.length,
    useful,
    ratio: clues.length ? useful / clues.length : 1
  };
}

function needsUsefulBoost(room) {
  if (room.currentRound < 5) return false;
  const stats = lateUsefulStats(room);
  return stats.ratio < 0.5;
}

function allowedLateQuestion(question, room) {
  if (room.currentRound < 5) return true;
  const topic = question.topic || topicForQuestionAttr(question.attr);
  return !weakClueTopics.has(topic);
}

function progressiveRank(question, confirmed) {
  if (!question.parents.length) return 0;
  return Math.max(0, ...question.parents.map((parent) => confirmed.has(parent) ? (questionTree[parent]?.layer || 1) : 0));
}

function dynamicPrecisionQuestions(room) {
  if (room.currentRound < 6) return [];
  const confirmed = positiveAttrs(room);
  const allNames = items.map((item) => item.name);
  const dynamic = [];
  const addValueQuestions = (kind, parent, pattern, label, yesSuffix, noSuffix) => {
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

  addValueQuestions("countryValue", "countryRelated", /^(.+?)(国旗|地图|护照)$/, "国家", "有关", "无关");
  addValueQuestions("cityValue", "cityRelated", /^(.+?)(地铁1号线|火车站|公交卡)$/, "城市", "有关", "无关");
  addValueQuestions("provinceValue", "provinceRelated", /^(.+?(?:省|市|自治区|特别行政区))(地图|车牌)$/, "省级行政区", "有关", "无关");

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

function candidateQuestions(room, usedAttrs) {
  const askedAttrs = new Set(room.revealedClues.map((clue) => clue.attr).concat(room.usedCardAttrs || []));
  const askedTopics = expandedBlockedTopics(room.revealedClues.map((clue) => clue.topic || topicForQuestionAttr(clue.attr)).filter(Boolean));
  const minSize = aiCardsNeededPerRound(room);
  const currentPool = aiRoundPool(room, room.currentRound);
  const pools = currentPool.length >= minSize
    ? [currentPool]
    : [
        currentPool,
        aiRoundPool(room, Math.min(room.maxRounds, room.currentRound + 1)),
        aiRoundPool(room, Math.max(1, room.currentRound - 1))
      ].filter((pool) => pool.length >= minSize || pool.length);
  const availableQuestion = (q, blockTopic = true) => (
    allowedLateQuestion(q, room)
    && !askedAttrs.has(q.attr)
    && !usedAttrs.has(q.attr)
    && (!blockTopic || !askedTopics.has(q.topic || topicForQuestionAttr(q.attr)))
  );
  for (const pool of pools) {
    const available = pool.filter((q) => availableQuestion(q, true));
    if (available.some((q) => q.answer !== false) && available.some((q) => q.answer === false)) return available;
    if (available.length >= 2) return available;
    if (room.currentRound >= 4) {
      const relaxed = pool.filter((q) => availableQuestion(q, false));
      if (relaxed.some((q) => q.answer !== false) && relaxed.some((q) => q.answer === false)) return relaxed;
      if (relaxed.length >= 2) return relaxed;
    }
  }
  const strict = pools.flat().filter((q) => availableQuestion(q, true));
  if (strict.length) return strict;
  return pools.flat().filter((q) => availableQuestion(q, false));
}

function candidateQuestionsForPlayer(room, player, usedAttrs) {
  const seen = new Set(player.seenCardAttrs || []);
  const candidates = candidateQuestions(room, usedAttrs);
  const fresh = candidates.filter((q) => !seen.has(q.attr));
  if (fresh.length >= 2) return fresh;
  if (candidates.length) return candidates.filter((q) => !seen.has(q.attr));
  const askedAttrs = new Set(room.revealedClues.map((clue) => clue.attr));
  const askedTopics = expandedBlockedTopics(room.revealedClues.map((clue) => clue.topic || topicForQuestionAttr(clue.attr)).filter(Boolean));
  const pool = aiRoundPool(room, room.currentRound);
  const strict = pool
    .filter((q) => allowedLateQuestion(q, room) && !askedAttrs.has(q.attr) && !usedAttrs.has(q.attr) && !seen.has(q.attr) && !(room.usedCardAttrs || []).includes(q.attr) && !askedTopics.has(q.topic || topicForQuestionAttr(q.attr)));
  if (strict.length >= 2) return strict;
  return pool
    .filter((q) => allowedLateQuestion(q, room) && !askedAttrs.has(q.attr) && !usedAttrs.has(q.attr) && !seen.has(q.attr) && !(room.usedCardAttrs || []).includes(q.attr));
}

function questionScore(question, room, usedAttrs) {
  let score = question.weight || 1;
  if (question.layer === room.currentRound) score += 50;
  if (usedAttrs.has(question.attr)) score -= 20;
  if (room.currentRound >= 5) {
    if (isUsefulQuestion(question, room)) score += needsUsefulBoost(room) ? 90 : 45;
    if (question.answer !== false && (question.weight || 0) >= 18) score += 18;
    const topic = question.topic || topicForQuestionAttr(question.attr);
    if (weakClueTopics.has(topic)) score -= 35;
  }
  return score;
}

function uniqueQuestionsByAttr(list) {
  const seen = new Set();
  const unique = [];
  for (const question of list) {
    if (!question || seen.has(question.attr)) continue;
    seen.add(question.attr);
    unique.push(question);
  }
  return unique;
}

function fallbackQuestionPool(room) {
  const rounds = [
    room.currentRound,
    Math.min(room.maxRounds, room.currentRound + 1),
    Math.max(1, room.currentRound - 1)
  ];
  for (let round = 1; round <= room.maxRounds; round += 1) {
    if (!rounds.includes(round)) rounds.push(round);
  }
  return uniqueQuestionsByAttr(rounds.flatMap((round) => aiRoundPool(room, round)))
    .filter((question) => allowedLateQuestion(question, room));
}

function bestHelpfulQuestion(room, reveal) {
  const blockedAttrs = new Set(room.revealedClues.concat(reveal).map((clue) => clue.attr));
  const pool = fallbackQuestionPool(room)
    .filter((question) => !blockedAttrs.has(question.attr))
    .filter((question) => isUsefulQuestion(question, room))
    .sort((a, b) => {
      const answerBonus = (b.answer !== false ? 20 : 0) - (a.answer !== false ? 20 : 0);
      return answerBonus || questionScore(b, room, new Set()) - questionScore(a, room, new Set());
    });
  return pool[0] || null;
}

function addHelpfulCluesIfNeeded(room, reveal) {
  if (room.currentRound < 5) return;
  let stats = lateUsefulStats(room, reveal);
  let guard = 0;
  while (stats.total && stats.ratio < 0.5 && guard < 12) {
    const question = bestHelpfulQuestion(room, reveal);
    if (!question) break;
    reveal.push({
      round: room.currentRound,
      playerId: "ai_helper",
      playerName: "AI线索",
      question: question.text,
      answer: question.answer !== false,
      attr: question.attr,
      topic: question.topic || topicForQuestionAttr(question.attr),
      resultText: question.answer === false ? question.noText : question.yesText,
      useful: true,
      weight: question.weight || 0,
      assisted: true
    });
    stats = lateUsefulStats(room, reveal);
    guard += 1;
  }
}

function generateCards(room, player, usedAttrs) {
  const blockedAttrs = new Set([...(room.roundCardAttrs || []), ...(room.usedCardAttrs || []), ...usedAttrs]);
  const seenAttrs = new Set(player.seenCardAttrs || []);
  const askedAttrs = new Set(room.revealedClues.map((clue) => clue.attr));
  const candidates = shuffle(candidateQuestionsForPlayer(room, player, usedAttrs))
    .sort((a, b) => questionScore(b, room, usedAttrs) - questionScore(a, room, usedAttrs));
  const chosen = [];
  const pickUseful = (list, options = {}) => {
    for (const q of list) {
      if (!isUsefulQuestion(q, room)) continue;
      if (!options.allowSeen && seenAttrs.has(q.attr)) continue;
      if (!options.allowAsked && askedAttrs.has(q.attr)) continue;
      if (!blockedAttrs.has(q.attr) && !chosen.some((existing) => existing.attr === q.attr)) {
        chosen.push(q);
        blockedAttrs.add(q.attr);
        return true;
      }
    }
    return false;
  };
  const pickOne = (list, answerValue, options = {}) => {
    for (const q of list) {
      if ((q.answer === false) !== (answerValue === false)) continue;
      if (!options.allowSeen && seenAttrs.has(q.attr)) continue;
      if (!options.allowAsked && askedAttrs.has(q.attr)) continue;
      if (!blockedAttrs.has(q.attr) && !chosen.some((existing) => existing.attr === q.attr)) {
        chosen.push(q);
        blockedAttrs.add(q.attr);
        return true;
      }
    }
    return false;
  };
  const fillFrom = (list, options = {}) => {
    for (const q of list) {
      if (chosen.length >= 2) break;
      if (!options.allowSeen && seenAttrs.has(q.attr)) continue;
      if (!options.allowAsked && askedAttrs.has(q.attr)) continue;
      if (!blockedAttrs.has(q.attr) && !chosen.some((existing) => existing.attr === q.attr)) {
        chosen.push(q);
        blockedAttrs.add(q.attr);
      }
    }
  };

  const activeCount = room.players.filter((p) => p.isConnected).length || 1;
  const falseLimit = Math.max(1, Math.floor(activeCount / 2));
  if (room.currentRound >= 5) pickUseful(candidates);
  pickOne(candidates, true);
  if ((room.roundFalseCardsDealt || 0) < falseLimit) pickOne(candidates, false);
  if (chosen.some((q) => q.answer === false)) room.roundFalseCardsDealt = (room.roundFalseCardsDealt || 0) + 1;
  pickOne(candidates, true);
  fillFrom(candidates);

  if (chosen.length < 2) {
    const fallback = shuffle(fallbackQuestionPool(room))
      .sort((a, b) => questionScore(b, room, usedAttrs) - questionScore(a, room, usedAttrs));
    if (room.currentRound >= 5 && !chosen.some((q) => isUsefulQuestion(q, room))) pickUseful(fallback);
    if (!chosen.some((q) => q.answer !== false)) pickOne(fallback, true);
    if (!chosen.some((q) => q.answer === false) && (room.roundFalseCardsDealt || 0) < falseLimit) pickOne(fallback, false);
    pickOne(fallback, true);
    fillFrom(fallback);
  }

  if (chosen.length < 2) {
    const fallback = shuffle(fallbackQuestionPool(room))
      .sort((a, b) => questionScore(b, room, usedAttrs) - questionScore(a, room, usedAttrs));
    if (room.currentRound >= 5 && !chosen.some((q) => isUsefulQuestion(q, room))) pickUseful(fallback);
    pickOne(fallback, true);
    fillFrom(fallback);
  }

  player.cards = chosen.slice(0, 2).map((q) => {
    usedAttrs.add(q.attr);
    if (!room.roundCardAttrs) room.roundCardAttrs = [];
    if (!room.roundCardAttrs.includes(q.attr)) room.roundCardAttrs.push(q.attr);
    if (!room.usedCardAttrs) room.usedCardAttrs = [];
    if (!room.usedCardAttrs.includes(q.attr)) room.usedCardAttrs.push(q.attr);
    if (!player.seenCardAttrs) player.seenCardAttrs = [];
    if (!player.seenCardAttrs.includes(q.attr)) player.seenCardAttrs.push(q.attr);
    return {
      id: uid("c_"),
      attr: q.attr,
      topic: q.topic || topicForQuestionAttr(q.attr),
      question: q.text,
      answer: q.answer !== false,
      resultText: q.answer === false ? q.noText : q.yesText,
      useful: isUsefulQuestion(q, room),
      weight: q.weight || 0
    };
  });
  player.selectedCardId = null;
  player.guess = null;
  player.skipped = false;
}

function ensurePlayerCards(room, player) {
  if (room.phase !== "select" || !room.secretItem || player.cards.length >= 2) return;
  const usedAttrs = new Set(room.roundCardAttrs || []);
  for (const other of room.players) {
    if (other.id === player.id) continue;
    for (const card of other.cards) usedAttrs.add(card.attr);
  }
  generateCards(room, player, usedAttrs);
}

function startGame(room) {
  if (!room.secretItem) room.secretItem = pickSecretItem(room);
  if (room.aiStatus === "error") prepareAiQuestionBank(room, true, 1);
  if (!hasAiRound(room, 1)) {
    prepareAiQuestionBank(room, false, 1);
    room.status = "playing";
    room.phase = "loading";
    room.currentRound = 0;
    room.phaseEndsAt = null;
    clearRoomTimer(room);
    return;
  }
  beginGame(room);
}

function beginGame(room) {
  if (!hasAiRound(room, 1)) {
    prepareAiQuestionBank(room, false, 1);
    return;
  }
  room.status = "playing";
  room.phase = "select";
  room.currentRound = 1;
  room.gameSeq += 1;
  room.revealedClues = [];
  room.lastReveal = [];
  room.lastResults = [];
  room.roundCardAttrs = [];
  room.usedCardAttrs = [];
  room.roundFalseCardsDealt = 0;
  for (const player of room.players) {
    player.score = 0;
    player.wantsRematch = false;
    player.seenCardAttrs = [];
  }
  room.speeches = [];
  prepareAiQuestionBank(room, false, 1);
  dealRound(room);
}

function dealRound(room) {
  if (!hasAiRound(room, room.currentRound)) {
    prepareAiQuestionBank(room, false, room.currentRound);
    room.phase = "loading";
    room.phaseEndsAt = null;
    clearRoomTimer(room);
    return;
  }
  room.phase = "select";
  room.lastReveal = [];
  room.lastResults = [];
  room.roundCardAttrs = [];
  room.roundFalseCardsDealt = 0;
  const usedAttrs = new Set();
  for (const player of room.players) {
    generateCards(room, player, usedAttrs);
  }
  const activePlayers = room.players.filter((player) => player.isConnected);
  if (activePlayers.some((player) => player.cards.length < 2)) {
    for (const player of room.players) {
      player.cards = [];
      player.selectedCardId = null;
    }
    room.roundCardAttrs = [];
    room.roundFalseCardsDealt = 0;
    room.phase = "loading";
    room.phaseEndsAt = null;
    clearRoomTimer(room);
    prepareAiQuestionBank(room, true, room.currentRound);
    return;
  }
  prepareAiQuestionBank(room, false, room.currentRound);
  pushSpeeches(room, "roundStart", room.players, `round:${room.currentRound}`);
  setPhaseTimer(room, SELECT_SECONDS, finishSelection);
}

function finishSelection(room) {
  if (room.phase !== "select") return;
  const reveal = [];
  for (const player of room.players) {
    if (!player.isConnected) continue;
    if (!player.selectedCardId && player.cards.length) {
      const randomCard = player.cards[Math.floor(Math.random() * player.cards.length)];
      player.selectedCardId = randomCard.id;
      pushSpeeches(room, "autoSelect", [player], randomCard.attr);
    }
    const card = player.cards.find((c) => c.id === player.selectedCardId);
    if (!card) continue;
    const clue = {
      round: room.currentRound,
      playerId: player.id,
      playerName: player.name,
      question: card.question,
      answer: card.answer,
      attr: card.attr,
      topic: card.topic,
      resultText: card.resultText,
      useful: Boolean(card.useful),
      weight: card.weight || 0
    };
    reveal.push(clue);
  }
  addHelpfulCluesIfNeeded(room, reveal);
  room.lastReveal = reveal;
  room.revealedClues.push(...reveal);
  const yesPlayers = reveal.filter((clue) => clue.answer).map((clue) => getPlayer(room, clue.playerId)).filter(Boolean);
  const noPlayers = reveal.filter((clue) => !clue.answer).map((clue) => getPlayer(room, clue.playerId)).filter(Boolean);
  if (yesPlayers.length) pushSpeeches(room, "revealYes", yesPlayers, `round:${room.currentRound}`);
  if (noPlayers.length) pushSpeeches(room, "revealNo", noPlayers, `round:${room.currentRound}`);
  room.phase = "reveal";
  setPhaseTimer(room, Math.max(3, reveal.length + 2), startGuessPhase);
}

function startGuessPhase(room) {
  if (room.phase !== "reveal") return;
  room.phase = "guess";
  for (const player of room.players) {
    player.guess = null;
    player.skipped = false;
  }
  setPhaseTimer(room, GUESS_SECONDS, finishGuessPhase);
}

function normalizeGuess(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[，。！？!?、,.~`'"“”‘’\s-]/g, "");
}

function editDistance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[a.length][b.length];
}

function judgeGuess(item, guess) {
  const normalized = normalizeGuess(guess);
  if (!normalized) return { correct: false, close: false };
  const aliases = item.aliases.map(normalizeGuess);
  if (aliases.includes(normalized)) return { correct: true, close: false };
  const close = aliases.some((alias) => {
    if (alias.length <= 1 || normalized.length <= 1) return false;
    if (alias.includes(normalized) || normalized.includes(alias)) return true;
    return Math.max(alias.length, normalized.length) >= 3 && editDistance(alias, normalized) <= 1;
  });
  return { correct: false, close };
}

function finishGuessPhase(room) {
  if (room.phase !== "guess") return;
  const results = [];
  const winners = [];
  for (const player of room.players) {
    if (!player.isConnected) continue;
    if (!player.guess && !player.skipped) player.skipped = true;
    const judged = player.skipped ? { correct: false, close: false } : judgeGuess(room.secretItem, player.guess);
    const result = {
      playerId: player.id,
      playerName: player.name,
      guess: player.skipped ? "" : player.guess,
      skipped: player.skipped,
      correct: judged.correct,
      close: judged.close
    };
    results.push(result);
    if (judged.correct) winners.push(player);
  }
  room.lastResults = results;

  if (winners.length) {
    for (const player of room.players) player.score += winners.includes(player) ? 100 : 10;
    pushSpeeches(room, "correct", winners, "correct");
    pushSpeeches(room, "gameOver", room.players, "winner");
    room.phase = "gameOver";
    room.status = "finished";
    clearRoomTimer(room);
    room.phaseEndsAt = null;
    return;
  }

  if (room.currentRound >= room.maxRounds) {
    for (const player of room.players) player.score += 10;
    pushSpeeches(room, "gameOver", room.players, "timeout");
    room.phase = "gameOver";
    room.status = "finished";
    clearRoomTimer(room);
    room.phaseEndsAt = null;
    return;
  }

  prepareAiQuestionBank(room, false, room.currentRound + 1);
  room.phase = "roundResult";
  const closePlayers = results.filter((result) => result.close).map((result) => getPlayer(room, result.playerId)).filter(Boolean);
  const wrongPlayers = results.filter((result) => !result.close && !result.skipped).map((result) => getPlayer(room, result.playerId)).filter(Boolean);
  const skippedPlayers = results.filter((result) => result.skipped).map((result) => getPlayer(room, result.playerId)).filter(Boolean);
  if (closePlayers.length) pushSpeeches(room, "close", closePlayers, "close");
  else if (wrongPlayers.length) pushSpeeches(room, "wrong", wrongPlayers, "wrong");
  if (skippedPlayers.length) pushSpeeches(room, "skip", skippedPlayers, "skip");
  pushSpeeches(room, "noWinner", room.players, "noWinner");
  setPhaseTimer(room, RESULT_SECONDS, nextRound);
}

function nextRound(room) {
  if (room.phase !== "roundResult") return;
  room.currentRound += 1;
  dealRound(room);
}

function buildRankings(room) {
  const resultMap = new Map(room.lastResults.map((r) => [r.playerId, r]));
  return [...room.players]
    .map((player) => ({
      id: player.id,
      name: player.name,
      avatar: avatarById(player.avatarId),
      score: player.score,
      guessed: resultMap.get(player.id)?.correct || false
    }))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, "zh-Hans-CN"));
}

async function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 100000) req.destroy();
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function getRoom(id) {
  return rooms.get(String(id || ""));
}

function getPlayer(room, playerId) {
  return room.players.find((player) => player.id === playerId);
}

function sendStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const requested = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const filePath = path.normalize(path.join(PUBLIC_DIR, requested));
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  const ext = path.extname(filePath).toLowerCase();
  const type = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".svg": "image/svg+xml; charset=utf-8"
  }[ext] || "application/octet-stream";

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": type, "Cache-Control": "no-store" });
    res.end(data);
  });
}

async function handleApi(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const parts = url.pathname.split("/").filter(Boolean);

  try {
    if (req.method === "POST" && url.pathname === "/api/rooms") {
      const body = await readBody(req);
      const { room, player } = createRoom(body.name, body.avatarId);
      return json(res, 200, { roomId: room.id, playerId: player.id, room: publicRoom(room, player.id) });
    }

    if (parts[0] === "api" && parts[1] === "rooms" && parts[2]) {
      const room = getRoom(parts[2]);
      if (!room) return json(res, 404, { error: "房间不存在" });
      const action = parts[3];

      if (req.method === "POST" && action === "join") {
        if (room.status !== "waiting") return json(res, 400, { error: "游戏已开始" });
        refreshConnections(room);
        const activeCount = room.players.filter((p) => p.isConnected).length;
        if (activeCount >= normalizePlayerLimit(room.playerLimit)) return json(res, 400, { error: "房间已满" });
        const body = await readBody(req);
        const player = createPlayer(body.name, false, body.avatarId);
        room.players.push(player);
        pushSpeeches(room, "join", [player], "join");
        return json(res, 200, { roomId: room.id, playerId: player.id, room: publicRoom(room, player.id) });
      }

      if (req.method === "GET" && parts.length === 3) {
        const playerId = url.searchParams.get("playerId");
        const player = getPlayer(room, playerId);
        if (player) player.lastSeen = Date.now();
        return json(res, 200, { room: publicRoom(room, playerId) });
      }

      const body = await readBody(req);
      const player = getPlayer(room, body.playerId);
      if (!player) return json(res, 403, { error: "玩家身份无效" });
      player.lastSeen = Date.now();

      if (req.method === "POST" && action === "ready") {
        if (room.status !== "waiting") return json(res, 400, { error: "游戏已开始" });
        player.isReady = !player.isReady;
        if (player.isReady) pushSpeeches(room, "ready", [player], "ready");
        return json(res, 200, { room: publicRoom(room, player.id) });
      }

      if (req.method === "POST" && action === "difficulty") {
        if (player.id !== room.hostId) return json(res, 403, { error: "只有房主可以修改难度" });
        if (room.status !== "waiting") return json(res, 400, { error: "游戏已开始" });
        const difficulty = normalizeDifficulty(body.difficulty);
        room.difficulty = difficulty;
        room.maxRounds = roundsForDifficulty(difficulty);
        prepareAiQuestionBank(room, true, 1);
        return json(res, 200, { room: publicRoom(room, player.id) });
      }

      if (req.method === "POST" && action === "playerLimit") {
        if (player.id !== room.hostId) return json(res, 403, { error: "只有房主可以修改人数" });
        if (room.status !== "waiting") return json(res, 400, { error: "游戏已开始" });
        const limit = normalizePlayerLimit(body.playerLimit);
        refreshConnections(room);
        const activeCount = room.players.filter((p) => p.isConnected).length;
        if (activeCount > limit) return json(res, 400, { error: "当前玩家已超过该人数" });
        room.playerLimit = limit;
        prepareAiQuestionBank(room, true, 1);
        return json(res, 200, { room: publicRoom(room, player.id) });
      }

      if (req.method === "POST" && action === "start") {
        if (player.id !== room.hostId) return json(res, 403, { error: "只有房主可以开始游戏" });
        if (room.status !== "waiting") return json(res, 400, { error: "游戏已开始" });
        refreshConnections(room);
        const active = room.players.filter((p) => p.isConnected);
        if (active.length !== normalizePlayerLimit(room.playerLimit)) {
          return json(res, 400, { error: `需要 ${normalizePlayerLimit(room.playerLimit)} 人才能开始` });
        }
        if (!active.every((p) => p.isReady || p.id === room.hostId)) {
          return json(res, 400, { error: "还有玩家未准备" });
        }
        startGame(room);
        return json(res, 200, { room: publicRoom(room, player.id) });
      }

      if (req.method === "POST" && action === "select") {
        if (room.phase !== "select") return json(res, 400, { error: "当前不能选择问题卡" });
        const card = player.cards.find((c) => c.id === body.cardId);
        if (!card) return json(res, 400, { error: "问题卡无效" });
        player.selectedCardId = card.id;
        pushSpeeches(room, "select", [player], card.attr);
        const active = room.players.filter((p) => p.isConnected);
        if (active.length && active.every((p) => p.selectedCardId)) finishSelection(room);
        return json(res, 200, { room: publicRoom(room, player.id) });
      }

      if (req.method === "POST" && action === "guess") {
        if (room.phase !== "guess") return json(res, 400, { error: "当前不能提交猜测" });
        player.guess = String(body.guess || "").trim().slice(0, 24);
        player.skipped = Boolean(body.skip) || !player.guess;
        pushSpeeches(room, player.skipped ? "skip" : "guess", [player], player.guess);
        const active = room.players.filter((p) => p.isConnected);
        if (active.length && active.every((p) => p.guess || p.skipped)) finishGuessPhase(room);
        return json(res, 200, { room: publicRoom(room, player.id) });
      }

      if (req.method === "POST" && action === "rematch") {
        if (room.phase !== "gameOver") return json(res, 400, { error: "游戏尚未结束" });
        clearRoomTimer(room);
        room.status = "waiting";
        room.phase = "waiting";
        room.currentRound = 0;
        room.maxRounds = roundsForDifficulty(room.difficulty);
        room.secretItem = pickSecretItem(room);
        room.aiQuestionBank = {};
        room.aiRoundSizes = {};
        room.aiGeneratingRounds = [];
        room.aiStatus = "idle";
        room.aiError = "";
        room.revealedClues = [];
        room.lastReveal = [];
        room.lastResults = [];
        room.speeches = [];
        room.roundCardAttrs = [];
        room.usedCardAttrs = [];
        room.roundFalseCardsDealt = 0;
        room.phaseEndsAt = null;
        for (const p of room.players) {
          p.isReady = p.id === room.hostId;
          p.cards = [];
          p.seenCardAttrs = [];
          p.selectedCardId = null;
          p.guess = null;
          p.skipped = false;
          p.wantsRematch = false;
        }
        prepareAiQuestionBank(room, true, 1);
        pushSpeeches(room, "rematch", [player], "rematch");
        return json(res, 200, { room: publicRoom(room, player.id) });
      }
    }

    return json(res, 404, { error: "接口不存在" });
  } catch (error) {
    return json(res, 500, { error: error.message || "服务器错误" });
  }
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith("/api/")) {
    handleApi(req, res);
    return;
  }
  sendStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`AI猜物派对 running at http://localhost:${PORT}`);
});
