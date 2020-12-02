const { execSync } = require("child_process");
const fs = require("fs");

function basicAuth (req) {
    console.log(JSON.stringify(req.body || req.headers));

    // check for basic auth header
    if ((!!req.headers.authorization && req.headers.authorization.indexOf('Basic') > -1) ||
        (!!req.body.Authorization && req.body.Authorization.indexOf('Basic') > -1) ||
        (!!req.body.match(/authorization/) && req.body.indexOf('Basic') > -1)
    ) {

        const authorization = (req.headers.authorization || req.body.Authorization || decodeURI(req.body))
            .replace(/\+/g, ' ')
            .replace(/%3D/g, '=')
            .match(/authorization=(Basic .+$)/)[1];

        console.log(authorization);

        req.body = authorization;

        // verify auth credentials
        const base64Credentials = authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [username, password] = credentials.split(':');
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
            )
        ) {
            return true;
        }
    }

    return false;
}

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };

    const ls = execSync('ls -lA ./node_modules/tiddlywiki/');
    const serverDir = `${__dirname}/quest/server`.replace("/quest/quest", "/quest")

    try {

        if (basicAuth(req)) {
            const stdout = execSync(`node api/node_modules/tiddlywiki/tiddlywiki.js ${serverDir} --build index`);
            console.log(`stdout: ${stdout}`);

            const data = fs.readFileSync(`${serverDir}/output/index.html`);

            context.res = {
                // status: 200, /* Defaults to 200 */
                body: data
            };

        } else {
            context.res = {
                status: 404,
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    "error": "Unauthorized",
                    "body": req.body,
                    "dir": serverDir,
                    "node_modules": `${ls}`
                })
            };
        }

    } catch (err) {
        if (typeof err === 'object') {
            console.log(`error: ${err.message}`);
            console.log(`current working directory: ${__dirname}`);
            context.res = {
                status: 404,
                // body: JSON.stringify(err)
                body: JSON.stringify({
                    "error": err,
                    "body": req.body,
                    "dir": serverDir,
                    "node_modules": `${ls}`
                })
            };
        }

    }
}
