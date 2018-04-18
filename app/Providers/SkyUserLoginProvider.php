<?php
/**
 * Created by PhpStorm.
 * User: fusun
 * Date: 2018/4/17
 * Time: 下午 09:28
 */

namespace App\Providers;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Contracts\Auth\Authenticatable as UserContract;
use Illuminate\Database\ConnectionInterface;

class SkyUserLoginProvider implements UserProvider
{
    protected $conn = null;

    public function __construct(ConnectionInterface $conn)
    {
        $this->conn = $conn;
    }

    public function retrieveById($identifier)
    {
        $user = $this->conn->table('LogAccount')
            ->where('account', '=', $identifier)
            ->first();

        //dd($user);
        return $this->getGenericUser($user);
        //exit;
    }

    public function retrieveByToken($identifier, $token)
    {
        echo('到此一遊B');
        //exit;
    }

    public function updateRememberToken(Authenticatable $user, $token)
    {
        echo('到此一遊C');
        //exit;
    }

    public function retrieveByCredentials(array $credentials)
    {
        //方法接收當嘗試登入應用程式時，傳遞到 Auth::attempt 方法的憑證陣列。
        //這個方法應該接著「查詢」底層使用的永久存儲，找到符合憑證的使用者。
        //這個方法通常會對 $credentials['username'] 用「 where 」條件查詢。
        //這個方法應該回傳一個 UserInterface 的實作。
        //這個方法不應該嘗試做任何密碼驗證或認證。


        if (empty($credentials) ||
            (count($credentials) === 1 &&
                array_key_exists('password', $credentials))) {
            return;
        }

        $account = $credentials['email'];
        $query = $this->conn->table('LogAccount')->where('account', $account);
        $user = $query->first();

        return $this->getGenericUser($user);
        // 用$credentials里面的用户名密码去获取用户信息，然后返回Illuminate\Contracts\Auth\Authenticatable对象
    }

    public function validateCredentials(Authenticatable $user, array $credentials)
    {
        //方法應該藉由比較給定的 $user 與 $credentials 來驗證使用者。
        //舉例來說，這個方法可以比較 $user->getAuthPassword() 字串跟 Hash::make 後的 $credentials['password']。
        //這個方法應該只驗證使用者的憑證並回傳布林值。

        echo('到此一遊E');

        //dd($user, $credentials);

        //exit;
        // 用$credentials里面的用户名密码校验用户，返回true或false
        //dd($user);

        //exit;

        //dd($credentials['password'], $user->getAuthPassword());

        return $credentials['password'] == $user->getAuthPassword();

    }

    protected function getGenericUser($user)
    {
        if (!is_null($user)) {
            return new SkyUser((array)$user);
        }
    }

}

class SkyUser implements UserContract
{
    /**
     * All of the user's attributes.
     *
     * @var array
     */
    protected $attributes;

    /**
     * Create a new generic User object.
     *
     * @param  array $attributes
     * @return void
     */
    public function __construct(array $attributes)
    {
        $this->attributes = $attributes;
    }

    /**
     * Get the name of the unique identifier for the user.
     *
     * @return string
     */
    public function getAuthIdentifierName()
    {
        return 'account';
    }

    /**
     * Get the unique identifier for the user.
     *
     * @return mixed
     */
    public function getAuthIdentifier()
    {
        $name = $this->getAuthIdentifierName();

        return $this->attributes[$name];
    }

    /**
     * Get the password for the user.
     *
     * @return string
     */
    public function getAuthPassword()
    {
        return $this->attributes['log_pwd'];
    }

    /**
     * Get the "remember me" token value.
     *
     * @return string
     */
    public function getRememberToken()
    {
        return $this->attributes[$this->getRememberTokenName()];
    }

    /**
     * Set the "remember me" token value.
     *
     * @param  string $value
     * @return void
     */
    public function setRememberToken($value)
    {
        $this->attributes[$this->getRememberTokenName()] = $value;
    }

    /**
     * Get the column name for the "remember me" token.
     *
     * @return string
     */
    public function getRememberTokenName()
    {
        return 'remember_token';
    }

    /**
     * Dynamically access the user's attributes.
     *
     * @param  string $key
     * @return mixed
     */
    public function __get($key)
    {
        return $this->attributes[$key];
    }

    /**
     * Dynamically set an attribute on the user.
     *
     * @param  string $key
     * @param  mixed $value
     * @return void
     */
    public function __set($key, $value)
    {
        $this->attributes[$key] = $value;
    }

    /**
     * Dynamically check if a value is set on the user.
     *
     * @param  string $key
     * @return bool
     */
    public function __isset($key)
    {
        return isset($this->attributes[$key]);
    }

    /**
     * Dynamically unset a value on the user.
     *
     * @param  string $key
     * @return void
     */
    public function __unset($key)
    {
        unset($this->attributes[$key]);
    }

}