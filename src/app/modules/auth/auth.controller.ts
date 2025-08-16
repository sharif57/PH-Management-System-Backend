import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse"
import { AuthServices } from "./auth.service";
import { setAuthCookie } from "../../utils/setCookie";

const credentialsLogin =  catchAsync(async (req: Request, res: Response, next: NextFunction)=>{

    const loginInfo = await AuthServices.credentialsLogin(req.body)

    setAuthCookie(res, loginInfo)

    console.log(loginInfo)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User logged in successfully",
        data: loginInfo,
    })
})


const getNewAccessToken =  catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
    
    const refreshToken  = req.cookies.refreshToken

    if(!refreshToken){
        throw new Error("Refresh token is missing")
    }

    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken as string)
    console.log(tokenInfo)


    setAuthCookie(res, tokenInfo)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: " User logged in successfully",
        data: tokenInfo,
    })
})

const logout =  catchAsync(async (req: Request, res: Response, next: NextFunction)=>{

    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    })

     res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User logged out successfully",
        data: null,
    })
})


// const resetPassword =  catchAsync(async (req: Request, res: Response, next: NextFunction)=>{

//     const newPassword = req.body.newPassword
//     const oldPassword  = req.body.oldPassword
//     const decodedToken = req.user

//       await AuthServices.resetPassword(oldPassword, newPassword, decodedToken)

//     sendResponse(res, {
//         success: true,
//         statusCode: httpStatus.OK,
//         message: "password reset successfully",
//         data: null,
//     })
// })
const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { oldPassword, newPassword } = req.body;
    const decodedToken = req.user; // added from auth middleware

    await AuthServices.resetPassword(oldPassword, newPassword, decodedToken);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password reset successfully",
      data: null,
    });
  }
);


export const AuthControllers ={
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword
}