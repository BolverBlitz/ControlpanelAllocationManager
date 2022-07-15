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

const GetNodeUsage = function (NodeID) {
    return new Promise(function (resolve, reject) {
        if (typeof NodeID !== "number") { reject(new Error("NodeID must be a number")); }
        pterodactyl_db.getConnection(function (err, connection) {
            if (err) {
                reject(err);
            }else{
                connection.query(`SELECT nodes.name, IFNULL(SUM(servers.memory), 0) as sum_memory, IFNULL(SUM(servers.disk), 0) as sum_disk FROM servers INNER JOIN nodes ON servers.node_id = nodes.id WHERE servers.node_id = ${NodeID};`, function (err, rows, fields) {
                    connection.release();
                    if (err) {
                        reject(err);
                    }
                    resolve(rows[0]);
                });
            }
        });
    });
}

const GetNodeResources = function (NodeID) {
    return new Promise(function (resolve, reject) {
        if (typeof NodeID !== "number") { reject(new Error("NodeID must be a number")); }
        pterodactyl_db.getConnection(function (err, connection) {
            console.log(err);
            if (err) {
                reject(err);
            }else{
                connection.query(`SELECT memory, memory_overallocate, disk, disk_overallocate FROM nodes WHERE nodes.id = ${NodeID};`, function (err, rows, fields) {
                    connection.release();
                    if (err) {
                        reject(err);
                    }
                    resolve(rows[0]);
                });
            }
        });
    });
}

const GetNodes = function () {
    return new Promise(function (resolve, reject) {
        controlpanel_db.getConnection(function (err, connection) {
            if (err) {
                reject(err);
            }else{
                connection.query(`SELECT id, name FROM nodes;`, function (err, rows, fields) {
                    connection.release();
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                });
            }
        });
    });
}

const GetNodesProductLinks = function () {
    return new Promise(function (resolve, reject) {
        controlpanel_db.getConnection(function (err, connection) {
            if (err) {
                reject(err);
            }else{
                connection.query(`SELECT node_id, product_id FROM node_product;`, function (err, rows, fields) {
                    connection.release();
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                });
            }
        });
    });
}

const GetProductNameAndID = function () {
    return new Promise(function (resolve, reject) {
        controlpanel_db.getConnection(function (err, connection) {
            if (err) {
                reject(err);
            }else{
                connection.query(`SELECT id, name FROM products;`, function (err, rows, fields) {
                    connection.release();
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                });
            }
        });
    });
}

const DelProductNodeLink = function (NodeID, ProductID) {
    return new Promise(function (resolve, reject) {
        if (typeof NodeID !== "number") { reject(new Error("NodeID must be a number")); }
        controlpanel_db.getConnection(function (err, connection) {
            if (err) {
                reject(err);
            }else{
                connection.query(`DELETE FROM node_product WHERE node_id = '${NodeID}' AND product_id = '${ProductID}';`, function (err, rows, fields) {
                    connection.release();
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                });
            }
        });
    });
}

const AddProductNodeLink = function (NodeID, ProductID) {
    return new Promise(function (resolve, reject) {
        if (typeof NodeID !== "number") { reject(new Error("NodeID must be a number")); }
        const values = [NodeID, ProductID];
        controlpanel_db.getConnection(function (err, connection) {
            if (err) {
                reject(err);
            }else{
                connection.query(`INSERT INTO node_product (node_id, product_id) VALUES (?)`, [values], function (err, rows, fields) {
                    connection.release();
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                });
            }
        });
    });
}

const pterodactyl = {
    get: {
        NodeUsage: GetNodeUsage,
        NodeResources: GetNodeResources,
    }
}

const controlpanel = {
    get: {
        ProductNameAndID: GetProductNameAndID,
        NodesProductLinks: GetNodesProductLinks,
        Nodes: GetNodes
    },
    add: {
        ProductNodeLink: AddProductNodeLink
    },
    del: {
        ProductNodeLink: DelProductNodeLink
    }
}

module.exports = {
    pterodactyl,
    controlpanel
}