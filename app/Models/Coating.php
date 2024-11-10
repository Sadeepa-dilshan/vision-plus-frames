<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
