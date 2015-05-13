var mongoose = require('mongoose');

var mongodbUri = 'mongodb://127.0.0.1:27017/ngGather';
try {
    mongodbUri = process.env.mongodb[0].credentials.uri
}
catch(e) {
    console.log(e);
}

var db = mongoose.connect(mongodbUri);

var gatherSchema = new mongoose.Schema({
    img: {type: String, default: ''},
    title: {type: String, default: ''},
    href: {type: String},
    time: {type: Date, default: Date.now},
    intro: {type: String},
    site: {type: String}
});

var gatherModel = db.model('gather', gatherSchema);

function add(siteObj) {
    return gatherModel.create(siteObj, function(err, doc) {
        //console.log(doc);
    });
}

function addArr(siteArr) {
    return gatherModel.collection.insert(siteArr, function(err, doc) {
        if (err) {
            console.log(err);
        }
    });
}

function searchSite(site) {
    return gatherModel.find({
        site: site
    }, {_id: 0}).exec();
}

function search(conditions, fields, options) {
    return gatherModel.find(conditions || {}, fields, options).exec();
}

function searchOne(conditions) {
    return gatherModel.findOne(conditions || {}).exec();
}

exports.searchSite = searchSite;
exports.add = add;
exports.addArr = addArr;
