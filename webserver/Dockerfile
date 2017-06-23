FROM nginx:1.13.1-alpine

COPY gcontax.conf /etc/nginx/conf.d
RUN rm /etc/nginx/conf.d/default.conf

WORKDIR /etc/nginx
