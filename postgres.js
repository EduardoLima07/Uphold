const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'Uphold',
    password: 'postgres',
    port: 5432,
});

var result = []

client.connect(function(err) {
    if (err) throw err;
  });

function getData(query, callback){
    client
    .query(query)
    .then(res => {          
        callback(null, res.rows);
    })
    .catch(e => console.error(e.stack));
}



function setData(query){
    client
    .query(query)
    .then()
    .catch(e => console.error(e.stack))
}

function getValue(value){
    result = value;
}


module.exports.getData = getData;
module.exports.setData = setData;
module.exports.getValue = getValue;
module.exports.result = result;


