<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('mark_sheets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('enr_number')->references('enr_number')->on('students')->onDelete('cascade');
            $table->string('maths');
            $table->string('english');
            $table->string('science');
            $table->string('sst')->nullable();
            $table->string('urdu');
            $table->string('kashmiri');
            $table->string('max_marks');
            $table->string('marks_obtained');
            $table->string('percentage');
            $table->string('session');
            $table->string('total_marks');
            $table->string('marks_status')->default('Incomplete');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('mark_sheets');
    }
};
