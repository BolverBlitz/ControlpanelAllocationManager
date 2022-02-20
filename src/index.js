const db = require('../lib/db/mysql');
const storage = require('../storage/index');
let product_cache = {}; //Stores product IDs as key with the human readable name as value
const init = []

init.push(db.controlpanel.get.GetProductNameAndID())
init.push(storage.CheckIfFileExists('node_producs'))

Promise.all(init).then(function (values) {
    const [GetProductNameAndID, node_producs] = values; 

    GetProductNameAndID.forEach(function (row) {
        product_cache[row.id] = row.name;
    });

    if (!node_producs) {
        console.log("Running first time, creating node_producs file");
        db.controlpanel.get.GetNodes().then(function (nodes) {
            let node_producs = {};
            nodes.forEach(function (node) {
                node_producs[node.id] = [];
            });

            db.controlpanel.get.GetNodesProductLinks().then(function (links) {
                links.forEach(function (link) {
                    node_producs[link.node_id].push(link.product_id);
                });
                storage.WriteFile('node_producs', node_producs).catch(function (err) {
                    console.log(err);
                });
            });
        });
    }

    checknodes();
    //console.log(product_cache, node_producs);
}).catch(function (err) {
    console.log(err);
});

const checknodes = function () {
    db.controlpanel.get.GetNodes().then(function (nodes) {
        nodes.forEach(function (node) {
            Promise.all([db.pterodactyl.get.GetNodeResources(node.id), db.pterodactyl.get.GetNodeUsage(node.id)]).then(function (values) {
                const [resources, usage] = values; 
                console.log(resources, usage);
                /*
                if (usage[0].sum_memory > 80) {
                    console.log(`Node ${node.name} is over 80% CPU usage`);
                }
                */
            });
        });
    });
}