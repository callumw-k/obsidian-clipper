<?php

namespace App\Jobs;

use App\Models\Link;
use App\Observers\BookmarkUrlCrawler;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Spatie\Browsershot\Browsershot;
use Spatie\Crawler\Crawler;

class CrawlUrlJob implements ShouldQueue
{
    use Queueable;

    public Link $link;

    /**
     * Create a new job instance.
     */
    public function __construct(Link $link)
    {
        $this->link = $link;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $browser = Browsershot::url($this->link->original_url)
            ->setRemoteInstance('chromium', '9222')
            ->waitUntilNetworkIdle()
            ->showBackground()
            ->setOption('viewport', ['width' => 1920, 'height' => 1080]);

        Crawler::create()->setCrawlObserver(new BookmarkUrlCrawler())
            ->setBrowsershot($browser)
            ->setMaximumDepth(0)
            ->executeJavaScript()
            ->ignoreRobots()
            ->setTotalCrawlLimit(1)
            ->startCrawling($this->link->original_url);
    }
}
