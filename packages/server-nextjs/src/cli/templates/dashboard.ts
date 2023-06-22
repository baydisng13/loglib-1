export const generateDashboard = (app: boolean) =>
  app
    ? `//generated by loglib
"use client";

import { Dashboard } from "@loglib/ui"
import "@loglib/ui/dist/index.css"

export default function loglib() {
    return (
        <Dashboard />
    )
}
`
    : `//generated by loglib
import { Dashboard } from "@loglib/ui"
import "@loglib/ui/dist/index.css"
export default Dashboard
`;
