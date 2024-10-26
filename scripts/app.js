const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Weight = require("../models/weight");
const parentDir = path.join(__dirname, "..");

const app = express();

const dbURI = "mongodb+srv://ChrisGug:ZSWshiT8DpvVJdsY@weights.mswfn.mongodb.net/?retryWrites=true&w=majority&appName=Weights";
mongoose.connect(dbURI)
.then(result => app.listen(3000))
.catch(error => console.error(error));

app.set("view engine", "ejs");

app.use(express.static(parentDir + "/public"));
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.render("index", { title: "Home" });
});

app.get("/track", (req, res) => {
    let yesterday = new Date();
    yesterday.setTime(yesterday.getTime() - ((24 * 60 * 60 * 1000)));

    Weight.find().sort({createdAt: -1}).limit(7).then(result => {
        res.render("track", { title: "Track", entries: result, date: yesterday });
    }).catch(error => {
        console.log(error);
    });
});

app.post("/track", (req, res) => {
    const weight = new Weight(req.body)
    weight.save().then(result => {
        res.redirect("/track");
    }).catch(err => {
        console.log(err);
    })
    console.log(req.body);
});

app.delete("/track.html/:id", (req, res) => {
    const id = req.params.id;

    Weight.findByIdAndDelete(id).then(result => {
        res.json({ redirect: "/track" });
    }).catch(error => {
        console.log(error);
    });
});

app.use((req, res) => {
    res.status(404).render("404", { title: 404 });
});
