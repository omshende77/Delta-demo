// Required Packages
if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
// console.log(process.env.SECRET);
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate'); 
const cookieParser = require('cookie-parser');
const users = require("./models/user.js"); 
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash'); // For flash messages(neccesary to use session if you wnat to use flash)
const { expression } = require('joi'); // For validation
const passport = require('passport'); 
const LocalStrategy = require('passport-local'); // For user authentication


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");  

const dbUrl = process.env.ATLASDB_URL;

// Setting up view engine and paths
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine('ejs',ejsMate);

// Middlewares
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(express.static(path.join(__dirname,"/public")));
app.use(cookieParser("Secretcode")); // Middleware to parse cookies


// Database connection
main()
.then((res)=>{
    console.log("Db is connected");
})
.catch((err)=>{
    console.log("Error in connecting to db");
});
async function main(){
    await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret: process.env.SECRET,
    },
    touchAfter : 24 * 3600,
});

store.on("error", (err)=>{
    console.log("Error in mongo session Store..",err) 
})

const sessionOptions = {
    store,
    secret : process.env.SECRET, 
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 day
        maxAge: 1000 * 60 * 60 * 24 * 7,// 7 days
        httpOnly: true, // Helps prevent XSS attacks
    },
};

//default route
app.get("/",(req,res)=>{
    // res.send("<h1>Hello this is hotellisting page</h1>");
    res.redirect("/listings");
});

app.use(session(sessionOptions));
app.use(flash()); // Middleware for flash messages
// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(users.authenticate()));

passport.serializeUser(users.serializeUser());
passport.deserializeUser(users.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    // console.log("Flash Success:", res.locals.success);
    res.locals.error = req.flash("error");
    // console.log("Flash Error:", res.locals.error);
    res.locals.currUser = req.user; // Make current user available in views
    // console.log("Current User:", res.locals.currUser);
    next();
});

// Middleware to log URL
// app.get("/demoUser", async (req, res) => {
//     let fakeuser = new users({
//         username: "demoUser",
//         email: "fakeuser@gmail.com",
//     });
//     const registereduser = await users.register(fakeuser,"demouser")
//     console.log("Saved document:", registereduser);
//     res.send("User registered successfully");
// });

app.use("/listings",listingRouter);                                 // Listing routes
app.use("/listings/:id/reviews", reviewRouter);                     // Review routes
app.use("/", userRouter);                                           // User routes

// Middleware to log URL
app.use((req, res, next) => {
  console.log("URL:", req.url);
  next();
});


// // 404 Catch-all Route — ✅ PLACED AT CORRECT POSITION
// app.all("*", (req, res, next) => {
//    next(new ExpressError(404, "Page not found"));
// });

//MIDDLEWARES - Global Error Handler — ✅ LAST MIDDLEWARE
app.use((err,req,res,next)=>{
    const {status = 500,message = "Something went wrong.."} = err;
    res.status(status).render("error.ejs",{err});
    // res.status(status).send(message);
    // res.send("Something get wrong..");
});



// Server Listener
app.listen(2004 ,() => {
    console.log("App is listening in port 2004...");
});


































































































































































// const express = require('express');
// const app = express();
// const mongoose = require('mongoose');
// const methodOverride = require('method-override');
// const port = 2004;
// const listing = require("./models/listing.js");
// const mongo_url = "mongodb://127.0.0.1:27017/WanderLust";
// const path = require('path');
// const ejsMate = require('ejs-mate');
// const wrapAsync = require('./utils/wrapAsync.js');
// const ExpressError = require("./utils/ExpressError"); // ✅ Make sure path and case match


// app.set("view engine","ejs");
// app.set("views",path.join(__dirname,"views"));
// app.use(methodOverride('_method'));
// app.use(express.urlencoded({extended : true}));
// app.engine('ejs',ejsMate);
// app.use(express.static(path.join(__dirname,"/public")));



// main()
// .then((res)=>{
//     console.log("Db is connected");
// })
// .catch((err)=>{
//     console.log("Error in connecting to db");
// });


// async function main(){
//     await mongoose.connect(mongo_url);
// }

// //default route
// app.get("/",(req,res)=>{
//     // res.send("<h1>Hello this is hotellisting page</h1>");
//     res.redirect("/listings");
// });


// app.use((req, res, next) => {
//   console.log("URL:", req.url);
//   next();
// });


// //delete route
// app.delete("/listings/:id",wrapAsync (async (req,res)=>{
//     const id = req.params.id;
//     let dlist = await listing.findByIdAndDelete(id);
//     console.log(dlist);
//     res.redirect("/listings");
// }));

// //Edit Route
// app.get("/listings/:id/edit",wrapAsync (async (req,res)=>{
//     let {id} = req.params;
//     let list = await listing.findById(id);
//     res.render("listings/edit.ejs",{list});
// }));
// app.put("/listings/:id",wrapAsync (async (req,res)=>{
//     let {id} = req.params;
//     let {title,description,image,price,country,location} = req.body;
//     //method 1
   
//     let list = await listing.findById(id);
//     if(!list){
//         throw new ExpressError(404,"Listing not found");
//     };
//     list.title = title;
//     list.description = description;
//     list.image = {
//         url: image,
//         filename: "listingimage"
//     };    
//     list.price = price;
//     list.country = country;
//     list.location = location;
//     await list.save();

//     // //method 2
//     // await listing.findByIdAndUpdate(id, {
//     //     title,
//     //     description,
//     //     price,
//     //     country,
//     //     location
//     // });
    
// res.redirect("/listings");
// }));

// //create Route
// app.get("/listings/new",(req,res)=>{
//     res.render("listings/new.ejs");
// });

// app.post("/listings",wrapAsync(async (req,res)=>{
//     let {title,description,image,price,country,location} = req.body;
//     let newlist = new listing({
//         title : title,
//         description : description,
//         image: {
//             url: image,
//             filename: image.filename
//         },        
//         price : price,
//         country : country,
//         location : location,
//     });
//     console.log(newlist);
//     await newlist.save();
//     res.redirect("/listings");

// }));


// //show route
// app.get("/listings/:id",wrapAsync (async (req,res)=>{
//     const {id} = req.params;
//     const findlist = await listing.findById(id);
//     console.log(findlist);
//     res.render("listings/show.ejs",{findlist});
//     // res.redirect("/listings");
    
// }));

// //main page of listings
// app.get("/listings",wrapAsync ( async (req,res)=>{
//     const allListing = await listing.find({}); 
//     res.render("listings/index.ejs",{allListing})
//     // listing.find()
//     // .then((data)=>{
//     //     console.log(data);
//     // })
//     // .catch((err)=>{
//     //     console.log(err);
//     // });
// }));
 
// app.all("*", (req, res) => {
//    res.send("404 page not found");
// });


// //MIDDLEWARES


// app.use((err,req,res,next)=>{
//     const {status = 500,message = "Something went wrong.."} = err;
//     res.status(status).send(message);
//     // res.send("Something get wrong..");
// });




// app.listen(port ,() => {
//     console.log("App is listening in port 2004...");
// });  

































































// // app.get("/testlisting",async (req,res)=>{
// //     let samplelisting = new listing({
// //         title : "My new Home",
// //         description : "By the beach",
// //         price : "12000",
// //         location : "Calangate,Goa",
// //         country : "India", 
// //     });
// //     const result = await samplelisting.save();
// //     console.log("Saved document:", result);
// //     res.send("Succesful testing");
// // });
