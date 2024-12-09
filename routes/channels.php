<?php

use App\Constants\ChannelNames;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel(ChannelNames::USER_CHANNEL . '{id}', function ($user, $id) {
    return (int)$user->id === (int)$id;
});


