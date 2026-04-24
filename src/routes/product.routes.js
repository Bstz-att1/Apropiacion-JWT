import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

import { validateSchema } from "../middlewares/validator.middleware.js";
import { productSchema } from "../schemas/product.schema.js";

// --- IMPORTAMOS LOS GUARDIAS ---
import { validateToken } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/permission.middleware.js";

const productRouter = Router();

productRouter.use(validateToken);

productRouter.get("/", checkPermission("products.get"),getAllProducts);
productRouter.get("/:id", checkPermission("products.get") ,getProductById);
productRouter.post("/", checkPermission("products.create"),validateSchema(productSchema), createProduct);
productRouter.put("/:id", checkPermission("products.update"),validateSchema(productSchema), updateProduct);
productRouter.delete("/:id", checkPermission("products.delete"),deleteProduct);

export default productRouter;
