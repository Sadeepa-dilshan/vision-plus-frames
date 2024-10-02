import { Grid, Skeleton } from "@mui/material";
import React from "react";

export default function EditLoading() {
    return (
        <div>
            <Grid container spacing={2}>
                {/* Loading skeleton for Brand */}
                <Grid item xs={12} md={6}>
                    <Skeleton variant="rectangular" width="100%" height={56} />
                </Grid>
                {/* Loading skeleton for Code */}
                <Grid item xs={12} md={6}>
                    <Skeleton variant="rectangular" width="100%" height={56} />
                </Grid>
                {/* Loading skeleton for Color */}
                <Grid item xs={12} md={6}>
                    <Skeleton variant="rectangular" width="100%" height={56} />
                </Grid>
                {/* Loading skeleton for Price */}
                <Grid item xs={12} md={6}>
                    <Skeleton variant="rectangular" width="100%" height={56} />
                </Grid>
                {/* Loading skeleton for Image */}
                <Grid item xs={12}>
                    <Skeleton variant="rectangular" width="100%" height={100} />
                </Grid>
                {/* Loading skeleton for Button */}
                <Grid item xs={12}>
                    <Skeleton variant="rectangular" width="100%" height={56} />
                </Grid>
            </Grid>
        </div>
    );
}
