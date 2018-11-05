const {google} = require('googleapis');

const token = require('./token.json');

const credentials = require('./credentials');

let auth = authorize(credentials, () => {
});

function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    oAuth2Client.setCredentials(token);
    return oAuth2Client;
}

const sheets = google.sheets({version: 'v4', auth});
let spreadsheetId = '15FvcNLOT4NGPQvpXfjqsMWEcZR_fWgbqgJXVtw_kjYY';

module.exports = {
    add: async function (range, values) {
        sheets.spreadsheets.values.append({
            spreadsheetId: spreadsheetId,
            range: range,
            valueInputOption: "USER_ENTERED",
            resource: {
                values: values
            }
        }, (err, res) => {
            if (err) {
                console.error(err);
                console.log("ошибка");
                return;
            }

        });
    },
    update: async function (range, values) {
        await new Promise((resolve, reject) => {
            sheets.spreadsheets.values.update({
                    spreadsheetId: spreadsheetId,
                    range: range,
                    valueInputOption: "USER_ENTERED",

                    resource: {
                        values: values
                    }
                }, (err, res) => {
                    if (err) {
                        console.error(err.errors);
                        console.log("ошибка range: " + range);
                        reject(err);
                        return;
                    }
                    resolve()
                }
            )
        })
    },
    remove: async function (range) {
        await new Promise((resolve => {
            sheets.spreadsheets.values.clear({
                spreadsheetId: spreadsheetId,
                range: range
            }, (err, res) => {
                if (err) return console.log('The API returned an error: ' + err);
                resolve();
            })
        }))
    },
    get: function (range, callback) {
        sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: range,
        }, (err, res) => {
            if (err) return console.log('The API returned an error: ' + err);
            const rows = res.data.values;

            if (rows.length) {
                // console.log(rows);
                callback(rows);
                // console.log('Name, Major:');
                // // Print columns A and E, which correspond to indices 0 and 4.
                // rows.map((row) => {
                //     console.log(`${row[0]}, ${row[4]}`);
                // });
            } else {
                console.log('No data found.');
            }
        });
    }
};