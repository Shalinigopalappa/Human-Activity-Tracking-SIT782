var multer = require('multer');
var upload = multer({dest: 'upload/'});
var fs = require('fs');
module.exports = function (app, passport) {

    app.get('/', function (req, res) {
        res.render('index.ejs', {message: ""});
    });
    app.get('/unauthorized', function (req, res) {
        res.render('unauthorized.ejs');
    });


    app.get('/createProject', isLoggedIn, function (req, res) {
        res.render('createProject.ejs', {
            user: req.user
        });
    });


    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });


    app.get('/login', function (req, res) {
        res.render('login.ejs', {message: req.flash('loginMessage')});
    });


    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/createProject',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/signup', function (req, res) {
        res.render('signup.ejs', {message: req.flash('signupMessage')});
    });


    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true //
    }));


    app.post('/fileUpload', upload.single('myfile'), function (req, res, next) {
        /** When using the "single"
         data come in "req.file" regardless of the attribute "name". **/
        var tmp_path = req.file.path;

        /** The original name of the uploaded file
         stored in the variable "originalname". **/
        var target_path = 'upload/' + req.file.originalname;
        var fn = req.file.originalname;
        /** A better way to copy the uploaded file. **/
        var src = fs.createReadStream(tmp_path);
        var dest = fs.createWriteStream(target_path);
        src.pipe(dest);
        src.on('end', function () {
            res.render('index.ejs', {message: 'File uploaded successfully', uploaded_file_url:fn})
        });
        src.on('error', function (err) {
            res.render('error');
        });

    });

};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/unauthorized');
}