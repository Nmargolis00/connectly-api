// import fs
const { response } = require("express");
let fs = require("fs");

// read csv
let csv = fs.readFileSync("./customerData.csv", "utf8");

// split csv into array
let csvArr = csv.split(",");

const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

// function to send text
const sendText = () => {
  let date = new Date();

  //loop through the array starting at index 2 to avoid the column headers and create an object for the user information
  for (let i = 2; i < csvArr.length; i = i + 2) {
    const userObj = {};

    userObj.customer_name = csvArr[i];
    userObj.phone_number = csvArr[i + 1];

    // generic message template that will be sent to the user and is easily customizable
    let messageTemplate = `Hey ${userObj.customer_name}, we are glad to have you as our customer.`;
    userObj.text = messageTemplate;

    // an example of creating edge cases and logging issues to a file for easy reading if there is an error
    if (phoneRegex.test(userObj.phone_number)) {
        fetch("https://64371b533e4d2b4a12e3c52a.mockapi.io/api/v1/send_message", {
          body: { userObj },
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        })
        .then((response) => {console.log(`message successfully sent to ${userObj.customer_name} at ${userObj.phone_number}`)});
    } else {
        fs.appendFile(
          "./log.txt",
          `${date.toLocaleTimeString()} Message failed to send to ${
            userObj.customer_name
          } at ${userObj.phone_number}`,
          (err) => {
            console.error(err);
          }
        );
    };

    clearInterval(interval);
  };
  // Creating/Updating a log to show that the messages have been sent or if there was an error
  fs.appendFile(
    "./log.txt",
    `\n --- ${date.toLocaleTimeString()} Message delivery complete ---`,
    (err) => {
      console.error(err);
    }
  );
};


// setInterval to send text every 34 seconds to limit the amount of messages to 30 per second. This can easily be adjusted if the customer decides to scale their operation.
const interval = setInterval(() => {
  sendText();
}, 34);
