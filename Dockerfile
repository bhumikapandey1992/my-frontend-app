# Stage 1 : Build react app
FROM node:20-alpine AS build

# set the working directory inside the container
WORKDIR /app

# copy package.json and package-lock.json into the container
COPY package*.json ./

# install project dependencies
# this command reads package.json and install all required node.js packages
RUN npm install

# copy the rest of the application code into the container
COPY . .

# Build the react application for production
RUN npm run build

# Stage 2 : Serve the React application with Nginx
FROM nginx:alpine

# copy the custom Nginx config file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# copy the build react static files from the 'build' stage (the first stage) 
# into Nginx's default public web serving directory
COPY --from=build /app/build/ /usr/share/nginx/html

# expose port 80
EXPOSE 80

# command to run Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]