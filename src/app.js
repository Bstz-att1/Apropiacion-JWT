import express from "express";
import "dotenv/config"; 
import "./config/db.js";

// Importación de Rutas
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import categoryRouter from "./routes/category.routes.js";

// Importación de Middlewares
import { globalErrorHandler } from "./middlewares/error.middleware.js";

const app = express();

// ============================================
//           MIDDLEWARES DE NIVEL APP
// ============================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
//                RUTA DE SALUD
// ============================================
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Running - Bienvenido al sistema",
    timestamp: new Date().toISOString()
  });
});

// ============================================
//              MONTAJE DE RUTAS
// ============================================

// Rutas de Autenticación (Públicas: Login, Refresh, Logout)
app.use("/api/auth", authRouter);

// Rutas de Usuarios (Protegidas internamente con validateToken)
app.use("/api/users", userRouter);

// Rutas de Negocio
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);

// ============================================
//        MANEJO GLOBAL DE ERRORES
// ============================================
// Siempre debe ir después de todas las rutas
app.use(globalErrorHandler);

export default app;