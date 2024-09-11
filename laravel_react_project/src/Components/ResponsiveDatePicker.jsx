import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Paper } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

export default function ResponsiveDatePicker({
    fromDate,
    toDate,
    setFromDate,
    setToDate,
}) {
    return (
        <Paper
            elevation={2}
            sx={{
                p: 2,
                flexWrap: "wrap",
                display: "flex",
                justifyContent: "center",
            }}
        >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer sx={{ mx: 2 }} components={["DatePicker"]}>
                    <DemoItem label="Select Date From">
                        <DatePicker
                            value={fromDate}
                            onChange={(newValue) => setFromDate(newValue)}
                            views={["year", "month", "day"]}
                        />
                    </DemoItem>
                </DemoContainer>
                <DemoContainer components={["DatePicker"]}>
                    <DemoItem label="Select Date To">
                        <DatePicker
                            value={toDate}
                            onChange={(newValue) => setToDate(newValue)}
                            views={["year", "month", "day"]}
                        />
                    </DemoItem>
                </DemoContainer>
            </LocalizationProvider>
        </Paper>
    );
}
