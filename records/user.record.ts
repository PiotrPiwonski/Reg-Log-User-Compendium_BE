import {Role, UserEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {v4 as uuid} from "uuid";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";

type UserRecordResults = [UserRecord[], FieldPacket[]];

interface NewUserEntity extends Omit<UserEntity, 'id'> {
    id? : string;
}

export class UserRecord implements UserEntity {
    public id: string;
    public role: Role;
    public email: string;
    public password: string;
    public confirmPassword: string;



    constructor(obj: NewUserEntity) {
        if (!obj.email || obj.email.length < 5 || obj.email.length > 345) {
            throw new ValidationError('.Email must not be blank and the number of characters must be between 5 and 255.');
        }
        if (!obj.password || obj.password.length < 6 || obj.password.length > 255) {
            throw new ValidationError('Password must not be blank and the number of characters must be between 6 and 255.');
        }
        if (!obj.role || obj.role > 3 || obj.role < 1) {
            throw new ValidationError('Role must not be blank and must be in the range 1 - 3.');
        }

        this.id = obj.id;
        this.role = obj.role;
        this.email = obj.email;
        this.password = obj.password;
    }

    static async getUserByEmail(email: string): Promise<UserRecord | null> {
        const [results] = await pool.execute("SELECT * FROM `user` WHERE `email`:email", {
            email,
        }) as UserRecordResults;
        return results.length === 0 ? null : new UserRecord(results[0]);
    }

    async createUser(): Promise<string> {
        if (!this.id) {
            this.id = uuid();
        }

        await pool.execute("INSERT INTO `user` VALUES(:id, :role, :email, :passwodr )", {
            id: this.id,
            role: this.role,
            email: this.email,
            password: this.password,
        });
        return this.id;
    }


}