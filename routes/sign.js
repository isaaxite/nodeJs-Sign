/**
 * Created by baohua on 17/5/10.
 */
var express = require("express"),
    router = express.Router(),
    assert = require('assert');

var operateDb = function(callback) {
    var MongoClient = require('mongodb').MongoClient;
    var url = 'mongodb://localhost:27017/user';

    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        callback(db);
        db.close();
    });
};
var isEmptyObj = function(obj) {
    for(key in obj){
        return false;
    }
    return true;
};

router.get('/in.html', function(req, res) {
    res.render('in');
});
router.post('/aIn', function(req, res) {

    var data = req.body;
    operateDb(function(db){
        var collection = db.collection('documents');

        collection.find({accont: data.user}).toArray(function(err, docs) {
            assert.equal(err, null);
            docs = docs[0];
            const isPass = !isEmptyObj(docs) && docs.pwd == data.pwd;
            if(isPass){
                res.json({ status: 0, msg: 'pass' });
            }else {
                res.json({status: 1, msg: '账号或密码有误！'});
            }
            res.end();
        });
    });
});
module.exports = router;