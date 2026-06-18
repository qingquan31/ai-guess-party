(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.AnswerBank = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const defaults = {
    alive: false,
    plant: false,
    animal: false,
    mammal: false,
    pet: false,
    wild: false,
    canFly: false,
    aquatic: false,
    freshwaterRelated: false,
    saltwaterRelated: false,
    fishRelated: false,
    crustaceanRelated: false,
    shellfishRelated: false,
    molluskRelated: false,
    amphibianRelated: false,
    reptileRelated: false,
    marineMammalRelated: false,
    hasLegs: false,
    fourLegs: false,
    biggerThanBread: true,
    biggerThanPerson: false,
    foundInChina: true,
    manMade: true,
    food: false,
    electronic: false,
    vehicle: false,
    canHold: true,
    usedDaily: false,
    inKitchen: false,
    madeOfMetal: false,
    hasWheels: false,
    round: false,
    makesSound: false,
    gray: false,
    blackWhite: false,
    red: false,
    yellow: false,
    cold: false,
    usefulInRain: false,
    musical: false,
    sports: false,
    madeOfWood: false,
    natural: false,
    hasTail: false,
    countryRelated: false,
    nationalSymbol: false,
    flagRelated: false,
    mapRelated: false,
    passportRelated: false,
    currencyRelated: false,
    callingCodeRelated: false,
    domainRelated: false,
    nationalTeamRelated: false,
    stampRelated: false,
    documentRelated: false,
    provinceRelated: false,
    licensePlateRelated: false,
    cityRelated: false,
    transitLine: false,
    stationRelated: false,
    transportCard: false,
    chemicalElement: false,
    playingCard: false,
    cardGameRelated: false,
    blackSuit: false,
    redSuit: false,
    faceCard: false,
    aceCard: false,
    numberCard: false,
    zodiacRelated: false,
    constellationRelated: false,
    planetRelated: false,
    modelRelated: false,
    publicPlace: false,
    mapCategory: false,
    naturalCategory: false,
    historicalPerson: false,
    lifeItem: false,
    creativeWork: false,
    personRelated: false,
    chineseFigure: false,
    foreignFigure: false,
    politicalFigure: false,
    writerFigure: false,
    scientistFigure: false,
    artistFigure: false,
    literatureWork: false,
    filmWork: false,
    tvWork: false,
    animationWork: false,
    asiaRelated: false,
    europeRelated: false,
    africaRelated: false,
    northAmericaRelated: false,
    southAmericaRelated: false,
    oceaniaRelated: false
  };

  const concreteGroups = [
    {
      emoji: "🐾",
      attrs: { alive: true, animal: true, mammal: true, wild: true, manMade: false, natural: true, hasLegs: true, fourLegs: true, food: false, canHold: false, hasTail: true, makesSound: true },
      names: ["狮子", "老虎", "豹子", "猎豹", "狼", "狐狸", "熊", "北极熊", "棕熊", "考拉", "袋鼠", "长颈鹿", "斑马", "犀牛", "河马", "羚羊", "梅花鹿", "骆驼", "羊驼", "松鼠", "刺猬", "水獭", "海豹", "海狮", "海象", "鲸鱼", "蓝鲸", "抹香鲸", "海豚", "蝙蝠", "猴子", "猩猩", "大猩猩", "黑猩猩", "浣熊", "树懒", "黄鼠狼", "鼹鼠", "豪猪", "野猪", "水牛", "牦牛", "马", "牛", "羊", "猪", "驴", "猫", "狗", "兔子", "仓鼠", "豚鼠", "老鼠", "大象", "熊猫", "小熊猫", "哈士奇", "金毛犬", "暹罗猫"]
    },
    {
      emoji: "🐦",
      attrs: { alive: true, animal: true, wild: true, manMade: false, natural: true, hasLegs: true, canFly: true, food: false, canHold: true, hasTail: true, makesSound: true },
      names: ["麻雀", "燕子", "鸽子", "喜鹊", "乌鸦", "孔雀", "鹦鹉", "猫头鹰", "老鹰", "海鸥", "天鹅", "鸭子", "鹅", "鸡", "火鸡", "鸵鸟", "企鹅", "丹顶鹤", "白鹭", "蜂鸟", "啄木鸟", "鹈鹕", "鸳鸯", "鹌鹑"]
    },
    {
      emoji: "🐟",
      attrs: { alive: true, animal: true, wild: true, aquatic: true, manMade: false, natural: true, hasLegs: false, fourLegs: false, biggerThanPerson: false, food: false, canHold: true, hasTail: true },
      names: ["金鱼", "鲤鱼", "草鱼", "鲫鱼", "鲈鱼", "鳕鱼", "三文鱼", "金枪鱼", "带鱼", "鲨鱼", "鳗鱼", "泥鳅", "章鱼", "鱿鱼", "墨鱼", "海星", "海马", "水母", "螃蟹", "龙虾", "河虾", "扇贝", "牡蛎", "海胆", "珊瑚", "乌龟", "鳄鱼", "青蛙", "蟾蜍", "蝌蚪"]
    },
    {
      emoji: "🍽️",
      attrs: { food: true, manMade: true, natural: false, foundInChina: true, canHold: true, usedDaily: true, inKitchen: true, biggerThanBread: false },
      names: ["米饭", "面条", "馒头", "包子", "饺子", "馄饨", "烧麦", "油条", "粥", "汤圆", "年糕", "粽子", "月饼", "蛋糕", "饼干", "面包", "三明治", "披萨", "汉堡", "薯条", "寿司", "拉面", "咖喱饭", "炒饭", "炒面", "煎饼", "烤鸭", "火锅", "麻辣烫", "烧烤", "牛排", "鸡排", "炸鸡", "鸡蛋", "鸭蛋", "牛奶", "酸奶", "奶酪", "豆腐", "豆浆", "火腿", "香肠", "培根", "巧克力", "冰淇淋", "布丁", "果冻", "蜂蜜", "白糖", "盐", "酱油", "醋", "辣椒酱", "番茄酱"]
    },
    {
      emoji: "🍎",
      attrs: { food: true, plant: true, manMade: false, natural: true, foundInChina: true, canHold: true, usedDaily: true, inKitchen: true, biggerThanBread: false },
      names: ["苹果", "香蕉", "橙子", "橘子", "柚子", "柠檬", "葡萄", "草莓", "蓝莓", "西瓜", "哈密瓜", "菠萝", "芒果", "椰子", "桃子", "梨", "李子", "杏", "樱桃", "荔枝", "龙眼", "榴莲", "山竹", "火龙果", "猕猴桃", "石榴", "柿子", "枣", "玉米", "土豆", "红薯", "胡萝卜", "白萝卜", "白菜", "菠菜", "生菜", "西兰花", "花菜", "黄瓜", "番茄", "茄子", "南瓜", "冬瓜", "洋葱", "大蒜", "蘑菇", "香菇", "木耳", "海带", "莲藕", "竹笋", "豌豆", "花生", "核桃", "板栗", "杏仁"]
    },
    {
      emoji: "🏠",
      attrs: { manMade: true, usedDaily: true, foundInChina: true, natural: false, canHold: true },
      names: ["杯子", "碗", "盘子", "筷子", "勺子", "叉子", "菜刀", "剪刀", "锅", "炒锅", "电饭锅", "水壶", "茶壶", "保温杯", "瓶子", "玻璃杯", "牙刷", "牙膏", "毛巾", "浴巾", "肥皂", "洗发水", "沐浴露", "梳子", "镜子", "雨伞", "钥匙", "钱包", "书包", "行李箱", "枕头", "被子", "床单", "拖鞋", "衣架", "纸巾", "垃圾桶", "扫帚", "拖把", "抹布", "水桶", "窗帘", "地毯", "花瓶", "相框", "蜡烛", "打火机", "手电筒", "胶带", "尺子", "铅笔", "钢笔", "圆珠笔", "橡皮", "笔记本", "文件夹", "订书机", "回形针", "信封", "台灯", "闹钟", "日历", "挂钟", "门锁", "螺丝刀", "锤子", "钳子", "扳手"]
    },
    {
      emoji: "💡",
      attrs: { manMade: true, electronic: true, foundInChina: true, natural: false, canHold: true, usedDaily: true },
      names: ["手机", "电脑", "平板电脑", "笔记本电脑", "显示器", "键盘", "鼠标", "耳机", "音箱", "麦克风", "摄像头", "相机", "打印机", "扫描仪", "路由器", "充电器", "充电宝", "数据线", "遥控器", "电视", "投影仪", "游戏机", "手表", "智能手表", "计算器", "收音机", "吹风机", "剃须刀", "电动牙刷", "电池", "电灯", "灯泡", "插座", "排插", "无人机", "机器人", "电子秤", "体温计", "血压计", "门铃", "空气净化器", "加湿器", "吸尘器", "扫地机器人"]
    },
    {
      emoji: "🚗",
      attrs: { manMade: true, vehicle: true, foundInChina: true, natural: false, canHold: false, biggerThanBread: true, biggerThanPerson: true, hasWheels: true, madeOfMetal: true },
      names: ["自行车", "电动车", "摩托车", "汽车", "出租车", "公交车", "校车", "货车", "卡车", "救护车", "消防车", "警车", "地铁", "火车", "高铁", "动车", "轮船", "游艇", "帆船", "潜水艇", "飞机", "直升机", "热气球", "滑板车", "滑板", "轮椅", "婴儿车", "拖拉机", "挖掘机", "叉车", "吊车", "坦克"]
    },
    {
      emoji: "🌿",
      attrs: { alive: true, plant: true, manMade: false, natural: true, foundInChina: true, canHold: false, biggerThanBread: true },
      names: ["向日葵", "玫瑰", "百合", "荷花", "菊花", "梅花", "兰花", "牡丹", "康乃馨", "郁金香", "樱花", "桃花", "桂花", "茉莉", "薰衣草", "仙人掌", "芦荟", "绿萝", "吊兰", "竹子", "松树", "柏树", "柳树", "梧桐树", "银杏树", "枫树", "椰子树", "榕树", "水稻", "小麦", "棉花", "茶树", "葡萄藤", "爬山虎", "苔藓"]
    },
    {
      emoji: "🎵",
      attrs: { manMade: true, musical: true, foundInChina: true, natural: false, canHold: true, biggerThanBread: true, makesSound: true },
      names: ["吉他", "钢琴", "小提琴", "大提琴", "二胡", "古筝", "琵琶", "笛子", "口琴", "萨克斯", "小号", "长号", "架子鼓", "手鼓", "铃鼓", "木琴", "竖琴", "电子琴", "尤克里里", "葫芦丝", "唢呐"]
    },
    {
      emoji: "⚽",
      attrs: { manMade: true, sports: true, foundInChina: true, natural: false, canHold: true, round: true },
      names: ["足球", "篮球", "排球", "乒乓球", "羽毛球", "网球", "棒球", "高尔夫球", "保龄球", "台球", "橄榄球", "曲棍球", "冰球", "跳绳", "哑铃", "杠铃", "瑜伽垫", "滑雪板", "冲浪板", "球拍", "拳击手套", "泳镜", "泳帽", "跑步机"]
    }
  ];

  const countries = [
    "中国", "美国", "英国", "法国", "德国", "意大利", "西班牙", "葡萄牙", "荷兰", "比利时", "瑞士", "奥地利", "瑞典", "挪威", "芬兰", "丹麦", "冰岛", "爱尔兰", "波兰", "捷克", "斯洛伐克", "匈牙利", "罗马尼亚", "保加利亚", "希腊", "土耳其", "俄罗斯", "乌克兰", "白俄罗斯", "立陶宛", "拉脱维亚", "爱沙尼亚", "塞尔维亚", "克罗地亚", "斯洛文尼亚", "波黑", "黑山", "北马其顿", "阿尔巴尼亚", "摩尔多瓦", "日本", "韩国", "朝鲜", "蒙古", "越南", "老挝", "柬埔寨", "泰国", "缅甸", "马来西亚", "新加坡", "印度尼西亚", "菲律宾", "文莱", "东帝汶", "印度", "巴基斯坦", "孟加拉国", "尼泊尔", "不丹", "斯里兰卡", "马尔代夫", "哈萨克斯坦", "乌兹别克斯坦", "吉尔吉斯斯坦", "塔吉克斯坦", "土库曼斯坦", "阿富汗", "伊朗", "伊拉克", "叙利亚", "黎巴嫩", "约旦", "以色列", "沙特阿拉伯", "阿联酋", "卡塔尔", "科威特", "巴林", "阿曼", "也门", "埃及", "利比亚", "突尼斯", "阿尔及利亚", "摩洛哥", "苏丹", "南苏丹", "埃塞俄比亚", "肯尼亚", "坦桑尼亚", "乌干达", "卢旺达", "布隆迪", "刚果金", "刚果共和国", "加蓬", "喀麦隆", "尼日利亚", "加纳", "科特迪瓦", "塞内加尔", "马里", "尼日尔", "乍得", "索马里", "南非", "纳米比亚", "博茨瓦纳", "津巴布韦", "赞比亚", "莫桑比克", "马达加斯加", "毛里求斯", "加拿大", "墨西哥", "古巴", "牙买加", "巴拿马", "哥斯达黎加", "危地马拉", "洪都拉斯", "尼加拉瓜", "萨尔瓦多", "巴西", "阿根廷", "智利", "秘鲁", "哥伦比亚", "委内瑞拉", "厄瓜多尔", "玻利维亚", "巴拉圭", "乌拉圭", "澳大利亚", "新西兰", "巴布亚新几内亚", "斐济", "萨摩亚", "汤加"
  ];

  const provinces = ["北京市", "天津市", "上海市", "重庆市", "河北省", "山西省", "辽宁省", "吉林省", "黑龙江省", "江苏省", "浙江省", "安徽省", "福建省", "江西省", "山东省", "河南省", "湖北省", "湖南省", "广东省", "海南省", "四川省", "贵州省", "云南省", "陕西省", "甘肃省", "青海省", "台湾省", "内蒙古自治区", "广西壮族自治区", "西藏自治区", "宁夏回族自治区", "新疆维吾尔自治区", "香港特别行政区", "澳门特别行政区"];
  const cities = ["北京", "上海", "广州", "深圳", "杭州", "南京", "苏州", "成都", "重庆", "武汉", "西安", "天津", "青岛", "宁波", "厦门", "福州", "长沙", "郑州", "济南", "合肥", "南昌", "昆明", "贵阳", "南宁", "海口", "兰州", "银川", "西宁", "乌鲁木齐", "呼和浩特", "沈阳", "大连", "长春", "哈尔滨", "石家庄", "太原", "唐山", "洛阳", "无锡", "常州", "温州", "泉州", "佛山", "东莞", "珠海", "中山", "惠州", "南通", "扬州", "徐州"];

  const elements = ["氢", "氦", "锂", "铍", "硼", "碳", "氮", "氧", "氟", "氖", "钠", "镁", "铝", "硅", "磷", "硫", "氯", "氩", "钾", "钙", "钪", "钛", "钒", "铬", "锰", "铁", "钴", "镍", "铜", "锌", "镓", "锗", "砷", "硒", "溴", "氪", "铷", "锶", "钇", "锆", "铌", "钼", "锝", "钌", "铑", "钯", "银", "镉", "铟", "锡", "锑", "碲", "碘", "氙", "铯", "钡", "镧", "铈", "镨", "钕", "钷", "钐", "铕", "钆", "铽", "镝", "钬", "铒", "铥", "镱", "镥", "铪", "钽", "钨", "铼", "锇", "铱", "铂", "金", "汞", "铊", "铅", "铋", "钋", "砹", "氡", "钫", "镭", "锕", "钍", "镤", "铀", "镎", "钚", "镅", "锔", "锫", "锎", "锿", "镄", "钔", "锘", "铹", "𬬻", "𬭊", "𬭳", "𬭛", "𬭶", "鿏", "𫟼", "𬬭", "鿔", "鉨", "镆", "鉝", "石田", "气奥"];
  const suits = ["黑桃", "红桃", "梅花", "方块"];
  const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const zodiacs = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
  const constellations = ["白羊座", "金牛座", "双子座", "巨蟹座", "狮子座", "处女座", "天秤座", "天蝎座", "射手座", "摩羯座", "水瓶座", "双鱼座"];
  const planets = ["水星", "金星", "地球", "火星", "木星", "土星", "天王星", "海王星"];

  const regionAttrs = [
    ["asiaRelated", ["中国", "日本", "韩国", "朝鲜", "蒙古", "越南", "老挝", "柬埔寨", "泰国", "缅甸", "马来西亚", "新加坡", "印度尼西亚", "菲律宾", "文莱", "东帝汶", "印度", "巴基斯坦", "孟加拉国", "尼泊尔", "不丹", "斯里兰卡", "马尔代夫", "哈萨克斯坦", "乌兹别克斯坦", "吉尔吉斯斯坦", "塔吉克斯坦", "土库曼斯坦", "阿富汗", "伊朗", "伊拉克", "叙利亚", "黎巴嫩", "约旦", "以色列", "沙特阿拉伯", "阿联酋", "卡塔尔", "科威特", "巴林", "阿曼", "也门"]],
    ["europeRelated", ["英国", "法国", "德国", "意大利", "西班牙", "葡萄牙", "荷兰", "比利时", "瑞士", "奥地利", "瑞典", "挪威", "芬兰", "丹麦", "冰岛", "爱尔兰", "波兰", "捷克", "斯洛伐克", "匈牙利", "罗马尼亚", "保加利亚", "希腊", "土耳其", "俄罗斯", "乌克兰", "白俄罗斯", "立陶宛", "拉脱维亚", "爱沙尼亚", "塞尔维亚", "克罗地亚", "斯洛文尼亚", "波黑", "黑山", "北马其顿", "阿尔巴尼亚", "摩尔多瓦"]],
    ["africaRelated", ["埃及", "利比亚", "突尼斯", "阿尔及利亚", "摩洛哥", "苏丹", "南苏丹", "埃塞俄比亚", "肯尼亚", "坦桑尼亚", "乌干达", "卢旺达", "布隆迪", "刚果金", "刚果共和国", "加蓬", "喀麦隆", "尼日利亚", "加纳", "科特迪瓦", "塞内加尔", "马里", "尼日尔", "乍得", "索马里", "南非", "纳米比亚", "博茨瓦纳", "津巴布韦", "赞比亚", "莫桑比克", "马达加斯加", "毛里求斯"]],
    ["northAmericaRelated", ["美国", "加拿大", "墨西哥", "古巴", "牙买加", "巴拿马", "哥斯达黎加", "危地马拉", "洪都拉斯", "尼加拉瓜", "萨尔瓦多"]],
    ["southAmericaRelated", ["巴西", "阿根廷", "智利", "秘鲁", "哥伦比亚", "委内瑞拉", "厄瓜多尔", "玻利维亚", "巴拉圭", "乌拉圭"]],
    ["oceaniaRelated", ["澳大利亚", "新西兰", "巴布亚新几内亚", "斐济", "萨摩亚", "汤加"]]
  ];

  function countryRegion(country) {
    const attrs = {};
    for (const [attr, list] of regionAttrs) {
      if (list.includes(country)) attrs[attr] = true;
    }
    return attrs;
  }

  function withDefaults(attrs) {
    return Object.assign({}, defaults, attrs);
  }

  function makeItem(name, emoji, attrs, aliases) {
    const correctedAttrs = applyKnownCorrections(name, attrs);
    return {
      id: "bank_" + encodeURIComponent(name).replace(/%/g, "").toLowerCase(),
      name,
      emoji,
      aliases: Array.from(new Set([name].concat(aliases || []))),
      attrs: withDefaults(correctedAttrs)
    };
  }

  const uncommonAnswerNames = new Set([
    "薛定谔", "海森堡", "玻尔", "费米", "冯诺依曼", "香农", "开普勒", "笛卡尔", "巴斯德", "弗洛伊德",
    "锕", "钍", "镤", "铀", "镎", "钚", "镅", "锔", "锫", "锎", "锿", "镄", "钔", "锘", "铹",
    "喀斯特地貌", "雅丹地貌", "丹霞地貌", "大陆架", "臭氧层", "北极圈", "南极圈", "经线", "纬线",
    "子夜", "彷徨", "城堡", "审判", "追忆似水年华", "尤利西斯", "菜根谭", "围炉夜话", "人间词话"
  ]);

  const uncommonAnswerPattern = /(元素|等高线|等压线|地质|洋流|人口密度|贸易航线|电缆地图|卫星轨道|海底地形|地形图|气候图|植被图|宗教分布|矿产资源|土壤类型|降水量|气温分布|风向玫瑰|地籍图|剖面图|施工图|管线图|航海日志|考古遗址|战役态势|月球背面|深空天体|星图|星座星图|楔形|量子|分子式|神经元)/;

  function isCommonAnswer(name) {
    const value = String(name || "").trim();
    if (!value) return false;
    if (uncommonAnswerNames.has(value)) return false;
    if (uncommonAnswerPattern.test(value)) return false;
    if (/^[\u3400-\u9fff]{1}$/.test(value)) return false;
    return true;
  }

  function applyKnownCorrections(name, attrs) {
    const next = Object.assign({}, attrs);
    const largeAnimals = new Set([
      "狮子", "老虎", "豹子", "猎豹", "熊", "北极熊", "棕熊", "袋鼠", "长颈鹿", "斑马", "犀牛", "河马", "骆驼", "羊驼",
      "海豹", "海狮", "海象", "鲸鱼", "蓝鲸", "抹香鲸", "海豚", "猩猩", "大猩猩", "黑猩猩", "野猪", "水牛", "牦牛",
      "马", "牛", "驴", "大象", "鲨鱼", "鳄鱼", "鸵鸟"
    ]);
    const handHeldAnimals = new Set([
      "松鼠", "刺猬", "蝙蝠", "浣熊", "树懒", "黄鼠狼", "鼹鼠", "仓鼠", "豚鼠", "老鼠", "猫", "狗", "兔子", "小熊猫",
      "麻雀", "燕子", "鸽子", "喜鹊", "乌鸦", "鹦鹉", "金鱼", "泥鳅", "海马", "蝌蚪", "青蛙", "蟾蜍", "河虾"
    ]);
    if (largeAnimals.has(name)) {
      next.biggerThanBread = true;
      next.biggerThanPerson = true;
      next.canHold = false;
    }
    if (handHeldAnimals.has(name)) {
      next.biggerThanPerson = false;
      next.canHold = true;
    }
    if (name === "企鹅" || name === "鸵鸟") {
      next.canFly = false;
    }
    if (name === "鸵鸟") {
      next.biggerThanPerson = true;
      next.canHold = false;
    }
    if (name === "熊猫") {
      next.blackWhite = true;
      next.biggerThanPerson = false;
      next.canHold = false;
    }
    const noObviousTailAnimals = new Set(["熊", "北极熊", "棕熊", "熊猫", "考拉", "猩猩", "大猩猩", "黑猩猩"]);
    if (noObviousTailAnimals.has(name)) next.hasTail = false;
    const freshwaterAnimals = new Set([
      "金鱼", "鲤鱼", "草鱼", "鲫鱼", "鲈鱼", "泥鳅", "河虾", "乌龟", "鳄鱼", "青蛙", "蟾蜍", "蝌蚪", "水獭",
      "天鹅", "鸭子", "鹅", "白鹭", "鸳鸯", "鹈鹕"
    ]);
    const saltwaterAnimals = new Set([
      "鳕鱼", "三文鱼", "金枪鱼", "带鱼", "鲨鱼", "鳗鱼", "章鱼", "鱿鱼", "墨鱼", "海星", "海马", "水母",
      "螃蟹", "龙虾", "扇贝", "牡蛎", "海胆", "珊瑚", "海豹", "海狮", "海象", "鲸鱼", "蓝鲸", "抹香鲸", "海豚", "企鹅"
    ]);
    const fishAnimals = new Set(["金鱼", "鲤鱼", "草鱼", "鲫鱼", "鲈鱼", "鳕鱼", "三文鱼", "金枪鱼", "带鱼", "鲨鱼", "鳗鱼", "海马"]);
    const crustaceanAnimals = new Set(["螃蟹", "龙虾", "河虾"]);
    const shellfishAnimals = new Set(["扇贝", "牡蛎"]);
    const molluskAnimals = new Set(["章鱼", "鱿鱼", "墨鱼"]);
    const amphibianAnimals = new Set(["青蛙", "蟾蜍", "蝌蚪"]);
    const reptileAnimals = new Set(["乌龟", "鳄鱼"]);
    const marineMammals = new Set(["海豹", "海狮", "海象", "鲸鱼", "蓝鲸", "抹香鲸", "海豚"]);
    if (freshwaterAnimals.has(name)) {
      next.aquatic = true;
      next.freshwaterRelated = true;
    }
    if (saltwaterAnimals.has(name)) {
      next.aquatic = true;
      next.saltwaterRelated = true;
    }
    if (fishAnimals.has(name)) next.fishRelated = true;
    if (crustaceanAnimals.has(name)) next.crustaceanRelated = true;
    if (shellfishAnimals.has(name)) next.shellfishRelated = true;
    if (molluskAnimals.has(name)) next.molluskRelated = true;
    if (amphibianAnimals.has(name)) next.amphibianRelated = true;
    if (reptileAnimals.has(name)) next.reptileRelated = true;
    if (marineMammals.has(name)) next.marineMammalRelated = true;
    const leggedAquaticAnimals = new Set(["螃蟹", "龙虾", "河虾", "乌龟", "鳄鱼", "青蛙", "蟾蜍"]);
    const noTailAquaticAnimals = new Set(["章鱼", "鱿鱼", "墨鱼", "海星", "水母", "螃蟹", "龙虾", "河虾", "扇贝", "牡蛎", "海胆", "珊瑚", "青蛙", "蟾蜍"]);
    if (leggedAquaticAnimals.has(name)) next.hasLegs = true;
    if (noTailAquaticAnimals.has(name)) next.hasTail = false;
    return next;
  }

  function buildCategorizedAnswerBank(limit) {
    const target = Math.min(Number(limit) || 1000, 1000);
    const bank = [];
    const seen = new Set();
    const add = (name, emoji, attrs, aliases) => {
      if (!name || seen.has(name) || bank.length >= target) return;
      if (!isCommonAnswer(name)) return;
      seen.add(name);
      bank.push(makeItem(name, emoji, attrs, aliases));
    };
    const addMany = (names, emoji, attrs) => names.forEach((name) => add(name, emoji, attrs));

    const mapDocTypes = ["地图", "护照", "纪念邮票", "地形图", "行政区划图", "旅游地图", "历史地图", "海关申报单"];
    const mapDocEmoji = (name) => name.includes("邮票") ? "📮" : name.includes("护照") ? "📘" : name.includes("票") ? "🎟️" : name.includes("证") || name.includes("卡") ? "💳" : "🗺️";
    const mapDocAttrs = (name, extra) => Object.assign({
      mapCategory: true,
      documentRelated: true,
      mapRelated: /图/.test(name),
      passportRelated: /护照|签证/.test(name),
      stampRelated: /邮票/.test(name),
      manMade: true,
      natural: false,
      canHold: true,
      biggerThanBread: /图/.test(name)
    }, extra || {});
    const addMapDoc = (name, extra, aliases) => add(name, mapDocEmoji(name), mapDocAttrs(name, extra), aliases);

    countries.slice(0, 45).forEach((country, index) => {
      const type = mapDocTypes[index % mapDocTypes.length];
      addMapDoc(country + type, Object.assign({ countryRelated: true }, countryRegion(country)), [country + type.replace("纪念", "")]);
    });
    provinces.slice(0, 25).forEach((province, index) => {
      const type = ["地图", "旅游地图", "地形图", "行政区划图", "纪念邮票"][index % 5];
      addMapDoc(province + type, { provinceRelated: true }, [province + type.replace("纪念", "")]);
    });
    cities.slice(0, 20).forEach((city, index) => {
      const type = ["地铁图", "旅游地图", "公交线路图", "城市导览图"][index % 4];
      addMapDoc(city + type, { cityRelated: true }, [city + type]);
    });

    [
      "世界地图","世界地形图","世界气候图","世界洋流图","世界时区图","世界语言分布图","世界人口密度图","世界铁路地图","世界航线图","世界海底地形图",
      "亚洲地图","欧洲地图","非洲地图","北美洲地图","南美洲地图","大洋洲地图","南极洲地图","太平洋地图","大西洋地图","印度洋地图","北冰洋地图",
      "地中海航海图","加勒比海航海图","喜马拉雅山脉地图","阿尔卑斯山脉地图","安第斯山脉地图","洛基山脉地图","长江流域图","黄河流域图","尼罗河流域图",
      "亚马孙河流域图","多瑙河流域图","丝绸之路地图","大航海时代航线图","罗马帝国疆域图","唐朝疆域图","明朝疆域图","清朝疆域图","三国形势图","春秋战国形势图",
      "世界遗产分布图","国家公园分布图","地震带分布图","火山分布图","矿产资源分布图","农业分布图","海拔分层设色图","等高线地形图","卫星云图","月球正面地图",
      "月球背面地图","火星地形图","太阳系行星轨道图","星座星图","北天星图","南天星图","银河系示意图","深空天体图","地铁换乘图","高速公路地图",
      "铁路运行图","机场航站楼图","校园导览图","博物馆导览图","动物园导览图","植物园导览图","游乐园导览图","商场楼层图","医院楼层图","图书馆平面图",
      "消防疏散图","旅游景区导览图","登山路线图","徒步路线图","骑行路线图","马拉松路线图","航海海图","航空航图","港口平面图","地籍图",
      "房产平面图","建筑施工图","水电管线图","地质剖面图","土壤类型图","降水量分布图","气温分布图","风向玫瑰图","等压线天气图","历史邮票",
      "航空邮票","生肖邮票","奥运纪念邮票","世博纪念邮票","博物馆门票","火车票","登机牌","电影票根","演唱会门票","会议胸卡",
      "学生证","图书借阅证","驾驶证","身份证样张","签证页","入境卡","旅行行程单","酒店房卡","会员卡","明信片",
      "航海日志","考古遗址平面图","古城复原图","战役态势图","世界地质图","世界植被图","世界宗教分布图","世界贸易航线图","世界电缆地图","全球卫星轨道图"
    ].forEach((name) => {
      if (bank.filter((item) => item.attrs.mapCategory).length < 200) addMapDoc(name);
    });

    const natureNames = Array.from(new Set(concreteGroups
      .filter((group) => group.attrs.animal || group.attrs.plant)
      .flatMap((group) => group.names.map((name) => ({ name, emoji: group.emoji, attrs: group.attrs })))));
    for (const entry of natureNames) {
      if (bank.filter((item) => item.attrs.naturalCategory).length >= 200) break;
      add(entry.name, entry.emoji, Object.assign({ naturalCategory: true }, entry.attrs));
    }

    const historicalChinese = [
      "孔子","孟子","老子","庄子","墨子","孙子","屈原","司马迁","张骞","蔡伦","张衡","华佗","曹操","诸葛亮","刘备","关羽","张飞","孙权","司马懿","陶渊明",
      "王羲之","祖冲之","李世民","武则天","玄奘","鉴真","李白","杜甫","王维","白居易","韩愈","柳宗元","颜真卿","苏轼","苏洵","苏辙","王安石","司马光","沈括","李清照",
      "岳飞","朱熹","辛弃疾","陆游","关汉卿","马致远","忽必烈","郑和","朱元璋","朱棣","李时珍","徐霞客","汤显祖","徐光启","郑成功","顾炎武","黄宗羲","曹雪芹","蒲松龄","纪晓岚",
      "林则徐","曾国藩","左宗棠","李鸿章","康有为","梁启超","严复","詹天佑","孙中山","黄兴","蔡元培","鲁迅","胡适","钱玄同","陈独秀","李大钊","徐志摩","闻一多","朱自清","老舍",
      "巴金","茅盾","冰心","郭沫若","梅兰芳","齐白石","徐悲鸿","张大千","陶行知","竺可桢","钱学森","邓稼先","华罗庚","陈景润","袁隆平","屠呦呦","司马相如","班固","班昭","王昭君"
    ];
    const historicalWorld = [
      "苏格拉底","柏拉图","亚里士多德","亚历山大大帝","凯撒","屋大维","克娄巴特拉","汉尼拔","查理曼","贞德","马可波罗","哥伦布","麦哲伦","达芬奇","米开朗基罗","拉斐尔","伽利略","哥白尼","牛顿","莱布尼茨",
      "伏尔泰","卢梭","康德","黑格尔","拿破仑","华盛顿","杰斐逊","林肯","达尔文","马克思","恩格斯","托尔斯泰","陀思妥耶夫斯基","莎士比亚","歌德","雨果","巴尔扎克","狄更斯","安徒生","凡尔纳",
      "贝多芬","莫扎特","巴赫","肖邦","柴可夫斯基","梵高","莫奈","毕加索","罗丹","居里夫人","爱因斯坦","特斯拉","爱迪生","诺贝尔","弗洛伊德","海明威","乔伊斯","卡夫卡","普鲁斯特","泰戈尔",
      "甘地","丘吉尔","罗斯福","曼德拉","马丁路德金","图灵","冯诺依曼","霍金","门捷列夫","巴甫洛夫","法拉第","麦克斯韦","欧拉","高斯","黎曼","笛卡尔","帕斯卡","拉瓦锡","巴斯德","南丁格尔",
      "克伦威尔","伊丽莎白一世","彼得大帝","叶卡捷琳娜二世","俾斯麦","拿破仑三世","西蒙玻利瓦尔","圣马丁","林奈","孟德尔","卢瑟福","玻尔","海森堡","薛定谔","费米","莱特兄弟","阿基米德","欧几里得","希罗多德","修昔底德"
    ];
    historicalChinese.concat(historicalWorld).slice(0, 200).forEach((name, index) => {
      const attrs = {
        historicalPerson: true,
        personRelated: true,
        chineseFigure: index < historicalChinese.length,
        foreignFigure: index >= historicalChinese.length,
        alive: false,
        manMade: false,
        natural: true,
        canHold: false,
        biggerThanBread: true,
        biggerThanPerson: true
      };
      if (/帝|王|武则天|朱元璋|朱棣|忽必烈|拿破仑|华盛顿|林肯|丘吉尔|罗斯福|曼德拉/.test(name)) attrs.politicalFigure = true;
      if (/李白|杜甫|苏轼|鲁迅|莎士比亚|雨果|托尔斯泰|歌德|巴尔扎克|狄更斯|泰戈尔|老舍|巴金|曹雪芹|蒲松龄/.test(name)) attrs.writerFigure = true;
      if (/牛顿|达尔文|爱因斯坦|居里夫人|图灵|霍金|钱学森|邓稼先|华罗庚|袁隆平|屠呦呦|伽利略|哥白尼|门捷列夫|巴甫洛夫|法拉第|麦克斯韦|欧拉|高斯|黎曼|笛卡尔|帕斯卡|拉瓦锡|巴斯德|林奈|孟德尔|卢瑟福|玻尔|海森堡|薛定谔|费米|阿基米德|欧几里得|莱布尼茨/.test(name)) attrs.scientistFigure = true;
      if (/达芬奇|米开朗基罗|拉斐尔|梵高|莫奈|毕加索|齐白石|徐悲鸿|张大千|梅兰芳|贝多芬|莫扎特|巴赫|肖邦/.test(name)) attrs.artistFigure = true;
      add(name, "👤", attrs, []);
    });

    const lifeItems = [
      "杯子","碗","盘子","筷子","勺子","叉子","菜刀","剪刀","锅","炒锅","电饭锅","水壶","茶壶","保温杯","瓶子","玻璃杯","牙刷","牙膏","毛巾","浴巾",
      "肥皂","洗发水","沐浴露","梳子","镜子","雨伞","钥匙","钱包","书包","行李箱","枕头","被子","床单","拖鞋","衣架","纸巾","垃圾桶","扫帚","拖把","抹布",
      "水桶","窗帘","地毯","花瓶","相框","蜡烛","打火机","手电筒","胶带","尺子","铅笔","钢笔","圆珠笔","橡皮","笔记本","文件夹","订书机","回形针","信封","台灯",
      "闹钟","日历","挂钟","门锁","螺丝刀","锤子","钳子","扳手","手机","电脑","平板电脑","笔记本电脑","显示器","键盘","鼠标","耳机","音箱","麦克风","摄像头","相机",
      "打印机","扫描仪","路由器","充电器","充电宝","数据线","遥控器","电视","投影仪","游戏机","手表","智能手表","计算器","收音机","吹风机","剃须刀","电动牙刷","电池","电灯","灯泡",
      "插座","排插","无人机","机器人","电子秤","体温计","血压计","门铃","空气净化器","加湿器","吸尘器","扫地机器人","洗衣机","冰箱","微波炉","烤箱","电磁炉","电热水壶","电风扇","空调",
      "沙发","椅子","桌子","书架","衣柜","鞋柜","床垫","枕套","被套","晾衣架","洗衣液","洗洁精","消毒液","创可贴","口罩","雨衣","手套","围巾","帽子","皮带",
      "眼镜","太阳镜","指甲刀","剃须泡沫","护手霜","水杯盖","饭盒","保鲜盒","保鲜膜","菜板","锅铲","漏勺","擀面杖","削皮刀","开瓶器","红酒杯","咖啡杯","茶杯","便签纸","胶水",
      "美工刀","剪贴板","计算器","订书钉","书签","台历","键盘膜","鼠标垫","硬盘","U盘","耳机盒","手机壳","充电线","插头","转换插座","延长线","工具箱","卷尺","水平仪","手锯",
      "洗脸盆","牙线","棉签","棉柔巾","收纳箱","收纳袋","衣物挂钩","鞋刷","鞋拔","粘毛器","浴室防滑垫","马桶刷","垃圾袋","保温壶","晾衣夹","插线板","无线鼠标","蓝牙音箱","移动硬盘","读卡器","网线","HDMI线","螺丝盒","厨房秤","量杯","调料盒","纸杯","餐垫","门垫","抱枕","灭蚊灯"
    ];
    for (const name of lifeItems) {
      if (bank.filter((item) => item.attrs.lifeItem).length >= 200) break;
      add(name, "🏠", {
        lifeItem: true,
        manMade: true,
        natural: false,
        usedDaily: true,
        canHold: !/冰箱|洗衣机|空调|沙发|桌子|衣柜|书架|床垫/.test(name),
        electronic: /电|手机|电脑|显示器|键盘|鼠标|耳机|音箱|麦克风|摄像头|相机|打印机|扫描仪|路由器|充电|遥控器|电视|投影仪|游戏机|手表|计算器|收音机|风机|电池|灯|插座|排插|无人机|机器人|空气|吸尘|冰箱|微波炉|烤箱|空调|硬盘|U盘/.test(name),
        inKitchen: /碗|盘|筷|勺|叉|刀|锅|壶|杯|饭盒|保鲜|菜板|锅铲|漏勺|擀面杖|开瓶器|微波炉|烤箱|电磁炉|冰箱/.test(name),
        madeOfMetal: /刀|剪|锅|钥匙|钉|锤|钳|扳手|插头|硬盘|U盘|工具|卷尺|水平仪|手锯/.test(name),
        cold: /冰箱|空调|冰袋|冷柜/.test(name),
        usefulInRain: /雨伞|雨衣/.test(name),
        biggerThanBread: !/钥匙|橡皮|回形针|电池|口罩|创可贴|指甲刀|书签|订书钉|插头/.test(name)
      });
    }

    const works = [
      "红楼梦","西游记","三国演义","水浒传","聊斋志异","儒林外史","骆驼祥子","围城","边城","家","春","秋","雷雨","茶馆","呐喊","彷徨","子夜","平凡的世界","白鹿原","活着",
      "许三观卖血记","射雕英雄传","神雕侠侣","天龙八部","鹿鼎记","笑傲江湖","倚天屠龙记","雪山飞狐","七剑下天山","多情剑客无情剑","小王子","哈姆雷特","罗密欧与朱丽叶","麦克白","奥赛罗","李尔王","战争与和平","安娜卡列尼娜","复活","罪与罚",
      "卡拉马佐夫兄弟","悲惨世界","巴黎圣母院","基督山伯爵","三个火枪手","双城记","雾都孤儿","大卫科波菲尔","傲慢与偏见","简爱","呼啸山庄","老人与海","太阳照常升起","百年孤独","霍乱时期的爱情","变形记","城堡","审判","追忆似水年华","尤利西斯",
      "堂吉诃德","神曲","伊利亚特","奥德赛","浮士德","瓦尔登湖","鲁滨逊漂流记","格列佛游记","汤姆索亚历险记","哈克贝利费恩历险记","绿野仙踪","爱丽丝梦游仙境","海底两万里","八十天环游地球","格兰特船长的儿女","福尔摩斯探案集","东方快车谋杀案","无人生还","尼罗河上的惨案","时间简史",
      "霸王别姬","活着电影","大闹天宫","哪吒闹海","大话西游","英雄","卧虎藏龙","让子弹飞","疯狂的石头","流浪地球","你好李焕英","长津湖","无间道","功夫","少林足球","喜剧之王","花样年华","重庆森林","东邪西毒","甜蜜蜜",
      "泰坦尼克号","阿凡达","星球大战","指环王","哈利波特与魔法石","哈利波特与密室","侏罗纪公园","盗梦空间","星际穿越","黑客帝国","教父","肖申克的救赎","阿甘正传","楚门的世界","海上钢琴师","美丽人生","辛德勒的名单","这个杀手不太冷","飞越疯人院","机器人总动员",
      "千与千寻","龙猫","天空之城","幽灵公主","哈尔的移动城堡","你的名字","灌篮高手","名侦探柯南","海贼王","火影忍者","西游记电视剧","红楼梦电视剧","三国演义电视剧","水浒传电视剧","甄嬛传","琅琊榜","武林外传","亮剑","士兵突击","觉醒年代",
      "权力的游戏","老友记","绝命毒师","生活大爆炸","纸牌屋","黑镜","神探夏洛克","唐顿庄园","西部世界","怪奇物语","冰与火之歌","魔戒","霍比特人","纳尼亚传奇","饥饿游戏","暮光之城","达芬奇密码","追风筝的人","偷影子的人","解忧杂货店",
      "三体","球状闪电","流浪地球小说","人世间","繁花","长安十二时辰","庆余年","鬼吹灯","盗墓笔记","明朝那些事儿","万历十五年","围炉夜话","菜根谭","人间词话","史记","资治通鉴","孙子兵法","论语","孟子","道德经",
      "白夜行","嫌疑人X的献身","挪威的森林","雪国","罗生门","我是猫","了不起的盖茨比","麦田里的守望者","杀死一只知更鸟","动物庄园","一九八四","美丽新世界","局外人","鼠疫","生命中不能承受之轻","不能承受的生命之轻","牧羊少年奇幻之旅","少年派的奇幻漂流","云图","沙丘","牡丹亭"
    ];
    for (const name of works) {
      if (bank.filter((item) => item.attrs.creativeWork).length >= 200) break;
      add(name, "🎬", {
        creativeWork: true,
        literatureWork: !/电影|霸王|大闹|哪吒|大话|英雄|卧虎|让子弹|疯狂|流浪|李焕英|长津湖|无间道|功夫|少林|喜剧|花样|重庆|东邪|甜蜜|泰坦尼克|阿凡达|星球|指环|哈利|侏罗纪|盗梦|星际|黑客|教父|肖申克|阿甘|楚门|钢琴师|美丽人生|辛德勒|杀手|飞越|机器人|千与千寻|龙猫|天空|幽灵|哈尔|你的名字|灌篮|柯南|海贼|火影|电视剧|甄嬛|琅琊|武林|亮剑|士兵|觉醒|游戏|老友记|绝命|生活大爆炸|纸牌屋|黑镜|夏洛克|唐顿|西部世界|怪奇物语/.test(name),
        filmWork: /电影|霸王|大闹|哪吒|大话|英雄|卧虎|让子弹|疯狂|流浪|李焕英|长津湖|无间道|功夫|少林|喜剧|花样|重庆|东邪|甜蜜|泰坦尼克|阿凡达|星球|指环|哈利|侏罗纪|盗梦|星际|黑客|教父|肖申克|阿甘|楚门|钢琴师|美丽人生|辛德勒|杀手|飞越|机器人|千与千寻|龙猫|天空|幽灵|哈尔|你的名字/.test(name),
        tvWork: /电视剧|甄嬛|琅琊|武林|亮剑|士兵|觉醒|权力|老友记|绝命|生活大爆炸|纸牌屋|黑镜|夏洛克|唐顿|西部世界|怪奇物语/.test(name),
        animationWork: /大闹|哪吒|千与千寻|龙猫|天空|幽灵|哈尔|你的名字|灌篮|柯南|海贼|火影|机器人/.test(name),
        manMade: true,
        natural: false,
        canHold: false,
        biggerThanBread: true
      });
    }

    return bank.slice(0, target);
  }

  function buildDiverseAnswerBank(limit) {
    const target = Math.min(Number(limit) || 1000, 1000);
    const bank = [];
    const seen = new Set();
    const add = (name, emoji, attrs, aliases) => {
      if (!name || seen.has(name) || bank.length >= target) return;
      if (!isCommonAnswer(name)) return;
      seen.add(name);
      bank.push(makeItem(name, emoji, attrs, aliases));
    };
    const addMany = (names, emoji, attrs) => names.forEach((name) => add(name, emoji, attrs));
    const life = { lifeItem: true, manMade: true, natural: false, usedDaily: true, canHold: true, biggerThanBread: false };
    const bigLife = Object.assign({}, life, { canHold: false, biggerThanBread: true, biggerThanPerson: true });
    const electronic = Object.assign({}, life, { electronic: true });
    const kitchen = Object.assign({}, life, { inKitchen: true });
    const animal = { naturalCategory: true, alive: true, animal: true, natural: true, manMade: false, canHold: false, biggerThanBread: true };
    const plant = { naturalCategory: true, alive: true, plant: true, natural: true, manMade: false, canHold: true, biggerThanBread: false };
    const foodPlant = Object.assign({}, plant, { food: true, usedDaily: true, inKitchen: true });
    const document = { mapCategory: true, documentRelated: true, manMade: true, natural: false, canHold: true, biggerThanBread: false };
    const work = { creativeWork: true, manMade: true, natural: false, canHold: false, biggerThanBread: true };
    const person = { historicalPerson: true, personRelated: true, manMade: false, natural: true, canHold: false, biggerThanBread: true, biggerThanPerson: true };

    const supplementGroups = [];
    const queueSupplement = (names, emoji, attrs) => supplementGroups.push({ names, emoji, attrs });
    const fillSupplements = () => {
      let index = 0;
      let addedAny = true;
      while (bank.length < target && addedAny) {
        addedAny = false;
        for (const group of supplementGroups) {
          if (index >= group.names.length) continue;
          const before = bank.length;
          add(group.names[index], group.emoji, group.attrs, []);
          if (bank.length > before) addedAny = true;
          if (bank.length >= target) break;
        }
        index += 1;
      }
    };

    queueSupplement([
      "牙刷","毛巾","雨伞","钥匙","钱包","书包","行李箱","闹钟","日历","台灯","剪刀","菜刀","筷子","勺子","叉子","碗","盘子","水杯","保温杯","水壶",
      "饭盒","菜板","炒锅","电饭锅","微波炉","烤箱","冰箱","洗衣机","空调","电风扇","吹风机","吸尘器","扫地机器人","空气净化器","加湿器","电热水壶","电磁炉","燃气灶","油烟机","洗碗机",
      "沙发","床垫","枕头","被子","床单","衣柜","书架","餐桌","椅子","窗帘","地毯","垃圾桶","拖把","扫帚","抹布","纸巾","肥皂","洗发水","沐浴露","牙膏",
      "梳子","镜子","口罩","创可贴","体温计","血压计","药箱","眼镜","太阳镜","手表","帽子","围巾","手套","雨衣","运动鞋","皮带","衣架","鞋柜","收纳箱","文件夹",
      "笔记本","钢笔","铅笔","橡皮","尺子","订书机","回形针","胶带","剪贴板","便利贴","信封","印章","白板","黑板擦","计算器","保险柜","门锁","门铃","螺丝刀","扳手",
      "锤子","钳子","卷尺","水平仪","手电筒","打火机","蜡烛","花瓶","相框","台历","挂钟","插座","排插","延长线","转换插头","充电器","充电宝","数据线","硬盘","U盘",
      "读卡器","网线","耳机盒","手机壳","键盘膜","鼠标垫","厨房秤","量杯","调料盒","漏勺","擀面杖","削皮刀","开瓶器","红酒杯","咖啡杯","茶壶","保鲜盒","保鲜膜","垃圾袋","马桶刷"
    ], "🏠", life);

    queueSupplement([
      "手机","电脑","平板电脑","显示器","键盘","鼠标","耳机","音箱","麦克风","摄像头","相机","打印机","扫描仪","路由器","电视","投影仪","游戏机","智能手表","收音机","电池",
      "电灯","灯泡","无人机","机器人","电子秤","移动硬盘","蓝牙音箱","遥控器","剃须刀","电动牙刷","门禁卡","二维码","充电桩","服务器","显微镜","望远镜","指南针","电子琴","录音笔","对讲机"
    ], "💡", electronic);

    queueSupplement([
      "自行车","电动车","摩托车","汽车","公交车","出租车","卡车","救护车","消防车","警车","地铁","火车","高铁","轮船","帆船","潜水艇","飞机","直升机","热气球","滑板",
      "轮椅","婴儿车","拖拉机","挖掘机","叉车","吊车","坦克","火箭","降落伞","电梯","扶梯","缆车","索道","无人驾驶汽车","共享单车","校车","洒水车","垃圾车","房车","雪橇"
    ], "🚗", Object.assign({}, bigLife, { vehicle: true, hasWheels: true, madeOfMetal: true }));

    queueSupplement([
      "狮子","老虎","大象","长颈鹿","斑马","犀牛","河马","骆驼","袋鼠","考拉","熊猫","棕熊","北极熊","狼","狐狸","猫","狗","兔子","松鼠","刺猬",
      "猴子","猩猩","树懒","蝙蝠","海豚","鲸鱼","海豹","鲨鱼","金鱼","章鱼","乌龟","鳄鱼","青蛙","蛇","蜥蜴","企鹅","鸵鸟","孔雀","鹦鹉","老鹰",
      "麻雀","燕子","鸽子","天鹅","鸭子","公鸡","蜜蜂","蝴蝶","蚂蚁","蜻蜓","螃蟹","龙虾","河虾","扇贝","牡蛎","海星","水母","蜗牛","蚯蚓","蚕"
    ], "🦁", animal);

    queueSupplement([
      "苹果","香蕉","橙子","柠檬","葡萄","草莓","蓝莓","西瓜","菠萝","芒果","桃子","梨","樱桃","荔枝","火龙果","猕猴桃","石榴","柿子","椰子","哈密瓜",
      "土豆","红薯","胡萝卜","白萝卜","白菜","菠菜","生菜","西兰花","黄瓜","番茄","茄子","南瓜","洋葱","大蒜","蘑菇","海带","玉米","水稻","小麦","花生",
      "黄豆","绿豆","竹子","松树","柳树","银杏树","枫树","荷花","玫瑰","郁金香","牡丹","菊花","梅花","兰花","向日葵","仙人掌","芦荟","绿萝","茶树","棉花"
    ], "🍎", foodPlant);

    queueSupplement([
      "米饭","面条","馒头","包子","饺子","粽子","月饼","蛋糕","饼干","面包","披萨","汉堡","寿司","拉面","火锅","烤鸭","牛排","炸鸡","鸡蛋","牛奶",
      "酸奶","奶酪","豆腐","豆浆","香肠","巧克力","冰淇淋","蜂蜜","白糖","食盐","酱油","醋","辣椒酱","番茄酱","咖啡","茶叶","可乐","矿泉水","啤酒","红酒"
    ], "🍜", { naturalCategory: true, food: true, manMade: true, natural: false, canHold: true, usedDaily: true, inKitchen: true, biggerThanBread: false });

    queueSupplement([
      "太阳","月亮","地球","火星","木星","土星","彗星","银河系","黑洞","北斗七星","彩虹","闪电","台风","雪花","沙漠","火山","冰川","瀑布","温泉","珊瑚礁",
      "森林","草原","湿地","河流","湖泊","海洋","山峰","峡谷","洞穴","岛屿","珍珠","钻石","黄金","煤炭","石油","天然气","岩石","泥土","化石","陨石"
    ], "🌍", { naturalCategory: true, natural: true, manMade: false, canHold: false, biggerThanBread: true, biggerThanPerson: true });

    queueSupplement([
      "地图","护照","邮票","身份证","驾驶证","学生证","银行卡","会员卡","车票","登机牌","电影票根","门票","发票","收据","合同","菜单","说明书","报纸","杂志","明信片",
      "信件","结婚证","毕业证","病历本","处方单","快递单","购物清单","日程表","课程表","海报","传单","名片","户口本","签证","借书证","停车券","优惠券","保修卡","成绩单","邀请函",
      "地图册","字典","词典","百科全书","菜谱","乐谱","相册","漫画书","小说","课本","练习册","档案袋","标签","二维码名片","公交卡","地铁卡","船票","演唱会门票","会议胸卡","酒店房卡"
    ], "📄", document);
    add("地图", "🗺️", Object.assign({}, document, { mapRelated: true, biggerThanBread: true }), ["普通地图"]);
    add("护照", "📘", Object.assign({}, document, { passportRelated: true }), []);
    add("邮票", "📮", Object.assign({}, document, { stampRelated: true }), []);

    queueSupplement([
      "医院","学校","图书馆","博物馆","电影院","超市","菜市场","银行","邮局","机场","火车站","公交站","地铁站","公园","动物园","植物园","游乐园","商场","酒店","餐厅",
      "咖啡馆","体育馆","游泳馆","健身房","工厂","农场","实验室","法院","派出所","消防站","加油站","停车场","小区","办公室","教室","厨房","卧室","卫生间","阳台","电梯间",
      "操场","广场","桥梁","隧道","码头","港口","寺庙","教堂","清真寺","古城","长城","金字塔","埃菲尔铁塔","故宫","兵马俑","自由女神像","悉尼歌剧院","泰姬陵","珠穆朗玛峰","亚马孙雨林"
    ], "🏙️", Object.assign({}, document, { mapCategory: false, publicPlace: true, canHold: false, biggerThanBread: true, biggerThanPerson: true }));

    queueSupplement([
      "孔子","孟子","老子","庄子","屈原","司马迁","秦始皇","汉武帝","诸葛亮","李白","杜甫","白居易","苏轼","李清照","岳飞","郑和","曹雪芹","鲁迅","冰心","齐白石",
      "徐悲鸿","钱学森","邓稼先","袁隆平","屠呦呦","牛顿","达尔文","爱因斯坦","居里夫人","霍金","伽利略","哥白尼","特斯拉","诺贝尔","莎士比亚","雨果","托尔斯泰","贝多芬","莫扎特","梵高",
      "达芬奇","毕加索","拿破仑","华盛顿","林肯","丘吉尔","马克思","甘地","曼德拉","苏格拉底","柏拉图","亚里士多德","哥伦布","麦哲伦","薛定谔","海森堡","玻尔","费米","图灵","冯诺依曼"
    ], "👤", person);

    addMany([
      "红楼梦","西游记","三国演义","水浒传","聊斋志异","儒林外史","围城","边城","骆驼祥子","活着","平凡的世界","三体","流浪地球","小王子","哈利波特","指环王","福尔摩斯探案集","鲁滨逊漂流记","海底两万里","八十天环游地球",
      "老人与海","百年孤独","战争与和平","安娜卡列尼娜","傲慢与偏见","简爱","呼啸山庄","悲惨世界","巴黎圣母院","基督山伯爵","双城记","雾都孤儿","格列佛游记","时间简史","物种起源","论语","道德经","孙子兵法","史记","资治通鉴",
      "泰坦尼克号","阿凡达","星球大战","黑客帝国","盗梦空间","星际穿越","教父","肖申克的救赎","辛德勒的名单","美丽人生","楚门的世界","海上钢琴师","千与千寻","龙猫","天空之城","你的名字","灌篮高手","名侦探柯南","海贼王","火影忍者",
      "西游记电视剧","红楼梦电视剧","三国演义电视剧","水浒传电视剧","甄嬛传","琅琊榜","武林外传","亮剑","士兵突击","觉醒年代","老友记","绝命毒师","纸牌屋","黑镜","神探夏洛克","权力的游戏","冰与火之歌","纳尼亚传奇","饥饿游戏","暮光之城"
    ], "🎬", Object.assign({}, work, { literatureWork: true }));

    addMany([
      "足球","篮球","排球","乒乓球","羽毛球","网球","棒球","台球","保龄球","高尔夫球","跳绳","哑铃","杠铃","瑜伽垫","滑雪板","冲浪板","泳镜","泳帽","拳击手套","跑步机",
      "吉他","钢琴","小提琴","大提琴","二胡","古筝","琵琶","笛子","口琴","萨克斯","小号","架子鼓","手鼓","铃鼓","木琴","尤克里里","唢呐","葫芦丝","编钟","竖琴"
    ], "⚽", Object.assign({}, life, { sports: true, musical: true, biggerThanBread: true }));

    addMany([
      "微信","搜索引擎","电子邮件","网盘","直播间","短视频","外卖平台","导航软件","共享单车","网购订单","密码锁","人脸识别","语音助手","云计算","人工智能","虚拟现实","二维码支付","视频会议","在线课堂","电子书",
      "天气预报","新闻联播","春晚","奥运会","世界杯","高考","毕业典礼","婚礼","生日蛋糕","年夜饭","红包","快递","地震预警","交通信号灯","斑马线","垃圾分类","体检","疫苗","保险","存折"
    ], "💬", Object.assign({}, life, { electronic: true, canHold: false, biggerThanBread: true }));

    addMany([
      "理发店","药店","书店","花店","面包店","洗衣店","照相馆","诊所","幼儿园","养老院","档案馆","美术馆","科技馆","天文馆","水族馆","滑冰场","篮球场","露营地","服务区","收费站",
      "货架","收银台","试衣间","更衣柜","储物柜","快递柜","自动售货机","自助收银机","取号机","叫号屏","安检门","闸机","电梯按钮","扶手电梯","消防栓","灭火器","安全帽","反光背心","救生圈","急救包",
      "帐篷","睡袋","登山杖","望远镜","指南针","烧烤架","吊床","野餐垫","行车记录仪","儿童安全座椅","婴儿推车","购物车","购物篮","菜篮子","行李牌","护膝","护腕","泳圈","鱼竿","羽毛球拍",
      "哑铃架","瑜伽垫","跳绳计数器","足球鞋","头盔","滑板车","轮滑鞋","宠物笼","猫砂盆","狗绳"
    ], "🏷️", Object.assign({}, life, { usedDaily: true, canHold: false, biggerThanBread: true }));

    addMany([
      "护照夹","钥匙扣","零钱包","卡包","工牌","胸牌","票夹","文件柜","碎纸机","订书机","打孔器","长尾夹","白板笔","马克笔","荧光笔","印泥","便签纸","标签纸","快递袋","气泡膜",
      "封箱器","纸箱","泡沫箱","冰格","围裙","隔热手套","锅盖","蒸笼","漏斗","茶漏","磨刀器","压蒜器","削皮器","打蛋器","量勺","擀面杖","烘焙纸","锡纸","垃圾夹","除尘掸",
      "洗衣篮","脏衣篓","晒衣绳","粘钩","门吸","窗纱","百叶窗","蚊帐","暖手宝","热水袋","冰袋","暖宝宝","眼罩","耳塞","旅行枕","行李绑带","鞋拔","鞋套","雨靴","防晒帽",
      "遮阳伞","口红","唇膏","防晒霜","洗面奶","卸妆棉","棉签","指甲油","剃须泡沫","发卡","发圈","卷发棒","直发夹","香水","体重秤","血糖仪","听诊器","轮椅","拐杖","助听器"
    ], "🧰", Object.assign({}, life, { usedDaily: true, canHold: true, biggerThanBread: false }));

    addMany([
      "共享充电宝","智能门锁","电子发票","健康码","乘车码","付款码","外卖骑手","网约车","充电桩","电子签名","在线挂号","电子病历","远程会议","云盘备份","智能家居","扫脸支付","语音输入","手机热点","蓝牙耳机","无线充电",
      "直播带货","弹幕","表情包","短链接","验证码","账号密码","手机定位","浏览器标签页","社交账号","视频会员","游戏手柄","电子竞技","在线翻译","地图导航","网课回放","电子课本","智能客服","自动驾驶","共享雨伞","无人货架",
      "无人超市","刷卡进门","扫码点餐","自助取票","停车缴费","预约挂号","快递驿站","电子保单","电子合同","网银转账"
    ], "📱", Object.assign({}, life, { electronic: true, canHold: false, biggerThanBread: true }));

    addMany([
      "北极光","日食","月食","流星雨","海市蜃楼","雾霾","露水","霜冻","冰雹","龙卷风","季风","潮汐","海浪","海啸","地震","泥石流","雪崩","沙尘暴","干旱","洪水",
      "梯田","绿洲","峡湾","沼泽","珊瑚礁","火山口","溶洞","石林","丹霞地貌","雅丹地貌","喀斯特地貌","热带雨林","针叶林","红树林","高原","盆地","丘陵","平原","海沟","大陆架",
      "臭氧层","大气层","赤道","北极圈","南极圈","经线","纬线","季节","昼夜","时差"
    ], "🌍", { naturalCategory: true, natural: true, manMade: false, canHold: false, biggerThanBread: true, biggerThanPerson: true });

    addMany([
      "变色龙","树懒","水豚","浣熊","狐猴","穿山甲","食蚁兽","貂","雪豹","美洲豹","鸵鸟","火烈鸟","鹈鹕","啄木鸟","蜂鸟","孔雀","白鹭","海鸥","乌鸦","麻雀",
      "壁虎","蜥蜴","蟒蛇","眼镜蛇","河豚","水獭","海胆","海葵","寄居蟹","萤火虫","螳螂","蝉","蟋蟀","瓢虫","蜻蜓","蚊子","苍蝇","蚯蚓","蜘蛛","蜈蚣"
    ], "🦎", animal);

    addMany([
      "多肉植物","含羞草","捕蝇草","水仙","风信子","薄荷","罗勒","迷迭香","芦荟","仙人球","仙人掌","文竹","发财树","橡皮树","龟背竹","绿萝","吊兰","虎皮兰","凤梨","芒果树",
      "柠檬树","橄榄树","咖啡树","可可树","橡树","白桦树","椰子树","棕榈树","芭蕉","苔藓","蕨类植物","莲藕","芋头","山药","姜","辣椒","韭菜","香菜","葱","花椒"
    ], "🌱", plant);

    addMany([
      "豆浆","油条","烧饼","煎饼果子","热干面","螺蛳粉","酸辣粉","重庆小面","过桥米线","肠粉","虾饺","烧卖","粽子","汤圆","糖葫芦","烤红薯","爆米花","薯片","瓜子","果冻",
      "布丁","奶茶","柠檬茶","绿豆汤","酸梅汤","豆腐脑","凉皮","肉夹馍","羊肉串","烤鱼","寿喜锅","咖喱饭","汉堡","炸薯条","披萨","意大利面","玉米片","燕麦片","沙拉","三文治",
      "芥末","花生酱","芝麻酱","蚝油","料酒","淀粉","面粉","酵母","泡打粉","奶油"
    ], "🍜", { naturalCategory: true, food: true, manMade: true, natural: false, canHold: true, usedDaily: true, inKitchen: true, biggerThanBread: false });

    addMany([
      "鲁迅","巴金","老舍","沈从文","钱钟书","杨绛","张爱玲","丰子恺","梁思成","林徽因","竺可桢","茅以升","袁隆平","屠呦呦","钱三强","钱伟长","邓稼先","王选","陈景润","华罗庚",
      "哥白尼","开普勒","笛卡尔","巴斯德","弗洛伊德","图灵","冯诺依曼","香农","居里夫人","富兰克林","达芬奇","米开朗基罗","梵高","莫奈","毕加索","贝多芬","莫扎特","柴可夫斯基","肖邦","卓别林"
    ], "👤", person);

    addMany([
      "骆驼祥子","茶馆","雷雨","四世同堂","边城","围城","呐喊","彷徨","子夜","家","春","秋","繁星春水","白鹿原","尘埃落定","许三观卖血记","黄金时代","解忧杂货店","嫌疑人X的献身","白夜行",
      "小王子","动物农场","一九八四","杀死一只知更鸟","飘","呼啸山庄","简爱","傲慢与偏见","雾都孤儿","双城记","巴黎圣母院","悲惨世界","基督山伯爵","茶花女","钢铁是怎样炼成的","变形记","局外人","追风筝的人","达芬奇密码","纳尼亚传奇",
      "阿甘正传","盗梦空间","机器人总动员","疯狂动物城","寻梦环游记","冰雪奇缘","狮子王","功夫熊猫","泰坦尼克号","楚门的世界","霸王别姬","活着电影","大话西游","让子弹飞","无间道","寄生虫","摔跤吧爸爸","千与千寻","幽灵公主","名侦探柯南"
    ], "🎬", work);

    addMany([
      "算盘","沙漏","怀表","罗盘","放大镜","显微镜","温度计","量角器","地球仪","黑板","粉笔","讲台","课桌","校服","奖杯","奖牌","锦旗","印章盒","存钱罐","相册",
      "结婚戒指","相框摆台","生日蜡烛","许愿瓶","风铃","门牌号","楼梯扶手","路灯","公交站牌","路障","减速带","停车牌","井盖","消防通道","安全出口","应急灯","烟雾报警器","监控摄像头","门禁闸机","排队栏杆"
    ], "💡", Object.assign({}, life, { canHold: true, biggerThanBread: true }));

    fillSupplements();

    if (bank.length < target) {
      throw new Error(`Diverse answer bank only has ${bank.length} real answers; add more entries instead of placeholders.`);
    }
    return bank.slice(0, target);
  }

  function buildAnswerBank(limit) {
    return buildDiverseAnswerBank(limit);
    const seen = new Set();
    const bank = [];

    function add(name, emoji, attrs, aliases) {
      if (!name || seen.has(name) || bank.length >= limit) return;
      seen.add(name);
      bank.push(makeItem(name, emoji, attrs, aliases));
    }

    for (const group of concreteGroups) {
      for (const name of group.names) add(name, group.emoji, group.attrs);
    }

    countries.forEach((country, index) => {
      const region = countryRegion(country);
      add(country + "国旗", "🚩", Object.assign({ countryRelated: true, nationalSymbol: true, flagRelated: true, symbolic: true, manMade: true, canHold: true, biggerThanBread: false, natural: false }, region), [country + "旗"]);
      if (index % 5 === 0) add(country + "地图", "🗺️", Object.assign({ countryRelated: true, mapRelated: true, documentRelated: true, manMade: true, canHold: true, biggerThanBread: true, natural: false }, region), [country + "版图"]);
      if (index % 5 === 1) add(country + "护照", "📘", Object.assign({ countryRelated: true, passportRelated: true, documentRelated: true, manMade: true, canHold: true, biggerThanBread: false, natural: false }, region), [country + "护照本"]);
      if (index % 5 === 2) add(country + "货币", "💵", Object.assign({ countryRelated: true, currencyRelated: true, documentRelated: true, manMade: true, canHold: true, biggerThanBread: false, natural: false }, region), [country + "钱币"]);
      if (index % 5 === 3) add(country + "顶级域名", "🌐", Object.assign({ countryRelated: true, domainRelated: true, documentRelated: true, electronic: true, manMade: true, canHold: false, biggerThanBread: false, natural: false }, region), [country + "国家域名"]);
      if (index % 5 === 4) add(country + "国际电话区号", "☎️", Object.assign({ countryRelated: true, callingCodeRelated: true, documentRelated: true, manMade: true, canHold: false, biggerThanBread: false, natural: false }, region), [country + "电话代码"]);
      if (index % 3 === 0) add(country + "国家队球衣", "👕", Object.assign({ countryRelated: true, nationalTeamRelated: true, sports: true, manMade: true, canHold: true, biggerThanBread: true, natural: false }, region), [country + "队球衣"]);
      if (index % 3 === 1) add(country + "纪念邮票", "📮", Object.assign({ countryRelated: true, stampRelated: true, documentRelated: true, manMade: true, canHold: true, biggerThanBread: false, natural: false }, region), [country + "邮票"]);
    });

    for (const province of provinces) {
      add(province + "地图", "🗺️", { provinceRelated: true, mapRelated: true, documentRelated: true, manMade: true, canHold: true, biggerThanBread: true, natural: false }, [province.replace(/省|市|自治区|特别行政区|壮族|回族|维吾尔/g, "") + "地图"]);
      add(province + "车牌", "🔖", { provinceRelated: true, licensePlateRelated: true, vehicle: true, manMade: true, canHold: true, biggerThanBread: true, natural: false, madeOfMetal: true }, [province + "机动车号牌"]);
    }

    for (const city of cities) {
      add(city + "地铁1号线", "🚇", { cityRelated: true, transitLine: true, vehicle: true, manMade: true, electronic: true, canHold: false, biggerThanBread: true, biggerThanPerson: true, hasWheels: true, madeOfMetal: true, natural: false }, [city + "一号线"]);
      add(city + "火车站", "🚉", { cityRelated: true, stationRelated: true, publicPlace: true, manMade: true, vehicle: false, canHold: false, biggerThanBread: true, biggerThanPerson: true, madeOfMetal: true, natural: false }, [city + "站"]);
      add(city + "公交卡", "💳", { cityRelated: true, transportCard: true, transitLine: false, manMade: true, canHold: true, biggerThanBread: false, electronic: true, vehicle: false, natural: false }, [city + "交通卡"]);
    }

    for (const element of elements) {
      add(element + "元素", "⚛️", { chemicalElement: true, manMade: false, natural: true, canHold: false, food: false, electronic: false, vehicle: false }, [element]);
    }

    for (const suit of suits) {
      for (const rank of ranks) {
        add(suit + rank, "🃏", {
          playingCard: true,
          cardGameRelated: true,
          blackSuit: suit === "黑桃" || suit === "梅花",
          redSuit: suit === "红桃" || suit === "方块",
          faceCard: rank === "J" || rank === "Q" || rank === "K",
          aceCard: rank === "A",
          numberCard: !["A", "J", "Q", "K"].includes(rank),
          manMade: true,
          canHold: true,
          biggerThanBread: false,
          natural: false
        }, [suit + rank + "扑克牌"]);
      }
    }
    add("大王", "🃏", { playingCard: true, cardGameRelated: true, manMade: true, canHold: true, biggerThanBread: false, natural: false }, ["大 Joker", "大鬼"]);
    add("小王", "🃏", { playingCard: true, cardGameRelated: true, manMade: true, canHold: true, biggerThanBread: false, natural: false }, ["小 Joker", "小鬼"]);

    for (const zodiac of zodiacs) {
      add(zodiac + "年邮票", "📮", { zodiacRelated: true, documentRelated: true, manMade: true, canHold: true, biggerThanBread: false, natural: false }, [zodiac + "生肖邮票"]);
    }
    for (const constellation of constellations) {
      add(constellation + "星图", "🌌", { constellationRelated: true, mapRelated: true, documentRelated: true, manMade: true, canHold: true, biggerThanBread: true, natural: false }, [constellation + "图"]);
    }
    for (const planet of planets) {
      add(planet, "🪐", { planetRelated: true, manMade: false, natural: true, canHold: false, biggerThanBread: true, biggerThanPerson: true }, []);
      add(planet + "模型", "🪐", { planetRelated: true, modelRelated: true, manMade: true, natural: false, canHold: true, biggerThanBread: false, round: true }, [planet + "仪"]);
    }

    return bank.slice(0, limit);
  }

  return { buildAnswerBank };
});
