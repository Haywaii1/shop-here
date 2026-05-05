<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        // If the request expects JSON, don't redirect (API client).
        // For non-API requests, use a URL instead of a named route
        // to avoid exceptions when the `login` route isn't defined.
        return $request->expectsJson() ? null : url('/login');
    }
}
