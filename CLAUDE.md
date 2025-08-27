# NestJS + Quasar CRUD Generator

## 项目概述

这是一个基于 Electron 的可视化 CRUD 代码生成器，专门用于快速生成 NestJS 后端和 Quasar 前端的增删改查代码。

### 🎯 主要功能

- **可视化配置**: 通过 Electron + Quasar 界面配置数据模型
- **代码生成**: 自动生成 NestJS Controller、Service、Entity 等文件
- **关系映射**: 支持复杂的数据库关系配置
- **项目管理**: 支持多项目管理和历史记录
- **现代化 UI**: 响应式设计，用户体验友好

## 🏗️ 项目结构

```
nest-quasar-curd/
├── package/curd-generator/          # 主应用程序
│   ├── src/                         # 前端 Vue/Quasar 代码
│   │   ├── components/             # Vue 组件
│   │   │   ├── HomePage.vue        # 主页（已优化）
│   │   │   ├── DropSelectFile.vue  # 文件选择器（已优化）
│   │   │   ├── Project/            # 项目相关组件
│   │   │   ├── Module/             # 模块相关组件
│   │   │   └── Model/              # 模型相关组件
│   │   ├── stores/                 # Pinia 状态管理
│   │   │   ├── data-store.ts       # 主数据存储
│   │   │   ├── history-store.ts    # 历史记录存储（已优化）
│   │   │   └── view-store.ts       # 视图状态存储
│   │   └── pages/                  # 页面组件
│   ├── src-electron/               # Electron 后端代码
│   │   ├── app/                    # 应用核心逻辑
│   │   │   ├── generator/          # 🆕 新架构生成器
│   │   │   │   ├── core/           # 核心抽象和接口
│   │   │   │   │   ├── interfaces/ # 接口定义
│   │   │   │   │   ├── abstracts/  # 抽象基类
│   │   │   │   │   ├── factories/  # 工厂模式实现
│   │   │   │   │   ├── strategies/ # 策略模式实现
│   │   │   │   │   ├── builders/   # 建造者模式实现
│   │   │   │   │   ├── templates/  # 模板管理
│   │   │   │   │   ├── output/     # 输出管理
│   │   │   │   │   └── types/      # 类型定义
│   │   │   │   ├── generators/     # 具体生成器实现
│   │   │   │   └── ModernCrudGenerator.ts # 🆕 主生成器类
│   │   │   ├── RootGenerator.ts    # 🔧 传统生成器（保持兼容）
│   │   │   └── ModelGenerator.ts   # 模型生成器
│   │   ├── handler/                # IPC 处理器
│   │   │   ├── FileHandler/        # 文件操作处理器（已优化）
│   │   │   └── HandlerLoader.ts    # 处理器加载器
│   │   └── helper/                 # 辅助工具
│   ├── type/                       # TypeScript 类型定义
│   │   ├── JsonFileDefine/         # JSON 文件结构定义
│   │   └── TypescriptImport/       # 导入类型定义
│   └── package.json                # 依赖配置
├── example/                        # 示例项目
│   ├── test.json                   # 🆕 测试配置文件（原 .nqcurd）
│   ├── nest/                       # NestJS 示例项目
│   └── quasar/                     # Quasar 示例项目
└── README.md                       # 项目说明
```

### 4. 用户界面优化
- **现代化设计**: 采用渐变背景和卡片式布局
- **响应式布局**: 适配不同屏幕尺寸
- **用户体验**: 增加拖拽、悬浮效果和动画
- **错误处理**: 更友好的错误提示和确认对话框

## 🚀 使用指南

### 开发环境设置
```bash
cd package/curd-generator
yarn install
yarn dev  # 启动 Electron 开发环境
```

### 生产构建
```bash
yarn build  # 构建 Electron 应用
```

### 项目创建流程
1. **启动应用**: 运行构建后的 Electron 应用
2. **创建/打开项目**: 
   - 新建: 选择目录 → 输入项目名称
   - 打开: 选择现有的 `.json` 配置文件
3. **配置模型**: 通过可视化界面配置数据模型
4. **生成代码**: 点击导出按钮生成代码文件

## 📄 许可证

本项目采用 MIT 许可证，详见 LICENSE 文件。

---

## 🔧 开发指南

### 代码规范
- 使用 TypeScript 严格模式
- 遵循 ESLint 配置规则
- 组件命名采用 PascalCase
- 文件命名采用 kebab-case

### 调试指南
1. **前端调试**: 使用 Vue DevTools
2. **Electron 调试**: 启用开发者工具
3. **生成器调试**: 使用 console.log 和日志文件
4. **状态调试**: Pinia DevTools 扩展

### 性能优化
- **组件懒加载**: 大型组件按需加载
- **虚拟滚动**: 长列表优化
- **缓存策略**: 合理使用本地存储
- **内存管理**: 及时清理无用对象

此文档将随项目发展持续更新，确保信息的准确性和实用性。