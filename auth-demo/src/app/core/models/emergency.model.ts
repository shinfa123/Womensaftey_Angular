export interface MyUser {
  id: number;
  name?: string;
  phoneno?: string;
}

export interface Emergency {
  id?: number;
  user: MyUser;
  latitude: string;
  longitude: string;
  isNewlyUpdated?: boolean;
}
