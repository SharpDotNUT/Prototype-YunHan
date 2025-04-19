import type { t_UpdateLog } from './types'

const log: t_UpdateLog = [
  {
    version: '2.2.0',
    'name-zh': '遐蝶',
    'name-en': 'Castorice',
    date: '2025-04-20T00:00:00+0800',
    items: [
      {
        area: 'app',
        type: 'Feature',
        'content-zh': '使用「资源管理器」来管理资源',
        'content-en': 'Use "Resource Manager" to manage resources'
      },
      {
        area: 'app',
        type: 'UI & UX',
        'content-zh': '英文字体由 Outfit 替换会 Noto Sans',
        'content-en': 'English font replaced back to Noto Sans'
      },
      {
        area: 'app',
        type: 'Development',
        'content-zh': 'TypeScript 迁移基本完成',
        'content-en': 'TypeScript migration is basically complete'
      },
      {
        area: 'setting',
        type: 'UI & UX',
        'content-zh': '优化设置界面，改为二级页面，初步支持资源管理',
        'content-en':
          'Optimize the setting interface, change to secondary page, support resource management initially'
      }
    ]
  },
  {
    version: '2.1.1',
    date: '2025-04-04T23:00:00+0800',
    items: [
      {
        area: 'app',
        type: 'Development',
        'content-zh':
          '增强 TypeScript 支持；组件库改为全量引入；升级 Vue-I18n@11',
        'content-en':
          'Enhanced TypeScript support; component library changed to full import; upgraded Vue-I18n@11'
      },
      {
        area: 'dictionary',
        type: 'UI & UX',
        'content-zh':
          '改为首页和二级页面机制，为后续功能扩展做准备；优化界面；使用虚拟滚动提高性能；' +
          '搜索结果将根据输入的关键词实时更新',
        'content-en':
          'Changed to home and secondary page mechanism, preparing for future feature expansion; ' +
          'optimized interface; used virtual scrolling to improve performance; ' +
          'search results will be updated in real time based on the input keyword'
      },
      {
        area: 'translator',
        type: 'UI & UX',
        'content-zh':
          '模仿 Google Translate 的界面，优化了界面和交互；' +
          '软键盘将在一个新的对话框中打开，以避免与输入框的冲突',
        'content-en':
          'Imitated the interface of Google Translate, optimized the interface and interaction;' +
          'the soft keyboard will open in a new dialog box to avoid conflicts with the input box'
      },
      {
        area: 'index',
        type: 'UI & UX',
        'content-zh': '「立即使用」按钮现在将直接跳转到主页',
        'content-en':
          'The "Use Now" button will now directly jump to the homepage'
      }
    ]
  },
  {
    version: '2.1.0',
    date: '2025-03-31T22:30:00+0800',
    items: [
      {
        area: 'i18n',
        type: 'Performance',
        'content-zh': '改进翻译',
        'content-en': 'Improved translation'
      },
      {
        area: 'app',
        type: 'Performance',
        'content-zh': '改名为「试作 · 云翰」',
        'content-en': 'Renamed to "Prototype · Yun Han"'
      },
      {
        area: 'update-log',
        type: 'Performance',
        'content-zh': '更新了 README.md',
        'content-en': 'Updated README.md'
      }
    ]
  },
  {
    version: '2.0.1',
    date: '2025-03-30T12:00:00+0800',
    items: [
      {
        area: 'update-log',
        type: 'UI & UX',
        'content-zh': '补充了功能列表的翻译；优化了在日文下的字体展示',
        'content-en':
          'Added translation for area list; optimized font display in Japanese'
      },
      {
        area: 'update-log',
        type: 'Others',
        'content-zh': '更改路径为 `/update-log`',
        'content-en': 'Changed path to `/update-log`'
      }
    ]
  },
  {
    version: '2.0.0',
    date: '2025-03-30T00:00:00+0800',
    'name-zh': '红毹婵娟',
    'name-en': 'Stage Lucida',
    items: [
      {
        area: 'update-log',
        type: 'Feature',
        'content-zh': '添加了「更新日志」功能',
        'content-en': 'Added "Update Log" feature'
      },
      {
        area: 'docs',
        type: 'Performance',
        'content-zh': '更新了 README.md',
        'content-en': 'Updated README.md'
      },
      {
        area: 'song-player',
        type: 'UI & UX',
        'content-zh': '优化字体展示，适配手机端',
        'content-en': 'Optimized font display, adapted to mobile devices'
      },
      {
        area: 'app',
        type: 'Others',
        'content-zh': '升级 Vue@3.5，Vite@6',
        'content-en': 'Bump Vue@3.5, Vite@6'
      }
    ]
  }
]

export default log
