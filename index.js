/* index.js
 * Assignment 4: Shop (Mongo DB)
 *
 * Revision History 
 *     Yi Phyo Hong, 2020.04.12: Created
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
const {check, validationResult} = require('express-validator'); // ES6 standard for destructuring an object

// set up the DB connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/computerShop', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// set up file uplaad
const fileUpload = require('express-fileupload');

// get express session
const session = require('express-session');

// set up the model for the order
const Order = mongoose.model('Order', {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    postCode: String,
    province: String,
    computer: Number,
    monitor: Number,
    printer: Number,
    computerTotal: Number,
    monitorTotal: Number,
    printerTotal: Number,
    shippingCharges: Number,
    image: String,
    subTotal: Number,
    taxPecentage: Number,
    taxes: Number,
    total: Number
});

// set up the model for admin
const Admin = mongoose.model('Admin', {
    username: String,
    password: String
});

// set up variable to use package
myApp = express();

// set path to public folders and view folders
myApp.set('views', path.join(__dirname, 'views'));

// use public folder for CSS etc.
myApp.use(express.static(__dirname + '/public'));
myApp.set('view engine', 'ejs');
myApp.use(bodyParser.urlencoded({extended: false}));

// support for file handling
myApp.use(fileUpload());

// set up session
myApp.use(session({
    secret: 'superrandomsecret',
    resave: false,
    saveUninitialized: true
}));

// home page
myApp.get('/', function(req, res){
    res.render('shop');
});

// -------- validation functions --------
// Custom phone validation function
function customPostCodeValidation(value){
    var postCodeRegex = /^[a-zA-Z]\d[a-zA-Z]\s\d[a-zA-Z]\d$/

    if(!postCodeRegex.test(value))
    {
        throw new Error('Post Code should be in the format X9X 9X9');
    }
    return true;
}

// Custom phone validation function
function customPhoneValidation(value){
    var phoneRegex = /^\d{3}-\d{3}-\d{4}$/;

    if(!phoneRegex.test(value))
    {
        throw new Error('Phone should be in the format xxx-xxx-xxxx');
    }
    return true;
}

/* Custom validation for Orders
    1. Orders should be a number
    2. User has to buy one item at least
*/
function customOrderValidations(value, {req}){
    var inputBuffer = "";
    var orderNumber = 0;

    //Check Computer order (number)
    inputBuffer = value.trim();
    if (isNaN(inputBuffer))
    {
        throw new Error('Computer order must be a number');
    }
    else if (parseInt(inputBuffer) != 0 && inputBuffer != 0)
    {
        orderNumber++;
    }   

    //Check Monitor order (number)
    inputBuffer = req.body.monitor.trim();
    if (isNaN(inputBuffer))
    {
        throw new Error('Monitor order must be a number');
    } 
    else if (parseInt(inputBuffer) != 0 && inputBuffer != 0)
    {
        orderNumber++;
    }

    //Check Printer order (number)
    inputBuffer = req.body.printer.trim();
    if (isNaN(inputBuffer))
    {
        throw new Error('Printer order must be a number');
    }
    else if (parseInt(inputBuffer) != 0 && inputBuffer != 0)
    {
        orderNumber++;
    }

    //Check total order (at least, buy one item)
    if (orderNumber == 0)
    {
        throw new Error('You must buy one item at least');
    }

    return true;
}

// Process submitted form data
myApp.post('/', [
    check('name', 'Name is required').trim().notEmpty(),
    check('email', 'Email is required').trim().isEmail(),
    check('phone').custom(customPhoneValidation),
    check('address', 'Address is required').trim().notEmpty(),
    check('city', 'City is required').trim().notEmpty(),
    check('province', 'Province is required').trim().notEmpty(),
    check('postCode').custom(customPostCodeValidation),
    check('computer').custom(customOrderValidations)
], function(req, res) {

    const errors = validationResult(req);
    if (!errors.isEmpty())
    {
        res.render('shop', {
            errors:errors.array()
        });
    }
    else
    {
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
        var subTotal = 0;
        var taxPecentage = 0;
        var taxes = 0;
        var total = 0;
        var i = 0;
        var imageName = req.files.myimage.name;
        var image = req.files.myimage;
        var imagePath = 'public/images/'+imageName;
        image.mv(imagePath, function(err){
            console.log(err);
        });

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
            computer = 0;
            computerTotal = 0;
        }
        else
        {
            computer = parseInt(computer);
            computerTotal = 10 * computer;
        }

        //Calcuate monitor order
        if (monitor == "")
        {
            monitor = 0;
            monitorTotal = 0;
        }
        else
        {
            monitor = parseInt(monitor);
            monitorTotal = 20 * monitor;
        }

        //Calcuate printer order
        if (printer == "")
        {
            printer= 0;
            printerTotal = 0;
        }
        else
        {
            printer = parseInt(printer);
            printerTotal = 30 * printer;
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
            image: imageName,
            computerTotal:computerTotal,
            monitorTotal: monitorTotal,
            printerTotal: printerTotal,
            shippingCharges: shippingCharges,
            image: imageName,
            subTotal: subTotal,
            taxPecentage: taxPecentage,
            taxes: taxes,
            total: total
        }

        // create an object for the model Order
        var myOrder = new Order(invoiceData);
        //save the order
        myOrder.save().then(function(){
            console.log('New order created');
        });
        // display receipt
        res.render('invoice', invoiceData);
    }
});

// set up different routes (pages) of the website
// All orders data
myApp.get('/allorders', function(req, res) {
    // check if the user is logged in
    if(req.session.userLoggedIn){
        Order.find({}).exec(function(err, orders){
            console.log(err);
            res.render('allorders', {orders: orders});
        });
    }
    else{ // otherwise send the user to the login page
        res.redirect('/login');
    }   
});

// login page
myApp.get('/login', function(req, res){
    res.render('login');
});

// login form post
myApp.post('/login', function(req, res){
    var user = req.body.username;
    var pass = req.body.password;

    Admin.findOne({username: user, password: pass}).exec(function(err, admin){
        // log errors
        console.log('Error: ' + err);
        console.log('Admin: ' + admin);
        if(admin){
            // store username in session and set logged in true
            req.session.username = admin.username;
            req.session.userLoggedIn = true;
            // redirect to the dashboard
            res.redirect('/allorders');
        }
        else{
            res.render('login', {error: 'Sorry, cannot login!'});
        }
    });
});

myApp.get('/logout', function(req, res){
    req.session.username = '';
    req.session.userLoggedIn = false;
    res.render('login', {error: 'Seccessfully logged out'});
});

myApp.get('/delete/:oid', function(req, res){
    // check if the user is logged in
    if(req.session.userLoggedIn){
        //delete
        var orderid = req.params.oid;
        console.log(orderid);
        Order.findByIdAndDelete({_id: orderid}).exec(function(err, order){
            console.log('Error: ' + err);
            console.log('Order: ' + order);
            if(order){
                res.render('delete', {message: 'Successfully deleted!'});
            }
            else{
                res.render('delete', {message: 'Sorry, could not delete!'});
            }
        });
    }
    else {
        res.redirect('/login');
    }
});


// start the server and listen at aport
myApp.listen(8080);

// tell everything waw ok
console.log('website at port 8080 was running.')