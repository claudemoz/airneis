const router = require("express").Router();
const EmailService = require('../services/emails/index');

router.post('/send-verification-email', async (req, res) => {
    const { to, name, access_code } = req.body;

    try {
        await EmailService.sendVerificationEmail({ to, name, access_code });
        res.status(200).send({ message: 'Email de vérification envoyé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Erreur lors de l\'envoi de l\'email de vérification' });
    }
});

router.post('/send-reset-password-email', async (req, res) => {
    const { to, name, link } = req.body;

    try {
        await EmailService.sendEmailResetPassword({ to, name, link });
        res.status(200).send({ message: 'Email de réinitialisation de mot de passe envoyé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Erreur lors de l\'envoi de l\'email de réinitialisation de mot de passe' });
    }
});

router.post('/send-reset-password-success-email', async (req, res) => {
    const { to, name, link } = req.body;

    try {
        await EmailService.sendPasswordResetSuccessEmail({ to, name, link });
        res.status(200).send({ message: 'Email de confirmation de réinitialisation de mot de passe envoyé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Erreur lors de l\'envoi de l\'email de confirmation de réinitialisation de mot de passe' });
    }
});

module.exports = router;
