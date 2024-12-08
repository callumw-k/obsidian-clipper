<?php

namespace App\Http\Controllers;

use App\Models\Link;
use App\Services\LinkService;
use Auth;
use Illuminate\Http\Request;
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

    public function update(Request $request, int $id)
    {

        $validated = $request->validate([
            'original_url' => ['nullable', 'url'],
            'title' => ['nullable', 'string', 'max:255'],
        ]);


        $update = $this->linkService->update($id, $validated);
       
        if ($update) {
            return to_route('dashboard')->with('success', 'Link updated successfully.');
        }

        return to_route('dashboard')->with('error', 'Unable to update link.');
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
