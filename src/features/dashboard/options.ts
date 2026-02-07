/**
 * Dashboard Query Options
 */

import { queryOptions } from "@tanstack/react-query";
import { getDashboardData } from "./server";

export const dashboardQueryOptions = {
	getDashboardData: queryOptions({
		queryKey: ["dashboardData"],
		queryFn: getDashboardData,
	}),
};
