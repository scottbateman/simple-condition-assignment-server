/**
 * Configure the server using the options below.
*/
const HTTP_PORT = 9667;                         //server port
const DB_NAME = "scary_game_condition.db";      //database name... this database file will be created unless already exists
const CONDITIONS = ['play','watch'];            //provide the name of the conditions
const CONDITION_SERVER_PATH = "condition";      //the directory path on the server where conditions will be served from... 
                                                //can be "empty"
//exports... do not touch
module.exports.HTTP_PORT = HTTP_PORT;
module.exports.DB_NAME = DB_NAME;
module.exports.CONDITIONS = CONDITIONS;
module.exports.CONDITION_SERVER_PATH = CONDITION_SERVER_PATH;