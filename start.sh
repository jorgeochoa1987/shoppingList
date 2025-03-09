
testvar =  "starting server"

echo $testvar

echo "Starting frontend..."
echo "Starting backend..."
cd frontend

try
    npm install
catch
    echo "Error: No se pudo instalar las dependencias de npm."
    rm -rf node_modules
    npm install
end

npm run dev &
echo "Starting backend..."
cd ../backend
./start.sh
cd ../
