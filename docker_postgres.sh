# !/bin/sh
sudo docker stop postgres
sudo docker rm postgres
sudo docker run --name postgres -v pgdata:/var/lib/postgresql/data -e PGDATA=/var/lib/postgresql/data/pgdata -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=sih_hack -p 5432:5432 -d postgres