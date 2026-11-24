# LangChain Demo

一个使用 LangChain.js 和 DeepSeek 的最小 Agent 示例：定义一个查询天气的工具，让模型在回答用户问题时自动调用它。

> 当前 `get_weather` 工具返回的是固定文本 `It's always sunny in <city>!`，不会请求真实的天气服务，主要用于演示工具调用流程。

## 环境要求

- Node.js 20.6 或更高版本（需要支持 `node --env-file`）
- npm
- DeepSeek API Key

## 快速开始

1. 安装依赖：

   ```bash
   npm install
   ```

2. 在项目根目录创建 `.env` 文件，并填入从 DeepSeek 开放平台获取的 API Key：

   ```dotenv
   DEEPSEEK_API_KEY=your_api_key
   ```

   `.env` 已被 [.gitignore](.gitignore) 忽略，请勿将 API Key 提交到仓库。

3. 运行示例：

   ```bash
   npm start
   ```

   `npm start` 实际执行 `node --env-file=.env app.js`，会调用 DeepSeek API，因此可能产生相应费用。终端会打印 Agent 的最终回复，通常包含 `It's always sunny in San Francisco!`；具体措辞由模型生成。

## 代码说明

[app.js](app.js) 中的主要流程：

1. 使用 `tool()` 和 Zod schema 定义 `get_weather` 工具，声明它接收一个 `city` 字符串参数。
2. 使用 `createAgent()` 创建 Agent，指定 `ChatDeepSeek` 模型和可用工具。
3. 调用 `agent.invoke()`，传入问题 `What's the weather in San Francisco?`，并输出最后一条消息的内容。

`ChatDeepSeek` 会自动读取环境变量 `DEEPSEEK_API_KEY`。如需调整，可以修改 [app.js](app.js) 中的模型名称、用户问题或工具实现。

## 项目结构

```text
.
├── app.js            # Agent、工具定义及运行入口
├── package.json      # 依赖和启动脚本
├── package-lock.json # 依赖锁定文件
└── .env              # 本地环境变量（已忽略，不会提交）
```

主要依赖为 `langchain`、`@langchain/deepseek` 和 `zod`；`package.json` 中虽安装了 `@langchain/openai`，但当前示例并未使用它。
