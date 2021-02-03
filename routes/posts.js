const router = require('express').Router();
const verify = require('./verifyToken');

// HERE 'verify' IS THE MIDDLEWARE, WHERE BEFORE THE REQUEST HITS THE /posts ROUTE, 
// IT GOES THROUGH 'verify' WHERE WE ARE VERIFYING THE JWT TOKEN
// THERE ALL THE ROUTES BEHIND 'verify' MIDDLEWARE ARE PRIVATE AND CAN NOT BE ACCESSED WITHOUT 
// A VALID JWT TOKEN
router.get('/', verify, (req, res) => {
    
    // SHOW THE DATA
    res.json({
        posts: {
            title: 'first post',
            description: 'horseshit data that you can not access without being authenticated'
        }
    });

});

module.exports = router;