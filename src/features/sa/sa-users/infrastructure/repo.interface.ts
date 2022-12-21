import { ObjectId } from "mongoose"
import { QueryUserDto } from "../../../../helpers/constants/commonDTO/query.dto"
import { BanInfo } from "../domain/entitites/user"
import { UserModel } from "../domain/entitites/user.interface"

export interface IRepositoryInterface {
    banOneUserById(id: string, banInfo: BanInfo): any
    findAllUsers(query: QueryUserDto): any
    createOneUser(newUser: User): Promise<any>
    deleteOneUserById(id: string): any
    passwordRecovery(email: string, code: string): any
    newPassword(passwordHash: string, passwordSalt: string, recoveryCode: string): any
    findByLoginOrEmail(loginOrEmail: string): any
    findOneUserById(userId: string): any
    findOneForCustomDecoratorByLogin(login: string): any
    findOneForCustomDecoratorByEmail(email: string): any
    findOneForCustomDecoratorByCode(code: string): any
    findOneForCustomDecoratorCheckMail(email: string): any
    registrationConfirmation(code: string): any
    registrationEmailResending(email: string, code: string): any
    authMe(userId: string): any
}