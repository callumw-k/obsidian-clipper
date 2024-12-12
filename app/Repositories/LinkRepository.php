<?php

namespace App\Repositories;

use App\Models\Link;

class LinkRepository
{
    public function create(array $data): Link
    {
        return Link::create($data);
    }

    public function update(int $id, array $data): bool
    {
        return Link::where('id', $id)->update($data);
    }

    public function findByPath(string $path): ?Link
    {
        return Link::where('path', $path)->first();
    }

    public function links_by_user_id(int $userId, ?array $filter = ['*']): ?array
    {
        return Link::where('user_id', $userId)->orderByDesc('created_at')->get($filter);
    }
}
