
import low from 'lowdb'
const FileSync = require('lowdb/adapters/FileSync')
const uuidv4 = require('uuid/v4');
const fs = require('fs')


import config from '../config'

const bucketsAdapter = new FileSync(config.ROOT_FOLDER + '/buckets.json')
const bucketsDB = low(bucketsAdapter)

bucketsDB.defaults({ "buckets": [] }).write()

export class BucketController {

  static createBucket(req, res) {
    const id = uuidv4();

    const bucket = {
      "bucketID": id,
      "name": req.body.bucketName,
      "size": "0KB",
      "items": "0",
      "database": req.body.bucketName + ".bucket.json",
      "createdBy": req.body.userID,
      "createdAt": Date.now()
    }

    bucketsDB.get('buckets')
      .push(bucket)
      .write()
    const bucketAdapter = new FileSync(config.ROOT_FOLDER + '/' + bucket.name + '.bucket.json')
    const bucketDB = low(bucketAdapter)
    bucketDB.set('bucket', {
      "name": req.body.bucketName,
      "bucketID": id,
      "size": "0KB",
      "items": "0",
      "database": bucket.database,
      "createdBy": bucket.createdBy,
      "createdAt": bucket.createdAt,
      "domains": [],
      "settings": {
        "endPoint": "",
        "sslEnabled": false,
        "fileListing": "restricted"
      }
    })
    .write()

    fs.mkdir(config.ROOT_FOLDER+'/'+bucket.name,() => {});

    return res.send({ "success": true })

  }

  static updateBucket(req, res) {
    const bucket = req.body
    const bucketName = (bucketsDB.get('buckets').find({ bucketID: bucket.bucketID }).value())['name']
    const FileSyncBucket = require('lowdb/adapters/FileSync')
    const adapterBucket = new FileSyncBucket(config.ROOT_FOLDER + '/' + bucketName+'.bucket.json')
    const bucketDB = low(adapterBucket)
    bucketDB.get('bucket')
      .assign(bucket)
      .write()
    res.send({ "success": true })
  }

  static getAllBuckets(req, res) {
    return res.json(bucketsDB.get('buckets').value());
  }

  static getBucket(req, res) {
    const bucketID = req.params.bucketID
    const bucketName = (bucketsDB.get('buckets').find({ bucketID: bucketID }).value())['name']
    const FileSyncBucket = require('lowdb/adapters/FileSync')
    const adapterBucket = new FileSyncBucket(config.ROOT_FOLDER + '/' + bucketName+'.bucket.json')
    const bucketDB = low(adapterBucket)
    return res.json(bucketDB.get('bucket').value());
  }

  static deleteBucket(req, res) {
    const bucketID = req.params.bucketID
    const bucketName = (bucketsDB.get('buckets').find({ bucketID: bucketID }).value())['name']
      fs.unlink(config.ROOT_FOLDER+'/'+bucketName+'.bucket.json', (err) => {
        if (err) {
          console.error(err)
          return res.send({ "success": false })
        }
      })
      bucketsDB.get('buckets')
      .remove({ bucketID: bucketID })
      .write()

      fs.rmdir(config.ROOT_FOLDER+'/'+bucketName, () => { recursive: true });

    return res.send({ "success": true })

  }

  static getObjects(req, res) {
    return res.json(bucketsDB.get('buckets').value());
  }

}
