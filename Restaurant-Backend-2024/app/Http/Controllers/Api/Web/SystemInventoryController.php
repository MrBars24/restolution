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
use Illuminate\Support\Facades\DB;

class SystemInventoryController extends Controller
{
    /**
     * Copy actual inventory
     */
    public function update_inventory($id)
    {
        $user = User::where('id', $id)->first();
        $role_id = $user['role_id'];

        if ($role_id == 1) {
            return '1';
        } else if ($role_id == 2) {
            $restaurant = Restaurant::where('corporate_account', $id)->first();
            $restaurant_id = $restaurant['id'];
            // return $restaurant_id;
            SystemInventory::where('restaurant_id', $restaurant_id)->where('status', 0)->update(['status' => 1]);
            $actualInventoryRecords = ActualInventory::where('restaurant_id', $restaurant_id)->get();
 
            foreach ($actualInventoryRecords as $actualInventoryRecord) {
                SystemInventory::create([
                    'restaurant_id' => $actualInventoryRecord->restaurant_id,
                    'name' => $actualInventoryRecord->name,
                    'quantity' => $actualInventoryRecord->quantity,
                    'unit' => $actualInventoryRecord->unit,
                    'unit_cost' => $actualInventoryRecord->unit_cost,
                    'total_cost' => $actualInventoryRecord->total_cost,
                    'created_by' => $actualInventoryRecord->created_by
                ]);
            }

            return response([
                'message' => 'System Inventory successfully updated'
            ], 200);
        } else {
            return '3';
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
    public function show($id)
    {
        $user = User::where('id', $id)->first();
        $role_id = $user['role_id'];

        if ($role_id == 1) {
            return SystemInventoryResource::collection(
                SystemInventory::leftjoin('users as created', 'created.id', 'system_inventories.created_by')
                ->leftjoin('users as updated', 'updated.id', 'system_inventories.updated_by')
                ->select('system_inventories.*', DB::raw("CONCAT(created.first_name, ' ', created.last_name) as created_by"), 
                DB::raw("CONCAT(updated.first_name, ' ', updated.last_name) as updated_by"))
                // ->where('system_inventories.status', 0)   // -- error on query
                ->get()
             ); 
        } else if ($role_id == 2) {
            return SystemInventoryResource::collection(
                SystemInventory::join('restaurants', 'restaurants.id', '=', 'system_inventories.restaurant_id')
                    ->leftjoin('users as created', 'created.id', 'system_inventories.created_by')
                    ->leftjoin('users as updated', 'updated.id', 'system_inventories.updated_by')
                    ->select('system_inventories.*', DB::raw("CONCAT(created.first_name, ' ', created.last_name) as createdBy"), 
                    DB::raw("CONCAT(updated.first_name, ' ', updated.last_name) as updatedBy"))
                    ->where('corporate_account', $id)
                    // ->where('system_inventories.status', 0) // -- error on query
                    ->orderBy('id','desc')
                    ->get()
             ); 
        } else {
            $restaurant = UserManager::where('user_id', $id)->first();
            $resto_id = $restaurant['restaurant_id'];

            return SystemInventoryResource::collection(
                SystemInventory::join('restaurants', 'restaurants.id', '=', 'system_inventories.restaurant_id')
                ->leftjoin('users as created', 'created.id', 'system_inventories.created_by')
                ->leftjoin('users as updated', 'updated.id', 'system_inventories.updated_by')
                    ->select('system_inventories.*', DB::raw("CONCAT(created.first_name, ' ', created.last_name) as createdBy"), 
                    DB::raw("CONCAT(updated.first_name, ' ', updated.last_name) as updatedBy"))
                    ->where('restaurants.id', $resto_id)
                    // ->where('system_inventories.status', 0) // -- error on query
                    ->orderBy('id','desc')
                    ->get()
             ); 
        }
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
