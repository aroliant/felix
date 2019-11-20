import dree, { scan as dreeScan } from 'dree'

const dreeOptions = {
  stat: false,
  hash: false,
  sizeInBytes: false,
  size: true,
  normalize: true
};

const dreeDirectoriesOptions = {
  stat: false,
  hash: false,
  sizeInBytes: false,
  size: true,
  normalize: true,
  extensions: []
}


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
    return dreeScan(path, dreeOptions)
  }

  static scanDirectories(path) {
    return dreeScan(path, dreeDirectoriesOptions)
  }

}