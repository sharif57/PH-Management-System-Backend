import bcrypt from 'bcryptjs';
import httpStatus from "http-status-codes";
import AppError from "../../../errorHelpers/AppError"
import {  IUser } from "../user/user.interface"
import { User } from "../user/user.model"

import { createNewAccessTokenWithRefreshToken, createUerTokens } from '../../utils/userTokens';

const credentialsLogin = async (payload: Partial<IUser>)=>{

    const {email, password} =payload

    const isUserExist = await User.findOne({email})

    if(!isUserExist){
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
    }

    const isPasswordMatched = await bcrypt.compare(password as string, isUserExist.password as string)
   
    if(!isPasswordMatched){
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect password")
    }

    // const jwtPayload = {
    //     id: isUserExist._id,
    //     email: isUserExist.email,
    //     role: isUserExist.role

    // }


    // const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)
    // const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES )

    const userTokens= createUerTokens(isUserExist)

    // delete isUserExist.password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {password: pass , ...rest} = isUserExist.toObject()

    return {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest
    }

}

const getNewAccessToken = async (refreshToken: string)=>{

    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)
   
    return {
        accessToken: newAccessToken
    }

}

export const AuthServices ={
    credentialsLogin,
    getNewAccessToken
}