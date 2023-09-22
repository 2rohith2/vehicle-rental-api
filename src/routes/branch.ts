import logger from "../middleware/logger";
import { Request, Response } from "express";
import { Router } from "express";
import { Branch, UserRoles } from "../types";
import { addBranch, deleteBranchById, deleteVehicleById, getAllVehiclesByBranchID, getBranchById, getUserById } from "../database";
import { v4 } from "uuid";
import { branchObjectValidator, isIdUUIDValid } from "./validator";

const branchRouter = Router();

branchRouter.post("/", (req: Request, res: Response) => {
  if (req.body.role !== UserRoles.Admin) {
    res.status(403).json({ code: 403, message: "Insufficient role" });
    logger.log({ level: "error", message: `User with id ${req.body.user_id} tried to add branch` });
  } else {
    try {
      const branch: Branch = req.body;
      branchObjectValidator(branch);

      const newBranch: Branch = {
        id: v4(),
        address: branch.address,
        name: branch.name,
        isActive: true,
        lat: branch.lat,
        long: branch.long
      };

      res.status(201).json(addBranch(newBranch));
    } catch (error: any) {
      res.status(422).json({ code: 422, message: error.message });
    }
  }
});

branchRouter.delete("/:id", (req: Request, res: Response) => {
  if (req.body.role !== UserRoles.Admin) {
    res.status(403).json({ code: 403, message: "Insufficient role" });
    logger.log({ level: "error", message: `User with id ${req.body.user_id} tried to add branch` });
  } else {
    try {
      const branchID = req.params.id;
      if (branchID === getUserById(req.body.user_id).branch_id && getBranchById(branchID)) {
        getAllVehiclesByBranchID(branchID).map(vehicle => deleteVehicleById(vehicle.id));
        deleteBranchById(branchID);
      }
      res.status(204).json();
    } catch (error: any) {
      res.status(422).json({ code: 422, message: error.message });
    }
  }
});

branchRouter.delete("/vehicle/:id", (req: Request, res: Response) => {
  if (req.body.role !== UserRoles.Admin) {
    res.status(403).json({ code: 403, message: "Insufficient role" });
    logger.log({ level: "error", message: `User with id ${req.body.user_id} tried to add branch` });
  } else {
    try {
      const vehicleID = req.params.id;
      const user = getUserById(req.body.user_id);

      if (user.branch_id) {
        const branch = getBranchById(user.branch_id);
        const allVehiclesInBranch = getAllVehiclesByBranchID(branch.id);

        if (allVehiclesInBranch.findIndex(vehicle => vehicle.id === vehicleID) !== -1) {
          deleteVehicleById(vehicleID);
        }
      }
      res.status(204).json();
    } catch (error: any) {
      res.status(422).json({ code: 422, message: error.message });
    }
  }
});

export default branchRouter;