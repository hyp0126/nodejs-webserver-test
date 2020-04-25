/* shop.js
 * Assignment 3: Shop (Server)
 *
 * Revision History 
 *     Yi Phyo Hong, 2020.03.30: Created
 */

// array for provinces in Canada
var province = [
    "Alberta",
    "British Columbia",
    "Manitoba",
    "New-Brunswick",
    "Newfoundland and Labrador",
    "Northwest Territories",
    "Nova Scotia",
    "Nunavut",
    "Ontario",
    "Prince Edward Island",
    "Québec",
    "Saskatchewan",
    "Yukon"
];

// array for delivery cost
var deliveryTime = [
    "1 day",
    "2 days",
    "3 days",
    "4 days"
];

/*
 * onload event function
 * set data to province and delivery date combo box
 */
function onLoad()
{
    var provinceHtml = "";
    var deliveryHtml = "";
    var i = 0;

    // set province names to combo box
    for (i = 0; i < province.length; i++)
    {
        provinceHtml += `<option value="${province[i]}">${province[i]}</option>`;
    }
    document.getElementById("province").innerHTML = provinceHtml;

    // set delivery time to combo box
    for (i = 0; i < deliveryTime.length; i++)
    {
        deliveryHtml += `<option value="${deliveryTime[i]}">${deliveryTime[i]}</option>`;
    }
    document.getElementById("deliveryTime").innerHTML = deliveryHtml;
}

/*
 * submit event function
 * 1. Validate user inputs
 *    If not, display errors and request correct inputs
 * 2. If user inputs is all correct, send input data to server 
 */
function processForm()
{
    //Validate user inputs
    if (validateForm())
    {
        //If user inputs are correct, send input data to server
        return true;
    };

    //stops the form from submitting to the next page
    return false;
}

/*
 * Validation function
 * 1. Validate user inputs
 * 2. If not, display errors and request correct inputs
 */
function validateForm()
{
    var ret = false;
    var errors = "";
    var inputBuffer = "";
    var orderNumber = 0;
    var phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    var postCodeRegex = /^[a-zA-Z]\d[a-zA-Z]\s\d[a-zA-Z]\d$/
    
    //Check Name(required)
    inputBuffer = document.getElementById("name").value.trim();
    if (inputBuffer.length == 0)
    {
        errors += "Name is required<br>";
    }

    //Check Email(required)
    inputBuffer = document.getElementById("email").value.trim();
    if (inputBuffer.length == 0)
    {
        errors += "Email is required<br>";
    }

    //check Phone(required, Regex)
    inputBuffer = document.getElementById("phone").value.trim();
    if (inputBuffer.length == 0)
    {
        errors += "Phone number is required<br>";
    }
    else if (!phoneRegex.test(inputBuffer))
    {
        errors += "Phone number is incorrect<br>";
    }
    
    //Check Address(required)
    inputBuffer = document.getElementById("address").value.trim();
    if (inputBuffer.length == 0)
    {
        errors += "Address is required<br>";
    }

    //Check City(required)
    inputBuffer = document.getElementById("city").value.trim();
    if (inputBuffer.length == 0)
    {
        errors += "City is required<br>";
    }

    //check Post Code(required, Regex)
    inputBuffer = document.getElementById("postCode").value.trim();
    if (inputBuffer.length == 0)
    {
        errors += "Post Code is required<br>";
    }
    else if (!postCodeRegex.test(inputBuffer))
    {
        errors += "Post Code is incorrect<br>";
    }

    //Check Province(required)
    inputBuffer = document.getElementById("province").value;
    if (inputBuffer.length == 0)
    {
        errors += "Province is required<br>";
    }

    //Check Computer order (number)
    inputBuffer = document.getElementById("computer").value.trim();
    document.getElementById("computer").value = inputBuffer;
    if (isNaN(inputBuffer))
    {
        errors += "Computer order must be a number<br>";
    }
    else if (parseInt(inputBuffer) != 0 && inputBuffer != 0)
    {
        orderNumber++;
    }   

    //Check Monitor order (number)
    inputBuffer = document.getElementById("monitor").value.trim();
    document.getElementById("monitor").value = inputBuffer;
    if (isNaN(inputBuffer))
    {
        errors += "Monitor order must be a number<br>";
    }
    else if (parseInt(inputBuffer) != 0 && inputBuffer != 0)
    {
        orderNumber++;
    }

    //Check Printer order (number)
    inputBuffer = document.getElementById("printer").value.trim();
    document.getElementById("printer").value = inputBuffer;
    if (isNaN(inputBuffer))
    {
        errors += "Printer order must be a number<br>";
    }
    else if (parseInt(inputBuffer) != 0 && inputBuffer != 0)
    {
        orderNumber++;
    }

    //Check total order (at least, buy one item)
    if (orderNumber == 0)
    {
        errors += "You must buy one itme at least<br>";
    }

    //Display errors
    document.getElementById("message").innerHTML = errors;

    if (errors === "")
    {
        ret = true;
    }
    else
    {
        ret = false;
        //clear invoice
        document.getElementById("invoice").innerHTML = "";
    }

    return ret;
}
