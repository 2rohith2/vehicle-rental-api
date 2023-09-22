import { Booking, Branch, Vehicle, VehicleType } from "../types";
const stringRegex = new RegExp("^[a-zA-Z0-9, ]{3,50}$");

export function vehicleObjectValidator(vehicle: Vehicle): boolean {
  const brand = vehicle.brand;
  const color = vehicle.color;
  const model = vehicle.model;
  const capacity = vehicle.capacity;
  const price = vehicle.price_per_hour;
  const branchID = vehicle.branch_id;
  const typeID = vehicle.vehicleType_id;

  if (!stringRegex.test(brand) || typeof brand !== "string" || brand === null)
    throw Error("Vehicle brand must be string & have to be 3-50 characters");
  if (!stringRegex.test(color) || typeof color !== "string" || color === null)
    throw Error("Vehicle color must be string & have to be 3-50 characters");
  if (!stringRegex.test(model) || typeof model !== "string" || model === null)
    throw Error("Vehicle model must be string & have to be 3-50 characters");

  if (isNaN(capacity) || typeof capacity !== "number")
    throw Error("Vehicle capacity should be valid number");
  if (isNaN(price) || typeof price !== "number")
    throw Error("Vehicle price should be valid number");

  if (!isIdUUIDValid(branchID)) throw Error("Invalid branch ID");
  if (!isIdUUIDValid(typeID)) throw Error("Invalid vehicle type ID");

  return true;
}

export function branchObjectValidator(branch: Branch): boolean {
  const address = branch.address;
  const name = branch.name;
  const lat = branch.lat;
  const long = branch.long;

  if (!stringRegex.test(address) || typeof address !== "string" || address === null)
    throw Error("Branch address must be string & have to be 3-50 characters");
  if (!stringRegex.test(name) || typeof name !== "string" || name === null)
    throw Error("Branch name must be string & have to be 3-50 characters");

  if (isNaN(lat) || typeof lat !== "number")
    throw Error("Branch latitude should be valid number");
  if (isNaN(long) || typeof long !== "number")
    throw Error("Branch longitude should be valid number");

  return true;
}

export function vehicleTypeObjectValidator(vehicle: VehicleType): boolean {
  const type = vehicle.type;

  if (!stringRegex.test(type) || typeof type !== "string" || type === null)
    throw Error("Vehicle type must be string & have to be 3-50 characters");

  return true;
}

export function isIdUUIDValid(id: string): boolean {
  const uuidV4Regex = new RegExp(
    "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
  );

  if (!uuidV4Regex.test(id)) return false;
  return true;
}

export function bookingObjectValidator(booking: Booking): boolean {
  const startTime = booking.state_timestamp;
  const endTime = booking.end_timestamp;
  const vehicleId = booking.vehicle_id;

  if (typeof startTime !== "number" || startTime === null || startTime.toString().length !== 13)
    throw Error("Start time should be ephoch number with 13 digits");

  if (typeof endTime !== "number" || endTime === null || endTime.toString().length !== 13)
    throw Error("End time should be ephoch number with 13 digits");

  if (!isIdUUIDValid(vehicleId)) throw Error("Invalid Vehicle ID");

  return true;
}
