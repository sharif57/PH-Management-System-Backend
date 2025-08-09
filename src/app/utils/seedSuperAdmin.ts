import { envVars } from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcrypt from 'bcryptjs';


export const seedSuperAdmin = async ()=>{
    try {
    const isSuperAdminExists = await User.findOne({email: envVars.SUPER_ADMIN_EMAIL})

    if(isSuperAdminExists){
        console.log('super admin already exists');
        return
    }
console.log('super admin does not exist');

    const hashedPassword = await bcrypt.hash(envVars.SUPER_ADMIN_PASSWORD,  Number(envVars.BCRYPT_SALT_ROUND));

    const authProvider : IAuthProvider ={
        provider: 'credential',
        providerId: envVars.SUPER_ADMIN_EMAIL
    }

    const payload : IUser ={
        name:'SUPER admin',
        role: Role.SUPER_ADMIN,
        email: envVars.SUPER_ADMIN_EMAIL,
        password: hashedPassword,
        isVerified: true,
        auths: [authProvider]

    }

    const superadmin = await User.create(payload)
    console.log('super admin created');
    console.log(superadmin);

    } catch (error) {
        console.log(error);
    }
}