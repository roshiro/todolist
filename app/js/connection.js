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
    addTask: function(data) {
      conn().transaction(function(tx) {
        tx.executeSql("INSERT INTO task (id, text, created_at) VALUES (NULL, ?, date('now'))", [data.text]);
      });
    },

    getTasks: function(callback) {
      conn().transaction(function(tx) {
        tx.executeSql(("SELECT * FROM task"), [], function (tx, results) {
          if(callback) {
            callback(results);
          }
          var len = results.rows.length, i;
          for (i = 0; i < len; i++) {
            console.log(results.rows.item(i).text);
          }
        });
      });
    }

  };

})();
