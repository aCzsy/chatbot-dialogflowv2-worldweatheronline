Interactive chatbot which uses worldweather API and 5 cities that user provides as trip locations to give an advise to user on which clothes to wear based on the weather in those cities.

This project was created using Dialogflow v2 and WorldWeatherOnline API.

Note: This project requires a **WWOKEY** which you can get after registration on worldweatheronline.com
AND

**CLIENT_ACCESS_TOKEN** which needs to be edited in **gradle.properties**

    ```buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            buildConfigField 'String', "ClientAccessToken", CLIENT_ACCESS_TOKEN
            resValue 'string', "ClientAccessToken", CLIENT_ACCESS_TOKEN
        }
        debug {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
            buildConfigField 'String', "ClientAccessToken", CLIENT_ACCESS_TOKEN
            resValue 'string', "ClientAccessToken", CLIENT_ACCESS_TOKEN
        }
    }```

In order to set up Dialogflow with the same intents used in this project simple import **agent-intents.zip** folder into your Dialogflow.
Fulfillment files are stored in **function-source** folder.

**MAIN REFERENCE FOR THIS PROJECT :**
https://medium.com/@abhi007tyagi/android-chatbot-with-dialogflow-8c0dcc8d8018
