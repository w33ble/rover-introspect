FROM node:14
RUN curl -sSL https://rover.apollo.dev/nix/latest | sh
COPY dist /dist
CMD ["node", "dist/index.js"]