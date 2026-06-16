import type { EntityId, ISODate, ISODateTime, Sex } from "./common";

export type User = {
  id: EntityId;
  name?: string;
  birthDate?: ISODate;
  age?: number;
  sex: Sex;
  heightCm: number;
  currentWeightKg: number;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
};

export type UserProfileInput = Pick<User, "age" | "sex" | "heightCm" | "currentWeightKg"> & {
  name?: string;
};
