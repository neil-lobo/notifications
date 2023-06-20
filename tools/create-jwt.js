import config from "../config.json" assert {type: "json"}
import jsonwebtoken from "jsonwebtoken"
import prompts from "prompts";

const SECRET = config.jwt.secret;

const { user, labels, actions } = await prompts([
    {
        type: "text",
        name: "user",
        message: "User for JWT:"
    },
    {
        type: "list",
        name: "labels",
        message: "Token Labels (comma separated):"
    },
    {
        type: "list",
        name: "actions",
        message: "Token Actions (comma separated):"
    },
])

try {
    const payload = {
        user,
        labels,
        actions,
        iss: "notifications/tools"
    }
    const token = jsonwebtoken.sign(payload, SECRET)
    console.log(payload);
    console.log(token);
} catch(err) {
    console.error(err);
}