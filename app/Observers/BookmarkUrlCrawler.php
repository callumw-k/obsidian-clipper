<?php

namespace App\Observers;

use App\Events\LinkImageUpdated;
use App\Models\Link;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\UriInterface;
use Spatie\Crawler\CrawlObservers\CrawlObserver;
use Symfony\Component\DomCrawler\Crawler;

class BookmarkUrlCrawler extends CrawlObserver
{

    public string $title = '';
    public string $image_url = '';
    public Link $link;

    public function __construct($link)
    {
        $this->link = $link;
    }


    /*
     * Called when the crawler will crawl the url.
     */
    public function willCrawl(UriInterface $url, ?string $linkText): void
    {
        Log::info('Starting crawler', ['url' => $url]);
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
        Log::withContext(['url' => $url]);
        $html = $response->getBody();
        Log::info('Processing title and image');
        $this->processTitleAndImage($html, $url);
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
    }

    /*
     * Called when the crawl has ended.
     */
    public function finishedCrawling(): void
    {
        Log::info("Updating database");
        $success = $this->link->update(['title' => $this->title, 'image' => $this->image_url]);
        if ($success) {
            Log::info("Attempting to dispatch event", ['link', $this->link]);
            event(new LinkImageUpdated($this->link));
        } else {
            Log::error("Failed to update link");
        }
    }

    public function processTitleAndImage(string $html, string $url): void
    {

        $crawler = new Crawler($html);

        $title = '';

        if (!empty($this->link->title)) {
            return;
        }

        if ($crawler->filterXPath('//meta[@property="og:title"]')->count() > 0) {
            $title = $crawler->filterXPath('//meta[@property="og:title"]')->attr('content');
        }

        if (!$title && $crawler->filterXPath('//title')->count() > 0) {
            $title = $crawler->filterXPath('//title')->text();
        }

        if (!empty($this->link->image)) {
            return;
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

        $this->title = $title;
        $this->image_url = $image;

    }

}
