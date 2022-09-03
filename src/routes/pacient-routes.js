import { validateRequest } from "../middleware/auth.js";
import * as PacientController from "../controllers/pacient-controller.js";

export default {
  getAllPacients: {
    method: "GET",
    url: "/pacients",
    // preHandler: [validateRequest],
    handler: PacientController.index,
  },
};
