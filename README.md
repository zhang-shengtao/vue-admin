# vue-admin

[![Vue3](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite)](https://vitejs.dev/)
[![Element Plus](https://img.shields.io/badge/Element_Plus-2.x-409EFF?logo=element-plus)](https://element-plus.org/)

## 项目介绍

vue-admin 是一个基于 Vue 3 的现代化后台管理系统模板，旨在为开发者提供开箱即用的企业级管理界面解决方案。项目采用模块化设计，集成了权限控制、路由管理、通用组件封装等常见需求，可快速构建中后台应用。

## 技术栈

- **核心框架**: Vue 3.5.13 (Composition API)
- **构建工具**: Vite 6.0.3
- **UI 框架**: Element Plus 2.8.8 + @element-plus/icons-vue
- **状态管理**: Pinia 3.0.3
- **路由管理**: vue-router 4.4.5
- **HTTP 客户端**: axios 1.6.8
- **样式处理**: Sass 1.72.0
- **其他依赖**:
  - ECharts 6.0.0 & ECharts GL 2.0.9 (数据可视化)
  - NProgress 0.2.0 (页面加载进度条)
  - xlsx 0.18.5 (Excel 文件导出)
  - spark-md5 3.0.2 (文件切片上传哈希计算)
  - @wangeditor/editor-for-vue 5.1.12 (富文本编辑器)
  - @iconify/vue 5.0.0 (图标库集成)

## 环境要求

- **Node.js**: 20.19+ 或 22.12+
- **npm**: 9.0+
- **浏览器**: 现代浏览器 (Chrome, Firefox, Edge 等)

> **注意**: 项目需要特定版本的 Node.js，请使用 nvm 管理 Node.js 版本

## 快速开始

```bash
# 克隆项目
# git clone <repository-url>

cd vue-admin

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 项目结构

```
vue-admin
├── plugin               # Vite 插件配置
├── src
│   ├── api              # API 接口定义
│   ├── assets             # 静态资源
│   ├── components         # 通用组件
│   ├── directive          # 自定义指令
│   ├── layout             # 布局组件 (头部、菜单、内容区等)
│   ├── pinia              # 状态管理
│   ├── router             # 路由配置
│   ├── utils              # 工具函数
│   ├── view               # 页面视图
│   ├── worker             # Web Worker (文件处理、Excel导出等)
│   └── main.js            # 应用入口
├── config.js            # 项目配置
├── vite.config.js       # Vite 配置
└── ...
```

## 主要功能

- **用户系统**: 登录认证、权限验证、404页面
- **布局系统**: 响应式布局、菜单折叠、标签页导航
- **通用组件**: 表格、上传、富文本编辑器、图标、ECharts图表等
- **API 封装**: 基于 axios 的统一请求处理
- **工具函数**: 常用方法、数据验证、本地存储管理
- **Excel 导出**: 支持大数据量分批导出
- **性能优化**: CDN 引入、Gzip 压缩、打包体积分析

## 开发规范

### 代码风格

- 使用 Prettier 3.3.3 格式化代码
- 组件命名采用 PascalCase (如 `UserList.vue`)
- 变量命名采用 camelCase
- 样式使用 Sass 编写，遵循 BEM 命名规范

### 提交规范

- 使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范
- 提交消息格式: `<type>(<scope>): <subject>`
  - 示例: `feat(auth): add login form validation`

## 依赖管理

项目使用 npm 管理依赖，安装新依赖时请遵循:

```bash
# 安装生产依赖
npm install package-name

# 安装开发依赖
npm install -D package-name
```

> **注意**: 当遇到依赖冲突时，优先使用 `--legacy-peer-deps` 参数安装

## 贡献指南

欢迎贡献代码！请遵循以下步骤:

1. Fork 本仓库
2. 创建新分支 (`git checkout -b feature/your-feature`)
3. 提交更改 (`git commit -am 'Add some feature'`)
4. 推送分支 (`git push origin feature/your-feature`)
5. 创建 Pull Request

## 许可证

本项目基于 MIT 许可证，详情请查看 [LICENSE](LICENSE) 文件。