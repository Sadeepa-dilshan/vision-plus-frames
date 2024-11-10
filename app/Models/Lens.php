<?php

namespace App\Models;

use App\Models\Power;
use App\Models\Coating;
use App\Models\LensPower;
use App\Models\LensStock;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Lens extends Model
{
    use HasFactory;

    protected $table = 'lenses';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'type_id',
        'coating_id',
        'price',
    ];

    // Relationships
    public function type()
    {
        return $this->belongsTo(LensType::class, 'type_id');
    }

    public function power()
    {
        return $this->belongsTo(Power::class, 'power_id');
    }

    public function lensPower()
    {
        return $this->belongsTo(LensPower::class, 'lens_id');
    }

    public function coating()
    {
        return $this->belongsTo(Coating::class, 'coating_id');
    }

    public function lensStock()
    {
        return $this->hasOne(LensStock::class);
    }

}
