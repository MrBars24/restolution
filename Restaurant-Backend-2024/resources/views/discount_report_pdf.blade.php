<!doctype html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Discount Report</title>

    <link rel="stylesheet" href="{{ public_path('pdf.css') }}" type="text/css"/>
</head>
<body>
    <h1>Discounts Report</h1>
    <div class="margin-top">
        <table class="products">
            <tr>
                <th>Voucher Code</th>
                <th>Category</th>
                <th>Date Range</th>
                <th>Created By</th>
                <th>Updated By</th>
                <th>Date Created</th>
                <th>Date Updated</th>
            </tr>
            @foreach($data as $item)
                <tr class="items">
                    <td>
                        {{ $item->voucher_code }}
                    </td>
                    <td>
                        {{ $item->category}}
                    </td>
                    <td>
                        {{ $item->datefrom . " - " . $item->dateto }}
                    </td>
                    <td>
                        {{ $item->createdBy}}
                    </td>
                    <td>
                        {{ $item->updatedBy }}
                    </td>
                    <td>
                        {{ $item->created_at }}
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