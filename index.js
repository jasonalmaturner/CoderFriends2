var express = require('express'),
	app = express(),
	port = 9001,
	env = require('./env'),
	bodyParser = require('body-parser'),
	passport = require('passport'),
	GitHubStrategy = require('passport-github').Strategy,
	session = require('express-session'),
	GitHubApi = require('github'),
	cors = require('cors');

// var corsOptions = {
// 	origin: false
// };

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'quando omni flunkus moritati'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
// app.use(function(req, res, next) {
// 	res.header('Access-Control-Allow-Origin', '*');
// 	res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
// 	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
// 	next();
// })

passport.use(new GitHubStrategy({
	clientID: env.GITHUB.CLIENT_ID,
	clientSecret: env.GITHUB.CLIENT_SECRET,
	callbackURL: "http://localhost:9001/auth/github/callback"
}, function(accessToken, refreshToken, profile, done) {
	// console.log(profile.username)
	done(null, profile);
}))

var requireAuth = function(req, res, next) {
	if(!req.isAuthenticated()) {
		return res.status(403).end();
		// break;
	} else {
		next();
	}
}

var github = new GitHubApi({
	version: "3.0.0"
})

passport.serializeUser(function(user, done) {
	// console.log(user)
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

// app.options('*', cors());
app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', {failureRedirect: '/login'}), function(req, res) {
	res.redirect('/#/home');
}),
app.get('/api/github/following', requireAuth, function(req, res) {
	// console.log(req.user.username);
	github.user.getFollowingFromUser({
		user: req.user.username
	}, function(err, response) {
		// console.log(response);
		res.json(response);
	})
})
app.get('/api/github/:username/activity', requireAuth, function(req, res) {
	// console.log(github)
	github.events.getFromUser({
		user: req.params.username
	}, function(err, response) {
		res.json(response)
	})

})

app.listen(port, function(){
	console.log('listening on port ' + port)
})
