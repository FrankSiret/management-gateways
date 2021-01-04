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

1.  Clone the project from GitHub

    ```bash
    git clone https://github.com/FrankSiret/management-gateways.git
    ```

2.  Add your `MONGODB_URI` to the `config.js` file.

3.  Move to the `root` folder and install all dependencies for both, server and client, with your favorite package manager

    ```bash
    # Install dependencies for server
    npm install

    # Install dependencies for client
    npm run client-install
    ```

4.  Run the server and client, both with only one command

    ```bash
    # Run the client & server with concurrently
    npm run dev
    ```

    or using two commands separactely

    ```bash
    # Run the Express server only
    npm run server

    # Run the React client only
    npm run client
    ```

    _The server should be runs on http://localhost:5000 and client on http://localhost:3000_

## Unit Test

For testing make sure that your `MONGODB_URI` in `test.js` file is correctly set. You can run unit test using the command:

```bash
npm test
```

## App Info

### Author

Frank Rodríguez Siret

-   Linkedin: [Frank Rodríguez Siret](https://www.linkedin.com/in/frank-siret)
-   Email: frank.siret@gmail.com

### Version

1.0.0
