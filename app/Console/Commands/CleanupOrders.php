<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Order;

class CleanupOrders extends Command
{
    protected $signature = 'orders:cleanup';
    protected $description = 'Handle failed/expired orders safely';

    public function handle()
    {
        // ✅ Step 1: Expire unpaid orders after 30 minutes
        $expiredCount = Order::whereIn('status', ['pending', 'failed'])
            ->whereNull('paid_at')
            ->whereNull('payment_reference') // 🔥 extra safety
            ->where('created_at', '<=', now()->subMinutes(30))
            ->update([
                'status' => 'expired'
            ]);

        // ✅ Step 2: Soft delete expired orders after 48 hours
        $trashedCount = Order::where('status', 'expired')
            ->whereNull('paid_at') // 🔥 don't touch paid orders
            ->where('updated_at', '<=', now()->subHours(48))
            ->delete();

        // ✅ Step 3: Permanently delete trashed orders after 7 days
        $forceDeletedCount = Order::onlyTrashed()
            ->whereNull('paid_at') // 🔥 extra safety
            ->where('deleted_at', '<=', now()->subDays(7))
            ->forceDelete();

        // ✅ Log everything
        $this->info("Expired: {$expiredCount} | Trashed: {$trashedCount} | Permanently Deleted: {$forceDeletedCount}");

        return Command::SUCCESS;
    }
}
