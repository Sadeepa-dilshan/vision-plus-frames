<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use League\CommonMark\Extension\CommonMark\Node\Inline\Code;

class Brand extends Model
{
    use HasFactory;

    protected $fillable = ['brand_name'];

    public function codes()
    {
        return $this->hasMany(Code::class);
    }

    public function frames()
    {
        return $this->hasMany(Frame::class);
    }
}
