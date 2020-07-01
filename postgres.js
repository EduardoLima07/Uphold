const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'Uphold',
    password: 'postgres',
    port: 5432,
});

client.connect();

var result = null;

var x = async function getData(query){
     await client
    .query(query)
    .then(res => {          
        return res.rows;
    })
    .catch(e => console.error(e.stack));
}

function setData(query){
    client
    .query(query)
    .then()
    .catch(e => console.error(e.stack))
}

function GetValue(){
    return result;
}


module.exports.x = x;
module.exports.setData = setData;
module.exports.GetValue = GetValue;
module.exports.result = result;

