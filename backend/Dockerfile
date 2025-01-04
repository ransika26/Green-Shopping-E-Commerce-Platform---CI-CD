FROM node:20
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --omit=dev  # Only install production dependencies

# Copy the rest of the app
COPY . .

# Expose the port and run the app
EXPOSE 3000
CMD ["node", "index.js"]
