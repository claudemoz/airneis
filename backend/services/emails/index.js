var nodemailer = require("nodemailer");
// var sparkPostTransport = require('nodemailer-sparkpost-transport');
const sparpost = require('sparkpost');
const client = new sparpost(process.env.SPARKPOST_SECRET_KEY);
const {generateTemplate} = require('./template/template')
const {orderTemplate} = require('./template/orderTemplate')
const fs = require('fs')
const path = require('path')

class Email {
  // constructor() {
  //   this.transporter = nodemailer.createTransport(sparkPostTransport({
  //     sparkPostApiKey:"24a1ea7a0e198e01df4ac15827ea004dc3ff2dcb",
  //     endpoint:"https://api.eu.sparkpost.com"
  //   }))
  // }

  async sendVerificationEmail(options) {
    client.transmissions.send({
      content: {
          from: 'Vérification de mail <no-reply@airneis.tsiang.fr>',
          subject: 'Vérification de mail',
          html: generateTemplate({
              title: 'Activation de compte',
              message: `Salut ${options.name}, bienvenue sur Airneis, ci-dessous votre code de confirmation.`,
              link: '#',
              btnTitle: options.access_code,
          }),
          
          // attachments: [
          //     {
          //         name: 'logo.png',
          //         type: 'image/png',
          //         data: fs.readFileSync(path.join(__dirname, './template/logo.png')).toString('base64'),
          //         cid: 'logo',
          //     },
          //     {
          //         name: 'welcome.png',
          //         type: 'image/png',
          //         data: fs.readFileSync(path.join(__dirname, './template/welcome.png')).toString('base64'),
          //         cid: 'welcome',
          //     },
          // ],
      },
      recipients: [
          { address: options.to }
      ]
  })
      .then(data => {
          console.log('Woohoo! You just sent your first mailing!');
          console.log(data);
      })
      .catch(err => {
          console.log('Whoops! Something went wrong');
          console.log(err);
      });
  }
  async sendEmailResetPassword(options) {
    client.transmissions.send({
      content: {
          from: "Airneis réinitialisation de mot de passe <no-reply@airneis.tsiang.fr>",
          subject: "Réinitialisation de mot de passe",
          html: generateTemplate({
              title: 'Réinitialisation de mot de passe',
              message: `Cliquez sur le button ci-dessous pour réinitialiser votre mot de passe`,
              link: options.link,
              btnTitle: "Reset password",
          }),
      },
      recipients: [
          { address: options.to }
      ],
      options: {
        click_tracking: false // Désactiver le suivi des clics
      }
  })
      .then(data => {
          console.log('Woohoo! You just sent your first mailing!');
          console.log(data);
      })
      .catch(err => {
          console.log('Whoops! Something went wrong');
          console.log(err);
      });
  }
  
  async sendPasswordResetSuccessEmail(options) {
    client.transmissions.send({
      content: {
        from: "Réinitialisation de mot de passe <no-reply@airneis.tsiang.fr>",
        subject: "Réinitialisation de mot de passe reussie",
          html: generateTemplate({
              title: 'Réinitialisation de mot de passe',
              message: `Votre mot de passe a bien été pris en compte`,
              link:"#",
              btnTitle: "Success",
          }),
      },
      recipients: [
          { address: options.to }
      ]
  })
      .then(data => {
          console.log('Woohoo! You just sent your first mailing!');
          console.log(data);
      })
      .catch(err => {
          console.log('Whoops! Something went wrong');
          console.log(err);
      });
  }
  async sendOrderInvoiceMail(options) {
    client.transmissions.send({
      content: {
        from: "Airneis <no-reply@airneis.tsiang.fr>",
        subject: "[Airneis]  Confirmation de commande",
          html: orderTemplate({
              title: 'Réinitialisation de mot de passe',
              message: `Suite à votre commande veuillez touver ci-joit votre facture`,
              logo: 'cid:logo',
              banner: "cid:welcome",
              link:"#",
              btnTitle: "Success",
              order:options.order,
              userFullname:options.userFullname
          }),

          attachments: [
            {
              name: options.attachment.fileName,
              type: options.attachment.fileType,
              data: options.attachment.fileBase64,
            }
        ],
        options: {
          click_tracking: false // Désactiver le suivi des clics
        },
      },
      recipients: options.to.map(address =>  ({ address: address }))
  })
      .then(data => {
          console.log('Woohoo! You just sent your first mailing!');
          console.log(data);
      })
      .catch(err => {
          console.log('Whoops! Something went wrong');
          console.log(err);
      });
  }

  async sendProfileUpdateEmail(options) {
    client.transmissions.send({
      content: {
        from: "Mis à jour du Profile <no-reply@airneis.tsiang.fr>",
        subject: "Profil mis à jour",
        html: generateTemplate({
          title: 'Mise à jour du profil',
          message: `Bonjour ${options.name},<br><br> Vos informations de profil ont été mises à jour avec succès.`,
          link: '#',
          btnTitle: "Success",
        }),
      },
      recipients: [
        { address: options.to }
      ]
    })
    .then(data => {
      console.log('Email de mise à jour du profil envoyé avec succès!');
      console.log(data);
    })
    .catch(err => {
      console.log('Erreur lors de l\'envoi de l\'email de mise à jour du profil');
      console.log(err);
    });
  }


  async sendPasswordUpdateSuccessEmail(options) {
    client.transmissions.send({
      content: {
        from: "Réinitialisation de mot de passe <no-reply@airneis.tsiang.fr>",
        subject: "Réinitialisation de mot de passe réussie",
        html: generateTemplate({
          title: 'Réinitialisation de mot de passe',
          message: `Bonjour ${options.name},<br><br> Votre mot de passe a été mis à jour avec succès.`,
          link: "#",
          btnTitle: "Success",
        }),
      },
      recipients: [
        { address: options.to }
      ]
    })
    .then(data => {
      console.log('Woohoo! You just sent your first mailing!');
      console.log(data);
    })
    .catch(err => {
      console.log('Whoops! Something went wrong');
      console.log(err);
    });
  }
  
  
}



module.exports = new Email();
