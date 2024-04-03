<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Waiter\OrderController as WaiterOrderController;
use App\Http\Controllers\Api\Web\ActualInventoryController;
use App\Http\Controllers\Api\Web\CategoryController;
use App\Http\Controllers\Api\Web\IngredientsController;
use App\Http\Controllers\Api\Web\MenuController;
use App\Http\Controllers\Api\Web\MenuTabController;
use App\Http\Controllers\Api\Web\OrderController;
use App\Http\Controllers\Api\Web\PromoController;
use App\Http\Controllers\Api\Web\ReserveController;
use App\Http\Controllers\Api\Web\RestaurantController;
use App\Http\Controllers\Api\Web\SystemInventoryController;
use App\Http\Controllers\Api\Web\UserController;
use App\Http\Controllers\Kitchen\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

/*

Resource:
index - url/api/web/category : get
show - url/api/web/category/{id} : get with id
store - url/api/web/category/{id} : post
update - url/api/web/category/{id} : put
destroy - url/api/web/category/{id} : delete

*/
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE, PATCH');
header('Access-Control-Allow-Headers: Content-Type, X-Auth-Token, Origin, Authorization, X-Socket-Id');

Route::middleware(['auth:sanctum'])->group(function () {
    // Admin Panel
    Route::resource('/web/users', UserController::class);
    Route::resource('/web/restaurant', RestaurantController::class);
    Route::resource('/web/menutab', MenuTabController::class);
    Route::resource('/web/category', CategoryController::class);
    Route::resource('/web/menu', MenuController::class);
    Route::resource('/web/ingredients', IngredientsController::class);
    Route::resource('/web/order', OrderController::class);
    Route::resource('/web/promo', PromoController::class);
    Route::resource('/web/system_inventory', SystemInventoryController::class);
    Route::resource('/web/actual_inventory', ActualInventoryController::class);
    Route::resource('/web/reservation', ReserveController::class);


    // Get category for sample
    Route::get('/web/category_sample/{id}', [UserController::class, 'sample']);

    // Get Profile
    Route::get('/web/profile/{id}', [UserController::class, 'profile']);
    // Get User Access
    Route::get('/web/user_access/{id}', [UserController::class, 'access']);
    // Get Restaurant Menu
    Route::get('/web/restaurant/menu/{id}', [MenuController::class, 'menus']);
    // Get COrporate Account
    Route::get('/web/corporate_account/{id}', [UserController::class, 'corporate_account']);
    // Get Restaurant with corporate reference number
    Route::get('/web/restaurant_refid/{id}', [RestaurantController::class, 'refid']);
    // Update System inventory
    Route::get('/web/system_inventory_update/{id}', [SystemInventoryController::class, 'update_inventory']);
    // Get Order
    Route::get('/web/cashier/{id}', [OrderController::class, 'cashier']);
    Route::put('/web/cashier_voucher/{id}', [OrderController::class, 'voucher']);
    Route::put('/web/cashier_special', [OrderController::class, 'special']);
    Route::put('/web/cashier_update', [OrderController::class, 'CashierUpdate']);
    // Order Complete
    Route::put('/web/order_complete/{id}', [OrderController::class, 'OrderComplete']);
    // Get Order
    Route::get('/web/waiter/{id}', [OrderController::class, 'waiter']);
    // Void Manager Login
    Route::post('/web/void', [UserController::class, 'void']);

    Route::get('/web/remaining/{id}', [IngredientsController::class, 'remaining']);

    // Route::get('/web/summary/{id}', [IngredientsController::class, 'summary']);
    Route::get('/web/summary/{id}/{startDate}/{endDate}', [IngredientsController::class, 'summary']);

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);
});
// Input Voucher Code
Route::get('/web/voucher/{id}', [PromoController::class, 'voucher']);
Route::get('/web/voucher_delete', [PromoController::class, 'delete']);

Route::post('/web/order', [OrderController::class, 'store']);
Route::get('/kitchen/getorder/{id}', [Order::class, 'getOrder']);
Route::get('/kitchen/order_details/{id}', [Order::class, 'OrderDetails']);
Route::put('/kitchen/status_update/{id}', [Order::class, 'UpdateStatus']);

Route::get('/waiter/order_status/{id}', [WaiterOrderController::class, 'OrderStatus']);
Route::put('/waiter/status_update/{id}', [WaiterOrderController::class, 'StatusServed']);
Route::get('/web/menusrandy/{id}', [MenuController::class, 'index']);
Route::get('/web/menurandy/{id}', [MenuTabController::class, 'index']);
Route::get('/web/categoryrandy/{id}', [CategoryController::class, 'index']);

Route::post('/login', [AuthController::class, 'login']);

// http://192.168.100.100:8000/api/web/menurandy