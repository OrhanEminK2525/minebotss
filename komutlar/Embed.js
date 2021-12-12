const Discord = require("discord.js");

exports.run = async (client, message, args) => {
  if (message.author.id !== client.sahip)
    if (message.author.id !== client.admin)
      if (args.slice(0).join(" ") == "hesap") {
      
      const hesap =    new Discord.MessageEmbed()
            .setColor("#ff6800")
            .setThumbnail(message.guild.iconURL())
            .setAuthor(message.guild.name, client.user.avatarURL())
            .addField(
              `Hesap Eşleme Sistemi Nedir?`,
              `Bu Sistem Sizin Hesabınızı Discord Hesabınızla Bağlayan Sistemdir`,
              false
            )
            .addField(
              `Nasıl Hesabımı Eşlerim?`,
              `Hesabınızı Eşlemek İçin Oyun İçinde /hesap eşle Yazıp Gelen Kodu <#909451282278932501> Kanalına /eşle kod Olarak Atmanız Yeterlidir.Böylece Hesabınız Discord Üzerinden Bağlanacaktır.`,
              false
            )
            .addField(
              `Eşlediğim Zaman Ne Olucak?`,
              `
Hesabınızı Eşlerseniz Birbirinden Değerli
Hediyeler Alacaksınız`,
              false
            )
    message.channel.send({ embeds: [hesap] })
      }
  if (args.slice(0).join(" ") == "öneri") {
    return message.channel.send(
      new Discord.MessageEmbed()
        .setColor("#ff6800")
        .setFooter(
          `Sunucuya öneri yapmak için ${client.prefix}öneri <sunucu> <öneriniz>`,
          message.guild.iconURL()
        )
        .setThumbnail(message.guild.iconURL())
        .setAuthor(
          `${message.guild.name} 🔹 Öneri Sistemi`,
          message.guild.iconURL()
        )
        .setImage(
          "https://media.discordapp.net/attachments/910147898996584468/915326216179953714/Screenshot_42.png"
        )
        .setDescription(
          "Sunucuya fikir yada görünüş amaçlı bize sunmak için öneriyi kullanabilirsiniz her yaptıgınız öneriler yetkililer tarafından bakılacak ama beğenme ve beğenmeme göre eklenir yada eklenmez."
        )
        .addField(`Hangi Sunuculara Öneri Yapabilirsin`, `YAKINDA!!`, false)
    );
  }
  if (args.slice(0).join(" ") == "şikayet") {
    return message.channel.send(
      new Discord.MessageEmbed()
        .setColor("#ff6800")
        .setImage(
          "https://media.discordapp.net/attachments/910147898996584468/915325303117717554/Screenshot_42.png"
        )
        .setDescription(
          "Sunucudaki oyuncuların küfür yada hile gibi vb. şeyleri r!şikayet komutuyla bize bildirin.."
        )
        .setThumbnail(message.guild.iconURL())
        .setAuthor(
          `${message.guild.name} 🔹 Şikayet Sistemi`,
          message.guild.iconURL()
        )
    );
  }
  if (args.slice(0).join(" ") == "üye") {
    return message.channel.send(
      new Discord.MessageEmbed()
        .setColor("#ff6800")
        .setAuthor("MineTürk Üye nedir?", client.user.avatarURL())
        .setThumbnail(message.guild.iconURL())
        .setDescription(
          `- <#911200002032955444> kanalında seçilen en aktif 3 üye <@&914605376442359909> seçilir ve ertesi hafta sonuna kadar bu role sahip olur. \n\n - Oyuncu o hafta boyunca <@&909402156568829963> üyeliğin ve yanında gelen hediyelerin sahibi olur. \n\n -  Anlık seviye takibi için <#909874266156179506> kanalında (${client.prefix}me) komutunu uygulayabilirsiniz. \n\n - Haftalık yenilenen sıralama listesine göz atmak için (${client.prefix}top) komutunu uygulayabilirsiniz.`
        )
    );
  }
};
exports.conf = {
  aliases: []
};

exports.help = {
  name: "embed"
};
