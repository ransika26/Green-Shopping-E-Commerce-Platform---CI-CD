1)Npm install these things before running test

  npm install --save-dev vitest
  npm install --save-dev supertest
  npm install express
  npm install body-parser
  npm install dotenv
  npm install mongoose
  npm install multer
  npm install mongodb --save-dev


2)add this to server.js

              f (process.env.NODE_ENV !== "test") {
              const port = process.env.PORT || 3000;
              server.listen(port, () => {
                console.log(`Server Started on http://localhost:${port}`);
              });
            }

          /*// Start the server
          server.listen(port, () => {
              console.log(`Server Started on http://localhost:${port}`);
          });*/

          export { io };

          export default app;

3) add this to you .env file
      # MongoDB Atlas connection string
    MONGO_URI=mongodb+srv://kavishka:kavishka2003@cluster0.wnk0i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
    # Set environment to test
    NODE_ENV=test

4) update package.json with (add test to script)
      "scripts": {
        "test": "vitest run tests/customRunner.test.js",
        "server": "nodemon server.js"
      },

5) install globally - npm install -g artillery 
  add load-test.yaml to Back-end folder
  run command - artillery run load-test.yaml 
   
5) open terminal for Back-end and type  -  "npm run test"