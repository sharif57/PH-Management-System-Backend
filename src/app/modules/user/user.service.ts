/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../../errorHelpers/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email already exists");
  }


  const SALT = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password as string, SALT);

  const authProvider : IAuthProvider = {provider: 'credential', providerId: email as string}

  // 2. Create user if email is unique
  const user = await User.create({ 
    email,
    auths: [authProvider],

     ...rest,
    password: hashedPassword,
   });

  return user;
};


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
  getAllUsers
};

