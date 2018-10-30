const mongoose = require('mongoose');
const cfg = require('./config');

let config = {
    telegram: {
        dbURL: "mongodb://185.179.83.31:27017/telegram_UFSi_fitness_bot",
        dbOptions1: {
            useNewUrlParser: true
        },
        dbOptions: cfg.telegram
    },
    facebook: {
        dbURL: "mongodb://81.90.180.52:27017/ufsi_fitness_bot",
        dbOptions: cfg.facebook
    }
};

let telegram_promo_bot = mongoose.createConnection(config.telegram.dbURL, config.telegram.dbOptions);
let facebook_promo_bot = mongoose.createConnection(config.facebook.dbURL, config.facebook.dbOptions);

let mongooceSchema = {
    id: {type: String, required: true},
    type: {type: String, required: true},
    value: {type: String, required: true, unique: true},
    dateEnd: {type: String, required: false},
    number_of_use: {type: Number, required: false},
    discount: {type: Number, required: true}
};

let reklamaSchema = {
    id: {type: String, required: false},
    type: {type: String, required: false},
    value: {type: String, required: false},
    img: {type: String, required: false},
};

let Schema = new mongoose.Schema(mongooceSchema);
let reklama = new mongoose.Schema(reklamaSchema);

let ArticleModelPromoTelegram = telegram_promo_bot.model('promocodes', Schema);
let ArticleModelUsersTelegram = telegram_promo_bot.model('users', Schema);
let ArticleModelMessageTelegram = telegram_promo_bot.model('messages', Schema);
let ArticleModelMessagePackages = telegram_promo_bot.model('packages', Schema);
let ArticleModelStagesTelegram = telegram_promo_bot.model('stagestates', Schema);
let ArticleModelReklamaSite = telegram_promo_bot.model('reklamas', reklama);


module.exports = {
    telegram_promo: ArticleModelPromoTelegram,
    telegram_users: ArticleModelUsersTelegram,
    telegram_messages: ArticleModelMessageTelegram,
    telegram_packages: ArticleModelMessagePackages,
    telegram_stages: ArticleModelStagesTelegram,
    facebook_promo: facebook_promo_bot.model('promocodes', Schema),
    facebook_users: facebook_promo_bot.model('users', Schema),
    facebook_messages: facebook_promo_bot.model('messages', Schema),
    facebook_packages: facebook_promo_bot.model('packages', Schema),
    facebook_stages: facebook_promo_bot.model('stagestates', Schema),
    site_reklama: ArticleModelReklamaSite
}