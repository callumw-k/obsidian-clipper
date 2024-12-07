<?php

namespace App\Http\Controllers;

use App\Models\Link;
use App\Services\LinkService;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
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

    public function processRedirect(Request $request)
    {
        $path = $request->path();
        $link = Link::where('path', $path)->first();
        if (!$link) {
            abort(404, 'Shortened URL not found');
        }
        return redirect($link->original_url);
    }
}