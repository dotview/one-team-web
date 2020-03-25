# create a file named Dockerfile
FROM node:8.9.3-alpine

RUN mkdir /app
WORKDIR /app

COPY . /app

RUN npm set chromedriver_cdnurl http://cdn.npm.taobao.org/dist/chromedriver
RUN npm set operadriver_cdnurl http://cdn.npm.taobao.org/dist/operadriver
RUN npm set phantomjs_cdnurl http://cdn.npm.taobao.org/dist/phantomjs
RUN npm set sass_binary_site http://cdn.npm.taobao.org/dist/node-sass
RUN npm set electron_mirror http://cdn.npm.taobao.org/dist/electron/
RUN npm config set registry http://registry.npm.taobao.org
RUN npm install


EXPOSE 3000

CMD ["npm", "start"]
