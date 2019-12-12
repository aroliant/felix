# Felix

File Manager that runs on Docker with better UI/UX

## Features

* Create Buckets and organize files
* Users
* Permissions - ( Public / Private)
* Loadbalancer with NGINX

## Install

1. Clone this Repo
2. Build the App 
```
docker-compose build
```
3. Run the App 
```
docker-compose up
```

Note : Use `docker-compose up -d` to run in detached mode

## Features Planned

* [ ] Backup to S3/GCP or FTP
* [ ] Host Static Sites
* [ ] SSL with letsencrypt
* [ ] Connect and browse via FTP, Amazon S3 ( Ignoring GCP as it has better UI )

## Future

* [ ] Scalable
