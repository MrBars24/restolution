<?php

namespace App\Http\Controllers\Api\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\StoreReservationRequest;
use App\Http\Requests\Web\UpdateReservationRequest;
use App\Http\Resources\Web\ReservationResource;
use App\Models\Reservation;
use App\Models\Restaurant;
use App\Models\User;
use App\Models\UserManager;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReserveController extends Controller
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
    public function store(StoreReservationRequest $request)
    {
        $data = $request->validated();

        $user = User::find($request->created_by);
        $role = $user->role_id;

        if ($role == 2) {
            $restaurant = Restaurant::where('corporate_account', $user['id'])->first();
            $resto_id = $restaurant['id'];

            $data['created_by'] = $request->created_by;
            $data['restaurant_id'] = $resto_id;
        } else if ($role == 3) {
            $restaurant = UserManager::where('user_id', $user['id'])->first();
            $resto_id = $restaurant['restaurant_id'];

            $data['created_by'] = $request->created_by;
            $data['restaurant_id'] = $resto_id;
        } else if ($role == 1) {
            $manager = UserManager::where('user_id', $request->created_by)->first();

            $data['created_by'] = $request->created_by;
            $data['restaurant_id'] = $$manager->restaurant_id ?? 1;
        }

        Reservation::create($data);

        return response([
            'message' => 'Reservation successfully created'
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
            return ReservationResource::collection(
                Reservation::leftjoin('users as created', 'created.id', 'reservations.created_by')
                    ->leftjoin('users as updated', 'updated.id', 'reservations.updated_by')
                    ->select('reservations.*', DB::raw("CONCAT(created.first_name, ' ', created.last_name) as createdBy"), DB::raw("CONCAT(updated.first_name, ' ', updated.last_name) as updatedBy"))
                    ->orderBy('id','desc')->get()
             );
        } else if ($role_id == 2) {
            return ReservationResource::collection(
                Reservation::join('restaurants', 'restaurants.id', 'reservations.restaurant_id')
                    ->leftjoin('users as created', 'created.id', 'reservations.created_by')
                    ->leftjoin('users as updated', 'updated.id', 'reservations.updated_by')
                    ->select('reservations.*', DB::raw("CONCAT(created.first_name, ' ', created.last_name) as createdBy"), DB::raw("CONCAT(updated.first_name, ' ', updated.last_name) as updatedBy"))
                    ->where('restaurants.corporate_account', $id)
                    ->orderBy('id','desc')
                    ->get()
             );
        } else if ($role_id > 2) {
            $item = UserManager::with(['restaurant'])->where("user_id", $id)->first();
            $restaurant = $item->restaurant;

            return ReservationResource::collection(
                Reservation::join('restaurants', 'restaurants.id', 'reservations.restaurant_id')
                    ->leftjoin('users as created', 'created.id', 'reservations.created_by')
                    ->leftjoin('users as updated', 'updated.id', 'reservations.updated_by')
                    ->select('reservations.*', DB::raw("CONCAT(created.first_name, ' ', created.last_name) as createdBy"), DB::raw("CONCAT(updated.first_name, ' ', updated.last_name) as updatedBy"))
                    ->where('restaurants.corporate_account', $restaurant->corporate_account)
                    ->orderBy('id','desc')
                    ->get()
             );
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Reservation $reservation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReservationRequest $request, Reservation $reservation)
    {
        $request->validated();

        $reservation = Reservation::find($request->id);
        $reservation->table_number = $request->table_number;
        $reservation->date = $request->date;
        $reservation->time = $request->time;
        $reservation->number_of_guest = $request->number_of_guest;
        $reservation->guest_name = $request->guest_name;
        $reservation->notes = $request->notes;
        $reservation->updated_by = $request->created_by;
        $reservation->save();

        return response([
            'Success' => 'Reservation successfully updated'
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reservation $reservation)
    {
        //
    }
}
