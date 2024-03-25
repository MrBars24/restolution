<?php

namespace App\Http\Controllers\Api\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\StoreRestaurantRequest;
use App\Http\Requests\Web\UpdateRestaurantRequest;
use App\Http\Resources\Web\RestaurantResource;
use App\Models\CorporateRestriction;
use App\Models\Restaurant;
use App\Models\User;
use App\Models\UserManager;
use Illuminate\Support\Facades\DB;

class RestaurantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function refid($id)
    {
        $user = User::where('id', $id)->first();
        $role_id = $user['role_id'];

        switch ($role_id) {
            case 1:
            $restaurant = Restaurant::leftJoin('users', 'users.id', '=', 'restaurants.corporate_account')
            ->select('users.reference_number as refid', 'restaurants.*')
            ->get();
                break;
        
            case 2:
                $restaurant = Restaurant::leftJoin('users', 'users.id', '=', 'restaurants.corporate_account')
                    ->select('users.reference_number as refid', 'restaurants.*')
                    ->where('corporate_account', $id)
                    ->get();
                break;
        
            default:
                $userManager = UserManager::where('user_id', $user->id)->first();
                if ($userManager) {
                    $restaurant = $userManager->restaurant; // Assuming you have a relationship set up
                } else {
                    $restaurant = null; // Handle the case where there's no associated restaurant
                }
                break;
        }

        // if ($role_id == 1) {

        // } if ($role_id == 2) {
        //     $restaurant = Restaurant::leftjoin('users', 'users.id', '=', 'restaurants.corporate_account')
        //                 ->select('users.reference_number as refid', 'restaurants.*')
        //                 ->where('corporate_account', $id)
        //                 ->get();
        // } else {
        //     $restaurant = UserManager::where('user_id', $user['id'])->first();
        //     $resto_id = $restaurant['restaurant_id'];

        //     $restaurant = Restaurant::leftjoin('users', 'users.id', '=', 'restaurants.corporate_account')
        //     ->select('users.reference_number as refid', 'restaurants.*')
        //     ->where('restaurants.id', $resto_id)
        //     ->get();
        // }
        
        return response([
            'data' => $restaurant
        ], 200);
    }
    
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        
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
    public function store(StoreRestaurantRequest $request)
    {
        $data = $request->validated();
        $data['created_by'] = $request->created_by;
        $service_center = Restaurant::where('corporate_account', $request->corporate_account)->count();
        $restriction = CorporateRestriction::where('user_id', $request->corporate_account)->first();

        if ($service_center >= $restriction['allowed_restaurant']) {
            return response([
                'errors' => [ 'restriction' => ['Not allowed to create another Restaurant']]
            ], 422);
        } else {
            $municipality = $request->municipality;
            $province = $request->province;
            $ref_id = User::where('id' , $request->corporate_account)->first();
    
            if (strpos($municipality, 'CITY OF ') !== false) {
                $index = strpos($municipality, 'CITY OF ') + strlen('CITY OF ');
                $munshortCode = substr($municipality, $index, 3);
            } else {
                $munshortCode = substr($municipality, 0, 3);
            }
    
            if (strpos($province, 'CITY OF ') !== false) {
                $index = strpos($province, 'CITY OF ') + strlen('CITY OF ');
                $provshortCode = substr($province, $index, 3);
            } else {
                $provshortCode = substr($province, 0, 3);
            }
    
            $reference_number = $munshortCode . '-' . $provshortCode;
            
    
            $restaurant = Restaurant::create($data);
    
            $id = $restaurant->id;
            $formatted_id = sprintf('%02d', $id);
            $reference_number = $munshortCode . '-' . $provshortCode;
    
            $restaurant = Restaurant::find($restaurant->id);
            $restaurant->reference_number = $reference_number . '-' . $formatted_id . '-' . $ref_id['reference_number'];
            $restaurant->save();
        }
        return response([
            'message' => 'Restaurant successfully created'
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
            return RestaurantResource::collection(
                // Service::orderBy('id','desc')->get()
                Restaurant::join('users', 'users.id', 'restaurants.corporate_account')
                        ->select('restaurants.*', 'users.first_name as corporate_name')
                        ->orderBy('id','desc')->get()
             ); 
        } else if ($role_id == 2) {
            return RestaurantResource::collection(
                // Service::orderBy('id','desc')->get()
                Restaurant::orderBy('id','desc')
                    ->where('corporate_account', $id)
                    ->get()
             ); 
        } else {
            $restaurant = UserManager::where('user_id', $id)->first();
            $resto_id = $restaurant['restaurant_id'];
 
            return RestaurantResource::collection(
                // Service::orderBy('id','desc')->get()
                Restaurant::orderBy('id','desc')
                    ->where('id', $resto_id)
                    ->get()
             ); 
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Restaurant $restaurant)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRestaurantRequest $request, Restaurant $restaurant)
    {
        $request->validated();
        $ref_id = User::where('id' , $request->corporate_account)->first();
        $municipality = $request->municipality;
        $province = $request->province;
            
        if (strpos($municipality, 'CITY OF ') !== false) {
            $index = strpos($municipality, 'CITY OF ') + strlen('CITY OF ');
            $shortCode = substr($municipality, $index, 3);
        } else {
            $shortCode = substr($municipality, 0, 3);
        }

        if (strpos($province, 'CITY OF ') !== false) {
            $index = strpos($province, 'CITY OF ') + strlen('CITY OF ');
            $provshortCode = substr($province, $index, 3);
        } else {
            $provshortCode = substr($province, 0, 3);
        }

        $id = $request->id;
        $formatted_id = sprintf('%02d', $id);
        $reference_number = $shortCode . '-' . $provshortCode . '-' . $ref_id['reference_number'];

        $restaurant = Restaurant::find($request->id);
        $restaurant->reference_number = $reference_number . '-' . $formatted_id;
        $restaurant->name = $request->name;
        $restaurant->table_number = $request->table_number;
        $restaurant->house_number = $request->house_number;
        $restaurant->barangay = $request->barangay;
        $restaurant->municipality = $request->municipality;
        $restaurant->province = $request->province;
        $restaurant->longitude = $request->longitude;
        $restaurant->latitude = $request->latitude;
        $restaurant->logo = $request->logo;
        $restaurant->corporate_account = $request->corporate_account;
        $restaurant->updated_by = $request->created_by;
        $restaurant->save(); 

        return response([
            'Success' => 'Restaurant successfully updated'
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Restaurant $restaurant)
    {
        //
    }
}
