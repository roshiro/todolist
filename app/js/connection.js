;(function() {

  var db,
  open = function() {
    var size = 2 * 1024 * 1024;
    db = openDatabase('todolistdb', '1.0', 'ToDo List DB', size);
    createTables();
  },

  createTables = function() {
    conn().transaction(function (tx) {
      // tx.executeSql("DROP TABLE IF EXISTS task;");
      tx.executeSql("CREATE TABLE IF NOT EXISTS " +
        "task ( " +
          "id         INTEGER PRIMARY KEY, " +
          "text       TEXT, " +
          "completed  INTEGER DEFAULT 0, " +
          "created_at INTEGER " +
        "); ");
    });
  },

  conn = function() {
    if(!db) {
      open();
    }
    return db;
  };

  window.connection = {

    /**
     * Adds a new task.
     * @param {Object} task to be added
     *        format: {text: 'dummy'}
     */
    addTask: function(data, callback) {
      conn().transaction(function(tx) {
        tx.executeSql("INSERT INTO task (id, text, created_at) VALUES (NULL, ?, date('now'))", [data.text],
          function (tx, result) {
            callback(result.insertId);
          });
      });
    },

    /**
     * Returns all the tasks.
     * @param {Function} callback to be called with results from query
     */
    getTasks: function(callback) {
      conn().transaction(function(tx) {
        tx.executeSql(("SELECT * FROM task"), [], function (tx, results) {
          if(callback) {
            callback(window.connection.formatSQLResultSet(results));
          }
        });
      });
    },

    getTaskById: function(id, callback) {
      conn().transaction(function(tx) {
        tx.executeSql(("SELECT * FROM task WHERE id = ?"), [id], function (tx, results) {
          if(callback) {
            callback(window.connection.formatSQLResultSet(results)[0]);
          }
        });
      });
    },

    /**
     * Returns an array of objects.
     * @param {SQLResultSet} result set returned from a query
     * @return {Array} array of objects
     */
    formatSQLResultSet: function(resultSet) {
      var result = [],
          len = resultSet.rows.length;

      for (var i = 0; i < len; i++) {
        result.push(resultSet.rows.item(i));
      }
      return result;
    }

  };

})();
