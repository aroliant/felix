## Contributing to this project


## Prerequisites
1. Docker
2. Docker Compose

## Development on Remote Machine

### Local Machine

1. Install 
`npm install sshync -g`

2. Configure ssh keys on the server
3. `sshync ./ root@127.0.0.1:/home/` 

Here `127.0.0.1` is the server IP.

This command create `felix` folder in `/home` and will sync the changes from local to the remote server.

### Remote Machine
1. `yarn install`
2. `docker-compose up`

Now you can access the dashboard at remote server IP.
<hr/>

## Development on Local Machine
1. `yarn install`
2. `docker-compose up`

Now you can access the dashboard at `localhost`
