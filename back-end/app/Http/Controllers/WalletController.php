<?php

namespace App\Http\Controllers;

use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    /**
     * GET /api/instructor/wallet
     * Returns instructor wallet balance, transactions, monthly breakdown, and per-course summary.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user || !$user->isInstructor()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Get or initialize wallet
        $wallet = Wallet::firstOrCreate(
            ['user_id' => $user->id],
            ['balance' => 0]
        );

        // All credit transactions for this instructor
        $transactions = WalletTransaction::where('user_id', $user->id)
            ->where('type', 'credit')
            ->with('order.orderItems.course:id,title,thumbnail')
            ->latest()
            ->get();

        $totalEarnings = $wallet->balance;
        $totalSales    = $transactions->count();

        // Per-course breakdown from transactions
        $byCourse = $transactions
            ->flatMap(fn($tx) => $tx->order?->orderItems ?? collect())
            ->filter(fn($item) => $item->course)
            ->groupBy('course_id')
            ->map(function ($group) {
                $course = $group->first()->course;
                // 70% of sum of prices in that group
                $earnings = round($group->sum('price') * 0.70, 2);
                return [
                    'id'        => $course->id,
                    'title'     => $course->title,
                    'thumbnail' => $course->thumbnail
                        ? 'http://127.0.0.1:8000/storage/' . $course->thumbnail
                        : null,
                    'sales'     => $group->count(),
                    'earnings'  => $earnings,
                ];
            })
            ->values();

        // Monthly breakdown from transactions (last 6 months)
        $monthly = $transactions
            ->groupBy(fn($tx) => $tx->created_at->format('Y-m'))
            ->map(fn($group, $month) => [
                'month'    => $month,
                'earnings' => round($group->sum('amount'), 2),
                'sales'    => $group->count(),
            ])
            ->sortKeys()
            ->values()
            ->take(-6);

        // Recent transaction history (last 10)
        $history = $transactions->take(10)->map(fn($tx) => [
            'id'          => $tx->id,
            'amount'      => $tx->amount,
            'type'        => $tx->type,
            'description' => $tx->description,
            'date'        => $tx->created_at->format('d M Y'),
        ]);

        return response()->json([
            'balance'        => (float) $totalEarnings,
            'total_earnings' => (float) $totalEarnings,
            'total_sales'    => $totalSales,
            'by_course'      => $byCourse,
            'monthly'        => $monthly,
            'history'        => $history,
        ]);
    }
}
