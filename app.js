
/**
 * Module dependencies.
 */
var ejs=require("ejs");
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , home=require('./routes/startpage');
var findHashtags = require('find-hashtags');

var app = express();
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: 'keyboard cat', cookie: { maxAge: 600000 }}));

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app.get('/', routes.index);
//app.get('/users', user.list);
app.get('/', home.home);
//app.get('/home', home.successlogin);
app.get('/loadPage', function(req,res){
	sess=req.session;
	if(sess.emailID)
	{
		home.loadPage(req, res);

	}
	else
	{
		console.log("homeloggingout")
		res.redirect('/');	
	}

});

app.get('/followSuggestion', function(req,res){
	sess=req.session;
	if(sess.emailID)
	{
		home.followSuggestion(req, res);

	}
	else
	{
		console.log("homeloggingout")
		res.redirect('/');	
	}

});

app.get('/fetchTweets', function(req,res){
	sess=req.session;
	if(sess.emailID)
	{
		home.fetchTweets(req, res);

	}
	else
	{
		console.log("homeloggingout")
		res.redirect('/');	
	}

});

app.get('/searchTweets', function(req,res){
	sess=req.session;
	if(sess.emailID)
	{
		home.searchTweets(req, res);

	}
	else
	{
		console.log("homeloggingout")
		res.redirect('/');	
	}

});


app.get('/home',function(req,res){
	sess=req.session;
	if(sess.emailID)
	{
		home.successlogin(req, res);

	}
	else
	{
		console.log("homeloggingout");
		res.redirect('/');	
	}

});

app.get('/logout', home.logout);
app.post('/searchmembers', home.searchmembers);
//app.post('/popTweets',home.popTweets);

app.post('/sessionChk', function(req,res){
	sess=req.session;
	if(sess.emailID)
	{
		res.send("Success");

	}
	else
	{
		console.log("homeloggingout")
		res.redirect('/');	
	}
});

app.post('/retweet', function(req,res){
	sess=req.session;
	if(sess.emailID)
	{
		home.retweet(req, res);

	}
	else
	{
		console.log("homeloggingout")
		res.redirect('/');	
	}

});

app.post('/popTweets', function(req,res){
	sess=req.session;
	if(sess.emailID)
	{
		home.popTweets(req, res);

	}
	else
	{
		console.log("homeloggingout")
		res.redirect('/');	
	}


});
app.post('/signup', home.signup);
//app.post('/signin',home.signin);
app.post('/aftersignup', home.aftersignup);

app.get('/fetchfollowers', function(req,res){
	sess=req.session;
	if(sess.emailID)
	{
		home.fetchfollowers(req, res);

	}
	else
	{
		console.log("homeloggingout")
		res.redirect('/');	
	}


});

app.get('/fetchfollowing', function(req,res){
	sess=req.session;
	if(sess.emailID)
	{
		home.fetchfollowing(req, res);

	}
	else
	{
		console.log("homeloggingout")
		res.redirect('/');	
	}

});

/*app.get('/profile',home.profile);/*function(req,res){
	sess=req.session;
	if(sess.emailID)
	{
		console.log("going to home.profile");
		home.profile(req, res);
		
	}
	else{
		sess.emailID=req.param("username");	   	
		home.signin(req,res);
	}
});*/


app.get('/profile',function(req,res){
	
	//Session set when user Request our app via URL
	sess=req.session;
	console.log(sess);
	if(sess.emailID)
	{
		home.profile(req, res);

	}
	else
	{
		console.log("homeloggingout")
		res.redirect('/');	
	}
});




app.post('/signin',function(req,res){
	
	//Session set when user Request our app via URL
	sess=req.session;
	console.log(sess);
	if(sess.emailID)
	{
		/*
		 * This line check Session existence.
		 * If it existed will do some action.
		 */
		res.redirect('/home');
	}
	else{
		sess.emailID=req.param("username");	   	
		home.signin(req,res);
	}
});


app.post('/profileUpdate',function(req,res){
	sess=req.session;
	console.log(sess);
	if(sess.emailID)
	{
		home.profileUpdate(req, res);

	}
	else
	{
		console.log("homeloggingout");
		res.redirect('/');	
	}
});

app.post('/registerTweet',function(req,res){
	
	//Session set when user Request our app via URL
	sess=req.session;
	console.log(sess);
	if(sess.emailID)
	{
		home.registerTweet(req, res);

	}
	else
	{
		console.log("homeloggingout");
		res.redirect('/');	
	}
});


app.post('/follow',function(req,res){
	
	//Session set when user Request our app via URL
	sess=req.session;
	console.log(sess);
	if(sess.emailID)
	{
		home.follow(req, res);

	}
	else
	{
		console.log("homeloggingout");
		res.redirect('/');	
	}
});




http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
