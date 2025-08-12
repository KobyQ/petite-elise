export interface FeeRequest {
  id: string;
  parent_name: string;
  email: string;
  phone_number: string;
  child_name: string;
  programs: string[];
  day_care_schedule?: string;
  additional_notes?: string;
  status: "pending" | "invoiced" | "paid" | "cancelled";
  created_at: string;
  invoice_amount?: number;
  invoice_sent_at?: string;
}

export interface SchoolFeesPayment {
  id: string;
  created_at: string;
  request_id: string;
  parent_name: string;
  child_name: string;
  email: string;
  phone_number: string;
  programs: string[];
  day_care_schedule?: string;
  additional_notes?: string;
  amount: number;
  order_id: string;
  status: string;
  reference: string;
} 