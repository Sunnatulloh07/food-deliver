export interface RestaurantData {
  name: string;
  country: string;
  city: string;
  region: string;
  phone_number: number;
  email: string;
  password: string;
  picture?: {
    public_id: string;
    url: string;
  } | null;
}
