<!doctype html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>User Report</title>

    <link rel="stylesheet" href="{{ public_path('pdf.css') }}" type="text/css"/>
</head>
<body>
    <h1>Users Report</h1>
    <div class="margin-top">
        <table class="products">
            <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Date Created</th>
            </tr>

            @foreach($data as $item)
                @php
                    switch ($item->role_id) {
                        case 1:
                        $role = 'Super Admin';
                        break;
                        case 2:
                        $role = 'Corporate Manager';
                        break;
                        case 3:
                        $role = 'Branch Manager';
                        break;
                        case 4:
                        $role = 'Kitchen';
                        break;
                        case 5:
                        $role = 'Cashier';
                        break;
                        case 6:
                        $role = 'Waiter';
                        break;
                    }
                @endphp

                <tr class="items">
                    <td>
                        {{ $item->first_name . " " . $item->last_name }}
                    </td>
                    <td>
                        {{ $item->email}}
                    </td>
                    <td>
                        {{ $role }}
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