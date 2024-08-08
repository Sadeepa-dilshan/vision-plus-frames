<?php

namespace App\Models;

use App\Models\Frame;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Stock extends Model
{
    use HasFactory;

    protected $fillable = ['frame_id', 'qty'];

    public function frame()
    {
        return $this->belongsTo(Frame::class);
    }
}
