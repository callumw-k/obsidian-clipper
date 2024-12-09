<?php

namespace App\Events;

use App\Constants\ChannelNames;
use App\Models\Link;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Support\Facades\Log;

class LinkImageUpdated implements ShouldBroadcast
{

    public Link $link;

    public function __construct($link)
    {
        $this->link = $link;
    }

    public function broadcastOn(): PrivateChannel
    {
        Log::info('Broadcasting on channel:', ['channel' => ChannelNames::USER_CHANNEL . $this->link->user_id, 'data' => $this->link]);
        return new PrivateChannel(ChannelNames::USER_CHANNEL . $this->link->user_id);
    }

//    /**
//     * Get the data to broadcast.
//     *
//     * @return array<string, mixed>
//     */
    public function broadcastWith(): array
    {
        $payload = [
            'linkId' => $this->link->id,
            'link' => $this->link,
        ];
        Log::info('Broadcast payload:', $payload);
        return $payload;
    }
}
