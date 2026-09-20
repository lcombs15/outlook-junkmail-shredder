import { CircularProgress } from "@mui/material";

export const LoadingSpinner = () => {
    return (
        <div className="flex flex-col items-center text-primary">
            <CircularProgress
                aria-label="Loading…"
                color="inherit"
                size={"15rem"}
            />
        </div>
    );
};
