@extends('layouts.RLayout')
@section('RenderBody')
    <main id="main">
        <h1 class="site-title">
            大桃園超級籃球聯盟管理系統
            <small class="text-muted ml-8 font-sp">Web Manager</small>
        </h1>
        <h6 class="sub-copyright">TAOYUAN SUPER BASKETBALL ALLIANCE &copy; 2017</h6>

        <form id="frm" class="text-left" autocomplete="off" method="post">
            <header class="title font-sp">System Login</header>

            <main class="clearfix">
                <label>帳號 Username</label>
                <input id="account" type="text" class="mb-12" placeholder="請輸入帳號" required>

                <label>密碼 Password</label>
                <input id="password" type="password" class="mb-12" placeholder="請輸入密碼" required>

                <label>驗證碼 Code</label>
                <br>
                <input id="validate" type="text" class="mb-4" placeholder="請輸入驗證碼" required>
                <img alt="驗證碼" id="validate_img" src="/Ah/VC.ashx?vn=CheckCode"/>

            </main>

            <footer class="action-bar text-center">
                <button type="submit" class="btn danger">登入 LOGIN</button>
            </footer>
        </form>
    </main>
@stop


@section('IncludeScript')
    <script>
        var ValidateCode = 'CheckCode';
    </script>
    <script src="/Scripts/build/app/login.js?v=a336e7c3-294b-4bc8-a058-f3b84d526479"></script>
@stop