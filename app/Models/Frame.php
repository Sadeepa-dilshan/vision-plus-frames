<?php

namespace App\Models;

use App\Models\Code;
use App\Models\Brand;
use App\Models\Stock;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Frame extends Model
{
    use HasFactory;

    protected $fillable = ['brand_id', 'code_id', 'color_id', 'price', 'size'];

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function code()
    {
        return $this->belongsTo(Code::class);
    }

    public function color()
    {
        return $this->belongsTo(Color::class);
    }

    public function stocks()
    {
        return $this->hasMany(Stock::class);
    }
}
