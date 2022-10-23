import { SlashCommandBuilder } from "@discordjs/builders";
import {
  Client,
  CommandInteraction,
  CommandInteractionOptionResolver,
  EmbedBuilder,
  PermissionFlagsBits,
} from "discord.js";
import { Colour } from "../interfaces/colour.js";

export default {
  data: new SlashCommandBuilder()
    .setName("roleall")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription(
      "Used to assign and remove roles to all members. (INCLUDING: STAFF)"
    )

    .addStringOption((opt) =>
      opt
        .setName("options")
        .setDescription("Select an option.")
        .addChoices(
          { name: "Remove", value: "remove" },
          { name: "Add", value: "add" }
        )
        .setRequired(true)
    )
    .addRoleOption((opt) =>
      opt.setName("role").setDescription("Select a role.").setRequired(true)
    ),
  async execute(client: Client, interaction: CommandInteraction) {
    const option =
      interaction.options as unknown as CommandInteractionOptionResolver;

    const roleOption = option.getString("options");
    const role = option.getRole("role");
    const members = await interaction.guild?.members.fetch();

    try {
          await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(Colour.waiting)
                .setDescription(
                  `${
                    roleOption == "add"
                      ? "Adding **All Members** the role"
                      : "Removing **All Members** from role"
                  }: **${role?.name}**`
                ),
            ],
          });
          //@ts-ignore
          for (const [k, v] of members?.entries())
          if (!v.user.bot)
          roleOption == "add"
          //@ts-ignore
          ? await v.roles?.add(role)
                //@ts-ignore
                : await v.roles?.remove(role);
          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor(Colour.succes)
                .setDescription(
                  `The role: **${role?.name}** has been ${
                    roleOption == "add" ? "given to" : "removed from"
                  } **All Members**`
                ),
            ],
          });
      
    } catch {
      await interaction.followUp({
        embeds: [
          new EmbedBuilder()
            .setColor(Colour.error)
            .setDescription(
              "An error has occurred, while adding or removing this role to **All Members**."
            ),
        ],
        ephemeral: true,
      });
    }
  },
};
