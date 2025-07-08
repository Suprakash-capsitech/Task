export interface LeadsInterface {
  id: string;
  name: string;
  email: string;
  type: string;
  status: string;
  phone_Number: string;
  created_By_id: string;
  createdAt: string;
  created_By: UserInterface;
}
export interface ClientInterface {
  id: string;
  name: string;
  email: string;
  type: string;
  status: string;
  address: string;
  created_By_id: string;
  createdAt: string;
  created_By: UserInterface;
}

export interface UserInterface {
  id: string;
  name: string;
}

export interface HistoryInterface {
  id: string;
  history_of: string;
  description: string;
  task_Performed: string;
  performed_By_Id: string;
  performed_By: UserInterface;
  createdAt: string;
}
