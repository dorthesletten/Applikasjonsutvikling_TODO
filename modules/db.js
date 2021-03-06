const pg = require("pg");
const connstring = process.env.DATABASE_URL;
const pool = new pg.Pool({
  connectionString: connstring,
  ssl: { rejectUnauthorized: false },
});

let dbMethods = {};

dbMethods.getAllToDoTasks = function (listid, userid) {
  let sql = "SELECT * FROM todo WHERE listid = $1 AND userid = $2";
  let values = [listid, userid];
  return pool.query(sql, values);
};

dbMethods.createToDoTask = function (heading, date, description, userid, listid) {
  let sql = "INSERT INTO todo (id, date, heading, description, userid, listid) VALUES(DEFAULT, $4, $1, $2, $3, $5) returning *";
  let values = [heading, description, userid, date, listid];
  return pool.query(sql, values);
};

dbMethods.deleteToDoTask = function (id, userid) {
  let sql = "DELETE FROM todo WHERE id = $1 AND userid = $2 RETURNING *";
  let values = [id, userid];
  return pool.query(sql, values);
};

dbMethods.editToDoTask = function (heading, date, description, id) {
  let sql = "UPDATE todo SET date = $1, heading = $2, description = $3 WHERE id = $4 RETURNING *";
  let values = [date, heading, description, id];
  return pool.query(sql, values);
};


dbMethods.getAllUsers = function () {
  let sql = "SELECT id, username FROM users";
  return pool.query(sql);
};

dbMethods.getUser = function (username) {
  let sql = "SELECT * FROM users WHERE username = $1";
  let values = [username];
  return pool.query(sql, values);
};

dbMethods.getUsername = function (id) {
  let sql = "SELECT username FROM users WHERE id = $1";
  let values = [id];
  return pool.query(sql, values);
};

dbMethods.createUser = function (username, password, salt) {
  let sql = "INSERT INTO users (id, username, password, salt) VALUES(DEFAULT, $1, $2, $3) returning *";
  let values = [username, password, salt];
  return pool.query(sql, values);
};

dbMethods.deleteUser = function (id) {
  let sql = "DELETE FROM users WHERE id = $1 returning *";
  let values = [id];
  return pool.query(sql, values);
};

dbMethods.editUser = function (username, password, salt, userID) {
  let sql = "UPDATE users SET username = $1, password = $2, salt = $3 WHERE id = $4 RETURNING *";
  let values = [username, password, salt, userID];
  return pool.query(sql, values);
};


dbMethods.getAllToDoLists = function (userid) {
  let sql = "SELECT * FROM todolists WHERE userid = $1";
  let values = [userid];
  return pool.query(sql, values);
};

dbMethods.createToDoList = function (listname, userid, share) {
  let sql = "INSERT INTO todolists (id, listname, userid, share) VALUES(DEFAULT, $1, $2, $3) returning *";
  let values = [listname, userid, share];
  return pool.query(sql, values);
};

dbMethods.deleteToDoList = async function (id, userid) {
  let sql1 = "DELETE FROM todo WHERE listid = $1 AND userid = $2 RETURNING *";
  let sql2 = "DELETE FROM todolists WHERE id = $1 AND userid = $2 RETURNING *";
  let values = [id, userid];

  let result = await pool.query(sql1, values);
  return pool.query(sql2, values);
};

dbMethods.editToDoList = function (listname, share, id) {
  let sql = "UPDATE todolists SET listname = $1, share = $2 WHERE id = $3 RETURNING *";
  let values = [listname, share, id];
  return pool.query(sql, values);
};

dbMethods.getSharedToDoLists = function () {
  let sql = "SELECT * FROM todolists WHERE share = 1";
  return pool.query(sql);
};

module.exports = dbMethods;