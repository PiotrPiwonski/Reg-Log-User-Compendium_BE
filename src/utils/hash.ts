import * as bcrypt from 'bcrypt';
import { HttpException } from '../exceptions';

export const hashData = async (data: string): Promise<string> => {
  try {
    return await bcrypt.hash(data, 10);
  } catch (error) {
    throw new HttpException(error.statusCode, error.message);
  }
};

export const checkHash = async (data: string, encrypted: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(data, encrypted);
  } catch (error) {
    throw new HttpException(error.statusCode, error.message);
  }
};
