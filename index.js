const express = require("express");
var bodyParser = require("body-parser");
const app = express();
const cors = require('cors')
const port = 8080;
const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "127.0.0.1",
  port: 8889,
  user: "root",
  database: "staff",
  password: "root",
});
const corsOptions = {
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

app.use(cors(corsOptions));



app.use(bodyParser.json());

connection.connect();

// query all records
app.get("/", (req, res) => {
    const query = "SELECT * FROM staff_table";
    connection.query(query, function (err, result) {
      if (err) {
        console.log("query err: " + err);
        return;
      } else {
        console.log("result found " + result.length);
        console.log("result query " + JSON.stringify(result));
        res.json(formatResponse(200,"success",{record:result},null));
      }
    });
});


// insert record
app.post("/add", (req, res) => {
  let response = {};
  if (!req.body.id) {
    res.json(formatResponse(400,"bad request",null,{errorMsg: "Filed id is not empty."}));
  } else if (!req.body.name) {
    res.json(formatResponse(400,"bad request",null,{errorMsg: "Filed name is not empty."}));
  } else if (!req.body.gender) {
    res.json(formatResponse(400,"bad request",null,{errorMsg: "Filed gender is not empty."}));
  } else if (!req.body.birthday) {
    res.json(formatResponse(400,"bad request",null,{errorMsg: "Filed birthday is not empty."}));
  } else {
    let id = req.body.id;
    let name = req.body.name;
    let gender = req.body.gender;
    let birthday = req.body.birthday;
    const staff = { id: id, name: name, gender: gender, birthday: birthday };

    const query = `SELECT * FROM staff_table where id = '${id}'`;
    connection.query(query, function (err, result) {
      if (err) {
        console.log("query err: " + err);
        return;
      } else {
        console.log("result found " + result.length);
        console.log("result query " + JSON.stringify(result));
      }
    });

    const sql = `INSERT INTO staff_table (id,name,gender,birthday) VALUES('${id}','${name}','${gender}','${birthday}')`;
    connection.query(sql, function (err, result) {
      if (err) {
        console.log("error : " + err);
        res.json(formatResponse(400,"bad request",null,err.message));
        return;
      } else {
        console.log("result added: " + JSON.stringify(result));
        console.log("inserted success");
        res.json(formatResponse(201,"created",staff,null));
        return;
      }
    });
  }
});

// update record

app.put("/edit", (req, res) => {
  console.log(req)
    let response = {};
    if (!req.body.id) {
      res.json(formatResponse(400,"bad request",null,{errorMsg: "Filed id is not empty."}));
    } else if (!req.body.name) {
      res.json(formatResponse(400,"bad request",null,{errorMsg: "Filed name is not empty."}));
    } else if (!req.body.gender) {
      res.json(formatResponse(400,"bad request",null,{errorMsg: "Filed gender is not empty."}));
    } else if (!req.body.birthday) {
      res.json(formatResponse(400,"bad request",null,{errorMsg: "Filed birthday is not empty."}));
    } else {
      let id = req.body.id;
      let name = req.body.name;
      let gender = req.body.gender;
      let birthday = req.body.birthday;
      const staff = { id: id, name: name, gender: gender, birthday: birthday };
  
      const query = `SELECT * FROM staff_table where id = '${id}'`;
      connection.query(query, function (err, result) {
        if (err) {
          console.log("query err: " + err);
          return;
        } else {
          console.log("result found " + result.length);
          console.log("result query " + JSON.stringify(result));
          if(result.length == 0){
            console.log("err: record id didn't found!");
            res.json(formatResponse(400,"bad request",null,[{errorMsg: "id " + id + " is not found."}]));
            return;
          }
          
        }
      });
  
      const sql = `UPDATE staff_table SET name ='${name}', gender = '${gender}', birthday = '${birthday}' where id ='${id}'`;
      connection.query(sql, function (err, result) {
        if (err) {
          console.log("error : " + err);
          res.json(formatResponse(400,"bad request",null,err.message));
          return;
        } else {
          console.log("result added: " + JSON.stringify(result));
          console.log("updated success");
          res.json(formatResponse(200,"success",staff,null));
          return;
        }
      });
    }
});


// delete record
app.delete("/delete/:id", (req, res) => {
    console.log(req.params.id);
    var id = req.params.id;
    if(!req.params.id){
        res.json(formatResponse(400,"bad request",null,{errorMsg: "param id is not empty."}))
    }else{
        const query = `SELECT * FROM staff_table where id = '${id}'`;
        connection.query(query, function (err, result) {
          if (err) {
            console.log("query err: " + err);
            return;
          } else {
            console.log("result found " + result.length);
            console.log("result query " + JSON.stringify(result));
            if(result.length == 0){
              console.log("err: record id didn't found!");
              res.json(formatResponse(400,"bad request",null,[{errorMsg: "id " + id + " is not found."}]));
              return;
            }
            const sql = `DELETE from staff_table where id ='${id}'`;
            connection.query(sql, function (err, result) {
              if (err) {
                console.log("error : " + err);
                res.json(formatResponse(400,"bad request",null,err.message));
                return;
              } else {
                console.log("result added: " + JSON.stringify(result));
                console.log("deleted success");
                let content = "staff id " + id + " has been removed.";
                res.json(formatResponse(200,"success",{msg: content},null));
                return;
              }
            });
          }
        });

    }

});

// query from input param
app.get("/search/:input_value", (req, res) => {
    console.log(req.params.input_value);
    var input_value = req.params.input_value;
    if(!req.params.input_value || req.params.input_value == undefined || req.params.input_value == ""){
        res.json(formatResponse(400,"bad request",null,{errorMsg: "param search is not empty."}))
    }else{
        // query by input
        const query = `SELECT * FROM staff_table where id = '${input_value}' OR gender = '${input_value}' OR birthday = '${input_value}'`;
        connection.query(query, function (err, result) {
          if (err) {
            console.log("query err: " + err);
            return;
          } else {
            console.log("result found " + result.length);
            console.log("result query " + JSON.stringify(result));
            if(result.length == 0){
              console.log("err: record id didn't found!");
              res.json(formatResponse(400,"bad request",null,[{errorMsg: "Search input " + input_value + " is not found."}]));
              return;
            }else{
                let staffs = result;
                res.json(formatResponse(200,"success",{record:staffs},null));
                return;
            }
            
          };
          
        });

    }
});

app.listen(port, () => {
  console.log("Server running on port: " + port);
});

// external function

function formatResponse(returnCode, status, data, error) {
  let response = [];
  if (data != undefined) {
    response = { returnCode: returnCode, status: status, data: data };
  } else {
    response = {
      returnCode: returnCode,
      status: status,
      error: [error],
    };
  }
  return response;
}
// connection.end();
