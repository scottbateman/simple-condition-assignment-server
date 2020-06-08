var express = require("express");
var app = express();
var fs = require('fs');

const config = require('./config');
const sqlite = require('sqlite3').verbose();

let table_create = false;

let tables = [
    {
        table_name: "conditions",
        columns: [
            "conditionName TEXT",
            "count INT"
        ]
    } 
];

//test to see if db exists
try{
    if (fs.existsSync(config.DB_NAME))
    {
        console.log(`${config.DB_NAME} found.`);
    }
    else{
        console.log(`${config.DB_NAME} NOT found. Will create it and try to create tables.`);
        table_create = true;
    }
} catch(err){
    console.log(`${config.DB_NAME} NOT found. Will create it and try to create tables.`);
    table_create = true;
}

//connect or create db
var db = new sqlite.Database(config.DB_NAME, (err) => {
    if (err){
        console.log(`Cannot connect to db: ${config.DB_NAME}`);
        process.exit();
    }
    //create tables
    else if (table_create){
        console.log("CREATING TABLES...");
        //create database creation statements
        tables.forEach(table=> {
            let create_table = `CREATE TABLE ${table.table_name} \(${table.columns.join()}\)`;
            console.log(create_table);
            db.exec(create_table, (err, row) => {
                if (err){
                    console.error('error creating table:'+ err);   
                }
                else{
                    console.log('created table');
                }
            });    
            config.CONDITIONS.forEach(conditionName =>{
                let insert_condition = `INSERT INTO ${table.table_name} values \('${conditionName}', 0\)`
                console.log(`trying to insert condition: ${insert_condition}`);
                db.exec(insert_condition, (err, row) => {
                    if (err){
                        console.error('error creating table:'+ err);   
                    }
                    else{
                        console.log('created table');
                    }
                });    
            });        
        });
    }
    console.log(`Connected to db: ${config.DB_NAME}`);
});

//start server
var http_server = app.listen(config.HTTP_PORT, () => {
    console.log(`simple_condition_assignment_server running on port ${config.HTTP_PORT}`);
});

//set up endpoints 
app.get('/' + config.CONDITION_SERVER_PATH, function(req, res){
    let csv_results = [];
    let select = `select rowid as conditionNum,conditionName, min(count) as count from conditions;`        
    var columns = [];
    var output = "";
    var count = 0;
    var rowid = -1;

    db.all(select, (err, rows)=>{
        let hasRows = false;
        if (err)
        {   
            let error_msg = `error on query:
                ${select}
            `;
            console.error(error_msg);
            console.error(err);
            res.setHeader('Content-type', 'text/plain');
            res.setHeader('Pragma','no-cache');
            res.setHeader('Expires','0');
            res.status(500).send(error_msg);
        }
        else{
            for (r in rows)
            {
                let row = rows[r]; 
                if (columns.length == 0)
                {
                    columns = Object.getOwnPropertyNames(row);
                }
                let b = [];
                for (col in columns)
                {
                    b.push(row[columns[col]]);
                }
                output += b.join(',') + '\n';

                //update count
                count = row['count'] + 1;

                //rowid
                rowid = row['conditionNum'];
            }

            output = columns.join(',') + '\n' + output;
            res.setHeader('Content-type', 'text/plain');
            res.setHeader('Pragma','no-cache');
            res.setHeader('Expires','0');
            res.status(200);
            res.send(output);
            hasRows = true;
        }
        if (!hasRows)
        {
            let error_msg = `query returns no rows:
                ${select}
            `;
            res.setHeader('Content-type', 'text/plain');
            res.setHeader('Pragma','no-cache');
            res.setHeader('Expires','0');
            res.status(500).send(error_msg);
            console.log(error_msg);
        }
        //if condition returned update it
        if (rowid > 0){
            let update = `update conditions set count = ${count} where rowid=${rowid}`;
            db.exec(update, (err, row) => {
                if (err){
                    console.error('error updating table:'+ update);   
                }
                else{
                    console.log(`conditionNum ${rowid} updated at ${Date()}!`);
                }
            });    
        }
    });
});

//default response for any other request
app.use(function(req,res){
   console.log("no endpoint: "+req.params);
   res.status(404).send("Not found");
});

function cleanup(){
    console.log("Closing simple_condition_assignment_server_server");
    http_server.close();
    db.close();
    process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
