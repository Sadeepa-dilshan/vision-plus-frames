<?php

namespace App\Models;

use App\Models\LensStockChange;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

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
    public function stockChanges()
    {
        return $this->hasMany(LensStockChange::class);
    }
}
