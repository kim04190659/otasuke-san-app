export interface DailyDeal {
    id: string;
    user_id: 'mother' | 'gibo';
    store_name: string;
    product_name: string;
    regular_price: number;
    sale_price: number;
    discount_amount: number;
    distance?: string;
    sale_start_date: string;
    sale_end_date: string;
    stock_status: string;
    recommendation_point?: string;
    image_url?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type CreateDailyDeal = Omit<DailyDeal, 'id' | 'discount_amount' | 'created_at' | 'updated_at'>;
export type UpdateDailyDeal = Partial<CreateDailyDeal>;
