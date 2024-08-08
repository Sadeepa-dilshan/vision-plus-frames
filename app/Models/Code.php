<?php

namespace App\Models;

use App\Models\Brand;
use App\Models\Frame;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Code extends Model
{
    use HasFactory;

    protected $fillable = ['code_name', 'brand_id'];

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function frames()
    {
        return $this->hasMany(Frame::class);
    }
}
