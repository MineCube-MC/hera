const express = require("express");
const fs = require("fs");
const os = require("os");

const app = express();

let password;

app.get("/shutdown", (req, res) => {
    const queryPassword = req.query.password;
    if (!queryPassword) {
        res.status(400).send("Password is required");
        return;
    }
    if (queryPassword === password) {
        res.status(200).json({
            status: 200,
            message: "Shutting down the PC..."
        });
        if(os.platform === "win32") {
            exec("shutdown -s -t 0");
        } else {
            exec("shutdown -h now");
        }
    } else {
        res.status(400).json({
            status: 400,
            message: "Incorrect password"
        });
    }
});

app.get("/reboot", (req, res) => {
    const queryPassword = req.query.password;
    if (!queryPassword) {
        res.status(400).send("Password is required");
        return;
    }
    if (queryPassword === password) {
        res.status(200).json({
            status: 200,
            message: "Rebooting the PC..."
        });
        if(os.platform === "win32") {
            exec("shutdown -r -t 0");
        } else {
            exec("shutdown -r now");
        }
    } else {
        res.status(400).json({
            status: 400,
            message: "Incorrect password"
        });
    }
});

app.get("/status", (req, res) => {
    const queryPassword = req.query.password;
    if (!queryPassword) {
        res.status(400).send("Password is required");
        return;
    }
    if (queryPassword === password) {
        res.status(200).json({
            status: 200,
            platform: os.platform,
            hostname: os.hostname,
            uptime: os.uptime(),
            totalmem: os.totalmem(),
            freemem: os.freemem(),
            cpus: os.cpus()
        });
    } else {
        res.status(400).json({
            status: 400,
            message: "Incorrect password"
        });
    }
});

app.listen(80, () => {
    logger.info("Plenus PC API listening on port 80");
    // Check if password.txt file exists
    if (!fs.existsSync("./password.txt")) {
        logger.info("Password file not found, creating a new password...");
        // Create password file
        fs.writeFileSync("./password.txt", createPassword(20, true, true));
        logger.info("Your new generated password is: " + fs.readFileSync("./password.txt", "utf-8"));
    }
    // Read password file
    password = fs.readFileSync("./password.txt", "utf8");
});


const logger = {
    info: (message) => {
        const date = new Date();
        console.log(`[INFO] [${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] ${message}`);
    },
    warn: (message) => {
        const date = new Date();
        console.warn(`[WARN] [${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] ${message}`);
    },
    error: (message) => {
        const date = new Date();
        console.error(`[ERROR] [${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] ${message}`);
    }
}

const alpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const integers = "0123456789";
const exCharacters = "!@#$%^&*_-=+";
const createPassword = (length, hasNumbers, hasSymbols) => {
    let chars = alpha;
    if (hasNumbers) {
        chars += integers;
    }
    if (hasSymbols) {
        chars += exCharacters;
    }
    return generatePassword(length, chars);
};
const generatePassword = (length, chars) => {
    let password = "";
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
};