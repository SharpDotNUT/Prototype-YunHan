## 2.5.0 - The Gods' Limits / 「神的局限性」 (2025-07-09)

- **TQRT**:
  - New feature.
  - 新功能。

## 2.4.1 (2025-07-07)

- **RM**:
  - Resource pull from Cloudflare Pages / https://yunhan-meta.pages.dev
  - 资源从 Cloudflare Pages / https://yunhan-meta.pages.dev 拉取

## 2.4.0 For the Sun is Set to Die / 因为太阳将要毁伤 (2025-06-21)

- **Gacha / 抽卡**:
  - Added the "Data" section
  - 添加了「数据」板块
- **App**:
  - Support to check and get updates支持检查并获取更新
  - Enhance TypeScript typing
  - 增强 TypeScript 类型化
  - Delete redundant components
  - 删除多余组件
  - Make the "Update Dialog" can be displayed normally
  - 使「更新提示」可以正常展示

## 2.3.2 (2025-06-07)

- **Music Player / 音乐播放器**:
  - Fixed the issue of abnormal display of album aliases
  - 修复了专辑别名显示不正常的问题
  - Added shadow and hover effects to album cover images
  - 为专辑封面图添加阴影和悬浮特效
  - Set album cover images as background images
  - 设置专辑封面图模糊为背景图
  - Optimized title display logic
  - 优化了标题显示逻辑
  - Use UNPKG instead of JSDeliver to ensure normal access in China
  - 使用 UNPKG 替换 JSDeliver 确保在中国的正常访问
- **RM**:
  - Use new architecture
  - 采用全新架构
  - Fixed the problem of content not being displayed when entering the page for the first time because the metadata was not loaded
  - 修复了首次进入页面时因为元数据未加载导致的无内容

## 2.3.1 - Star Rail Live / 星穹铁道演唱会 (2025-05-03)

- **Music Player / 音乐播放器**:
  - Resource use JSDelivr to pull from github:kuriyota/hoyomix-netease-cloud-music
  - 资源使用 JSDelivr 从 github:kuriyota/hoyomix-netease-cloud-music 拉取
- **Update Log / 更新日志**:
  - Simplified interface, optimized font and spacing.
  - 简化界面，优化字体和间距。
- **About / 关于页**:
  - Fixed the problem that could cause the page to crash if the latest commit could not be obtained
  - 修复了无法获取最新提交会导致页面崩溃的问题
- **RM**:
  - Resource use JSDelivr to pull from github:Prototype-YunHan.QuizBank
  - 资源使用 JSDelivr 从 github:Prototype-YunHan.QuizBank 拉取
- **quiz**:
  - Change resource path / 更改资源路径

## 2.3.0 - Anaksagoras / 阿那克萨戈拉斯 (2025-05-01)

- **quiz**:
  - Released Alpha version, basically complete, can be used.
  - 发布 Alpha 版本，基本完善，可以使用。
- **App**:
  - Use IndexDB to replace Web Cache API to store data
  - 使用 IndexDB 替换 Web Cache API 存储数据
- **achievement**:
  - Support import achievements and browse completion progress
  - 支持导入成就和浏览完成进度
- **Music Player / 音乐播放器**:
  - Change path to `/music-player`
  - 改变路径为 `/music-player`
  - Use "Resource Manager"
  - 使用「资源管理器」
  - Fix bug caused by DOM unmount when exiting
  - 修复退出时由于 DOM 卸载导致的 bug

## 2.2.0 - Castorice / 遐蝶 (2025-04-20)

- **App**:
  - Use "Resource Manager" to manage resources
  - 使用「资源管理器」来管理资源
  - English font replaced back to Noto Sans
  - 英文字体由 Outfit 替换会 Noto Sans
  - TypeScript migration is basically complete
  - TypeScript 迁移基本完成
- **Setting/ 设置**:
  - Optimize the setting interface, change to secondary page
  - 优化设置界面，改为二级页面
  - Support resource management initially
  - 初步支持资源管理

## 2.1.1 (2025-04-04)

- **App**:
  - Enhanced TypeScript support
  - 增强 TypeScript 支持
  - Component library changed to full import
  - 组件库改为全量引入
- **Dictionary/ 辞典**:
  - Changed to home and secondary page mechanism
  - 改为首页和二级页面机制
  - Optimized interface
  - 优化界面
  - Used virtual scrolling to improve performance
  - 使用虚拟滚动提高性能
  - Search results will be updated in real time based on the input keyword
  - 搜索结果将根据输入的关键词实时更新
- **Translator/ 翻译器**:
  - Imitated the interface of Google Translate
  - 模仿 Google Translate 的界面
  - Optimized the interface and interaction
  - 优化了界面和交互
  - The soft keyboard will open in a new dialog box to avoid conflicts with the input box
  - 软键盘将在一个新的对话框中打开，以避免与输入框的冲突
- **Intro / 介绍页**:
  - The "Use Now" button will now directly jump to the homepage
  - 「立即使用」按钮现在将直接跳转到主页

## 2.1.0 (2025-03-31)

- **Locale / 本地化**:
  - Improved translation
  - 改进翻译
- **App**:
  - Renamed to "Prototype · Yun Han"
  - 改名为「试作 · 云翰」
- **Update Log / 更新日志**:
  - Updated README.md
  - 更新了 README.md

## 2.0.1 (2025-03-30)

- **Update Log / 更新日志**:
  - Added translation for area list
  - 补充了功能列表的翻译
  - Optimized font display in Japanese
  - 优化了在日文下的字体展示
  - Changed path to `/update-log`
  - 更改路径为 `/update-log`

## 2.0.0 - Stage Lucida / 红毹婵娟 (2025-03-30)

- **Update Log / 更新日志**:
  - Added "Update Log" feature
  - 添加了「更新日志」功能
- **docs**:
  - Updated README.md
  - 更新了 README.md
- **song-player**:
  - Optimized font display
  - 优化字体展示
  - Adapted to mobile devices
  - 适配手机端
- **App**:
  - Bump Vue@3.5, Vite@6
  - 升级 Vue@3.5，Vite@6
