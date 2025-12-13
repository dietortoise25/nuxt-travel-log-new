import type { LibsqlError } from "@libsql/client";
import type { DrizzleQueryError } from "drizzle-orm";

import slugify from "slug";

import { findLocationByName, findUniqueSlug, insertLocation } from "../db/queries/location";
import { InsertLocation } from "../db/schema";
import defineAuthenticatedEventHandler from "../utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
  const result = await readValidatedBody(event, InsertLocation.safeParse);

  if (!result.success) {
    const statusMessage = result
      .error
      .issues
      .map(issue => `${issue.path.join("")}: ${issue.message}`)
      .join("; ");

    const data = result
      .error
      .issues
      .reduce((errors, issue) => {
        errors[issue.path.join("")] = issue.message;
        return errors;
      }, {} as Record<string, string>);

    return sendError(event, createError({
      statusCode: 422,
      statusMessage,
      data,
    }));
  }

  // 检查用户是否已创建同名位置
  const existingLocation = await findLocationByName(result.data, event.context.user.id);

  if (existingLocation) {
    return sendError(event, createError({
      statusCode: 409,
      statusMessage: "You already have a location with this name. Please choose a different name.",
    }));
  }

  // 生成唯一 slug
  const slug = await findUniqueSlug(slugify(result.data.name));

  try {
    return insertLocation(result.data, slug, event.context.user.id);
  }
  catch (e) {
    const error = e as DrizzleQueryError;
    const libsqlError = error.cause as LibsqlError;

    // 处理 UNIQUE constraint 错误
    if (libsqlError?.code === "SQLITE_CONSTRAINT") {
      // 检查是 name+userId 冲突还是 slug 冲突
      if (libsqlError?.message.includes("UNIQUE constraint failed: location.name")) {
        return sendError(event, createError({
          statusCode: 409,
          statusMessage: "You already have a location with this name. Please choose a different name.",
        }));
      }

      if (libsqlError?.message.includes("UNIQUE constraint failed: location.slug")) {
        return sendError(event, createError({
          statusCode: 409,
          statusMessage: "A location with this identifier already exists. Please try again.",
        }));
      }

      // 其他约束错误
      return sendError(event, createError({
        statusCode: 400,
        statusMessage: "Database constraint violation. Please check your data.",
      }));
    }

    // 对于其他未知错误，重新抛出
    throw error;
  }
});
