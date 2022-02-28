import { Command } from "../../structures/Command";
import { calculator } from "simply-djs";

export default new Command({
    name: "calculator",
    description: "Get the math done with a simple calculator.",
    run: async({ interaction }) => {
        calculator(interaction, {
            embedColor: "GREEN",
            credit: false
        });
    }
});