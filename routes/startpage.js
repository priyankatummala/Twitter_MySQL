var ejs = require("ejs");
var mysql = require('./mysql');
var path=require("path");
var findHashtags = require('find-hashtags');
var response="NULL";
var NumTweets=0;
var NumFollowers=0;
var NumFollowing=0;
var alltweets="NULL";
var fullname;
var searchName="NULL";

exports.home = function(req, res){
	console.log("in here");
	ejs.renderFile('./views/signin.ejs',function(err, result) {
		// render on success
		if (!err) {
			res.end(result);
		}
		// render or error
		else {
			res.end('An error occurred');
			console.log(err);
		}
	});
};
exports.successlogin = function(req, res){
	console.log("in successlogin here");

	ejs.renderFile('./views/successLogin.ejs',function(err, result) {
		// render on success
		if (!err) {
			res.end(result);
		}
		// render or error
		else {
			res.end('An error occurred');
			console.log(err);
		}
	});
};

exports.loadPage= function(req,res){
	var getinfo="	SELECT " +
	"concat(firstname,' ', lastname) uname, u.thandle, F.FOLLOWERS,T.FOLLOWING, TW.TWEETS, u.birthday, u.location, u.phone" +
	"		FROM" +
	"		(select COUNT(*) FOLLOWERS " +
	"		from followers	where uname='"+sess.emailID+"')F" +
	",(select count(*) FOLLOWING" +
	"		from followers " +
	"		where follower='"+sess.emailID+"')T," +
	"		(select count(*) TWEETS" +
	"		from tweets" +
	"		where uname='"+sess.emailID+"') TW," +
	"		users  u" +
	"		where u.username='"+sess.emailID+"'";


	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else
		{
				console.log(results);
				console.log(results[0].birthday);
				var str=(results[0].birthday);
				var bday=str.toString();
				bday=bday.substring(4,16);
				results[0].birthday=bday;
				console.log(bday)
				res.send(results);
			
		}
	},getinfo);
};


exports.follow= function(req,res){
	var uname="select username from `twitter`.`users` where thandle='"+req.param("thandle")+"'";
	var username;
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else
		{
				username=results[0].username;
				console.log("fetched username"+username);
				
				var followQuery="INSERT INTO `twitter`.`followers` (`uname`, `follower`) " +
				"VALUES ('"+username+"', '"+sess.emailID+"')";
		console.log(followQuery);
		mysql.fetchData(function(err,results){
			if(err){
				throw err;
			}
			else
			{
					res.send(results);
				
			}
		},followQuery);
			
		}
	},uname);

	


	
};


exports.signup = function(req, res){
	console.log("in here");
	ejs.renderFile('./views/signup.ejs',function(err, result) {
		// render on success
		if (!err) {
			res.end(result);
		}
		// render or error
		else {
			res.end('An error occurred');
			console.log(err);
		}
	});
};

exports.signin = function (req,res)
{
//	check user already exists
	console.log("in signin");
	var getUser="select * from users where username='"+req.param("username")+"' and password=SHA1('" +
	req.param("password") +"')";
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else
		{
			if(results.length > 0){
				console.log("in signin results");

				res.send("Success");
			}
			else {
				console.log("Invalid Login");
				ejs.renderFile('./views/invalidLogin.ejs',function(err, result) {
//					render on success
					if (!err) {
						res.end(result);
					}
//					render or error
					else {
						res.end('An error occurred');
						console.log(err);
					}
				});
			}
		}
	},getUser);

};

exports.aftersignup = function(req, res){
	console.log("in signup");
	var response;
	var insertUser="INSERT INTO users (`username`, `firstname`, `lastname`, `password`, `thandle`) VALUES " +
	"('" +req.param("uname")+"','" +req.param("Fname")+"','" +req.param("Lname")+"',SHA1('" +req.param("password")+"'),'" +req.param("THandle")+"');";
	mysql.fetchData(function(err,results){
		if(err){
			console.log("insert error");
			throw err;
		}
		else{
			console.log("no error"+results)	;
			if(results.affectedRows ==1 ){
				response={"value":"Success"};
			}
			else {
				response = {"value":"Fail"};
			}
		}
	}, insertUser);
	res.send((response));
	res.end();

};


exports.registerTweet=function(req,res){
	console.log("in registerTweet");
	var email=sess.emailID;
	var tweet=req.param("tweet");
	var hasharray=[];
	hasharray=findHashtags(tweet);
	var insertTweet;
	var i;
	if (hasharray.length>0)
	{
		for(var i=0;i<hasharray.length; i++)
		{
			insertTweet="INSERT INTO `twitter`.`tweets` (`uname`, `tweet`, `retweet`, `hashtag` ) VALUES ('"+sess.emailID+"', '"+req.param("tweet")+"', 'N','"+hasharray[i]+"')";
			mysql.fetchData(function(err,results){
				if(err){
					throw err;
				}
			else{
				console.log(results.affectedRows)	
				if(results.affectedRows ==1 ){
					console.log("tweet inserted");
				}
				else {
					console.log("error on tweet insert");
				}
			}
		}, insertTweet);
		}
	}
	else{
		insertTweet="INSERT INTO `twitter`.`tweets` (`uname`, `tweet`, `retweet` ) VALUES ('"+sess.emailID+"', '"+req.param("tweet")+"', 'N')";
		mysql.fetchData(function(err,results){
			if(err){
				throw err;
			}
		else{
			console.log(results.affectedRows)	
			if(results.affectedRows ==1 ){
				console.log("tweet inserted");
			}
			else {
				console.log("error on tweet insert");
			}
		}
	}, insertTweet);
	}
		
		
	res.send((response));
	res.end();
	
	
};


exports.fetchfollowing=function(req,res){
	
	var fetchfollowing="select concat(firstname,' ',lastname)usrname, thandle " +
			"from users where username in" +
			" (select uname from followers where follower='"+sess.emailID+"');";

mysql.fetchData(function(err,results){
if(err){
	throw err;
}
else
{
	console.log("fetch suggest"+results);
		res.send(results);
	
}
},fetchfollowing);
	
};

exports.retweet=function(req,res){
	
	var fetchfollowing="INSERT INTO `twitter`.`tweets` (`uname`, `tweet`, `retweet`) VALUES ('"+sess.emailID+"', '"+req.param("tweet")+"', 'Y')";

mysql.fetchData(function(err,results){
if(err){
	throw err;
}
else
{
	console.log("fetch suggest"+results);
		res.send(results);
	
}
},fetchfollowing);
	
};
exports.fetchfollowers=function(req,res){
	
	var fetchfollowing="select concat(firstname,' ',lastname)usrname, thandle " +
			"from users where username in" +
			" (select follower from followers where uname='"+sess.emailID+"')";

mysql.fetchData(function(err,results){
if(err){
	throw err;
}
else
{
	console.log("fetch suggest"+results);
		res.send(results);
	
}
},fetchfollowing);
	
};

exports.popTweets=function(req,res){
	
	var searchTweet="select distinct concat(firstname,' ', lastname) username, uname, tweet,  thandle" +
	" from tweets t , users u" +
	" where t.tweet like '%"+searchName+"%' and u.username=t.uname "; 

	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else
		{

			console.log("sending searched tweets");
			//console.log(results);
			var hasharray=[];
			console.log("result length"+results.length);
			for(var i=0;i<results.length; i++)
				{
				
					hasharray=findHashtags(results[i].tweet);
					
					for(var j=0;j<hasharray.length;j++)
						{
							updtweet=(results[i].tweet).replace('#'+hasharray[j], '<a href=\"#\">'+'#'+hasharray[j]+'</a>');
									console.log(updtweet);
								results[i].tweet=updtweet;	
						}
					
					
				}
			//console.log(results+req.param("searchTerm"));
			console.log(results);
			res.send(results);

		}
	},searchTweet);

	
};



exports.searchTweets=function(req,res){
	
	var viewpath=path.join(__dirname, '../views', 'search.ejs');
	console.log(viewpath);
	
	
	ejs.renderFile(viewpath,function(err, result) {
		console.log("Hello");
		// render on success
		if (!err) {
			console.log("Not Error");
			
			res.end(result);
		}
		// render or error
		else {
			res.end('An error occurred');
			console.log(err);
		}
	});


	/*console.log("search query :"+searchTweet);
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else
		{

			console.log("sending searched tweets");
			//console.log(results);
			var hasharray=[];
			for(var i=0;i<results.length; i++)
				{
				
					hasharray=findHashtags(results[i].tweet);
					
					for(var j=0;j<hasharray.length;j++)
						{
							updtweet=(results[i].tweet).replace('#'+hasharray[j], '<a href=\"#\">'+'#'+hasharray[j]+'</a>');
									console.log(updtweet);
								results[i].tweet=updtweet;	
						}
					
					
				}
			//console.log(results+req.param("searchTerm"));
			console.log(results);
			res.send(results);

		}
	},searchTweet);*/
};


exports.fetchTweets=function(req,res){
	var getTweets="select distinct t.tweet, concat(u.firstname,' ',u.lastname)usrname, thandle" +
			"			from tweets t	inner join followers f" +
			"			on t.uname='"+sess.emailID+"' " +
			"   or(t.uname=f.uname and f.follower='"+sess.emailID+"' )" +
			"		inner join users u" +
			"			on u.username=t.uname" +
			"				order by t.tweettime desc"; 

	console.log(getTweets);
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else
		{

			console.log("sending fetched tweets");
			console.log("result length"+results.length);
			var hasharray=[];
			for(var i=0;i<results.length; i++)
				{
				
					hasharray=findHashtags(results[i].tweet);
										
					for(var j=0;j<hasharray.length;j++)
						{
							
							updtweet=(results[i].tweet).replace('#'+hasharray[j], '<a href=\"#\">'+'#'+hasharray[j]+'</a>');
									
								results[i].tweet=updtweet;	
						}
					//console.log(updtweet);
					
					
				}
			res.send(results);

		}
	},getTweets);
};

exports.profileUpdate=function(req,res){
	console.log("in prof update");
	var str=req.param("bday");
	var bday=str.substring(0,10);
	console.log(bday);
	var insertUpd="UPDATE `twitter`.`users` SET `birthday`='"+bday+"', `location`='"+req.param("location")+"', `phone`='"+req.param("contact")+"' WHERE `username`='"+sess.emailID+"'";
	console.log(insertUpd);
	mysql.fetchData(function(err,results){
		if(err){
			console.log("insert error");
			throw err;
		}
		else{
			console.log("about updated"+results)	;
			if(results.affectedRows ==1 ){
				response={"value":"Success"};
			}
			else {
				response = {"value":"Fail"};
			}
		}
	}, insertUpd);
	res.send((response));
	res.end();
};
exports.profile=function(req, res){
	
	console.log("in home.profile");
	
	var viewpath=path.join(__dirname, '../views', 'profile.ejs');
	console.log(viewpath);
	ejs.renderFile(viewpath,function(err, result) {
		console.log("Hello");
		// render on success
		if (!err) {
			console.log("Not Error");
			res.end(result);
		}
		// render or error
		else {
			res.end('An error occurred');
			console.log(err);
		}
	});
};
exports.followSuggestion=function(req,res){
	var suggestFollowers="select concat(firstname,' ', lastname) uname, thandle from users" +
			"	where " +
			"	username not in (select uname from followers where follower='"+sess.emailID+"') " +
			"	and username !='"+sess.emailID+"'	order by uname limit 2";
		
		mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else
		{
			console.log("fetch suggest"+results);
				res.send(results);
			
		}
	},suggestFollowers);
};

exports.searchmembers=function(req,res){
	//var viewpath=path.join(__dirname, '../views', 'search.ejs');
	//console.log(viewpath);
	searchName=req.param("searchTerm");
	console.log("search term is"+searchName);
	res.send("Success");
	
	/*ejs.renderFile(viewpath,function(err, result) {
		console.log("Hello");
		// render on success
		if (!err) {
			console.log("Not Error");
			
			res.end(result);
		}
		// render or error
		else {
			res.end('An error occurred');
			console.log(err);
		}
	});*/
}

exports.logout=function(req, res){
	req.session.destroy();
	var viewpath=path.join(__dirname, '../views', 'signin.ejs');
	console.log(viewpath);
	ejs.renderFile(viewpath,function(err, result) {
		console.log("Hello");
		// render on success
		if (!err) {
			console.log("Not Error");
			res.end(result);
		}
		// render or error
		else {
			res.end('An error occurred');
			console.log(err);
		}
	});
}