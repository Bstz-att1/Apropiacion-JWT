import bcrypt from 'bcryptjs';
import { UserModel } from "../models/user.model.js";
import { catchAsync } from "../utils/catchAsync.js";
import { successResponse } from "../utils/response.handler.js";

// 1. Obtener todos los usuarios
export const getUsers = catchAsync(async (req, res) => {
    const users = await UserModel.getAll();
    return successResponse(res, 200, "Lista de usuarios", users);
});

// 2. Obtener usuario por ID
export const getUserById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const user = await UserModel.findById(Number(id));

    if (!user) {
        const error = new Error(`Usuario con ID ${id} no encontrado`);
        error.statusCode = 404;
        return next(error);
    }

    return successResponse(res, 200, "Usuario encontrado correctamente", user);
});

// 2.1 Obtener usuario por documento
export const getUserByDocument = catchAsync(async (req, res, next) => {
    const { document } = req.params;
    const user = await UserModel.findByDocument(document);

    if (!user) {
        const error = new Error(`Usuario con documento ${document} no encontrado`);
        error.statusCode = 404;
        return next(error);
    }

    return successResponse(res, 200, "Usuario encontrado correctamente", user);
});

// 3. Crear usuario (CON BCRYPT)
export const createUser = catchAsync(async (req, res, next) => {
    const { name, document, email, password } = req.body;

    // Hashear la contraseña antes de guardar
    const salt = await bcrypt.genSalt(20);
    const hashedPassword = await bcrypt.hash(password, salt);

    const scriptUser = await UserModel.create({
        name,
        document,
        email,
        password_hash: hashedPassword
    });

    return successResponse(res, 201, "Usuario creado correctamente", scriptUser);
});

// 4. Actualizar usuario (CON BCRYPT SI CAMBIA PASS)
export const updateUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const data = { ...req.body };

    // Si el usuario intenta actualizar su password, la hasheamos
    if (data.password) {
        const salt = await bcrypt.genSalt(20);
        data.password_hash = await bcrypt.hash(data.password, salt);
        delete data.password;
    }

    const updatedUser = await UserModel.update(Number(id), data);

    if (!updatedUser) {
        const error = new Error(`Usuario con ID ${id} no encontrado`);
        error.statusCode = 404;
        return next(error);
    }

    return successResponse(res, 200, "Usuario actualizado correctamente", updatedUser);
});

// 5. Eliminar usuario
export const deleteUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const isDeleted = await UserModel.delete(Number(id));

    if (!isDeleted) {
        const error = new Error(`No se pudo eliminar: Usuario con ID ${id} no encontrado`);
        error.statusCode = 404;
        return next(error);
    }

    return successResponse(res, 200, "Usuario eliminado correctamente");
});