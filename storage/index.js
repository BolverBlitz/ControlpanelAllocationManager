const fs = require('fs');

/* Example for node_producs file
{
    "NodeID": ["ProductID", "ProductID", "ProductID"],
    "NodeID": ["ProductID", "ProductID", "ProductID"],
    "NodeID": ["ProductID", "ProductID", "ProductID"],
    ...
}
*/


let CheckIfFileExists = function (Filename) {
    return new Promise(function (resolve, reject) {
        resolve(fs.existsSync(`./${Filename}.json`));
    });
}

module.exports = {
    CheckIfFileExists
}