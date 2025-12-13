import { getLocationsByUserId } from "../db/queries/location";
import defineAuthenticatedEventHandler from "../utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
  // 获取当前用户的所有位置
  return getLocationsByUserId(event.context.user.id);
});
