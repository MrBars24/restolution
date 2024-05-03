<?php

namespace App\Http\Controllers\Api\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\StoreOrderRequest;
use App\Http\Requests\Web\UpdateOrderRequest;
use App\Http\Resources\Web\OrderResource;
use App\Models\Order;
use App\Models\OrderTracker;
use App\Models\Promo;
use App\Models\Restaurant;
use App\Models\SpecialDiscount;
use App\Models\UsePromo;
use App\Models\User;
use App\Models\UserManager;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;

class OrderController extends Controller
{
    public function OrderComplete(Request $request) {
        $currentTime = Carbon::now()->format('H:i:s');

        $order = Order::find($request->id);
        $order->payment_method = $request->payment_method;
        $order->customer_name = $request->customer_name;
        $order->status = 'Completed';
        $order->save();

        $tracker = OrderTracker::where('order_id', $request->id)->first();
        $tracker->time_completed = $request->currentTime;
        $tracker->save();
    }

    public function waiter($id)
    {
        $user = User::where('id', $id)->first();
        $role_id = $user['role_id'];

        if ($role_id == 1) {
            $waiter = User::select('id', DB::raw("CONCAT(first_name, ' ', last_name) as fullname"))->where('role_id', 6)->get();
            return response([
                'data' => $waiter
            ], 200);
        } else if ($role_id == 2) {
            $waiter = User::join('restaurants', 'restaurants.corporate_account', 'users.id')
                    ->join('user_managers', 'user_managers.restaurant_id', 'restaurants.id')
                    ->select('id', DB::raw("CONCAT(first_name, ' ', last_name) as fullname"))
                    ->where('role_id', 6)
                    ->get();
            return response([
                'data' => $waiter
            ], 200);
        }
    }

    public function special(Request $request)
    {
        $voucher = $request->voucher_code;
        $sub_total = $request->total_amount;

        if ($voucher) {
            $discount_amount = $request->discount_amount;
            $voucher_total = $sub_total - $discount_amount;
            $totalDiscountedAmount = (20 / 100) * $voucher_total;
            $total = $voucher_total - $totalDiscountedAmount;

        } else {
            $totalDiscountedAmount = (20 / 100) * $sub_total;
            $total = $sub_total - $totalDiscountedAmount;
        }

        $VATable = ($total / 112 * 100);
        $VAT = $total - $VATable;

        $data = [
            'restaurant_id' => $request->restaurant_id,
            'order_id' => $request->id,
            'details' => $request->special,
        ];

        $special = SpecialDiscount::create($data);

        $order = Order::find($request->id);
        $order->special_discount_id = $special->id;
        $order->special_discount_amount = $totalDiscountedAmount;
        $order->vatable = $VATable;
        $order->vat = $VAT;
        $order->discount_amount = $request->discount_amount ?? 0;
        $order->save();

        return response([
            'data' => $order,
        ], 200);
    }
    /**
     * Cashier applying voucher
     */
    public function voucher($id, Request $request) {
        $voucher = Promo::where('restaurant_id', $request->restaurant_id)
                    ->whereRaw('BINARY voucher_code = ?', [$request->voucher])
                    ->first();

        if ($voucher) {
            $limit = UsePromo::where('promo_id', $voucher->id)
                    ->where('restaurant_id', $voucher->restaurant_id)->first();

            if ($limit && $voucher->limit === 'SINGLE') {
                return response([
                    'error' => 'Voucher Code limit has been reached'
                ], 422);
            }

            $discount_type = $voucher->discount_type;
            $amount_discount = $voucher->discount_amount;
            $category = $voucher->category;
            $sub_total = $request->total_amount;
            $totalDiscountedAmount = 0;
            $requestMenu = $request->menu;
            $voucherMenu = $voucher->menu;


            if ($category === 'SELECTED') {
            // Convert menu data to arrays if needed
                if (is_string($requestMenu)) {
                    $requestMenu = json_decode($requestMenu, true);
                }

                if (is_string($voucherMenu)) {
                    $voucherMenu = json_decode($voucherMenu, true);
                }

                $voucherMenuNames = array_column($voucherMenu, 'name');
                $foundInRequest = false;

                foreach ($voucherMenuNames as $voucherMenuName) {
                    if (in_array($voucherMenuName, array_column($requestMenu, 'name'))) {
                        $foundInRequest = true;
                        break;
                    }
                }

                if ($foundInRequest) {
                    if ($category === 'SELECTED') {
                        foreach ($requestMenu as &$menuItem) {
                            foreach ($voucherMenu as $voucherMenuItem) {
                                if ($menuItem['name'] === $voucherMenuItem['name']) {
                                    if ($discount_type === 'PERCENTAGE') {
                                        $discountedPrice = ($amount_discount / 100) * ($menuItem['price'] * $menuItem['quantity']);
                                        $menuItem['price'] = $discountedPrice;
                                        $totalDiscountedAmount += $discountedPrice;


                                    } else if ($discount_type === 'AMOUNT') {
                                        $discountedPrice = ($menuItem['price'] * $menuItem['quantity']) - $amount_discount;
                                        $menuItem['price'] = $discountedPrice;
                                        $totalDiscountedAmount += $discountedPrice;
                                    }
                                }
                            }
                        }
                    }
                }

            } else {
                if ($discount_type === 'PERCENTAGE') {
                    $discountedPrice = ($amount_discount / 100) * $request->total_amount;
                    $totalDiscountedAmount += $discountedPrice;
                } else if ($discount_type === 'AMOUNT') {
                    $totalDiscountedAmount = $amount_discount;
                }
            }

            $total = $sub_total - $totalDiscountedAmount;
            $VATable = ($total / 112 * 100);
            $VAT = $total - $VATable;

            $data = [
                'restaurant_id' => $voucher->restaurant_id,
                'promo_id' => $voucher->id,
            ];

            $promo = UsePromo::create($data);

            $order = Order::find($request->id);
            $order->discount_id = $promo->id;
            $order->discount_amount = $totalDiscountedAmount;
            $order->vatable = $VATable;
            $order->vat = $VAT;
            $order->save();

            return response([
                'data' => $order,
            ], 200);
        } else {
            return response([
                'error' => 'Invalid Voucher Code'
            ], 422);
        }
    }
    /**
     * Display a listing of the resource.
     */
    public function cashier($id)
    {
        $user = User::where('id', $id)->first();
        $role_id = $user['role_id'];
        $restaurant = null;
        if ($role_id == 1) {
            // $restaurant = Restaurant::get();
        } else if ($role_id == 2) {
            $restaurant = Restaurant::where('corporate_account', $id)->first();

        } else if ($role_id == 3 || $role_id == 5) {
            $item = UserManager::with(['restaurant'])->where("user_id", $id)->first();
            $restaurant = $item->restaurant;
        } else {

        }

        $tableData = [];

        if ($restaurant) {
            $totalTableNumber = $restaurant->table_number;
            $restaurant_id = $restaurant->id;

            // Loop through each table number and retrieve the corresponding order data
            for ($tableNumber = 1; $tableNumber <= $totalTableNumber; $tableNumber++) {
                $order = Order::join('order_trackers', 'order_trackers.order_id', 'orders.id')
                    ->leftjoin('use_promos', 'use_promos.id' , 'orders.discount_id')
                    ->leftjoin('promos', 'promos.id' , 'use_promos.promo_id')
                    ->leftjoin('special_discounts', 'special_discounts.id' , 'orders.special_discount_id')
                    ->select('orders.*', 'promos.voucher_code', 'special_discounts.details', 'order_trackers.time_created', 'order_trackers.time_process', 'order_trackers.time_served', 'order_trackers.time_completed')
                    ->where('orders.restaurant_id', $restaurant_id)
                    ->where('table_number', $tableNumber)
                    ->where('status', '<>','Completed')
                    ->first();

                // Convert the 'menu' column to a JSON-decoded array
                $menuArray = $order ? json_decode($order->menu, true) : []; // Set to an empty array if there's no menu
                $waiterArray = $order ? json_decode($order->waiter, true) : []; // Set to an empty array if there's no menu

                $menusString = implode(', ', array_map(function ($menu) {
                    return is_array($menu) && isset($menu['name']) ? $menu['name'] : 'No menu';
                }, $menuArray));

                if (is_array($waiterArray)) {
                    $waitersString = implode(', ', array_map(function ($waiter) {
                        return is_array($waiter) && isset($waiter['fullname']) ? $waiter['fullname'] : 'No waiter';
                    }, $waiterArray));
                }

                // Create an entry for each table, whether or not an order exists
                $disc_amt = $order->discount_amount ?? 0;
                $spe_amt = $order->special_discount_amount ?? 0;
                $discount = $disc_amt + $spe_amt;
                $amount = intval($order->total_amount ?? 0) - $discount;

                $tableData[] = [
                    'restaurant_name' => $restaurant->name ?? null,
                    'table_number' => $tableNumber ?? null,
                    'order_id' => $order->id ?? null,
                    'restaurant_id' => $order->restaurant_id ?? null,
                    'menu' => $menuArray ?? null,
                    'dine_in_out' => $order->dine_in_out ?? null,
                    'payment_method' => $order->payment_method ?? null,
                    'status' => $order->status ?? null,
                    'total_amount' => $order->total_amount ?? null,
                    'amount' => $amount !== 0 ? $amount : null,
                    'discount_amount' => $order->discount_amount ?? null,
                    'special_discount_amount' => $order->special_discount_amount ?? null,
                    'vatable' => $order->vatable ?? null,
                    'vat' => $order->vat ?? null,
                    'customer_name' => $order->customer_name ?? null,
                    'waiter' => $order->waiter ?? null,
                    'cooked_by' => $order->cooked_by ?? null,
                    'voucher_code' => $order->voucher_code ?? null,
                    'special_code' => $order->details ?? null,
                    'time_created' => $order ? (isset($order->time_created) ? date('h:i A', strtotime($order->time_created)) : null) : null,
                    'time_process' => $order ? (isset($order->time_process) ? date('h:i A', strtotime($order->time_process)) : null) : null,
                    'time_served' => $order ? (isset($order->time_served) ? date('h:i A', strtotime($order->time_served)) : null) : null,
                    'time_completed' => $order ? (isset($order->time_completed) ? date('h:i A', strtotime($order->time_completed)) : null) : null,
                    'menu_string' => $menusString ?? null,
                    'waiter_String' => $waitersString ?? null,
                ];
            }
        }

        return response([
            'data' => $tableData
        ], 200);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return OrderResource::collection(
            Order::orderBy('id','desc')->get()
         );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrderRequest $request)
    {
        $currentTime = Carbon::now()->format('H:i:s');
        $data = $request->validated();
        $data['menu'] = json_encode($request->menu);

        $data['kitchen_status'] = $request->status;
        $table_taken = Order::where('restaurant_id', $request->restaurant_id)
                        ->where('table_number' , $request->table_number)->where('status', '!=', 'Completed')->first();

        if ($table_taken) {
            return response([
                'error' => 'Table already taken'
            ], 422);
        }

        $order = Order::create($data);

        OrderTracker::create([
            'order_id' => $order->id,
            'time_created' => $currentTime
        ]);

        return response([
            'message' => 'Order successfully created'
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, $id)
    {
        $user = User::where('id', $id)->first();
        $role_id = $user['role_id'];
        $filters = $request->filters;
        $orderBy = Arr::get($request, "order_by", "id");
        $orderDirection = Arr::get($request, "order_direction", "desc");
        $page = Arr::get($request, "page", "");
        $perPage = Arr::get($request, "per_page", 0);
        $currentPage = Arr::get($request, "page", 0);
        $isPrint = Arr::get($request, "print", false);
        $dateRange = "";

        if ($role_id == 1) {
            $query = Order::with(['restaurant']);

            if ($request->has("filters")) {
                foreach ($filters as $key => $value) {
                    if ($value["column"] === "restaurant.name") {
                        $query->whereHas('restaurant', function ($q) use ($value) {
                            $q->where('name', 'LIKE', "%{$value["value"]}%");
                        });
                    } else if ($value["column"] === "created_at" && $value["operator"] == "RANGE") {
                        [$start, $end] = explode("_", $value["value"]);
                        $dateRange = Carbon::parse($start)->format("Y-m-d h:i A") . " - " . Carbon::parse($end)->format("Y-m-d h:i A");
                        $query->whereBetween("created_at", [$start, $end]);
                    } else {
                        $query->where($value["column"], 'LIKE', "%{$value["value"]}%");
                    }
                }
            }

            if ($isPrint) {
                $data = OrderResource::collection($query->orderBy($orderBy, $orderDirection)->get());
                $pdf = Pdf::loadView('sales_report_pdf', ['data' => $data, 'date_range' => $dateRange]);
                return $pdf->stream('test.pdf');
            } else {
                // dd($query->toSql());
                return OrderResource::collection($query->orderBy($orderBy, $orderDirection)->paginate($perPage, $columns = ['*'], $pageName = 'page', $currentPage + 1));
            }

        } else if ($role_id == 2) {
            // return OrderResource::collection(
            //     Order::join('restaurants', 'restaurants.id', 'categories.restaurant_id')
            //             ->select('categories.*')
            //             ->where('restaurants.corporate_account', $id)
            //             ->orderBy('id','desc')->get()
            //  );
            $restaurant = Restaurant::where('corporate_account', $user['id'])->first();

            $query = Order::with(['restaurant'])
                    ->where('restaurant_id', $restaurant->id);

            if ($request->has("filters")) {
                foreach ($filters as $key => $value) {
                    if ($value["column"] === "restaurant.name") {
                        $query->whereHas('restaurant', function ($q) use ($value) {
                            $q->where('name', 'LIKE', "%{$value["value"]}%");
                        });
                    } else if ($value["column"] === "created_at" && $value["operator"] == "RANGE") {
                        [$start, $end] = explode("_", $value["value"]);
                        $query->whereBetween("created_at", [$start, $end]);
                    } else {
                        $query->where($value["column"], 'LIKE', "%{$value["value"]}%");
                    }
                }
            }

            // dd($query->toSql());
            if ($isPrint) {
                $data = OrderResource::collection($query->orderBy($orderBy, $orderDirection)->get());
                $pdf = Pdf::loadView('sales_report_pdf', ['data' => $data, 'date_range' => $dateRange]);
                return $pdf->stream('test.pdf');
            } else {
                return OrderResource::collection($query->orderBy($orderBy, $orderDirection)->paginate($perPage, $columns = ['*'], $pageName = 'page', $currentPage + 1));
            }
        } else if ($role_id > 2) {
            $restaurant = UserManager::where('user_id', $user['id'])->first();
            $restaurant_id = $restaurant['restaurant_id'];

            $query = Order::with(['restaurant'])
                    ->where('restaurant_id', $restaurant_id);

            if ($request->has("filters")) {
                foreach ($filters as $key => $value) {
                    if ($value["column"] === "restaurant.name") {
                        $query->whereHas('restaurant', function ($q) use ($value) {
                            $q->where('name', 'LIKE', "%{$value["value"]}%");
                        });
                    } else if ($value["column"] === "created_at" && $value["operator"] == "RANGE") {
                        [$start, $end] = explode("_", $value["value"]);
                        $query->whereBetween("created_at", [$start, $end]);
                    } else {
                        $query->where($value["column"], 'LIKE', "%{$value["value"]}%");
                    }
                }
            }

            // dd($query->toSql());

            if ($isPrint) {
                $data = OrderResource::collection($query->orderBy($orderBy, $orderDirection)->get());
                $pdf = Pdf::loadView('sales_report_pdf', ['data' => $data, 'date_range' => $dateRange]);
                return $pdf->stream('test.pdf');
            } else {
                return OrderResource::collection($query->orderBy($orderBy, $orderDirection)->paginate($perPage));
            }
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function CashierUpdate(Request $request)
    {
        $order = Order::find($request->id);
        $order->menu = json_encode($request->menu);
        $order->total_amount = $request->total_amount;
        if (!empty($request->discount_amount)) {
            $order->discount_amount = $request->discount_amount;
        }

        // $order->special_discount_amount = $request->special_discount_amount ?? 0;
        $order->vat = $request->vat;
        $order->vatable = $request->vatable;
        $order->save();

        return response([
            'Success' => 'Order successfully updated',
            'data' => $order
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrderRequest $request, Order $order)
    {
        $request->validated();

        $order = Order::find($request->id);
        $order->restaurant_id = $request->restaurant_id;
        $order->table_number = $request->table_number;
        $order->menu = json_encode($request->menu);
        $order->dine_in_out = $request->dine_in_out;
        $order->payment_method = $request->payment_method;
        $order->status = $request->status;
        $order->total_amount = $request->total_amount;
        $order->discount_amount = $request->discount_amount;
        $order->vat = $request->vat;
        $order->vatable = $request->vatable;
        $order->waiter = json_encode($request->waiter);
        $order->save();

        return response([
            'Success' => 'User successfully updated'
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
    }
}
