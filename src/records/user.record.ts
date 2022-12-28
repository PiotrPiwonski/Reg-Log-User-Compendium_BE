import { Role, UserEntity } from '../types';
import { v4 as uuid } from 'uuid';
import { pool } from '../utils/db';
import { FieldPacket } from 'mysql2';
import { ValidationException } from '../exceptions';

type UserRecordResults = [UserRecord[], FieldPacket[]];

export class UserRecord implements UserEntity {
  public id?: string;
  public role?: Role;
  public email: string;
  public password: string;

  constructor(obj: UserEntity) {
    if (!obj.email || obj.email.length < 5 || obj.email.length > 255) {
      throw new ValidationException('Email must not be blank and the number of characters must be between 5 and 255.');
    }
    if (!obj.password || obj.password.length < 6 || obj.password.length > 16) {
      throw new ValidationException(
        'Password must not be blank and the number of characters must be between 6 and 16.',
      );
    }

    this.id = obj.id;
    this.role = obj.role;
    this.email = obj.email;
    this.password = obj.password;
  }

  static async getUserByEmail(email: string): Promise<UserRecord | null> {
    const [results] = (await pool.execute('SELECT * FROM `user` WHERE `email` = :email', {
      email,
    })) as UserRecordResults;
    return results.length === 0 ? null : new UserRecord(results[0]);
  }

  async createUser(): Promise<string> {
    if (!this.id) {
      this.id = uuid();
    }
    if (!this.role) {
      this.role = Role.User;
    }

    await pool.execute('INSERT INTO `user` VALUES(:id, :email, :password, :role )', {
      id: this.id,
      email: this.email,
      password: this.password,
      role: this.role,
    });
    return this.id;
  }
}
