<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WorkLogController;
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



Route::prefix('employee')->group(function () {
    // Get all employees
    Route::get('/', [WorkLogController::class, 'index'])->name('employee.index');

    // Get a specific employee by ID
    Route::get('/{id}', [WorkLogController::class, 'show'])->name('employee.show');

    // Create a new employee
    Route::post('/', [WorkLogController::class, 'store'])->name('employee.store');

    // Update an existing employee by ID
    Route::put('/{id}', [WorkLogController::class, 'update'])->name('employee.update');

    // Delete a employee by ID
    Route::delete('/{id}', [WorkLogController::class, 'destroy'])->name('employee.destroy');
});
