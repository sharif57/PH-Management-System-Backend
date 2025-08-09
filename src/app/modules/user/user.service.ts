/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  // 1. Check if email already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email already exists");
  }

  const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND));

  const isPasswordMatch = await bcryptjs.compare(password as string, hashedPassword)

  console.log(isPasswordMatch)

  const authProvider : IAuthProvider = {provider: 'credential', providerId: email as string}

  // 2. Create user if email is unique
  const user = await User.create({ 
    email,
    auths: [authProvider],
    password: hashedPassword,
     ...rest

   });

  return user;
};


const updateUser = async(userId: string, payload: Partial<IUser>, decodedToken: JwtPayload)=>{

  const ifUserExists = await User.findById(userId)

  if(!ifUserExists){
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
  }




  /** 
   * email: can not update
   * name,phone, password, address
   * password- re hashing
   * only admin superadmin- role, isDeleted
   *  **/

  if(payload.role){
    if(decodedToken.role === Role.USER || decodedToken.role=== Role.GUIDE){
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized")
    }

    if(payload.role === Role.SUPER_ADMIN && decodedToken.role == Role.ADMIN){
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized")
    }
  }

  if(payload.isActive || payload.isDeleted || payload.isVerified){
        if(decodedToken.role === Role.USER || decodedToken.role=== Role.GUIDE){
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized")
    }
  }

  if(payload.password){
    payload.password = await bcryptjs.hash(payload.password as string , envVars.BCRYPT_SALT_ROUND)
  }

  const newUpdatedUser = await User.findByIdAndUpdate( userId, payload, {new: true, runValidators: true})

  return newUpdatedUser;

}


const getAllUsers = async () => {
  const users = await User.find({});
  const totalUsers = await User.countDocuments();

  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};



export const UserServices = {
  createUser,
  getAllUsers,
  updateUser
};

