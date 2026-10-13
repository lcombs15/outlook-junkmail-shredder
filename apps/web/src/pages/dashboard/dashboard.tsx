import classNames from "classnames";
import { useQuery } from "@tanstack/react-query";
import {
    type AnalyticResult,
    listAnalytics,
} from "~/services/analytics-service";
import { BarChart, LineChart } from "@mui/x-charts";
import { LoadingSpinner } from "~/components/LoadingSpinner";

export default function Dashboard() {
    const { data, isFetching } = useQuery<Array<AnalyticResult>>({
        initialData: (): Array<AnalyticResult> => {
            return [];
        },
        queryFn: async () => {
            return await listAnalytics();
        },
        queryKey: ["analytics"],
    });

    return isFetching ? (
        <LoadingSpinner />
    ) : (
        <div
            className={classNames(
                "flex flex-col pt-8 pb-4 h-full w-full overflow-auto gap-5",
                "items-center",
                "break-after-all md:break-normal",
                "wrap-anywhere md:wrap-normal",
                "!text-white",
            )}
        >
            <h1 className="md:text-5xl text-3xl">Dashboard</h1>
            <LineChart
                dataset={data.map((record) => {
                    return {
                        ...record,
                    };
                })}
                xAxis={[
                    {
                        dataKey: "period",
                        label: "Month",
                        scaleType: "point",
                        tickLabelStyle: { fill: "white" },
                        labelStyle: { fill: "white" },
                    },
                ]}
                series={[
                    {
                        dataKey: "shreddedTotal",
                        label: "Shredded",
                        color: "red",
                    },
                    {
                        dataKey: "ignoredTotal",
                        label: "Ignored",
                        color: "grey",
                    },
                    {
                        dataKey: "total",
                        label: "Total",
                        color: " black",
                    },
                ]}
                yAxis={[
                    {
                        label: "# Emails",
                        tickLabelStyle: { fill: "white" },
                        labelStyle: { fill: "white" },
                    },
                ]}
                height={800}
                width={1200}
            />
            <BarChart
                dataset={data.map((record) => {
                    return {
                        ...record,
                    };
                })}
                xAxis={[
                    {
                        dataKey: "period",
                        label: "Month",
                        tickLabelStyle: { fill: "white" },
                        labelStyle: { fill: "white" },
                    },
                ]}
                series={[
                    {
                        dataKey: "shreddedTotal",
                        label: "Shredded",
                        color: "red",
                    },
                    {
                        dataKey: "ignoredTotal",
                        label: "Ignored",
                        color: "grey",
                    },
                ]}
                yAxis={[
                    {
                        label: "# Emails",
                        tickLabelStyle: { fill: "white" },
                        labelStyle: { fill: "white" },
                    },
                ]}
                height={800}
                width={1200}
            />
            <BarChart
                dataset={data.map((record) => {
                    return {
                        ...record,
                    };
                })}
                xAxis={[
                    {
                        dataKey: "period",
                        label: "Month",
                        tickLabelStyle: { fill: "white" },
                        labelStyle: { fill: "white" },
                    },
                ]}
                series={[
                    {
                        dataKey: "total",
                        label: "Total",
                        color: "green",
                    },
                ]}
                yAxis={[
                    {
                        label: "# Emails",
                        tickLabelStyle: { fill: "white" },
                        labelStyle: { fill: "white" },
                    },
                ]}
                height={800}
                width={1200}
            />
        </div>
    );
}
