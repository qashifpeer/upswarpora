<?php

use App\Http\Controllers\FrontendController;
use App\Http\Controllers\MarksController;
use App\Http\Controllers\MdmController;
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



Route::get('/search-student',[FrontendController::class,'searchStd']);
Route::get('/searched-student',[FrontendController::class,'searched_student']);
Route::get('/view-bonafide/{student}',[FrontendController::class,'bonafide'])->name('bonafide');
Route::get('/view-marksSheet/{student}',[FrontendController::class,'marksSheet'])->name('marksSheet');

Route::get('/mdm',[MdmController::class,'index']);
Route::post('mdm/submit',[MdmController::class,'calculate']);

Route::get('/admin/add-student',[StudentController::class,'index'])->middleware('auth');
Route::post('/admin/added-student',[StudentController::class,'store'])->middleware('auth');

Route::get('/admin/add-marks/{student}',[MarksController::class,'index'])->middleware('auth');
Route::post('/admin/added-marks',[MarksController::class,'store'])->middleware('auth');

Route::get('/admin/view-student',[StudentController::class,'show'])->middleware('auth');




