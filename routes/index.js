var express = require('express');
var mongoose = require('mongoose');
var sanitize = require('mongo-sanitize');
var router = express.Router();
var jwt = require('express-jwt');

/* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
//});
var ae_partys = mongoose.model('ae_partys', {});
var ae_contested_deposit_losts = mongoose.model('ae_contested_deposit_losts', {});
var ae_parties_contests = mongoose.model('ae_parties_contests', {});
var ae_seatshares = mongoose.model('ae_seatshares', {});
var ae_voteshares = mongoose.model('ae_voteshares', {});
var ae_womens = mongoose.model('ae_womens', {});
var ae_maps = mongoose.model('ae_maps', {});
var ae_voter_turnouts = mongoose.model('ae_voter_turnouts', {})
var ge_contested_deposit_losts = mongoose.model('ge_contested_deposit_losts', {});
var ge_parties_contests = mongoose.model('ge_parties_contests', {});
var ge_seatshares = mongoose.model('ge_seatshares', {});
var ge_voteshares = mongoose.model('ge_voteshares', {});
var ge_womens = mongoose.model('ge_womens', {});
var ge_maps = mongoose.model('ge_maps', {});
var ge_voter_turnouts = mongoose.model('ge_voter_turnouts', {});
var color_codes = mongoose.model('color_codes', {});

var getdata = function (req, res) {
    console.log("Entering get data function");

    // The sanitize function will strip out any keys that start with '$' in the input,
    // so you can pass it to MongoDB without worrying about malicious users overwriting
    // query selectors.
    this.state = sanitize(req.params.state);
    this.year = sanitize(req.params.year);
	this.party = sanitize(req.params.party);
	this.limit = sanitize(req.params.limit);
    this.searchvalue = sanitize(req.params.searchvalue);
    this.filtervalue = sanitize(req.params.filtervalue);
    this.category = sanitize(req.params.category);
	this.position = sanitize(req.params.position);

    return this;
};

router.get('/api/elections/ae_partys', function (req, res) {
    ae_partys.find({}, { "State": 0, "_id": 0 }, function (err, elections) {
        res.json(elections);
    })
});
router.get('/api/elections/ae_contested_deposit_losts', function (req, res) {
    ae_contested_deposit_losts.find({}, { "State": 0, "_id": 0 }, function (err, elections) {
        res.json(elections);
    })
});
router.get('/api/elections/ae_parties_contests', function (req, res) {
    ae_parties_contests.find({}, { "State": 0, "_id": 0 }, function (err, elections) {
        res.json(elections);
    })
});
router.get('/api/elections/ae_seatshares', function (req, res) {
    ae_seatshares.find({}, { "State": 0, "_id": 0 }, function (err, elections) {
        res.json(elections);
    })
});
router.get('/api/elections/ae_voteshares', function (req, res) {
    ae_voteshares.find({}, { "State": 0, "_id": 0 }, function (err, elections) {
        res.json(elections);
    })
});
router.get('/api/elections/ae_womens', function (req, res) {
    ae_womens.find({}, { "State": 0, "_id": 0 }, function (err, elections) {
        res.json(elections);
    })
});
router.get('/api/elections/ae_voter_turnouts', function (req, res) {
    ae_voter_turnouts.find({}, { "State": 0, "_id": 0 }, function (err, elections) {
        res.json(elections);
    })
});

router.get('/api/elections/ge_contested_deposit_losts', function (req, res) {
    ge_contested_deposit_losts.find({}, { "State": 0, "_id": 0 }, function (err, elections) {
        res.json(elections);
    })
});
router.get('/api/elections/ge_parties_contests', function (req, res) {
    ge_parties_contests.find({}, { "State": 0, "_id": 0 }, function (err, elections) {
        res.json(elections);
    })
});
router.get('/api/elections/ge_seatshares', function (req, res) {
    ge_seatshares.find({}, { "State": 0, "_id": 0 }, function (err, elections) {
        res.json(elections);
    })
});
router.get('/api/elections/ge_voteshares', function (req, res) {
    ge_voteshares.find({}, { "State": 0, "_id": 0 }, function (err, elections) {
        res.json(elections);
    })
});
router.get('/api/elections/ge_womens', function (req, res) {
    ge_womens.find({}, { "_id": 0 }, function (err, elections) {
        res.json(elections);
    })
});
router.get('/api/elections/ge_voter_turnouts', function (req, res) {
    ge_voter_turnouts.find({}, { "State": 0, "_id": 0 }, function (err, elections) {
        res.json(elections);
    })
});

router.get('/api/party/colors', function (req, res) {
    color_codes.find({}, { "_id": 0 }, function (err, elections) {
        res.json(elections);
    })
});

router.get('/api/ae/parties/:state/:year/:limit', function (req, res) {
	var data = getdata(req, res);
    if (data.state != null) {
		ae_maps.aggregate( [
			{ $match: { "State": data.state, "Year":Number(data.year) } },
			{
			 $group: {
				party: "$Party1",
				count: { $sum: 1 }
			 }
		   },
		   { $sort: { count: -1 } },
		   { $limit: Number(data.limit) }  
	   
		] , function (err, elections) {
				res.json(elections);
		});
	}
});


router.get('/api/ge/parties/:year/:limit', function (req, res) {
	var data = getdata(req, res);
    if (data.state != null) {
		ae_maps.aggregate( [
			{ $match: { "State": data.state} },
			{
			 $group: {
				party: "$Party1",
				count: { $sum: 1 }
			 }
		   },
		   { $sort: { count: -1 } },
		   { $limit: Number(data.limit) }  
	   
		] , function (err, elections) {
				res.json(elections);
		});
	}
});


//To get unique states
//-------------------
//api/ae/states  - ae_maps
router.get('/api/ae/states', function (req, res) {
        ae_maps.find({}).distinct("State", function (err, elections) {
           if (err) { res.send(err) };
           res.json(elections);
        })
});


//To get unique years based on a specific state
//-------------------
//api/ae/year/:state
router.get('/api/ae/year/:state', function (req, res) {
	var data = getdata(req, res);
    if (data.state != null) {
        ae_maps.find(
            {
                "State": data.state
            }
        ).distinct("Year", function (err, elections) {
           if (err) { res.send(err) };
           res.json(elections);
        })
    }
});


//To get unique years
//-------------------
//api/ge/year  - ge_maps
router.get('/api/ge/year', function (req, res) {
        ge_maps.find({}).distinct("Year", function (err, elections) {
           if (err) { res.send(err) };
           res.json(elections);
        })
});








router.get('/api/ae/elections/:state/:year/gender/:searchvalue', function (req, res) {
	var data = getdata(req, res);
	var arsearch = data.searchvalue.split(',');

    if (data.state != null && data.year != null) {
        ae_maps.find(
            {
                "State": data.state,
                "Year": Number(data.year),
				"Sex1": { $in : arsearch }
            }
        , function (err, elections) {
            if (err) { res.send(err) };
            //send list of election data
            res.json(elections);
        })
    }
});


router.get('/api/ae/elections/:state/:year/religion/:searchvalue', function (req, res) {
	var data = getdata(req, res);
	var arsearch = data.searchvalue.split(',');
    if (data.state != null && data.year != null) {
        ae_maps.find(
            {
                "State": data.state,
                "Year": Number(data.year),
				"RELIGION": { $in : arsearch }
            }
        , function (err, elections) {
            if (err) { res.send(err) };
            //send list of election data
            res.json(elections);
        })
    }
});


//api to retreive data for elections based on state and year passed
router.get('/api/ae/elections/:state/:year/community/:searchvalue', function (req, res) {
	var data = getdata(req, res);
	var arsearch = data.searchvalue.split(',');
	if (data.state != null && data.year != null) {
        ae_maps.find(
            {
                "State": data.state,
                "Year": Number(data.year),
				"AC_type": { $in : arsearch }
            }
        , function (err, elections) {
            if (err) { res.send(err) };
            //send list of election data
            res.json(elections);
        })
    }
});


//api to retreive data for elections based on state and year passed
router.get('/api/ae/elections/:state/:year/winners/:searchvalue', function (req, res) {
	var data = getdata(req, res);
	var arsearch = data.searchvalue.split(',');
	if (data.state != null && data.year != null) {
        ae_maps.find(
            {
                "State": data.state,
                "Year": Number(data.year),
				"Party1": { $in : arsearch }
            }
        , function (err, elections) {
            if (err) { res.send(err) };
            //send list of election data
            res.json(elections);
        })
    }
});

//api to retreive data for elections based on state and year passed
router.get('/api/ae/elections/:state/:year', function (req, res) {
	var data = getdata(req, res);
    if (data.state != null && data.year != null) {
		ae_maps.find(
            {
                "State": data.state,
                "Year": Number(data.year)

            }, {"_id":0}
        , function (err, elections) {
            if (err) { res.send(err) };

            //send list of election data
            res.json(elections);
        })
    }
});



router.get('/api/elections/ae/filter/:state/:year/:filtervalue', function (req, res) {
	var data = getdata(req, res);
    if (data.state != null && data.year != null) {
        ae_maps.find(
            {
                "State": data.state,
                "Year": Number(data.year)
            }
        ).distinct(data.filtervalue, function (err, elections) {
            if (err) { res.send(err) };

            //send list of election data
            res.json(elections);
        })
    }
});


//winners_map
//------------
//api/ae/elections/:state/:year/position/1   - ae_maps
//runners_map
//----------
//api/ae/elections/:state/:year/position/2   - ae_maps

router.get('/api/ae/elections/:state/:year/position/:position', function (req, res) {
	var data = getdata(req, res);
    if (data.state != null && data.year != null && data.position != null) {
		ae_maps.find(
            {
                "State": data.state,
                "Year": Number(data.year),
				"Position" :  Number(data.position)

            }, {"_id":0}
        , function (err, elections) {
            if (err) { res.send(err) };

            //send list of election data
            res.json(elections);
        })
    }
});







router.get('/api/ge/elections/:year', function (req, res) {
	var data = getdata(req, res);
    if (data.year != null) {
		ge_maps.find(
            {
                "Year": Number(data.year)

            }, {"_id":0}
        , function (err, elections) {
            if (err) { res.send(err) };

            //send list of election data
            res.json(elections);
        })
    }
});

router.get('/api/ge/elections/:year/position/:position', function (req, res) {
	var data = getdata(req, res);
    if (data.year != null && data.position != null) {
		ge_maps.find(
            {
                "Year": Number(data.year),
				"Position" :  Number(data.position)

            }, {"_id":0}
        , function (err, elections) {
            if (err) { res.send(err) };

            //send list of election data
            res.json(elections);
        })
    }
});

//To get all unique parties by State, Year
//-----------------------------------------

//api/ae/partieslist/:state/:year

router.get('/api/ae/partieslist/:state/:year', function (req, res) {
	var data = getdata(req, res);
    if (data.state != null && data.year != null) {
        ae_partys.find(
			{
                "State": data.state,
                "Year": Number(data.year)
            }
        ).distinct("Party1", function (err, elections) {
            if (err) { res.send(err) };

            //send list of election data
            res.json(elections);
        })
    }
});

router.get('/api/ge/partieslist/:year', function (req, res) {
	var data = getdata(req, res);
    if (data.year != null) {
        ge_maps.find(
			{
                "Year": Number(data.year)
            }
        ).distinct("Party1", function (err, elections) {
            if (err) { res.send(err) };

            //send list of election data
            res.json(elections);
        })
    }
});


//voteshare & turnout
//---------------------
//api/ae/parties/:state/:year

router.get('/api/ae/elections/:state/:year/:party', function (req, res) {

	var data = getdata(req, res);
    if (data.state != null && data.year != null) {
		ae_partys.find(
            {
                "State": data.state,
                "Year": Number(data.year),
				"Party1": data.party

            }, {"_id":0}
        , function (err, elections) {
            if (err) { res.send(err) };

            //send list of election data
            res.json(elections);
        })
    }
});



router.get('/api/ge/elections/:year/:party', function (req, res) {
	var data = getdata(req, res);
    if (data.year != null) {
		ge_maps.find(
            {
                "Year": Number(data.year),
				"Party1": data.party

            }, {"_id":0}
        , function (err, elections) {
            if (err) { res.send(err) };

            //send list of election data
            res.json(elections);
        })
    }
});

module.exports = router;