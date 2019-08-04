const {
    Pool
} = require('pg')



exports.execute = async (dbname, script, connectionstring) => {
    //execute data
    let temp_con = connectionstring
    if (dbname != null) {
        temp_con.database = dbname
    }
    try {
        var pool = new Pool(temp_con)
        const client = await pool.connect()
        try {
            const res = await client.query(script)
            console.log("Execute action: " + res.rowCount + " row(s)");
            return {
                code: false,
                rowaction: res.rowCount
            }

        } catch (e) {
            console.log(script + ' : error code : ' + e.code + ' err.message : ' + e.message)
            return {
                code: e.code,
                message: e.message
            }
        } finally {
            client.release()
        }
    } catch (error) {
        console.log(script + ' : error code : ' + error.code + ' err.message : ' + error.message)
        return {
            code: error.code,
            message: error.message
        }
    }
}

exports.get = async (dbname, script, connectionstring) => {
    //get data
    let temp_con = connectionstring
    if (dbname != null) {
        temp_con.database = dbname
    }
    try {
        var pool = new Pool(temp_con)
        const client = await pool.connect()
        try {
            const res = await client.query(script)
            return {code:false,data:res.rows}

        } catch (e) {
            console.log(script + ' : error code : ' + e.code + ' err.message : ' + e.message)
            return {
                code: e.code,
                message: e.message
            }
        } finally {
            client.release()
        }
    } catch (error) {
        console.log(script + ' : error code : ' + error.code + ' err.message : ' + error.message)
        return {
            code: error.code,
            message: error.message
        }
    }
}

exports.upsert1 = (dbname, insert, update, connectionString, res) => {
    // 1 by 1 upsert
    var arr = [];
    var script = '';
    var temp = '';
  
    try {
      //debugger;
      arr = insert.split('VALUES')
      temp = arr[1].replace(/^\s+|\s+$/g, '');
      arr[1] = temp.substring(1, temp.length - 1);
      insert = arr[0] + " SELECT " + arr[1];
  
      var script = " WITH upsert AS (" + update + "  RETURNING *)";
      script += " " + insert + " ";
      script += " WHERE NOT EXISTS (SELECT * FROM upsert)";
  
      this.excute( script,dbname, connectionString, function (r) {
        res(r);
        return;
      })
  
    } catch (ex) {
      console.log('setUpsertScript : ' + ex)
      res(ex);
      return;
    }
  
  };