<!DOCTYPE html>
<html>

<meta name="csrf-token" content="{{ csrf_token() }}">
<meta name="robots" content="noindex">

<head>
    <meta charset="UTF-8">
    <title>MyWears</title>

    @viteReactRefresh
    @vite('resources/js/app.jsx')

</head>

<body>

    <div id="app"></div>

</body>

</html>
