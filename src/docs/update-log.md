## 2.5.3 (2025-07-14) - 圣杯战争 / The Holy Grail War

- **Locale / 本地化**:
  - 增强本地化功能逻辑，引入 `locale-matcher`
  - Improve localization logic, introduce `locale-matcher`
- **Intro / 介绍页**
  - 添加打字机动画
  - Add typing animation
- **Dictionary / 辞典**:
  - 重构 UI & UX
  - Refactor UI & UX
  - 支持复制功能
  - Add copy function
  - 使用 Web Speech API 支持 TTS 功能，并支持选择语音
  - Use Web Speech API to support TTS function, and support selecting voice
  - 添加了对 `note` 词条的展示
  - Add display of `note` entries
- **RM / 资源管理器**
  - 功能上支持下载进度
  - Support download progress function
- **App / 应用**
  - 改变了更新提示的展示方式，现在展示在页面最上方
  - Changed the way update prompts are displayed, now displayed at the top of the page
  - 在首次浏览新版本时，展示「更新日志」
  - Show "Update Log" when browsing a new version for the first time

## 2.5.2 (2025-07-12) - 契约胜利之剑 / Excalibur

- **Translator / 翻译器**:
  - 修复文本框自动调整大小功能
  - Fix textbox auto-resize
  - 添加导出图片功能
  - Add export image feature
  - 从 NPM 包获取字体和元数据
  - Get fonts and metadata from NPM
- **Music player / 音乐播放器**:
  - 增强错误处理
  - Improve error handling
- **Dictionary / 辞典**:
  - 使用 Pinia 状态管理统筹逻辑
  - Use Pinia states manager to manage logic
  - 更改数据结构
  - Change data structure
  - 为中文添加注音
  - Add pinyin for Chinese
  - 改进 UI & UX：配色，布局
  - Improve UI & UX: color, layout
  - 移除搜索语言选择功能，选择默认搜索所有语言
  - Remove language selection for search, select all languages by default
- **App / 应用**:
  - 移除 `wait-for-meta` 页面
  - Remove `wait-for-meta` page
- **RM**
  - 更改逻辑，加强异步
  - Change logic, improve asynchronous

## 2.5.1 (2025-07-09) - Fate / Stay Night

- **Locale / 本地化**:
  - 扁平化 JSON 数据
  - Flatten JSON data
  - 在设置界面展示翻译完成度
  - Show translation completion in settings
  - 当切换到未完全翻译的语言时，触发提示
  - Trigger prompt when switching to a language that is not fully translated
- **Update Log / 更新日志**:
  - 使用 Markdown 作为更新日志
  - Use Markdown as update log

## 2.5.0 (2025-07-09) - The Gods' Limits / 「神的局限性」 (2025-07-09)

- **TQRT**:
  - 新功能：
    - 文本速查速译
    - 词条资源管理器
  - New feature.
    - Text Quick Reference & Translation
    - Text Mapgit push --set-upstream origin main Resource Manager

## 2.4.1 (2025-07-07)

- **RM**:
  - 资源从 Cloudflare Pages `https://yunhan-meta.pages.dev` 拉取
  - Resource pull from Cloudflare Pages `https://yunhan-meta.pages.dev`

## 2.4.0 For the Sun is Set to Die / 因为太阳将要毁伤 (2025-06-21)

- **Gacha / 抽卡**:
  - 添加了「数据」板块
  - Added the "Data" section
- **App**:
  - 支持检查并获取更新
  - Support to check and get updates
  - 增强 TypeScript 类型化
  - Enhance TypeScript typing
  - 删除多余组件
  - Delete redundant components
  - 使「更新提示」可以正常展示
  - Make the "Update Dialog" can be displayed normally

## 2.3.2 (2025-06-07)

- **Music Player / 音乐播放器**:
  - 修复了专辑别名显示不正常的问题
  - Fixed the issue of abnormal display of album aliases
  - 为专辑封面图添加阴影和悬浮特效
  - Added shadow and hover effects to album cover images
  - 设置专辑封面图模糊为背景图
  - Set album cover images as background images
  - 优化了标题显示逻辑
  - Optimized title display logic
  - 使用 UNPKG 替换 JSDeliver 确保在中国的正常访问
  - Use UNPKG instead of JSDeliver to ensure normal access in China
- **RM**:
  - 采用全新架构
  - Use new architecture
  - 修复了首次进入页面时因为元数据未加载导致的无内容
  - Fixed the problem of content not being displayed when entering the page for the first time because the metadata was not loaded

## 2.3.1 - Star Rail Live / 星穹铁道演唱会 (2025-05-03)

- **Music Player / 音乐播放器**:
  - 资源使用 JSDelivr 从 `github:kuriyota/hoyomix-netease-cloud-music` 拉取
  - Resource use JSDelivr to pull from `github:kuriyota/hoyomix-netease-cloud-music`
- **Update Log / 更新日志**:
  - 简化界面，优化字体和间距。
  - Simplified interface, optimized font and spacing.
- **About / 关于页**:
  - 修复了无法获取最新提交会导致页面崩溃的问题
  - Fixed the problem that could cause the page to crash if the latest commit could not be obtained
- **RM**:
  - 资源使用 JSDelivr 从 `github:Prototype-YunHan.QuizBank` 拉取
  - Resource use JSDelivr to pull from `github:Prototype-YunHan.QuizBank`
- **quiz**:
  - 更改资源路径
  - Change resource path

## 2.3.0 - Anaksagoras / 阿那克萨戈拉斯 (2025-05-01)

- **quiz**:
  - 发布 Alpha 版本，基本完善，可以使用。
  - Released Alpha version, basically complete, can be used.
- **App**:
  - 使用 IndexDB 替换 Web Cache API 存储数据
  - Use IndexDB to replace Web Cache API to store data
- **achievement**:
  - 支持导入成就和浏览完成进度
  - Support import achievements and browse completion progress
- **Music Player / 音乐播放器**:
  - 改变路径为 `/music-player`
  - Change path to `/music-player`
  - 使用「资源管理器」
  - Use "Resource Manager"
  - 修复退出时由于 DOM 卸载导致的 bug
  - Fix bug caused by DOM unmount when exiting

## 2.2.0 - Castorice / 遐蝶 (2025-04-20)

- **App**:
  - 使用「资源管理器」来管理资源
  - Use "Resource Manager" to manage resources
  - 英文字体由 `Outfit` 替换会 `Noto Sans`
  - English font replaced back to `Noto Sans` from `Outfit`
  - TypeScript 迁移基本完成
  - TypeScript migration is basically complete
- **Setting/ 设置**:
  - 优化设置界面，改为二级页面
  - Optimize the setting interface, change to secondary page
  - 初步支持资源管理
  - Support resource management initially

## 2.1.1 (2025-04-04)

- **App**:
  - 增强 TypeScript 支持
  - Enhanced TypeScript support
  - 组件库改为全量引入
  - Component library changed to full import
- **Dictionary/ 辞典**:
  - 改为首页和二级页面机制
  - Changed to home and secondary page mechanism
  - 优化界面
  - Optimized interface
  - 使用虚拟滚动提高性能
  - Used virtual scrolling to improve performance
  - 搜索结果将根据输入的关键词实时更新
  - Search results will be updated in real time based on the input keyword
- **Translator/ 翻译器**:
  - 模仿 Google Translate 的界面
  - Imitated the interface of Google Translate
  - 优化了界面和交互
  - Optimized the interface and interaction
  - 软键盘将在一个新的对话框中打开，以避免与输入框的冲突
  - The soft keyboard will open in a new dialog box to avoid conflicts with the input box
- **Intro / 介绍页**:
  - 「立即使用」按钮现在将直接跳转到主页
  - The "Use Now" button will now directly jump to the homepage

## 2.1.0 (2025-03-31)

- **Locale / 本地化**:
  - 改进翻译
  - Improved translation
- **App**:
  - 改名为「试作 · 云翰」
  - Renamed to "Prototype · Yun Han"
- **Update Log / 更新日志**:
  - 更新了 README.md
  - Updated README.md

## 2.0.1 (2025-03-30)

- **Update Log / 更新日志**:
  - 补充了功能列表的翻译
  - Added translation for area list
  - 优化了在日文下的字体展示
  - Optimized font display in Japanese
  - 更改路径为 `/update-log`
  - Changed path to `/update-log`

## 2.0.0 - Stage Lucida / 红毹婵娟 (2025-03-30)

- **Update Log / 更新日志**:
  - 添加了「更新日志」功能
  - Added "Update Log" feature
- **docs**:
  - 更新了 README.md
  - Updated README.md
- **song-player**:
  - 优化字体展示
  - Optimized font display
  - 适配手机端
  - Adapted to mobile devices
- **App**:
  - 升级 Vue@3.5，Vite@6
  - Bump Vue@3.5, Vite@6
