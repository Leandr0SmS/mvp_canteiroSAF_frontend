# Use the official Nginx image as the base image
FROM nginx:alpine

# Remove the default Nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy static assets 
COPY . /usr/share/nginx/html

# Expose port 80 (default port for HTTP)
EXPOSE 80

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]