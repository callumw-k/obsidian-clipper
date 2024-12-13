<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLinkRequest;
use App\Models\Link;
use App\Services\LinkService;
use Auth;
use Illuminate\Http\Request;

class LinkController extends Controller
{
    protected LinkService $linkService;

    public function __construct(LinkService $linkService)
    {
        $this->linkService = $linkService;
    }


    public function api_index()
    {
        $user_id = Auth::id();
        return $this->linkService->links_by_user_id($user_id);
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

    public function delete(int $id)
    {
        Auth::user()->links()->findOrFail($id)->delete();
        return to_route('dashboard')->with('success', 'Link deleted successfully.');
    }

    public function store(StoreLinkRequest $request)
    {
        $validated = $request->validated();

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
        return redirect()->away($link->original_url);
    }
}
