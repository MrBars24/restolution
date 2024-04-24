<?php

namespace App\Http\Controllers\Api\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\StoreSysInventoryRequest;
use App\Http\Requests\Web\UpdateSysInventoryRequest;
use App\Http\Resources\Web\SystemInventoryResource;
use App\Models\ActualInventory;
use App\Models\Restaurant;
use App\Models\SystemInventory;
use App\Models\User;
use App\Models\UserManager;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class SystemInventoryController extends Controller
{
    /**
     * Copy actual inventory
     */
    public function update_inventory($id)
    {
        $user = User::with("permissions")->where('id', $id)->first();
        $role_id = $user['role_id'];

        if ($role_id == 1) {
            return response()->json(['error' => "No restaurant is selected"], 403);
        }

        if (in_array("Inventory Actual (Create)", json_decode($user->permissions->permission))) {
            if ($role_id == 2) {
                $restaurant = Restaurant::where('corporate_account', $id)->first();
            } else if ($role_id > 2) {
                $item = UserManager::with(['restaurant'])->where("user_id", $id)->first();
                $restaurant = $item->restaurant;
            }

            $restaurant_id = $restaurant['id'];
            // return $restaurant_id;
            SystemInventory::where('restaurant_id', $restaurant_id)->delete();
            $actualInventoryRecords = ActualInventory::where('restaurant_id', $restaurant_id)->get();

            foreach ($actualInventoryRecords as $actualInventoryRecord) {
                SystemInventory::create([
                    'restaurant_id' => $actualInventoryRecord->restaurant_id,
                    'name' => $actualInventoryRecord->name,
                    'quantity' => $actualInventoryRecord->quantity,
                    'unit' => $actualInventoryRecord->unit,
                    'unit_cost' => $actualInventoryRecord->unit_cost,
                    'total_cost' => $actualInventoryRecord->total_cost,
                    'created_by' => $actualInventoryRecord->created_by,
                    'created_at' => $actualInventoryRecord->created_at,
                    'updated_by' => $id
                ]);
            }

            return response([
                'message' => 'System Inventory successfully updated'
            ], 200);
        }

        return null;
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
    public function store(StoreSysInventoryRequest $request)
    {
        $data = $request->validated();

        $user = User::where('id', $request->created_by)->first();
        $role_id = $user['role_id'];

        if ($role_id == 1) {
            //
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
        SystemInventory::create($data);

        return response([
            'message' => 'System Inventory successfully created'
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

        $query = SystemInventory::query();

        if ($request->has("filters")) {
            foreach ($filters as $key => $value) {
                if ($value["column"] === "restaurant.name") {
                    $query->whereHas('restaurant', function ($q) use ($value) {
                        $q->where('name', 'LIKE', "%{$value["value"]}%");
                    });
                } else if ($value["column"] === "created_at" && $value["operator"] == "RANGE") {
                    [$start, $end] = explode("_", $value["value"]);
                    $query->whereBetween("system_inventories.created_at", [$start, $end]);
                } else {
                    $col = $value["column"];

                    if ($col == "restaurant_id") $col = "system_inventories.restaurant_id";

                    $query->where($col, 'LIKE', "%{$value["value"]}%");
                }
            }
        }


        if ($role_id == 1) {
            $query->leftjoin('users as created', 'created.id', 'system_inventories.created_by')
            ->leftjoin('users as updated', 'updated.id', 'system_inventories.updated_by')
            ->select('system_inventories.*', DB::raw("CONCAT(created.first_name, ' ', created.last_name) as created_by"),
            DB::raw("CONCAT(updated.first_name, ' ', updated.last_name) as updated_by"));
        } else if ($role_id == 2) {
            $query->join('restaurants', 'restaurants.id', '=', 'system_inventories.restaurant_id')
                ->leftjoin('users as created', 'created.id', 'system_inventories.created_by')
                ->leftjoin('users as updated', 'updated.id', 'system_inventories.updated_by')
                ->select('system_inventories.*', DB::raw("CONCAT(created.first_name, ' ', created.last_name) as created_by"),
                DB::raw("CONCAT(updated.first_name, ' ', updated.last_name) as updated_by"))
                ->where('corporate_account', $id);
        } else {
            $restaurant = UserManager::where('user_id', $id)->first();
            $resto_id = $restaurant['restaurant_id'];

            $query->join('restaurants', 'restaurants.id', '=', 'system_inventories.restaurant_id')
            ->leftjoin('users as created', 'created.id', 'system_inventories.created_by')
            ->leftjoin('users as updated', 'updated.id', 'system_inventories.updated_by')
                ->select('system_inventories.*', DB::raw("CONCAT(created.first_name, ' ', created.last_name) as created_by"),
                DB::raw("CONCAT(updated.first_name, ' ', updated.last_name) as updated_by"))
                ->where('restaurants.id', $resto_id);
        }

        return SystemInventoryResource::collection($query->orderBy($orderBy, $orderDirection)->paginate($perPage, $columns = ['*'], $pageName = 'page', $currentPage + 1));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SystemInventory $systemInventory)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSysInventoryRequest $request, SystemInventory $systemInventory)
    {
        $request->validated();

        $user = SystemInventory::find($request->id);
        $user->restaurant_id = $request->restaurant_id;
        $user->name = $request->name;
        $user->quantity = $request->quantity;
        $user->unit = $request->unit;
        $user->unit_cost = $request->unit_cost;
        $user->total_cost = $request->total_cost;
        $user->updated_by = $request->created_by;
        $user->save();

        return response([
            'Success' => 'System Inventory successfully updated'
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SystemInventory $systemInventory)
    {
        //
    }
}
