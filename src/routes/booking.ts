import logger from "../middleware/logger";
import { Request, Response } from "express";
import { Router } from "express";
import { Booking, BookingStatus, UserRoles } from "../types";
import { addBooking, cancelBooking, getAllVehicleByTypeId, getBookingById, getBookingByVehicleId, getVehicleById } from "../database";
import { v4 } from "uuid";
import { bookingObjectValidator, isIdUUIDValid } from "./validator";

const bookingRouter = Router();

function isVehicleAvailable(vehicleId: string, state_timestamp: number, end_timestamp: number): boolean {
  const vehicleBookings = getBookingByVehicleId(vehicleId);
  if (vehicleBookings.length === 0) return true;

  const isVehicleBooked =
    vehicleBookings.filter(
      aBookedVehicle =>
        (aBookedVehicle.state_timestamp <= state_timestamp && aBookedVehicle.end_timestamp >= state_timestamp) ||
        (aBookedVehicle.state_timestamp <= end_timestamp && aBookedVehicle.end_timestamp >= end_timestamp)
    );

  return isVehicleBooked.length > 0 ? false : true;
}

bookingRouter.post("/", (req: Request, res: Response) => {
  if (req.body.role !== UserRoles.User) {
    logger.log({ level: "error", message: `User with id ${req.body.user_id} tried booking vehicle` });
    throw Error("Insufficient role");
  } else {
    try {
      const bookingRequest: Booking = req.body;

      bookingObjectValidator(bookingRequest);
      const isStartTimeValid = bookingRequest.state_timestamp < bookingRequest.end_timestamp;
      if (!isStartTimeValid) throw Error("Start time should be less then End time");

      const vehicleDetails = getVehicleById(bookingRequest.vehicle_id);
      if (!vehicleDetails) throw Error(`Booking with vehicle ID ${bookingRequest.vehicle_id} doesn't exist`);

      const startTime = new Date(bookingRequest.state_timestamp);
      const endTime = new Date(bookingRequest.end_timestamp);
      const differenceInHour = Math.abs(endTime.valueOf() - startTime.valueOf()) / (1000 * 3600) % 24;

      // To check weather the booking is made multiple for hours
      const isBookingTimeValid = Number.isInteger(differenceInHour);

      if (!isBookingTimeValid)
        throw Error("Booking time should be multiples of 1 hour time slot");

      let availableVehicleId = "";
      if (isVehicleAvailable(bookingRequest.vehicle_id, bookingRequest.state_timestamp, bookingRequest.end_timestamp)) {
        availableVehicleId = bookingRequest.vehicle_id;
      } else {
        const similarVehicles = getAllVehicleByTypeId(vehicleDetails.vehicleType_id);
        for (let index = 0; index < similarVehicles.length; index++) {
          const checkVehicleAvailability = similarVehicles[index];
          if (
            checkVehicleAvailability.id !== bookingRequest.vehicle_id &&
            isVehicleAvailable(checkVehicleAvailability.id, bookingRequest.state_timestamp, bookingRequest.end_timestamp)
          ) {
            availableVehicleId = checkVehicleAvailability.id;
            break;
          }

        }
      }

      if (!availableVehicleId) throw Error("No vehicle is available at this slot, please choose another slot");

      const newBooking: Booking = {
        id: v4(),
        status: BookingStatus.Successful,
        user_id: req.body.user_id,
        vehicle_id: availableVehicleId,
        state_timestamp: bookingRequest.state_timestamp,
        end_timestamp: bookingRequest.end_timestamp,
      };

      addBooking(newBooking);

      res.status(201).json(newBooking);
    } catch (error: any) {
      res.status(422).json({ code: 422, message: error.message });
    }
  }
});

bookingRouter.delete("/:id", (req: Request, res: Response) => {
  try {
    if (req.body.role !== UserRoles.User) {
      logger.log({ level: "error", message: `User with id ${req.body.user_id} tried cancelling booking` });
      throw Error("Insufficient role");
    } else {
      const bookingID = req.params.id;
      isIdUUIDValid(bookingID) && getBookingById(bookingID).length > 0 && cancelBooking(bookingID);
    }

    res.status(204).json();
  } catch (error: any) {
    res.status(422).json({ code: 422, message: error.message });
  }
});

export default bookingRouter;