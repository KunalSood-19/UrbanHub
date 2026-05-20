const express = require("express");

const router = express.Router();

const services = [

{
id:1,
name:"Home Cleaning",
price:499,
image:"homecleaning.jpg"
},

{
id:2,
name:"Electrician",
price:299,
image:"electric.jpg"
},

{
id:3,
name:"Plumber",
price:399,
image:"plumber.jpg"
},

{
id:4,
name:"AC Repair",
price:699,
image:"ac.jpg"
},

{
id:5,
name:"Gardening",
price:199,
image:"gardening.jpg"
},

{
id:6,
name:"Painter",
price:419,
image:"carpenter.jpg"
}

];

router.get("/", (req,res)=>{

res.json(services);

});

module.exports = router;