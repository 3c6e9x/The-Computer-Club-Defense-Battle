const scenes = [
  { title: '电研社社长', text: '最新型的电脑发售了，我存的备用资金刚好够我买一台', bg: 'images/Electronics Store.png' },
  { title: '电研社社长', text: '要不是不久前买的新电脑被抢了，我也不会沦落到，要买没什么提升的型号的地步啊', bg: 'images/Electronics Store.png' },
  { title: '电研社社长', text: '这次一定要保护好电脑，带回活动室，就可以开展研究了', bg: 'images/Electronics Store.png' },
  { title: '旁白', text: '常言道，好奇心害死猫。但如果把这句话套用在凉宫春日身上，死掉的绝对不会是猫，而是被她卷入其中的所有无辜路人。今天，这个违反热力学第二定律的麻烦制造机，又带着她那无处安放的过剩精力一把推开了门。' },
  { title: '凉宫春日', text: '各位！有个特大好消息！你们知道吗，隔壁电脑研究社那帮家伙，居然不知好歹地购入了最新配置的电脑哦！这可是崭新的机器啊！如果我们能"借"过来的话，对我们SOS团走向世界的伟大发展绝对有跨时代的意义！' },
  { title: '阿虚', text: '我就不吐槽你把"抢劫"粉饰成"借用"的强盗逻辑了。话说回来，你这又是从哪只顺风耳那里听来的小道消息？电研社社长要是知道你在打他新老婆的主意，大概会连夜扛着主机逃出千叶县吧。' },
  { title: '凉宫春日', text: '这是身为团长的超直觉！废话少说，实玖瑠，我们走！再去和电研社进行一次"友好"的跨社团交流！' },
  { title: '旁白', text: '朝比奈学姐眼角泛起熟悉的泪光，像被逼到墙角的小动物一样向我投来求救的视线。' },
  { title: '朝比奈实玖瑠', text: '呜……阿虚同学，救救我……' },
  { title: '凉宫春日', text: '这次阿虚你也要来！敢缺席的话就判处死刑，外加流放西伯利亚挖土豆！' },
  { title: '旁白', text: '说罢，她一把拽住朝比奈学姐的衣袖，像拖着战利品一样冲出了门。望着被粗暴拉开的拉门，我深深地、沉重地叹了一口气。就算你把我流放到西伯利亚，我也不会在那里给你挖土豆的。' },
  { title: '古泉一树', text: '呵呵，既然团长都下达神谕了，那我们也只能从命了吧。走吧？' },
  { title: '旁白', text: '社团大楼的走廊上，电研社社长正小心翼翼地抱着一个大纸箱。里面装的，是社团经费燃烧换来的结晶——最新款的高配主机。正当他满心欢喜地走向活动室时，身后传来了一个堪比死神点名的声音。' },
  { title: '凉宫春日', text: '站住！前方那个抱电脑的！把你手里的最新装备乖乖上交给SOS团！' },
  { title: '旁白', text: '听到这个声音的瞬间，没有任何犹豫的余地，社长的大脑直接向双腿下达了最高优先级的指令。被那个暴君抓住的话，这台电脑绝对会被合法霸占的！' },
  { title: '电研社社长', text: '谁、谁会给你啊！！！' },
  { title: '旁白', text: '伴随着急促的脚步声，奇怪的事情发生了。周围的走廊景象开始扭曲，边界变得若即若离，像是融化在水中的水彩画，朦胧得看不到尽头。' },
  { title: '电研社社长', text: '这、这到底是什么鬼地方？！' },
  { title: '旁白', text: '在视线的末端，凉宫春日正带着骇人的气势逼近。而她身旁的那个短发无口少女——长门有希，正微张着嘴唇，以一种人类绝对无法达到的超高速低声吟唱着。' },
  { title: '长门有希', text: '……空间参数干涉确认，重力常数局部重写，资讯链接构造变更中……' },
  { title: '旁白', text: '这见鬼的空间渐渐褪去了色彩，只剩下刺眼的白与深邃的黑。电研社社长绝望地发现，在这个空间里似乎有一条诡异的物理法则：只要踩在纯白色的区域，就能健步如飞；但只要踏入哪怕一点点黑色的阴影，双腿就像是被灌注了成吨的水泥，沉重得连迈出一步都极为艰难！' },
  { title: '凉宫春日', text: '哼哼哼！跑啊，你怎么不跑了？即使你跑得再快，只要我们有长门这个超级王牌在场，你就算逃到宇宙边缘也飞不出我的手掌心！' },
  { title: '电研社社长', text: '可恶！难道我的新电脑就要在这里陨落了吗？！……不，等等！旁边有一间没有被空间侵蚀的教室！' },
  { title: '旁白', text: '仿佛抓住了最后一根救命稻草，他抱紧怀里的主机，用尽最后的力气一头扎进了旁边的教室里。' },
  { title: '电研社社长', text: '别小看电研社的毅力啊啊啊！' },
  { title: '关卡介绍', text: '接下来，你作为电脑研究社的社长，要防御SOS团的进攻，春日会因为进攻失败而感到愤怒，1096也会穿越到任务开始之前，让所有成员重新部署下一次进攻，此时各位团员可能会使用他们的特殊技能以便于拿到电脑，电研社社长也会掏出更多的资金去完善下一次的防御。' },
];

// 梦醒场景（失败时显示）
const defeatScenes = [
  { title: '旁白', text: '猛地睁开眼，电研社社长从课桌上弹了起来。额头上布满了一排冷汗，他大口大口地喘着粗气，双手还保持着在半空中拼命敲击键盘、堆叠防火墙的动作。' },
  { title: '电研社社长', text: '哈哈哈哈！守住了！我的终极防线，终于抵挡住了那个恶魔的入侵！就算有外星人开挂又怎样，电研社的底蕴是无敌的！' },
  { title: '旁白', text: '眼前是明朗的教室，窗外透进早晨的阳光。没有扭曲的黑白空间，也没有以每秒一万字念诵咒语的无口短发少女。' },
  { title: '同学A', text: '喂，社长，你做噩梦把脑子烧坏了吗？昨天一整天都没来上课，今天一早就在这里大呼小叫的。' },
  { title: '电研社社长', text: '哎？一整天？等等，我昨天难道没有被卷入什么奇怪的黑白空间？也没有用废旧主板搭建防御阵地？' },
  { title: '旁白', text: '他不可置信地拍了拍自己的脸颊。原来只是一场梦啊。说得也是，现实里怎么会有那种不讲理的魔法和赛博朋克塔防。既然是梦，那自己拼死护住的那台最新配置的电脑，一定还安安稳稳地待在自己脚边……正当他长舒了一口气，准备低头确认时，走廊外传来了两个无比熟悉的声音，正由远及近地飘入教室。' },
  { title: '阿虚', text: '我说古泉，昨天那只长得像异形一样的巨大蝗虫到底是怎么回事？在那种黄沙漫天的闭锁空间里，那家伙居然懂得利用废弃的电子元件搭建出那么坚固的堡垒？连长门的强制解除代码都差点击穿不了，我的精神值可是被折磨得掉光了啊。' },
  { title: '古泉一树', text: '呵呵，毕竟那是凉宫同学潜意识里对\'夺取\'概念的具象化，而反抗它的，则是某人极其强烈的\'死守阵地\'的执念吧。能在梦境中将防御本能发挥到那种地步，连凉宫同学的化身都没能攻破那座堡垒，确实非常了不起。' },
  { title: '旁白', text: '昨天？闭锁空间？防御堡垒？那些支离破碎的词汇，如同拼图般严丝合缝地嵌入了他那荒诞的"梦境"之中。电研社社长僵在座位上，一丝不祥的预感爬上心头。——既然连那个"神"都没攻破我的防线，那我的电脑岂不是保住了？！' },
  { title: '阿虚', text: '了不起个头啊。在闭锁空间里死守成功有什么用？那家伙难道没想过，梦里的防线再坚固，也防不住现实里的小偷吗？' },
  { title: '古泉一树', text: '是啊。因为在闭锁空间里久攻不下，凉宫同学感到非常烦躁。于是她一气之下切断了精神链接醒了过来，直接走到正在走廊上昏睡的电研社社长面前，把那台崭新的电脑主机强行抱走了呢。' },
  { title: '阿虚', text: '这就叫\'既然解不开谜题，就把桌子掀了\'。所以说，在梦里打赢那个女人根本没有任何意义，现实里的土匪行径才是最防不胜防的。我现在还得去帮她给那台赃物装系统……' },
  { title: '旁白', text: '走廊外的脚步声伴随着叹息渐渐远去。冷汗，再次从电研社社长刚刚擦干的额头上如同瀑布般渗了出来。他颤抖着手，僵硬地低下头，摸向自己课桌旁——那个他以为绝对安全、本该放着崭新电脑机箱的空地。' },
  { title: '电研社社长', text: '我的新电脑呢？！！！' },
];

// 头像映射
const avatarMap = {
  '凉宫春日': '/static/images/suzumiya_avatar.png',
  '阿虚': '/static/images/阿虚_avatar.png',
  '朝比奈实玖瑠': '/static/images/朝比奈实玖瑠_avatar.png',
  '古泉一树': '/static/images/古泉一树_avatar.png',
  '长门有希': '/static/images/长门有希_avatar.png',
  '电研社社长': '/static/images/电研社社长_avatar.png',
  '同学A': null,
  '旁白': null,
  '关卡介绍': null,
};

// 随机音乐池（3首悬疑风格BGM）
const MYSTERY_POOL = [
  '/static/music/岡部啓一 (おかべ けいいち) - 憂鬱の憂鬱.mp3',
  '/static/music/神前暁 - 何かがおかしい.mp3',
  '/static/music/神前暁 - ザ・ミステリアス (神秘).mp3',
];

// 停止所有残留音乐（首页BGM等）
document.querySelectorAll('audio').forEach(a => { a.pause(); a.src = ''; });

let musicStarted = false;
let currentScene = -1;
let isDefeatScenario = false;
let activeScenes = scenes; // 默认使用普通场景
const titleEl = document.getElementById('dialogue-title');
const textEl = document.getElementById('dialogue-text');
const storyVisual = document.getElementById('story-visual');
const sceneMusic = document.getElementById('scene-music');

// 检查是否从塔防失败返回
function checkDefeatState() {
  if (localStorage.getItem('towerDefeat') === 'true') {
    isDefeatScenario = true;
    activeScenes = defeatScenes;
    localStorage.removeItem('towerDefeat');
    return true;
  }
  return false;
}

// 随机选一首，不与上次重复
function pickRandomTrack() {
  const last = localStorage.getItem('lastMusicIndex');
  let idx;
  do {
    idx = Math.floor(Math.random() * MYSTERY_POOL.length);
  } while (MYSTERY_POOL.length > 1 && String(idx) === last);
  localStorage.setItem('lastMusicIndex', idx);
  return MYSTERY_POOL[idx];
}

// 启动音乐（需要用户交互后调用，绕过 autoplay 限制）
function startMusic() {
  if (musicStarted) return;
  const track = pickRandomTrack();
  sceneMusic.src = track;
  sceneMusic.volume = 0.4;
  sceneMusic.loop = false;
  sceneMusic.play().then(() => {
    musicStarted = true;
    console.log('[Story] Playing:', track);
  }).catch(err => {
    console.warn('[Story] Music blocked:', err);
  });
}

// 停止音乐
function stopMusic() {
  sceneMusic.pause();
  sceneMusic.src = '';
  musicStarted = false;
}

function showScene(index) {
  if (index < 0 || index >= activeScenes.length) return;

  // 场景背景
  const scene = activeScenes[index];
  if (scene.bg) {
    storyVisual.style.background = `linear-gradient(180deg, rgba(16, 18, 27, 0.3) 0%, rgba(7, 9, 15, 0.7) 100%), url("/static/${scene.bg}") center/cover no-repeat`;
  } else {
    storyVisual.style.background = '';
  }

  if (scene.title === '旁白') {
    titleEl.textContent = '';
    titleEl.style.visibility = 'hidden';
  } else {
    titleEl.textContent = scene.title;
    titleEl.style.visibility = 'visible';
  }
  textEl.textContent = scene.text || '';
}

function advanceScene() {
  // 首次点击启动音乐
  startMusic();

  currentScene++;
  if (currentScene >= activeScenes.length) {
    stopMusic();
    // 梦醒场景或普通故事结束后都进入逃脱游戏
    localStorage.removeItem('escapeResume');
    window.location.href = '/escape/';
    return;
  }
  showScene(currentScene);
}

storyVisual.addEventListener('click', advanceScene);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    advanceScene();
  }
});

// 离开页面时停止音乐
window.addEventListener('beforeunload', stopMusic);
window.addEventListener('pagehide', stopMusic);

// 初始状态 - 检查是否从失败返回，然后显示第一个场景
checkDefeatState();
showScene(0);
