# Felix

File Manager that runs on Docker with better UI/UX

## Features

* Create Buckets and organize files
* Permissions - ( Public / Private)
* Loadbalancer with NGINX
* Host Static Sites
* SSL with Letsencrypt

## Install

1. Create a file `docker-compose.yml` with the following contents
```
version: "3"
services:
  app:
    image: aroliant/felix:latest
    restart: always
    ports:
      - 80:80
      - 3000:3000
      - 443:443
    environment:
      - NODE_ENV=production
    volumes:
      - ./data:/data

```
2. Run the App 

```
docker-compose up 
```

Note : Use `docker-compose up -d` to run in detached mode

## Features Planned

* [ ] Backup to S3/GCP or FTP
* [ ] File Listing
* [ ] API Support
* [ ] Connect and browse via FTP, Amazon S3 ( Ignoring GCP as it has better UI )

## Future

* [ ] Scalable
