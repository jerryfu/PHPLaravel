<?php

namespace App\Http\Controllers\Www;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    //use AuthenticatesUsers;
    //protected $redirectTo = '/home';

    public function __construct()
    {
        //$this->middleware('guest')->except('logout');
    }

    //
    public function index()
    {
        //$account = DB::table('LogAccount')->get();
        //dd($account);

        return view('Www/login');
    }

    public function login_check(Request $request)
    {
        //$pdo = DB::connection()->getPdo();
        //dd($pdo);

        $value = $request->only('account', 'password');

        $result = $this->guard()->attempt($value, $request->filled('remember'));

        if ($result) {
            return 1;
        } else {
            return 0;
        }
    }

    protected function guard()
    {
        return Auth::guard('mbr');
    }

}
