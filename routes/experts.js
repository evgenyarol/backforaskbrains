const JWTverify = require("./../helpers/auth.js"),
    db = require("./../db.js");
const User = require('../database/models/Users');
const express = require("express");
const router = express.Router();

//----------------------------------------------------------------------------------------
// Experts functions

router.post("/update", async (req, res) => {
    const userData = {
        name: req.body.name,
        surname: req.body.surname,
        about: req.body.about,
        biography: req.body.biography,
        socialLinks: req.body.socialLinks || [],
        expertType: req.body.expertType || [],
        rate: req.body.rate,
        currency: req.body.currency, // usd, eur, etc..
        keywords: req.body.keywords || [] // skills
    };
    try {
        let sessionData = await JWTverify(req, res);
        if (sessionData) {
            let userUpdate = await db.Users.update({
                _id: sessionData.id,
                action: userData
            });
            if (userUpdate) res.json({ success: true });
            else res.json({ success: false });
        } else
            res.json({
                success: false,
                error: "Session not found"
            });
    } catch (error) {
        res.json({
            success: false,
            error: "Session not found"
        });
    }
});

// router.post("/list", async (req, res) => {
//     console.log(req.body);
//     let options = {
//         items: req.body.items,
//         pageNumber: req.body.pageNumber - 1
//     };
//     console.log(options);
//     let experts = await db.Users.getExperts({
//         from: options.items * options.pageNumber,
//         limit: options.items
//     });
//     res.json(experts);
// });

// router.get('/list', (req, res) => {

//     const page = parseInt(req.query.page);
//     const size = parseInt(req.query.size);
//     const expertType = req.query.expertType  
//     const keywords = req.query.keywords 
//     const query = {}

//     if(page < 0 || page === 0) {
//         return res.json({"error" : true, "message" : "invalid page number, should start with 1"});
//     }
//     query.skip  = size * (page - 1)
//     query.limit = size
//     const allgavo = {'$or': [{ 'expertType': {'$in': [expertType]} , 
//                                 'keywords': {'$in': [keywords]},
//                                 'rate': {$gte : req.query.minrate, $lte: req.query.maxrate}
//                             }]}


//         User.find((allgavo), {}, query, (err, data) => {
//             if (err) {
//                 return res.json({"error" : true,"message" : "Error fetching data"});
//             } else {
//                 return res.json({"error" : false, "message" : data});
//             }
//         })
// });

router.get('/list', (req, res) => {
    const getAllUsers = (...args) => {
        User.find(...args, (err, data) => {
            if (err) {
                return res.json({"error" : true,"message" : "Error fetching data"});
            } else {
                return res.json({"error" : false, "message" : data});
            }
        })  
    }
    const page = parseInt(req.query.page);
    const size = parseInt(req.query.size);

    const allkeys = {'$and': [{ 'expertType': {'$in': [req.query.expertType]} , 
                                'keywords': {'$in': [req.query.keywords]},
                                'rate': {$gte : req.query.minrate, $lte: req.query.maxrate}
                            }]}

    const expertType = {'$and': [{ 'expertType': {'$in': [req.query.expertType]},
                        'rate': {$gte : req.query.minrate, $lte: req.query.maxrate}
                            }]}     
    
    const keywords = {'$and': [{ 'keywords': {'$in': [req.query.keywords]},
    'rate': {$gte : req.query.minrate, $lte: req.query.maxrate}
        }]} 
    
    const rate = {'rate': {$gte : req.query.minrate, $lte: req.query.maxrate}}
                            
    const query = {}

    if(page < 0 || page === 0) {
        return res.json({"error" : true, "message" : "invalid page number, should start with 1"});
    }
    query.skip  = size * (page - 1)
    query.limit = size
    if  (req.query.expertType && req.query.keywords) {
        return getAllUsers((allkeys), {}, query)
    } else if(req.query.expertType) {
        return getAllUsers((expertType), {}, query)
    } else if (req.query.keywords){
        return getAllUsers((keywords), {}, query)
    } else if (!req.query.expertType && !req.query.keywords) {
        return getAllUsers((rate), {}, query)
    }
})





module.exports = router;
