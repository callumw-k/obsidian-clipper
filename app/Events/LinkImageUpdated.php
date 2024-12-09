<?php

namespace App\Events;

use App\Models\Link;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class LinkImageUpdated implements ShouldBroadcast
{
    public Link $link;

    public function broadcastOn(): PrivateChannel
    {
        return new PrivateChannel('links.' . $this->link->id);
    }
}
