import { createAgent, tool } from "langchain";
import { ChatDeepSeek } from "@langchain/deepseek";
import * as z from "zod";

// 工具
const getWeather = tool(
  ({ city }) => `It's always sunny in ${city}!`,
  {
    name: "get_weather",
    description: "Get the weather for a given city",
    schema: z.object({ city: z.string().describe("The city to get the weather for") }),
  }
);

// Agent
const agent = createAgent({
  model: new ChatDeepSeek({ model: "deepseek-flash" }), // 自动读取 DEEPSEEK_API_KEY
  tools: [getWeather],
});

// 运行
const { messages } = await agent.invoke({
  messages: [{ role: "user", content: "What's the weather in San Francisco?" }],
});
console.log(messages.at(-1).content);
