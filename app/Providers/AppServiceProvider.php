<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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
