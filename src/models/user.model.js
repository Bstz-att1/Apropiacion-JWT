import { ur } from "zod/locales";
import pool from "../config/db.js";

export const UserModel = {
  // 1. Obtener todos los usuarios (Excluimos datos sensibles)
  getAll: async () => {
    const [users] = await pool.query("SELECT id, name, document, email, created_at FROM users");
    return users;
  },

  // 2. Obtener un usuario por ID
  findById: async (id) => {
    const [user] = await pool.query("SELECT id, name, document, email FROM users WHERE id = ?", [id]);
    return user[0] || null;
  },

  // 3. Obtener usuario por documento (Para el LOGIN: aquí SÍ necesitamos el password_hash)
  findByDocument: async (document) => {
    const [user] = await pool.query(
      "SELECT id, name, document, email, password_hash FROM users WHERE document = ?", 
      [document]
    );
    return user[0] || null;
  },

  // 4. Actualizar usuario
  update: async (id, data) => {
    // Usamos pool.query con el objeto data para que mysql2 mapee las columnas automáticamente
    const [result] = await pool.query("UPDATE users SET ? WHERE id = ?", [data, id]);
    if (result.affectedRows === 0) return null;

    return await UserModel.findById(id);
  },

  // 5. Eliminar usuario
  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },

  // 6. Crear un nuevo usuario
  create: async (newUser) => {
    const { name, document, email, password_hash } = newUser;
    const [result] = await pool.query(
      "INSERT INTO users (name, document, email, password_hash) VALUES (?, ?, ?, ?)",
      [name, document, email, password_hash],
    );

    return await UserModel.findById(result.insertId);
  },

  // 7. Actualizar refresh_token
  updateRefreshToken: async (userId, refresh_token) => {
    await pool.query("UPDATE users SET refresh_token = ? WHERE id = ?",
      [refresh_token, userId]
    );
  },

  // 8. Buscar usuario por refresh_token
  findByRefreshToken: async (refresh_token) => {
    const [rows] = await pool.query("SELECT id, name, document, email FROM users WHERE refresh_token = ?",
      [refresh_token]
    );
    return rows[0] || null;
  },

  // 9. Borra el refresh_token
  revokeRefreshToken: async (userId) => {
    await pool.query("UPDATE users SET refresh_token = NULL WHERE id = ?",
      [userId]
    );
  },
    // 10. Obtener los permisos (codes) de un usuario basado en sus roles
  getPermissions: async (userId) => {
    const query = `
      SELECT DISTINCT p.code, p.description            -- <--- Aquí USAS el alias
      FROM permissions p                -- <--- AQUÍ defines que 'permissions' se llamará 'p'
      INNER JOIN role_permissions rp    -- <--- AQUÍ defines que 'role_permissions' se llamará 'rp'
        ON p.id = rp.permission_id      -- <--- Aquí USAS ambos para comparar
     INNER JOIN user_roles ur          -- <--- AQUÍ defines que 'user_roles' se llamará 'ur'
        ON rp.role_id = ur.role_id      
      WHERE ur.user_id = ?             -- <--- Aquí USAS el alias 'ur'
    `;
    const [rows] = await pool.query(query, [userId]);
    
    // Si no hay filas, devolvemos un array vacío (siguiendo la lógica de consistencia)
    if (rows.length === 0) return [];

    // Mapeamos para devolver un array simple de strings ['permiso.uno', 'permiso.dos']
    return rows
  }
};
