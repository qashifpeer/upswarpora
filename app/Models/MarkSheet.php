<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Student;


class MarkSheet extends Model
{
    protected $fillable = [
        'enr_number',
        'maths',
        'english',
        'science',
        'sst',
        'urdu',
        'kashmiri',
        'max_marks',
        'marks_obtained',
        'percentage',
        'session',
        'total_marks',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
