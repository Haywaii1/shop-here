<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class SmsService
{
    public static function send($to, $message)
    {
        $to = self::formatPhone($to);

        Http::post('https://api.ng.termii.com/api/sms/send', [
            "to" => $to,
            "from" => config('services.termii.sender'),
            "sms" => $message,
            "type" => "plain",
            "channel" => "generic",
            "api_key" => config('services.termii.key'),
        ]);
    }

    private static function formatPhone($phone)
    {
        // Remove spaces
        $phone = preg_replace('/\s+/', '', $phone);

        // Convert 080 → 23480
        if (str_starts_with($phone, '0')) {
            return '234' . substr($phone, 1);
        }

        // Already correct
        if (str_starts_with($phone, '234')) {
            return $phone;
        }

        return $phone;
    }
}