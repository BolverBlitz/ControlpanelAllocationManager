const axios = require('axios');

/**
 * Will get all the nodes from the pterostatusAPI and return them as an array.
 * @returns {Promise<*>}
 */
let GetPteroStatusData = function () {
    return new Promise(function (resolve, reject) {

        if (process.env.PteroStatusToken) {
            const config = {
                headers: { Authorization: `Bearer ${process.env.PteroStatusToken}` }
            };

            axios.get(
                `${process.env.PteroStatusURL}stats`,
                config
            ).then(function (values) {
                for (let i = 0; i < values.data.length; i++) {
                    let node = values.data[i];
                    if (node.online === true) {
                        node.PS_CPULoad = (node.cl).toFixed(0);
                    } else {
                        node.PS_CPULoad = 100;
                    }
                }
                resolve(values.data)
            }).catch(function (error) {
                reject(error);
            });
        } else {
            axios.get(
                `${process.env.PteroStatusURL}stats`
            ).then(function (values) {
                for (let i = 0; i < values.data.length; i++) {
                    let node = values.data[i];
                    if (node.online === true) {
                        node.PS_CPULoad = (node.cl).toFixed(0);
                    } else {
                        node.PS_CPULoad = 100;
                    }
                }
                resolve(values.data)
            }).catch(function (error) {
                reject(error);
            });
        }
    });
}

module.exports = {
    GetPteroStatusData
}