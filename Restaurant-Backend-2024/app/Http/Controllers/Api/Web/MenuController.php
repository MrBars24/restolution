<?php

namespace App\Http\Controllers\Api\Web;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Http\Requests\Web\StoreMenuRequest;
use App\Http\Requests\Web\UpdateMenuRequest;
use App\Http\Resources\Web\MenuResource;
use App\Models\Category;
use App\Models\Restaurant;
use App\Models\User;
use App\Models\UserManager;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class MenuController extends Controller
{
    /**
     * Display Restaurant Menus.
     */
    public function menus($id)
    {
        $menus = Menu::where('restaurant_id', $id)->get();


        return response([
                'data' => $menus
            ], 200);
    }
    /**
     * Display a listing of the resource.
     */
    public function index($id)
    {
        return MenuResource::collection(
            Menu::join('menu_tabs', 'menu_tabs.id', '=', 'menus.menutab_id')
                ->select('menus.*', 'menu_tabs.name as menutab', 'menu_tabs.id as menutab_id')
                ->where('menus.restaurant_id', $id)
                ->orderBy('menus.id','desc')->get()
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
    public function store(StoreMenuRequest $request)
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

        $data['ingredients'] = json_encode($request->ingredients);
        $data['category'] = json_encode($request->category);
        $data['created_by'] = $request->created_by;
        Menu::create($data);

        return response([
            'message' => 'Menu successfully created'
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
        $isPrint = Arr::get($request, "print", false);

        $query = Menu::query();

        if ($request->has("filters")) {
            foreach ($filters as $key => $value) {
                if ($value["column"] === "restaurant.name") {
                    $query->whereHas('restaurant', function ($q) use ($value) {
                        $q->where('name', 'LIKE', "%{$value["value"]}%");
                    });
                } else if ($value["column"] === "created_at" && $value["operator"] == "RANGE") {
                    [$start, $end] = explode("_", $value["value"]);
                    $query->whereBetween("menus.created_at", [$start, $end]);
                } else {
                    $col = $value["column"];

                    if ($col == "restaurant_id") $col = "menus.restaurant_id";

                    $query->where($col, 'LIKE', "%{$value["value"]}%");
                }
            }
        }

        if ($role_id == 1) {
            $query->join('menu_tabs', 'menu_tabs.id', '=', 'menus.menutab_id')
                    ->select('menus.*', 'menu_tabs.name as menutab', 'menu_tabs.id as menutab_id');
        } else if ($role_id == 2) {
            $query->join('menu_tabs', 'menu_tabs.id', '=', 'menus.menutab_id')
                ->join('restaurants', 'restaurants.id', 'menus.restaurant_id')
                ->select('menus.*', 'menu_tabs.name as menutab', 'menu_tabs.id as menutab_id')
                ->where('restaurants.corporate_account', $id);
        } else {
            $restaurant = UserManager::where('user_id', $id)->first();
            $resto_id = $restaurant['restaurant_id'];

            $query->join('menu_tabs', 'menu_tabs.id', '=', 'menus.menutab_id')
                ->join('restaurants', 'restaurants.id', 'menus.restaurant_id')
                ->select('menus.*', 'menu_tabs.name as menutab', 'menu_tabs.id as menutab_id')
                ->where('restaurants.id', $resto_id);
        }

        if ($isPrint) {
            $data = MenuResource::collection($query->orderBy($orderBy, $orderDirection)->get());
            $pdf = Pdf::loadView('menu_report_pdf', ['data' => $data]);
            return $pdf->stream('test.pdf');
        } else {
            return MenuResource::collection($query->orderBy($orderBy, $orderDirection)->paginate($perPage, $columns = ['*'], $pageName = 'page', $currentPage + 1));
        }

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Menu $menu)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMenuRequest $request, Menu $menu)
    {
        $request->validated();

        $menu = Menu::find($request->id);
        $menu->restaurant_id = $request->restaurant_id;
        $menu->name = $request->name;
        $menu->ingredients = json_encode($request->ingredients);
        $menu->price = $request->price;
        $menu->preparation_time = $request->preparation_time;
        $menu->status = $request->status;
        $menu->menutab_id = $request->menutab_id;
        $menu->category = $request->category;
        $menu->image = $request->image;
        $menu->updated_by = $request->created_by;
        $menu->save();

        return response([
            'Success' => 'User successfully updated'
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Menu $menu)
    {
        //
    }
}
