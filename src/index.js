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
        //File dosn´t exist
    }

    console.log(product_cache, node_producs);
}).catch(function (err) {
    console.log(err);
});