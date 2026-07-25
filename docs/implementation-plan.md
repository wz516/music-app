# AI 乐谱到音乐成品平台实施方案

## 技术选型

建议使用 TypeScript 贯穿前后端与音乐处理核心：

- Web/App：React 或 Next.js + TypeScript，用于上传、读谱校对、钢琴卷帘、五线谱编辑、练习和发布页面。
- 音乐核心：独立 TypeScript 包，统一 `ScoreDocument` 数据结构，连接 OMR、编辑器、播放、人性化演奏、编曲和导出模块。
- OMR 服务：Python FastAPI + PyTorch/ONNX，先接入 Audiveris/MuseScore/自研模型，输出 MusicXML，再转成内部模型。
- 音频服务：Node.js 队列 + Python/音频渲染 Worker，MIDI 预听用 WebAudio/Tone.js，成品导出用 SoundFont、采样器或云端渲染。
- 存储：PostgreSQL 保存项目与版本，S3 兼容对象存储保存图片、MusicXML、MIDI、WAV/MP3。

## 产品闭环

1. 上传乐谱图片或 PDF。
2. OMR 识别为可编辑乐谱，并保留每个音符、符号、小节的置信度与原图坐标。
3. 进入校对模式：低置信度位置高亮，用户可直接修改音高、时值、连线、歌词和小节线。
4. 播放模式：先生成 MIDI，再通过 timing、velocity、articulation、人声/乐器模型做真人化演奏。
5. 练习模式：分手、变速、循环小节、节拍器、跟弹评分。
6. 改编模式：基于旋律生成低音、和声、鼓组、伴奏型和不同风格版本。
7. 制作模式：混音、音色、自动母带、封面和元数据。
8. 导出/分享：MusicXML、MIDI、PDF、WAV、MP3、分享链接。

## MVP 里程碑

### M1：可编辑识别结果

- 定义统一乐谱模型。
- 上传图片后生成 MusicXML/内部 JSON。
- 展示原图与识别结果的左右对照。
- 低置信度音符自动加入待修复列表。

### M2：接近真人的播放

- 实现非破坏式 performance layer，不修改原始谱面。
- 为每个音符生成 timing offset、velocity delta、articulation。
- 支持曲风/乐器 preset。

### M3：从乐谱到成品

- 自动生成 melody、bass、harmony、drums 轨道。
- 支持一键导出 MIDI/WAV/MP3。
- 支持项目版本和公开分享页。

## 当前仓库已开始实现的代码

本次提交先建立了无外部运行时依赖的 TypeScript 音乐核心原型，覆盖三个竞争力关键点：

- `analyzeRecognition`：把低置信度识别结果转为可校对问题列表。
- `humanizePerformance`：生成不破坏原谱的真人化演奏层。
- `createStarterArrangement`：从旋律生成基础低音与和声轨。
- `buildProductionProject`：把识别、演奏、编曲和导出目标串成一个产品管线。

后续可以在此核心层之外逐步接入 React 编辑器、OMR 服务、音频渲染与云端发布。

## 如何打开本地测试版

现在仓库包含一个不依赖前端框架的浏览器 Demo，可用于验证产品流程：

1. 执行 `npm run start`；脚本会先编译 TypeScript 音乐核心，再启动本地静态服务器。
2. 在浏览器打开 `http://localhost:4173`。
3. 点击“运行示例乐谱”，检查识别校对、真人化演奏预览、自动编曲轨道和导出格式。
4. 如需命令行自动冒烟检查，执行 `npm run smoke`，它会确认首页、前端脚本和编译后的音乐核心模块都能通过本地服务器访问。

这个 Demo 暂时用内置样例模拟 OMR 输出；上传控件已经预留，下一步可以把文件传给 OMR API，并用真实 MusicXML/JSON 替换内置样例。若你看到 GitHub 提示 `docs/implementation-plan.md` 或 `package.json` 冲突，请保留本节的 `start`、`serve`、`smoke` 脚本说明，因为它们是打开测试版所需的入口。
