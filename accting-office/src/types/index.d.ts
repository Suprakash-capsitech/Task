export interface LeadsInterface {
  id: string;
  name: string;
  email: string;
  type: LeadType;
  status: Status;
  phoneNumber: string;
  createdByid: string;
  createdAt: string;
  createdBy: UserInterface;
}
export interface ClientInterface {
  id: string;
  name: string;
  email: string;
  type: ClientType;
  status: Status;
  address: {
    street: string;
    area: string;
    city: string;
    county: string;
    pincode: string;
    country: string;
  };
  createdByid: string;
  createdAt: string;
  createdBy: UserInterface;
  contactIds: [];
  contactDetails: LeadsInterface[];
}

export interface UserInterface {
  id: string;
  name: string;
}

export interface HistoryInterface {
  id: string;
  historyOf: {
    _id: string;
    name: string;
  };
  description: string;
  taskPerfoemed: HistoryType;
  performedBy: UserInterface;
  createdAt: string;
}
export enum Status {
  Unknown,
  Active,
  Inactive,
}
export enum ClientType {
  Unknown,
  limited,
  individual,
  LLP,
  Partnersihp,
}
export enum LeadType {
  Unknown,
  lead,
  contact,
}
export enum HistoryType {
  Unknown,
  Created,
  Updated,
  Deleted,
  Linked,
  Unlinked,
}
