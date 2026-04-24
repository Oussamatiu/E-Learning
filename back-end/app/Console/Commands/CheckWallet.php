<?php

namespace App\Console\Commands;

use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Console\Command;

class CheckWallet extends Command
{
    protected $signature   = 'wallet:check';
    protected $description = 'Show all instructor wallets and recent transactions';

    public function handle(): void
    {
        $wallets = Wallet::with('user')->get();

        if ($wallets->isEmpty()) {
            $this->warn('No wallets found yet.');
            return;
        }

        $this->table(
            ['Instructor', 'Email', 'Balance'],
            $wallets->map(fn($w) => [
                $w->user->name,
                $w->user->email,
                '$' . number_format($w->balance, 2),
            ])
        );

        $this->newLine();
        $this->info('Recent transactions:');

        $transactions = WalletTransaction::with('user', 'order')
            ->latest()->take(10)->get();

        $this->table(
            ['User', 'Order', 'Amount', 'Type', 'Description'],
            $transactions->map(fn($t) => [
                $t->user->name,
                '#' . $t->order_id,
                '$' . number_format($t->amount, 2),
                $t->type,
                $t->description,
            ])
        );
    }
}
