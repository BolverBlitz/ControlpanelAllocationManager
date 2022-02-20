const fs = require('fs');

/* Example for node_producs file
{
    "NodeID": ["ProductID", "ProductID", "ProductID"],
    "NodeID": ["ProductID", "ProductID", "ProductID"],
    "NodeID": ["ProductID", "ProductID", "ProductID"],
    ...
}
*/

/**
 * Check if tile in storage folder exists
 * @param {String} Filename 
 * @returns 
 */
let CheckIfFileExists = function (Filename) {
    return new Promise(function (resolve, reject) {
        resolve(fs.existsSync(`./storage/${Filename}.json`));
    });
}

/**
 * Read file from storage folder
 * @param {String} Filename 
 * @returns 
 */
let ReadFile = function (Filename) {
    return new Promise(function (resolve, reject) {
        fs.readFile(`./storage/${Filename}.json`, 'utf8', function (err, data) {
            if (err) {
                reject(err);
            }
            resolve(JSON.parse(data));
        });
    });
}

/**
 * Write a js object as json file to storage folder
 * @param {String} Filename 
 * @param {Json} Data 
 * @returns 
 */
let WriteFile = function (Filename, Data) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(`./storage/${Filename}.json`, JSON.stringify(Data), function (err) {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}

module.exports = {
    CheckIfFileExists,
    ReadFile,
    WriteFile
}