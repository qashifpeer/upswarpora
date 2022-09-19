<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <title>MDM_calculator By Qashif Peer</title>
</head>
<body class="flex flex-col min-h-screen">
@include('myLayouts.nav')

@yield('main')


@include('myLayouts.footer')


</body>
</html>
