const pool = require("../database/db");

const createStockRequest = async (requestData) => {
    const { product_id, requested_by, type, quantity, reason } = requestData;

    const [result] = await pool.execute(
        `
        INSERT INTO stock_adjustment_requests
            (product_id, requested_by, type, quantity, reason)
        VALUES (?, ?, ?, ?, ?)
        `,
        [product_id, requested_by, type, quantity, reason]
    );

    return result.insertId;
};

const findAllStockRequests = async (status) => {
    let query = `
        SELECT
            sar.id,
            sar.product_id,
            p.name AS product,
            CONCAT(u.first_name, ' ', u.last_name) AS requested_by_name,
            sar.type,
            sar.quantity,
            sar.reason,
            sar.status,
            sar.created_at
        FROM stock_adjustment_requests sar
        INNER JOIN products p ON sar.product_id = p.id
        INNER JOIN users u ON sar.requested_by = u.id
    `;

    const params = [];

    if (status) {
        query += ` WHERE sar.status = ? `;
        params.push(status);
    }

    query += ` ORDER BY sar.id DESC `;

    const [rows] = await pool.execute(query, params);
    return rows;
};

const findStockRequestById = async (id) => {
    const [rows] = await pool.execute(
        `SELECT * FROM stock_adjustment_requests WHERE id = ?`,
        [id]
    );
    return rows[0];
};

const updateStockRequestStatus = async (id, status, reviewedBy) => {
    const [result] = await pool.execute(
        `
        UPDATE stock_adjustment_requests
        SET
            status = ?,
            reviewed_by = ?,
            reviewed_at = NOW()
        WHERE id = ?
        `,
        [status, reviewedBy, id]
    );

    return result.affectedRows;
};

module.exports = {
    createStockRequest,
    findAllStockRequests,
    findStockRequestById,
    updateStockRequestStatus,
};