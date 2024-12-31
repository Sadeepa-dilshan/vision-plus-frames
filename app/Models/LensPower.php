<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LensPower extends Model
{
    use HasFactory;

    protected $fillable = [
        'lens_id',
        'power_id',
        'value',
        'side'
    ];

    /**
     * Define the relationship to the Lens model.
     */
    public function lens()
    {
        return $this->belongsTo(Lens::class, 'lens_id'); 
    }    

    /**
     * Define the relationship to the Power model.
     */
    public function power()
    {
        return $this->belongsTo(Power::class);
    }
}
