import { findLocationsByUserId } from "../db/queries/location";
import defineAuthenticatedEventHandler from "../utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
  // await new Promise(resolve => setTimeout(resolve, 2000));

  // 获取当前用户的所有位置
  return findLocationsByUserId(event.context.user.id);
});
