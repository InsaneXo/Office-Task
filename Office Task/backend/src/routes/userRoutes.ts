import express, { NextFunction, Request, Response, Router } from "express"
import { addBalanceController, addBookmarkedController, bidController, deniedPaymentController, myProfileController, proceedToPayController, updateUserController } from "../controllers/userControllers"
import { authMiddleware } from "../middleware/auth"
import multer from "multer"
import { storage } from "../../utils/features"

const upload = multer({ storage })


const userRoutes: Router = express.Router()

userRoutes.get("/me", authMiddleware, myProfileController)
userRoutes.post("/bookmarked", authMiddleware, addBookmarkedController)
userRoutes.put("/bid/:id", authMiddleware, bidController)
userRoutes.put("/update-profile", upload.single("profileImage"), authMiddleware, updateUserController)
userRoutes.post("/add-balance", authMiddleware, addBalanceController)
userRoutes.post("/payment/:id", authMiddleware, proceedToPayController)
userRoutes.get("/payment-denied/:id", authMiddleware, deniedPaymentController)

export default userRoutes