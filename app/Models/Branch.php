<?php
// app/Models/Branch.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'location'];

    public function stockChanges()
    {
        return $this->hasMany(StockChange::class);
    }
}
