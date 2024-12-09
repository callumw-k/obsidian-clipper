<?php

namespace App\Events;

use App\Models\Link;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Log;

class LinkImageUpdated implements ShouldBroadcast
{
    public Link $link;

    public function __construct($link)
    {
        $this->link = $link;
    }

    public function broadcastOn(): PrivateChannel
    {
        // Broadcast to the user's private channel
        return new PrivateChannel('App.Models.User.' . $this->link->user_id);
    }

    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        Log::info('Broadcasting Link Image Updated');
        return [
            'linkId' => $this->link->id,
            'link' => $this->link,
        ];
    }
}
