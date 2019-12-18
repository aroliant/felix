
import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
// Relative Imports
import config from '../config'

const bucketsAdapter = new FileSync(config.ROOT_FOLDER + '/buckets.json')
const bucketsDB = low(bucketsAdapter)


bucketsDB.defaults({ "buckets": [] }).write()

export class DomainController {

  static DOMAIN_REGISTRY = {}

  static loadDomains() {

    // Load default wildcard domains
    console.log('Loading wildcard domains')
    const buckets = bucketsDB.get('buckets').value()
    buckets.forEach((bucket, index) => {
      const details = {
        bucket: bucket.bucketName,
        domain: `${bucket.bucketName}.${config.PRIMARY_DOMAIN}`,
      }
      DomainController.DOMAIN_REGISTRY[details.domain] = details

      // Load domains from <bucket>.settings.json
      console.log('Loading domains from bucket settings')
      const adapter = new FileSync(`${config.ROOT_FOLDER}/${details.bucket}.bucket.json`)
      const db = low(adapter)

      const domains = db.get('bucket').get('domains').value()

      domains.forEach((domain, index) => {
        const details = {
          bucket: bucket.bucketName,
          domain: domain.name,
        }
        DomainController.DOMAIN_REGISTRY[details.domain] = details
      })

    })

    console.log(DomainController.DOMAIN_REGISTRY)

  }

  static removeDomain(domain) {
    return DomainController.DOMAIN_REGISTRY[domain] = undefined
  }

  static addDomain(details) {
    return DomainController.DOMAIN_REGISTRY[details.domain] = details
  }

  static updateDomain(details) {
    return DomainController.DOMAIN_REGISTRY[details.domain] = details
  }

  static resolveDomainBucket(domain) {
    return DomainController.DOMAIN_REGISTRY[domain]
  }

}