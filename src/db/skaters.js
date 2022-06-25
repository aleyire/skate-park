const { getConnection } = require("../pool")

const getAll = async () => { // seleccionar todos los participantes
  const pool = getConnection()
  try {
    const query = "SELECT * FROM skaters"
    const result = await pool.query(query)
    return result.rows
  } catch (error) {
    throw new Error(error)
  }
}

const statusEstado = async (estado, id) => { // cambiar de esatdo a un participante por id
  const pool = getConnection()
  try {
    const query = {
      text: "UPDATE skaters SET estado = $1 WHERE id = $2 RETURNING *",
      values: [estado, id],
    }
    const result = await pool.query(query)
    return result.rows[0]
  } catch (error) {
    throw new Error(error)
  }
}

const deleteById = async (id) => { // eliminar a un participante por id
  const pool = getConnection()
  try {
    const query = {
      text: "DELETE FROM skaters WHERE id = $1 RETURNING *",
      values: [id],
    }
    const result = await pool.query(query)
    return result.rows[0]
  } catch (error) {
    throw new Error(error)
  }
}

const create = async (email, nombre, password, anos_experiencia, especialidad, foto, estado) => { // crear un participante
  const pool = getConnection()
  try {
    const query = {
      text: "INSERT INTO skaters (email, nombre, password, anos_experiencia, especialidad, foto, estado) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      values: [email, nombre, password, anos_experiencia, especialidad, foto, estado],
    }
    const result = await pool.query(query)
    return result.rows[0]
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (nombre, password, anos_experiencia, especialidad, id) => { // actualizar un participante
  const pool = getConnection()
  try {
    const query = {
      text: "UPDATE skaters SET nombre = $1, password = $2, anos_experiencia = $3, especialidad = $4 WHERE id = $5 RETURNING *",
      values: [nombre, password, anos_experiencia, especialidad, id],
    }
    const result = await pool.query(query)
    return result.rows[0]
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = {
  getAll,
  statusEstado,
  deleteById,
  create,
  update,
}
