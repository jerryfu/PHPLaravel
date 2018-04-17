<?php

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
    return view('welcome');
});


Route::group(['middleware' => [], 'prefix' => '_SysAdm', 'namespace' => 'Www'], function () {
    Route::get('', 'LoginController@index');
    Route::post('loginCheck', 'LoginController@login_check');
});


Route::group(['prefix' => 'todo'], function () {
    Route::get('index', 'ToDoController@index')->name('todo.index');
    Route::get('say', 'ToDoController@say')->name('todo.say');
});

