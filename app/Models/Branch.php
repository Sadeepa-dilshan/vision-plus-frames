<?php
// app/Models/Branch.php
namespace App\Models;

use App\Models\LensStockChange;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Branch extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'location'];

    public function stockChanges()
    {
        return $this->hasMany(StockChange::class);
    }

    public function lensStockChanges()
    {
        return $this->hasMany(LensStockChange::class);
    }
}
