<?php

use App\Models\Link;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int)$user->id === (int)$id;
});

Broadcast::channel('links.{linkId}', function (User $user, int $linkId) {
    return $user->id === Link::findOrNew($linkId)->user_id;
});
