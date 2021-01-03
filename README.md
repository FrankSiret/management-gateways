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
