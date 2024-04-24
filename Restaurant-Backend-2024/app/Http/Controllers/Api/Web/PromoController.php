<?php

namespace App\Http\Controllers\Api\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\StorePromoRequest;
use App\Http\Requests\Web\UpdatePromoRequest;
use App\Http\Resources\Web\PromoResource;
use App\Models\Promo;
use App\Models\Restaurant;
use App\Models\UsePromo;
use App\Models\User;
use App\Models\UserManager;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class PromoController extends Controller
{
    public function delete()
    {
        DB::select('truncate table use_promos');

        return response([
            'success' => 'clear'
        ], 200);
    }
    /**
     * Display a listing of the resource.
     */
    public function voucher($voucher_code)
    {
        $currentDate = Carbon::today()->toDateString();

        $promo = Promo::whereRaw("BINARY voucher_code = ?", [$voucher_code])
                ->where('datefrom', '<=', $currentDate)
                ->where('dateto', '>=', $currentDate)
                ->first();

        if ($promo) {
            $limit = UsePromo::where('promo_id', $promo->id)
                    ->where('restaurant_id', $promo->restaurant_id)->first();

            if ($limit && $promo->limit === 'SINGLE') {
                return response([
                    'error' => 'Voucher Code limit has been reached'
                ], 422);
            }

            $data = [
                'restaurant_id' => $promo->restaurant_id,
                'promo_id' => $promo->id,
            ];

            $voucher = UsePromo::create($data);

            $promo['menu'] = json_decode($promo->menu);

            return response([
                'discount_id' => $voucher->id,
                'data' => $promo

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
    public function index()
    {
        //
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
    public function store(StorePromoRequest $request)
    {
        $data = $request->validated();

        $user = User::where('id', $request->created_by)->first();
        $role_id = $user['role_id'];

        if ($role_id == 1) {

        } else if ($role_id == 2) {
            $restaurant = Restaurant::where('corporate_account', $user['id'])->first();
            $resto_id = $restaurant['id'];
            $data['restaurant_id'] = $resto_id;
        } else {
            $restaurant = UserManager::where('user_id', $user['id'])->first();
            $resto_id = $restaurant['restaurant_id'];
            $data['restaurant_id'] = $resto_id;
        }
        $data['created_by'] = $request->created_by;
        $data['menu'] = json_encode($request->menu);
        Promo::create($data);

        return response([
            'message' => 'Promo successfully created'
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
        $perPage = Arr::get($request, "per_page", 0);
        $currentPage = Arr::get($request, "page", 0);

        $query = Promo::query();

        if ($request->has("filters")) {
            foreach ($filters as $key => $value) {
                if ($value["column"] === "restaurant.name") {
                    $query->whereHas('restaurant', function ($q) use ($value) {
                        $q->where('name', 'LIKE', "%{$value["value"]}%");
                    });
                } else if ($value["column"] === "created_at" && $value["operator"] == "RANGE") {
                    [$start, $end] = explode("_", $value["value"]);
                    $query->whereBetween("promos.created_at", [$start, $end]);
                } else {
                    $col = $value["column"];

                    if ($col == "restaurant_id") $col = "promos.restaurant_id";

                    $query->where($col, 'LIKE', "%{$value["value"]}%");
                }
            }
        }

        if ($role_id == 1) {
            $query->join('users as created', 'created.id', 'promos.created_by')
                ->join('users as updated', 'updated.id', 'promos.created_by')
                ->join('restaurants', 'restaurants.id', 'promos.restaurant_id')
                ->join('users', 'users.id', 'restaurants.corporate_account')
                ->select('promos.*', DB::raw("CONCAT(created.first_name, ' ', created.last_name) as createdBy"),
                DB::raw("CONCAT(updated.first_name, ' ', updated.last_name) as updatedBy"), 'restaurants.name as restaurant_name', 'users.reference_number');
        } else if ($role_id == 2) {
            $query->join('users as created', 'created.id', 'promos.created_by')
                ->join('users as updated', 'updated.id', 'promos.created_by')
                ->join('restaurants', 'restaurants.id', 'promos.restaurant_id')
                ->join('users', 'users.id', 'restaurants.corporate_account')
                ->select('promos.*', DB::raw("CONCAT(created.first_name, ' ', created.last_name) as createdBy"),
                DB::raw("CONCAT(updated.first_name, ' ', updated.last_name) as updatedBy"), 'restaurants.name as restaurant_name', 'users.reference_number')
                ->where('restaurants.corporate_account', $id);
        } else {
            $restaurant = UserManager::where('user_id', $id)->first();
            $resto_id = $restaurant['restaurant_id'];

            $query->join('users as created', 'created.id', 'promos.created_by')
                    ->join('users as updated', 'updated.id', 'promos.created_by')
                    ->join('restaurants', 'restaurants.id', 'promos.restaurant_id')
                    ->join('users', 'users.id', 'restaurants.corporate_account')
                    ->select('promos.*', DB::raw("CONCAT(created.first_name, ' ', created.last_name) as createdBy"),
                    DB::raw("CONCAT(updated.first_name, ' ', updated.last_name) as updatedBy"), 'restaurants.name as restaurant_name', 'users.reference_number')
                    ->where('restaurants.id', $resto_id);
        }

        return PromoResource::collection($query->orderBy($orderBy, $orderDirection)->paginate($perPage, $columns = ['*'], $pageName = 'page', $currentPage + 1));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Promo $promo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePromoRequest $request, Promo $promo)
    {
        $request->validated();

        $promotion = Promo::find($request->id);
        $promotion->restaurant_id = $request->restaurant_id;
        $promotion->category = $request->category;
        $promotion->menu = ($request->category == 'SELECTED') ? json_encode($request->menu) : null;
        $promotion->datefrom = $request->datefrom;
        $promotion->dateto = $request->dateto;
        $promotion->voucher_code = $request->voucher_code;
        $promotion->voucher_name = $request->voucher_name;
        $promotion->discount_type = $request->discount_type;
        $promotion->discount_amount = $request->discount_amount;
        $promotion->limit = $request->limit;
        $promotion->updated_by = $request->updated_by;
        $promotion->save();

        return response([
            'Success' => 'Promo successfully updated'
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Promo $promo)
    {
        //
    }
}
