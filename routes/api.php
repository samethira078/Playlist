<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
Use App\Http\Controllers\Songs;
use App\Http\Controllers\PlaylistController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/demo', function () {
        return 'Hello World';
    });
    Route::get('/user/playlist', [PlaylistController::class, 'getPlaylist']);
    Route::post('/user/playlist/songs', [PlaylistController::class, 'getPlaylistSongs']);
    Route::post('/user/add/song', [PlaylistController::class, 'addSongToPlaylist']);
    Route::post('/user/remove/song', [PlaylistController::class, 'removeSongFromPlaylist']);
    Route::post('/user/playlist/create', [PlaylistController::class, 'createPlaylist']);

});

Route::post('/user/validate', [UserController::class, 'user_Login']);
Route::post('/user/register', [UserController::class, 'user_register']);
Route::get('/songs/all', [Songs::class, 'list']);
