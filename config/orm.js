// Import MySQL connection.
const connection = require("../config/connection.js");

printQuestionMarks = (num) => {
    const arr = [];
    for (const i = 0; i < num; i++) {
      arr.push("?");
    }
    return arr.toString();
  }

// Helper function to convert object key/value pairs to SQL syntax
objToSql = (ob) => {
    const arr = [];
    // loop through the keys and push the key/value as a string int arr
    for (var key in ob) {
    var value = ob[key];
    // check to skip hidden properties
    if (Object.hasOwnProperty.call(ob, key)) {
      // if string with spaces, add quotations (Buckhorn Burger => 'Buckhorn Burger')
      if (typeof value === "string" && value.indexOf(" ") >= 0) {
        value = "'" + value + "'";
      }
      arr.push(key + "=" + value);
    }
  }
  // translate array of strings to a single comma-separated string
  return arr.toString();
}

    // Object for all our SQL statement functions.
    const orm = {
        // Display all burgers in the burger_db
        all: (table, cb) => {
            const queryString = "SELECT * FROM " + table + ";";
            connection.query(queryString, function(err, result) {
                if (err) {
                    throw err;
                }
                cb(result);
            });
        },
    // adds a new burger to burgers_db 
    create: (table, cols, vals, cb) => {
    const queryString = "INSERT INTO " + table;

    queryString += " (";
    queryString += cols.toString();
    queryString += ") ";
    queryString += "VALUES (";
    queryString += printQuestionMarks(vals.length);
    queryString += ") ";

    console.log(queryString);

    connection.query(queryString, vals, (err, result) => {
      if (err) {
        throw err;
      }
      cb(result);
    });
  },
  // Set burger devoured status to true 
  update: (table, objColVals, condition, cb) => {
    const queryString = "UPDATE " + table;

    queryString += " SET ";
    queryString += objToSql(objColVals);
    queryString += " WHERE ";
    queryString += condition;

    console.log(queryString);
    connection.query(queryString, (err, result) => {
      if (err) {
        throw err;
      }
      cb(result);
    });
  },
  // Delete a burger from burgers_db
  delete: (table, condition, cb) => {
    const queryString = "DELETE FROM " + table;
    queryString += " WHERE ";
    queryString += condition;

    connection.query(queryString, (err, result) => {
      if (err) {
        throw err;
      }
      cb(result);
    });
  }
};

// Export the ORM object in module.exports
module.exports = orm;