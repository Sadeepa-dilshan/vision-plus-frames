<?php

namespace App\Models;

use App\Models\Frame;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Color extends Model
{
    use HasFactory;

    protected $fillable = ['color_name'];

    public function frames()
    {
        return $this->hasMany(Frame::class);
    }
}
