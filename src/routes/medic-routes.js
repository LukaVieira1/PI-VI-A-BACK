import * as MedicController from "../controllers/medic-controller.js";

export default {
  getAllPacients: {
    method: "GET",
    url: "/medics",
    handler: MedicController.index,
  },
};
