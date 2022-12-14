import { Demote } from "./types";
import {DateTime} from "luxon";

export const ist = <T>(test: (obj:any) => boolean) => (obj:any): obj is T => test(obj);

const dateFields = ['createdOn', 'modifiedOn', 'expiresOn', 'start', 'end'];
export const promote = <T>(entity: Demote<T>): T => {
  const result:any = Array.isArray(entity) ? [] : {};
  
  if(!entity) {
    return entity;
  }
  
  for(const [key, val] of Object.entries(entity)) {
    if(Array.isArray(val)) {
      result[key] = val.map((v) => promote(v));
    } else if(typeof val === 'object' && val !== null) {
      result[key] = promote(val);
    } else if(typeof val === 'string' && dateFields.includes(key)) {
      try {
        result[key] = DateTime.fromISO(val);
      } catch(e) {
        console.error(`Unable to convert: [${key}, ${val}]`);
        result[key] = val;
      }
    } else {
      result[key] = val;
    }
  }
  
  return result;
};
