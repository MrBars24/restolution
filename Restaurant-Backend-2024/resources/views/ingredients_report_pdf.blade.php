<!doctype html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Ingredients Report</title>

    <link rel="stylesheet" href="{{ public_path('pdf.css') }}" type="text/css"/>
</head>
<body>
    <h1>Ingredients Report</h1>
    <span>{{ $date_range }}</span>
    <div class="margin-top">
        <table class="products">
            <tr>
                <th>Name</th>
                <th>Unit</th>
                <th>Quantity</th>
                <th>Cost</th>
                <th>Date Created</th>
            </tr>
            @foreach($data as $item)
                <tr class="items">
                    <td>
                        {{ $item->name }}
                    </td>
                    <td>
                        {{ $item->unit}}
                    </td>
                    <td>
                        {{ $item->quantity}}
                    </td>
                    <td>
                        {{ $item->unit_cost }}
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