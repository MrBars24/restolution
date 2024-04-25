<!doctype html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Invoice</title>

    <link rel="stylesheet" href="{{ asset('pdf.css') }}" type="text/css"/>
</head>
<body>
    <h1>Sales Report</h1>
    <div class="margin-top">
        <table class="products">
            <tr>
                <th>Table #</th>
                <th>Restaurant</th>
                <th>Customer</th>
                <th>Payment Method</th>
                <th>Total Amount</th>
                <th>Discount Amount</th>
                <th>Special Discount</th>
                <th>Status</th>
                <th>Date Created</th>
            </tr>
            @foreach($data as $item)
                <tr class="items">
                    <td>
                        {{ $item->table_number }}
                    </td>
                    <td>
                        {{ $item->restaurant->name}}
                    </td>
                    <td>
                        {{ $item->customer_name}}
                    </td>
                    <td>
                        {{ $item->payment_method}}
                    </td>
                    <td>
                        {{ $item->total_amount}}
                    </td>
                    <td>
                        {{ $item->total_discount_amount }}
                    </td>
                    <td>
                        {{ $item->special_discount_amount }}
                    </td>
                    <td>
                        {{ $item->status }}
                    </td>
                    <td>
                        {{ $item->created_at }}
                    </td>
                </tr>
            @endforeach
        </table>
    </div>
</body>
</html>