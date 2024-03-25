<?php

namespace App\Http\Controllers\Api\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\StoreMenuTabRequest;
use App\Http\Requests\Web\UpdateMenuTabRequest;
use App\Http\Resources\Web\MenuTabResource;
use App\Models\MenuTab;
use App\Models\Restaurant;
use App\Models\User;
use App\Models\UserManager;
use Illuminate\Http\Request;

class MenuTabController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($id)
    {
        return MenuTabResource::collection(
            MenuTab::orderBy('id','asc')
                ->where('restaurant_id', $id)
                ->get()
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
    public function store(StoreMenuTabRequest $request)
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
        MenuTab::create($data);

        return response([
            'message' => 'Menu Tab successfully created'
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
            return MenuTabResource::collection(
                MenuTab::orderBy('id','asc')->get()
             );  
        } else if ($role_id == 2) {
            return MenuTabResource::collection(
                MenuTab::join('restaurants', 'restaurants.id', 'menu_tabs.restaurant_id')
                        ->select('menu_tabs.*')
                        ->where('restaurants.corporate_account', $id)
                        ->orderBy('id','asc')->get()
             ); 
        } else {
            $restaurant = UserManager::where('user_id', $id)->first();
            $resto_id = $restaurant['restaurant_id'];

            return MenuTabResource::collection(
                MenuTab::join('restaurants', 'restaurants.id', 'menu_tabs.restaurant_id')
                        ->select('menu_tabs.*')
                        ->where('restaurants.id', $resto_id)
                        ->orderBy('id','asc')->get()
             ); 
        }   
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MenuTab $menuTab)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMenuTabRequest $request, MenuTab $menuTab)
    {
        $request->validated();

        $menutab = MenuTab::find($request->id);
        $menutab->restaurant_id = $request->restaurant_id;
        $menutab->name = $request->name;
        $menutab->updated_by = $request->created_by;
        $menutab->save(); 

        return response([
            'Success' => 'User successfully updated'
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MenuTab $menuTab)
    {
        //
    }
}
