export type Product =
  | 'トイレットペーパー'
  | 'ティッシュペーパー'
  | 'キッチンペーパー'
  | '洗濯洗剤'
  | '食器用洗剤'
  | '掃除用洗剤'
  | 'スポンジ'
  | 'お米'
  | '水・お茶'
  | '缶詰'
  | '調味料'
  | '電池'
  | '電球'
  | 'ゴミ袋'
  | 'ラップ・アルミホイル';

export type PurchasePriority =
  | '一番安い'
  | 'いつもの店'
  | '近いお店'
  | '評判が良い';

export type TransportMethod =
  | '徒歩'
  | '自転車'
  | '車';

export interface DailyGoodsSearchRequest {
  product: Product;
  priority: PurchasePriority;
  userLocation: string;
  ageGroup: string;
}

export interface DailyGoodsSearchResponse {
  recommendation: {
    productName: string;
    brand: string;
    price: string;
    quantity: string;
  };
  stores: Array<{
    name: string;
    distance: string;
    address: string;
    price: string;
    availability: string;
  }>;
  advice: {
    mainAdvice: string;
    tips: string[];
    warnings: string[];
  };
  generatedAt: string;
}
