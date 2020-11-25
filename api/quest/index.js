const { execSync } = require("child_process");
const fs = require("fs");

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

    try {
        const stdout = execSync(`../node_modules/.bin/tiddlywiki ${__dirname}/server --build index`);
        console.log(`stdout: ${stdout}`);

        const data = fs.readFileSync(__dirname + '/server/output/index.html');

        context.res = {
            // status: 200, /* Defaults to 200 */
            body: data
        };

    } catch (err) {
        if (typeof err === 'object') {
            console.log(`error: ${error.message}`);
            console.log(`current working directory: ${__dirname}`);
            context.res = {
                status: 404, /* Defaults to 200 */
                body: JSON.stringify(err)
            };
        }

    }
}
