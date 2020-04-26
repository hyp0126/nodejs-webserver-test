/* shop.js
 * Assignment 4: Shop (Mongo DB)
 *
 * Revision History 
 *     Yi Phyo Hong, 2020.04.12: Created
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
    return true;
}
