const ArticleModel = require('./../lib/mongoose');

class Routes {
    constructor(app) {
        this.app = app;
        this.telegramModel = ArticleModel.telegram_promo;
        this.telegramModelUsers = ArticleModel.telegram_users;
        this.telegramModelMessages = ArticleModel.telegram_messages;
        this.telegramModelPackages = ArticleModel.telegram_packages;
        this.telegramModelStages = ArticleModel.telegram_stages;
        this.facebookModelUsers = ArticleModel.facebook_users;
        this.facebookModelMessages = ArticleModel.facebook_messages;
        this.facebookModel = ArticleModel.facebook_promo;
        this.facebookModelPackages = ArticleModel.facebook_packages;
        this.facebookModelStages = ArticleModel.facebook_stages;
        this.siteReklamaModel = ArticleModel.site_reklama
    }

    setup() {
        this.app.post("/new-promo", async (req, res) => {
            let data = req.body;
            if (data) {
                console.log(data)
                let mess = data.messenger;
                let obj = {
                    type: data.type,
                    date_end: data.date_end,
                    number_of_use: data.number_of_use,
                    discount: data.discount
                };
                if (mess === "facebook") {
                    let response = await addPromo(this.facebookModel, data.promo, obj);
                    if (response === "error") {
                        res.send('failed');
                        return;
                    }
                } else if (mess === "telegram") {
                    let response = await addPromo(this.telegramModel, data.promo, obj);
                    if (response === "error") {
                        res.send('failed');
                        return;
                    }
                } else {
                    res.send("failed")
                    return;
                }
                res.send("success");
                return;
            }
            res.send('failed');
            return;
        });

        this.app.post("/get-promo", async (req, res) => {
            let promos = await getAllPromo(this.telegramModel, this.facebookModel);
            await res.send(promos);
        });


        this.app.post("/delete-promo", async (req, res) => {
            let data = req.body;
            if (data) {
                console.log(data);
                let mes = data.messenger;
                if (mes) {
                    if (mes === "facebook") {
                        await deletePromo(this.facebookModel, data.promoId)
                    } else if (mes === "telegram") {
                        await deletePromo(this.telegramModel, data.promoId)
                    }
                }
            }
            res.send("OK")
        });

        this.app.post("/get-telegram-users", async (req, res) => {
            let users = await getUsers(this.telegramModelUsers);
            await res.send(users);
        });
        this.app.post("/get-telegram-messages", async (req, res) => {
            let messages = await getUsers(this.telegramModelMessages);
            await res.send(messages);
        });
        this.app.post("/get-facebook-users", async (req, res) => {
            let users = await getUsers(this.facebookModelUsers);
            await res.send(users);
        });
        this.app.post("/get-facebook-messages", async (req, res) => {
            let messages = await getUsers(this.facebookModelMessages);
            await res.send(messages);
        });
        this.app.post("/get-messenger-packages", async (req, res) => {
            if (req.body) {
                let messenger = req.body.messenger;
                let packages;
                if (messenger) {
                    if (messenger === "telegram") {

                        packages = await getUsers(this.telegramModelPackages);
                    } else if (messenger === "facebook") {
                        packages = await getUsers(this.facebookModelPackages);
                    }
                    await res.send(packages);
                }
            }
        });
        this.app.post("/get-messenger-stages", async (req, res) => {
            if (req.body) {
                let messenger = req.body.messenger;
                let stages;
                if (messenger) {
                    if (messenger === "telegram") {

                        stages = await getUsers(this.telegramModelStages);
                    } else if (messenger === "facebook") {
                        stages = await getUsers(this.facebookModelStages);
                    }
                    await res.send(stages);
                }
            }
        });
        this.app.post("/get-reklama", async (req, res) => {
            if (req.body) {
                let data = req.body;
                let type = data.messenger || "yandex";
                console.log(data);
                let obj = await updateModel(this.siteReklamaModel, {id: data.id}, {type: type, value: data.text});
                let rek = await this.siteReklamaModel.find({id: "1"})
                console.log(rek);
                let answer = obj || 200;
                console.log(answer);
                res.send(answer);
                return;
            }
            res.sendStatus(200);
        })
        this.app.post("/get-reklama-all", async (req, res) => {
            let result = await getUsers(this.siteReklamaModel);
            res.send(result || 200);
        })
    }
}


async function addPromo(model, promoVal, data) {
    let promo = new model({
        id: +new Date(),
        type: data.type,
        value: promoVal || "PROMO-" + (+new Date()),
        dateEnd: data.date_end || "",
        number_of_use: data.number_of_use || 0,
        discount: +data.discount || 0
    });
    try {
        return await promo.save();
    } catch (e) {
        return "error";
    }
}

async function getAllPromo(model1, model2) {
    let promo1 = await model1.find();
    let promo2 = await model2.find();

    return {
        telegram: promo1,
        facebook: promo2
    };
}

async function deletePromo(model, promo_id) {
    let promo = await model.findOne({id: promo_id});
    if (promo) {
        console.log(promo);
        await promo.remove();
    }
}

async function getUsers(model) {
    return await model.find();
}

async function updateModel(model, option, data) {
    return await model.findOneAndUpdate(option, data);
}


module.exports = Routes;