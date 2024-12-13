<?php

namespace App\Http\Controllers;

use App\Services\LinkService;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected LinkService $linkService;

    public function __construct(LinkService $linkService)
    {
        $this->linkService = $linkService;
    }

    public function index()
    {
        $user = \Auth::user();
        $links = $this->linkService->links_by_user_id($user->id);
        return Inertia::render('Dashboard', ['links' => $links, 'user' => $user]);
    }

}
