<?php

namespace App\Services;

use App\Repositories\LinkRepository;
use Illuminate\Support\Str;

class LinkService
{
    protected LinkRepository $repository;

    public function __construct(LinkRepository $repository)
    {
        $this->repository = $repository;
    }

    public function createLink(array $data, int $userId)
    {
        do {
            $shortPath = Str::random(6);
        } while ($this->repository->findByPath($shortPath));

        return $this->repository->create([
            'original_url' => $data['original_url'],
            'path' => $shortPath,
            'title' => $data['title'] ?? null,
            'user_id' => $userId,
        ]);
    }
}
