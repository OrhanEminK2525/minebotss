const { Client, Message, MessageEmbed, Collection } = require("discord.js");
const fs = require("fs");
const config = require("./config.json");
const prefix = config.prefix;
const token = process.env.TOKEN;

const client = new Client({
  messageCacheLifetime: 60,
  fetchAllMembers: false,
  messageCacheMaxSize: 10,
  restTimeOffset: 0,
  restWsBridgetimeout: 100,
  shards: "auto",
  allowedMentions: {
    parse: ["roles", "users", "everyone"],
    repliedUser: true
  },
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  intents: 32767
});
module.exports = client;

client.harfler = [
  "a",
  "b",
  "c",
  "ç",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "y",
  "k",
  "l",
  "m",
  "n",
  "p",
  "q",
  "r",
  "s",
  "ş",
  "t",
  "u",
  "v",
  "w",
  "y",
  "z"
];

//Client lOGLAR

client.desteklog = "919548540722765845"


//Client Loglar
client.commands = new Collection();
client.aliases = new Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  console.log(`Toplamda ${files.length} Komut Var!`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    console.log(`${props.help.name} İsimli Komut Aktif!`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

fs.readdir("./events/", (err, files) => {
  if (err) console.log(err);

  let jsfile1 = files.filter(f => f.split(".").pop() === "js");
  if (jsfile1.length <= 0) {
    console.log("Events Dosyaları Bulunamadı!");
    return;
  }
  jsfile1.forEach(f => {
    const eventName = f.split(".")[0];
    console.log(`Eventler Yükleniyor: ${eventName}`);
    const event = require(`./events/${f}`);

    client.on(eventName, event.bind(null, client));
  });
});

if (!token) {
  console.log(
    "Bu Proje Glitch Özel Uyarlanmıştır .env Dosyasına Discord Bot Tokeninizi Yazınız!"
  );
} else {
  client.login(token);
}

const express = require("express");
const app = express();
const http = require("http");
app.get("/", (request, response) => {
  console.log(`Uptime Başarılı`);
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 60000);

client.on("messageCreate", async message => {
  const args = message.content.split(" ").slice(prefix.length);
  const cmd = message.content.split(" ")[0].slice(prefix.length);

  const command = client.commands.get(cmd);
  if (command != null) {
    command.run(client, message, args);
  }
});

// Functions
client.getChannel = string => {
  var id = null;
  if (string.startsWith("<#") && string.endsWith(">")) {
    id = string
      .replace("<", "")
      .replace("#", "")
      .replace("!", "")
      .replace(">", "");
  } else if (client.channels.cache.get(string) != null) {
    id = string;
  } else {
    id = null;
  }

  if (id != null) {
    return client.channels.cache.get(id);
  } else {
    return null;
  }
};

require("dotenv").config();

const { Database } = require("quickmongo");
const db = new Database(
  "mongodb+srv://sonblok123:sonblok123@cluster0.c1u0i.mongodb.net/sonblok123?retryWrites=true&w=majority"
);
const randomstring = require("randomstring");
const Discord = require("discord.js");

//parse users tag and convert it to a channelName
function getChannelName(user) {
  const user1 = `${user.username}#${user.discriminator}`;

  let value = user1.replace("#", "-").toLowerCase();

  value = value.replace(/ /g, "-");
  return value;
}

function hasTicket(g, interaction) {
  let channelName = getChannelName(interaction.user);
  let ticket = g.channels.cache.find(ch => ch.name == channelName);
  if (ticket) {
    interaction.editReply({
      content: `You already have a ticket. <#${ticket.id}>`
    });
    return true;
  } else {
    return false;
  }
}

const channelsetup = new Discord.MessageEmbed()
  .setDescription(
    `This server needs to set up their ticket channels first! \`${prefix}setchannels\``
  )
  .setColor(0x5865f2);

const colldown1 = new Discord.MessageEmbed()
  .setDescription(`Ticket 5 saniye sonra kalıcı olarak silenecektir.`)
  .setColor(0x5865f2);

client.on("messageCreate", async message => {
  if (message.author.bot || !message.guild) return;
  let args = message.content.toLowerCase().split(" ");
  let command = args.shift();
  if (command == prefix + `help`) {
    let embed = new Discord.MessageEmbed()
      .setTitle(`Bot commands list`)
      .setDescription(
        `> \`${prefix}send\` - Send a message to open tickets
> \`${prefix}add\` - Adds a member to a specific ticket
> \`${prefix}remove\` - Removes a member to a specific ticket.
> \`${prefix}delete\` - Delete a specific ticket
> \`${prefix}close\` - Close a specific ticket
> \`${prefix}open\` - Open a specific ticket
> \`${prefix}rename\` - Rename a specific ticket
> \`${prefix}setchannels\` - set channels relating to ticket log and category
> \`${prefix}setstaff\` - set staff roles`
      )
      .addField(
        `My Source Code`,
        `[Click Me!](https://github.com/TajuModding/Discord-v13-Button-Tickets-bot)`,
        false
      )
      .setTimestamp()
      .setColor(0x5865f2)
      .setFooter(`All rights belong to https://discord.gg/vRQtfrAPJ3`);
    message.reply({ embeds: [embed] });
  }
  if (command == prefix + `ticket-ekle`) {
    if (!message.member.permissions.has("MANAGE_GUILD"))
      return message.reply({
        content: `:x: Bu Komutu Kullanmak İçin \`MANAGE_MESSAGES\` Yetkisine İhtiyaçın Var.`
      });
    let args = message.content
      .split(" ")
      .slice(1)
      .join(" ");
    let channel = message.mentions.channels.first() || message.channel;
    const sfats = await db.get(`Staff_${message.guild.id}`);

    if (!sfats) return message.reply({ content: "Error 3" });
    if (await db.get(`ticket_${channel.id}_${message.guild.id}`)) {
      let member =
        message.mentions.members.first() ||
        message.guild.members.cache.get(
          args ||
            message.guild.members.cache.find(
              x => x.user.username === args || x.user.username === args
            )
        );
      if (!member)
        return message.reply({ content: `Kullanıcının idsini belirtin.` });
      try {
        channel
          .updateOverwrite(member.user, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            ATTACH_FILES: true,
            READ_MESSAGE_HISTORY: true
          })
          .then(() => {
            const sucess1 = new Discord.MessageEmbed()
              .setDescription(
                `${member} kullanıcısı başarıyla ${channel} biletine eklenmiştir.`
              )
              .setColor(0x5865f2);
            message.reply({ embed: [sucess1] });
          });
      } catch (e) {
        return message.channel.send({
          content: `Bir hata oluştu. Lütfen tekrar deneyin!`
        });
      }
    }
  }
  if (command == prefix + `ticket-kaldır`) {
    if (!message.member.permissions.has("MANAGE_GUILD"))
      return message.reply({
        content: `:x: Bu Komutu Kullanmak İçin \`MANAGE_MESSAGES\` Yetkisine İhtiyaçın Var.`
      });
    let args = message.content
      .split(" ")
      .slice(1)
      .join(" ");
    let channel = message.mentions.channels.first() || message.channel;
    const sfats = await db.get(`Staff_${message.guild.id}`);
    if (!sfats) return message.reply({ content: "Error 3" });
    if (await db.get(`ticket_${channel.id}_${message.guild.id}`)) {
      let member =
        message.mentions.members.first() ||
        message.guild.members.cache.get(
          args ||
            message.guild.members.cache.find(
              x => x.user.username === args || x.user.username === args
            )
        );
      if (!member)
        return message.reply({ content: `Kullanıcının idsini belirtin.` });
      try {
        channel
          .updateOverwrite(member.user, {
            VIEW_CHANNEL: false
          })
          .then(() => {
            const removep = new Discord.MessageEmbed()
              .setDescription(
                `Başarıyla ${member} adlı üye ${channel} biletinden kaldırıldı`
              )
              .setColor(0x5865f2);

            message.reply({ embeds: [removep] });
          });
      } catch (e) {
        return message.channel.send({ content: `Bir hata oluştu` });
      }
    }
  }
  if (command == prefix + "ticket-sil") {
    if (!message.member.permissions.has("MANAGE_GUILD"))
      return message.reply({
        content: `:x: Bu Komutu Kullanmak İçin \`MANAGE_MESSAGES\` Yetkisine İhtiyaçın Var.`
      });
    let channel = message.mentions.channels.first() || message.channel;
    const sfats = await db.get(`Staff_${message.guild.id}`);
    if (!sfats) return message.reply({ content: "Error 3" });
    if (await db.get(`ticket_${channel.id}_${message.guild.id}`)) {
      message.reply({ embeds: [colldown1] });
      setTimeout(async () => {
        channel.delete();
      }, 5000);
    }
  }
  if (command == prefix + "ticket-kapat") {
    if (!message.member.permissions.has("MANAGE_GUILD"))
      return message.reply({
        content: `:x: Bu Komutu Kullanmak İçin \`MANAGE_MESSAGES\` Yetkisine İhtiyaçın Var.`
      });
    let channel = message.mentions.channels.first() || message.channel;
    const sfats = await db.get(`Staff_${message.guild.id}`);
    if (!sfats) return message.reply({ content: "Error 3" });

    let msg = await message.reply({ embeds: [colldown1] });
    setTimeout(async () => {
      try {
        msg.delete();
        const close = new Discord.MessageEmbed()
          .setDescription(
            `Ticket tarafından kapatıldı <@!${message.author.id}>`
          )
          .setColor(`YELLOW`);
        channel.send({ embeds: [close] });
        let type = "member";
        await Promise.all(
          channel.permissionOverwrites
            .filter(o => o.type === type)
            .map(o => o.delete())
        );
        channel.setName(`closed-ticket`);
      } catch (e) {
        return message.channel.send({
          content: `Bir hata oluştu. Lütfen tekrar deneyin!`
        });
      }
    }, 1000);
  }

  if (command == prefix + "ticket-aç") {
    if (!message.member.permissions.has("MANAGE_GUILD"))
      return message.reply({
        content: `:x: Bu Komutu Kullanmak İçin \`MANAGE_MESSAGES\` Yetkisine İhtiyaçın Var.`
      });
    let channel = message.mentions.channels.first() || message.channel;
    const sfats = await db.get(`Staff_${message.guild.id}`);
    if (!sfats) return message.reply({ content: "Error 3" });
    if (await db.get(`ticket_${channel.id}_${message.guild.id}`)) {
      let msg = await message.reply({ embeds: [colldown1] });
      setTimeout(async () => {
        try {
          msg.delete();
          channel.send({
            embed: {
              description: `Ticket tarafından açıldı <@!${message.author.id}>`,
              color: `GREEN`
            }
          });
          let meember = client.users.cache.get(
            await db.get(`ticket_${channel.id}_${message.guild.id}`).ticket_by
          );
          channel.updateOverwrite(meember, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            ATTACH_FILES: true,
            READ_MESSAGE_HISTORY: true
          });
          channel.updateOverwrite(
            await db.get(`Staff_${message.guild.id}.Admin`),
            {
              VIEW_CHANNEL: true,
              SEND_MESSAGES: true,
              ATTACH_FILES: true,
              READ_MESSAGE_HISTORY: true
            }
          );
          channel.updateOverwrite(
            await db.get(`Staff_${message.guild.id}.Moder`),
            {
              VIEW_CHANNEL: true,
              SEND_MESSAGES: true,
              ATTACH_FILES: true,
              READ_MESSAGE_HISTORY: true
            }
          );
          channel.setName(
            `ticket-${await db.get(`ticket_${channel.id}_${message.guild.id}`)
              .count}`
          );
        } catch (e) {
          return message.channel.send({
            content: `Bir hata oluştu. Lütfen tekrar deneyin!`
          });
        }
      }, 1000);
    }
  }
  if (command == prefix + "ad-ayarla") {
    if (!message.member.permissions.has("MANAGE_GUILD"))
      return message.reply({
        content: `:x: Bu Komutu Kullanmak İçin \`MANAGE_MESSAGES\` Yetkisine İhtiyaçın Var.`
      });
    let channel = message.mentions.channels.first() || message.channel;
    const sfats = await db.get(`Staff_${message.guild.id}`);
    if (!sfats) return message.reply({ content: "Error 3" });
    if (await db.get(`ticket_${channel.id}_${message.guild.id}`)) {
      let args = message.content
        .split(" ")
        .slice(1)
        .join(" ");
      if (!args)
        return message.reply({
          embed: {
            description: `Lütfen bilet için istediğiniz ismi seçin`,
            color: 0x5865f2
          }
        });
      channel.setName(args);
      message.delete();
    }
  }
  if (command == prefix + "yetkili-ayarla") {
    if (!message.member.permissions.has("ADMINISTRATOR"))
      return message.reply({
        content: `:x: Bu Komutu Kullanmak İçin \`ADMINISTRATOR\` Yetkisine İhtiyaçın Var.`
      });

    const Admin =
      message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
    const Moder = message.guild.roles.cache.get(args[1]);
    if (!Admin || !Moder) {
      let main = new Discord.MessageEmbed().setDescription(
        `Lütfen bu komutla bir Yönetici rol idsi, *sonra* bir Moderatör rol idsi sağlayın!`
      );
      return message.reply({ embeds: [main] });
    }

    await db.set(`Staff_${message.guild.id}.Admin`, Admin.id);
    await db.set(`Staff_${message.guild.id}.Moder`, Moder.id);
    message.react("✅");
  }
  if (command == prefix + "kategori-ayarla") {
    if (!message.member.permissions.has("ADMINISTRATOR"))
      return message.reply({
        content: `:x: Bu Komutu Kullanmak İçin \`ADMINISTRATOR\` Yetkisine İhtiyaçın Var.`
      });
    let main = new Discord.MessageEmbed()
      .setTitle(`Error`)
      .setDescription(`Lütfen bu komutla bir kategori ID girin! `);

    if (args.length != 1) return message.reply({ embeds: [main] });

    const cat = message.guild.channels.cache.get(args[0]);

    if (cat.type !== "GUILD_CATEGORY")
      return message.channel.send({ content: "Giriş bir kategori olmalıdır" });

    await db.set(`Channels_${message.guild.id}.Cat`, cat.id);
    message.react("✅");
  }

  if (command == prefix + "ticket-gönder") {
    if (!message.member.permissions.has("ADMINISTRATOR"))
      return message.reply({
        content: `:x: Bu Komutu Kullanmak İçin \`ADMINISTRATOR\` Yetkisine İhtiyaçın Var.`
      });
    const sfats = await db.get(`Staff_${message.guild.id}`);
    const sfas = await db.get(`Channels_${message.guild.id}`);
    if (!sfats || sfats === null) return message.reply({ content: "Error 3" });
    if (!sfas || sfas === null)
      return message.reply({ embeds: [channelsetup] });
    let idd = randomstring.generate({ length: 20 });
    let args = message.content
      .split(" ")
      .slice(1)
      .join(" ");
    if (!args) args = `Tickets`;

    let specialbtn = new Discord.MessageButton()
      .setStyle(`SECONDARY`)
      .setEmoji("⛏")
      .setCustomId("ss");

    let genbtn = new Discord.MessageButton()
      .setStyle(`SECONDARY`)
      .setEmoji("👥")
      .setCustomId("gs");

    let trow = new Discord.MessageActionRow().addComponents(specialbtn, genbtn);

    message.delete();

    let embed = new Discord.MessageEmbed()
      .setAuthor("MineTürk Destek Sistemi", client.user.avatarURL())
      .setThumbnail(
        "https://media.discordapp.net/attachments/903923215041183747/916040246620192798/Belge_Png.png"
      )
      .setColor("#ff6800")
      .setFooter(message.guild.name, message.guild.iconURL())
      .setDescription(
        `**MineTürk Destek** \n - 💫 Destek talebi oluşturmak, minecraft veya genel oluşturmak destek almak için bu kanaldan bir destek seçmeniz lazım.`
      )
      .addField(
        `Hangi Tür Destekler Var ?`,
        `> Minecraft Destek \n > Genel Destek`,
        true
      )
      .addField(`Emojiye Basarsan O Tür Destek Açılır?`, `➙ ⛏ \n ➙ 👥`, true);
    let msg = await message.channel.send({
      embeds: [embed],
      components: [trow]
    });

    msg.pin();
  }
});
//ephemeral
client.on("interactionCreate", async interaction => {
  if (!interaction.isButton()) return;

  if (interaction.customId == `ss`) {
    await interaction.reply({
      content: `Desteğiniz işleniyor. Lütfen bekle `,
      ephemeral: true
    });
    if (hasTicket(interaction.guild, interaction)) {
      return;
    }

    interaction.guild.channels
      .create(getChannelName(interaction.user), {
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone,
            deny: ["VIEW_CHANNEL"]
          },
          {
            id: await db.get(`Staff_${interaction.guild.id}.Admin`),
            allow: [
              "VIEW_CHANNEL",
              `READ_MESSAGE_HISTORY`,
              `ATTACH_FILES`,
              `SEND_MESSAGES`,
              `MANAGE_MESSAGES`
            ]
          },
          {
            id: interaction.member.id,
            allow: [
              "VIEW_CHANNEL",
              `READ_MESSAGE_HISTORY`,
              `ATTACH_FILES`,
              `SEND_MESSAGES`
            ]
          }
        ],
        parent: await db.get(`Channels_${interaction.guild.id}.Cat`),
        position: 1,
        topic: `${interaction.member.id}`
      })
      .then(async channel => {
        channel = channel;

        await interaction.editReply(
          `
  **Desteğiniz başarıyla açıldı** <#${channel.id}>`,
          true
        );

        const moment = require("moment");
        const embedticket = new Discord.MessageEmbed()
          .setThumbnail(interaction.member.user.avatarURL())
          .setColor("#ff6800")
          .setAuthor(`Yeni Destek Talebi`, client.user.avatarURL())
          .addField(`Talep Açan:`, `<@!${interaction.member.user.id}>`, true)
          .addField(
            `Talep Açılış Tarihi:`,
            `${moment().format("DD/MM/YYYY | H:mm:ss")}`,
            true
          )
          .addField(`Talep Türü:`, `Minecraft Destek`, false)
          .addField(`Talep Kapatmak İçin ?`, `🔒 Emojiye Basın.`, false);

        let bu1tton = new Discord.MessageButton()
          .setStyle(`SECONDARY`)
          .setCustomId(`cl`)
          .setEmoji(`🔒`);

        channel
          .send({
            content: `👋 Merhaba <@!${interaction.member.user.id}>`,
            embeds: [embedticket],
            components: [new Discord.MessageActionRow().addComponents(bu1tton)]
          })
          .then(msg => {
            msg.pin();
          });
      });
  }
  if (interaction.customId == `gs`) {
    await interaction.reply({
      content: `Desteğiniz işleniyor. Lütfen bekle `,
      ephemeral: true
    });
    if (hasTicket(interaction.guild, interaction)) {
      return;
    }

    interaction.guild.channels
      .create(getChannelName(interaction.user), {
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone,
            deny: ["VIEW_CHANNEL"]
          },
          {
            id: await db.get(`Staff_${interaction.guild.id}.Admin`),
            allow: [
              "VIEW_CHANNEL",
              `READ_MESSAGE_HISTORY`,
              `ATTACH_FILES`,
              `SEND_MESSAGES`,
              `MANAGE_MESSAGES`
            ]
          },
          {
            id: interaction.member.id,
            allow: [
              "VIEW_CHANNEL",
              `READ_MESSAGE_HISTORY`,
              `ATTACH_FILES`,
              `SEND_MESSAGES`
            ]
          }
        ],
        parent: await db.get(`Channels_${interaction.guild.id}.Cat`),
        position: 1,
        topic: `${interaction.member.id}`
    })
      .then(async channel => {
        channel = channel;

        await interaction.editReply(
          `
  **Desteğiniz başarıyla açıldı** <#${channel.id}>`,
          true
        );
        const moment = require("moment");
        const embedticket = new Discord.MessageEmbed()
          .setColor("#ff6800")
          .setAuthor(`Yeni Destek Talebi`, client.user.avatarURL())
          .setThumbnail(interaction.member.user.avatarURL())
          .addField(`Talep Açan:`, `<@!${interaction.member.user.id}>`, true)
          .addField(
            `Talep Açılış Tarihi:`,
            `${moment().format("DD/MM/YYYY | H:mm:ss")}`,
            true
          )
          .addField(`Talep Türü:`, `Genel Destek`, false)
          .addField(`Talep Kapatmak İçin ?`, `🔒 Emojiye Basın.`, false);

        let bu1tton = new Discord.MessageButton()
          .setStyle(`SECONDARY`)
          .setCustomId(`cl`)
          .setEmoji(`🔒`);

        channel
          .send({
            content: `👋 Merhaba <@!${interaction.member.user.id}>`,
            embeds: [embedticket],
            components: [new Discord.MessageActionRow().addComponents(bu1tton)]
          })
          .then(msg => {
            msg.pin();
          });
      });
  }

  if (interaction.customId == `cl`) {
    interaction.reply({
      content: `Ticket 5 saniye sonra kapatılacaktır!`,
      ephemeral: true
    });
    let no = new Discord.MessageButton()
      .setStyle(`SECONDARY`)
      .setLabel("❌ Hayır")
      .setCustomId(`no`);

    let yes = new Discord.MessageButton()
      .setStyle(`DANGER`)
      .setLabel("☑️ Evet")
      .setCustomId(`yes`);

    let row = new Discord.MessageActionRow().addComponents(no, yes);

    let ch = interaction.channel;
    if (!ch) return;
    setTimeout(async () => {
      try {
        const closemebed = new Discord.MessageEmbed()
          .setDescription(
            `Bilet çoktan kapandı <@!${interaction.member.id}> \n \n Silmek istiyor musun?`
          )
          .setColor(`YELLOW`);

        ch.send({ embeds: [closemebed], components: [row] });

        const member = client.users.cache.get(ch.topic);

        ch.permissionOverwrites.edit(member.id, {
          VIEW_CHANNEL: false
        });

        ch.setName(`closed-ticket`);
      } catch (e) {
        interaction.editReply({
          content: `An error occurred, please try again!`,
          ephemeral: true
        });
        console.log(e);
      }
    }, 4000);
  }

  if (interaction.customId == `yes`) {
    const closemebed = new Discord.MessageEmbed()
      .setDescription(`Bilet 5 saniye içinde kapatılacak`)
      .setColor(`YELLOW`);

    interaction.reply({ embeds: [closemebed] });
     
    setTimeout(async () => {
      try {
        interaction.channel.delete();
      } catch (e) {
        interaction.editReply({
          content: `Bir hata oluştu. Lütfen tekrar deneyin!`,
          ephemeral: true
        });
        console.log(e);
      }
    }, 4000);
  }
  if (interaction.customId == `no`) {
    interaction.message.delete();
  }
});
