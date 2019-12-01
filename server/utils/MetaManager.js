import fs from 'fs-extra'
import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'

// Relative Imports
import config from '../config'

export class MetaManager {

  static ensureMetaFile(bucket, path) {
    return fs.ensureFile(config.ROOT_FOLDER + '/meta/' + bucket + path + '/meta.json')
  }

  static updateMetaData(data) {

    return new Promise((resolve, reject) => {
      
      MetaManager.ensureMetaFile(data.bucketName, data.path).then((result) => {

        const adapter = new FileSync(config.ROOT_FOLDER + '/meta/' + data.bucketName + data.path + 'meta.json')
        const db = low(adapter)

        db.defaults({ "meta": {} }).write()

        // Read old data to copy and update for public, sharingExpiresOn & meta

        const oldMeta = db.get('meta').get('children')

        data.treeData.children.forEach((_, i) => {

          const meta = oldMeta.find({ name: _.name }).value()

          if (meta) {
            data.treeData.children[i].id = data.treeData.children[i].name
            data.treeData.children[i].public = meta.public ? meta.public : false
            data.treeData.children[i].sharingExpiresOn = meta.sharingExpiresOn ? meta.sharingExpiresOn : ''
            data.treeData.children[i].meta = meta.meta ? meta.meta : {}
          } else {
            data.treeData.children[i].id = data.treeData.children[i].name
            data.treeData.children[i].public = false
            data.treeData.children[i].sharingExpiresOn = ''
            data.treeData.children[i].meta = {}
          }


        })

        db.get('meta').assign(data.treeData).write()

        resolve()

      }).catch((err) => {
        reject(err)
      })
    })



  }

  static getMetaData(bucketName, path) {
    const adapter = new FileSync(config.ROOT_FOLDER + '/meta/' + bucketName + path + 'meta.json')
    const db = low(adapter)
    const metas = db.get('meta').get('children').value()
    const result = {}
    if (metas) {
      metas.forEach((meta, index) => {
        result[meta.id] = meta
      })
    }

    return result
  }

  // Remove meta data for a File
  static removeMetaForFile(bucketName, path, fileName) {

    const adapter = new FileSync(config.ROOT_FOLDER + '/meta/' + bucketName + path + 'meta.json')
    const db = low(adapter)

    db.get('meta').get('children').remove({ id: fileName }).write()

  }

  // Update meta data for a File
  static updateMetaDataForFile(bucketName, path, fileName, metaData) {

    const adapter = new FileSync(config.ROOT_FOLDER + '/meta/' + bucketName + path + 'meta.json')
    const db = low(adapter)

    db.get('meta').get('children').find({ id: fileName }).assign({ meta: metaData }).write()

  }

  // Update visibility for Files
  static updateMetaVisibility(bucketName, path, fileName, isPublic) {

    const adapter = new FileSync(config.ROOT_FOLDER + '/meta/' + bucketName + path + 'meta.json')
    const db = low(adapter)

    db.get('meta').get('children').find({ id: fileName }).assign({ public: isPublic }).write()

  }

  // Update visibility for Files
  static updateFileSharing(bucketName, path, fileName, sharingExpiresOn) {

    const adapter = new FileSync(config.ROOT_FOLDER + '/meta/' + bucketName + path + 'meta.json')
    const db = low(adapter)

    db.get('meta').get('children').find({ id: fileName }).assign({ sharingExpiresOn: sharingExpiresOn }).write()

  }

  // Removing the meta data in case of renaming / deleting a folder
  static removeMetaForFolder(bucketName, path) {
    fs.unlink(config.ROOT_FOLDER + '/meta/' + bucketName + path)
  }

}