import * as ScheduleController from "../controllers/schedule-controller.js";
import { validateRequest } from "../middleware/auth.js";
export default {
  Create: {
    method: "POST",
    url: "/schedules",
    preHandler: [validateRequest],
    handler: ScheduleController.create,
  },
  Update: {
    method: "PATCH",
    url: "/schedules/:id",
    preHandler: [validateRequest],
    handler: ScheduleController.update,
  },
  Get: {
    method: "GET",
    url: "/schedules",
    preHandler: [validateRequest],
    handler: ScheduleController.get,
  },
};
