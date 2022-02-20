const mysql = require("mysql");

const pterodactyl_db = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_Pterodactyl,
    charset: "utf8mb4"
});

const controlpanel_db = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_Controlpanel,
    charset: "utf8mb4"
});

let GetNodeUsage = function (NodeID) {
    return new Promise(function (resolve, reject) {
        if (typeof NodeID !== Number) { reject(new Error("NodeID must be a number")); }
        pterodactyl_db.getConnection(function (err, connection) {
            connection.query(`SELECT nodes.name, IFNULL(SUM(servers.memory), 0) as sum_memory, IFNULL(SUM(servers.disk), 0) as sum_disk FROM servers INNER JOIN nodes ON servers.node_id = nodes.id WHERE servers.node_id = ${NodeID};`, function (err, rows, fields) {
                connection.release();
                if (err) {
                    reject(err);
                }
                resolve(rows);
            });
        });
    });
}

let GetProductNameAndID = function () {
    return new Promise(function (resolve, reject) {
        controlpanel_db.getConnection(function (err, connection) {
            connection.query(`SELECT id, name FROM dashboard.products;`, function (err, rows, fields) {
                connection.release();
                if (err) {
                    reject(err);
                }
                resolve(rows);
            });
        });
    });
}

let pterodactyl = {
    get: {
        GetNodeUsage: GetNodeUsage
    }
}

let controlpanel = {
    get: {
        GetProductNameAndID: GetProductNameAndID
    }
}

module.exports = {
    pterodactyl,
    controlpanel
}