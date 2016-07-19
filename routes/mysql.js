var ejs= require('ejs');//importing module ejs
var mysql = require('mysql');//importing module mysql

var MAX_CONNECTION_SIZE=100;
var AvailableConnectionList=[];
var CurrentConnectionlist=[];
var Tobespliced=[];
console.log("mysql:"+JSON.stringify(mysql));

exports.fetchData=function(callback,sqlQuery)
{
	console.log("\nSQL Query::"+sqlQuery);
	var connection=getConnection();
	connection.query(sqlQuery, function(err, rows, fields) 
	{
		if(err)
		{
			console.log("ERROR: " + err.message);
		}
		else
		{ // return err or result
			console.log("DB Results:"+rows);
			callback(err, rows);
		}
	});
	console.log("\nConnection closed..");
	connection.end();
};

function createConnection(){
	for(var i=0;i<MAX_CONNECTION_SIZE;i++)
	{
		AvailableConnectionList.push(mysql.createConnection({
			host     : 'localhost',
			user     : 'root',
			password : 'priyankat',
			database : 'twitter'
		}));
		console.log("\nConnection:"+AvailableConnectionList[i]);
	}
	console.log("\nConnection:"+AvailableConnectionList.length);
}
exports.createConnection=createConnection;


function IsConnectionAvailable(){
	if(CurrentConnectionlist.length<=MAX_CONNECTION_SIZE)
	{
		console.log("\nConnection Available");
		return true;
	}
	else
	{
		if(Tobespliced.length>1)
		{
			Tobespliced.sort();
			var splicelength=Tobespliced.length;
			multisplice(splicelength);
			Tobespliced=[];
			IsConnectionAvailable();
		}
		console.log("\nConnection UnAvailable");
		return false;
	}
}

function callwithpool(callback,sqlQuery){
	if(IsConnectionAvailable()=== true)
	{
		console.log("\nSQL Query::"+sqlQuery);
		var length=CurrentConnectionlist.push(AvailableConnectionList.pop());
		console.log("\nlength: " + length);
		console.log("\nCurrentConnectionList" + CurrentConnectionlist[length-1]);
		var connection=CurrentConnectionlist[length-1];
		console.log("connection"+connection);
		connection.query(sqlQuery, function(err, rows, fields) 
		{
			if(err)
			{
				console.log("ERROR: " + err.message);
			}
			else 
			{	// return err or result
				console.log("DB Results:"+rows);
				for (var i in rows) {
					console.log('Age: ', rows[i].age);
				}
				callback(err, rows);
			}
		});
		//	AvailableConnectionList.push(CurrentConnectionlist.pop());
		AvailableConnectionList.push(CurrentConnectionlist.slice(length-1, length));
		Tobespliced.push(length-1);
	}
	else
	{
		console.log('Server is busy');
	}
	console.log("\nConnection closed..");
	connection.end();
}	
exports.callwithpool=callwithpool;
function multisplice(currentconnectionslength)
{

	for(var i = 0; i < currentconnectionslength; i++)
	{
		var index = Tobespliced[i] - i;
		CurrentConnectionlist.splice(index, 1);
	}   
}
exports.multisplice=multisplice;

function getConnection()
{
	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'priyankat',
		database : 'twitter',
		multipleStatements: true
	});
	return connection;
}

function callwithoutpool(callback,sqlQuery)
{

	console.log("\nSQL Query::"+sqlQuery);

	var connection=getConnection();

	connection.query(sqlQuery, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
		}
		else 
		{	// return err or result
			console.log("DB Results:"+rows);
			callback(err, rows);
		}
	});
	console.log("\nConnection closed..");
	connection.end();
}	
exports.callwithoutpool=callwithoutpool;