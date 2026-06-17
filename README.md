# 🏋️ 减脂记录 - 微信小程序

科学减脂，健康生活。体重、饮食、运动一站式记录。

## 项目结构

```
omniX/
├── miniprogram/          # 微信小程序前端
│   ├── pages/            # 页面
│   │   ├── index/        # 首页仪表盘
│   │   ├── weight/       # 体重记录
│   │   ├── diet/         # 饮食记录
│   │   ├── exercise/     # 运动记录
│   │   └── profile/      # 个人中心
│   └── utils/
│       ├── api.ts        # HTTP 接口封装
│       ├── date.ts       # 日期工具
│       └── types.ts      # 类型定义
├── server/               # Java Spring Boot 后端
│   ├── pom.xml
│   └── src/main/java/com/fittracker/
│       ├── Application.java
│       ├── config/       # 微信配置、Web配置
│       ├── controller/   # REST 接口
│       ├── model/        # 数据模型
│       └── service/      # 业务逻辑
└── project.config.json
```

## 技术栈

| 层 | 技术 |
|----|------|
| 前端 | 微信原生小程序 + TypeScript |
| 后端 | Java 17 + Spring Boot 2.7 + H2 数据库 |
| 构建 | Maven |

## 快速开始

### 1. 启动后端

```bash
cd server

# 修改 src/main/resources/application.yml 中的 wechat.secret
# 填入你的小程序 AppSecret

./mvnw spring-boot:run
# 或 mvn spring-boot:run
```

后端启动在 `http://localhost:8080`。

### 2. 配置小程序

1. 微信开发者工具打开 `miniprogram/` 目录
2. `utils/api.ts` 中 `BASE_URL` 开发时指向 `http://localhost:8080/api`
3. 上线前改为你的服务器域名（需 HTTPS + 已备案 + 在小程序后台配置 request 合法域名）

### 3. H2 数据库控制台

开发时访问 `http://localhost:8080/h2-console`：
- JDBC URL: `jdbc:h2:file:./data/fittracker`
- 用户名: `sa`，密码为空

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/login | 微信登录（code 换 openid） |
| GET | /api/weights | 体重列表 |
| POST | /api/weights | 新增体重 |
| GET | /api/diets | 饮食列表 |
| POST | /api/diets | 新增饮食 |
| GET | /api/exercises | 运动列表 |
| POST | /api/exercises | 新增运动 |
| GET | /api/goal | 获取目标 |
| POST | /api/goal | 设定目标 |
| DELETE | /api/goal | 删除目标 |
| GET | /api/stats | 数据统计 |
| POST | /api/upload | 文件上传 |

所有业务接口需在 Header 中携带 `X-Openid`。

## 上线部署

1. 后端部署到云服务器（推荐阿里云/腾讯云 2核2G 以上）
2. 配置 HTTPS 证书
3. 小程序后台添加 `request` 合法域名和 `uploadFile` 合法域名
4. `api.ts` 中 `BASE_URL` 改为线上地址
5. H2 数据库可替换为 MySQL（改 `application.yml` 数据源配置即可）
