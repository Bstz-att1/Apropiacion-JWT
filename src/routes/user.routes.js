import { Router } from "express";
import { 
    createUser, 
    deleteUser, 
    getUserById, 
    getUsers, 
    updateUser 
} from "../controllers/user.controller.js";

// --- IMPORTAMOS LOS GUARDIAS ---
import { validateToken } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/permission.middleware.js";

const userRouter = Router();

// Aplicar validacion de JWT a todas las rutas de este router
userRouter.use(validateToken);

// Obtener todos los usuarios
userRouter.get("/", checkPermission("users.manage"), getUsers);
// Obtener un usuario específico por su ID
userRouter.get("/:id", checkPermission("users.manage"), getUserById);
// Registrar un nuevo usuario
userRouter.post("/", checkPermission("users.manage"), createUser);
// Actualizar los datos de un usuario existente
userRouter.put("/:id", checkPermission("users.manage"), updateUser);
// Eliminar un usuario del sistema
userRouter.delete("/:id", checkPermission("users.manage"), deleteUser);

export default userRouter;