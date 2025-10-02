<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // Vérifier que l'utilisateur est bien un Admin (pas un User)
        if (!($user instanceof \App\Models\Admin)) {
            return response()->json(['message' => 'Forbidden - Admin access required'], 403);
        }

        return $next($request);
    }
}
