const pool = require("../database/db");

const findAllSuppliers = async () => {
    const [rows] = await pool.execute(
        `
        SELECT
            id,
            name,
            contact_person,
            email,
            phone,
            address,
            created_at,
            updated_at
        FROM suppliers
        WHERE is_active = 1
        ORDER BY id DESC
        `
    );

    return rows;
};

const findSupplierById = async (id) => {
    const [rows] = await pool.execute(
        `
        SELECT
            id,
            name,
            contact_person,
            email,
            phone,
            address,
            created_at,
            updated_at
        FROM suppliers
        WHERE id = ?
        AND is_active = 1
        `,
        [id]
    );

    return rows[0];
};

const findSupplierByName = async (name) => {
    const [rows] = await pool.execute(
        `
        SELECT *
        FROM suppliers
        WHERE name = ?
        AND is_active = 1
        `,
        [name]
    );

    return rows[0];
};

const findSupplierByEmail = async (email) => {
    const [rows] = await pool.execute(
        `
        SELECT *
        FROM suppliers
        WHERE email = ?
        AND is_active = 1
        `,
        [email]
    );

    return rows[0];
};

const createSupplier = async (supplierData) => {

    const {
        name,
        contact_person,
        email,
        phone,
        address
    } = supplierData;

    const [result] = await pool.execute(
        `
        INSERT INTO suppliers(
            name,
            contact_person,
            email,
            phone,
            address
        )
            VALUES(?, ?, ?, ?, ?)
        `,
        [
            name,
            contact_person,
            email,
            phone,
            address
        ]
    );

    return result.insertId;
};

const updateSupplier = async (id, supplierData) => {

    const {
        name,
        contact_person,
        email,
        phone,
        address
    } = supplierData;

    await pool.execute(
        `
        UPDATE suppliers
        SET
            name = ?,
            contact_person = ?,
            email = ?,
            phone = ?,
            address = ?
        WHERE id = ?
        `,
        [
            name,
            contact_person,
            email,
            phone,
            address,
            id
        ]
    );
};

const deleteSupplier = async (id) => {

    const [result] = await pool.execute(
        `
        UPDATE suppliers
        SET is_active = 0
        WHERE id = ?

        `,
        [id]
    );

    return result.affectedRows;
};

module.exports = {
    findAllSuppliers,
    findSupplierById,
    findSupplierByName,
    findSupplierByEmail,
    createSupplier,
    updateSupplier,
    deleteSupplier
};