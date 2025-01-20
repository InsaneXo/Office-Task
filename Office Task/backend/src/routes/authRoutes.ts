import express, { Request, Response, Router } from "express"
import passport from "passport"
import { changePasswordController, checkTokenController, createUserController, logoutController, sendforgetPasswordLinkController, sendOtpController, userLoginController, verifyForgetPasswordController } from "../controllers/authControllers"



const authRoutes: Router = express.Router()

authRoutes.post("/register", createUserController)
authRoutes.post("/login", userLoginController)
authRoutes.post("/logout", logoutController)
authRoutes.post("/verify", sendOtpController)
authRoutes.post("/reset-password", sendforgetPasswordLinkController)
authRoutes.post("/reset-password/verfiy/:token", verifyForgetPasswordController)
authRoutes.post("/change-password/:token", changePasswordController)
authRoutes.get("/check-token/:token", checkTokenController)
authRoutes.get("/google/callback", passport.authenticate("google", {
    session: false
}), (req: Request, res: Response) => {
    const user = req.user as { token: string; user: any }
    if (user) {
        res.redirect(`http://localhost:5173/?token=${user.token}`)
    }
    else {
        res.redirect("http://localhost:5173/login")
    }
})

export default authRoutes