(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.AvatarData = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const AVATARS = [
    { id: "chatter", emoji: "🗣️", name: "碎嘴", trait: "话多碎嘴", unlockGames: 0, cost: 0 },
    { id: "sharp", emoji: "😏", name: "毒舌", trait: "犀利吐槽", unlockGames: 5, cost: 1 },
    { id: "joker", emoji: "🤣", name: "搞笑", trait: "插科打诨", unlockGames: 10, cost: 2 },
    { id: "sweet", emoji: "🎀", name: "萌妹", trait: "甜软撒娇", unlockGames: 15, cost: 3 },
    { id: "straight", emoji: "🧱", name: "直男", trait: "朴素直接", unlockGames: 20, cost: 4 },
    { id: "detective", emoji: "🕵️", name: "侦探", trait: "冷静推理", unlockGames: 25, cost: 5 },
    { id: "boss", emoji: "💼", name: "霸总", trait: "强势控场", unlockGames: 30, cost: 6 },
    { id: "zen", emoji: "🧘", name: "佛系", trait: "淡定随缘", unlockGames: 35, cost: 7 },
    { id: "scholar", emoji: "📚", name: "学霸", trait: "认真分析", unlockGames: 40, cost: 8 },
    { id: "eater", emoji: "🍜", name: "吃货", trait: "万物皆可吃", unlockGames: 45, cost: 9 }
  ];

  const SCENARIOS = {
    join: "加入房间",
    ready: "准备开局",
    roundStart: "新一轮发牌",
    select: "选择问题卡",
    autoSelect: "超时自动选卡",
    revealYes: "公开肯定回答",
    revealNo: "公开否定回答",
    guess: "提交猜测",
    skip: "跳过猜测",
    close: "猜得接近",
    wrong: "猜错",
    correct: "猜中",
    noWinner: "无人猜中",
    gameOver: "结算",
    rematch: "再来一局"
  };

  const style = {
    chatter: {
      open: ["我先说两句", "听我唠一下", "不是我话多", "我插一句", "我憋不住了"],
      mid: ["这个节奏有点意思", "信息量开始堆起来了", "这波线索得盘一盘", "我脑子已经开会了", "大家别漏细节"],
      tail: ["继续看。", "我还能再说十句。", "先记上。", "别急，后面还有戏。", "我负责热场。"]
    },
    sharp: {
      open: ["讲真", "别装看不见", "这题有点会折磨人", "我先毒奶一句", "冷静点"],
      mid: ["这线索再错就离谱了", "有人已经开始乱猜了", "这个判断还算有用", "别被表象骗了", "脑子比手快一点"],
      tail: ["别翻车。", "差不多得了。", "记住，别乱带节奏。", "希望不是白给。", "我看着呢。"]
    },
    joker: {
      open: ["笑死", "各位观众", "我宣布", "这波节目效果来了", "先别急着笑"],
      mid: ["线索像在跳广场舞", "答案在跟我们捉迷藏", "我的脑洞已经超速", "这局有喜剧味", "猜错也要错得响亮"],
      tail: ["包袱先放这。", "掌声给到线索。", "别把我笑醒。", "下一位喜剧人。", "我先乐为敬。"]
    },
    sweet: {
      open: ["嘿嘿", "我小声说", "感觉有点可爱", "拜托拜托", "让我猜猜看"],
      mid: ["这个线索好像有点帮忙", "大家慢慢来别急呀", "我觉得方向更清楚了", "这张卡还挺温柔", "脑袋瓜在转了"],
      tail: ["冲鸭。", "加油呀。", "我先收藏这个线索。", "不要凶它。", "感觉快啦。"]
    },
    straight: {
      open: ["我直说", "简单看", "按事实来", "别绕", "我不整虚的"],
      mid: ["这个信息能用", "方向变窄了", "先排除一批", "猜不出就继续问", "有用就记下来"],
      tail: ["就这样。", "下一步。", "别想太复杂。", "够明确。", "继续。"]
    },
    detective: {
      open: ["记录一下", "从证据看", "我注意到", "推理开始", "线索链更新"],
      mid: ["范围正在收束", "这个回答可以排除干扰项", "它和前面的线索能拼上", "优先保留高概率方向", "暂时不下结论"],
      tail: ["证据有效。", "继续追问。", "嫌疑范围缩小。", "别破坏推理链。", "下一条很关键。"]
    },
    boss: {
      open: ["我来定调", "这局听我的", "效率一点", "别浪费回合", "现在重点是"],
      mid: ["这条线索必须拿下", "方向已经出来了", "不要低质量猜测", "把无效选项清掉", "节奏交给我"],
      tail: ["执行。", "下一轮继续压缩。", "别掉链子。", "我要结果。", "保持推进。"]
    },
    zen: {
      open: ["随缘看", "不急", "慢慢来", "心态放平", "我觉得吧"],
      mid: ["线索自会出现", "错也没关系", "范围自然会缩小", "这一问有它的缘分", "答案迟早浮出来"],
      tail: ["善。", "先这样。", "随它去。", "慢慢猜。", "稳住。"]
    },
    scholar: {
      open: ["从分类看", "理性分析", "我整理一下", "按逻辑说", "这条信息的价值在于"],
      mid: ["它提升了区分度", "可以减少候选集合", "和已知条件兼容", "属于有效特征", "需要结合前序线索"],
      tail: ["结论暂存。", "建议继续细分。", "这是有用变量。", "逻辑成立。", "先不要跳推。"]
    },
    eater: {
      open: ["先问能不能吃", "我饿着脑子在猜", "这线索有味道", "让我尝一口思路", "饭点式分析"],
      mid: ["范围像菜单一样变短了", "这个回答挺下饭", "猜错也不耽误开吃", "我闻到答案边缘了", "这局像盲盒套餐"],
      tail: ["先记账。", "等会加餐。", "别糊锅。", "味儿对了。", "继续上菜。"]
    }
  };

  const scenarioLines = {
    join: ["新人进桌了", "房间热闹起来了", "阵容补齐一点了", "有人带着脑子来了", "座位又少一个了"],
    ready: ["准备状态更新", "开局气氛到位", "有人已经坐稳了", "别让房主等太久", "差不多可以开猜了"],
    roundStart: ["新一轮问题卡来了", "这一轮要缩小范围", "别浪费这次机会", "卡面开始发力", "信息战继续"],
    select: ["这张卡被选中了", "选卡方向很关键", "这一问可能有用", "有人出手了", "这选择先记下"],
    autoSelect: ["时间到了系统帮忙选", "犹豫太久就交给命运", "自动选择也算一种风格", "回合不等人", "系统替你拍板"],
    revealYes: ["AI 给了肯定回答", "这条是正向线索", "范围可以往里收", "这个方向被确认了", "有东西能留下"],
    revealNo: ["AI 给了否定回答", "这条可以排除一片", "别再往这个方向撞了", "无效项清掉", "答案边界更清楚了"],
    guess: ["有人提交猜测了", "答案区开始紧张", "这一猜有勇气", "现在看命中率", "猜测已经交卷"],
    skip: ["有人选择跳过", "保守也是策略", "这一轮先不硬猜", "跳过不丢人", "把机会留给下一轮"],
    close: ["猜得很接近", "答案边缘被摸到了", "方向没歪太多", "差一点就开门了", "这个猜法值得参考"],
    wrong: ["这次没命中", "错误答案也能排雷", "方向还得再修", "猜偏了但不亏", "至少排掉一个想法"],
    correct: ["答案被猜中了", "这局有人破案", "命中来了", "终于抓住本体", "这一猜直接收工"],
    noWinner: ["本轮无人命中", "答案还在藏", "继续靠线索推进", "下一轮再收紧", "别急，谜底还没跑"],
    gameOver: ["结算时间到", "本局收尾", "排名出来了", "这一局有点东西", "复盘可以开始"],
    rematch: ["再来一局的气氛有了", "有人不服要续", "下一局继续开动", "牌桌还没散", "复仇局预备"]
  };

  function avatarById(id) {
    return AVATARS.find((avatar) => avatar.id === id) || AVATARS[0];
  }

  function lineCountPerScenario() {
    return 5 * 5 * 5;
  }

  function hashText(text) {
    let hash = 0;
    for (const char of String(text || "")) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
    return hash;
  }

  function pick(list, seed) {
    return list[Math.abs(seed) % list.length];
  }

  function shortLine(text) {
    return Array.from(String(text || "").trim()).slice(0, 15).join("");
  }

  function makeSpeech(avatarId, scenario, seed) {
    const avatar = avatarById(avatarId);
    const tone = style[avatar.id] || style.chatter;
    const lines = scenarioLines[scenario] || scenarioLines.roundStart;
    const n = Number(seed) || hashText(`${avatarId}:${scenario}:${Date.now()}`);
    const parts = [tone.open, lines, tone.mid, tone.tail].filter(Boolean);
    return shortLine(pick(pick(parts, n >> 11), n));
  }

  return { AVATARS, SCENARIOS, avatarById, makeSpeech, lineCountPerScenario };
});
