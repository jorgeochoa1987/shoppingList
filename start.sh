
testvar =  "starting server"

echo $testvar

echo "Starting frontend..."
echo "Starting backend..."
cd frontend
npm run dev &
echo "Starting backend..."
cd ../backend

cd ../
