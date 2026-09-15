export interface Rating {
  ID: string;
  LocationID: string;
  UserID: string;
  Title?: string;
  Description?: string;
  Rating: number;
  CreatedAt: string;
  DeletedAt: string | null;
}
