/* eslint-disable @typescript-eslint/no-non-null-assertion */
import bcrypt from 'bcryptjs';
import httpStatus from "http-status-codes";
import AppError from "../../../errorHelpers/AppError"
import {  IUser } from "../user/user.interface"
import { User } from "../user/user.model"

import { createNewAccessTokenWithRefreshToken, createUerTokens } from '../../utils/userTokens';
import { JwtPayload } from 'jsonwebtoken';
import { envVars } from '../../config/env';

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

const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const userId = decodedToken.userId || decodedToken.id; // support both cases

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const isOldPasswordMatch = await bcrypt.compare(
    oldPassword,
    user.password as string
  );

  if (!isOldPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Incorrect old password");
  }

  user.password = await bcrypt.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  await user.save();

  return true;
};



export const AuthServices ={
    credentialsLogin,
    getNewAccessToken,
    resetPassword
}