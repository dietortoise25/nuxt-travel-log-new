import { findLocationByUserId } from "../../db/queries/location";
import defineAuthenticatedEventHandler from "../../utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
  // await new Promise(resolve => setTimeout(resolve, 2000));
  const slug = getRouterParam(event, "slug") as string;
  const location = await findLocationByUserId(slug, event.context.user.id);

  if (!location) {
    return sendError(event, createError({
      statusCode: 404,
      statusMessage: "Location Not Found.",
    }));
  }
  return location;
});
