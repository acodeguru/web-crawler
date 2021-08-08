require('dotenv').config()

const readline = require("readline");
const validUrl = require('valid-url');

const fs = require('fs');
const LocationController = require("./controllers/location.controller");
const AppConfig = require('./app.config');
const {find_array_item_html_tags} = require('./utils/HTML.utils');

let url_list = []
const tags_list = AppConfig.readTags;
let location_list = []
let keyword_list = []

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// user input
rl.question(`Please add urls as examples provided below (with comma separated values) : \n`
, async function(urls) {
    url_list = urls.split(",");

         try {
            // fetch locations
            await LocationController.locations().then(function(recordSet){
                location_list = recordSet.map(function(o) {
                    return o.name.toLowerCase()
                });
            })
            .catch(function(err) {
                console.error(err)
            })

            // get keywords from file
            fs.readFile(process.env.KEYWORDSFILE, function(err, data) {
                if(err) throw err;
                keyword_list = data.toString().toLowerCase().split("\n");
            });

            // loop through user input url list
            for (url_list_index in url_list ) {

                // check if valid urls
                if (validUrl.isUri(url_list[url_list_index])){
                    
                    let website_locations = [], website_keywords = [], is_fulfilled = false, sub_urls = [], is_sub_urls = true;
                    
                    // get main url and check keywords and locations exists
                    let results = await find_array_item_html_tags(
                        website_locations, website_keywords, url_list[url_list_index], 
                        tags_list, location_list, keyword_list,is_sub_urls
                    ).catch(function(err) {
                        console.error(err)
                    })

                    website_locations = results.website_locations;
                    website_keywords = results.website_keywords;
                    is_fulfilled = results.is_fulfilled;
                    sub_urls = results.sub_urls;

                    // if the limit is not yet reached then check sub urls
                    if(!is_fulfilled){
                        is_sub_urls = false
                        for(sub_urls_index in sub_urls){
                            results = await find_array_item_html_tags(
                                website_locations, website_keywords, sub_urls[sub_urls_index], 
                                tags_list, location_list, keyword_list, is_sub_urls
                            ).catch(function(err) {
                                console.error(err)
                            })

                            website_locations = results.website_locations;
                            website_keywords = results.website_keywords;
                            is_fulfilled = results.is_fulfilled;

                            if(is_fulfilled) {
                                break
                            }
                        }
                    }

                    // store the details in another output file
                    fs.appendFile(process.env.OUTPUTFILE, 
                        url_list[url_list_index]+"\n "+
                        website_locations.join(',')+"\n "+
                        website_keywords.join(',')+"\n "+
                        "======================================================\n "
                    , function (err) {
                        if (err) throw err;
                    });
                } 
                else {
                    console.log('Not a valid URI');
                }
            }
        } catch (error) {
        console.log(error)
    }
});


