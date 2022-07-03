import { ExtendedClient } from "./Client";
import DBD, { Dashboard, UpdatedClass } from "discord-dashboard";
import DarkDashboard from "dbd-dark-dashboard";

export class PlenusDashboard {
    static client: ExtendedClient;
    static Dashboard: Dashboard;

    constructor(client: ExtendedClient) {
        PlenusDashboard.client = client;

        PlenusDashboard.client.on("ready", () => this.registerDashboard());
    }

    async registerDashboard() {
        await DBD.useLicense(process.env.dashboardToken);
        DBD.Dashboard = UpdatedClass();
        PlenusDashboard.Dashboard = new Dashboard({
            port: process.env.dashboardPort,
            domain: process.env.dashboardDomain,
            bot: PlenusDashboard.client,
            client: {
                id: process.env.dashboardClientId,
                secret: process.env.dashboardClientSecret
            },
            redirectUri: `${process.env.dashboardDomain}/dashboard/callback`,
            theme: DarkDashboard((DBD as any).default_configs.dbdDarkDashboard),
            settings: [
                {
                    categoryId: "setup",
                    categoryName: "Setup",
                    categoryDescription: "Setup Plenus for your needs in the server using the settings below.",
                    categoryOptionsList: [
                        {
                            optionId: "test",
                            optionName: "Test",
                            optionDescription: "Test",
                            optionType: DBD.formTypes.input("Test"),
                            getActualSet: async ({ guild }) => {
                                return "Test";
                            },
                            setNew: async ({ guild, newData }) => {
                                return;
                            }
                        }
                    ]
                }
            ]
        })
        PlenusDashboard.Dashboard.init();
    }
}