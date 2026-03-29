# 镜像翻译器 (Mirror Translator)

一个面向面对面沟通的实时语音翻译应用，文字采用镜像设计，方便外国人和中国人各自阅读自己的语言。

## 功能特点

- 🎤 **实时语音识别** - 点击麦克风说话，自动识别中英文
- 🔄 **实时翻译** - 自动翻译成另一种语言
- 📱 **镜像显示** - 上下两部分文字都是镜像的，面对面时各自看自己那边都是正向阅读
- ⚙️ **可配置** - 支持自定义翻译 API 地址和密钥

## 使用方法

### 1. 启动服务

由于浏览器安全限制，语音识别需要 HTTPS 或 localhost 环境：

```bash
# 使用 Python 启动简单服务器
cd mirror-translator
python -m http.server 8080
```

然后在浏览器打开: http://localhost:8080

### 2. 使用流程

1. 打开页面后，点击右上角设置按钮，配置翻译 API
2. 中国人点击上半部分的麦克风，说中文
3. 系统自动识别并翻译成英文，显示在下半部分
4. 外国人点击下半部分的麦克风，说英文
5. 系统自动识别并翻译成中文，显示在上半部分

### 3. 镜像说明

```
┌─────────────────────────────┐  ← 外国人看这半边
│ 你好，朋友！ (镜像文字)        │
├─────────────────────────────┤
│ Hello, friend! (镜像文字)    │  ← 中国人看这半边
└─────────────────────────────┘
```

## 浏览器兼容性

- Chrome (推荐)
- Edge
- Safari (部分支持)
- Firefox (不支持语音识别)

## 翻译 API

默认使用 LibreTranslate 公共 API，也可自建或使用其他兼容 API：

- [LibreTranslate](https://libretranslate.com) - 开源免费
- [Argos Translate](https://github.com/argosopentech/ArgosTranslate) - 自建方案
- [Google Translate API](https://cloud.google.com/translate) - 付费方案

## 注意事项

1. 必须允许麦克风权限
2. 需要网络连接进行翻译
3. 语音识别在 Chrome/Edge 中效果最佳

