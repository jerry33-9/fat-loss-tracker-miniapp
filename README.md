# 🏋️ 减脂记录 - 微信小程序

科学减脂，健康生活。一款帮助你记录体重、饮食和运动的微信小程序。

## 功能

- **体重管理** — 每日体重记录 + 自动计算趋势图 + BMI 评估
- **饮食记录** — 三餐+加餐，支持拍照记录和热量统计
- **运动记录** — 多种运动类型预设，自动估算消耗热量
- **目标追踪** — 设定减脂目标，可视化进度条
- **数据概览** — 首页仪表盘，今日摄入/消耗/热量差一目了然

## 技术栈

- 微信原生小程序 + TypeScript
- 微信云开发（ CloudBase ）
- Canvas 2D 图表绘制

## 发布要求

✅ 支持**个人主体**注册和发布
✅ 类目选"工具-信息查询"或"生活服务-健康"
✅ 不使用微信支付等需企业资质的功能

## 快速开始

### 1. 注册小程序

前往 [微信公众平台](https://mp.weixin.qq.com/) 注册个人小程序账号，获取 AppID。

### 2. 开通云开发

1. 打开微信开发者工具，导入本项目
2. 修改 `project.config.json` 中的 `appid` 为你的 AppID
3. 点击"云开发"按钮开通环境
4. 将 `miniprogram/app.ts` 中的 `env` 改为你的云环境 ID

### 3. 初始化数据库

上传并运行 `cloudfunctions/initDB` 云函数，自动创建数据库集合和索引。

### 4. 配置数据库权限

在云开发控制台 → 数据库，为以下集合设置权限：

| 集合 | 权限 |
|------|------|
| weights | 仅创建者可读写 |
| diets | 仅创建者可读写 |
| exercises | 仅创建者可读写 |
| goals | 仅创建者可读写 |

### 5. 准备图标

在 `miniprogram/images/` 目录下放入以下 tabBar 图标（推荐 81×81 px）：

- `tab-home.png` / `tab-home-active.png`
- `tab-weight.png` / `tab-weight-active.png`
- `tab-diet.png` / `tab-diet-active.png`
- `tab-exercise.png` / `tab-exercise-active.png`
- `tab-profile.png` / `tab-profile-active.png`

图标可从 [iconfont](https://www.iconfont.cn/) 免费下载。

### 6. 预览和发布

点击开发者工具"预览"扫码体验，确认无误后点击"上传"提交审核。

## 项目结构

```
omniX/
├── miniprogram/          # 小程序前端
│   ├── app.ts            # 应用入口
│   ├── app.json          # 应用配置
│   ├── pages/
│   │   ├── index/        # 首页仪表盘
│   │   ├── weight/       # 体重记录列表
│   │   │   └── log/      # 体重录入
│   │   ├── diet/         # 饮食记录列表
│   │   │   └── log/      # 饮食录入
│   │   ├── exercise/     # 运动记录列表
│   │   │   └── log/      # 运动录入
│   │   └── profile/      # 个人中心
│   └── utils/            # 工具函数
├── cloudfunctions/       # 云函数
│   └── initDB/           # 数据库初始化
├── project.config.json   # 项目配置
└── README.md
```

## 注意事项

- 图片上传使用云存储，请在云开发控制台配置存储权限
- Canvas 2d 需要基础库 2.9.0+，当前配置 3.3.4
- 个人小程序每日调用次数有限制，正常使用足够
