<?php

namespace App\Dtos;

use App\Models\Link;
use JsonSerializable;

class LinkDto implements JsonSerializable
{
    public string $original_url;
    public string $path;
    public int $id;
    public ?string $image;
    public ?string $title;

    public function __construct(Link $link)
    {
        $this->original_url = $link->original_url;
        $this->path = $link->path;
        $this->id = $link->id;
        $this->image = $link->image ?? "";
        $this->title = $link->title ?? "";
    }

    public function jsonSerialize(): array
    {
        return [
            'original_url' => $this->original_url,
            'path' => $this->path,
            'id' => $this->id,
            'image' => $this->image,
            'title' => $this->title,
        ];
    }
}
