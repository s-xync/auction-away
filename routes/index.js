const express = require("express");
const router = express.Router();
const request = require("request");

// Get Homepage with not over auctions
router.get("/", function(req, res) {
  request.get(
    process.env.SERVER_API_URL + "/auctions/api/notover",
    (err, response, body) => {
      if (response.statusCode == 200) {
        var auctions = JSON.parse(body);
        res.render("auctions", {
          title: "Auctions | Auction Away",
          auctions: auctions
        }); //array of auction objects
      } else {
        console.log(err);
        console.log(response.error);
        res.redirect("/error");
      }
    }
  );
});

module.exports = router;
