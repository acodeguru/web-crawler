const axios = require('axios');
const cheerio = require('cheerio');
const AppConfig = require('../app.config');

module.exports = {
    // load html elements
    find_array_item_html_tags : async(
        website_locations, website_keywords,
        url_link, tags_list, location_list, keyword_list, is_sub_urls
        )  => {

        try {

            let is_fulfilled = false;
            let sub_urls = []

            // fetch the html for given url
            await axios.get(url_link).then(res => {

                if (res.status === 200) {
                  const $ = cheerio.load(res.data);

                  // loop through the tag list
                  for(tag_list_index in tags_list) {
                    if(is_fulfilled){
                        break
                    }

                    // select tag 
                    const $tagListElement = $(tags_list[tag_list_index]);
                    
                    $tagListElement.each(function (i) {

                        if(is_fulfilled){
                            return
                        }
                        // check locations
                        for(location_index in location_list.concat( website_locations )) {
                            
                            // match substrings
                            if ($(this).text().toString().toLowerCase().includes(location_list[location_index])) {
                                // check if already value is stored
                                if(!website_locations.includes(location_list[location_index]))
                                    website_locations.push(location_list[location_index])
                            }

                            // if the max content count is 5 then exit from url search
                            if(website_locations.length == AppConfig.maxURLIterations){
                                is_fulfilled = true
                                break
                            }
                        }
                        
                        // check keywords
                        for(keyword_index in keyword_list.concat( website_keywords )) {
                            if ($(this).text().toString().toLowerCase().includes(keyword_list[keyword_index])) {
                                if(!website_keywords.includes(keyword_list[keyword_index]))
                                    website_keywords.push(keyword_list[keyword_index])
                            }

                            // if the max content count is 5 then exit from url search
                            if(website_keywords.length == AppConfig.maxURLIterations){
                                is_fulfilled = true
                                break
                            }
                        }
                    });
                  }

                  // check for the sub urls
                  if(!is_fulfilled && is_sub_urls){
                    const $SubtagListElement = $('a');
                    $SubtagListElement.each(function (i) {
                        // fetch href content
                        let link_tag = $(this).attr('href')
                        if(link_tag){
                            link_tag = link_tag.trim()
                            // content validation and check wether the href is link with dns
                            if(link_tag.startsWith("/") || link_tag.includes(url_link)){
                                if(link_tag.startsWith("/")){
                                    link_tag = url_link+link_tag
                                }
                                if(!sub_urls.includes(link_tag))
                                    sub_urls.push(link_tag)
                            }
                        }
                    });
                  }
                }
              }, (error) => {
                console.log(error)
              });

              return  {website_locations, website_keywords, is_fulfilled, sub_urls}
        } catch (error) {
            console.log(error)
        }
    }

    
}