<?php

namespace App\Dtos;

use App\Models\Link;

class LinkDto
{
    public string $original_url;
    public string $created_at;
    public string $path;
    public int $id;
    public string $image;
    public string $title;

    public function __construct(Link $link)
    {
        $this->original_url = $link->original_url;
        $this->path = $link->path;
        $this->id = $link->id;
        $this->image = $link->image;
        $this->title = $link->title;
    }

}
