# Stage 1: Build the React application
FROM node:20-alpine AS build

# Declare a build argument to receive the backend URL
ARG REACT_APP_BACKEND_URL
# Set it as an environment variable for the build process
# This ENV is crucial for the npm run build step
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

# set the working directory inside the container
WORKDIR /app

# copy package.json and package-lock.json into the container
COPY package*.json ./

# install project dependencies
RUN npm install

# copy the rest of the application code into the container
COPY . .

# Build the react application for production
# Pass the environment variable directly to the build command
# THIS IS THE MOST RELIABLE WAY TO ENSURE REACT SEES IT
RUN REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL npm run build # <--- MODIFIED THIS LINE!

# Stage 2 : Serve the React application with Nginx
FROM nginx:alpine

# copy the custom Nginx config file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# copy the build react static files from the 'build' stage (the first stage)
# into Nginx's default public web serving directory
COPY --from=build /app/build /usr/share/nginx/html

# expose port 80
EXPOSE 80

# command to run Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]
