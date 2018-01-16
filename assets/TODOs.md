# TODOs

### LoadFromSemantify.js

#### Standardize addressLocality values - OPEN
When loading data from from Semantify values for addressLocality values should be standardized. Eg "Mayrhofen", "Mayrhofen ", "Mayrhofen, Tirol " is the same! 

Query: db.foodestablishments.distinct("sdoAnnotation.address.addressLocality")
```json
[
    "Hippach", "Hippach ", 
    "Ramsau", "Ramsau ", 
    "Mayrhofen", "Mayrhofen ", "Mayrhofen, Tirol ", 
    "Schwendau", "Schwendau bei Mayrhofen",
    "Schwendau / Hippach", 
    "Hainzenberg", 
    "Hintertux", 
    "Brandberg", 
    "Ginzling", 
    "Finkenberg", "Pfitsch", "Pfitsch - Val di Vizze ","St. Jodok am Brenner", 
    "Schwendberg"
]
```

### Alexa Skill

#### Sort results by rating desc - OPEN

#### Enable nearby searches based on location - OPEN
To get permissions:
https://github.com/jovotech/jovo-framework-nodejs/blob/master/examples/alexa_specific/indexAlexaDeviceAddress.js

#### Aks for opening hours - OPEN
Use amazon alexa built in localbusiness intent to ask for opening hours:
https://developer.amazon.com/de/docs/custom-skills/localbusiness-intents.html

#### Implement AMAZON.HelpIntent - OPEN

#### Add image to Cards - OPEN
- Infrastructure to load, scale and serve images over https necessary
- https://developer.amazon.com/de/docs/custom-skills/include-a-card-in-your-skills-response.html#creating-a-home-card-to-display-text-and-an-image
- https://github.com/jovotech/jovo-framework-nodejs/blob/master/examples/alexa_specific/indexAlexaCards.js

#### Improve Slot Type AMAZON.AT_CITY - DONE
Add normalized addressLocality values to slot type

#### Improve handling of multiple results - OPEN
- Show x results on phone
- What is the x th result?