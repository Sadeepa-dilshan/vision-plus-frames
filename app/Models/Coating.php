<?php

namespace App\Models;

use App\Models\Lens;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Coating extends Model
{
    use HasFactory;

    protected $table = 'coatings';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'description',
    ];

    public function lenses()
    {
        return $this->hasMany(Lens::class, 'coating_id');
    }

}
