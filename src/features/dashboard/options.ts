/**
 * Dashboard Query Options
 */

import { queryOptions } from "@tanstack/react-query";
import { getDashboardData } from "./server";

export const dashboardOptions = {
	getDashboardData: queryOptions({
		queryKey: ["dashboardData"],
		queryFn: async () => {
			return getDashboardData();
		},
	}),
};
