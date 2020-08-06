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
function createTables(ds,tables){
    return new Promise((resolve,reject)=>{
        ds.automigrate(tables,(err)=>{
            if(err){return reject(err)}
            resolve(tables);
        })
    })
}
function createRole(app,role){
    var Role = app.models.Role;
    return new Promise((resolve,reject)=>{
        Role.create({"name":role},(err,res)=>{
            if(err){return reject(err);}
            resolve(res);
        });
    })
}
function createRoleMap(role,User){
    return new Promise((resolve,reject)=>{
        role.principals.create({"principalType":"User","principalId":User.id},(err,res)=>{
            if(err){return reject(err)}
            resolve(res)
        })
    });
}

function insertDefaultUser(app,username,email,password){
    var User = app.models.User;
    return new Promise((resolve,reject)=>{
        User.create({
            'username':username,
            'email':email,
            'password':password
        },(err,res)=>{
            if(err){return reject(err)}
            resolve(res)
        })
    })
}
//================================================================
async function migrate(){
    try{
        console.log("Creating the tables ....");

        let tables = await createTables(ds,modelList);
        console.log("Success:",tables);

         let manager = await createRole(app,"manager");
        let customer = await createRole(app,"customer");
        //let user = await createRole(app,"user");
        //let guest = await createRole(app,"guest");

        console.log("Creating user 1 ...");
        let user1 = await insertDefaultUser(app,"manager","manager@system.com","1234567","01137332108");
        console.log("User 1 created:",user1);
        let managerMapped = await createRoleMap(manager,user1); 
        console.log("Mapped user :",managerMapped);
        let customerMapped = await createRoleMap(customer,user1); 
        console.log("Mapped user :",customerMapped);

        console.log("Creating user 2 ...");
        let user2 = await insertDefaultUser(app,"user","user@system.com","1234567","01137332108");
        console.log("User 2 created:",user2);
        let userMapped = await createRoleMap(customer,user2); 
        console.log("Mapped user :",userMapped)

        process.exit(0);
    }catch(err){
        console.log("Failed : ",err);
        process.exit(1);
    }
}

migrate();
/* eslint-enable */
