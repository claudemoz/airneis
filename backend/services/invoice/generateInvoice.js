const fs = require("fs");
const path = require("path");
const { jsPDF } = require("jspdf");
require('jspdf-autotable');
const dayjs = require("dayjs");
const emailService = require("@services/emails");

exports.generateInvoice = (order, user) => {
  const doc = new jsPDF();
  doc.autoTable({
    body: [
      [
        {
          content: 'Airneis',
          styles: {
            halign: 'left',
            fontSize: 20,
            textColor: '#ffffff'
          }
        },
        {
          content: 'Facture',
          styles: {
            halign: 'right',
            fontSize: 20,
            textColor: '#ffffff'
          }
        }
      ],
    ],
    theme: 'plain',
    styles: {
      fillColor: '#2c3e50'
    }
  });

  doc.autoTable({
    body: [
      [
        {
          content: `Référence : ${order.reference}`
          +`\nDate : ${dayjs(order.date).format('DD/MM/YYYY')}`,
          styles: {
            halign: 'right'
          }
        }
      ],
    ],
    theme: 'plain'
  });

  doc.autoTable({
    body: [
      [
        {
          content: 'Facture au nom de :'
          +`\n${user.firstname} ${user.lastname}`
          +`\n${order.delivery?.address}`
          +`\n${order.delivery?.city}`,
          styles: {
            halign: 'left'
          }
        },
        {
          content: 'Facturé par :'
          +`\nAirneis`
          +'\n14 Rue des Damoiseaux'
          +'\nParis',
          styles: {
            halign: 'right'
          }
        }
      ],
    ],
    theme: 'plain'
  });

  doc.autoTable({
    body: [
      [
        {
          content: 'Montant Total de la commande :',
          styles: {
            halign: 'right',
            fontSize: 14
          }
        }
      ],
      [
        {
          content: `${order.price} €`,
          styles: {
            halign: 'right',
            fontSize: 20,
            textColor: '#2c3e50'
          }
        }
      ],
      [
        {
          content: `Date de Facturation :  ${dayjs(order.date).format('DD/MM/YYYY')}`,
          styles: {
            halign: 'right'
          }
        }
      ]
    ],
    theme: 'plain'
  });

  doc.autoTable({
    body: [
      [
        {
          content: 'Total des produits hors taxe :',
          styles: {
            halign: 'right'
          }
        },
        {
          content: `${order.price}€`,
          styles: {
            halign: 'right'
          }
        },
      ],
      [
        {
          content: 'Taxe :',
          styles: {
            halign: 'right'
          }
        },
        {
          content: '0€',
          styles: {
            halign: 'right'
          }
        },
      ],
      [
        {
          content: 'Montant Total :',
          styles: {
            halign: 'right'
          }
        },
        {
          content: `${order.price}€`,
          styles: {
            halign: 'right'
          }
        },
      ],
    ],
    theme: 'plain'
  });

  doc.autoTable({
    body: [
      [
        {
          content: 'Conditions et Remarques',
          styles: {
            halign: 'left',
            fontSize: 14
          }
        }
      ],
      [
        {
          content: 'Politique de Retour :\n' +
         'Vous disposez de 30 jours à compter de la date de réception pour retourner vos articles, à condition qu\'ils soient dans leur état d\'origine et non utilisés.\n' +
         'Pour initier un retour, veuillez nous contacter à support@airneis.com en mentionnant votre numéro de commande et le motif du retour.\n' +
         'Les frais de retour sont à la charge du client, sauf en cas de produit défectueux ou erreur de notre part.\n\n' +
         'Livraison :\n' +
         'Nous nous efforçons de livrer vos commandes dans les meilleurs délais. Les délais de livraison estimés sont indiqués sur la page de chaque produit.\n' +
         'En cas de retard, nous vous informerons dès que possible et vous fournirons une nouvelle date de livraison estimée.\n\n' +
         'Service Client :\n' +
         'Notre équipe de service client est disponible pour répondre à toutes vos questions et préoccupations du lundi au vendredi, de 9h à 18h.\n' +
         'Vous pouvez nous contacter par email à support@Airneis.com ou par téléphone au 01 23 45 67 89.\n\n' +
         'Droits de Propriété Intellectuelle :\n' +
         'Tous les contenus et designs des produits vendus sur Airneis sont protégés par des droits de propriété intellectuelle. Toute reproduction ou utilisation non autorisée est strictement interdite.\n\n' +
         'Nous vous remercions encore pour votre confiance et votre achat. À bientôt sur Airneis!',
          styles: {
            halign: 'left'
          }
        }
      ],
    ],
    theme: "plain"
  });

  const filePath = `facture_${Date.now()}.pdf`;
  doc.save(filePath);

  const fileName = path.basename(filePath);
  const fileType = "application/pdf";
  const pdfBase64 = fs.readFileSync(filePath).toString("base64");

  fs.unlinkSync(filePath);

  emailService.sendOrderInvoiceMail({
    userFullname: `${user.firstname} ${user.lastname}`,
    to: [user.email],
    user:user,
    order:order,
    attachment: {
      fileType: fileType,
      fileName: fileName,
      fileBase64: pdfBase64,
    },
  });
};