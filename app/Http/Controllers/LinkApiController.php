<?php

namespace App\Http\Controllers;

use App\Dtos\LinkDto;
use App\Http\Requests\StoreLinkRequest;
use App\Models\Link;
use App\Services\LinkService;
use Auth;
use Illuminate\Http\Request;

class LinkApiController extends Controller
{
    protected LinkService $linkService;

    public function __construct(LinkService $linkService)
    {
        $this->linkService = $linkService;
    }

    public function index()
    {
        return $this->linkService->links_by_user_id(Auth::user()->id);
    }

    public function show(int $id)
    {
        return new LinkDto(Link::findOrFail($id));
    }

    public function store(StoreLinkRequest $request)
    {
        $validated = $request->validated();
        $link = $this->linkService->createLink($validated, Auth::user()->id);
        return response(new LinkDto($link), 201);
    }

    public function sync(Request $request)
    {
        $request->validate([
            'link_ids' => 'required|array',
            'link_ids.*' => 'integer',
        ]);
        $links = Link::where('user_id', Auth::user()->id)->whereNotIn('id', $request->link_ids)->get();
        return array_map(fn($link) => new LinkDto($link), $links->all());
    }
}
