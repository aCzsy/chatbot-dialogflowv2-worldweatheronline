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

    // let city = req.body.queryResult.parameters['geo-city']; // city is a required param
    let city1 = "";
    let city2 = "";
    let city3 = "";
    let city4 = "";
    let city5 = "";

    if(req.body.queryResult.parameters['geo-city']){
        let city = req.body.queryResult.parameters['geo-city'];
        city1 = city[0];
        city2 = city[1];
        city3 = city[2];
        city4 = city[3];
        city5 = city[4];
        console.log(city1);
        console.log(city2);
        console.log(city3);
        console.log(city4);
        console.log(city5);
    }


    // // Getting the date for the weather forecast (if present)
    let date = '';
    if (req.body.queryResult.parameters['mydate']) {
        date = req.body.queryResult.parameters['mydate'];
        date = date.substring(0,10);
        console.log('Date: ' + date);
    }

    // Calling the weather API
    callWeatherApi(city1, city2, city3, city4, city5, date).then((output) => {
        res.json({ 'fulfillmentText': output }); // Return the results of the weather API to Dialogflow
    }).catch(() => {
        res.json({ 'fulfillmentText': `I don't know the weather but I hope it's good!` });
    });
});


function callWeatherApi (city1, city2, city3, city4, city5, date) {
    return new Promise((resolve, reject) => {
        // Path for the HTTP request to get the weather
        let path = '/premium/v1/weather.ashx?key=' + wwoApiKey + '&q=' + city1 + ';' + city2 + ';' + city3 + ';'  + city4 + ';' + city5 + ';' + '&format=json&num_of_days=3&date=' + date;
        console.log('API Request: ' + host + path);

        const data = JSON.stringify({
            todo: 'Buy the milk'
        });

        const options = {
            hostname: 'api.worldweatheronline.com',
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const request = http.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`);
            let body = ''; // var to store the response chunks
            res.on('data', (d) => { body += d; }); // store each response chunk
            res.on('end', () => {
                // After all the data has been received parse the JSON for desired data
                let response = JSON.parse(body);

                let t = response['data']['area'];
                let rainy_set = ["Sweater","Pants", "Jacket", "Shoes", "Raincoat", "Umbrella"];
                let sunny_set = ["Shoes", "Light jeans", "T-shirt", "Sunglasses", "Hat"];
                let sunny_rainy_set = ["Shoes", "Light jeans", "T-shirt", "Sunglasses", "Hat", "Umbrella"];
                let cloudy_set = ["Sweater","Pants", "Jacket", "Shoes"];
                let normal_set = ["Runners","Jeans", "T-shirt", "Hoodie"];
                let normal_rainy_set = ["Runners","Jeans", "T-shirt", "Hoodie", "Umbrella"];

                // Create response
                //let output = `${test2['query']}:\n\n`;
                //Alternative loop
                // for(let i = 0; i < forecast.length; i++){
                //     output += `📅 ` + forecast[i].date + `: 🌡️ ` + forecast[i].avgtempC + `°C ` + forecast[i].hourly[i].weatherDesc[0].value +  `, Chance of rain: ` + forecast[i].hourly[i].chanceofrain + `% \n\n`;
                // }

                //Alternative iteration
                /*for (const forecast of response.data.weather) {
                    output += (`${forecast.date} : Average : ${forecast.avgtempC}°C\n`);
                  }*/

                let output = `Your trip info: \n\n`;


                //Chance of rain for 3 days for each country
                for(let i = 0; i < t.length; i++){
                    output  += t[i].request[0].query + `\n`;


                    /********************************************DAY 1 COUNTRY 1********************************************/
                    if(i == 0){
                        output += `DAY 1:\n`;
                        if(t[i].weather[0].avgtempC <= 10){
                                output += `Pretty cold in ` + t[i].request[0].query + ` with ` +
                                t[i].weather[0].avgtempC + `°C, ` + ` ` + t[i].current_condition[0].weatherDesc[0].value;
                            output += `\nOutfit suggestion for : ` + t[i].weather[0].date + ` \n\n`;

                            for(let i=0;i < cloudy_set.length;i++){
                                output += `• ` + cloudy_set[i] + `\n`;
                            }
                            output += `\n`;
                        }
                        else if(t[i].weather[0].avgtempC <= 10 && t[i].weather[0].hourly[3].chanceofrain > 40){
                            output += `Pretty cold with a chance of rain in ` + t[i].request[0].query + ` with ` +
                                t[i].weather[0].avgtempC + `°C, ` + ` ` + t[i].current_condition[0].weatherDesc[0].value;
                            output += `\nOutfit suggestion for : ` + t[i].weather[0].date + ` \n\n`;

                            for(let i=0;i < rainy_set.length;i++){
                                output += `• ` + rainy_set[i] + `\n`;
                            }
                            output += `\n`;
                        }
                        else if(t[i].weather[0].avgtempC > 10 && t[i].weather[0].avgtempC <= 20 && t[i].weather[0].hourly[3].chanceofrain < 20){
                            output += `Breezy and dry in ` + t[i].request[0].query + ` with ` +
                                t[i].weather[0].avgtempC + `°C, ` + ` ` + t[i].current_condition[0].weatherDesc[0].value;
                            output += `\nOutfit suggestion for : ` + t[i].weather[0].date + ` \n\n`;

                            for(let i=0;i < normal_set.length;i++){
                                output += `• ` + normal_set[i] + `\n`;
                            }
                            output += `\n`;
                        }
                        else if(t[i].weather[0].avgtempC > 10 && t[i].weather[0].avgtempC <= 20 && t[i].weather[0].hourly[3].chanceofrain > 20){
                            output += `Breezy with a chance of rain in ` + t[i].request[0].query + ` with ` +
                                t[i].weather[0].avgtempC + `°C, ` + ` ` + t[i].current_condition[0].weatherDesc[0].value;
                            output += `\nOutfit suggestion for : ` + t[i].weather[0].date + ` \n\n`;

                            for(let i=0;i < normal_rainy_set.length;i++){
                                output += `• ` + normal_rainy_set[i] + `\n`;
                            }
                            output += `\n`;
                        }
                        else if(t[i].weather[0].avgtempC > 20 && t[i].weather[0].hourly[3].chanceofrain < 20){
                            output += `Hot and dry in ` + t[i].request[0].query + ` with ` +
                                t[i].weather[0].avgtempC + `°C, ` + ` ` + t[i].current_condition[0].weatherDesc[0].value;
                            output += `\nOutfit suggestion for : ` + t[i].weather[0].date + ` \n\n`;
                            
                            for(let i=0;i < sunny_set.length;i++){
                                output += `• ` + sunny_set[i] + `\n`;
                            }
                            output += `\n`;
                        }
                        else if(t[i].weather[0].avgtempC > 20 && t[i].weather[0].hourly[3].chanceofrain >= 20){
                            output += `Hot with a chance of rain in ` + t[i].request[0].query + ` with ` +
                                t[i].weather[0].avgtempC + `°C, ` + ` ` + t[i].current_condition[0].weatherDesc[0].value;
                            output += `\nOutfit suggestion for : ` + t[i].weather[0].date + ` \n\n`;

                            for(let i=0;i < sunny_rainy_set.length;i++){
                                output += `• ` + sunny_rainy_set[i] + `\n`;
                            }
                            output += `\n`;
                            }
                    }

                    /********************************************DAY 1 COUNTRY 2********************************************/
                    else if(i == 1){
                        output += `DAY 1:\n`;
                        if(t[i].weather[0].avgtempC <= 10){
                            output += `Pretty cold in ` + t[i].request[0].query + ` with ` +
                                t[i].weather[0].avgtempC + `°C, ` + ` ` + t[i].current_condition[0].weatherDesc[0].value;
                            output += `\nOutfit suggestion for : ` + t[i].weather[0].date + ` \n\n`;

                            for(let i=0;i < cloudy_set.length;i++){
                                output += `• ` + cloudy_set[i] + `\n`;
                            }
                            output += `\n`;
                        }
                        else if(t[i].weather[0].avgtempC <= 10 && t[i].weather[0].hourly[3].chanceofrain > 40){
                            output += `Pretty cold with a chance of rain in ` + t[i].request[0].query + ` with ` +
                                t[i].weather[0].avgtempC + `°C, ` + ` ` + t[i].current_condition[0].weatherDesc[0].value;
                            output += `\nOutfit suggestion for : ` + t[i].weather[0].date + ` \n\n`;

                            for(let i=0;i < rainy_set.length;i++){
                                output += `• ` + rainy_set[i] + `\n`;
                            }
                            output += `\n`;
                        }
                        else if(t[i].weather[0].avgtempC > 10 && t[i].weather[0].avgtempC <= 20 && t[i].weather[0].hourly[3].chanceofrain < 20){
                            output += `Breezy and dry in ` + t[i].request[0].query + ` with ` +
                                t[i].weather[0].avgtempC + `°C, ` + ` ` + t[i].current_condition[0].weatherDesc[0].value;
                            output += `\nOutfit suggestion for : ` + t[i].weather[0].date + ` \n\n`;

                            for(let i=0;i < normal_set.length;i++){
                                output += `• ` + normal_set[i] + `\n`;
                            }
                            output += `\n`;
                        }
                        else if(t[i].weather[0].avgtempC > 10 && t[i].weather[0].avgtempC <= 20 && t[i].weather[0].hourly[3].chanceofrain > 20){
                            output += `Breezy with a chance of rain in ` + t[i].request[0].query + ` with ` +
                                t[i].weather[0].avgtempC + `°C, ` + ` ` + t[i].current_condition[0].weatherDesc[0].value;
                            output += `\nOutfit suggestion for : ` + t[i].weather[0].date + ` \n\n`;

                            for(let i=0;i < normal_rainy_set.length;i++){
                                output += `• ` + normal_rainy_set[i] + `\n`;
                            }
                            output += `\n`;
                        }
                        else if(t[i].weather[0].avgtempC > 20 && t[i].weather[0].hourly[3].chanceofrain < 20){
                            output += `Hot and dry in ` + t[i].request[0].query + ` with ` +
                                t[i].weather[0].avgtempC + `°C, ` + ` ` + t[i].current_condition[0].weatherDesc[0].value;
                            output += `\nOutfit suggestion for : ` + t[i].weather[0].date + ` \n\n`;

                            for(let i=0;i < sunny_set.length;i++){
                                output += `• ` + sunny_set[i] + `\n`;
                            }
                            output += `\n`;
                        }
                        else if(t[i].weather[0].avgtempC > 20 && t[i].weather[0].hourly[3].chanceofrain >= 20){
                            output += `Hot with a chance of rain in ` + t[i].request[0].query + ` with ` +
                                t[i].weather[0].avgtempC + `°C, ` + ` ` + t[i].current_condition[0].weatherDesc[0].value;
                            output += `\nOutfit suggestion for : ` + t[i].weather[0].date + ` \n\n`;

                            for(let i=0;i < sunny_rainy_set.length;i++){
                                output += `• ` + sunny_rainy_set[i] + `\n`;
                            }
                            output += `\n`;
                        }
                    }

                    /********************************************DAY 2 COUNTRY 3********************************************/
                    else if(i == 2){
                        output += `DAY 2:\n`;
                        if(t[i].weather[1].avgtempC <= 10){
                            output += `Pretty cold in ` + t[i].request[0].query + ` with ` +
                                t[i].weather[1].avgtempC + `°C, ` + ` ` + t[i].current_condition[0].weatherDesc[0].value;
                            output += `\nOutfit suggestion for : ` + t[i].weather[1].date + ` \n\n`;

                            for(let i=0;i < cloudy_set.length;i++){
                                output += `• ` + cloudy_set[i] + `\n`;
                            }
                            output += `\n`;
                        }
                        else if(t[i].weather[1].avgtempC <= 10 && t[i].weather[1].hourly[3].chanceofrain > 40){
                            output += `Pretty cold with a chance of rain in ` + t[i].request[0].query + ` with ` +
                                t[i].weather[1].avgtempC + `°C, ` + ` ` + t[i].current_condition[0].weatherDesc[0].value;
                            output += `\nOutfit suggestion for : ` + t[i].weather[1].date + ` \n\n`;

                            for(let i=0;i < rainy_set.length;i++){
                                output += `• ` + rainy_set[i] + `\n`;
                            }
                            output += `\n`;
                        }
                        else if(t[i].weather[1].avgtempC > 10 && t[i].weather[1].avgtempC <= 20 && t[i].weather[1].hourly[3].chanceofrain < 20){
                            output += `Breezy and dry in ` + t[i].request[0].query + ` with ` +
                                t[i].weather[1].avgtempC + `°C, ` + ` ` + t[i].current_condition[0].weatherDesc[0].value;
                            output += `\nOutfit suggestion for : ` + t[i].weather[1].date + ` \n\n`;

                            for(let i=0;i < normal_set.length;i++){
                                output += `• ` + normal_set[i] + `\n`;
                            }
                            output += `\n`;
                        }
                        else if(t[i].weather[1].avgtempC > 10 && t[i].weather[1].avgtempC <= 20 && t[i].weather[1].hourly[3].chanceofrain > 20){
                            output += `Breezy with a chance of rain in ` + t[i].request[0].query + ` with ` +
                                t[i].weather[1].avgtempC + `°C, ` + ` ` + t[i].current_condition[0].weatherDesc[0].value;
                            output += `\nOutfit suggestion for : ` + t[i].weather[1].date + ` \n\n`;

                            for(let i=0;i < normal_rainy_set.length;i++){
                                output += `• ` + normal_rainy_set[i] + `\n`;
                            }
                            output += `\n`;
                        }
                        else if(t[i].weather[1].avgtempC > 20 && t[i].weather[1].hourly[3].chanceofrain < 20){
                            output += `Hot and dry in ` + t[i].request[0].query + ` with ` +
                                t[i].weather[1].avgtempC + `°C, ` + ` ` + t[i].current_condition[0].weatherDesc[0].value;
                            output += `\nOutfit suggestion for : ` + t[i].weather[1].date + ` \n\n`;

                            for(let i=0;i < sunny_set.length;i++){
                                output += `• ` + sunny_set[i] + `\n`;
                            }
                            output += `\n`;
                        }
                        else if(t[i].weather[1].avgtempC > 20 && t[i].weather[1].hourly[3].chanceofrain >= 20){
                            output += `Hot with a chance of rain in ` + t[i].request[0].query + ` with ` +
                                t[i].weather[1].avgtempC + `°C, ` + ` ` + t[i].current_condition[0].weatherDesc[0].value;
                            output += `\nOutfit suggestion for : ` + t[i].weather[1].date + ` \n\n`;

                            for(let i=0;i < sunny_rainy_set.length;i++){
                                output += `• ` + sunny_rainy_set[i] + `\n`;
                            }
                            output += `\n`;
                        }
                    }

                    /********************************************DAY 2 COUNTRY 4********************************************/
                    else if(i == 3){
                        output += `DAY 2:\n`;
                        if(t[i].weather[1].avgtempC <= 10){
                            output += `Pretty cold in ` + t[i].request[0].query + ` with ` +
                                t[i].weather[1].avgtempC + `°C, ` + ` ` + t[i].current_condition[0].weatherDesc[0].value;
                            output += `\nOutfit suggestion for : ` + t[i].weather[1].date + ` \n\n`;

                            for(let i=0;i < cloudy_set.length;i++){
                                output += `• ` + cloudy_set[i] + `\n`;
                            }
                            output += `\n`;
                        }
                        else if(t[i].weather[1].avgtempC <= 10 && t[i].weather[1].hourly[3].chanceofrain > 40){
                            output += `Pretty cold with a chance of rain in ` + t[i].request[0].query + ` with ` +
                                t[i].weather[1].avgtempC + `°C, ` + ` ` + t[i].current_condition[0].weatherDesc[0].value;
                            output += `\nOutfit suggestion for : ` + t[i].weather[1].date + ` \n\n`;

                            for(let i=0;i < rainy_set.length;i++){
                                output += `• ` + rainy_set[i] + `\n`;
                            }
                            output += `\n`;
                        }
                        else if(t[i].weather[1].avgtempC > 10 && t[i].weather[1].avgtempC <= 20 && t[i].weather[1].hourly[3].chanceofrain < 20){
                            output += `Breezy and dry in ` + t[i].request[0].query + ` with ` +
                                t[i].weather[1].avgtempC + `°C, ` + ` ` + t[i].current_condition[0].weatherDesc[0].value;
                            output += `\nOutfit suggestion for : ` + t[i].weather[1].date + ` \n\n`;

                            for(let i=0;i < normal_set.length;i++){
                                output += `• ` + normal_set[i] + `\n`;
                            }
                            output += `\n`;
                        }
                        else if(t[i].weather[1].avgtempC > 10 && t[i].weather[1].avgtempC <= 20 && t[i].weather[1].hourly[3].chanceofrain > 20){
                            output += `Breezy with a chance of rain in ` + t[i].request[0].query + ` with ` +
                                t[i].weather[1].avgtempC + `°C, ` + ` ` + t[i].current_condition[0].weatherDesc[0].value;
                            output += `\nOutfit suggestion for : ` + t[i].weather[1].date + ` \n\n`;

                            for(let i=0;i < normal_rainy_set.length;i++){
                                output += `• ` + normal_rainy_set[i] + `\n`;
                            }
                            output += `\n`;
                        }
                        else if(t[i].weather[1].avgtempC > 20 && t[i].weather[1].hourly[3].chanceofrain < 20){
                            output += `Hot and dry in ` + t[i].request[0].query + ` with ` +
                                t[i].weather[1].avgtempC + `°C, ` + ` ` + t[i].current_condition[0].weatherDesc[0].value;
                            output += `\nOutfit suggestion for : ` + t[i].weather[1].date + ` \n\n`;

                            for(let i=0;i < sunny_set.length;i++){
                                output += `• ` + sunny_set[i] + `\n`;
                            }
                            output += `\n`;
                        }
                        else if(t[i].weather[1].avgtempC > 20 && t[i].weather[1].hourly[3].chanceofrain >= 20){
                            output += `Hot with a chance of rain in ` + t[i].request[0].query + ` with ` +
                                t[i].weather[1].avgtempC + `°C, ` + ` ` + t[i].current_condition[0].weatherDesc[0].value;
                            output += `\nOutfit suggestion for : ` + t[i].weather[1].date + ` \n\n`;

                            for(let i=0;i < sunny_rainy_set.length;i++){
                                output += `• ` + sunny_rainy_set[i] + `\n`;
                            }
                            output += `\n`;
                        }
                    }

                    /********************************************DAY 3 COUNTRY 5********************************************/
                    else{
                        output += `DAY 3:\n`;
                        if(t[i].weather[2].avgtempC <= 10){
                            output += `Pretty cold in ` + t[i].request[0].query + ` with ` +
                                t[i].weather[2].avgtempC + `°C, ` + ` ` + t[i].current_condition[0].weatherDesc[0].value;
                            output += `\nOutfit suggestion for : ` + t[i].weather[2].date + ` \n\n`;

                            for(let i=0;i < cloudy_set.length;i++){
                                output += `• ` + cloudy_set[i] + `\n`;
                            }
                            output += `\n`;
                        }
                        else if(t[i].weather[2].avgtempC <= 10 && t[i].weather[2].hourly[3].chanceofrain > 40){
                            output += `Pretty cold with a chance of rain in ` + t[i].request[0].query + ` with ` +
                                t[i].weather[2].avgtempC + `°C, ` + ` ` + t[i].current_condition[0].weatherDesc[0].value;
                            output += `\nOutfit suggestion for : ` + t[i].weather[2].date + ` \n\n`;

                            for(let i=0;i < rainy_set.length;i++){
                                output += `• ` + rainy_set[i] + `\n`;
                            }
                            output += `\n`;
                        }
                        else if(t[i].weather[2].avgtempC > 10 && t[i].weather[2].avgtempC <= 20 && t[i].weather[2].hourly[3].chanceofrain < 20){
                            output += `Breezy and dry in ` + t[i].request[0].query + ` with ` +
                                t[i].weather[2].avgtempC + `°C, ` + ` ` + t[i].current_condition[0].weatherDesc[0].value;
                            output += `\nOutfit suggestion for : ` + t[i].weather[2].date + ` \n\n`;

                            for(let i=0;i < normal_set.length;i++){
                                output += `• ` + normal_set[i] + `\n`;
                            }
                            output += `\n`;
                        }
                        else if(t[i].weather[2].avgtempC > 10 && t[i].weather[2].avgtempC <= 20 && t[i].weather[2].hourly[3].chanceofrain > 20){
                            output += `Breezy with a chance of rain in ` + t[i].request[0].query + ` with ` +
                                t[i].weather[2].avgtempC + `°C, ` + ` ` + t[i].current_condition[0].weatherDesc[0].value;
                            output += `\nOutfit suggestion for : ` + t[i].weather[2].date + ` \n\n`;

                            for(let i=0;i < normal_rainy_set.length;i++){
                                output += `• ` + normal_rainy_set[i] + `\n`;
                            }
                            output += `\n`;
                        }
                        else if(t[i].weather[2].avgtempC > 20 && t[i].weather[2].hourly[3].chanceofrain < 20){
                            output += `Hot and dry in ` + t[i].request[0].query + ` with ` +
                                t[i].weather[2].avgtempC + `°C, ` + ` ` + t[i].current_condition[0].weatherDesc[0].value;
                            output += `\nOutfit suggestion for : ` + t[i].weather[2].date + ` \n\n`;

                            for(let i=0;i < sunny_set.length;i++){
                                output += `• ` + sunny_set[i] + `\n`;
                            }
                            output += `\n`;
                        }
                        else if(t[i].weather[2].avgtempC > 20 && t[i].weather[2].hourly[3].chanceofrain >= 20){
                            output += `Hot with a chance of rain in ` + t[i].request[0].query + ` with ` +
                                t[i].weather[2].avgtempC + `°C, ` + ` ` + t[i].current_condition[0].weatherDesc[0].value;
                            output += `\nOutfit suggestion for : ` + t[i].weather[2].date + ` \n\n`;

                            for(let i=0;i < sunny_rainy_set.length;i++){
                                output += `• ` + sunny_rainy_set[i] + `\n`;
                            }
                            output += `\n`;
                        }
                    }

                }

                // output += `⚠️ NOTE: WE DON'T RECOMMEND TRAVELLING DUE TO THE CORONAVIRUS!!!`;

                // Resolve the promise with the output text
                console.log(output);
                resolve(output);
            });
            request.on('error', (error) => {
                console.log(`Error calling the weather API: ${error}`);
                reject();
            });

        }); 
        request.write(data);
        request.end();
    });
}
