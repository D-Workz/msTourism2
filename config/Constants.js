// Available
const AVAILABLE_TYPE_TEXT = "Hotels, Stores, Restaurants, Tourist Attractions, Ski resorts, pubs, bars, banks, museums and train stations. ";
const AVAILABLE_CHANGER_TEXT = "To change the city we talk about, say change city. To keep the city and talk with me about something else say, change type. ";
const AVAILABLE_PROPERTIES_TEXT = "You can ask for description, contact, address, stars, things nearby and distance to the city center on all things." +
    "Additionally you can ask for rooms, price and beds for Hotels.";
const AVAILABLE_FILTER_TEXT = "filter Hotels either by saying 'better rated than' or 'cheaper than'.";


// Info
const INFO_POSSIBILITIES_HOTEL_STRING = "What do you want to know? I can give you a description, information about rooms and prices, the location, contact infos and the average rating. ";
const INFO_POSSIBILITIES_STRING = "What do you want to know? I can give you a description, information about the location and contact infos.";
const INFO_DIDNT_UNDERSTAND = "I am sorry I didn't get that. ";
const INFO_DIDNT_FIND_CONTEXT = "I am sorry I couldn't find anything with: ";
const INFO_DIDNT_FIND = "I am sorry I couldn't find anything.";
const INFO_TELL_YOU_ABOUT_CONTEXT = "About what do you want to know more? I can give you information about: ";

// Intends
const INTEND_CHOOSE_CITY = "About which place do you want to talk? For Mayrhofen say one or for Seefeld say two.";
const INTEND_WELCOME= "Hey there, I am Talking Tourism. I can help you find out details about a lot of things in Seefeld or Mayrhofen. For Seefeld say 1 and for Mayrhofen 2.";
const INTEND_TYPE_SELECTION = "I didn't understand what you just said. For Hotel say 1, for Restaurant say 2, for Tourist Attraction say 3, for Ski Resort say 4, for Pubs or Bars say 5, for banks say 6, for museums say 7 or for train stations say 8.";
//Random
const NO_TYPE_DEFINED_TEXT = "I am sorry, there isn't any type defined";
const FILTERING_NOT_ALLOWED_TEXT = "I'm terrible sorry, filtering is only allowed on hotels";

const TOP_N_NUMBER = 5;
const NEAR_IN_METERS = 1000;

const CREDIT_INFO_TEXT = "I was created by Dennis 'the awesome backend guy and data crawler', Stefan 'the intent master and jovo-whisperer' and Alex 'the intent-implementor, query expert and inventor of these lame names'";
const UNHANDLED_THING_KNOW_STATE_TEXT ='I did not understand you, say help for a list of the available commands!';
const UNHANDLED_TEMPORARY_LIST_STATE_TEXT = 'I did not understand you. Please select something from the list presented or say help for a list of the available commands';
const UNHANDLED_SELECT_TYPE_STATE_TEXT = 'I did not understand you. Please select one of the types presented.';
const UNHANDLED_SELECT_THING_STATE_TEXT = 'I did not understand you. Please select one item of the list presented..';

const UNHANDLED_SELECT_CITY_STATE_TEXT = 'I did not understand you. Please select one of the types presented by number oŕ by its name.';
//StringConstants.INFO_TELL_YOU_ABOUT_CONTEXT + StringConstants.AVAILABLE_TYPE +".", StringConstants.INTEND_TYPE_SELECTION


const UNHANDLED_GLOBAL_STATE_TEXT = 'I did not understand you. Say help for a list of available commands.';

const THING_KNOWN_STATE_TEXT = "ThingKnownState";
const SELECT_THING_STATE_TEXT = "SelectThingState";


module.exports = {
    AVAILABLE_TYPE: AVAILABLE_TYPE_TEXT,
    AVAILABLE_PROPERTIES: AVAILABLE_PROPERTIES_TEXT,
    AVAILABLE_CHANGER: AVAILABLE_CHANGER_TEXT,
    AVAILABLE_FILTER: AVAILABLE_FILTER_TEXT,

    INFO_POSSIBILITIES_HOTEL: INFO_POSSIBILITIES_HOTEL_STRING,
    INFO_POSSIBILITIES: INFO_POSSIBILITIES_STRING,
    INFO_NOT_UNDERSTAND: INFO_DIDNT_UNDERSTAND,
    INFO_NOT_FOUND_CONTEXT: INFO_DIDNT_FIND_CONTEXT,
    INFO_TELL_YOU_ABOUT_CONTEXT: INFO_TELL_YOU_ABOUT_CONTEXT,
    INFO_NOT_FOUND: INFO_DIDNT_FIND,

    INTEND_WELCOME:INTEND_WELCOME,
    INTEND_TYPE_SELECTION:INTEND_TYPE_SELECTION,
    INTEND_CHOOSE_CITY:INTEND_CHOOSE_CITY,

    NO_TYPE_DEFINED: NO_TYPE_DEFINED_TEXT,
    FILTERING_NOT_ALLOWED : FILTERING_NOT_ALLOWED_TEXT,
    TOP_N : TOP_N_NUMBER,
    NEAR: NEAR_IN_METERS,
    CREDIT_INFO : CREDIT_INFO_TEXT,
    
    THING_KNOWN_STATE : THING_KNOWN_STATE_TEXT,
    SELECT_THING_STATE : SELECT_THING_STATE_TEXT,

    UNHANDLED_THING_KNOW_STATE :  UNHANDLED_THING_KNOW_STATE_TEXT,
    UNHANDLED_TEMPORARY_LIST_STATE_TEXT : UNHANDLED_TEMPORARY_LIST_STATE_TEXT ,
    UNHANDLED_SELECT_TYPE_STATE_TEXT:  UNHANDLED_SELECT_TYPE_STATE_TEXT ,
    UNHANDLED_SELECT_THING_STATE_TEXT : UNHANDLED_SELECT_THING_STATE_TEXT ,
    UNHANDLED_SELECT_CITY_STATE_TEXT : UNHANDLED_SELECT_CITY_STATE_TEXT,
    UNHANDLED_GLOBAL_STATE_TEXT: UNHANDLED_GLOBAL_STATE_TEXT

};