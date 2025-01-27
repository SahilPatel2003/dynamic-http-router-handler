const fs = require("fs");
const { join } = require("path");
const crypto = require("crypto");
const response=require('../utils/response')
const {CONTENT_TYPE_JSON} =require('../utils/constant')
const jwt=require('jsonwebtoken')
require('dotenv').config();
const JWTKey=process.env.JWT_SECREATE_KEY;


const databaseFile = join(__dirname, "../userData.json");

let database = {};
if (fs.existsSync(databaseFile)) {
  const data = fs.readFileSync(databaseFile, "utf8");
  if (data.trim() !== "") {
    database = JSON.parse(data);
  }
}

async function getUsers(req, res) {
  try {
    await response(res,'success',200,CONTENT_TYPE_JSON,database);
  } catch (error) {
    await response(res,'error',400,'text/plain',"Error fetching users:");
  }
}

async function getUser(req, res) {
  const {username}=req.params;
  try {
    await response(res,'success',200,'application/json',database[username]);
  } catch (error) {
    await response(res,'error',400,'text/plain',"Internal Server Error");
  }
}

async function validateUser(req, res) {
  const { username, password } = req.body;

  const user = database[username];

  if (!user) {
    await response(res,'error',400,'text/plain',"Error: Username not found. Please sign up first.");
  } else {
    const { hash, salt } = user;
    if (verifyPassword(password, hash, salt)) {
        
      jwt.sign({user},JWTKey,async(err,token)=>{
        if(err){
          await response(res,'error',400,'text/plain',"Error:something went wrong");
        }
        res.setHeader('JWT', `${token}; HttpOnly`);
        res.end(`Congratulations ${username}! login successfully`)
      });
    } else {
      await response(res,'error',400,'text/plain',"Error: Incorrect password.");
    }
  }
}

async function postUser(req, res) {
  const { username, password,mobileNo,email } = req.body;

  if (database[username]) {
    await response(res,'error',400,'text/plain', "Error: Username already exists. Please choose a different username");
  } else {
    const { salt, hash } = hashPassword(password);

    database[username] = { salt, hash,mobileNo,email };

    saveDatabase();
    await response(res,'success',200,"text/plain",`Congratulations ${username}! Sign up complete`);
  }
}

async function updateUser(req,res){
  const { username, password,mobileNo,email } = req.body.fields;

  if (database[username]) {
    if(mobileNo) database[username] = {...database[username],mobileNo};
    if(email) database[username] = {...database[username],email};
    saveDatabase();
    await response(res,'success',200,"text/plain",`User ${username} updated successfully`);
  } else {
    await response(res,'success',400,"text/plain",`User ${username} not found`);
  }
}

async function deleteUser(req, res) {

  const { username } = req.params;

  if (database[username]) {
    delete database[username];
    saveDatabase();
    await response(res,'success',200,"text/plain",`User ${username} deleted successfully`);

  } else {
    await response(res,'success',404,"text/plain",`User ${username} not found`);

  }
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");
  return { salt, hash };
}

function verifyPassword(password, hash, salt) {
  const hashedPassword = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");
  return hash === hashedPassword;
}

function saveDatabase() {
  fs.writeFileSync(databaseFile, JSON.stringify(database, null, 2));
}

async function getImage(req, res) {
  try {
    const imagePath = join(__dirname, "../images/image.png");
    const image = fs.readFileSync(imagePath);

    res.writeHead(200, { "Content-Type": "image/jpeg" });
    res.end(image, "binary");
  } catch (error) {
    console.error("Error reading image file:", error);
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "image not found",
      })
    );
  }
}

async function check(req,res){
  res.end();
}

module.exports = {
  getUsers,
  getUser,
  postUser,
  deleteUser,
  updateUser,
  getImage,
  validateUser,
  check
};
