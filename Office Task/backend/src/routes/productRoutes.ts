import express, { Router } from "express"
import { addProductController, addSearchSuggestionController, allProductController, bidWinningController, getSearchSuggestionController, productFilterController, searchProductController, singleProductController } from "../controllers/productControllers"
import { authMiddleware } from "../middleware/auth"
import { storage } from "../../utils/features"
import multer from "multer"

const productRoutes: Router = express.Router()

const upload = multer({ storage })


productRoutes.get("/filter", productFilterController)
productRoutes.post("/search-add", addSearchSuggestionController)
productRoutes.get("/search-suggestion", getSearchSuggestionController)

productRoutes.post("/add", upload.single("productImage"), authMiddleware, addProductController)
productRoutes.get("/filterProduct", authMiddleware, searchProductController)
productRoutes.get("/:id", authMiddleware, singleProductController)
productRoutes.get("/", authMiddleware, allProductController)
productRoutes.get("/winner/:id", authMiddleware, bidWinningController)

export default productRoutes