const scenes = [
  {
    title: '凉宫春日',
    text: '好想要一台电脑喔！',
  },
  {
    title: '旁白',
    text: '自从宣告成立SOS团以来，原本只有一张长桌子、钢管椅和书架的文艺社教室，东西慢慢变多了起来。',
  },
  {
    title: '旁白',
    text: '现在室内角落摆着一座不知从哪里拿来的可携式衣架，热水壶和陶杯、茶碗、没有MD功能的CD录放两用收音机、单层冰箱、录音机、陶锅、水壶以及各种食器。现在是怎样？打算叫我们住在这里啊？',
  },
  {
    title: '旁白',
    text: '此刻，春日正盘腿坐在不知从哪里抢来的学生桌上。不知怎地，桌上还摆着一个用奇异笔写着「团长」两个字的三角锥。',
  },
  {
    title: '凉宫春日',
    text: '在这个资讯化的时代里，连一台电脑都没有，是不行的！',
  },
  {
    title: '阿虚',
    text: '听你在胡扯，这是谁规定的啊！',
  },
  {
    title: '凉宫春日',
    text: '所以，我会想办法去弄一台来。',
  },
  {
    title: '凉宫春日',
    text: '朝比奈学姐。',
  },
  {
    title: '阿虚',
    text: '弄一台，你是说电脑吗？去哪里弄？你该不会打算去抢电器行吧？',
  },
  {
    title: '凉宫春日',
    text: '怎么可能！是更近一点的地方啦！',
  },
  {
    title: '凉宫春日',
    text: '跟我来！去电脑研究社！',
  },
  {
    title: '凉宫春日',
    text: '拿着这个即可拍。',
  },
  {
    title: '凉宫春日',
    text: '给我听好了！现在要告诉你作战计划，你可要按照计划行动喔！千万要好好把握机会。',
  },
  {
    title: '阿虚',
    text: '啊？你又要乱来啦？',
  },
  {
    title: '凉宫春日',
    text: '有什么关系！',
  },
  {
    title: '阿虚',
    text: '是你没关系啊，大姐！',
  },
  {
    title: '凉宫春日',
    text: '你们好！我前来征收一台电脑！',
  },
  {
    title: '旁白',
    text: '虽然隔间很类似，不过这间教室却非常狭窄。等距排开的桌子上摆了好几台CD音响和桌上型电脑主机，凉风扇低沉的转动声震动着室内的空气。',
  },
  {
    title: '旁白',
    text: '坐在位子上喀擦喀擦敲着键盘的四名男同学，纷纷探出身子窥探站在门口的春日有何意图。',
  },
  {
    title: '凉宫春日',
    text: '哪个是社长？',
  },
  {
    title: '社长',
    text: '我就是，有什么事吗？',
  },
  {
    title: '凉宫春日',
    text: '你是没带耳朵啊，我刚刚明明就讲过了。一台电脑给我。',
  },
  {
    title: '社长',
    text: '不行不行。因为学校补助经费不足，这里的电脑都是我们社员自己辛苦存钱买来的，怎么可能你说要就随便给你。我们又不是凯子！',
  },
  {
    title: '凉宫春日',
    text: '有什么关系嘛！一台就好啦，你们明明就有这么多台！',
  },
  {
    title: '社长',
    text: '那个……先请问一下，你们到底是谁？',
  },
  {
    title: '凉宫春日',
    text: '相机，相机。',
  },
  {
    title: '凉宫春日',
    text: '我是SOS团团长，凉宫春日。而这两个分别是部下一跟部下二。',
  },
  {
    title: '阿虚',
    text: '等等，谁是你的部下啊！',
  },
  {
    title: '凉宫春日',
    text: '我用SOS团的名义号令你，马上交出一台电脑，少在那边说那些五四三的！',
  },
  {
    title: '社长',
    text: '虽然我不知道你们是谁，不过不行就是不行！要电脑自己去买！',
  },
  {
    title: '凉宫春日',
    text: '既然你这么说，我们也有我们的方法。',
  },
  {
    title: '关卡介绍',
    text: '接下来，你作为电脑研究社的社长，要防御SOS团的进攻，春日会因为进攻失败而感到愤怒，1096也会穿越到任务开始之前，让所有成员重新部署下一次进攻，此时各位团员可能会使用他们的特殊技能以便于拿到电脑，电研社社长也会掏出更多的资金去完善下一次的防御。',
  },
];

// 头像映射
const avatarMap = {
  '阿虚': '/static/images/阿虚_avatar.png',
  '社长': '/static/images/社长_avatar.png',
};

// 音乐配置
const mysterySongs = [
  '/static/music/岡部啓一 (おかべ けいいち) - 憂鬱の憂鬱.mp3',
  '/static/music/神前暁 - 何かがおかしい.mp3',
  '/static/music/神前暁 - ザ・ミステリアス (神秘).mp3',
];
const afterSong = '/static/music/神前暁 - おいおい (喂喂).mp3';

// 音乐播放相关的场景索引
const MYSTERY_SCENE_INDEX = 18;  // 目标场景（前一个场景播放第一批音乐）
const AFTER_SONG_SCENE_INDEX = 19;  // 下一个场景播放特定音乐

function playSceneMusic(musicPath) {
  const sceneMusic = document.getElementById('scene-music');
  if (sceneMusic) {
    sceneMusic.src = musicPath;
    sceneMusic.loop = false;
    sceneMusic.play().catch(function(error) {
      console.log('音乐播放被阻止或出错:', error);
    });
  }
}

function getRandomMysteryMusic() {
  const lastUsedIndex = getCookie('lastMysteryMusicIndex');
  let randomIndex;
  
  do {
    randomIndex = Math.floor(Math.random() * mysterySongs.length);
  } while (lastUsedIndex !== null && randomIndex === Number(lastUsedIndex));
  
  setCookie('lastMysteryMusicIndex', randomIndex, 30);
  return mysterySongs[randomIndex];
}

function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
  const cookieString = document.cookie.split('; ').find((row) => row.startsWith(name + '='));
  return cookieString ? decodeURIComponent(cookieString.split('=')[1]) : null;
}

function saveSceneIndex(index) {
  setCookie('storyProgress', index, 30);
}

function clearStoryProgress() {
  setCookie('storyProgress', '', -1);
}

let currentScene = getCookie('storyProgress') !== null ? Number(getCookie('storyProgress')) : -1;
const titleEl = document.getElementById('dialogue-title');
const textEl = document.getElementById('dialogue-text');
const storyVisual = document.getElementById('story-visual');

function showScene(index) {
  if (index < 0) {
    titleEl.textContent = '视觉小说';
    textEl.textContent = '';
    storyVisual.style.backgroundImage = "url('/static/images/background1.png')";
    return;
  }

  const scene = scenes[index];
  titleEl.textContent = scene.title;
  textEl.textContent = scene.text;
  
  // 设置头像
  const avatarImg = document.getElementById('dialogue-avatar-img');
  if (avatarMap[scene.title]) {
    avatarImg.src = avatarMap[scene.title];
  } else {
    avatarImg.src = '';
  }
  
  // 处理场景音乐
  if (index === MYSTERY_SCENE_INDEX) {
    const randomMusic = getRandomMysteryMusic();
    playSceneMusic(randomMusic);
  } else if (index === AFTER_SONG_SCENE_INDEX) {
    playSceneMusic(afterSong);
  }
  
  saveSceneIndex(index);
}

function advanceScene() {
  currentScene += 1;

  if (currentScene >= scenes.length) {
    clearStoryProgress();
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

showScene(currentScene);
