import logger from "../middleware/logger";
import { Request, Response } from "express";
import { Router } from "express";
import { UserRoles, Vehicle, VehicleType } from "../types";
import { addVehicle, addVehicleType, getBranchById, getVehicleTypeById, getVehicleTypeByType, getVehicleTypes, getAllVehicles } from "../database";
import { v4 } from "uuid";
import { vehicleObjectValidator, vehicleTypeObjectValidator } from "./validator";

const vehicleRouter = Router();

vehicleRouter.get("/", (req: Request, res: Response) => {
  res.json(getAllVehicles());
});

vehicleRouter.post("/", (req: Request, res: Response) => {
  if (req.body.role !== UserRoles.Admin) {
    res.status(403).json({ code: 403, message: "Insufficient role" });
    logger.log({ level: "error", message: `User with id ${req.body.user_id} tried to add vehicle` });
  } else {
    try {
      const vehicle: Vehicle = req.body;
      vehicleObjectValidator(vehicle);

      if (!getBranchById(vehicle.branch_id)) throw Error(`Branch ID ${vehicle.branch_id} doesn't exist`);
      if (!getVehicleTypeById(vehicle.vehicleType_id)) throw Error(`Vehicle type ID ${vehicle.vehicleType_id} doesn't exist`);

      const newVehicle: Vehicle = {
        id: v4(),
        addedDate: new Date().valueOf(),
        branch_id: vehicle.branch_id,
        brand: vehicle.brand,
        capacity: vehicle.capacity,
        color: vehicle.color,
        isActive: true,
        model: vehicle.model,
        price_per_hour: vehicle.price_per_hour,
        vehicleType_id: vehicle.vehicleType_id
      };

      res.status(201).json(addVehicle(newVehicle));
    } catch (error: any) {
      res.status(422).json({ code: 422, message: error.message });
    }
  }
});

vehicleRouter.post("/type", (req: Request, res: Response) => {
  if (req.body.role !== UserRoles.Admin) {
    res.status(403).json({ code: 403, message: "Insufficient role" });
    logger.log({ level: "error", message: `User with id ${req.body.user_id} tried to add vehicle type` });
  } else {
    try {
      const vehicleType: VehicleType = req.body;
      vehicleTypeObjectValidator(vehicleType);

      const doesTypeExist = getVehicleTypeByType(vehicleType.type);

      if (!doesTypeExist) {
        const newVehicleType: VehicleType = {
          id: v4(),
          type: vehicleType.type
        };

        res.status(201).json(addVehicleType(newVehicleType));
      } else {
        res.status(200).json(addVehicleType(doesTypeExist));
      }

    } catch (error: any) {
      res.status(422).json({ code: 422, message: error.message });
    }
  }
});

vehicleRouter.get("/type", (req: Request, res: Response) => {
  res.json(getVehicleTypes());
});

export default vehicleRouter;