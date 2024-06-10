import moment from "moment";
import { v4 as uuidv4 } from "uuid"; //npm i --save-dev @types/uuid

export const generateOTPWithExpireDate = (n:number) => {
  return {
    code: uuidv4().slice(0,6),
    expireDate: moment().add(Number(n), "minutes"),
  };
};
