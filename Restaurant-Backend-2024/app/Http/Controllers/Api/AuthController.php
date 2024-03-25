<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Restaurant;
use App\Models\TimeTrack;
use App\Models\User;
use App\Models\UserManager;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(LoginRequest $request) 
    {
        $request->validated();
        $currentDateTime = Carbon::now()->format('Y-m-d H:i:s');
 
        if(Auth::guard('web')->attempt(['email' => request('email'), 'password' => request('password'), 'status' => 'Active'])){

            $user = User::leftjoin('user_permissions', 'user_permissions.user_id', 'users.id')
            ->select('users.*', 'user_permissions.permission')
            ->where('email', $request->email)
            ->where('status', 'Active')
            ->first();

            
            $role_id = $user['role_id'];
            
            $name = $user['first_name']." ".$user['last_name'];
            $token = $user->createToken('main')->plainTextToken;
            $user_ID = $user['id'];
            $role = $user['role_id'];
            $permission = json_decode($user['permission']);

            if ($role_id == 1) {
                $restaurant_id = 0;
            } else if ($role_id == 2) {
                $restaurant = Restaurant::where('corporate_account', $user['id'])->first();
                $restaurant_id = $restaurant['id'] ?? null;
            } else {
                $restaurant = UserManager::where('user_id', $user['id'])->first();
                $restaurant_id = $restaurant['restaurant_id'];
            }

            // return $restaurant_id;

            return response(compact('name','token','role', 'user_ID', 'permission', 'restaurant_id')); 
        }  else {
            return response([
                'errors' => [ 'email' => ['The selected email is invalid.'] ],
            ], 422);
        }
    }

    public function logout(Request $request) {
        /** @var User $user */
        $user = $request->user();
        $user->tokens()->delete();

        return response('Logout Successfully', 200);
    }
}
