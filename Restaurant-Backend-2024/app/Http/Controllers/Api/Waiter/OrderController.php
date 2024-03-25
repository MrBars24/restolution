<?php

namespace App\Http\Controllers\Api\Waiter;

use App\Http\Controllers\Controller;
use App\Models\Order as ModelsOrder;
use App\Models\OrderTracker;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class OrderController extends Controller
{
    public function OrderStatus($id) {
        $orders = ModelsOrder::where('restaurant_id', $id)
                ->where('status', '<>', 'Completed')
                ->get();
        $orders = $orders->map(function ($order) {
            $order->menu = json_decode($order->menu, true);
            $order->date_created = $order->created_at->format('Y-m-d h:i:s A');
            $order->order_total = strval($order->total_amount - ($order->discount_amount + $order->special_discount_amount));
            unset($order->created_at);
            return $order;
        });
        return $orders;
    }

    public function StatusServed($id) {
        $currentTime = Carbon::now()->format('H:i:s');

        $order = ModelsOrder::find($id);
        $order->status = 'Served';
        $order->save(); 

        $order = OrderTracker::where('order_id', $id)->first();
        $order->time_served = $currentTime;
        $order->save(); 

        return response([
            'Success' => 'Order Status successfully updated'
        ], 200);
    }
}
