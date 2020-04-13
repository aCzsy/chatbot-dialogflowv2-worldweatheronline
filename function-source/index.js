// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
const http = require('http');
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const host = 'api.worldweatheronline.com';
const wwoApiKey = '034e35a7105c469e9e0103742201104';

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((req, res) => {
 
  let city = req.body.queryResult.parameters['geo-city']; // city is a required param

  // Get the date for the weather forecast (if present)
  let date = '';
  if (req.body.queryResult.parameters['mydate']) {
    date = req.body.queryResult.parameters['mydate'];
    date = date.substring(0,10);
    console.log('Date: ' + date);
  }

  // Call the weather API
  callWeatherApi(city, date).then((output) => {
    res.json({ 'fulfillmentText': output }); // Return the results of the weather API to Dialogflow
  }).catch(() => {
    res.json({ 'fulfillmentText': `I don't know the weather but I hope it's good!` });
  });
});

function callWeatherApi (city, date) {
  return new Promise((resolve, reject) => {
    // Create the path for the HTTP request to get the weather
    //let path = 'http://api.worldweatheronline.com/premium/v1/weather.ashx?format=json&num_of_days=2' +
      //'&q=' + encodeURIComponent(city) + '&key=' + wwoApiKey + '&date=' + date;
 	let path = '/premium/v1/weather.ashx?key=' + wwoApiKey + '&q=' + city + '&format=json&num_of_days=3';
    console.log('API Request: ' + host + path);

    // Make the HTTP request to get the weather
    http.get({host: host, path: path}, (res) => {
      let body = ''; // var to store the response chunks
      res.on('data', (d) => { body += d; }); // store each response chunk
      res.on('end', () => {
        // After all the data has been received parse the JSON for desired data
        let response = JSON.parse(body);
        
    	let fore = response['data']['weather'];
        let forecast = response['data']['weather'][0];
        let location = response['data']['request'][0];

        // Create response      
		let output = `Weather in ${location['query']} for 3 days:\n\n`;
        //Alternative loop
        for(let i = 0; i < fore.length; i++){
        	output += fore[i].date + `: ` + fore[i].avgtempC + `°C ` + fore[i].hourly[i].weatherDesc[0].value + `\n\n`; 
        }
        //Alternative iteration
        /*for (const forecast of response.data.weather) {
        	output += (`${forecast.date} : Average : ${forecast.avgtempC}°C\n`);
      	}*/
        
        for (const forecast of response.data.weather) {
        	if(forecast.avgtempC <= 20){
            	output += `-> Clothing suggestion for ${forecast.date}: Bring some warm clothes, just in case!\n\n`;
            }
             else if(forecast.avgtempC > 15){
            	output += `-> Clothing suggestion for ${forecast.date}: Prepare for sunbathing, Weather will be great!\n\n`;
            }		
      	}
        output += `NOTE: WE DON'T RECOMMEND TRAVELLING DUE TO THE CORONAVIRUS!!!`;
		
        // Resolve the promise with the output text
        console.log(output);
        resolve(output);
      });
      res.on('error', (error) => {
        console.log(`Error calling the weather API: ${error}`);
        reject();
      });
    });
  });
}


