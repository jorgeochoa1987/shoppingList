#!/bin/bash

# 1. Abre Docker (asumimos que Docker Desktop está instalado y en ejecución)
open -a Docker

# 2. Elimina los contenedores de PostgreSQL existentes
docker ps -a | grep postgres | awk '{print $1}' | xargs -r docker stop 2>/dev/null
docker ps -a | grep postgres | awk '{print $1}' | xargs -r docker rm 2>/dev/null
docker image ls | grep postgres | awk '{print $1}' | xargs -r docker rmi 2>/dev/null

# 3. Ejecuta el contenedor de PostgreSQL y espera a que esté listo
docker run --name my_postgres -e POSTGRES_USER=podcast -e POSTGRES_PASSWORD=podcast -e POSTGRES_DB=podcast -p 5432:5432 -d postgres

# Espera a que PostgreSQL esté listo
while ! docker exec my_postgres pg_isready -U podcast -d podcast > /dev/null 2>&1; do
  echo "Esperando a que PostgreSQL esté listo..."
  sleep 5
done

echo "PostgreSQL está listo."

# 4. Verifica que estás en la carpeta backend
if [[ $PWD != *"backend"* ]]; then
  echo "Error: No estás en la carpeta 'backend'."
  exit 1
fi

# 5. Migra la base de datos
php artisan migrate

# 6. Inicia el servidor
php artisan serve