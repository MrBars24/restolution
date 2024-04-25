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
    <h1>Inventory Report</h1>
    <div class="margin-top">
        <table class="products">
            <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Unit Cost</th>
                <th>Total Cost</th>
                <th>Date Created</th>
                <th>Updated By</th>
                <th>Date Updated</th>
            </tr>
            @foreach($data as $item)
                <tr class="items">
                    <td>
                        {{ $item->name }}
                    </td>
                    <td>
                        {{ $item->quantity}}
                    </td>
                    <td>
                        {{ $item->unit }}
                    </td>
                    <td>
                        {{ $item->unit_cost }}
                    </td>
                    <td>
                        {{ $item->total_cost}}
                    </td>
                    <td>
                        {{ $item->created_at }}
                    </td>
                    <td>
                        {{ $item->updated_by }}
                    </td>
                    <td>
                        {{ $item->updated_at }}
                    </td>
                </tr>
            @endforeach
        </table>
    </div>
</body>
</html>