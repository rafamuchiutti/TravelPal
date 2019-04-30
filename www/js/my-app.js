// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function () {
    getLocation();
    getRate();
    CreateFileFunction();
});

myApp.onPageInit('weather', function (page) {
    getWeather();
})

var input;
var city;
var country;
var currencyHistoric;
var lat;
var long;
var money;

function readingInput() {

    input = document.getElementById('input').value;

}

function onError(msg) {

}
function getLocation() {

    navigator.geolocation.getCurrentPosition(geoCallback, onError);
}

function geoCallback(position) {

    lat = position.coords.latitude;
    long = position.coords.longitude;

    var location = "Lat: " + lat + "<br>Long: " + long;
    openCage();

}

function openCage() {

    var http = new XMLHttpRequest();

    const url = 'https://api.opencagedata.com/geocode/v1/json?q=' + lat + '+' + long + '&key=55352e3570f44057b98a458dd1b914dc';

    http.open("GET", url);

    http.send();

    http.onreadystatechange = (e) => {


        var response = http.responseText;

        var responseJSON = JSON.parse(response);

        city = responseJSON.results[0].components.city;
        country = responseJSON.results[0].components.country;
        currency = responseJSON.results[0].annotations.currency.name;
        currencyHistoric = currency;
        var flag = responseJSON.results[0].annotations.flag;
        money = responseJSON.results[0].annotations.currency.iso_code;

        var oc = "City: " + city + "<br>Country: " + country + "<br>Currency: " + currency + "<br>Flag:" + flag;

        document.getElementById('openCage').innerHTML = oc;
    }

}

function getWeather() {

    var http = new XMLHttpRequest();
    const url = 'https://api.darksky.net/forecast/13fd8e27055065a7909604115da727f8/37.8267,-122.4233';
    http.open("GET", url);

    http.send();

    http.onreadystatechange = (e) => {

        var response = http.responseText;
        var responseJSON = JSON.parse(response);

        fahrenheitToCelsius(responseJSON.currently.temperature);
        var tempcelsius = fahrenheitToCelsius(responseJSON.currently.temperature).toFixed(2);
        var wind = responseJSON.currently.windSpeed;
        var cloud = responseJSON.currently.cloudCover * 100;
        var oc2 = "Temperature: " + tempcelsius + " °C" + "<br>wind velocity: " + wind + " Km/h" + "<br>Cloud: " + cloud + "%";
        document.getElementById('getWeather').innerHTML = oc2;
    }
}

var fToCel;
function fahrenheitToCelsius(fahrenheit) {
    var fTemp = fahrenheit;
    fToCel = (fTemp - 32) * 5 / 9;
    var message = fTemp + '\xB0F an in Celsius is: ' + fToCel + '\xB0C.';
    return fToCel;
}
function readingInput() {

    input = document.getElementById('input').value;

}

function getRate() {

    var http = new XMLHttpRequest();

    const url = 'https://free.currencyconverterapi.com/api/v6/convert?q=USD_' + money + '&compact=ultra&apiKey=978e74f99d3bbee9e1d8';

    http.open("GET", url);
    http.send();


    http.onreadystatechange = (e) => {


        var response = http.responseText;
        var responseJSON = JSON.parse(response);
        currency = responseJSON.USD_EUR;
        var oc3 = "Your Currency money is: " + money;
    }
}


function convert() {

    readingInput();
    getRate();
    var result = input * currency;
    document.getElementById('result').innerHTML = result;
}


function convert2() {

    readingInput();
    getRate();
    var result2 = input / currency;
    document.getElementById('result2').innerHTML = result2;

}

function CreateFileFunction() {

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemCallback, onError);

}

function fileSystemCallback(fs) {

    // Name of the file I want to create
    var fileToCreate = "newhistory.txt";

    // Opening/creating the file
    fs.root.getFile(fileToCreate, fileSystemOptionals, getFileCallback, onError);
}

var fileSystemOptionals = { create: true, exclusive: false };

var fileEntryGlobal;
var contentGlobal = "";

function getFileCallback(fileEntry) {

    fileEntryGlobal = fileEntry;


}

function readInput() {
    textToWrite = document.getElementById('newText').value;

    writeFile(textToWrite);

}

// Let's write some files
function writeFile(newText) {
    //readFile();
    contentGlobal = contentGlobal + "Country: " + country + "<br> City: " + city + "<br > Currency: " + currencyHistoric + "<br><br><br>";



    var dataObj = new Blob([contentGlobal], { type: 'text/plain' });

    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntryGlobal.createWriter(function (fileWriter) {

        // If data object is not passed in,
        // create a new Blob instead.
        if (!dataObj) {
            dataObj = new Blob(['Error'], { type: 'text/plain' });
        }

        fileWriter.write(dataObj);

        fileWriter.onwriteend = function () {

           // document.getElementById('historicID').innerHTML = contentGlobal;
        };

        fileWriter.onerror = function () {


        };

    });
}

// Let's read some files
function readFile() {


    // Get the file from the file entry
    fileEntryGlobal.file(function (file) {
        // Create the reader
        var reader = new FileReader();
        reader.readAsText(file);

        reader.onloadend = function () {

            document.getElementById('historicID').innerHTML = contentGlobal;
            contentGlobal = this.result;


        };
    }, onError);
}
