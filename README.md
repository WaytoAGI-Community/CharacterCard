<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# 人格编年史 (Chronicle of Personas)

<p>
  <img src="https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Vite-6.2-646CFF?style=flat-square&logo=vite" alt="Vite"/>
  <img src="https://img.shields.io/badge/Zustand-5.0-orange?style=flat-square" alt="Zustand"/>
  <img src="https://img.shields.io/badge/AI-Gemini%20%7C%20OpenAI-green?style=flat-square" alt="AI"/>
</p>

**一个由 AI 驱动的动态叙事卡牌游戏，规则根据你的选择不断改写。**

*"选择你的面具。这个世界的规则并非刻在石头上，而是由鲜血和抉择书写。"*

[在线演示](https://ai.studio/apps/drive/1mxxjF-3EzOO4s8wJEt0e51PyZOcoV9fn) | [AI Studio](https://ai.studio) | [部署文档](DEPLOYMENT.md)

</div>

---

## ✨ 特性

### 🎮 游戏核心
- **动态叙事系统**：每个选择都会影响故事走向，AI 实时生成独特的剧情分支
- **进化规则卡牌**：游戏规则根据玩家决策动态添加或移除
- **中世纪奇幻美学**：精美的视觉设计，营造沉浸式游戏体验
- **多维度统计系统**：信誉度、压力值、人际关系三大核心属性影响游戏进程

### 🤖 AI 引擎
- **多 AI 提供商支持**：支持 Google Gemini 和 OpenAI (GPT-4)
- **智能 JSON 解析**：强健的错误处理和数据验证机制
- **上下文理解**：AI 理解游戏历史和角色特性，生成连贯的故事

### 💾 技术亮点
- **状态持久化**：使用 localStorage 自动保存游戏进度
- **集中式状态管理**：基于 Zustand 的高性能状态管理方案
- **响应式设计**：完美适配桌面和移动设备
- **TypeScript 类型安全**：全面的类型定义，提高代码质量

---

## 🎯 游戏玩法

### 角色选择
游戏开始时，从多个独特的角色中选择你的化身：
- 每个角色拥有独特的属性（力量、智慧、魅力）
- 特殊特质和弱点影响游戏体验
- 初始规则卡牌定义你的起始条件

### 核心机制
1. **阅读 AI 生成的故事场景**
2. **在多个选择中做出决定**
3. **观察你的选择如何影响**：
   - 📊 **三大核心属性**：信誉度、压力值、人际关系
   - 🃏 **规则卡牌变化**：新规则可能被添加或移除
   - 📖 **故事走向**：剧情根据你的决策发展

### 胜负条件
- ⚠️ **压力值达到 10**：理智崩溃，游戏结束
- 💔 **信誉度降至 0**：被社会放逐，游戏结束
- 🏆 **完成所有回合**：解锁最终总结

---

## 🚀 快速开始

### 环境要求
- **Node.js** 16.x 或更高版本
- **pnpm** (推荐) 或 npm

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd CharacterCard
   ```

2. **安装依赖**
   ```bash
   pnpm install
   # 或使用 npm
   npm install
   ```

3. **配置 AI API**
   
   创建 `.env.local` 文件并配置你的 API 密钥：
   
   ```bash
   # 使用 Gemini
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   
   # 或使用 OpenAI
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   VITE_OPENAI_BASE_URL=https://api.openai.com/v1
   VITE_OPENAI_MODEL=gpt-4
   ```

4. **启动开发服务器**
   ```bash
   pnpm dev
   # 或
   npm run dev
   ```

5. **访问应用**
   
   打开浏览器访问：`http://localhost:5173`

### 构建生产版本

```bash
pnpm build
# 预览构建结果
pnpm preview
```

---

## 🔧 配置说明

### AI 提供商配置

游戏支持两种 AI 提供商，你可以在游戏界面的设置按钮中切换：

#### Gemini (Google)
- 申请 API Key：[Google AI Studio](https://ai.google.dev/)
- 在设置中输入你的 API Key

#### OpenAI
- 申请 API Key：[OpenAI Platform](https://platform.openai.com/)
- 配置项：
  - API Key
  - Base URL（默认：`https://api.openai.com/v1`）
  - Model（推荐：`gpt-4` 或 `gpt-4-turbo`）

### 游戏参数调整

在 [constants.ts](constants.ts) 中可以自定义：
- 游戏最大回合数
- 角色初始属性
- 初始规则卡牌
- 角色库

---

## 📁 项目结构

```
CharacterCard/
├── components/           # React 组件
│   ├── AiSettingsModal.tsx   # AI 配置界面
│   ├── CharacterCard.tsx     # 角色卡牌组件
│   └── RuleCard.tsx          # 规则卡牌组件
├── services/            # 服务层
│   ├── aiEngine.ts          # AI 引擎核心逻辑
│   └── geminiService.ts     # AI 服务接口
├── store/               # 状态管理
│   └── index.ts             # Zustand store
├── App.tsx              # 应用主组件
├── constants.ts         # 游戏常量配置
├── types.ts            # TypeScript 类型定义
├── index.tsx           # 应用入口
└── vite.config.ts      # Vite 配置
```

---

## 🛠️ 技术栈

| 技术 | 用途 | 版本 |
|------|------|------|
| **React** | UI 框架 | 19.2.4 |
| **TypeScript** | 类型安全 | 5.8.2 |
| **Vite** | 构建工具 | 6.2.0 |
| **Zustand** | 状态管理 | 5.0.11 |
| **@google/genai** | Gemini API | 1.40.0 |
| **openai** | OpenAI API | 6.17.0 |
| **Font Awesome** | 图标库 | - |

---

## 📖 文档

- [部署指南](DEPLOYMENT.md) - GitHub Pages 自动部署配置
- [迁移文档](MIGRATION.md) - 状态管理和 AI 引擎实现细节

---

## 🎨 特性展示

### 状态持久化
游戏进度自动保存到浏览器本地存储，刷新页面后可继续游戏。

### 智能 JSON 解析
AI 引擎包含强健的 JSON 解析机制：
- 自动去除 Markdown 代码块标记
- 修复常见的 JSON 格式问题
- 详细的错误日志和降级处理

### 响应式 UI
- 桌面端：大屏展示，视觉效果丰富
- 移动端：触摸优化，流畅体验

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发指南
1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

---

## 📄 许可证

本项目为私有项目，仅供学习和研究使用。

---

## 🙏 致谢

- Google Gemini AI
- OpenAI GPT-4
- React 和 Vite 团队
- 所有开源贡献者

---

<div align="center">

**用 ❤️ 和 ☕️ 构建 | Powered by AI**

[报告问题](../../issues) · [请求功能](../../issues) · [查看文档](DEPLOYMENT.md)

</div>
