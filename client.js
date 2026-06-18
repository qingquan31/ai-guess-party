const app = document.querySelector("#app");
const topMeta = document.querySelector("#topMeta");
const toast = document.querySelector("#toast");

const client = {
  roomId: sessionStorage.getItem("roomId") || "",
  playerId: sessionStorage.getItem("playerId") || "",
  room: null,
  tab: "create",
  showShop: false,
  poll: null,
  tick: null,
  speechTimer: null,
  actionInFlight: false,
  pendingGuess: false,
  now: Date.now()
};

const PLAYER_NAME_KEY = "aiGuessParty:lastPlayerName";
const PROFILE_KEY = "aiGuessParty:profile";
const AVATARS = window.AvatarData?.AVATARS || [];
const SPEECH_TTL_MS = 3000;
const SPEECH_MAX_CHARS = 15;

function lastPlayerName() {
  return localStorage.getItem(PLAYER_NAME_KEY) || "";
}

function rememberPlayerName(name) {
  const value = String(name || "").trim().slice(0, 8);
  if (value) localStorage.setItem(PLAYER_NAME_KEY, value);
}

function defaultProfile() {
  return { coins: 0, games: 0, owned: ["chatter"], equipped: "chatter", awardedGames: [] };
}

function loadProfile() {
  try {
    const profile = Object.assign(defaultProfile(), JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}"));
    profile.owned = Array.from(new Set([...(profile.owned || []), "chatter"]));
    profile.awardedGames = Array.isArray(profile.awardedGames) ? profile.awardedGames : [];
    return profile;
  } catch {
    return defaultProfile();
  }
}

function saveProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

function equippedAvatarId() {
  const profile = loadProfile();
  return profile.equipped || "chatter";
}

function avatarById(id) {
  return window.AvatarData?.avatarById?.(id) || AVATARS[0] || { id: "chatter", emoji: "🗣️", name: "碎嘴" };
}

function syncRewards(room) {
  if (!room || room.phase !== "gameOver" || !client.playerId) return;
  const key = `${room.id}:${room.gameSeq || 0}`;
  const profile = loadProfile();
  if (profile.awardedGames.includes(key)) return;
  profile.games += 1;
  const mine = (room.lastResults || []).find((result) => result.playerId === client.playerId);
  if (mine?.correct) {
    profile.coins += 1;
    showToast("猜中答案，获得 1 枚猜物币");
  }
  profile.awardedGames.push(key);
  profile.awardedGames = profile.awardedGames.slice(-50);
  saveProfile(profile);
}

function shortSpeechText(text) {
  return Array.from(String(text || "").trim()).slice(0, SPEECH_MAX_CHARS).join("");
}

function speechAgeMs(line) {
  const at = Number(line?.at || 0);
  if (!at) return 0;
  return Math.min(SPEECH_TTL_MS, Math.max(0, Date.now() - at));
}

function activeSpeeches(room) {
  const now = Date.now();
  return (room?.speeches || []).filter((line) => {
    const at = Number(line.at || 0);
    return at && now - at >= 0 && now - at < SPEECH_TTL_MS;
  });
}

function scheduleSpeechExpiry() {
  if (client.speechTimer) clearTimeout(client.speechTimer);
  client.speechTimer = null;
  const active = activeSpeeches(client.room);
  if (!active.length) return;
  const now = Date.now();
  const nextDelay = Math.min(...active.map((line) => SPEECH_TTL_MS - (now - Number(line.at || 0))));
  client.speechTimer = setTimeout(() => {
    client.speechTimer = null;
    if (!isTypingGuess()) render();
    scheduleSpeechExpiry();
  }, Math.max(80, nextDelay + 40));
}

function setRoom(room) {
  client.room = room;
  syncRewards(room);
  scheduleSpeechExpiry();
}

function setSession(roomId, playerId) {
  client.roomId = roomId;
  client.playerId = playerId;
  sessionStorage.setItem("roomId", roomId);
  sessionStorage.setItem("playerId", playerId);
}

function clearSession() {
  client.roomId = "";
  client.playerId = "";
  client.room = null;
  client.actionInFlight = false;
  client.pendingGuess = false;
  if (client.speechTimer) clearTimeout(client.speechTimer);
  client.speechTimer = null;
  sessionStorage.removeItem("roomId");
  sessionStorage.removeItem("playerId");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    method: options.method || "GET",
    headers: { "Content-Type": "application/json" },
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "请求失败");
  return data;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function playerInitial(name) {
  return escapeHtml(String(name || "玩").slice(0, 1));
}

function renderAvatarBadge(avatar, extraClass = "") {
  const data = avatar || avatarById("chatter");
  return `<div class="avatar ${extraClass}" title="${escapeHtml(data.name)}">${escapeHtml(data.emoji || "🙂")}</div>`;
}

function renderAccountBar() {
  const profile = loadProfile();
  const equipped = avatarById(profile.equipped);
  return `
    <div class="account-bar">
      <div class="account-id">
        ${renderAvatarBadge(equipped, "avatar--large")}
        <div>
          <strong>${escapeHtml(equipped.name)}</strong>
          <div class="small">${escapeHtml(equipped.trait || "")}</div>
        </div>
      </div>
      <div class="account-stats">
        <span class="coin">猜物币 ${profile.coins}</span>
        <span class="coin muted">参与 ${profile.games} 局</span>
      </div>
      <button class="secondary" id="shopToggle">${client.showShop ? "收起兑换店" : "兑换店"}</button>
    </div>
  `;
}

function renderShop() {
  if (!client.showShop) return "";
  const profile = loadProfile();
  return `
    <div class="shop-panel">
      <div class="shop-head">
        <h3 class="section-title">头像兑换店</h3>
        <div class="small">猜中准确答案获得 1 枚猜物币；参加局数用于解锁购买资格。</div>
      </div>
      <div class="avatar-shop">
        ${AVATARS.map((avatar) => {
          const owned = profile.owned.includes(avatar.id);
          const unlocked = profile.games >= avatar.unlockGames;
          const equipped = profile.equipped === avatar.id;
          const canBuy = unlocked && profile.coins >= avatar.cost;
          const action = owned
            ? `<button class="secondary" data-equip-avatar="${avatar.id}" ${equipped ? "disabled" : ""}>${equipped ? "佩戴中" : "佩戴"}</button>`
            : `<button class="primary" data-buy-avatar="${avatar.id}" ${canBuy ? "" : "disabled"}>${unlocked ? `兑换 ${avatar.cost}` : `参与 ${avatar.unlockGames} 局解锁`}</button>`;
          return `
            <div class="avatar-card ${equipped ? "equipped" : ""}">
              <div class="avatar-card__top">
                <div class="avatar avatar--shop">${escapeHtml(avatar.emoji)}</div>
                <div>
                  <strong>${escapeHtml(avatar.name)}</strong>
                  <div class="small">${escapeHtml(avatar.trait)}</div>
                </div>
              </div>
              <div class="avatar-card__meta">价格 ${avatar.cost} · ${unlocked ? "已解锁" : `还需 ${avatar.unlockGames - profile.games} 局`}</div>
              ${action}
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function buyAvatar(id) {
  const profile = loadProfile();
  const avatar = avatarById(id);
  if (profile.owned.includes(avatar.id)) return;
  if (profile.games < avatar.unlockGames) return showToast("参加局数不足，暂未解锁");
  if (profile.coins < avatar.cost) return showToast("猜物币不足");
  profile.coins -= avatar.cost;
  profile.owned.push(avatar.id);
  saveProfile(profile);
  showToast(`已兑换「${avatar.name}」，佩戴后生效`);
  render();
}

function equipAvatar(id) {
  const profile = loadProfile();
  if (!profile.owned.includes(id)) return showToast("需要先兑换头像");
  profile.equipped = id;
  saveProfile(profile);
  showToast("头像已佩戴");
  render();
}

function phaseName(phase) {
  return {
    waiting: "等待中",
    loading: "AI 出题中",
    select: "选卡",
    reveal: "公开线索",
    guess: "猜测",
    roundResult: "回合结果",
    gameOver: "结算"
  }[phase] || phase;
}

function secondsLeft() {
  if (!client.room?.phaseEndsAt) return null;
  return Math.max(0, Math.ceil((client.room.phaseEndsAt - client.now) / 1000));
}

function updateTimerDisplay() {
  const timer = document.querySelector("[data-timer]");
  const time = secondsLeft();
  if (!timer || time === null) return;
  timer.textContent = `${time}s`;
  timer.classList.toggle("hot", time <= 10);
}

function isTypingGuess() {
  return client.room?.phase === "guess" && document.activeElement?.matches?.("#guessForm input[name='guess']");
}

function isUsingPlayerLimitSelect() {
  return client.room?.phase === "waiting" && document.activeElement?.matches?.("#playerLimitSelect");
}

function captureScrollPositions() {
  const clues = document.querySelector(".clues");
  return {
    cluesTop: clues ? clues.scrollTop : null,
    cluesHeight: clues ? clues.scrollHeight : null
  };
}

function restoreScrollPositions(state) {
  if (!state || state.cluesTop === null) return;
  requestAnimationFrame(() => {
    const clues = document.querySelector(".clues");
    if (!clues) return;
    if (state.cluesTop <= 4) {
      clues.scrollTop = 0;
      return;
    }
    const heightDelta = Math.max(0, clues.scrollHeight - Number(state.cluesHeight || 0));
    clues.scrollTop = state.cluesTop + heightDelta;
  });
}

function render() {
  const scrollState = captureScrollPositions();
  client.now = Date.now();
  if (!client.room) {
    topMeta.textContent = "";
    renderHome();
    restoreScrollPositions(scrollState);
    return;
  }
  topMeta.textContent = `房间 ${client.room.id} · ${phaseName(client.room.phase)}`;
  if (client.room.status === "waiting") renderLobby();
  else if (client.room.phase === "gameOver") renderGameOver();
  else renderGame();
  restoreScrollPositions(scrollState);
}

function renderHome() {
  const savedName = escapeHtml(lastPlayerName());
  app.innerHTML = `
    <section class="home">
      <div class="hero">
        <h1>AI猜物派对</h1>
        <p>多人同房间轮流选择问题卡，公开线索后抢先猜出隐藏物品。</p>
        ${renderAccountBar()}
        ${renderShop()}
        <div class="object-cloud" aria-hidden="true">
          <span>?</span><span>AI</span><span>是</span><span>否</span><span>Q</span>
          <span>?</span><span>10</span><span>A</span><span>!</span><span>?</span>
        </div>
        <a class="secondary-link" href="./local.html">单机试玩</a>
      </div>
      <div class="panel entry-panel">
        <div class="tabs">
          <button class="tab ${client.tab === "create" ? "active" : ""}" data-tab="create">创建房间</button>
          <button class="tab ${client.tab === "join" ? "active" : ""}" data-tab="join">加入房间</button>
        </div>
        <form class="form" id="entryForm">
          <label class="field">
            <span>昵称</span>
            <input class="input" name="name" maxlength="8" autocomplete="nickname" placeholder="最多 8 个字" value="${savedName}" required />
          </label>
          ${client.tab === "join" ? `
            <label class="field">
              <span>房间号</span>
              <input class="input" name="roomId" inputmode="numeric" maxlength="6" placeholder="6 位数字" required />
            </label>
          ` : ""}
          <button class="primary" type="submit">${client.tab === "create" ? "🎮 创建房间" : "🔗 加入房间"}</button>
        </form>
      </div>
    </section>
  `;

  app.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      client.tab = button.dataset.tab;
      renderHome();
    });
  });
  app.querySelector("#entryForm").addEventListener("submit", onEntrySubmit);
  app.querySelector("#shopToggle")?.addEventListener("click", () => {
    client.showShop = !client.showShop;
    renderHome();
  });
  app.querySelectorAll("[data-buy-avatar]").forEach((button) => {
    button.addEventListener("click", () => buyAvatar(button.dataset.buyAvatar));
  });
  app.querySelectorAll("[data-equip-avatar]").forEach((button) => {
    button.addEventListener("click", () => equipAvatar(button.dataset.equipAvatar));
  });
}

async function onEntrySubmit(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const name = String(form.get("name") || "").trim();
  try {
    if (client.tab === "create") {
      const data = await api("/api/rooms", { method: "POST", body: { name, avatarId: equippedAvatarId() } });
      rememberPlayerName(name);
      setSession(data.roomId, data.playerId);
      setRoom(data.room);
    } else {
      const roomId = String(form.get("roomId") || "").trim();
      const data = await api(`/api/rooms/${roomId}/join`, { method: "POST", body: { name, avatarId: equippedAvatarId() } });
      rememberPlayerName(name);
      setSession(data.roomId, data.playerId);
      setRoom(data.room);
    }
    startPolling();
    render();
  } catch (error) {
    showToast(error.message);
  }
}

function renderPlayers(players, mode = "ready") {
  return players.map((player) => {
    const state = mode === "select"
      ? (player.selected ? "已选" : "选择中")
      : mode === "guess"
        ? (player.guessed ? "已提交" : "思考中")
        : player.isReady ? "已准备" : "等待中";
    const badgeClass = state === "已准备" || state === "已选" || state === "已提交" ? "ok" : "warn";
    const crown = player.id === client.room.hostId ? " · 房主" : "";
    return `
      <div class="player">
        ${renderAvatarBadge(player.avatar)}
        <div>
          <strong>${escapeHtml(player.name)}</strong>
          <div class="small">${player.isConnected ? "在线" : "离线"}${crown}</div>
        </div>
        <span class="badge ${badgeClass}">${state}</span>
      </div>
    `;
  }).join("");
}

function renderSpeechStrip(room) {
  const speeches = activeSpeeches(room);
  if (!speeches.length) return "";
  const latest = speeches.slice(-1);
  return `
    <div class="speech-strip" aria-label="玩家发言">
      <div class="speech-strip__items">
        ${latest.map((line) => `
        <div class="speech-line" style="animation-delay: -${speechAgeMs(line)}ms">
          ${renderAvatarBadge(line.avatar)}
          <div class="speech-line__body">
            <strong>${escapeHtml(line.playerName)}</strong>
            <div class="speech-bubble">${escapeHtml(shortSpeechText(line.text))}</div>
          </div>
        </div>
      `).join("")}
      </div>
    </div>
  `;
}

function aiStatusText(room) {
  if (room.aiStatus === "ready") return "已生成";
  if (room.aiStatus === "generating") return "生成中";
  if (room.aiStatus === "error") {
    const message = room.aiError || "AI题库生成失败";
    if (message.includes("AI_API_KEY") || message.includes("OPENAI_API_KEY")) {
      return "失败：请在服务器配置 OPENAI_API_KEY 后重启";
    }
    return `失败：${escapeHtml(message)}`;
  }
  return "等待生成";
}

function renderLobby() {
  const room = client.room;
  const me = room.me;
  const playerLimit = Number(room.playerLimit || 2);
  const activeCount = room.players.filter((player) => player.isConnected).length;
  app.innerHTML = `
    <section class="layout">
      <aside class="panel side">
        <div class="room-head">
          <div>
            <div class="small">房间号</div>
            <div class="code">${room.id}</div>
          </div>
          <button class="secondary" id="copyRoom">📋 复制</button>
        </div>
        <h2 class="section-title">玩家</h2>
        <div class="players">${renderPlayers(room.players)}</div>
      </aside>
      <section class="panel main-panel">
        <h2 class="phase-title">等待开局</h2>
        <div class="small">当前 ${activeCount}/${playerLimit} 人</div>
        <div class="small">AI题库：${aiStatusText(room)}</div>
        <h3 class="section-title">本局人数</h3>
        <div class="setting-row">
          <select class="select" id="playerLimitSelect" ${!me.isHost ? "disabled" : ""}>
            ${[2, 3, 4, 5, 6].map((count) => `
              <option value="${count}" ${playerLimit === count ? "selected" : ""} ${activeCount > count ? "disabled" : ""}>${count} 人局</option>
            `).join("")}
          </select>
          <span class="small">${me.isHost ? "房主可选择开局人数" : "由房主选择"}</span>
        </div>
        <h3 class="section-title">难度</h3>
        <div class="difficulty">
          ${["normal", "medium", "hard"].map((level) => `
            <button data-difficulty="${level}" class="${room.difficulty === level ? "active" : ""}" ${!me.isHost ? "disabled" : ""}>
              ${difficultyText(level)}
            </button>
          `).join("")}
        </div>
        <div class="small">本局 ${room.maxRounds} 轮</div>
        <div class="toolbar">
          <button class="primary" id="readyBtn">${me.isHost ? "房主已准备" : "✅ 准备"}</button>
          <button class="secondary" id="startBtn" ${!me.isHost ? "disabled" : ""}>🚀 开始游戏</button>
          <button class="ghost" id="leaveBtn">退出房间</button>
        </div>
      </section>
    </section>
  `;

  app.querySelector("#copyRoom").addEventListener("click", async () => {
    await navigator.clipboard?.writeText(room.id).catch(() => null);
    showToast("房间号已复制");
  });
  app.querySelector("#readyBtn").addEventListener("click", postReady);
  app.querySelector("#startBtn").addEventListener("click", postStart);
  app.querySelector("#leaveBtn").addEventListener("click", () => {
    clearSession();
    stopPolling();
    render();
  });
  app.querySelectorAll("[data-difficulty]").forEach((button) => {
    button.addEventListener("click", () => postDifficulty(button.dataset.difficulty));
  });
  app.querySelector("#playerLimitSelect")?.addEventListener("change", (event) => {
    postPlayerLimit(event.currentTarget.value);
  });
}

function renderGame() {
  const room = client.room;
  const time = secondsLeft();
  const roundTitle = room.phase === "loading" ? "准备中" : `第 ${room.currentRound}/${room.maxRounds} 轮`;
  app.innerHTML = `
    <section class="layout">
      <aside class="panel side">
        <h2 class="section-title">已知线索</h2>
        <div class="clues">
          ${room.revealedClues.length ? room.revealedClues.slice().reverse().map(renderClue).join("") : `<div class="small">暂无线索</div>`}
        </div>
      </aside>
      <section class="panel main-panel">
        <div class="game-head">
          <div>
            <h2 class="phase-title">${roundTitle} · ${phaseName(room.phase)}</h2>
            <div class="small">难度：${difficultyText(room.difficulty)}</div>
          </div>
          ${time === null ? "" : `<div class="timer ${time <= 10 ? "hot" : ""}" data-timer>${time}s</div>`}
        </div>
        ${renderSpeechStrip(room)}
        ${renderPhase(room)}
      </section>
    </section>
  `;
  bindPhaseEvents(room);
}

function difficultyText(value) {
  return { normal: "普通", medium: "中等", hard: "困难" }[value] || "普通";
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
  return `
    <div class="clue clue--direct ${clue.answer ? "yes" : "no"}">
      <div class="clue__direct">${escapeHtml(clueResultText(clue))}</div>
    </div>
  `;
}

function renderPhase(room) {
  if (room.phase === "loading") {
    return `
      <div class="bubble">
        AI 正在生成当前和下一轮问题卡...
        <div class="small">问题卡生成完成后会自动继续，请稍等。</div>
        ${room.aiError ? `<div class="small">${escapeHtml(room.aiError)}</div>` : ""}
      </div>
    `;
  }

  if (room.phase === "select") {
    const selected = room.me.selectedCardId;
    if (!room.me.cards.length) {
      setTimeout(refreshRoom, 300);
      return `
        <div class="bubble">
          正在分发问题卡...
          <div class="small">如果长时间没有出现，请刷新页面重新进入房间。</div>
        </div>
      `;
    }
    return `
      <div class="cards">
        ${room.me.cards.map((card) => `
          <button class="question-card ${selected === card.id ? "selected" : selected ? "dim" : ""}" data-card="${card.id}">
            <p>${escapeHtml(card.question)}</p>
            <span>${selected === card.id ? "已选择" : "选择此卡"}</span>
          </button>
        `).join("")}
      </div>
      <h3 class="section-title">其他玩家</h3>
      <div class="status-row">${room.players.map((p) => `<span class="chip">${escapeHtml(p.avatar?.emoji || "")} ${escapeHtml(p.name)} · ${p.selected ? "已选" : "选择中"}</span>`).join("")}</div>
    `;
  }

  if (room.phase === "reveal") {
    return `
      <h3 class="section-title">AI 正在回答</h3>
      <div class="reveal-list">
        ${room.lastReveal.map((clue) => `
          <div class="bubble">
            <strong>${escapeHtml(clue.playerName)}</strong> 问：${escapeHtml(clue.question)}
            <div>${clue.answer ? "✅ 是的" : "❌ 不是"}</div>
          </div>
        `).join("")}
      </div>
    `;
  }

  if (room.phase === "guess") {
    const guessLocked = room.me.guessed || client.pendingGuess;
    return `
      <h3 class="section-title">你觉得答案是什么？</h3>
      <form class="guess-box" id="guessForm">
        <input class="input" name="guess" maxlength="24" placeholder="输入你的猜测" ${guessLocked ? "disabled" : ""} />
        <div class="guess-actions">
          <button class="primary" type="submit" ${guessLocked ? "disabled" : ""}>${client.pendingGuess ? "提交中..." : "提交猜测"}</button>
          <button class="secondary" type="button" id="skipBtn" ${guessLocked ? "disabled" : ""}>本轮跳过</button>
        </div>
      </form>
      <div class="status-row">${room.players.map((p) => `<span class="chip">${escapeHtml(p.avatar?.emoji || "")} ${escapeHtml(p.name)} · ${(p.guessed || (p.id === room.me.id && client.pendingGuess)) ? "已提交" : "思考中"}</span>`).join("")}</div>
    `;
  }

  if (room.phase === "roundResult") {
    return `
      <h3 class="section-title">本轮无人猜中</h3>
      <div class="result-list">
        ${room.lastResults.map(renderResult).join("")}
      </div>
    `;
  }

  return "";
}

function renderResult(result) {
  if (result.skipped) {
    return `<div class="bubble"><strong>${escapeHtml(result.playerName)}</strong> 跳过了本轮</div>`;
  }
  return `
    <div class="bubble">
      <strong>${escapeHtml(result.playerName)}</strong> 猜了「${escapeHtml(result.guess)}」
      <div>${result.close ? "很接近，但不完全正确" : "未命中"}</div>
    </div>
  `;
}

function bindPhaseEvents(room) {
  if (room.phase === "select") {
    app.querySelectorAll("[data-card]").forEach((button) => {
      button.addEventListener("click", () => postSelect(button.dataset.card));
    });
  }
  if (room.phase === "guess") {
    const form = app.querySelector("#guessForm");
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      const guess = new FormData(form).get("guess");
      postGuess(guess, false);
    });
    app.querySelector("#skipBtn")?.addEventListener("click", () => postGuess("", true));
  }
}

function renderGameOver() {
  const room = client.room;
  const final = room.final;
  const answer = final?.answer;
  app.innerHTML = `
    <section class="layout">
      <aside class="panel side">
        <h2 class="section-title">最终线索</h2>
        <div class="clues">
          ${room.revealedClues.slice().reverse().map(renderClue).join("")}
        </div>
      </aside>
      <section class="panel main-panel">
        ${renderSpeechStrip(room)}
        <div class="answer">
          <div>
            <div class="answer__emoji">${answer?.emoji || "🎉"}</div>
            <h2>${escapeHtml(answer?.name || "答案")}</h2>
            <div class="small">用了 ${room.currentRound} 轮，共揭示 ${room.revealedClues.length} 条线索</div>
          </div>
        </div>
        <h3 class="section-title">排名</h3>
        <div class="ranking">
          ${final.rankings.map((player, index) => `
            <div class="rank-row">
              ${renderAvatarBadge(player.avatar)}
              <strong>${escapeHtml(player.name)}</strong>
              <span class="badge ${player.guessed ? "ok" : ""}">${player.score} 分</span>
            </div>
          `).join("")}
        </div>
        <div class="toolbar" style="margin-top: 18px">
          <button class="primary" id="rematchBtn">🔄 再来一局</button>
          <button class="secondary" id="homeBtn">返回首页</button>
        </div>
      </section>
    </section>
  `;
  app.querySelector("#rematchBtn").addEventListener("click", postRematch);
  app.querySelector("#homeBtn").addEventListener("click", () => {
    clearSession();
    stopPolling();
    render();
  });
}

async function refreshRoom() {
  if (!client.roomId || !client.playerId) return;
  if (client.actionInFlight) return;
  try {
    const wasTypingGuess = isTypingGuess();
    const wasUsingPlayerLimit = isUsingPlayerLimitSelect();
    const previousPhase = client.room?.phase;
    const data = await api(`/api/rooms/${client.roomId}?playerId=${client.playerId}`);
    setRoom(data.room);
    if (wasTypingGuess && previousPhase === "guess" && data.room.phase === "guess" && !data.room.me.guessed) {
      updateTimerDisplay();
      return;
    }
    if (wasUsingPlayerLimit && data.room.phase === "waiting") return;
    render();
  } catch (error) {
    showToast(error.message);
    clearSession();
    stopPolling();
    render();
  }
}

async function postReady() {
  await postAction("ready", {});
}

async function postDifficulty(difficulty) {
  await postAction("difficulty", { difficulty });
}

async function postPlayerLimit(playerLimit) {
  await postAction("playerLimit", { playerLimit: Number(playerLimit) });
}

async function postStart() {
  await postAction("start", {});
}

async function postSelect(cardId) {
  await postAction("select", { cardId });
}

async function postGuess(guess, skip) {
  if (client.pendingGuess) return;
  const text = String(guess || "").trim();
  if (!skip && !text) {
    showToast("请输入猜测答案");
    return;
  }
  client.actionInFlight = true;
  client.pendingGuess = true;
  render();
  await postAction("guess", { guess: text, skip }, { keepPendingGuess: true });
}

async function postRematch() {
  await postAction("rematch", {});
}

async function postAction(action, body, options = {}) {
  client.actionInFlight = true;
  try {
    const data = await api(`/api/rooms/${client.roomId}/${action}`, {
      method: "POST",
      body: { ...body, playerId: client.playerId }
    });
    setRoom(data.room);
    if (action === "guess" && !options.keepPendingGuess) client.pendingGuess = false;
    if (action === "guess" && data.room?.me?.guessed) client.pendingGuess = false;
    render();
  } catch (error) {
    if (action === "guess") client.pendingGuess = false;
    showToast(error.message);
    render();
  } finally {
    client.actionInFlight = false;
  }
}

function startPolling() {
  stopPolling();
  client.poll = setInterval(refreshRoom, 1000);
  client.tick = setInterval(() => {
    client.now = Date.now();
    if (client.room?.phaseEndsAt) updateTimerDisplay();
  }, 500);
}

function stopPolling() {
  if (client.poll) clearInterval(client.poll);
  if (client.tick) clearInterval(client.tick);
  if (client.speechTimer) clearTimeout(client.speechTimer);
  client.poll = null;
  client.tick = null;
  client.speechTimer = null;
}

if (client.roomId && client.playerId) {
  startPolling();
  refreshRoom();
} else {
  render();
}
