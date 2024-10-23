import React from "react";
import { Button } from "@mui/material";

// Pagination Component
const CoustomPagination = ({
    totalItems,
    itemsPerPage,
    currentPage,
    setCurrentPage,
}) => {
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            {Array.from({ length: totalPages }, (_, index) => (
                <Button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    variant="outlined"
                    color={currentPage === index + 1 ? "primary" : "default"}
                    style={{ margin: "0 5px" }}
                >
                    {index + 1}
                </Button>
            ))}
        </div>
    );
};

export default CoustomPagination;
