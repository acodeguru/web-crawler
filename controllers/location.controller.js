const db = require("./../models");
const Location = db.Location;

module.exports = {
    // fetch all locations from the database
    locations : async()  => {
        try {
            return await Location.findAll({
                attributes: [`name`],
                raw : true
            })
        } catch (error) {
            throw error
        }
    }
    
}