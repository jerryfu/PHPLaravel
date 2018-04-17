<?php

namespace App\Http\Controllers\Www;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LoginController extends Controller
{
    //
    public function index()
    {

        return view('Www/login');
    }

    public function login_check(Request $request)
    {
        $pdo = DB::connection()->getPdo();
        //dd($pdo);
        return "{result:1}";
    }
}
