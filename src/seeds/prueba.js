const CryptoJS = require('crypto-js')
const crypto = require('crypto');
const btoa = require('btoa');

measurement = {
  "command":"traceroute",
  "argument":"192.51.100.7",
  "name":"example1",
  "hosts":[
      {"asn":64496, "router":"r1-newyork"},
      {"asn":64496, "router":"r2-paris"},
      {"asn":64496, "router":"r3-london"},
      {"asn":65537, "router":"lax001.example.net"},
      {"asn":65550, "router":0},
  ]
}

const data = JSON.stringify(measurement);
console.log(data)

const private_key = 'J05lYREa1hriXUL1tByA7l8orh9GN7adC0xRSN6g';
let firma1 = CryptoJS.HmacSHA256(data, private_key);
console.log('firma1: ', firma1)
let base64_1 = btoa(firma1);
console.log(base64_1)


//creating hmac object 
var hmac = crypto.createHmac('sha256', private_key);
//passing the data to be hashed
data_hmac = hmac.update(data);
//Creating the hmac in the required format
gen_hmac= data_hmac.digest('hex');
//Printing the output on the console
console.log("firma2 :", gen_hmac);
let base64_2 = btoa(gen_hmac);
console.log(base64_2)


// Below was silly mistake. In my question those parameters are swapped.

var hmac = crypto.createHmac("sha256", private_key )
                 .update(data)
                 .digest('base64')
console.log(hmac);