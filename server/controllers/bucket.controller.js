import config from '../config'
const low = require('lowdb')
const FileSyncBuckets = require('lowdb/adapters/FileSync')
const adapterBuckets = new FileSyncBuckets(config.ROOT_FOLDER+'/buckets.json')
const dbBuckets = low(adapterBuckets)
const uuidv4 = require('uuid/v4');

dbBuckets.defaults({"buckets": []}).write()

export class BucketController {

    static createBucket(req, res) {
        const id = uuidv4();
        dbBuckets.get('buckets')
        .push({
            "bucketID" : id,
            "name" : req.body.bucketName,
            "size" : "0KB",
            "items" : "0",
            "database" : req.body.bucketName+".bucket.json",
            "createdBy" : req.body.userID,
            "createdAt" : Date()
          })
        .write()
        const FileSyncBucket = require('lowdb/adapters/FileSync')
        const adapterBucket = new FileSyncBucket(config.ROOT_FOLDER+'/'+req.body.bucketName+'.bucket.json')
        const dbBucket = low(adapterBucket)
        dbBucket.set('bucket',{
            "name": req.body.bucketName,
            "bucketID" : id,
            "size": "0KB",
            "items": "0",
            "database": req.body.bucketName+".bucket.json",
            "createdBy": req.body.userID,
            "createdAt": Date(),
            "domains": [],
            "settings": {
              "endPoint": "",
              "sslEnabled": false,
              "fileListing": "restricted"
            }
          })
        .write()
        res.send({"success":true})
    }

    static updateBucket(req, res) {
      var data = {}
      if(req.body.size != undefined)
      data.size = req.body.size
      if(req.body.items != undefined)
      data.items = req.body.items
        dbBuckets.get('buckets')
        .find({ bucketID: req.body.bucketID })
        .assign(data)
        .write()
        const FileSyncBucket = require('lowdb/adapters/FileSync')
        const adapterBucket = new FileSyncBucket(config.ROOT_FOLDER+'/'+req.body.database)
        const dbBucket = low(adapterBucket)
        dbBucket.get('bucket')
        .assign(req.body)
        .write()
        res.send({"success":true})
    }

    static getAllBuckets(req, res) {
      return res.json(dbBuckets.get('buckets').value());
    }

    static getBucket(req, res) {
      return res.json(dbBuckets.get('buckets').find({ bucketID: req.params.bucketID }).value());
    }

    static deleteBucket(req, res) {
        dbBuckets.get('buckets')
        .remove({ bucketID: req.params.bucketID })
        .write()
        res.send({"success":true})
    }

    static getObjects(req, res) {
        return res.json(dbBuckets.get('buckets').value());
    }

}
