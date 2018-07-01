// Require Node module imports
require("dotenv").config();

var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var request = require("request");
var fs = require("fs");

//Declares the function for each command
var liri = function(userCommand, dataCommand) {
    switch (userCommand) {
        case "my-tweets":
        getTweets();
        break;

        case "spotify-this-song":
        getSpotify(dataCommand);
        break;

        case "movie-this":
        getMovie(dataCommand);
        break;

        case "do-what-it-says":
        doThis();
        break;

        default:
        console.log("Sorry, LIRI doesn't know that one");
    }
};

//Spotify
var spotify = new Spotify(keys.spotify);

var getArtistNames = function(artist) {
    return artist.name;
  };

var getSpotify = function(songName) {
    if (songName === undefined) {
        songName = "The Sign";
    }

    spotify.search(
        {
            type: "track",
            query: songName
        },
        function(err, data) {
            if (err) {
                console.log("error occurred: " + err);
                return;
            }

            var songs = data.tracks.items;

            for (var i = 0; i < songs.length; i++) {
                var spotifyResults =
                "--------------------------- " + "Song" + " ------------------------------" + "\r\n" +
				"Artist: " + songs[i].artists.map(getArtistNames) + "\r\n" +
				"Song: " + songs[i].name + "\r\n" +
                "Preview Url: " + songs[i].preview_url + "\r\n" + 
                "Album the song is from: " + songs[i].album.name + "\r\n" +
                "----------------------------- " + i + " ------------------------------" + "\r\n" +
                "";
				console.log(spotifyResults);
				log(spotifyResults);//Logs results to log.txt file
            }
        }
    );
};

//Twitter
var getTweets = function() {
    var client = new Twitter(keys.twitter);

    var params = {
        screen_name: "AudreysLiri"
    };
    client.get("statuses/user_timeline", params, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                var twitterResults = 
                "--------------------------- " + "Tweet" + " ------------------------------" + "\r\n" +
				"@" + tweets[i].user.screen_name + ": " + 
				tweets[i].created_at + "\r\n" + 
                tweets[i].text + "\r\n" +
                "----------------------------- " + i + " ------------------------------" + "\r\n" +
                "";
				console.log(twitterResults);
				log(twitterResults);//Logs results to log.txt file
            }
        }
    });
};

//Movies
var getMovie = function(movieName) {
    if (movieName === undefined) {
        movieName = "Mr. Nobody";
    }

    var url = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=da7edd3b";

    request(url, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var jsonData = JSON.parse(body);

                var movieResults =
                "--------------------------- " + "Movie" + " ------------------------------" + "\r\n" +
                "Title: " + jsonData.Title+"\r\n"+
                "Year: " + jsonData.Year+"\r\n"+
                "Imdb Rating: " + jsonData.imdbRating+"\r\n"+
                "Rotten Tomatoes Rating: " + jsonData.tomatoRating+"\r\n"+
                "Country: " + jsonData.Country+"\r\n"+
                "Language: " + jsonData.Language+"\r\n"+
                "Plot: " + jsonData.Plot+"\r\n"+
                "Actors: " + jsonData.Actors+"\r\n"+
                "-----------------------------------------------------------------" + "\r\n" +
                "";
                console.log(movieResults);
                log(movieResults);//Logs results to log.txt file
        }
    });
};

//Random Text File
var doThis = function() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        console.log(data);

        var dataArr = data.split(",");

        if (!error && dataArr.length === 2) {
            liri(dataArr[0], dataArr[1]);
        }
        else if (!error && dataArr.length === 1) {
            liri(dataArr[0]);
        }
    });
};

//Sets process and action arguments for user input
var userInput = function(argOne, argTwo) {
    liri(argOne, argTwo);
};

userInput(process.argv[2], process.argv[3]);

//Function to log results to log.txt file
    function log(logResults) {
        fs.appendFile("log.txt", logResults, (error) => {
          if(error) {
            throw error;
          }
        });
      }