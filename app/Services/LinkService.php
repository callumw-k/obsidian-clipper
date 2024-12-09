<?php

namespace App\Services;

use App\Jobs\CrawlUrlJob;
use App\Repositories\LinkRepository;
use Illuminate\Support\Str;

class LinkService
{
    protected LinkRepository $repository;

    public function __construct(LinkRepository $repository)
    {
        $this->repository = $repository;
    }

    public function update(int $id, array $data): bool
    {
        return $this->repository->update($id, $data);

    }

    public function createLink(array $data, int $userId)
    {
        do {
            $shortPath = Str::random(6);
        } while ($this->repository->findByPath($shortPath));


        $link = $this->repository->create([
            'original_url' => $data['original_url'],
            'path' => $shortPath,
            'user_id' => $userId,
        ]);


        CrawlUrlJob::dispatch($link);

        return $link;
    }


}
