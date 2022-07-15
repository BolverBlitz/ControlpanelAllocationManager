const db = require('../lib/db/mysql');
const storage = require('../storage/index');
const { logger } = require('../lib/logger');
let product_cache = {}; //Stores product IDs as key with the human readable name as value
const init = []

if (process.env.NodeLoadPercent > 100) { throw new Error('NodeLoadPercent must be less or equel to 100%'); }

init.push(db.controlpanel.get.ProductNameAndID())
init.push(storage.CheckIfFileExists('node_producs'))

Promise.all(init).then(function (values) {
    const [GetProductNameAndID, node_producs] = values;

    GetProductNameAndID.forEach(function (row) {
        product_cache[row.id] = row.name;
    });

    if (!node_producs) {
        logger('system', 'Running first time, creating node_producs file');
        db.controlpanel.get.Nodes().then(function (nodes) {
            let node_producs = {};
            nodes.forEach(function (node) {
                node_producs[node.id] = [];
            });

            db.controlpanel.get.NodesProductLinks().then(function (links) {
                links.forEach(function (link) {
                    node_producs[link.node_id].push(link.product_id);
                });
                storage.WriteFile('node_producs', node_producs).catch(function (err) {
                    logger('error', err);
                });
            });
        });
    }

    checknodes();

    setInterval(() => {
        checknodes();
    }, process.env.CheckDelayInMS);
}).catch(function (err) {
    console.log(err);
});

const checknodes = function () {
    db.controlpanel.get.Nodes().then(function (nodes) {
        Promise.all([storage.ReadFile('node_producs'), db.controlpanel.get.NodesProductLinks()]).then(function (values) {
            const [file_node_producs, node_producs] = values;

            let currentavticenodelist = [];
            node_producs.forEach(function (link) {
                currentavticenodelist.push(link.node_id);
            });

            let jobs = [];

            nodes.forEach(function (node) {
                Promise.all([db.pterodactyl.get.NodeResources(node.id), db.pterodactyl.get.NodeUsage(node.id)]).then(function (values) {
                    const [resources, usage] = values;

                    const used_memory = (usage.sum_memory / (resources.memory + (resources.memory * (resources.memory_overallocate / 100))) * 100).toFixed(0);
                    const used_disk = (usage.sum_disk / (resources.disk + (resources.disk * (resources.disk_overallocate / 100))) * 100).toFixed(0);

                    if(Number(used_memory) > Number(process.env.NodeLoadPercent) || Number(used_disk) > Number(process.env.NodeLoadPercent)) {
                        logger('info', `Node ${node.name} is over ${process.env.NodeLoadPercent}% memory usage. Current usage ${used_memory}%`);
                        if(currentavticenodelist.indexOf(node.id) !== -1) {
                            file_node_producs[node.id].forEach(function (product_id) {
                                logger('warning', `Should deleting ${product_cache[product_id]} from ${node.name}`);
                                jobs.push(db.controlpanel.del.ProductNodeLink(node.id, product_id));
                            });
                        }
                    }else{
                        logger('info', `Node ${node.name} is under ${process.env.NodeLoadPercent}% memory usage. Current usage ${used_memory}%`);
                        if(currentavticenodelist.indexOf(node.id) === -1) {
                            file_node_producs[node.id].forEach(function (product_id) {
                                logger('warning', `Should adding ${product_cache[product_id]} to ${node.name}`);
                                jobs.push(db.controlpanel.add.ProductNodeLink(node.id, product_id));
                            });
                        }
                    }
                }).catch(function (err) {
                    console.log(err);
                });
            });
        });
    }).catch(function (err) {
        console.log(err);
    });
}