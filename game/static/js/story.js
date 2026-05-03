const scenes = [
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
  { title: '凉宫春日', text: '哼哼哼！跑啊，你怎么不跑了？即使你跑得再快，只要我们有长门这个超级王牌（Carry）在场，你就算逃到宇宙边缘也飞不出我的手掌心！' },
  { title: '电研社社长', text: '可恶！难道我的新电脑就要在这里陨落了吗？！……不，等等！旁边有一间没有被空间侵蚀的教室！' },
  { title: '旁白', text: '仿佛抓住了最后一根救命稻草，他抱紧怀里的主机，用尽最后的力气一头扎进了旁边的教室里。' },
  { title: '电研社社长', text: '别小看电研社的毅力啊啊啊！' },
  { title: '关卡介绍', text: '接下来，你作为电脑研究社的社长，要防御SOS团的进攻，春日会因为进攻失败而感到愤怒，1096也会穿越到任务开始之前，让所有成员重新部署下一次进攻，此时各位团员可能会使用他们的特殊技能以便于拿到电脑，电研社社长也会掏出更多的资金去完善下一次的防御。' },
];

// 头像映射
const avatarMap = {
  '凉宫春日': '/static/images/suzumiya_avatar.png',
  '阿虚': '/static/images/阿虚_avatar.png',
  '朝比奈实玖瑠': '/static/images/朝比奈实玖瑠_avatar.png',
  '古泉一树': '/static/images/古泉一树_avatar.png',
  '长门有希': '/static/images/长门有希_avatar.png',
  '电研社社长': '/static/images/电研社社长_avatar.png',
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
const titleEl = document.getElementById('dialogue-title');
const textEl = document.getElementById('dialogue-text');
const storyVisual = document.getElementById('story-visual');
const sceneMusic = document.getElementById('scene-music');

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
  if (index < 0 || index >= scenes.length) return;
  
  // 当title是"旁白"时不显示title，但保留元素以保持对话框大小
  if (scenes[index].title === '旁白') {
    titleEl.textContent = '';
    titleEl.style.visibility = 'hidden';
  } else {
    titleEl.textContent = scenes[index].title;
    titleEl.style.visibility = 'visible';
  }
  textEl.textContent = scenes[index].text;
}

function advanceScene() {
  // 首次点击启动音乐
  startMusic();

  currentScene++;
  if (currentScene >= scenes.length) {
    stopMusic();
    window.location.href = '/battle/';
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

// 初始状态 - 直接显示第一个场景
showScene(0);
