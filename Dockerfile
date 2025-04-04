FROM nginx:alpine

# Remove the default Nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy static assets
COPY . /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (default for HTTP)
EXPOSE 80

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]