<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\MarkSheet;

class Student extends Model
{
    protected $fillable = [
        'adm_number',
        'enr_number',
        'name',
        'father_name',
        'mother_name',
        'dob',
        'class',

    ];

    public function marksSheet()
    {
        return $this->hasOne(MarkSheet::class, 'enr_number','enr_number');
    }
}
