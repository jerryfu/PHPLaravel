<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Laravel\Passport\Passport;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
        $this->register();

        $conn = DB::connection();

        Auth::provider('sky_user', function ($app, array $config) use ($conn) {
            // Return an instance of Illuminate\Contracts\Auth\UserProvider...
            return new SkyUserLoginProvider($conn);
        });


        Auth::provider('sky_mbr', function ($app, array $config) use ($conn) {
            // Return an instance of Illuminate\Contracts\Auth\UserProvider...
            return new SkyMberLoginProvider($conn);
        });


        Passport::routes();
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
