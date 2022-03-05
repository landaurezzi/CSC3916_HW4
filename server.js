/*
CSC3916 HW2
File: Server.js
Description: Web API scaffolding for Movie API
 */

var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var authController = require('./auth');
var authJwtController = require('./auth_jwt');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var User = require('./Users');

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

var router = express.Router();

function getJSONObjectForMovieRequirement(req) {
    var json = {
        headers: "No headers",
        key: process.env.UNIQUE_KEY,
        body: "No body"
    };

    if (req.body != null) {
        json.body = req.body;
    }

    if (req.headers != null) {
        json.headers = req.headers;
    }

    return json;
}

router.post('/signup', function(req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({success: false, msg: 'Please include both username and password to signup.'})
    } else {
        var user = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;

        user.save(function(err){
            if (err) {
                if (err.code == 11000)
                    return res.json({ success: false, message: 'A user with that username already exists.'});
                else
                    return res.json(err);
            }

            res.json({success: true, msg: 'Successfully created new user.'})
        });
    }
});

router.post('/signin', function (req, res) {
    var userNew = new User();
    userNew.username = req.body.username;
    userNew.password = req.body.password;

    User.findOne({ username: userNew.username }).select('name username password').exec(function(err, user) {
        if (err) {
            res.send(err);
        }

        user.comparePassword(userNew.password, function(isMatch) {
            if (isMatch) {
                var userToken = { id: user.id, username: user.username };
                var token = jwt.sign(userToken, process.env.SECRET_KEY);
                res.json ({success: true, token: 'JWT ' + token});
            }
            else {
                res.status(401).send({success: false, msg: 'Authentication failed.'});
            }
        })
    })
});

router.route('/movies')
//jwt authenticated
.get(authJwtController.isAuthenticated, function(req, res) {
    console.log(req.body);
    //status 200 and message
    res = res.status(200);
    //header and string from request
    var o = getJSONObjectForMovieRequirement(res.status, 'GET movies', req);
    //pass object from method
    res.json(o);
}
)

//jwt authenticated
.post(authJwtController.isAuthenticated, function(req, res) {
    //checking if all entries have been filled
    if(!req.body.Title && !req.body.YearReleased && !req.body.genre && !req.body.Actors[0] && !req.body.Actors[1] && !req.body.Actors[2]){
        return res.json({success: false, message: 'Please complete all the information asked for all entries.'});
    }
    //if all entries have been filled, proceed to save movie
    else{
        //generating fields
        var movie = new Movie();
        movie.Title = req.body.Title;
        movie.YearReleased = req.body.YearReleased;
        movie.genre = req.body.genre;
        movie.Actors = req.body.Actors;

        movie.save(function(err){
            //check if movie is in database
            if (err) {
                if (err.code == 11000)
                    return res.json({ success: false, message: 'Movie already exists.'});
                else
                    return res.json(err);
                
                
            }
            //if not, add movie to database
            else
                return res.status(200).send({success: true, message: 'Movie successfully created.'});

        });
    }
})

//jwt authenticated
.put(authJwtController.isAuthenticated, function(req, res) {
    console.log(req.body);
    //status 200 and message
    res = res.status(200);
    //header and string from request
    var o = getJSONObjectForMovieRequirement(res.status, 'movie updated', req);

    if (req.get('Content-Type')) {
        res = res.type(req.get('Content-Type'));
    }
    //var o = getJSONObjectForMovieRequirement(req);
    res.json(o);
}
)

//jwt authenticated
.delete(authJwtController.isAuthenticated, function(req, res) {
    console.log(req.body);
    //status 200 and message
    res = res.status(200);
    //header and string from request
    var o = getJSONObjectForMovieRequirement(res.status, 'movie deleted', req);

    if (req.get('Content-Type')) {
        res = res.type(req.get('Content-Type'));
    }
    //var o = getJSONObjectForMovieRequirement(req);
    res.json(o);
})

app.use('/', router);
app.listen(process.env.PORT || 8080);
module.exports = app; // for testing only


