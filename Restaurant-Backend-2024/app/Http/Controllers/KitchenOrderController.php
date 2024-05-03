<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\UserManager;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class KitchenOrderController extends Controller
{
    public function getList(Request $request)
    {
        // Order::where()
        $manager = UserManager::where('user_id', Auth::user()->id)->first();
        $restaurant = $manager->restaurant;

        $query = Order::where('restaurant_id', $restaurant->id);

        if ($request->exists('kitchen_status')) {
            $query->where('kitchen_status', $request->kitchen_status);
        }

        $data = $query->get();

        return response()->json([
            'data' => $data
        ]);
    }

    public function update(Request $request, Order $order)
    {
        if ($request->kitchen_status === "In Process") {
            $order->status = 'In Process';
        }

        $order->kitchen_status = $request->kitchen_status;

        $order->save();

        return response()->json([
            'data' => $order
        ]);
    }
}
