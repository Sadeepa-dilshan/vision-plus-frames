import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { Paper } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

export default function ResponsiveDatePicker() {
    return (
        <Paper elevation={2} sx={{ p: 2, width: "400px" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                    <DemoItem label="Select Date From ">
                        <DatePicker
                            defaultValue={dayjs("2022-04-17")}
                            views={["year", "month", "day"]}
                        />
                    </DemoItem>
                </DemoContainer>
                <DemoContainer components={["DatePicker"]}>
                    <DemoItem label="Select Date to">
                        <DatePicker
                            defaultValue={dayjs("2022-04-17")}
                            views={["year", "month", "day"]}
                        />
                    </DemoItem>
                </DemoContainer>
            </LocalizationProvider>
        </Paper>
    );
}
