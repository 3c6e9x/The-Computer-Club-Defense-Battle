# 电脑社防御战（The Computer Club Defense Battle）

一个基于 Django 和原生 JavaScript Canvas 的浏览器小游戏。玩家需要在剧情推进中控制电脑社社长寻找并带回电脑，同时应对 SOS 团的追击；被追上后进入塔防战，守住电脑即可继续冒险。

> 本项目目前是一个以浏览器本地运行和体验为主的游戏原型。

## 游戏流程

1. **剧情模式**：点击或按 `Enter` / `Space` 推进视觉小说式剧情。
2. **逃脱模式**：使用方向键或 `WASD` 移动，在随机生成的地图中寻找电脑，再回到中央的电研社活动室。
   - 靠近电脑后按 `Space` 拾取。
   - 地图中会自动拾取金币，也可以收集特殊道具。
   - 凉宫春日、阿虚和学姐会在地图中巡逻或追击。
3. **塔防模式**：在教室地图上部署社员，抵御共 10 波敌人。
   - 左键点击地图部署社员。
   - 右键点击已部署的社员，以六折价格出售。
   - 通过道具造成范围伤害、减速、回溯或冻结敌人。
4. **结局**：塔防胜利后返回逃脱场景；失败或成功会触发不同的剧情分支。

## 技术栈

- Python 3.12+
- Django 6.x
- SQLite
- HTML / CSS
- 原生 JavaScript、Canvas API

## 项目结构

```text
.
├── README.md
└── game/
    ├── manage.py                 # Django 管理脚本
    ├── db.sqlite3                # SQLite 数据库
    ├── game/                     # Django 项目配置
    │   ├── settings.py
    │   ├── urls.py
    │   ├── asgi.py
    │   └── wsgi.py
    ├── haruhi/                   # 游戏 Django 应用
    │   ├── models.py             # 剧情、角色、社员和关卡模型
    │   ├── views.py              # 页面和 JSON API
    │   ├── urls.py
    │   ├── admin.py
    │   └── migrations/
    ├── templates/                # 页面模板
    │   ├── index.html
    │   ├── story.html
    │   ├── escape.html
    │   ├── battle.html
    │   └── victory.html
    └── static/
        ├── css/style.css
        ├── js/                   # 剧情、逃脱和塔防逻辑
        ├── images/               # 游戏图片资源
        └── music/                # 背景音乐
```

## 本地运行

### 1. 准备 Python 环境

项目当前未附带 `requirements.txt`，建议使用 Python 3.12 或更高版本，并创建虚拟环境：

```bash
python3 -m venv .venv
source .venv/bin/activate       # Windows：.venv\Scripts\activate
python -m pip install --upgrade pip
python -m pip install "Django>=6.0,<7.0"
```

### 2. 启动开发服务器

```bash
cd game
python manage.py migrate
python manage.py runserver
```

打开 <http://127.0.0.1:8000/> 即可开始游戏。

### 3. 可选：创建管理员账号

如果需要通过 Django Admin 管理剧情或社员数据：

```bash
cd game
python manage.py createsuperuser
```

然后访问 <http://127.0.0.1:8000/admin/>。

## 页面与 API

| 地址 | 说明 |
| --- | --- |
| `/` | 游戏首页 |
| `/story/` | 剧情页面 |
| `/escape/` | 逃脱玩法 |
| `/battle/` | 塔防玩法 |
| `/victory/` | 结局页面 |
| `/defeat/` | 失败页面路由（当前仓库未包含对应模板） |
| `/admin/` | Django 管理后台 |
| `/api/towers/` | 返回塔防社员数据 |
| `/api/story/` | 返回数据库中的剧情场景数据 |

## 数据模型

`haruhi` 应用目前包含以下模型：

- `StoryScene`：剧情标题、正文、背景图片和播放顺序。
- `Character`：角色名称、身份、头像和描述。
- `Tower`：塔防单位的名称、伤害、射程、费用和图标。
- `Level`：关卡名称、难度、说明和地图名称。

塔防页面会优先从 `/api/towers/` 读取社员数据；当数据库没有可用数据或 API 请求失败时，会自动使用前端内置的默认配置。

## 操作说明

### 剧情

- 鼠标点击剧情区域，或按 `Enter` / `Space`：推进文本。
- 浏览器可能阻止自动播放音乐；首次点击或按键后会尝试播放。

### 逃脱

- 移动：方向键或 `WASD`。
- 互动 / 拾取电脑：`Space`。
- 重新开始：`R`。

### 塔防

- 选择社员：点击左侧社员列表。
- 部署：左键点击道路以外的可建造格子。
- 出售：右键点击已部署社员。
- 开始或召唤下一波：点击“开始波次”按钮。
- 使用道具：点击左侧道具列表中的道具。

## 开发提示

- 游戏状态和跨场景进度主要通过浏览器 `localStorage` 保存，例如金币、道具、逃脱位置和剧情分支。
- 视觉资源、音乐和前端脚本位于 `game/static/`，修改后刷新浏览器即可看到效果。
- 数据模型变更后执行：

  ```bash
  cd game
  python manage.py makemigrations
  python manage.py migrate
  ```

- 运行 Django 自检：

  ```bash
  cd game
  python manage.py check
  ```

## 许可证与素材说明

仓库当前未提供明确的开源许可证文件。项目中的图片、音乐、角色和其他素材请在分发或公开部署前确认相应的版权与使用许可。
