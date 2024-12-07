<?php

namespace App\Http\Controllers;

use App\Models\Link;
use App\Services\LinkService;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Log;

class LinkController extends Controller
{
    protected LinkService $linkService;

    public function __construct(LinkService $linkService)
    {
        $this->linkService = $linkService;
    }

    public function index()
    {
        return Inertia::render('Dashboard', [
            'links' => Link::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'original_url' => ['required', 'url'],
            'title' => ['nullable', 'string', 'max:255'],
        ]);

        $user_id = Auth::id();

        $this->linkService->createLink($validated, $user_id);

        return to_route('dashboard');
    }
}
