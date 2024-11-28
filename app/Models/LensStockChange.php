<?php

namespace App\Models;

use App\Models\Lens;
use App\Models\Branch;
use App\Models\LensStock;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LensStockChange extends Model
{
    use HasFactory;

    // Specify the table associated with the model (optional if table name follows convention)
    protected $table = 'lens_stock_changes';

    // Fillable attributes
    protected $fillable = [
        'lens_stock_id',
        'lens_id',
        'change_qty',
        'change_date',
        'status',
        'branch_id',
    ];

    /**
     * Relationship to the Stock model.
     * A stock change belongs to a specific stock.
     */
    public function lensStock()
    {
        return $this->belongsTo(LensStock::class);
    }
    /**
     * Relationship to the Frame model.
     * A stock change might belong to a specific frame (optional).
     */
    public function lens()
    {
        return $this->belongsTo(Lens::class);
    }
    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
}
