<?php

namespace App\Http\Controllers\Api\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\StoreIngredientsRequest;
use App\Http\Requests\Web\UpdateIngredientsRequest;
use App\Http\Resources\Web\IngredientResource;
use App\Models\ActualInventory;
use App\Models\Ingredient;
use App\Models\Restaurant;
use App\Models\SystemInventory;
use App\Models\User;
use App\Models\UserManager;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use PHPUnit\Event\Telemetry\System;

class IngredientsController extends Controller
{
    public function remaining($id)
    {

        $user = User::where('id', $id)->first();
        $role_id = $user['role_id'];

        if ($role_id == 1) {

        } else if ($role_id == 2) {
            $restaurant = Restaurant::where('corporate_account', $user['id'])->first();
            $resto_id = $restaurant['id'];
        } else {
            $restaurant = UserManager::where('user_id', $user['id'])->first();
            $resto_id = $restaurant['restaurant_id'];
        }

        $results = DB::select("
            WITH OrderIngredients AS (
                SELECT restaurant_id, name, unit, COALESCE(SUM( quantity_json_object * quantity_json_object_q), 0) as used_quantity
                FROM (
                    SELECT
                        menus.restaurant_id,
                        JSON_UNQUOTE(JSON_EXTRACT(ingredients, CONCAT('$[', numbers.n, '].name'))) AS name,
                        JSON_UNQUOTE(JSON_EXTRACT(ingredients, CONCAT('$[', numbers.n, '].unit'))) AS unit,
                        JSON_UNQUOTE(JSON_EXTRACT(ingredients, CONCAT('$[', numbers.n, '].quantity'))) AS quantity_json_object,
                        IFNULL(
                            JSON_UNQUOTE(JSON_EXTRACT(orders.menu, CONCAT('$[', numbers.n, '].quantity'))),
                            JSON_UNQUOTE(JSON_EXTRACT(orders.menu, '$[0].quantity'))
                        ) AS quantity_json_object_q
                    FROM menus
                    JOIN (
                        SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3
                        -- Add more UNION ALL SELECT statements based on the maximum number of ingredients in a row
                    ) AS numbers ON JSON_UNQUOTE(JSON_EXTRACT(ingredients, CONCAT('$[', numbers.n, ']'))) IS NOT NULL
                    LEFT JOIN orders ON JSON_UNQUOTE(JSON_EXTRACT(orders.menu, '$[0].name')) = menus.name
                        AND orders.restaurant_id = menus.restaurant_id
                    WHERE menus.restaurant_id = $resto_id
                ) as a
                group by name, restaurant_id, unit
            )
            SELECT
            ai.restaurant_id,
            ai.name,
            ai.unit,
            COALESCE(used_quantity, 0) AS used_quantity,
            SUM(ai.quantity) - COALESCE(used_quantity,0) AS remaining_quantity
            FROM actual_inventories ai
            LEFT JOIN OrderIngredients oi ON ai.restaurant_id = oi.restaurant_id AND ai.name = oi.name
            WHERE ai.restaurant_id = $resto_id
            GROUP BY ai.name, ai.unit, ai.restaurant_id, used_quantity

    ");


        if ($results){
            return response([
                'data' => $results
            ], 200);
        } else {
            return response([
                'message' => 'No data available'
            ], 422);
        }

    }
    /**
     * Display a listing of the resource.
     */
    public function summary($id, $startDate, $endDate)
    {


        if ($startDate === 'null' && $endDate === 'null'  ) {
            $currentDateTime = Carbon::now()->format('Y-m-d');
            $start = $currentDateTime;
            $end = $currentDateTime;
        } else {
            $start = $startDate;
            $end = $endDate;
        }



        $user = User::where('id', $id)->first();
        $role_id = $user['role_id'];

        if ($role_id == 1) {

        } else if ($role_id == 2) {
            $restaurant = Restaurant::where('corporate_account', $user['id'])->first();
            $resto_id = $restaurant['id'];
        } else {
            $restaurant = UserManager::where('user_id', $user['id'])->first();
            $resto_id = $restaurant['restaurant_id'];
        }

        // $sql = DB::table('ingredients')
        //     ->whereBetween('created_at', [$start, date('Y-m-d', strtotime($end . ' + 1 day'))])
        //     ->where('restaurant_id', $resto_id)
        //     ->select(DB::raw('GROUP_CONCAT(DISTINCT
        //         "MAX(CASE WHEN DATE(created_at) = \'", DATE(created_at), "\' THEN created_at END) AS ", DATE_FORMAT(created_at, "%M_%d")
        //     ) AS dynamic_columns'))
        //     ->get()
        //     ->pluck('dynamic_columns')
        //     ->first();

        $sql = DB::table('ingredients')
    ->whereBetween('created_at', [$start, date('Y-m-d', strtotime($end . ' + 1 day'))])
    ->select(DB::raw('GROUP_CONCAT(DISTINCT
        "MAX(CASE WHEN DATE(created_at) = \'", DATE(created_at), "\' THEN CONCAT(quantity, \'/\', unit_cost) END) AS ", DATE_FORMAT(created_at, "%M_%d")
    ) AS dynamic_columns'))
    ->where('restaurant_id', $resto_id)
    ->get()
    ->pluck('dynamic_columns')
    ->first();



        if ($sql) {
            // $query = DB::table('ingredients')
            // ->select([
            //     'name',
            //     DB::raw('MAX(id) AS id'),
            //     DB::raw('MAX(restaurant_id) AS restaurant_id'),
            //     DB::raw('MAX(unit) AS unit'),
            //     DB::raw('SUM(quantity) AS total_quantity'),
            //     DB::raw('AVG(unit_cost) AS avg_unit_cost'),
            //     DB::raw('MAX(created_by) AS created_by'),
            //     DB::raw($sql),
            // ])
            // ->whereBetween('created_at', [$start, date('Y-m-d', strtotime($end . ' + 1 day'))])
            // ->where('restaurant_id', $resto_id)
            // ->groupBy('name')
            // ->orderBy('name');

            // $results = $query->get();
            $query = DB::table('ingredients')
    ->select([
        'name',
        DB::raw('MAX(id) AS id'),
        DB::raw('MAX(restaurant_id) AS restaurant_id'),
        DB::raw('MAX(unit) AS unit'),
        DB::raw('SUM(quantity) AS total_quantity'),
        DB::raw('AVG(unit_cost) AS avg_unit_cost'),
        DB::raw('MAX(created_by) AS created_by'),
        DB::raw($sql),
    ])
    ->whereBetween('created_at', [$start, date('Y-m-d', strtotime($end . ' + 1 day'))])
    ->groupBy('name')
    ->orderBy('name');

$results = $query->get();

            return response([
                'data' => $results
            ], 200);
        } else {
            return response([
                'message' => 'No data available'
            ], 422);
        }

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreIngredientsRequest $request)
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
        Ingredient::create($data);
        $data['total_cost'] = ($request->quantity * $request->unit_cost);

        $system = SystemInventory::where('name', $request->name)->where('restaurant_id', $resto_id)->first();
        $actual = ActualInventory::where('name', $request->name)->where('restaurant_id', $resto_id)->first();

        if (!$actual) {
            ActualInventory::create($data);
        } else {
            $quantity = $data['quantity'] + $actual->quantity;
            $user = ActualInventory::find($actual->id);
            $user->quantity = $quantity;
            $user->save();
        }

        if (!$system) {
            SystemInventory::create($data);
        } else {
            $quantity = $data['quantity'] + $system->quantity;
            $user = SystemInventory::find($system->id);
            $user->quantity = $quantity;
            $user->save();
        }


        return response([
            'message' => 'Ingredient successfully created'
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $user = User::where('id', $id)->first();
        $role_id = $user['role_id'];

        if ($role_id == 1) {
            return IngredientResource::collection(
                Ingredient::orderBy('id','desc')->get()
             );
        } else if ($role_id == 2) {
            return IngredientResource::collection(
                Ingredient::join('restaurants', 'restaurants.id', 'ingredients.restaurant_id')
                    ->select('ingredients.*')
                    ->where('restaurants.corporate_account', $id)
                    ->orderBy('id','desc')
                    ->get()
             );
        } else {
            $restaurant = UserManager::where('user_id', $id)->first();
            $resto_id = $restaurant['restaurant_id'];

            return IngredientResource::collection(
                Ingredient::join('restaurants', 'restaurants.id', 'ingredients.restaurant_id')
                    ->select('ingredients.*')
                    ->where('restaurants.id', $resto_id)
                    ->orderBy('id','desc')
                    ->get()
             );
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ingredient $ingredient)
    {

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateIngredientsRequest $request, Ingredient $ingredient)
    {
        $request->validated();

        $user = Ingredient::find($request->id);
        $user->restaurant_id = $request->restaurant_id;
        $user->name = $request->name;
        $user->unit = $request->unit;
        $user->quantity = $request->quantity;
        $user->cost = $request->cost;
        $user->updated_by = $request->created_by;
        $user->save();

        return response([
            'Success' => 'User successfully updated'
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ingredient $ingredient)
    {
        //
    }
}
