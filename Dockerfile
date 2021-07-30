FROM node:14
RUN curl -sSL https://rover.apollo.dev/nix/latest | sh
WORKDIR /usr/src/app
COPY ["package.json", "yarn.lock", "./"]
RUN yarn install --frozen-lockfile --ignore-scripts
COPY . .
CMD ["yarn", "start"]