// Available
const AVAILABLE_THINGS_TEXT = "Hotels, Stores, Restaurants, Tourist Attractions, Ski resorts, pubs, bars, banks, museums and train stations";
const AVAILABLE_CHANGER_TEXT = "You can change the city as well as the thing you want to talk about."
const AVAILABLE_PROPERTIES_TEXT = "You can ask for description, contact, address, stars, things nearby and distance to the city center on all things." +
    "Additionally you can ask for rooms, price and beds for Hotels.";
const AVAILABLE_FILTER_TEXT = "You can filter Hotels either by saying 'better rated than' or 'cheaper than'.";


// Info
const INFO_POSSIBILITIES_STRING = "What do you want to know? I can give you a description, information about rooms and prices, the location, contact infos and the average rating.";
const INFO_DIDNT_UNDERSTAND = "I am sorry I didn't get that.";
const INFO_DIDNT_FIND_CONTEXT = "I am sorry I couldn't find anything with: ";
const INFO_DIDNT_FIND = "I am sorry I couldn't find anything.";
const INFO_TELL_YOU_ABOUT_CONTEXT = "I can tell you about all sort of things, like: ";

const NO_TYPE_DEFINED_TEXT = "I am sorry, there isn't any type defined";
const FILTERING_NOT_ALLOWED_TEXT = "I'm terrible sorry, filtering is only allowed on hotels"

module.exports = {
    AVAILABLE_THINGS: AVAILABLE_THINGS_TEXT,
    AVAILABLE_PROPERTIES: AVAILABLE_PROPERTIES_TEXT,
    AVAILABLE_CHANGER: AVAILABLE_CHANGER_TEXT,
    AVAILABLE_FILTER: AVAILABLE_FILTER_TEXT,
    INFO_POSSIBILITIES: INFO_POSSIBILITIES_STRING,
    INFO_NOT_UNDERSTAND: INFO_DIDNT_UNDERSTAND,
    INFO_NOT_FOUND_CONTEXT: INFO_DIDNT_FIND_CONTEXT,
    INFO_TELL_YOU_ABOUT_CONTEXT: INFO_TELL_YOU_ABOUT_CONTEXT,
    INFO_NOT_FOUND: INFO_DIDNT_FIND,
    NO_TYPE_DEFINED: NO_TYPE_DEFINED_TEXT,
    FILTERING_NOT_ALLOWED : FILTERING_NOT_ALLOWED_TEXT
};