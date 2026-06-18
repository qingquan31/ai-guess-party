# AI猜物派对

多人在线 AI 猜物游戏。服务器保存答案库，创建房间后调用 DeepSeek 动态生成问题卡。

## 本地运行

```powershell
cd D:\ai-game\xuancicaiwu
copy .env.example .env
# 编辑 .env，填入 AI_API_KEY
node server.js
```

打开 `http://localhost:5173/`。

## 部署

项目包含 `render.yaml`，可部署到 Render Web Service。

需要在部署平台配置环境变量：

- `AI_API_KEY`
- `AI_API_URL`
- `AI_FAST_MODEL`
- `AI_QUALITY_MODEL`
- `AI_QUALITY_THINKING`
- `AI_QUALITY_REASONING_EFFORT`

不要把 `.env` 上传到 Git。
