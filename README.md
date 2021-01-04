# Gateways managing

A sample project to managing gateways - master devices that control multiple peripheral devices.

Each gateway has:

-   a unique serial number (string),
-   human-readable name (string),
-   IPv4 address (to be validated),
-   multiple associated peripheral devices.

Each peripheral device has:

-   a UID (number),
-   vendor (string),
-   date created,
-   status - online/offline.

## Quick Start

Add your MONGODB_URI to the config.js file.

```bash
# Install dependencies for server
npm install

# Install dependencies for client
npm run client-install

# Run the client & server with concurrently
npm run dev

# Run the Express server only
npm run server

# Run the React client only
npm run client

# Server runs on http://localhost:5000 and client on http://localhost:3000
```

## Unit Test

The server should be listening at [http://localhost:5000](http://localhost:5000) for run unit test use the command:

```bash
npm run test
```

## App Info

### Author

Frank Rodríguez Siret

-   Linkedin: [Frank Rodríguez Siret](https://www.linkedin.com/in/frank-siret)
-   Email: frank.siret@gmail.com

### Version

1.0.0
