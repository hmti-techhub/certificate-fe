/**
 * @interface IJWTPayload
 * This interface is used to define the structure of the user payload
 * that is returned from the server after a successful sign in.
 *
 * @property {string} idUser - The unique identifier of the user.
 * @property {string} email - The email address of the user.
 * @property {boolean} isPremium - Indicates whether the user has a premium account.
 * @property {"FREEPLAN" | "SILVER" | "PLATINUM" | "GOLD"} premiumPackage - The package name of the user's premium account.
 * @property {"USER" | "SUPERADMIN"} roles - The role of the user (e.g., USER, SUPERADMIN).
 * @property {number} iat - The issued at timestamp of the token.
 * @property {number} exp - The expiration timestamp of the token.
 *
 */
export interface IJWTPayload {
  idUser: string;
  email: string;
  isPremium: boolean;
  isVerifiedEmail: boolean;
  premiumPackage: "FREEPLAN" | "SILVER" | "PLATINUM" | "GOLD";
  roles: "USER" | "SUPERADMIN";
  iat: number;
  exp: number;
}

export interface IUserResponse<T = IUsersData[] | IUserData> {
  success: boolean;
  status: number;
  message: string;
  data: T | null;
}

/**
 * Antarmuka untuk mendefinisikan data pengguna.
 *
 * @property {string} email - Alamat email pengguna.
 * @property {"USER" | "SUPERADMIN"} roles - Peran pengguna, dapat berupa "USER" atau "SUPERADMIN".
 * @property {string} createdAt - Tanggal dan waktu saat pengguna dibuat (format string ISO 8601).
 * @property {boolean} isPremium - Menunjukkan apakah pengguna memiliki status premium.
 * @property {string | null} premiumAt - Tanggal dan waktu saat pengguna menjadi premium, atau null jika belum pernah.
 * @property {string | null} premiumExpiredAt - Tanggal dan waktu kedaluwarsa status premium, atau null jika tidak berlaku.
 * @property {"FREEPLAN" | "SILVER" | "PLATINUM" | "GOLD"} premiumPackage - Paket premium pengguna, dapat berupa "FREEPLAN", "SILVER", "PLATINUM", atau "GOLD".
 */
export interface IUserData {
  email: string;
  roles: "USER" | "SUPERADMIN";
  createdAt: string;
  isPremium: boolean;
  isVerifiedEmail: boolean;
  premiumAt: string | null;
  premiumExpiredAt: string | null;
  premiumPackage: "FREEPLAN" | "SILVER" | "PLATINUM" | "GOLD";
}

export interface IUsersData {
  uid: string;
  email: string;
  isPremium: boolean;
  premiumAt: string | null;
  createdAt: string;
  premiumPackage: "FREEPLAN" | "SILVER" | "PLATINUM" | "GOLD";
  role: "USER" | "SUPERADMIN";
  updateAt: string;
  premiumExpiredAt: string | null;
  events: number;
}

export interface IUsersDataTable {
  id: number;
  token: string;
  uid: string;
  email: string;
  fullEmail: string;
  isPremium: boolean;
  premiumAt: string | null;
  premiumPackage: "FREEPLAN" | "SILVER" | "PLATINUM" | "GOLD";
  role: "USER" | "SUPERADMIN";
}
