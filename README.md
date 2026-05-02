# The-Computer-Club-Defense-Battle
game/
├── manage.py
├── game/               # 主应用
│   ├── models.py       # 剧情、关卡、角色、塔数据
│   ├── views.py        # 页面渲染 + API
│   ├── urls.py
│   └── templates/
│       ├── index.html  # 主页面
│       ├── story.html  # 视觉小说剧情页
│       └── battle.html # 塔防战斗页
└── static/             # 放图片、音效、JS、CSS
    ├── images/         # 立绘、背景、塔、怪物图
    ├── js/
    │   ├── story.js    # 视觉小说逻辑
    │   └── tower_defense.js # 塔防逻辑
    └── css/
        └── style.css