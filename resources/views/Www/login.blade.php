<!doctype html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans">
    <link rel="stylesheet" href="/Content/css/vendor/open-iconic.css">
    <link rel="stylesheet" href="/Content/css/vendor/toastr.css"/>
    <link rel="stylesheet" href="/Content/css/grid.css">
    <link rel="stylesheet" href="/Content/css/login.css">
    <script>
        var gb_approot = '/';
        var gb_menu_id = 0;
        var account = '';
        var role = '';
        var workYear = 2017;

        function mlog(...args) {
            console.log(args);
        }
    </script>
    <script src="/Scripts/res/lang.js"></script>
<body class="Login">
<div class="wrapper">
    <main id="main">


        <h1 class="site-title">
            大桃園超級籃球聯盟管理系統
            <small class="text-muted ml-8 font-sp">Web Manager</small>
        </h1>
        <h6 class="sub-copyright">TAOYUAN SUPER BASKETBALL ALLIANCE &copy; 2017</h6>

        <form id="frm" class="text-left" autocomplete="off">

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
</div>
<footer id="footer">
    <div class="copyright text-muted font-sp">&copy; TSBA</div>

    <small class="text-muted">本網站適用 Chrome, firefox, IE10.0+, 最佳瀏覽解析度為 1280*800 以上</small>
</footer><!-- footer //-->


<script src="/Scripts/cdn/jquery.min.js"></script>
<script src="/Scripts/build/app/vendors.js?v=f1f24e5e-2508-4996-84a9-c58eee361eb7"></script>
<script>
    $("#logout").click(function (e) {
        if (confirm(lang.logout_sure)) {
            location.href = gb_approot + '_SysAdm/Logout';
        }
    });

    var paramjs = [{
        "key": "FirstLoginPage",
        "field": "登入後頁面",
        "value": "Active/Func/Team?menu_id=2",
        "sort": "1",
        "valuetype": "string",
        "type": "F",
        "roles": ["S"]
    }, {
        "key": "FirstLoginPageUser",
        "field": "登入後頁面",
        "value": "Active/Func/Team?menu_id=2",
        "sort": "1",
        "valuetype": "string",
        "type": "F",
        "roles": ["S"]
    }, {
        "key": "WorkingYear",
        "field": "系統年度",
        "value": "2017",
        "sort": "1",
        "valuetype": "number",
        "type": "F",
        "roles": ["S", "A"]
    }, {
        "key": "NewsListLimit",
        "field": "本季新聞列表筆數",
        "value": "10",
        "sort": "1",
        "valuetype": "number",
        "type": "F",
        "roles": ["S", "A"]
    }, {
        "key": "VideoLinkLimit",
        "field": "影片回顧列表筆數",
        "value": "10000",
        "sort": "1",
        "valuetype": "number",
        "type": "F",
        "roles": ["S", "A"]
    }, {
        "key": "AlbumListLimit",
        "field": "花絮圖集列表筆數",
        "value": "10",
        "sort": "1",
        "valuetype": "number",
        "type": "F",
        "roles": ["S", "A"]
    }, {
        "key": "NewsListWordsLimit",
        "field": "最新消息列表字數限製",
        "value": "45",
        "sort": "1",
        "valuetype": "number",
        "type": "F",
        "roles": ["S"]
    }, {
        "key": "ScheduleListLimit",
        "field": "近期賽事列表筆數",
        "value": "8",
        "sort": "1",
        "valuetype": "number",
        "type": "F",
        "roles": ["S", "A"]
    }];

</script>

<script>
    var ValidateCode = 'CheckCode';
</script>
<script src="/Scripts/build/app/login.js?v=a336e7c3-294b-4bc8-a058-f3b84d526479"></script>

</body>
</html>
