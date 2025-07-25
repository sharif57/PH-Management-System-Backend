/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../../errorHelpers/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";

// const createUser = async (payload: Partial<IUser>) => {
//   const { email, password, ...rest } = payload;

//   // 1. Check if email already exists
//   const existingUser = await User.findOne({ email });

//   if (existingUser) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Email already exists");
//   }

//   const hashedPassword = await bcryptjs.hash(password as string, 10);

//   const isPasswordMatch = await bcryptjs.compare(password as string, hashedPassword)
//   // console.log(hashedPassword, password);

//   console.log(isPasswordMatch)

//   const authProvider : IAuthProvider = {provider: 'credential', providerId: email as string}

//   // 2. Create user if email is unique
//   const user = await User.create({ 
//     email,
//     auths: [authProvider],
//      ...rest

//    });

//   return user;
// };

const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;

    const isUserExist = await User.findOne({ email })

    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist")
    }

    const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))

    const authProvider: IAuthProvider = { provider: "credential", providerId: email as string }


    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest
    })

    return user

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
  getAllUsers
};

