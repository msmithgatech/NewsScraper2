var express = require('express');
var app = express();

// Public settings
app.use(express.static(process.cwd() + '/public'));
var PORT = process.env.PORT || 3080;

// mongo database
var mongoose = require("mongoose");
mongoose.Promise = Promise;

//  MONGO DB LOCAL DEPLOYMENT
mongoose.connect("mongodb://localhost:27017/NewsScraper", function(error){
    console.log("LOCAL MONGO DB for WASHINGTON POST connected");
});

//  HEROKU CONTROLLING THE MONGOOSE DB CONNECTION
//  ENSURE CORRECT HEROKU MLAB CONNECTION NAME IS HERE

//mongoose.connect("mongodb://heroku_peaceful-cove-19726.git", function(error){
//}
//    console.log("HEROKU-MONGO DB for WASHINGTON POST connected");
//});/

//BodyParser settings
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));


      //  VIEWS USED BY HANDLEBARS
var handlebars = require("express-handlebars");
app.engine("handlebars", handlebars({
    extname: "handlebars",
    defaultLayout: "main",
    layoutsDir: __dirname + "/views/layouts/",
    partialsDir: __dirname + "/views/partials/"
}));
app.set("view engine", "handlebars");

var request = require("request");
var cheerio = require("cheerio");

var remarks = require("./models/Remarks");
var newsbyte = require("./models/Newsbyte.js");



//  ORMs   Object Routing Models


      //  HOME PAGE
app.get('/', function(req, res){
    res.render('index');
});


      //  DISPLAY SAVED NEWSBYTES and REMARKS IF PRESENT
app.get('/saved', function(req, res){

    var handlebarObjects = {
        date: []
    };

    newsbyte.find().sort({savedon:-1}).exec(function(err,data){
        if(err) {
            console.log(err);
        } else {
            handlebarObjects.data = data;
            res.render("saved", handlebarObjects);
        }
    });
});


      //  NEWSBYTE SCRAPING
app.get('/scrape',function(req, res){

         //  SCRAPING THE WASHINGTON POST BUSINESS TECHNOLOGY SITE
    request("https://www.washingtonpost.com/business/technology", function(error, response, html) {

        //  INITIALIZE HANDLEBAR OBJECTS FOR CHEERIO FORMATTING
        var $ = cheerio.load(html);
        var handlebarObjects = {
            data: []
        };

        //  DISPLAY ALL SCRAPED NEWSBYTES
        $("newsbyte").each(function(i, element) {
            var artname = $(this).find("h3").text().trim();
            var blurp = $(this).find("p.summary").text();
            var date = $(this).find("time.dateline").text();
            var wwwdoc = $(this).find("a").attr("href");
            var pic = $(this).find("img").attr("src");

            handlebarObjects.data.push({
                artname: artname,
                blurp: blurp,
                date: date,
                wwwdoc: wwwdoc,
                pic: pic
            });
        });

        res.render("scrape", handlebarObjects);
    });
});

      //  SAVE NEWSBYTE
app.post("/saveNewsbyte", function(req,res){

    //console.log(req.body);

    newsbyte.findOne({'wwwdoc': req.body.wwwDoc}, function(err, newsbyteRecord){
        if(err) {
            console.log(err);
        } else {
            if(newsbyteRecord == null) {
                newsbyte.create(req.body, function(err, record) {
                    if(err) {console.log(err);}
                    console.log("Newsbyte " + req.body.wwwDoc + " added");
                });
            } else {
                console.log("Newsbyte " + req.body.wwwDoc + " already saved.  Exiting the save request.");
            }
        }
    });
});

        //  DELETE SELECTED NEWSBYTE
app.post("/delNewsbyte/:id", function(req, res){

    //console.log(req);

    newsbyte.remove({'_id': req.params.id})
        .exec(function(err, data){
            if(err){
                console.log(err);
            } else {
                console.log("Newsbyte id" + req.params.id + " successfully deleted");
            }
        });
});

      // LOCAL PORT LISTENER 3080
app.listen(PORT, function(){
    console.log("Washington Post News Scraper listening on port: " + PORT);
});