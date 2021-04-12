# Synced-In
A job application portal to search, apply as well as post for jobs.

## Execution:

Step 1: Start MongoDb Server:
```
sudo mongod
```
This creates a databse named Synced-In.

Step 2: Start backend server:
```
cd backend 
npm install 
nodemon start
```
This starts the backend server.

Step 3: Start the frontend:
```
cd frontend
npm install
nodemon start
```

## Ports:
Backend: 4000  
Frontend: 3000  
Make sure that both the ports are available.

Note: For fuzzy search, the threshold score is set as 0.7
