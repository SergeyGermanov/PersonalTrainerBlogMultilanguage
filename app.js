//Initialisation
var express = require("express");
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var handlebars = require('express-handlebars');
var i18n = require('i18n');

app.engine('handlebars', handlebars({
    defaultLayout: 'main',
    helpers: {
        __: function () { return i18n.__.apply(this, arguments); }
        // __n: function () { return i18n.__n.apply(this, arguments); }
    }
}));
app.set('view engine', 'handlebars');

// Initialize cookies + bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


// Config i18n
var i18n = require('i18n');
i18n.configure({
    locales: ['en', 'ru'],
    fallbacks: { 'ru': 'en' },
    defaultLocale: 'en',
    cookie: 'locale',
    // queryParameter: 'lang',
    directory: __dirname + '/locales',
    // directoryPermissions: '755',
    autoReload: true,
    // updateFiles: true,
    api: {
        '__': '__'
        // '__n': '__n'
    }
});


// Initialize i18n
app.use(i18n.init);


//Initialize port
app.set("port", process.env.PORT || 8080);

//Initialize folder
app.use(express.static(path.join(__dirname, 'public')));






//Start the site
app.get('/' || '/index', function (req, res) {
    var data = {
        bgPicture: 'about-bg',
        heading: '"Train for life',
        subheading: 'Not for summer"'
    }

    res.render('index', data);
});

app.get('/blog', function (req, res) {
    var data = {
        bgPicture: "home-bg",
        // heading: "Katya's Blog",
        // subheading: "A Blog about Healthy Life Style"
    }
    res.render('blog', data);
});


app.get('/bootcamps', function (req, res) {
    var data = {
        bgPicture: "Bootcamps-bg",
        // heading: "Man must explore, and this is exploration at its greatest",
        // subheading: "Problems look mighty small from 150 miles up",
        // posted: "Posted by",
        // link: "Start Bootstrap",
        // date: "on August 24, 2018",
        // extraInfoHeading: true
    }
    res.render('bootcamps', data);
});


app.get('/contact', function (req, res) {
    var data = {
        bgPicture: "contact-bg",
        // heading: "Contact Me",
        // subheading: "Have questions? I have answers."
        // i18n: res
    }
    res.render('contact', data);
});

app.get('/fitnessweekends', function (req, res) {
    var data = {
        bgPicture: "FitnessWeekends",
        // heading: "Man must explore, and this is exploration at its greatest",
        // subheading: "Problems look mighty small from 150 miles up",
        // posted: "Posted by",
        // link: "Start Bootstrap",
        // date: "on August 24, 2018",
        // extraInfoHeading: true
    }
    res.render('fitnessweekends', data);
});


app.get('/onlinetraining', function (req, res) {
    var data = {
        bgPicture: "OnlineTraining",
        // heading: "Man must explore, and this is exploration at its greatest",
        // subheading: "Problems look mighty small from 150 miles up",
        // posted: "Posted by",
        // link: "Start Bootstrap",
        // date: "on August 24, 2018",
        // extraInfoHeading: true
        // i18n: res
    }
    res.render('onlinetraining', data);
});

// Language buttons
app.get('/en', function (req, res) {
    res.cookie('locale', 'en', { maxAge: 900000, httpOnly: true });
    res.redirect('back');
});

app.get('/ru', function (req, res) {
    res.cookie('locale', 'ru', { maxAge: 900000, httpOnly: true });
    res.redirect('back');
});


var config = require('./public/js/text');

//Using bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

//Authentification to mail server
var smtpTransport = nodemailer.createTransport(smtpTransport({
    service: 'Gmail',
    auth: {
        user: config.mail + config.g,
        pass: config.door[0] + config.door[3] + config.door[5] + config.door[2] + config.door[10]

    }
}));


//Send email
app.post('/contact', function (req, res) {
    var door = req.body.code;
    var mailOptions = {
        from: config.mail + config.g, // sender address
        to: config.mail + config.g, // list of receivers
        subject: 'Name: ' + req.body.name, // Subject line
        text: req.body.message + ' Email: ' + req.body.email + ' Phone: ' + req.body.phone // plaintext body

    };
    smtpTransport.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });

    res.send(true);

});


//Run the whole thing on port 8080
app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port'));
});