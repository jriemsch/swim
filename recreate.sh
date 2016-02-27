#!/bin/bash
docker-compose stop
docker-compose build
docker-compose up -d
docker-compose logs
