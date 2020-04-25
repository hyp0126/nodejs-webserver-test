/* index.js
 * Assignment 3: Shop (Server)
 *
 * Revision History 
 *     Yi Phyo Hong, 2020.03.30: Created
 */

// array for province tax rates in Canada
// sales tax rate = province tax rate + federation tax rate
var taxRate = [
    ["Alberta", 5],
    ["British Columbia", 12],
    ["Manitoba", 12],
    ["New-Brunswick", 15],
    ["Newfoundland and Labrador", 15],
    ["Northwest Territories", 5],
    ["Nova Scotia", 15],
    ["Nunavut", 5],
    ["Ontario", 13],
    ["Prince Edward Island", 15],
    ["Québec", 14.975],
    ["Saskatchewan", 11],
    ["Yukon", 5]
];

// array for delivery cost
var deliveryTime = [
    ["1 day", 30],
    ["2 days", 25],
    ["3 days", 20],
    ["4 days", 15]
];

// import dependecies
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// set up variable to use package
myApp = express();

// set path to public folders and view folders
myApp.set('views', path.join(__dirname, 'views'));

// use public folder for CSS etc.
myApp.use(express.static(__dirname + '/public'));
myApp.set('view engine', 'ejs');
myApp.use(bodyParser.urlencoded({extended: false}));

// set up different routes (pages) of the website

// home page
myApp.get('/', function(req, res){
    res.render('shop');
});

myApp.post('/', function(req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;
    var address = req.body.address;
    var city = req.body.city;
    var postCode = req.body.postCode;
    var province = req.body.province;
    var computer = req.body.computer;
    var monitor = req.body.monitor;
    var printer = req.body.printer;
    var computerTotal = 0;
    var monitorTotal = 0;
    var printerTotal = 0;
    var shippingCharges = 0;
    var taxPecentage = 0;
    var total = 0;
    var taxes = 0;
    var subTotal = 0;
    var i = 0;

    //Find delivery charge
    for (i = 0; i < deliveryTime.length; i++)
    {
        if (deliveryTime[i][0] == req.body.deliveryTime)
        {
            shippingCharges = deliveryTime[i][1];
            break;
        }
    }

    //Find tax rate
    for (i = 0; i < taxRate.length; i++)
    {
        if (taxRate[i][0] == province)
        {
            taxPecentage = taxRate[i][1];
            break;
        }
    }

    //Calcuate computer order
    if (computer == "")
    {
        computerTotal = 0;
    }
    else
    {
        computerTotal = 10 * parseInt(computer);
    }

    //Calcuate monitor order
    if (monitor == "")
    {
        monitorTotal = 0;
    }
    else
    {
        monitorTotal = 20 * parseInt(monitor);
    }

    //Calcuate printer order
    if (printer == "")
    {
        printerTotal = 0;
    }
    else
    {
        printerTotal = 30 * parseInt(printer);
    }

    //Calcuate totals
    subTotal = computerTotal + monitorTotal + printerTotal 
        + shippingCharges;
    taxes = subTotal * taxPecentage / 100;
    total = subTotal + taxes;

    var invoiceData = {
        name: name,
        email: email,
        phone: phone,
        address: address,
        city: city,
        postCode: postCode,
        province: province,
        computer: computer,
        monitor: monitor,
        printer: printer,
        computerTotal:computerTotal,
        monitorTotal: monitorTotal,
        printerTotal: printerTotal,
        shippingCharges: shippingCharges,
        taxPecentage: taxPecentage,
        total: total,
        taxes: taxes,
        subTotal: subTotal
    }

    res.render('shop', invoiceData);
});
// start the server and listen at aport
myApp.listen(80);

// tell everything waw ok
console.log('website at port 80 was running.')