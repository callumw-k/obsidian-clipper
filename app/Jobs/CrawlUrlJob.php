<?php

namespace App\Jobs;

use App\Models\Link;
use App\Observers\BookmarkUrlCrawler;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
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
//        $browser = Browsershot::url($this->link->original_url)
//            ->setRemoteInstance('172.99.0.100', '9222');

        Crawler::create()->setCrawlObserver(new BookmarkUrlCrawler($this->link))
            ->setMaximumDepth(0)
            ->setUserAgent('FacebookExternalHit/1.1')
            ->setTotalCrawlLimit(1)
            ->startCrawling($this->link->original_url);
    }
}
