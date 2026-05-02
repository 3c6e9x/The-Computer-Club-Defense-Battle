const scenes = [
  { title: '凉宫春日', text: '好想要一台电脑喔！' },
  { title: '旁白', text: '自从宣告成立SOS团以来，原本只有一张长桌子、钢管椅和书架的文艺社教室，东西慢慢变多了起来。' },
  { title: '旁白', text: '现在室内角落摆着一座不知从哪里拿来的可携式衣架，热水壶和陶杯、茶碗、没有MD功能的CD录放两用收音机、单层冰箱、录音机、陶锅、水壶以及各种食器。现在是怎样？打算叫我们住在这里啊？' },
  { title: '旁白', text: '此刻，春日正盘腿坐在不知从哪里抢来的学生桌上。不知怎地，桌上还摆着一个用奇异笔写着「团长」两个字的三角锥。' },
  { title: '凉宫春日', text: '在这个资讯化的时代里，连一台电脑都没有，是不行的！' },
  { title: '阿虚', text: '听你在胡扯，这是谁规定的啊！' },
  { title: '凉宫春日', text: '所以，我会想办法去弄一台来。' },
  { title: '凉宫春日', text: '朝比奈学姐。' },
  { title: '阿虚', text: '弄一台，你是说电脑吗？去哪里弄？你该不会打算去抢电器行吧？' },
  { title: '凉宫春日', text: '怎么可能！是更近一点的地方啦！' },
  { title: '凉宫春日', text: '跟我来！去电脑研究社！' },
  { title: '凉宫春日', text: '拿着这个即可拍。' },
  { title: '凉宫春日', text: '给我听好了！现在要告诉你作战计划，你可要按照计划行动喔！千万要好好把握机会。' },
  { title: '阿虚', text: '啊？你又要乱来啦？' },
  { title: '凉宫春日', text: '有什么关系！' },
  { title: '阿虚', text: '是你没关系啊，大姐！' },
  { title: '凉宫春日', text: '你们好！我前来征收一台电脑！' },
  { title: '旁白', text: '虽然隔间很类似，不过这间教室却非常狭窄。等距排开的桌子上摆了好几台CD音响和桌上型电脑主机，凉风扇低沉的转动声震动着室内的空气。' },
  { title: '旁白', text: '坐在位子上喀擦喀擦敲着键盘的四名男同学，纷纷探出身子窥探站在门口的春日有何意图。' },
  { title: '凉宫春日', text: '哪个是社长？' },
  { title: '社长', text: '我就是，有什么事吗？' },
  { title: '凉宫春日', text: '你是没带耳朵啊，我刚刚明明就讲过了。一台电脑给我。' },
  { title: '社长', text: '不行不行。因为学校补助经费不足，这里的电脑都是我们社员自己辛苦存钱买来的，怎么可能你说要就随便给你。我们又不是凯子！' },
  { title: '凉宫春日', text: '有什么关系嘛！一台就好啦，你们明明就有这么多台！' },
  { title: '社长', text: '那个……先请问一下，你们到底是谁？' },
  { title: '凉宫春日', text: '相机，相机。' },
  { title: '凉宫春日', text: '我是SOS团团长，凉宫春日。而这两个分别是部下一跟部下二。' },
  { title: '阿虚', text: '等等，谁是你的部下啊！' },
  { title: '凉宫春日', text: '我用SOS团的名义号令你，马上交出一台电脑，少在那边说那些五四三的！' },
  { title: '社长', text: '虽然我不知道你们是谁，不过不行就是不行！要电脑自己去买！' },
  { title: '凉宫春日', text: '既然你这么说，我们也有我们的方法。' },
  { title: '关卡介绍', text: '接下来，你作为电脑研究社的社长，要防御SOS团的进攻，春日会因为进攻失败而感到愤怒，1096也会穿越到任务开始之前，让所有成员重新部署下一次进攻，此时各位团员可能会使用他们的特殊技能以便于拿到电脑，电研社社长也会掏出更多的资金去完善下一次的防御。' },
];

// 头像映射
const avatarMap = {
  '凉宫春日': '/static/images/suzumiya_avatar.png',
  '阿虚': '/static/images/阿虚_avatar.png',
  '社长': '/static/images/社长_avatar.png',
  '旁白': null,
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
  if (index < 0) {
    titleEl.textContent = '';
    textEl.textContent = '点击屏幕开始你的故事。';
    return;
  }
  if (index >= scenes.length) return;
  titleEl.textContent = scenes[index].title;
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

// 初始状态
showScene(currentScene);
