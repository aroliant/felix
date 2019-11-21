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

    MetaManager.ensureMetaFile(data.bucketName, data.path).then((result) => {

      const adapter = new FileSync(config.ROOT_FOLDER + '/meta/' + data.bucketName + data.path + 'meta.json')
      const db = low(adapter)

      db.defaults({ "meta": {} }).write()

      // TODO: Read old data to copy and update for public, sharingExpiresOn & meta

      data.treeData.children.forEach((_, i) => {
        data.treeData.children[i].public = false
        data.treeData.children[i].sharingExpiresOn = ''
        data.treeData.children[i].meta = {}
      })

      db.get('meta').assign(data.treeData).write()

    }).catch((err) => {
      console.log(err)
    })

  }

  // Remove meta data for a File
  static removeMetaForFile(path, fileName) {

  }

  // Update meta data for a File
  static updateMetaDataForFile(path, fileName, metaData) {

  }

  // Update visibility for Files
  static updateMetaVisibility(path, fileName, visibility) {

  }

  // Removing the meta data in case of renaming / deleting a folder
  static removeMetaForFolder(path) {

  }

}