<?php

namespace App\Http\Controllers\Kitchen;

use App\Http\Controllers\Controller;
use App\Models\Order as ModelsOrder;
use App\Models\OrderTracker;
use Illuminate\Support\Carbon;

class Order extends Controller
{
    public function UpdateStatus($id) {
        $currentTime = Carbon::now()->format('H:i:s');

        $order = ModelsOrder::find($id);
        $order->status = 'In Process';
        $order->save(); 

        $order = OrderTracker::where('order_id', $id)->first();
        $order->time_process = $currentTime;
        $order->save(); 

        return response([
            'Success' => 'Order Status successfully updated'
        ], 200);
    }

    public function OrderDetails($id) {
        $orders = ModelsOrder::where('id', $id)->get();
        $orders = $orders->map(function ($order) {
            $order->menu = json_decode($order->menu, true);
            $order->date_created = $order->created_at->format('Y-m-d h:i:s A');
            $order->order_total = strval($order->total_amount - ($order->discount_amount + $order->special_discount_amount));
            unset($order->created_at);
            return $order;
        });
        return $orders;
    }

    public function getOrder ($id) {
        $orders = ModelsOrder::select('id','table_number', 'customer_name', 'menu', 'dine_in_out', 'created_at')
                ->where('restaurant_id', $id)
                ->where('status', 'New Order')
                ->orderBy('id')
                ->get();
                $orders = $orders->map(function ($order) {
                    $order->menu = json_decode($order->menu, true);
                    $order->date_created = $order->created_at->format('Y-m-d h:i:s A');
                    unset($order->created_at);
                    return $order;
                });
        return $orders;
    }
}
