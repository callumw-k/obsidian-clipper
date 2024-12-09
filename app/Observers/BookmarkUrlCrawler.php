<?php

namespace App\Observers;

use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\UriInterface;
use Spatie\Crawler\CrawlObservers\CrawlObserver;
use Symfony\Component\DomCrawler\Crawler;

class BookmarkUrlCrawler extends CrawlObserver
{

    private $content;

    public function __construct()
    {
        $this->content = null;
    }

    /*
     * Called when the crawler will crawl the url.
     */
    public function willCrawl(UriInterface $url, ?string $linkText): void
    {
        Log::info('willCrawl', ['url' => $url]);
    }

    /*
     * Called when the crawler has crawled the given url successfully.
     */
    public function crawled(
        UriInterface      $url,
        ResponseInterface $response,
        ?UriInterface     $foundOnUrl = null,
        ?string           $linkText = null,
    ): void
    {
        Log::info("Crawled: {$url}");
        $html = $response->getBody();
        $value = $this->getTitleAndImageForUrl($html, $url);
        Log::info("Crawled: {$value['title']}");

    }

    /*
     * Called when the crawler had a problem crawling the given url.
     */
    public function crawlFailed(
        UriInterface     $url,
        RequestException $requestException,
        ?UriInterface    $foundOnUrl = null,
        ?string          $linkText = null,
    ): void
    {
        Log::error("Failed: {$url}");
        Log::error($requestException);
    }

    /*
     * Called when the crawl has ended.
     */
    public function finishedCrawling(): void
    {
        Log::info("Finished crawling");
    }

    public function getTitleAndImageForUrl(string $html, string $url): array
    {

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
