FROM node:14
RUN curl -sSL https://rover.apollo.dev/nix/latest | sh
WORKDIR /usr/app
COPY package.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile --ignore-scripts
COPY . .
CMD node index.js