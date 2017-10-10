var express = require('express');
var router = express.Router();
var FB = require('fb');
var jwt = require('jsonwebtoken');
var oauth = require('../oauth.js');
var User = require('../models/User');

FB.options({appId: oauth.facebook.clientID, appSecret: oauth.facebook.clientSecret,version: 'v2.10'});

router.post('/facebook',function(req, res,next){
    FB.setAccessToken(req.body.accessToken);
    FB.api('/me', { fields: ['id', 'name' , 'email'] },function (response) {
        if(!response || response.error){
            console.log(response);
            return res.json({'error' : 'Some error occurred'});
        }
        User.findOne({ 'email': response.email }, function(err, user) {
                if(err) {
                    return res.json({'error' : err.toString()});
                }
                if (!err && user !== null) {
                    return res.send(jwt.sign(user, process.env.JWT_SECRET_KEY, { expiresIn: 60*500 }));
                } else {
                    console.log("response = ",response);
                    user = new User({
                        'email' : response.email,
                        'account_type' : 'facebook',
                        'account_id' : response['id']
                    });
                    user.save(function(err) {
                        if(err) 
                            return res.json({'error' : err.toString()});
                        console.log("JWT_KEy = ",process.env.JWT_SECRET_KEY);
                        return res.send(jwt.sign(user, process.env.JWT_SECRET_KEY, { expiresIn: 60*500 }));
                    });
                }
        });
    });
});

module.exports = router; 