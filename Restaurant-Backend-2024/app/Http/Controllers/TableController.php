<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TableController extends Controller
{
    public function getTablesStatus(Request $request, Restaurant $restaurant)
    {
        $tables = Order::join(
               DB::raw('(SELECT table_number, MAX(id) maxId FROM orders GROUP BY table_number) latest_row'),
               function ($join) {
                $join->on('latest_row.maxId', '=', 'orders.id');
               }
            )
            ->where('restaurant_id', $restaurant->id)->get();

        $response = [];
        $summary = ['available' => 0, 'occupied' => 0];
        for ($i = 1; $i <= $restaurant->table_number; $i++) {
            $tmpData = $this->getData($tables, $i);

            if (empty($tmpData)) {
                $summary['available'] = $summary['available'] + 1;
            } else {
                $summary['occupied'] = $summary['occupied'] + 1;
            }

            $response['table_' . $i] = $tmpData;
        }

        return response()->json([
            'data' => $response,
            'summary' => $summary
        ]);
    }

    public function getTableStatus(Request $request, Restaurant $restaurant, $tableNumber)
    {
        $table = Order::select(['orders.*'])
            ->join(
                DB::raw('(SELECT table_number, MAX(id) maxId FROM orders GROUP BY table_number) latest_row'),
                function ($join) {
                    $join->on('latest_row.maxId', '=', 'orders.id');
                }
            )
            ->where('orders.table_number', $tableNumber)
            ->where('orders.restaurant_id', $restaurant->id)
            ->first();

         return response()->json([
            'data' => $table
        ]);
    }

    private function getData($data, $number)
    {
        foreach ($data as $row) {
            if ($number == $row->table_number) {
                return $row;
            }
        }

        return null;
    }
}
