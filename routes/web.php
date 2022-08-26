<?php

use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('home');
});

Route::get('/dashboard', function () {
    return view('/admin/dash');
})->middleware(['auth'])->name('dashboard');

require __DIR__.'/auth.php';

Route::get('/add-student',[StudentController::class,'show']);
Route::post('/added-student',[StudentController::class,'store']);

Route::get('/search-student',[StudentController::class,'searchStd']);
Route::get('/searched-student',[StudentController::class,'searched_student']);

Route::get('/view-bonafide/{student}',[StudentController::class,'bonafide'])->name('bonafide');

