/* eslint-disable */
'use strict';
var app = require('../server');
var modelList = [

    'User',
    'AccessToken',
    'ACL',
    'RoleMapping',
    'Role',
    'bike',
    'booking',
    'payment',
    'picture',
    'startDate',
    'endDate'
];
var ds = app.datasources.db;

//==================== Promisify Callback =========================
function updateTables(ds, tables) {
    return new Promise((resolve, reject) => {
        ds.autoupdate(tables, (err) => {
            if (err) { return reject(err) }
            resolve(tables);
        })
    })
}

//================================================================
async function migrate() {
    try {
        console.log("Updating the tables ....");

        let tables = await updateTables(ds, modelList);
        console.log("Success:", tables);

        process.exit(0);
    } catch (err) {
        console.log("Failed : ", err);
        process.exit(1);
    }
}

migrate();
/* eslint-enable */
