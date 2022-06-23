const { getConnection } = require("../client")

const getAll = async () => { // seleccionar todos los participantes
  const client = getConnection()
  try {
    const result = await client.query("SELECT * FROM skaters")
    return result.rows
  } catch (error) {
    throw new Error(error)
  }
}

const getByEmailClave = async (email, clave) => { // seleccionar a un participante por email y clave
  const client = getConnection()
  try {
    const query = {
      text: "SELECT * FROM skaters WHERE email = $1 AND clave = $2",
      values: [email, clave],
    }
    const result = await client.query(query)
    return result.rows[0]
  } catch (error) {
    throw new Error(error)
  }
}

const status = async (user) => { // cambiar de esatdo a un participante por id
  const client = getConnection()
  try {
    const query = {
      text: "UPDATE skaters SET estado = $1 WHERE id = $2 RETURNING *",
      values: [user.estado, user.id],
    }
    const result = await client.query(query)
    return result.rows[0]
  } catch (error) {
    throw new Error(error)
  }
}

const deleteById = async (id) => { // eliminar a un participante por id
  const client = getConnection()
  try {
    const query = {
      text: "DELETE FROM skaters WHERE id = $1 RETURNING *",
      values: [id],
    }
    const result = await client.query(query)
    return result.rows[0]
  } catch (error) {
    throw new Error(error)
  }
}

const create = async (user) => { // crear un participante
  const client = getConnection()
  try {
    const query = {
      text: "INSERT INTO skaters (email, nombre, clave, anos_experiencia, especialidad, foto, estado) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      values: [user.email, user.nombre, user.clave, user.anos_experiencia, user.especialidad, user.foto, user.estado],
    }
    const result = await client.query(query)
    return result.rows[0]
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (id, user) => { // actualizar un participante
  const client = getConnection()
  try {
    const query = {
      text: "UPDATE skaters SET nombre = $1, clave = $2, anos_experiencia = $3, especialidad = $4 WHERE id = $5 RETURNING *",
      values: [user.nombre, user.clave, user.anos_experiencia, user.especialidad, id],
    }
    const result = await client.query(query)
    return result.rows[0]
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = {
  getAll,
  getByEmailClave,
  status,
  deleteById,
  create,
  update,
}
