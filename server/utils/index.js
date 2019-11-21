import dree, { scan as dreeScan } from 'dree'

export default class Utils {
  static recursiveTreeParsing(tree) {

    delete tree.path

    if (tree.children == undefined || tree.children == [])
      return 1;
    else {
      var itemsCount = 1
      tree.children.map((branch, index) => {
        itemsCount += Utils.recursiveTreeParsing(branch)
      })
      return itemsCount
    }
  }

  static scan(path) {
    const dreeOptions = {
      stat: false,
      hash: false,
      sizeInBytes: true,
      size: true,
      normalize: true
    };
    return dreeScan(path, dreeOptions)
  }

  static scanDirectories(path) {
    const dreeDirectoriesOptions = {
      stat: false,
      hash: false,
      sizeInBytes: false,
      size: true,
      normalize: true,
      extensions: []
    }
    return dreeScan(path, dreeDirectoriesOptions)
  }

  static scanAll(path) {
    const dreeOptions = {
      stat: false,
      hash: false,
      sizeInBytes: true,
      size: true,
      normalize: true,
      depth: 1,
    };
    return dreeScan(path, dreeOptions)
  }

}