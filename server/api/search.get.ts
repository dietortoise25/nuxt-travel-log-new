import z from "zod";

import defineAuthenticatedEventHandler from "../utils/define-authenticated-event-handler";
import sendZodError from "../utils/send-zod-error";

const searchSchema = z.object({
  q: z.string().min(1),
});

export default defineAuthenticatedEventHandler(async (event) => {
  const result = await getValidatedQuery(event, searchSchema.safeParse);

  if (!result.success)
    return sendZodError(event, result.error);

  try {
    // 使用 $fetch 替代原生 fetch，可能有更好的网络处理
    const data = await $fetch(
      `https://nominatim.openstreetmap.org/search?${new URLSearchParams({
        q: result.data.q,
        format: "json",
      })}`,
      {
        timeout: 10000,
        headers: {
          "User-Agent": "nuxt-travel-log-new",
          "Accept": "application/json",
        },
        retry: 1, // 允许一次重试
      },
    );

    return data;
  }
  catch (error) {
    console.error("Search API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    // 如果是网络超时错误，提供更有用的信息
    if (errorMessage.includes("timeout") || errorMessage.includes("aborted")) {
      return sendError(event, createError({
        statusCode: 408, // Request Timeout
        statusMessage: "Search request timed out. Please try again.",
      }));
    }

    return sendError(event, createError({
      statusCode: 504,
      statusMessage: `Unable to reach search API: ${errorMessage}`,
    }));
  }
});
