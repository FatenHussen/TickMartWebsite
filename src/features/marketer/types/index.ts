// ==================== Marketer Statistics ====================
export interface MarketerStatistics {
  total_orders: number;
  delivered_orders: number;
  total_sales: number;
  earned_commission: number;
  pending_earnings: number;
  withdrawn: number;
  available_balance: number;
}

export interface MarketerStatisticsResponse {
  success: boolean;
  message: string;
  data: MarketerStatistics;
}

// ==================== Marketer Profile ====================
export interface MarketerCoupon {
  id: number;
  code: string;
  discount_type: string;
  discount_value: number;
  max_uses: number;
  used_count: number;
  start_at: string;
  end_at: string;
  is_active: boolean;
}

export interface MarketerProfile {
  affiliate_id: string;
  affiliate_link: string;
  rate: number;
  total_visites: number;
  coupon: MarketerCoupon | null;
}

export interface MarketerProfileResponse {
  success: boolean;
  message: string;
  data: MarketerProfile;
}

// ==================== Marketer Orders ====================
export interface MarketerOrderSummary {
  total_orders: number;
  delivered_orders: number;
  total_sales: number;
  earned_commission: number;
  pending_earnings: number;
}

export interface MarketerOrder {
  id: number;
  order_number: string;
  status: string;
  total: number;
  affiliate_rate: number;
  affiliate_source: "link" | "coupon";
  created_at: string;
  coupon: { code: string } | null;
  user: { name: string; phone: string };
}

export interface MarketerOrdersPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface MarketerOrdersResponse {
  success: boolean;
  message: string;
  data: {
    summary: MarketerOrderSummary;
    items: MarketerOrder[];
    pagination: MarketerOrdersPagination;
  };
}

// ==================== Marketer Transactions ====================
export interface MarketerTransaction {
  id: number;
  affiliate_id: string;
  type: "commission" | "withdraw";
  amount: string | number;
  status: string;
  order_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface MarketerTransactionsResponse {
  status?: boolean;
  success?: boolean;
  message: string;
  data: {
    items: MarketerTransaction[];
    pagination: MarketerOrdersPagination;
  };
}

// ==================== Withdraw Requests ====================
export interface WithdrawRequestSummary {
  total_requests: number;
  total_withdrawn: number;
  pending_amount: number;
}

export interface WithdrawRequest {
  id: number;
  affiliate_id: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface WithdrawRequestsResponse {
  success: boolean;
  message: string;
  data: {
    summary: WithdrawRequestSummary;
    items: WithdrawRequest[];
    pagination: MarketerOrdersPagination;
  };
}

export interface CreateWithdrawRequestResponse {
  success: boolean;
  message: string;
  data: {
    withdraw_request: WithdrawRequest;
  };
}

// ==================== Monthly Orders ====================
export interface MonthlyPerformance {
  completed_orders: number;
  earned_commission: number;
}

export interface MonthlyOrdersResponse {
  success: boolean;
  message: string;
  data: {
    year: number;
    monthly_performance: Record<string, MonthlyPerformance>;
  };
}

// ==================== Marketer Request ====================
export interface MarketerRequestResponse {
  status?: boolean;
  success?: boolean;
  message: string;
  data: null;
}
