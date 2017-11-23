FROM node:8-alpine as builder

# create app directory
WORKDIR /build
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm install

FROM node:8-alpine

WORKDIR /app
# add code
COPY --from=builder /build/node_modules/ /app/node_modules/
COPY . .

CMD ["node" , "./cli.js"]
