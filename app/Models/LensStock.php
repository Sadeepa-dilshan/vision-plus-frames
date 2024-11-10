<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LensStock extends Model
{
    use HasFactory;

    protected $table = 'lens_stocks';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'lens_id',
        'initial_count',
        'qty',
    ];

    // Relationship to Lens
    public function lens()
    {
        return $this->belongsTo(Lens::class);
    }
}
