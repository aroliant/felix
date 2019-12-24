import acme from 'acme-client';
import fs from 'fs-extra';
import { exec } from 'child_process';

import config from '../config';

export class SSLController {

  static SSLTokenStore = {}
  static isCreated = false

  constructor() {
    if (!SSLController.isCreated) {
      SSLController.isCreated = true
      this.initializeSSLConfig()
    }
  }

  initializeSSLConfig() {
    // Load Cert
    // Generate NGINX Config
    // Reload NGINX

    const sslFolder = config.ROOT_FOLDER + "/ssl/"

    fs.readdir(sslFolder, (err, directories) => {
      if (err) return
      directories.forEach((dir, index) => {
        const stat = fs.lstatSync(sslFolder + '/' + dir)
        if (stat.isDirectory()) {
          const template = this.generateNGINXTemplate(dir)
          fs.ensureDirSync("/etc/nginx/conf.d")
          fs.writeFileSync("/etc/nginx/conf.d/" + dir + ".conf", template)
        }
      })
    })
    console.log(`Reloading NGINX`)
    this.reloadNGINX()
  }

  issueCertficate(domain, email) {

    return new Promise(async (resolve, reject) => {

      if (process.env.NODE_ENV === 'development') {
        resolve()
      }

      try {

        const client = new acme.Client({
          directoryUrl: acme.directory.letsencrypt.production,
          accountKey: await acme.forge.createPrivateKey()
        });

        const [key, csr] = await acme.forge.createCsr({
          commonName: domain
        });

        const cert = await client.auto({
          csr,
          email: email,
          termsOfServiceAgreed: true,
          challengeCreateFn: this.onChallengeCreate,
          challengeRemoveFn: this.onChallengeRemove,
        })

        const domainFolder = config.ROOT_FOLDER + "/ssl/" + domain

        fs.ensureDirSync(domainFolder)

        fs.writeFileSync(domainFolder + '/csr.txt', csr.toString())
        fs.writeFileSync(domainFolder + '/private.key', key.toString())
        fs.writeFileSync(domainFolder + '/cert.pem', cert.toString())

        // console.log(`CSR:\n${csr.toString()}`);
        // console.log(`Private key:\n${key.toString()}`);
        // console.log(`Certificate:\n${cert.toString()}`);

        this.initializeSSLConfig()

        return resolve()

      } catch (err) {

        return reject(err)

      }

    })

  }

  async onChallengeCreate(authz, challenge, keyAuthorization) {
    console.log('Triggered challengeCreate');

    /* http-01 */
    if (challenge.type === 'http-01') {
      const filePath = `/var/www/html/.well-known/acme-challenge/${challenge.token}`;

      SSLController.SSLTokenStore[challenge.token] = keyAuthorization

      console.log(`Creating challenge response for ${authz.identifier.value} at path: ${filePath}`);
    }

  }

  async onChallengeRemove(authz, challenge, keyAuthorization) {
    console.log('Triggered challengeRemoveFn()');

    /* http-01 */
    if (challenge.type === 'http-01') {
      const filePath = `/var/www/html/.well-known/acme-challenge/${challenge.token}`;

      console.log(`Challenge Token: ${challenge.token}`)
      console.log(`Removing challenge response for ${authz.identifier.value}`);

      /* Replace this */
      console.log(`Would remove file on path "${filePath}"`);
    }

  }

  static handleDomainChallenge(req, res) {
    const token = req.params.token
    const response = SSLController.SSLTokenStore[token]
    if (!response) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      return res.end("404 Not Found")
    }
    return res.send(response)
  }

  generateNGINXTemplate(domain) {

    const NGINX_TEMPLATE = `#

server {
      server_name ${domain};
      listen       443 ssl;
      ssl_certificate     ${config.ROOT_FOLDER}/ssl/${domain}/cert.pem;
      ssl_certificate_key ${config.ROOT_FOLDER}/ssl/${domain}/private.key;
  
      location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
      }
  }`

    return NGINX_TEMPLATE

  }

  reloadNGINX() {
    exec('nginx -s reload', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log('NGINX Reloaded')
    });
  }

}