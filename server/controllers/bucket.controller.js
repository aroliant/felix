
import low from 'lowdb'
import Busboy from 'busboy'
import FileSync from 'lowdb/adapters/FileSync'
import uuidv4 from 'uuid/v4'
import fs from 'fs-extra'
import klaw from 'klaw'
import path from 'path'
import through2 from 'through2'
import rimraf from 'rimraf'

import config from '../config'

const bucketsAdapter = new FileSync(config.ROOT_FOLDER + '/buckets.json')
const bucketsDB = low(bucketsAdapter)

bucketsDB.defaults({ "buckets": [] }).write()

export class BucketController {

  static createBucket(req, res) {

    const params = req.body

    try {
      if (bucketsDB.get('buckets').filter({ bucketName: params.bucketName }).value().length != 0) {
        return res.json({
          success: false,
          message: "Bucket name already exists"
        })
      }
    } catch (err) {
      return res.json({
        success: false,
        message: "Error occured while creating bucket"
      })
    }

    const id = uuidv4();

    const bucket = {
      bucketID: id,
      bucketName: params.bucketName,
      size: "0KB",
      items: "0",
      database: params.bucketName + ".bucket.json",
      createdBy: params.userID,
      createdAt: Date.now()
    }

    try {
      bucketsDB.get('buckets').push(bucket).write()
    } catch (err) {
      return res.json({
        success: false,
        message: "Unable to create Bucket",
        error: err
      })
    }

    const bucketAdapter = new FileSync(config.ROOT_FOLDER + '/' + bucket.bucketName + '.bucket.json')
    const bucketDB = low(bucketAdapter)

    try {
      bucketDB.set('bucket', {
        bucketName: req.body.bucketName,
        bucketID: id,
        size: "0KB",
        items: "0",
        database: bucket.database,
        createdBy: bucket.createdBy,
        createdAt: bucket.createdAt,
        domains: [],
        settings: {
          endPoint: "",
          sslEnabled: false,
          fileListing: params.fileListing
        }
      })
        .write()
    } catch (err) {
      return res.json({
        success: false,
        message: "Unable to create Bucket",
        error: err
      })
    }

    fs.mkdir(config.ROOT_FOLDER + '/buckets/' + bucket.bucketName, function (err) {
      if (err) {
        return res.json({
          success: false,
          message: "Unable to create bucket folder",
          error: err
        });
      } else {
        return res.json({
          success: true,
          message: "Bucket Created !"
        });
      }
    });

  }

  static updateBucket(req, res) {
    const bucket = req.body

    //Check if bucket exists
    const bucketDetails = bucketsDB.get('buckets').find({ bucketID: bucket.bucketID }).value()
    if (bucketDetails) {
      const bucketName = bucketDetails.bucketName
      const adapterBucket = new FileSync(config.ROOT_FOLDER + '/' + bucketName + '.bucket.json')
      const bucketDB = low(adapterBucket)

      try {
        bucketDB.get('bucket').assign(bucket).write()
      } catch (err) {
        return res.json({
          success: false,
          message: "Unable to update Bucket",
          error: err
        });
      }

      return res.json({
        success: true,
        message: "Bucket Updated !"
      })
    } else {
      return res.json({
        success: false,
        message: "Unable to find bucket!"
      })
    }
  }

  static getAllBuckets(req, res) {
    var buckets = []
    try {
      buckets = bucketsDB.get('buckets').value()
    } catch (err) {
      return res.json({
        success: false,
        message: "Unable to retrive Buckets",
        error: err
      });
    }

    return res.json({
      success: true,
      buckets: buckets
    });

  }

  static getBucket(req, res) {
    const bucketName = req.params.bucketName
    const adapterBucket = new FileSync(config.ROOT_FOLDER + '/' + bucketName + '.bucket.json')
    const bucketDB = low(adapterBucket)

    var bucket = {}

    try {
      bucket = bucketDB.get('bucket').value()
    } catch (err) {
      return res.json({
        success: false,
        message: "Unable to retrive Bucket",
        error: err
      });
    }

    return res.json({
      success: true,
      bucket: bucket
    });

  }

  static deleteBucket(req, res) {
    var bucketName = req.params.bucketName

    try {
      bucketName = (bucketsDB.get('buckets').find({ bucketName: bucketName }).value())['bucketName']
    } catch (err) {
      return res.json({
        success: false,
        message: "Unable to find Bucket",
        error: err
      });
    }

    fs.unlink(config.ROOT_FOLDER + '/' + bucketName + '.bucket.json', function (err) {
      if (err) {
        return res.json({
          success: false,
          message: "Failed to delete meta file",
          error: err
        });
      }
    })

    try {
      bucketsDB.get('buckets').remove({ bucketName: bucketName }).write()
    } catch (err) {
      return res.json({
        success: false,
        message: "Unable to delete Bucket",
        error: err
      })
    }

    rimraf(config.ROOT_FOLDER + '/buckets/' + bucketName, function (err) {
      if (err) {
        return res.json({
          success: false,
          message: "Failed to delete bucket folder",
          error: err
        });
      }
    })

    return res.json({
      success: true,
      message: "Bucket Deleted !"
    })

  }

  static searchObjects(req, res) {

    const params = req.body
    const rootPath = config.ROOT_FOLDER + '/buckets/' + params.bucketName
    let objects = []
    let directories = []
    let files = []

    const processObject = through2.obj(function (item, enc, next) {

      const object = {
        name: path.basename(item.path),
        size: item.stats.size,
        createdAt: item.stats.ctime,
        modifiedAt: item.stats.mtime,
        objectType: item.stats.isDirectory() == true ? 'folder' : 'file'
      }

      if (!params.name || object.name.indexOf(params.name) > -1) {


        if (object.objectType == 'file') {
          files.push(object)
        }

        else if (object.objectType == 'folder') {
          directories.push(object)
        }

      }

      next()
    })

    const _path = rootPath + params.path

    if (!fs.pathExistsSync(_path)) {
      return res.json({
        success: false,
        message: "Unable to find Folder"
      });
    }

    klaw(_path, { depthLimit: 0 })
      .pipe(processObject)
      .on('data', item => objects.push(item))
      .on('error', (err, item) => {
        return res.json({
          success: false,
          message: "Unable to search Objects",
          error: err
        });
      })
      .on('end', () => {
        if (!params.name) {
          directories = directories.splice(1)
        }
        return res.json({
          success: true,
          objects: directories.concat(files)
        })
      })

  }

  static deleteObjects(req, res) {
    var params = req.body;
    params.paths.forEach(object => {
      fs.remove(config.ROOT_FOLDER + '/buckets/' + params.bucketName + '/' + object, err => {
        if (err) { }
      })
    })

    return res.json({
      success: true,
      message: "Object Deleted !"
    })

  }

  static uploadObjects(req, res) {

    const fileName = req.params[0]
    const absolutePath = config.ROOT_FOLDER + "/buckets/" + fileName

    const busboy = new Busboy({ headers: req.headers })

    fs.ensureFile(absolutePath, (err) => {

      if (err) {
        return res.json({
          success: false,
          message: "Unable to upload file",
          error: err
        })
      }

      busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        file.pipe(fs.createWriteStream(absolutePath));
      });

      busboy.on('finish', function () {
        return res.json({
          success: true,
          path: fileName
        })
      });

      busboy.on('error', (err) => { console.log(err) })

      return req.pipe(busboy)

    })

  }

  static createFolder(req, res) {

    const params = req.body

    fs.mkdir(config.ROOT_FOLDER + '/buckets/' + params.bucketName + params.path, function (err) {
      if (err) {
        return res.json({
          success: false,
          message: "Unable to create new folder",
          error: err
        })
      } else {
        return res.json({
          success: true,
          message: "Folder created !"
        })
      }
    });

  }

  static moveObjects(req, res) {

    const params = req.body
    var messages = []

    const dest = config.ROOT_FOLDER + '/buckets/' + params.bucketName + params.dest

    // var paths = []
    // params.paths.map((path, i) => {
    //   paths.push(config.ROOT_FOLDER + '/buckets/' + params.bucketName + '/' + path)
    // })

    params.paths.map((path, i) => {

      try {

        fs.moveSync(config.ROOT_FOLDER + '/buckets/' + params.bucketName + '/' + path, dest, { overwrite: true })

        messages.push({
          success: true,
          message: path + " moved Successfully"
        })

      } catch (error) {

        messages.push({
          success: false,
          message: path + " not moved Successfully",
        })

      }

    })

    return res.send({
      success: true,
      messages: messages
    })

  }

  ensureObjectMeta(absolutePath) {
    // TODO: Create/Update meta for the new Folder

  }

}
