require("dotenv").config();

var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var request = require("request");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);

var getArtist = function(artist) {
    return artist.name;
};

//Spotify search
var getSpotify = function(songName) {
    if (songName === undefined) {
        songName = "Tangerine";
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
                console.log(i);
                console.log("artist(s): " + songs[i].artists.map(getArtist));
                console.log("song name: " + songs[i].name);
                console.log("preview song: " + songs[i].preview_url);
                console.log("album: " + songs[i].album.name);
                console.log("-------------------------------------");
            }
        }
    );
};

//Twiiter search
var getTweets = function() {
    var client = new Twitter(keys.twitter);

    var params = {
        screen_name: "cnn"
    };
    client.get("statuses/user_timeline", params, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log(tweets[i].created_at);
                console.log("");
                console.log(tweets[i].text);
            }
        }
    });
};

//OMDB Movie search
var getMovie = function(movieName) {
    if (movieNmae === undefined) {
        movieName = "Star Wars";
    }

    var urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=da7edd3b";

    request(urlHit, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var jsonData = JSON.parse(body);

            console.log("Title: " + jsonData.Title);
            console.log("Year: " + jsonData.Year);
            console.log("Rated: " + jsonData.Rated);
            console.log("IMDB Rating: " + jsonData.imdbRating);
            console.log("Country: " + jsonData.Country);
            console.log("Language: " + jsonData.Language);
            console.log("Plot: " + jsonData.Plot);
            console.log("Actors: " + jsonData.Actors);
            console.log("Rotten Tomatoes rating: " + jsonData.Ratings[1].Value);
        }
    });
};

//Text File Based Command Function
var doThis = function() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        console.log(data);

        var dataArr = data.split(", ");

        if (datArr.length === 2) {
            pick(dataArr[0], dataArr[1]);
        }
        else if (dataArr.length === 1) {
            pick(dataArr[0]);
        }
    });
};

//Determine which command is executed
var pick = function(caseData, functionData) {
    switch (caseData) {
        case "my-tweets":
        getTweets();
        break;
        case "spotify-this-song":
        getSpotify(functionData);
        break;
        case "movie-this":
        getMovie(functionData);
        break;
        case "do-what-it-says":
        doThis();
        break;
        default:
        console.log("Sorry, LIRI doesn't know that one");
    }
};

var runThis = function(argOne, argTwo) {
    pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv[3]);