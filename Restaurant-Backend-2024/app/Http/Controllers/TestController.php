<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class TestController extends Controller
{
    public function download() {
        $data = [
            [
                'quantity' => 1,
                'description' => '1 Year Subscription',
                'price' => '129.00'
            ]
        ];
        $pdf = Pdf::loadView('sales_report_pdf', ['data' => $data]);

        return $pdf->stream();
    }
}
