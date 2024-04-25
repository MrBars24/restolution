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
    <h1>Menu Report</h1>
    <div class="margin-top">
        <table class="products">
            <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Ingredients</th>
                <th>Price</th>
                <th>Preparation Time</th>
                <th>Status</th>
                <th>Date Created</th>
            </tr>
            @foreach($data as $item)
                <tr class="items">
                    <td>
                        {{ $item->name }}
                    </td>
                    <td>
                        {{ $item->name}}
                    </td>
                    <td>
                        {{ $item->ingredients}}
                    </td>
                    <td>
                        {{ $item->price}}
                    </td>
                    <td>
                        {{ $item->preparation_time}}
                    </td>
                    <td>
                        {{ $item->status}}
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