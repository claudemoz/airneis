const mongoose = require('mongoose')
const pwd = 'ClaudeAPI';
mongoose.connect(`mongodb+srv://claude_moz:${pwd}@cluster0.4mza5.mongodb.net/app_ecom_B3?retryWrites=true&w=majority`,
  {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  }
).then(() => console.log('Connexion database OK'))
  .catch((err) => console.log(`erreur de connexion => ${err.message}`))