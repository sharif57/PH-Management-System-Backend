import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const { name, email } = payload;

  // 1. Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email already exists");
  }

  // 2. Create user if email is unique
  const user = await User.create({ name, email });

  return user;
};

const getAllUsers = async ()=>{
  
  const users = await User.find({})

  return users;
}

export const UserServices = {
  createUser,
  getAllUsers
};

