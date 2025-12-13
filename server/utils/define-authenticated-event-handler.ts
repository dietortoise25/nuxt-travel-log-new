import type { H3Event, H3EventContext } from "h3";

import type { UserWithId } from "../lib/auth";

type AuthenticatedEvent = H3Event & {
  context: H3EventContext & {
    user: UserWithId;
  };
};

/**
 * 高阶函数：用于创建需要身份验证的事件处理器
 *
 * 这个函数包装任何事件处理器，确保只有经过身份验证的用户才能访问
 * 如果用户未登录，返回401未授权错误
 *
 * @param handler - 原始的事件处理器函数
 * @returns 包装后的处理器，包含身份验证检查
 */
export default function defineAuthenticatedEventHandler<T>(
  handler: (event: AuthenticatedEvent) => T,
) {
  return defineEventHandler(async (event) => {
    // 检查事件上下文中是否存在用户信息
    // 该信息通常由身份验证中间件（如 server/middleware/auth.ts）设置
    if (!event.context.user) {
      return sendError(event, createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      }));
    }

    // 用户已通过身份验证，执行原始处理器
    return handler(event as AuthenticatedEvent);
  });
}
