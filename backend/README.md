### Pasos para desplegar el backend 

1. Abra docker
2. Elimine los containers que existan de postgres
3. Abrir una termina y escribir el comando 
```Docker
docker run --name my_postgres -e POSTGRES_USER=podcast -e POSTGRES_PASSWORD=podcast -e POSTGRES_DB=podcast -p 5432:5432 -d postgres
````
4. Validar que está en la carpeta backend 
5. Migrar la base de datos
```php
php artisan migrate
```

6. Abrir el servidor
```php
php artisan serve
```
