<?php

namespace App\Services;

use App\Repositories\LinkRepository;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Symfony\Component\DomCrawler\Crawler;

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

        $scrapedData = $this->getTitleAndImageForUrl($data['original_url']);

        return $this->repository->create([
            'original_url' => $data['original_url'],
            'path' => $shortPath,
            'title' => $scrapedData['title'],
            'image' => $scrapedData['image_url'],
            'user_id' => $userId,
        ]);
    }

    public function getTitleAndImageForUrl(string $url): array
    {

        $html = Http::get($url)->body();
        $crawler = new Crawler($html);

        $title = '';

        if ($crawler->filterXPath('//meta[@property="og:title"]')->count() > 0) {
            $title = $crawler->filterXPath('//meta[@property="og:title"]')->attr('content');
        }

        if (!$title && $crawler->filterXPath('//title')->count() > 0) {
            $title = $crawler->filterXPath('//title')->text();
        }

        $image = '';

        if ($crawler->filterXPath('//meta[@property="og:image"]')->count() > 0) {
            $image = $crawler->filterXPath('//meta[@property="og:image"]')->attr('content');
        }

        if (!$image) {
            $favicon = '';

            if ($crawler->filterXPath('//link[@rel="icon"]')->count() > 0) {
                $favicon = $crawler->filterXPath('//link[@rel="icon"]')->attr('href');
            } elseif ($crawler->filterXPath('//link[@rel="shortcut icon"]')->count() > 0) {
                $favicon = $crawler->filterXPath('//link[@rel="shortcut icon"]')->attr('href');
            }

            if ($favicon && !Str::startsWith($favicon, ['http://', 'https://'])) {
                $favicon = rtrim($url, '/') . '/' . ltrim($favicon, '/');
            }

            $image = $favicon;
        }

        return [
            'title' => $title,
            'image_url' => $image,
        ];
    }
}
