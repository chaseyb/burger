// dependencies
const express = require("express");
// import the model to use its db functions for burger.js
const burger = require("../models/burger.js");
const { realpathSync } = require("fs");
const { resourceUsage } = require("process");

// create the router for the app, and export 
const router = express.Router();
// Create routes and set up logic where required.
router.get("/", (req, res) => {
    burger.selectAll((data) => {
        var hbsObject = {
            burgers: data
        };
        console.log(hbsObject);
        res.render("index", hbsObject);
    });
});

//add new Burger to the db
router.post("/api/burgers", (req, res) => {
    burger.insertOne(["burger_name", "devoured"], [req.body.burger_name, req.body.devoured], (result) => {
        // send back the ID of the new burger
        res.json({ id: result.insertId });
    });
});

// set burger devoured status to true
router.put("/api/burgers/:id", (req, res) => {
    const condition = "id =  " + req.params.id;
    console.log("condition", condition);
    burger.updateOne({ devoured: req.body.devoured }, condition, (result) => {
        if (result.changedRows === 0) {
            // if no rows were changed, then the ID must not exit, so 404
            return res.status(404).end();
        }
        else {
            res.status(200).end();
        }
    });
});

// delete Burger
router.delete("/api/burgers/:id", (req, res) => {
    const condition = "id = " + req.params.id;
    console.log("condition", condition);

    burger.deleteOne(condition, (result) => {
        if (result.changedRows === 0) {
            // if no rows were changed, then the ID must not exit, so 404
            return res.status(404).end();
        } else {
            res.status(200).end();
        }
    });
});
module.exports = router;