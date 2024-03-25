<?php

namespace App\Http\Controllers\Api\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\StoreUserRequest;
use App\Http\Requests\Web\UpdateUserRequest;
use App\Http\Resources\Web\UserResource;
use App\Models\Category;
use App\Models\CorporateRestriction;
use App\Models\Restaurant;
use App\Models\User;
use App\Models\UserManager;
use App\Models\UserPermission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function sample($id) {
        $category = Category::where('id', $id)->get();

        return response([
            'data' => $category
        ], 200);
    }

    public function access($id) {
        $user = UserPermission::where('user_id', $id)->first();

        if ($user) {
            $user = [
                'user_id' => $user->id,
                'permission' => json_decode($user->permission)
            ];

            return $user;
        } else {
            return response([
                'error' => 'You dont have permission to access admin panel'
            ], 422);
        }
    }
    /**
     * Display User Profile.
     */
    public function void(Request $request)
    {
        if(Auth::guard('web')->attempt(['email' => request('email'), 'password' => request('password')])){
            $user = Auth::guard('web')->user();
 
            if ($user->role_id <> 1 && $user->role_id <> 2 && $user->role_id <> 3) {
                return response([
                    'error' => 'You dont have access to void'
                ], 422);
            }

            return response([
                'success' => 'User found'
            ], 200);
       } else {
            return response([
                'errors' => 'User not found'
            ], 422);
       }
    }
    
    /**
     * Display User Profile.
     */
    public function corporate_account($id)
    {
        $user = User::find($id);
        
        if ($user->role_id === 1) {
            $users = User::where('role_id', 2)->get();
            if (!$users) {
                return response([
                    'error' => 'No Corporate Account created'
                ], 422);
            }
        } else {
            return response([
                'error' => 'User not found'
            ], 422);
        }
        return response([
            'data' => $users
        ], 200);
    }

    /**
     * Display User Profile.
     */
    public function profile($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response([
                'error' => 'User not found'
            ], 422);
        }
        return $user;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();
        
        $role_id = $request->role_id;
        $data['password'] = bcrypt('welcome@123');
        $data['created_by'] = $request->created_by;


        if ($role_id == 1) { 
            $user = User::create($data);
            UserPermission::create([
                'user_id' => $user->id,
                'permission' => json_encode($request->permission)
            ]);
        } else if ($role_id == 2) {
            $corporateInfo = User::whereNotNull('reference_number')->orderBy('reference_number', 'desc')->first();
            $ref = $corporateInfo['reference_number'] ?? null;

            if ($corporateInfo) {
                $letter = $ref[0];
                    $number = intval(substr($ref, 1));

                    if ($number == 99) {
                        $letter++;
                        if ($letter == 'Z') {
                            $letter = 'A'; // Reset to 'A' if it reaches 'Z'
                        }
                        $number = 0;
                    } else {
                        $number++;
                    }

                    $str1 = str_pad($number, 2, '0', STR_PAD_LEFT);
                    $reference_id = $letter . $str1;
                
            } else {
                $reference_id = 'A00';
            }
            $data['reference_number'] = $reference_id;
            
            $user = User::create($data);
            CorporateRestriction::create([
                'user_id' => $user->id,
                'allowed_restaurant' => $request->allowed_restaurant,
                'allowed_bm' => $request->allowed_bm
            ]);
            UserPermission::create([
                'user_id' => $user->id,
                'permission' => json_encode($request->permission)
            ]);
        }  else {
            $user = User::create($data);
            UserManager::create([
                'user_id' => $user->id,
                'restaurant_id' => $request->restaurant_id    
            ]);
            UserPermission::create([
                'user_id' => $user->id,
                'permission' => json_encode($request->permission)
            ]);
        }

        return response([
            'Success' => 'User successfully created'
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $user = User::where('id', $id)->first();
        $role_id = $user['role_id'];

        // return $role_id;

        if ($role_id == 1) {
            return UserResource::collection(
                User::leftjoin('user_permissions', 'user_permissions.user_id', 'users.id')
                    ->leftjoin('user_managers', 'user_managers.user_id', 'users.id')
                    ->leftjoin('restaurants', 'restaurants.id', 'user_managers.restaurant_id')
                    ->leftjoin('corporate_restrictions', 'corporate_restrictions.user_id', 'users.id')
                    ->select('users.*', 'user_permissions.permission', 'restaurants.id as restaurant_id', 'restaurants.name as restaurant_name', 'corporate_restrictions.allowed_restaurant', 'corporate_restrictions.allowed_bm')
                    ->orderBy('id','desc')->get()
             ); 
        } else if ($role_id == 2) {
            $restaurant = Restaurant::where('corporate_account', $id)->first();
            $resto_id = $restaurant['id'];

 
            return UserResource::collection(
                User::leftjoin('user_permissions', 'user_permissions.user_id', 'users.id')
                    ->leftjoin('user_managers', 'user_managers.user_id', 'users.id')
                    ->leftjoin('restaurants', 'restaurants.id', 'user_managers.restaurant_id')
                    ->select('users.*', 'user_permissions.permission', 'restaurants.id as restaurant_id', 'restaurants.name as restaurant_name')
                    ->where('restaurants.id', $resto_id)
                    ->orderBy('id','desc')->get()
             );  
        } else {
            $restaurant = UserManager::where('user_id', $id)->first();
            $resto_id = $restaurant['restaurant_id'];
            return UserResource::collection(
                User::leftjoin('user_permissions', 'user_permissions.user_id', 'users.id')
                    ->leftjoin('user_managers', 'user_managers.user_id', 'users.id')
                    ->leftjoin('restaurants', 'restaurants.id', 'user_managers.restaurant_id')
                    ->select('users.*', 'user_permissions.permission', 'restaurants.id as restaurant_id', 'restaurants.name as restaurant_name')
                    ->where('restaurants.id', $resto_id)
                    ->orderBy('id','desc')->get()
             );  
        }
        
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $id)
    {
        $request->validated();

        $user = User::find($request->id);
        $user->first_name = $request->first_name;
        $user->last_name = $request->last_name;
        $user->email = $request->email;
        $user->role_id = $request->role_id;
        $user->status = $request->status;
        $user->save(); 
 
  
        $permissions = UserPermission::where('user_id', $request->id)->first();
    
        if ($permissions) {
            $permissions->permission = json_encode($request->permission);
            $permissions->save();
        }

        return response([
            'Success' => 'User successfully updated'
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
