export type VehicleType = 'Sedan' | 'SUV/4x4';

export interface WashPackage {
  id: string;
  name: string;
  description: string;
  tier: number;
  sedanPrice: number;
  suvPrice: number;
  inclusions: string[];
}

export interface Booking {
  id: string;
  customerName: string;
  phone: string;
  vehicleType: VehicleType;
  packageId: string;
  packageName: string;
  date: string;
  time: string;
  notes?: string;
  totalCost: number;
  appliedDeal?: string;
  status: 'Confirmed' | 'Completed' | 'Pending';
  createdAt: string;
}

export interface LoyaltyCard {
  phone: string;
  customerName: string;
  stamps: number; // 0 to 5
  unlockedRewards: string[];
  history: { date: string; type: string }[];
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  code: string;
  discountPercentage?: number;
  discountFixed?: number;
  targetPackageId?: string;
  category: string;
}

export interface BayState {
  id: number;
  name: string;
  type: 'Wet Ingress' | 'Dry Staging';
  status: 'Available' | 'Occupied' | 'SOP-Step-1' | 'SOP-Step-2' | 'SOP-Step-3' | 'SOP-Step-4';
  currentVehicle?: {
    licensePlate: string;
    model: string;
    package: string;
    stepTimeElapsed: number; // in mins
  };
}
