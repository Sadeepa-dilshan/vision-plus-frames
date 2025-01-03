import { useStateContext } from "../../contexts/contextprovider";
import useDataById from "../../hooks/useDataById";
import { useParams } from "react-router-dom";
import { Box, Chip, Grid, Paper, Typography } from "@mui/material";
import HistoryDetailCard from "../../Components/HistoryDetailCard";
import { motion } from "framer-motion";
import useBranchList from "../../hooks/useBranchList";
export default function LensHistoryIndex() {
    const { id } = useParams();
    const {
        data: historyData,
        loading: loadingHistory,
        refresh: refreshHistory,
    } = useDataById(`lenses/${id}/stock-history`);
    const { branchDataList, loadingBranchList } = useBranchList();

    return (
        <div style={{ marginTop: 20 }}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        <Typography marginRight={1} variant="h5" gutterBottom>
                            Lense History{" "}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <Chip
                                color="primary"
                                sx={{
                                    textTransform: "capitalize",
                                    fontWeight: "bold",
                                }}
                                label={
                                    historyData !== null
                                        ? historyData.lens.type.name
                                        : "loading.."
                                }
                            />
                        </Box>
                    </Box>

                    <Typography variant="body2" color="textSecondary">
                        Created At:{" "}
                        {historyData !== null &&
                            new Date(
                                historyData.stock_created_at
                            ).toLocaleString()}
                    </Typography>
                </Paper>
            </motion.div>
            {historyData !== null && (
                <Grid container spacing={2}>
                    {historyData.changes
                        .slice()
                        .reverse()
                        .map((change, index) => (
                            <Grid item xs={12} key={index}>
                                <HistoryDetailCard
                                    status={change.status}
                                    change_qty={change.change_qty}
                                    branch_id={change.branch_id}
                                    branch_name={
                                        branchDataList
                                            .filter(
                                                (branch) =>
                                                    branch.id ===
                                                    change.branch_id
                                            )
                                            .map((branch) => branch.name)[0]
                                    }
                                    change_date={change.updated_at}
                                    index={index}
                                />
                            </Grid>
                        ))}
                </Grid>
            )}
            <Grid item xs={12}>
                {historyData !== null && (
                    <HistoryDetailCard
                        status={"plus"}
                        change_qty={historyData.initial_count}
                        branch_id={null}
                        change_date={historyData.stock_created_at}
                        index={1}
                    />
                )}
            </Grid>
        </div>
    );
}
