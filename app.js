const express = require ('express');
const app = express();
const port = 3000;

const mysql = require('mysql');
var connection = mysql.createConnection( {
    host: "KaiaApparel",
    user: "KaiaApparel",
    password: "2211qq11"
});