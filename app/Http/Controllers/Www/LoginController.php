<?php

namespace App\Http\Controllers\Www;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LoginController extends Controller
{
    use AuthenticatesUsers;
    protected $redirectTo = '/home';

    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    //
    public function index()
    {
        $account = DB::table('LogAccount')->get();
        dd($account);

        return view('Www/login');
    }

    public function login_check(Request $request)
    {
        $pdo = DB::connection()->getPdo();
        //dd($pdo);
        return "{result:1}";
    }
}
