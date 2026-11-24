import { createAgent, tool } from "langchain";
import { ChatDeepSeek } from "@langchain/deepseek";
import { MemorySaver } from "@langchain/langgraph";

import * as z from "zod";

const SYSTEM_PROMPT = `You are a literary data assistant.

## Capabilities

- \`fetch_text_from_url\`: loads document text from a URL into the conversation.
Do not guess line counts or positions—ground them in tool results from the saved file.`;

const checkpointer = new MemorySaver();

// 工具
const getWeather = tool(
  ({ city }) => `It's always sunny in ${city}!`,
  {
    name: "get_weather",
    description: "Get the weather for a given city",
    schema: z.object({ city: z.string().describe("The city to get the weather for") }),
  }
);

const fetchTextFromUrl = tool(
    async ({ url }: { url: string }): Promise<string> => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 120_000);
        try {
            const resp = await fetch(url, {
                headers: {
                "User-Agent": "Mozilla/5.0 (compatible; quickstart-research/1.0)",
                },
                signal: controller.signal,
            });
            if (!resp.ok) {
                return `Fetch failed: HTTP ${resp.status} ${resp.statusText}`;
            }
            return await resp.text();
        } catch (e) {
            const msg = e instanceof Error ? e.message : String(e);
            return `Fetch failed: ${msg}`;
        } finally {
            clearTimeout(timeoutId);
        }
    },
    {
        name: "fetch_text_from_url",
        description: "Fetch the document from a URL.",
        schema: z.object({ url: z.string().url() }),
    },
);

// Agent
const agent = createAgent({
  model: new ChatDeepSeek({ model: "deepseek-flash" }), // 自动读取 DEEPSEEK_API_KEY
  tools: [fetchTextFromUrl],
  systemPrompt: SYSTEM_PROMPT,
  checkpointer
});

 const content = `获取这个链接中内容的创作背景，简析：https://www.guwendao.net/shiwenv_c35a60c1a8e2.aspx`;

// 运行
console.log("Running createAgent...");
const { messages } = await agent.invoke({
  messages: [{ role: "user", content }]},
 { configurable: { thread_id: "great-gatsby-lc" } },
);
console.log(messages[messages.length - 1]!.contentBlocks);
const agentMessages = messages;
