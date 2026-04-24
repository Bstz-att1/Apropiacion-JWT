import { Router } from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getProductsByCategory,
} from "../controllers/category.controller.js";

import { validateSchema } from "../middlewares/validator.middleware.js";
import { categorySchema } from "../schemas/category.schema.js";

// --- IMPORTAMOS LOS GUARDIAS ---
import { validateToken } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/permission.middleware.js";

const categoryRouter = Router();

categoryRouter.use(validateToken);

categoryRouter.get("/", checkPermission("categories.get"),getAllCategories);
categoryRouter.get("/:id", checkPermission("categories.get") ,getCategoryById);
categoryRouter.post("/", checkPermission("categories.create") ,validateSchema(categorySchema), createCategory);
categoryRouter.put("/:id", checkPermission("categories.update"),validateSchema(categorySchema), updateCategory);
categoryRouter.delete("/:id", checkPermission("categories.delete") ,deleteCategory);

// Ruta Relacional: Obtener productos por categoría
// Sigue el estándar REST: /recurso-padre/:id/recurso-hijo
categoryRouter.get("/:id/products", checkPermission("categories.get"),getProductsByCategory);

export default categoryRouter;
