docker-compose -f dev_backend.docker-compose.yml stop;
docker-compose -f dev_frontend.docker-compose.yml stop;
docker-compose -f dev_backend.docker-compose.yml down -v;
docker-compose -f dev_frontend.docker-compose.yml down -v;