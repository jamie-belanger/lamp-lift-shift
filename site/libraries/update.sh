#!/bin/bash

if [ -f "./composer.lock" ]; then
    rm composer.lock
fi

docker run --rm --interactive --tty --volume ./:/app --user $(id -u):$(id -g) composer/composer install
