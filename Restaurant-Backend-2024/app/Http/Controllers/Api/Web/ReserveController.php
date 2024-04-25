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
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
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
        } else if ($role == 5) {
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

        $query = Reservation::query();

        if ($request->has("filters")) {
            foreach ($filters as $key => $value) {
                if ($value["column"] === "restaurant.name") {
                    $query->whereHas('restaurant', function ($q) use ($value) {
                        $q->where('name', 'LIKE', "%{$value["value"]}%");
                    });
                } else if ($value["column"] === "created_at" && $value["operator"] == "RANGE") {
                    [$start, $end] = explode("_", $value["value"]);
                    $query->whereBetween("reservations.created_at", [$start, $end]);
                } else {
                    $col = $value["column"];

                    if ($col == "restaurant_id") $col = "reservations.restaurant_id";

                    $query->where($col, 'LIKE', "%{$value["value"]}%");
                }
            }
        }

        if ($role_id == 1) {
            $query->leftjoin('users as created', 'created.id', 'reservations.created_by')
                ->leftjoin('users as updated', 'updated.id', 'reservations.updated_by')
                ->select('reservations.*', DB::raw("CONCAT(created.first_name, ' ', created.last_name) as createdBy"), DB::raw("CONCAT(updated.first_name, ' ', updated.last_name) as updatedBy"));
        } else if ($role_id == 2) {
            $query->join('restaurants', 'restaurants.id', 'reservations.restaurant_id')
                ->leftjoin('users as created', 'created.id', 'reservations.created_by')
                ->leftjoin('users as updated', 'updated.id', 'reservations.updated_by')
                ->select('reservations.*', DB::raw("CONCAT(created.first_name, ' ', created.last_name) as createdBy"), DB::raw("CONCAT(updated.first_name, ' ', updated.last_name) as updatedBy"))
                ->where('restaurants.corporate_account', $id);
        } else if ($role_id > 2) {
            $item = UserManager::with(['restaurant'])->where("user_id", $id)->first();
            $restaurant = $item->restaurant;

            $query->join('restaurants', 'restaurants.id', 'reservations.restaurant_id')
                ->leftjoin('users as created', 'created.id', 'reservations.created_by')
                ->leftjoin('users as updated', 'updated.id', 'reservations.updated_by')
                ->select('reservations.*', DB::raw("CONCAT(created.first_name, ' ', created.last_name) as createdBy"), DB::raw("CONCAT(updated.first_name, ' ', updated.last_name) as updatedBy"))
                ->where('restaurants.corporate_account', $restaurant->corporate_account);
        }

        if ($isPrint) {
            $data = ReservationResource::collection($query->orderBy($orderBy, $orderDirection)->get());
            $pdf = Pdf::loadView('reservation_report_pdf', ['data' => $data]);
            return $pdf->stream('test.pdf');
        } else {
            return ReservationResource::collection($query->orderBy($orderBy, $orderDirection)->paginate($perPage, $columns = ['*'], $pageName = 'page', $currentPage + 1));
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
