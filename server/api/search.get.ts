import type { NominatimResult } from "#shared/utils/zod-schema";

import { SearchSchema } from "#shared/utils/zod-schema";

import defineAuthenticatedEventHandler from "../utils/define-authenticated-event-handler";
import sendZodError from "../utils/send-zod-error";

export default defineAuthenticatedEventHandler(
  defineCachedEventHandler(async (event) => {
    const result = await getValidatedQuery(event, SearchSchema.safeParse);

    if (!result.success)
      return sendZodError(event, result.error);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?${new URLSearchParams({
          q: result.data.q,
          format: "json",
        })}`,
        {
          headers: {
            "User-Agent": "nuxt-travel-log-new-alan",
            "Accept": "application/json",
          },
        },
      );

      const data = await res.json() as NominatimResult[];

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
  }, {
    maxAge: 60 * 60 * 24,
    name: "search-map",
    getKey: (event) => {
      const query = getQuery(event);
      return (query.q?.toString() || "") as string;
    },
  }),
);
