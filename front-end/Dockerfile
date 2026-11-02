FROM nginx:bookworm

COPY front-end/index.html /usr/share/nginx/html/index.html
COPY front-end/style.css /usr/share/nginx/html/style.css
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
