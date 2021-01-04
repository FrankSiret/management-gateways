# Api Documentation

- [Api Documentation](#api-documentation)
  * [Gateways](#gateways)
      - [GET `api/v1/gateways`](#get-apiv1gateways)
      - [POST `api/v1/gateways`](#post-apiv1gateways)
      - [GET `api/v1/gateways/:id`](#get-apiv1gatewaysid)
      - [POST `api/v1/gateways/:id/devices`](#post-apiv1gatewaysiddevices)
  * [Devices](#devices)
      - [GET `api/v1/devices`](#get-apiv1devices)
      - [DELETE `api/v1/devices/:id`](#delete-apiv1devicesid)
      
## Gateways

#### GET `api/v1/gateways`

_Get All Gateways_

-   Response: **200/JSON**

    ```json
    {
        "gateways": [
            {
                "_id": [ObjectId],
                "serial_number": [String],
                "readable_name": [String],
                "ipv4_address": [String],
                "devices": [
                    {
                        "_id": [ObjectId],
                        "uid": [Int32],
                        "vendor": [String],
                        "status": [String, "online"/"offline"],
                        "gatewayId": [ObjectId],
                        "date_created": [DateTime]
                    },
                    ...
                ]
            }
        ]
        ...
    }
    ```

#### POST `api/v1/gateways`

_Create A Gateway_

-   Headers:

    ```json
    { "Content-Type": "application/json" }
    ```

-   Body:

    ```json
    {
        "serial_number": [String, required],
        "readable_name": [String, required],
        "ipv4_address": [String, required],
        "devices": [
            {
                "uid": [Int32, required],
                "vendor": [String, required],
                "date_creator": [DateTime],
                "status": [String, "online"/"offline", required]
            },
            ...
        ]
    }
    ```

-   Response: **201/JSON**

    ```json
    {
        "success": true,
        "gateway": {
            "_id": [ObjectId],
            "serial_number": [String],
            "readable_name": [String],
            "ipv4_address": [String],
            "devices": [
                {
                    "_id": [ObjectId],
                    "uid": [Int32],
                    "vendor": [String],
                    "status": [String, "online"/"offline"],
                    "gatewayId": [ObjectId],
                    "date_created": [DateTime]
                },
                ...
            ]
        }
    }
    ```

#### GET `api/v1/gateways/:id`

_Get All Information For A Single Gateway_

-   Parameter:

    ```
    id: [ObjectId]
    ```

-   Response: **200/JSON**

    ```json
    {
        "gateway": {
            "_id": [ObjectId],
            "serial_number": [String],
            "readable_name": [String],
            "ipv4_address": [String],
            "devices": [
                {
                    "_id": [ObjectId],
                    "uid": [Int32],
                    "vendor": [String],
                    "status": [String, "online"/"offline"],
                    "gatewayId": [ObjectId],
                    "date_created": [DateTime]"
                },
                ...
            ]
        }
        ...
    }
    ```

#### POST `api/v1/gateways/:id/devices`

_Insert A Peripheral Device In A Specified Gateway_

-   Headers:

    ```json
    { "Content-Type": "application/json" }
    ```

-   Parameter:

    ```
    id: [ObjectId]
    ```

-   Body:

    ```json
    {
    	"uid": [Int32, required],
    	"vendor": [String, required],
    	"date_created": [DateTime],
    	"status": [String, "online" / "offline", required]
    }
    ```

-   Response: **201/JSON**

    ```json
    {
    	"success": true,
    	"device": {
    		"_id": [ObjectId],
    		"uid": [Int32],
    		"vendor": [String],
    		"status": [String, "online" / "offline"],
    		"date_created": [DateTime],
    		"gatewayId": [ObjectId],
    		"__v": 0
    	}
    }
    ```

## Devices

#### GET `api/v1/devices`

_Get All Peripheral Device_

-   Response: **200/JSON**

    ```json
    {
        "devices": [
            {
                "_id": [ObjectId],
                "uid": [Int32],
                "vendor": [String],
                "status": [String, "online" / "offline"],
                "date_created": [DateTime],
    		    "gatewayId": [ObjectId]
            },
            ...
        ]
    }
    ```

#### DELETE `api/v1/devices/:id`

_Delete A Peripheral Device_

-   Parameter:

    ```
    id: [ObjectId]
    ```

-   Response: **200/JSON**

    ```json
    {
    	"success": true,
    	"device": {
            "_id": [ObjectId],
            "uid": [Int32],
            "vendor": [String],
            "status": [String, "online" / "offline"],
            "date_created": [DateTime],
            "gatewayId": [ObjectId]
    		"__v": 0
    	},
    	"msg": "Peripheral device deleted successfully"
    }
    ```
