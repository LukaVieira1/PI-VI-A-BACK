import * as ScheduleController from "../controllers/schedule-controller.js";
import { validateRequest } from "../middleware/auth.js";
export default {
  Create: {
    method: "POST",
    url: "/schedules",
    preHandler: [validateRequest],
    handler: ScheduleController.create,
  },
  // Delete: {
  //   method: "DELETE",
  //   url: "/petweets/:id",
  //   preHandler: [validateRequest],
  //   handler: PetweetController.del,
  // },
  // GetAll: {
  //   method: "GET",
  //   url: "/petweets",
  //   preHandler: [validateRequest, paginationParams],
  //   handler: PetweetController.getAll,
  // },
  // GetByID: {
  //   method: "GET",
  //   url: "/petweets/:id",
  //   preHandler: [validateRequest, paginationParams],
  //   handler: PetweetController.getByID,
  // },
};
