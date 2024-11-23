<?php

namespace App\Models;

use App\Models\Power;
use App\Models\Coating;
use App\Models\LensPower;
use App\Models\LensStock;
use App\Models\LensStockChange;
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

    public function lensPower()
    {
        return $this->belongsTo(LensPower::class, 'lens_id');
    }

    public function powers()
    {
        return $this->belongsToMany(Power::class, 'lens_powers', 'lens_id', 'power_id')
                    ->withPivot('value'); // Include the `value` field from the pivot table
    }

    public function coating()
    {
        return $this->belongsTo(Coating::class, 'coating_id');
    }

    public function lensStock()
    {
        return $this->hasOne(LensStock::class, 'lens_id');
    }   

    public function lensStockChanges()
    {
        return $this->hasMany(LensStockChange::class);
    } 

}
