import { Booking, BookingStatus, Branch, Payment, User, Vehicle, VehicleType } from "../types";

const users: User[] = [
  {
    id: "0cf0c07a-7000-492f-ae59-2ffb2a960538",
    first_name: "Erek",
    last_name: "Sanzio",
    email: "admin1@domain.com",
    password: "password",
    role: "admin",
    branch_id: "7f10741d-b487-477e-ab2d-d59fb713f9e6"
  },
  {
    id: "5305ffb9-c4e7-4ace-97e9-9a87cd27acd2",
    first_name: "Lawrence",
    last_name: "Fleeman",
    email: "user1@domain.com",
    password: "password",
    role: "user",
  },
];

const branches: Branch[] = [
  {
    id: "7f10741d-b487-477e-ab2d-d59fb713f9e6",
    address: "Malleshwaram",
    name: "AtoZ Car Rentals",
    isActive: true,
    lat: 12,
    long: 556.223
  },
  {
    id: "e84f2719-4e9a-445d-85d3-137167d5bedb",
    address: "Srinagar",
    name: "A1 Car Rentals",
    isActive: true,
    lat: 12,
    long: 556.223
  }
];

const vehicleType: VehicleType[] = [
  {
    id: "98c0a002-96c9-4f85-941b-540b6cd7cee7",
    type: "car"
  },
  {
    id: "5e7d0e3b-35c4-4951-93b6-3ac7802aab46",
    type: "bike"
  }
];

const vehicles: Vehicle[] = [
  {
    id: "4b16e17b-fa00-4a4c-b8d3-4e8e180f2662",
    addedDate: 1695319086247,
    branch_id: "7f10741d-b487-477e-ab2d-d59fb713f9e6",
    brand: "Benz",
    capacity: 4,
    color: "Gray",
    isActive: true,
    model: "S Class 3",
    price_per_hour: 1000,
    vehicleType_id: "98c0a002-96c9-4f85-941b-540b6cd7cee7"
  },
  {
    id: "1d0010bb-f9ac-4390-b7b7-fdbc39de6e82",
    addedDate: 1695319149080,
    branch_id: "7f10741d-b487-477e-ab2d-d59fb713f9e6",
    brand: "BMW",
    capacity: 4,
    color: "White",
    isActive: true,
    model: "Sports",
    price_per_hour: 900,
    vehicleType_id: "98c0a002-96c9-4f85-941b-540b6cd7cee7"
  }
];

const bookings: Booking[] = [
  {
    id: "1",
    state_timestamp: 628021800000,
    end_timestamp: 628021800000,
    user_id: "1",
    vehicle_id: "1",
    status: BookingStatus.Successful
  }
];

const payments: Payment[] = [
  {
    id: "1",
    date: 628021800000,
    price: 250,
    status: "success",
    booking_id: "1"
  }
];

export function addUser(user: User): User {
  users.push(user);
  return user;
}

// check if not required, delete it
export function getUserById(id: string): User {
  return users.filter(user => user.id === id)[0];
}

export function getUserByEmail(email: string): User {
  return users.filter(user => user.email === email)[0];
}

export function addBranch(branch: Branch): Branch {
  branches.push(branch);
  return branch;
}

export function getBranchById(id: string): Branch {
  return branches.filter(branch => branch.id === id && branch.isActive)[0];
}

export function deleteBranchById(id: string): void {
  const foundBranchIndex = branches.findIndex(branch => branch.id === id);
  if (foundBranchIndex === -1) return;

  const branch = branches[foundBranchIndex];
  branch.isActive = false;
  branches[foundBranchIndex] = branch;
}

export function getAllVehiclesByBranchID(id: string): Vehicle[] {
  return vehicles.filter(vehicle => vehicle.branch_id === id && vehicle.isActive);
}

export function addVehicleType(type: VehicleType): VehicleType {
  vehicleType.push(type);
  return type;
}

export function getVehicleTypeById(id: string): VehicleType {
  return vehicleType.filter(type => type.id === id)[0];
}

export function getVehicleTypeByType(type: string): VehicleType {
  return vehicleType.filter(vehicleType => vehicleType.type === type)[0];
}

export function addVehicle(vehicle: Vehicle): Vehicle {
  vehicles.push(vehicle);
  return vehicle;
}

export function getAllVehicles(): Vehicle[] {
  return vehicles.filter(vehicle => vehicle.isActive && vehicle.isActive);
}

export function getVehicleById(id: string): Vehicle {
  return vehicles.filter(vehicle => vehicle.id === id && vehicle.isActive)[0];
}

export function getAllVehicleByTypeId(id: string): Vehicle[] {
  return vehicles.filter(vehicle => vehicle.vehicleType_id === id && vehicle.isActive);
}

export function getVehicleTypes(): VehicleType[] {
  return vehicleType;
}

export function deleteVehicleById(id: string): void {
  const foundVehicleIndex = vehicles.findIndex(vehicle => vehicle.id === id);
  if (foundVehicleIndex === -1) return;

  const vehicle = vehicles[foundVehicleIndex];
  vehicle.isActive = false;
  vehicles[foundVehicleIndex] = vehicle;
}

export function addBooking(booking: Booking): Booking {
  bookings.push(booking);
  return booking;
}

export function getAllBookings(): Booking[] {
  return bookings.filter(booking => booking.status === BookingStatus.Successful);
}

export function getBookingById(id: string): Booking[] {
  return bookings.filter(booking => booking.id === id);
}

export function getBookingByVehicleId(id: string): Booking[] {
  return bookings.filter(booking => booking.vehicle_id === id && booking.status === BookingStatus.Successful);
}

export function cancelBooking(bookingID: string): void {
  const foundBookingIndex = bookings.findIndex(
    booking => booking.id === bookingID && booking.status === BookingStatus.Successful
  );
  if (foundBookingIndex === -1) return;

  const booking = bookings[foundBookingIndex];
  booking.status = BookingStatus.Cancelled;
  bookings[foundBookingIndex] = booking;
}

export function addPayment(payment: Payment) {
  payments.push(payment);
  return payments;
}

// export function checkVehicleType(id: string): boolean {
//   let foundBookingIndex = -1;
//   bookings.find((booking, index) => {
//     if (booking.id === bookingID && booking.user_id === userID) {
//       foundBookingIndex = index;
//     }
//   });
//   return
// }