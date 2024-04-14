<?php

namespace App\Http\Controllers\Api\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\StoreActInventoryRequest;
use App\Http\Requests\Web\UpdateActInventoryRequest;
use App\Http\Resources\Web\ActualInventoryResource;
use App\Models\ActualInventory;
use App\Models\Restaurant;
use App\Models\User;
use App\Models\UserManager;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ActualInventoryController extends Controller
{
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
    public function store(StoreActInventoryRequest $request)
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
        ActualInventory::create($data);

        return response([
            'message' => 'Actual Inventory successfully created'
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
            return ActualInventoryResource::collection(
                ActualInventory::leftjoin('users as created', 'created.id', 'actual_inventories.created_by')
                ->leftjoin('users as updated', 'updated.id', 'actual_inventories.updated_by')
                ->select('actual_inventories.*', DB::raw("CONCAT(created.first_name, ' ', created.last_name) as created_by"),
                DB::raw("CONCAT(updated.first_name, ' ', updated.last_name) as updated_by"))
                ->get()
             );
        } else if ($role_id == 2) {
            return ActualInventoryResource::collection(
                ActualInventory::join('restaurants', 'restaurants.id', '=', 'actual_inventories.restaurant_id')
                    ->leftjoin('users as created', 'created.id', 'actual_inventories.created_by')
                    ->leftjoin('users as updated', 'updated.id', 'actual_inventories.created_by')
                    ->select('actual_inventories.*', DB::raw("CONCAT(created.first_name, ' ', created.last_name) as created_by"),
                    DB::raw("CONCAT(updated.first_name, ' ', updated.last_name) as updated_by"))
                    ->where('corporate_account', $id)
                    ->orderBy('id','desc')
                    ->get()
             );
        } else {
            $restaurant = UserManager::where('user_id', $id)->first();
            $resto_id = $restaurant['restaurant_id'];

            return ActualInventoryResource::collection(
                ActualInventory::join('restaurants', 'restaurants.id', '=', 'actual_inventories.restaurant_id')
                ->leftjoin('users as created', 'created.id', 'actual_inventories.created_by')
                ->leftjoin('users as updated', 'updated.id', 'actual_inventories.created_by')
                    ->select('actual_inventories.*', DB::raw("CONCAT(created.first_name, ' ', created.last_name) as created_by"),
                    DB::raw("CONCAT(updated.first_name, ' ', updated.last_name) as updated_by"))
                    ->where('restaurants.id', $resto_id)
                    ->orderBy('id','desc')
                    ->get()
             );
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ActualInventory $actualInventory)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateActInventoryRequest $request, ActualInventory $actualInventory)
    {
        $request->validated();

        $user = ActualInventory::find($request->id);
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
    public function destroy(ActualInventory $actualInventory)
    {
        //
    }
}
