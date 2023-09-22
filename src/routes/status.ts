import logger from "../middleware/logger";
import { Request, Response } from "express";
import { Router } from "express";
import { UserRoles } from "../types";
import { getAllBookings, getAllVehicles } from "../database";

const statusRouter = Router();

statusRouter.get("/", (req: Request, res: Response) => {
  if (req.body.role !== UserRoles.Admin) {
    res.status(403).json({ code: 403, message: "Insufficient role" });
    logger.log({ level: "error", message: `User with id ${req.body.user_id} tried to add vehicle` });
  } else {
    try {

      const availableVehicles = new Map();
      const bookedVehicles = new Map();

      const currentDate = new Date().valueOf();
      const currentBookings = getAllBookings().filter(
        booking =>
          booking.state_timestamp <= currentDate && booking.end_timestamp >= currentDate
      );
      const allVehicle = getAllVehicles();

      allVehicle.map(vehicle => {
        if (availableVehicles.get(vehicle.id) || bookedVehicles.get(vehicle.id)) return;
        
        const aBookedVehicle = currentBookings.filter(booking => booking.vehicle_id === vehicle.id);

        if (aBookedVehicle.length === 0) {
          availableVehicles.set(vehicle.id, vehicle);
        } else {
          bookedVehicles.set(vehicle.id, vehicle);
        }
      });

      res.status(200).json({
        availableVehicles: [...availableVehicles.values()],
        bookedVehicles: [...bookedVehicles.values()]
      });
    } catch (error: any) {
      res.status(422).json({ code: 422, message: error.message });
    }
  }
});

export default statusRouter;