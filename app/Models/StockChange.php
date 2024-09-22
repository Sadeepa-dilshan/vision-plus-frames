<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockChange extends Model
{
    use HasFactory;

    // Specify the table associated with the model (optional if table name follows convention)
    protected $table = 'stock_changes';

    // Fillable attributes
    protected $fillable = [
        'stock_id',
        'frame_id',
        'change_date',
        'change_qty',
        'status',
        'branch',
    ];

    /**
     * Relationship to the Stock model.
     * A stock change belongs to a specific stock.
     */
    public function stock()
    {
        return $this->belongsTo(Stock::class);
    }

    /**
     * Relationship to the Frame model.
     * A stock change might belong to a specific frame (optional).
     */
    public function frame()
    {
        return $this->belongsTo(Frame::class);
    }
}
