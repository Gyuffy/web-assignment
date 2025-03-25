import mysql from "mysql2/promise";

const pool = mysql.createPool({
	host: "192.168.110.122",
	user: "ssafy",
	password: "ssafy_1234",
	database: "my_robot",
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});

export default pool;