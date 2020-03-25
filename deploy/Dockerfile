FROM nginx

COPY ./dist /oneteamweb
COPY ./deploy/run.sh /oneteamweb/run.sh
COPY ./deploy/nginx.conf /etc/nginx/nginx.conf
COPY ./deploy/oneteamweb.conf /etc/nginx/conf.d/oneteamweb.conf

RUN chmod -R 755 /oneteamweb && chmod +x /oneteamweb/run.sh

CMD ["/oneteamweb/run.sh"]
