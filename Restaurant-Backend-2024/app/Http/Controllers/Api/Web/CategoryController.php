<?php

namespace App\Http\Controllers\Api\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\StoreCategoryRequest;
use App\Http\Requests\Web\UpdateCategoryRequest;
use App\Http\Resources\Web\CategoryResource;
use App\Models\Category;
use App\Models\Restaurant;
use App\Models\User;
use App\Models\UserManager;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($id)
    {
        return CategoryResource::collection(
            Category::orderBy('id','desc')
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
    public function store(StoreCategoryRequest $request)
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
        Category::create($data);

        return response([
            'message' => 'Category successfully created'
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
            return CategoryResource::collection(
                Category::orderBy('id','desc')->get()
             ); 
        } else if ($role_id == 2) {
            return CategoryResource::collection(
                Category::join('restaurants', 'restaurants.id', 'categories.restaurant_id')
                        ->select('categories.*')
                        ->where('restaurants.corporate_account', $id)
                        ->orderBy('id','desc')->get()
             ); 
        } else {
            $restaurant = UserManager::where('user_id', $id)->first();
            $resto_id = $restaurant['restaurant_id'];

            return CategoryResource::collection(
                Category::join('restaurants', 'restaurants.id', 'categories.restaurant_id')
                        ->select('categories.*')
                        ->where('restaurants.id', $resto_id)
                        ->orderBy('id','desc')->get()
             );
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $request->validated();

        $category = Category::find($request->id);
        $category->restaurant_id = $request->restaurant_id;
        $category->name = $request->name;
        $category->updated_by = $request->created_by;
        $category->save(); 

        return response([
            'Success' => 'User successfully updated'
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        //
    }
}
