var mongoose = require('mongoose');

var mongodbUri = 'mongodb://127.0.0.1:27017/ngGather';
try {
    console.error(JSON.parse(process.env.VCAP_SERVICES))
    console.log(JSON.parse(process.env.VCAP_SERVICES).mongodb)
    mongodbUri = JSON.parse(process.env.VCAP_SERVICES).mongodb[0].credentials.uri;
}
catch (e) {
    console.log(e);
}

var db = mongoose.connect(mongodbUri);

var gatherSchema = new mongoose.Schema({
    img: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        default: ''
    },
    href: {
        type: String
    },
    time: {
        type: Number,
        default: Date.now
    },
    intro: {
        type: String
    },
    site: {
        type: String
    }
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

function searchAll() {
    return gatherModel.find({},
        {_id: 0}, {
            sort: {time: -1}
        });
}

function searchSite(site) {
    return gatherModel.find({
        site: site
    }, {
        _id: 0
    }).exec();
}

function search(conditions, fields, options) {
    return gatherModel.find(conditions || {}, fields, options).exec();
}

function searchOne(conditions) {
    return gatherModel.findOne(conditions || {}).exec();
}

function update(siteObj) {
    return gatherModel.update({
        href: siteObj.href
    }, siteObj);
}

exports.searchSite = searchSite;
exports.searchOne = searchOne;
exports.add = add;
exports.addArr = addArr;
exports.update = update;
exports.searchAll = searchAll;
