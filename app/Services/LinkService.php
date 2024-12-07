<?php

namespace App\Services;

use Symfony\Component;

use App\Repositories\LinkRepository;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Log;
use Symfony\Component\DomCrawler\Crawler;

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


        $html = Http::get($data['original_url'])->body();

        $crawler = new Crawler($html);
        $crawler->filterXPath('//title')->text();


        return $this->repository->create([
            'original_url' => $data['original_url'],
            'path' => $shortPath,
            'title' => $data['title'] ?? null,
            'user_id' => $userId,
        ]);
    }
}
