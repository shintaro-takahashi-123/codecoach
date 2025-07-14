<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Company;

class CompanyController extends Controller
{
    public function suggest(Request $request)
    {
        $request->validate([
            'annualIncome' => 'required|integer',
            'jobType' => 'required|string',
        ]);

        $income = $request->input('annualIncome');
        $jobType = $request->input('jobType');

        $companies = Company::where('job_type', $jobType)
            ->where('min_income', '<=', $income)
            ->where('max_income', '>=', $income)
            ->get();

        return response()->json([
            'companies' => $companies
        ]);
    }
}
