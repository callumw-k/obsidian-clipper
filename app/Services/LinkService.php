<?php

namespace App\Services;

use App\Dtos\LinkDto;
use App\Jobs\CrawlUrlJob;
use App\Models\Link;
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

    public function links_by_user_id(int $userId): array
    {
        $links = $this->repository->links_by_user_id_by_descending($userId);
        return array_map(function (Link $link) {
            return new LinkDto($link);
        }, $links->all());
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
