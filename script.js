// import fs
const { response } = require("express")
let fs = require("fs")
const DEFAULT_API_BASE_URL = 'https://64371b533e4d2b4a12e3c52a.mockapi.io/api/v1'
const LOG_FILE = "./log.txt"

const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/

const getUsers = (source) => {
    if (source == 'file') {
        return getUsersFromFile(process.env.USER_FILE)
    } else {
        // CLI?
    }
}

const getUsersFromFile = (fileName) => {
    let csv = fs.readFileSync(fileName, "utf8")
    let linesArr = csv.split("\r?\n")
    let users = []

    for (let index = 1 index < linesArr.length index++) {
        let line = linesArr[index].split(",")
        users.push({
            customer_name = line[0],
            phone_number = line[1],
        })
    }

    return users
}

const sendText = (user, baseApiUrl) => {
    let messageTemplate = `Hey ${user.customer_name}, we are glad to have you as our customer.`
    user.text = messageTemplate

    if (phoneRegex.test(user.phone_number) && user.customer_name !== null) {
        fetch(`${baseApiUrl}/send_message`, {
            body: { user },
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
        }).then((response) => {
            log(`message successfully sent to ${user.customer_name} at ${user.phone_number}`, true)
        })
    } else {
        let date = new Date()
        log(`${date.toLocaleTimeString()} Message failed to send to ${user.customer_name} at ${user.phone_number}`)})
    }
}

const sendTexts = (users, baseApiUrl) => {
    for(const user in users) {
        sendText(user, baseApiUrl)
    }

    log(`\n --- ${(new Date()).toLocaleTimeString()} Message delivery complete ---`)
}

const log = (message, logToConsole = false) => {
    if (logToConsole) console.log(message)

    fs.appendFile(
        LOG_FILE,
        message,
        (err) => {
            console.error(err)
        }
    )
}

const run = () => {
    const baseApiUrl = process.env.BASE_API_URL || DEFAULT_API_BASE_URL

    const users = getUsers('file') // probably read the source this from an env var

    const interval = setInterval(() => {
        sendTexts(users, baseApiUrl, interval)
        clearInterval(interval)
    }, 34)
}

run()