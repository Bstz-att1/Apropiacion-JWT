import { Router } from "express";
import { 
    createUser, 
    deleteUser, 
    getUserById, 
    getUsers, 
    updateUser 
} from "../controllers/user.controller.js";

import { validateToken } from "../middlewares/auth.middleware.js";

const userRouter = Router();

// Aplicar validacion de JWT a todas las rutas de este router
userRouter.use(validateToken);

// Obtener todos los usuarios
userRouter.get("/", getUsers);

// Obtener un usuario específico por su ID
userRouter.get("/:id", getUserById);

// Registrar un nuevo usuario
userRouter.post("/", createUser);

// Actualizar los datos de un usuario existente
userRouter.put("/:id", updateUser);

// Eliminar un usuario del sistema
userRouter.delete("/:id", deleteUser);

export default userRouter;