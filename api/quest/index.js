const { execSync } = require("child_process");
const fs = require("fs");
// const $tw = require("tiddlywiki/boot/boot.js").TiddlyWiki();

let error = null;
let ls = '';

const serverDir = `${__dirname}/quest/server`.replace("quest/quest", "quest");

function basicAuth (req) {
    console.log(JSON.stringify(req.body || req.headers));

    ls = execSync(`ls -lA ${serverDir}`);

    let errorStep = "";

    try {
        const authorization = (req.body.Authorization || req.body || req.headers.authorization)
            .replace(/\+/g, ' ')
            .replace(/%3D/g, '=')
            .match(/authorization=(Basic .+$)/)[1];

        req.body = authorization;

        // verify auth credentials
        const base64Credentials = authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [ username, password ] = credentials.split(':');
        // const user = await userService.authenticate({ username, password });
        // if (!user) {
        //     return res.status(401).json({ message: 'Invalid Authentication Credentials' });
        // }

        if (password === "enter" && (
            username === "john" ||
            username === "hannah" ||
            username === "devon" ||
            username === "autum" ||
            username === "jasper" ||
            username === "dave"
        )) {
            return true;
        }

    } catch (err) {
        error = Object.create({}, (!!err) ? err : {});
        error.message = "Error during check for authorization\n " + (error.message || '');
    }

    return false;
}

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function received a request.');

    if (basicAuth(req)) try {
        const stdout = execSync(`node node_modules/tiddlywiki/tiddlywiki.js ${serverDir} --build index`);
        console.log(`stdout: ${stdout}`);

        // // Pass the command line arguments to the boot kernel
        // $tw.boot.argv = [
        //     serverDir,
        //     '--build',
        //     'index'
        // ];
        //
        // // Boot the TW5 app
        // await $tw.boot.boot();

        ls = execSync(`ls -lA ${serverDir}/output`);

        if (fs.existsSync(`${serverDir}/output/index.html`)) {
            context.res = {
                // status: 200, /* Defaults to 200 */
                body: fs.readFileSync(`${serverDir}/output/index.html`)
            };

        } else {
            context.res = {
                // status: 200, /* Defaults to 200 */
                body: JSON.stringify({
                    "error": new Error(`Could not find ${serverDir}/output/index.html`),
                    "body": req.body,
                    "dir": serverDir,
                    "ls": `${ls}`
                })
            };
        }

    } catch (err) {
        if (typeof err === 'object') {
            console.log(`error: ${err.message}`);

            context.res = {
                status: 404,
                // body: JSON.stringify(err)
                body: JSON.stringify({
                    "error": err,
                    "body": req.body,
                    "dir": serverDir,
                    "ls": `${ls}`
                })
            };
        }

    } else {
        context.res = {
            status: 404,
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                "error": (error != null) ? error : "Unauthorized",
                "body": req.body
            })
        };
    }
}
