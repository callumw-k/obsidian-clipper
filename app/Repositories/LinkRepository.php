<?php

namespace App\Repositories;

use App\Models\Link;

class LinkRepository
{
    public function create(array $data): Link
    {
        return Link::create($data);
    }

    public function findByPath(string $path): ?Link
    {
        return Link::where('path', $path)->first();
    }
}
