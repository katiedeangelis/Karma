var express = require("express");
var router = express.Router();
var db = require("../../models");
var currentUser = null;

// favor_karma_koin_price
// favor_description
function getFavors(req, res) {
    var group_id = 1;
    var activeFavors = [];
    db.Favor.findAll({
        where: {
            GroupId: group_id,
            favor_status: 'active'
        },
        order: ['createdAt']
    }).then(function (data, err) {
        if (err) {
            // If an error occurred, send a generic server failure
            console.log("an error occurred");
            console.log(err);
            res.status(500).end();
        } else if (data[0]) {
            console.log("about to dump favors");
            console.log("data" + JSON.stringify(data));
            console.log("name " + data[0].favor_name);
            console.log("koins " + data[0].favor_price);
            console.log("data is returned");
            console.log("data length " + data.length);
            var favorObject = [];
            for (let i = 0; i < data.length; i++) {
                favorObject = {
                    id: data[i].id,
                    favor_name: data[i].favor_name,
                    favor_price: data[i].favor_price
                }
                activeFavors.push(favorObject);
            }
            res.render("favors", {
                activeFavor: activeFavors
            });
        } else {
            // no rows returned 
            console.log("no rows returned");
            res.render("favors", {
                activeFavor: []
            });
        }
    });
}

function createNewFavor(req, res) {
    console.log("IM IN CREATE NEW FAVOR");
    var group_id = 1;
    db.Favor.create({
            favor_name: req.body.favor_name,
            favor_desc: req.body.favor_desc,
            favor_asker_id: req.body.favor_asker_id,
            favor_status: "active",
            favor_price: req.body.favor_price,
            GroupId: group_id
            
        })
        .then(function (data, err) {
            if (err) {
                // If an error occurred, send a generic server failure
                console.log(err);
                res.status(500).end();
            } else {
                console.log(data);
                res.status(200).end();
            }
        });
    getFavors(res);
}


function updateFavor(req, res) {
    console.log("Im in UpdateFavor now on the server side");
    console.log(req.params);
    console.log(req.body);
    console.log("going to do the update now");
    db.Favor.update({
        favor_completer_id: req.body.favor_completer_id,
        favor_status: req.body.favor_status
    }, {
        where: {
            id: req.params.id
        }
    }).then(function (data, err) {
        console.log("data: ");
        console.log(data);
        console.log("err: ");
        console.log(err);
        if (err) {
            // If an error occurred, send a generic server failure
            console.log(err);
            return res.status(500).end();
        } else if (data.changedRows == 0) {
            console.log(data);
            // If no rows were changed, then the ID must not exist, so 404
            console.log("favor row did not get updated");
            return res.status(404).end();
        } else {
            res.status(200).end();
        }
    });
}

// Create all our routes and set up logic within those routes where required.
router.get("/", function (req, res) {
    res.render("landing");
});

router.get("/about", function (req, res) {
    res.render("about");
});

router.get("/favors", function (req, res) {
    getFavors(req, res);
});

router.post("/api/favor/new", function (req, res) {
    console.log("im in api/favors about to create a favor");
    createNewFavor(req, res);
});

router.put("/api/favor/:id", function (req, res) {
    console.log("im updating the favor now");
    updateFavor(req, res);
});

router.get("/signedin", function (req, res) {
    res.render("signedin");
});

router.get("/profile", function (req, res) {
    res.render("profile", {
        user: currentUser
    });
});

router.post("/api/user/create", function (req, res) {
    createNewUser(req, res)
});

function createNewUser(req, res) {
    // Find all database entries
    db.User.findAll({
        //Where the FB ID client matches a FB ID in the database
        where: {
            fb_user_id: req.body.fb_user_id
        }
    }).then(function (data, err) {
        // TODO: Throwing error when table doesn't exist
        // if (err) {
        //     res.status(500).end();
        // } 
        // If a row is returned, that user alraedy exists in the db
        if (data[0]) {
            currentUser = data[0];
            // res.status(200).end();
            res.render("profile", {
                user: currentUser
            });
        } else {
            // If no rows are returned create a new user and send it to the db
            currentUser = db.User.create({
                    user_name: req.body.user_name,
                    user_email: req.body.user_email,
                    profile_pic_link: req.body.fb_user_pic,
                    fb_user_id: req.body.fb_user_id,
                    user_karma_koins: 50
                })
                .then(function (data, err) {
                    if (err) {
                        // If an error occurred, send a generic server failure
                        res.status(500).end();
                    } else {
                        res.status(200).end();
                    }
                });
            res.render("profile", {
                user: currentUser
            });
        }
    });

}


// Export routes for server.js to use.
module.exports = router;