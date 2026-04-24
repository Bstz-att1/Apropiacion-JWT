export const checkPermission = (requiredPermission) => {
    return (req, res, next) => {
        // Obtenemos los permisos que validateToken guardó en req.user
        const permissions = req.user?.permissions || [];

        // Si el permiso que requiere la ruta no está en la lista del usuario, bloqueamos
        if (!permissions.includes(requiredPermission)) {
            const error = new Error(`Acceso prohibido: No tienes el permiso '${requiredPermission}'`);
            error.statusCode = 403; // Forbidden
            return next(error);
        }

        // Si lo tiene, ¡adelante!
        next();
    };
};