## Waiter

### Get all table status

**URL** : /api/table-status

**Method** : `GET`
## Success Responses
**Code** : `200 OK`

**Content example** :
```json
{
    "data": {
        "table_1": null,
        "table_2": {
            "id": 1,
            "restaurant_id": 1,
            "menu": "[{\"name\":\"Pepperoni\",\"price\":50,\"quantity\":2,\"notes\":null}]",
            "table_number": 2,
            "dine_in_out": "Dine-in",
            "payment_method": "Cash",
            "status": "In Process",
            "kitchen_status": "In Process",
            "total_amount": "100.00",
            "discount_amount": "0.00",
            "special_discount_amount": null,
            "vatable": "89.29",
            "vat": "10.71",
            "discount_id": null,
            "special_discount_id": null,
            "customer_name": "ge",
            "waiter": null,
            "cooked_by": null,
            "created_at": "2024-05-03T16:22:37.000000Z",
            "updated_at": "2024-05-03T16:37:22.000000Z",
            "maxId": 1
        },
        "table_3": null,
        "table_4": null,
        "table_5": null
    },
    "summary": {
        "available": 4,
        "occupied": 1
    }
}
```
<br>
<br>
<br>

### Get all table status

**URL** : /api/table-status/:tableNumber

**URL Parameters** :

`tableNumber=[string]` where `tableNumber` is the table number.

**Method** : `GET`
## Success Responses
**Code** : `200 OK`

**Content example** :
```json
{
    "data": {
        "id": 1,
        "restaurant_id": 1,
        "menu": "[{\"name\":\"Pepperoni\",\"price\":50,\"quantity\":2,\"notes\":null}]",
        "table_number": 2,
        "dine_in_out": "Dine-in",
        "payment_method": "Cash",
        "status": "In Process",
        "kitchen_status": "In Process",
        "total_amount": "100.00",
        "discount_amount": "0.00",
        "special_discount_amount": null,
        "vatable": "89.29",
        "vat": "10.71",
        "discount_id": null,
        "special_discount_id": null,
        "customer_name": "ge",
        "waiter": null,
        "cooked_by": null,
        "created_at": "2024-05-03T16:22:37.000000Z",
        "updated_at": "2024-05-03T16:37:22.000000Z"
    }
}
```
<br>
<br>
<br>

## Kitchen

### Get all order by status

**URL** : /api/kitchen/orders

**Query Parameters** :

`kitchen_status=[string]` where `kitchen_status` is the kitchen status values(New Order, In Process, Completed).

**Method** : `GET`
## Success Responses
**Code** : `200 OK`

**Content example** :
```json
{
    "data": [
        {
            "id": 1,
            "restaurant_id": 1,
            "menu": "[{\"name\":\"Pepperoni\",\"price\":50,\"quantity\":2,\"notes\":null}]",
            "table_number": 2,
            "dine_in_out": "Dine-in",
            "payment_method": "Cash",
            "status": "In Process",
            "kitchen_status": "In Process",
            "total_amount": "100.00",
            "discount_amount": "0.00",
            "special_discount_amount": null,
            "vatable": "89.29",
            "vat": "10.71",
            "discount_id": null,
            "special_discount_id": null,
            "customer_name": "ge",
            "waiter": null,
            "cooked_by": null,
            "created_at": "2024-05-03T16:22:37.000000Z",
            "updated_at": "2024-05-03T16:37:22.000000Z"
        }
    ]
}
```
<br>
<br>
<br>

### Update Order Status

**URL** : /api/kitchen/order/:orderId

**URL Parameters** :

`orderId=[string]` where `orderId` is the id of the order.

**Method** : `PUT`
## Success Responses
**Code** : `200 OK`

**Content example** :
```json
{
    "data": {
        "id": 1,
        "restaurant_id": 1,
        "menu": "[{\"name\":\"Pepperoni\",\"price\":50,\"quantity\":2,\"notes\":null}]",
        "table_number": 2,
        "dine_in_out": "Dine-in",
        "payment_method": "Cash",
        "status": "In Process",
        "kitchen_status": "In Process",
        "total_amount": "100.00",
        "discount_amount": "0.00",
        "special_discount_amount": null,
        "vatable": "89.29",
        "vat": "10.71",
        "discount_id": null,
        "special_discount_id": null,
        "customer_name": "ge",
        "waiter": null,
        "cooked_by": null,
        "created_at": "2024-05-03T16:22:37.000000Z",
        "updated_at": "2024-05-03T16:37:22.000000Z"
    }
}
```
<br>
<br>
<br>