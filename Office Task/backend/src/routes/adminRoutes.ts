import express, { Router } from "express"
import { adminDashBoardControllers, adminLoginControllers, adminLogoutControllers, allProductsControllers, allUsersControllers, checkAdminControllers, deleteProductControllers, deleteUserControllers, userLogoutControllers } from "../controllers/adminControllers"
import { adminAuthMiddleware } from "../middleware/auth"

const adminRoute: Router = express.Router()

adminRoute.post("/login", adminLoginControllers)
adminRoute.post("/logout", adminLogoutControllers)

adminRoute.get("/check", adminAuthMiddleware, checkAdminControllers)
adminRoute.get("/dashboard", adminAuthMiddleware, adminDashBoardControllers)
adminRoute.get("/users", adminAuthMiddleware, allUsersControllers)
adminRoute.get("/products", adminAuthMiddleware, allProductsControllers)
adminRoute.post("/user/logout", adminAuthMiddleware, userLogoutControllers)
adminRoute.delete("/product/:id", adminAuthMiddleware, deleteProductControllers)
adminRoute.delete("/user/:id", adminAuthMiddleware, deleteUserControllers)

export default adminRoute