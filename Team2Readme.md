# Readme file for Team 2 - FoodFinder

## Links

[Mid Term Presentation](https://docs.google.com/presentation/d/1pfnbbwZvV4VeHb1lQhlh-8YRDjX5QNt_3NpMxJeX_-M/edit?usp=sharing)



## Application Workflow

#### A. Load Annotations from semantify.it
1. Load a list with meta informations of all annotations for the mayrhofen.at website from semantify.it.
2. For every item in this list check if we need the corresponding annotation, hence the "type" of the annotation contains any SDO types we need (FoodEstablishment, Bakery, BarOrPub, CafeOrCoffeeShop, FastFoodRestaurant, IceCremeShop, Restaurant, Winery).
3. For every wished annotation load the annotation content with the corresponding CID, which was provided in the list. Store the annotation along with some meta informations in the local MongoDB (Database Name: FoodFinder). Actual DataModel: 
```json
name: {type: String},
language: {type: String},
CID: {type: String, unique: true},
sdoAnnotation: {},
sdoTypes: [],
rating: Number
```

#### B. Data Quality based rating of Annotations

1. For every Annotation in MongoDB: Check if the sdoAnnotation (the actual content) meets our requirements (mandatory properties, wished properties, optional properties). Based on this analysis a Quality Rating for the Annotation is determined and stored in the "rating" of the Annotation. The better the rating, the most likely it will be shown to the users.

Todo: Insert list of properties we require, want or accept. 

Rating key:
```
0: Dont use
1: Minimum requirements fulfilled
3: Minimum + Wished requirements fulfilled
4: Minimum + Wished + Optional requirements fulfilled
```

#### C. Backend Service for Alexa App
1. Activate Backend Service for the alexa app. Open for any intention requests from the Amazon Alexa Web Service. The selection of which Food Establishment to show depends on the rating of the annotations.

#### D. Example Usage
1. Say "Alexa, talk to food finder" in order to start a session
2. Say "Find a restaurant" to trigger FindFoodEstablishment Intent
    + The dialog is delegated to Alexa to ask for all mandatory intent slots because of used dialog directive
    + Alexa asks where to look for restaurants
    + Answer with "In Hippach"
3. Alexa will respond with the answer: "I have found 20 restaurants in Hippach. One of them is Almhof Roswitha."
4. Ask Alexa to "Show details". A card containing details of result will be send to Amazon Alexa companion app.
5. You can also ask for address ("What's the address"), phone number ("What's the telephone number") and description ("Tell me more about it").
6. You can tell Alexa "Next result" or that you don't like that result to goto the next result.
7. If there are multiple results you can say "What is result x" to talk about that item.

## scripts

**npm run loadData** - Starts the process of loading data from the semantify backend to our backend to fill our database with mayrhofen.at data.
