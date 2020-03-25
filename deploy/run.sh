#! /usr/bin/env bash
ESCAPED_API_URL="${APIHOST}:${APIPORT}"
sed -i "s/APIURL/$ESCAPED_API_URL/g" /etc/nginx/conf.d/oneteamweb.conf

nginx -g "daemon off;"
