export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
  branch_id?: string;
}

export interface JWTDecode {
  id: string;
  email: string;
  exp: number;
  iat: number;
  role: string;
}

export enum UserRoles {
  User = "user",
  Admin = "admin",
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  lat: number;
  long: number;
  isActive: boolean;
}

export interface VehicleType {
  id: string;
  type: string;
}

export interface Vehicle {
  id: string;
  model: string;
  color: string;
  capacity: number;
  price_per_hour: number;
  brand: string;
  vehicleType_id: string;
  branch_id: string;
  isActive: boolean;
  addedDate: number;
}

export interface Booking {
  id: string;
  state_timestamp: number;
  end_timestamp: number;
  vehicle_id: string;
  user_id: string;
  status: BookingStatus
}

export enum BookingStatus {
  Successful = "successful",
  Failed = "failed",
  Cancelled = "cancelled"
}

export interface Payment {
  id: string;
  booking_id: string;
  price: number;
  status: string;
  date: number;
}