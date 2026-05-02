const scenes = [
  {
    title: 'A New Threat',
    text: 'The city is under siege by strange mechanical creatures. Our heroes must defend the core.',
  },
  {
    title: 'Gathering Allies',
    text: 'They search for allies, build towers, and learn the secrets of the enemy.',
  },
  {
    title: 'Battle Begins',
    text: 'The first wave approaches! Prepare your defenses and hold the line.',
  },
];

let currentScene = 0;
const container = document.getElementById('story-container');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const battleBtn = document.getElementById('battleBtn');

function updateScene() {
  const scene = scenes[currentScene];
  container.innerHTML = `
    <div class="scene-card">
      <h2>${scene.title}</h2>
      <p>${scene.text}</p>
    </div>
  `;
  prevBtn.disabled = currentScene === 0;
  nextBtn.textContent = currentScene === scenes.length - 1 ? 'Finish' : 'Next';
}

prevBtn.addEventListener('click', () => {
  if (currentScene > 0) {
    currentScene -= 1;
    updateScene();
  }
});

nextBtn.addEventListener('click', () => {
  if (currentScene < scenes.length - 1) {
    currentScene += 1;
    updateScene();
  } else {
    window.location.href = '/battle/';
  }
});

battleBtn.addEventListener('click', () => {
  window.location.href = '/battle/';
});

updateScene();
