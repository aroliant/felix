#!/bin/sh
VERSION=0.0.1-alpha.0
docker build . -t aroliant/felix:$VERSION
docker tag aroliant/felix:$VERSION docker.pkg.github.com/aroliant/felix/felix:$VERSION
docker push docker.pkg.github.com/aroliant/felix/felix:$VERSION
