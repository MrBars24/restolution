<!doctype html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Reservation Report</title>

    <link rel="stylesheet" href="{{ public_path('pdf.css') }}" type="text/css"/>
</head>
<body>
    <h1>Reservation Report</h1>
    <div class="margin-top">
        <table class="products">
            <tr>
                <th>Guest Name</th>
                <th>Table #</th>
                <th># of Guest</th>
                <th>Date</th>
                <th>Time</th>
                <th>Notes</th>
                <th>Date Created</th>
            </tr>
            @foreach($data as $item)
                <tr class="items">
                    <td>
                        {{ $item->guest_name }}
                    </td>
                    <td>
                        {{ $item->table_number}}
                    </td>
                    <td>
                        {{ $item->number_of_guest }}
                    </td>
                    <td>
                        {{ $item->date}}
                    </td>
                    <td>
                        {{ $item->time }}
                    </td>
                    <td>
                        {{ $item->notes }}
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