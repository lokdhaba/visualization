"use strict";

//common variables
var margin = {top: 45, right: 65, bottom: 40, left: 55};

var projection = d3.geo.mercator().scale(1);
var path = d3.geo.path().projection(projection);
var brand = 'Source: Adapted from ECI Data <br/>Trivedi Center for Political Data, Ashoka University';
var root_path = 'assets/elections/';
		
var party_colors, party_colors_ar = [];
var color_codes = d3.map();
$.getJSON("api/party/colors", function(json){
   // party_colors = JSON.parse(json);

	json.forEach(function(d) { 
		//party_colors_ar[d.party] = d.color;
		color_codes.set(d.party, d.color); 
	});
	
//console.log(party_colors_ar);
});


function doesFileExist(urlToFile) {
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', urlToFile, false);
    xhr.send();

    if (xhr.status == "404") {
        return false;
    } else {
        return true;
    }
}

function getRandomColors(count) {
	var usercolors = [],colorcode;
	for(var i=0;i<=30;i++) {
		colorcode = ((1<<24)*Math.random()|0).toString(16);
		if(colorcode.length<6) {
			colorcode = '0'+colorcode;
		}

		usercolors.push("#"+colorcode);
	}
	return usercolors;
	
}

function prepare_headings(gSeqNo,mheading,sheading) {

   var divid = 'graph_area'+gSeqNo; 
   $('#mainGraphDiv').append('<div style="text-align:center" id="'+divid+'"><h4><b>'+mheading+'</b></h4><h4>'+sheading+'</h4><p class="brand">'+brand+'</p> </div>'); 
   return divid;
}
 
function create_svg(divid, width, height) { 

	var svg = d3.select("#"+divid).append("div").append("svg")
				.attr("width",  width  + margin.left + margin.right)
				.attr("height", height + margin.top  + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	return svg;
}

function getMapCenterScale(boundry_points,width, height) {

	var b = boundry_points;
	var center = [(b[0] + b[2]) / 2, (b[1] + b[3]) / 2]
	var wScale = width  / (Math.abs(b[0] - b[2]) / 360) / 2 / Math.PI
	var hScale = height / (Math.abs(b[1] - b[3]) / 360) / 2 / Math.PI
	var scale = Math.min(wScale, hScale)
	return [center, scale];
}

function showAeChartsVizualisation(elect_type, state, year, viz_option, party ) {
	var usercolors = getRandomColors(10);
	var filepath ='';
	var data_column = viz_option.split('#');
	
	filepath = 'api/elections/'
	
		/*if(party !== ' ') {
		filepath = filepath+data_column+'_'+elect_type+'_'+state+'_'+year+'_'+party+'.csv';
	} else {
		filepath = filepath+data_column+'_'+elect_type+'_'+state+'_'+year+'.csv';
	}

	if(!doesFileExist(filepath)) {
		noDataAvailable();
		return false;
	}
	*/
	switch(data_column[0]) {
		
		case 'voter_turnout':
			filepath = filepath+'ae_voter_turnouts';
			createGridLineGraph(600, 300,filepath,0, 'Voter turnout', state+' '+year,'Year','Year','Turnout',usercolors,20,0);	
			break;
			
		case 'parties_contesting':
			filepath = filepath+'ae_parties_contests';
			createGroupedBarGraph(600, 300,filepath,0, 'Number of parties contesting and represented', state+' '+year,'Year', 'Year', 'No of Parties', usercolors,0);	
			break;
			
		case 'seatshare':
			filepath = filepath+'ae_seatshares';
			createGridLineGraph(600, 300,filepath,0, 'Seat Share of parties', state+' '+year,'Year', 'Year', 'No of Seats', usercolors,0,0);
			break;
			
		case 'voteshare':
			filepath = filepath+'ae_voteshares';
			createGridLineGraph(600, 300,filepath,0, 'Party wise voteshare', state+' '+year,'Year', 'Year', 'Percentages',usercolors,0,0);	
			break;
		
		case 'contested_deposit_lost':
			filepath = filepath+'ae_contested_deposit_losts';
			createGroupedBarGraph(600, 300,filepath,0, 'Contested and Deposit Saved', state+' '+year, 'Year', 'Year', 'Total Candidates',usercolors,0);	
			break;
		
		case 'women':
			filepath = filepath+'ae_womens';
			createGridLineGraph(600, 300,filepath,0, 'Women candidates and winners', state+' '+year,'Year', 'Year', 'Percentages',usercolors,0,0);
			break;
	}
	
	
}

function showAeMapVizualisation(elect_type, state, year, viz_option, party, filtername, filtervalue ) {
	var usercolors = getRandomColors(30);
	var data_column = viz_option.split('#');
	
	var root_path = 'assets/elections/'+elect_type+'/'+state+'/';
	/*var filepath ='';
	
	if(data_column[1] == 'main') {
		filepath = root_path+'All'+'/'
	} else if(data_column[1] == 'individual') {
		filepath = root_path+'parties/'
	}

	if(party !== ' ') {
		filepath = filepath+elect_type+'_'+state+'_'+year+'_'+party+'.csv';
	} else {
		filepath = filepath+elect_type+'_'+state+'_'+year+'_main.csv';
	}
	
	/*if(!doesFileExist(filepath)) {
		noDataAvailable();
		return false;
	}
	*/
	
	var api_path = 'api/ae/elections/'+state+'/'+year;
	var api_path2 = api_path+'/'+party;
	var topoJsonpath = root_path+state+'.json';
	var column_name = '', filter_column_name ='', csfiltervalue = '';
	
	if(filtername != '' && filtervalue !='') {
		var filterpath = filtername.split('#');
		
		//api/ae/elections/:state/:year/community/:searchvalue
		api_path = api_path+'/'+filterpath[2]+'/'+filtervalue;
		csfiltervalue = filtervalue.join('#');
	}

	switch(data_column[0]) {
		case 'gender':
			filter_column_name = 'Sex1';
			createMapsCategory(600, 300,topoJsonpath,api_path, 6, 'Constituencies with women winners ',state+' '+year,'AC_No',filter_column_name,usercolors, 'ac');
					break;
					

		case 'vote_share':
			column_name = 'Vote_percent';
			createMapsVoteShare(600, 300,topoJsonpath,api_path2, 6, 'Individual party vote share across constituencies',state+' '+year,'AC_No',column_name,usercolors[0], 'ac');
			break;
			
		case 'seat_share':
			column_name = 'Position';
			createMapsCategory(600, 300,topoJsonpath,api_path2, 6, 'Individual party positions across constituencies ',state+' '+year,'AC_No',column_name,usercolors, 'ac');
			break;
		
		case 'candidates':
			column_name = 'N_cand';
			createMapsCategory(600, 300,topoJsonpath,api_path, 6, 'Number of candidates contesting across constituencies',state+' '+year,'AC_No',column_name,usercolors, 'ac');
					break;
					
		case 'Turnout':
			column_name = 'Turnout';
			createMapsTurnout(600, 300,topoJsonpath,api_path, 6, 'Turnout across constituencies',state+' '+year,'AC_No',column_name,usercolors[0], 'ac');
					break;

		case 'Electors':
			column_name = 'Electors';
			createMapsElectors(600, 300,topoJsonpath,api_path, 6, 'Electors distribution across constituencies',state+' '+year,'AC_No',column_name,usercolors[0], 'ac');
					break;
					
		case 'nota':
			column_name = 'NOTA_percent';
			createMapsTurnout(600, 300,topoJsonpath,api_path, 6, 'NOTA across constituencies',state+' '+year,'AC_No',column_name,usercolors[0], 'ac');
					break;
					
		case 'margin_victory':
			column_name = 'Margin_percent';
			createMapsTurnout(600, 300,topoJsonpath,api_path, 6, 'Margin of victory across constituencies',state+' '+year,'AC_No',column_name,usercolors[0], 'ac');
					break;
					
		case 'community':
			filter_column_name = 'AC_type';
			createMapsCategory(600, 300,topoJsonpath,api_path, 6, 'General, SC and ST seats (only winners)',state+' '+year,'AC_No',filter_column_name,usercolors, 'ac');
					break;
					
		case 'religion':
			filter_column_name = 'RELIGION';
			createMapsCategory(600, 300,topoJsonpath,api_path, 6, 'Muslim candidates across constituencies',state+' '+year,'AC_No',filter_column_name,usercolors, 'ac');
				break;
					
		case 'winners':
			filter_column_name = 'Party1';
			var partiesPath = 'api/ae/parties/'+state+'/'+year+'/15';
			createMapsWinners(600, 300,topoJsonpath,api_path, partiesPath, 6, 'Winners across constituencies',state+' '+year,'AC_No',filter_column_name,usercolors, 'ac');
				break;
	}
	if(filter_column_name != '') {
		createSideFilter('ae', state, year, filter_column_name, data_column[0], filtervalue);
	} else {
		$('#filtervalued').empty();
	}
	
}


function createSideFilter(elect_type, state, year, filter_column_name, filter_heading, filtervalue) {
	var api_path = '/api/elections/ae/filter/'+state+'/'+year+'/'+filter_column_name;

	$("input[name=filter_path]").val(elect_type+'#'+filter_column_name+'#'+filter_heading);
	if(filtervalue == ''){
		$('#filtervalued').empty();
		$('#filtervalued').append('<div id="filterdiv"><h3><b>'+filter_heading.toUpperCase()+'</b></h3>');
		$('#filtervalued').append('</hr>');
		$.getJSON(api_path, function(data) {
			$.each(data, function (i, item) {
				var selected = '';
				console.log(filtervalue);
				//var filt = filtervalue.split(',');
				if($.inArray( item, filtervalue ) > 0) {
					console.log(item+'<>'+ filtervalue);
					//selected = 'checked';
				}
				$('#filtervalued').append('<input type="checkbox" name="filtervalue" value="'+item+'" '+selected+' />'+item+'<br>');
			});
		});
		$('#filtervalued').append("</div>");
	} else {
		$('input[type=checkbox][name=filtervalue]').each(function () {     //                $(this).attr('checked', true);                    
			if($.inArray( $(this).val(), filtervalue ) > 0) {
				$(this).attr('checked', true);
			}
		})
	}
}

function showGeChartsVizualisation(elect_type, state, year, viz_option,party ) {
	var usercolors = getRandomColors(10);
	//var root_path = 'assets/elections/'+elect_type+'/'+year+'/';
	var filepath = '';
	var data_column = viz_option.split('#');
	
	//filepath = root_path+'graphs'+'/';
	/*
	if(party !== ' ') {
		filepath = filepath+data_column+'_'+elect_type+'_'+state+'_'+year+'_'+party+'.csv';
	} else {
		filepath = filepath+data_column+'_'+elect_type+'_'+state+'_'+year+'.csv';
	}
	
	var topoJsonpath = root_path+state+'.json';
	
	if(!doesFileExist(filepath)) {
		noDataAvailable();
		return false;
	}
		*/
		
		
	filepath = 'api/elections/';	
	switch(data_column[0]) {
		
		case 'voter_turnout':
			filepath = filepath+'ge_voter_turnouts';
			createGridLineGraph(600, 300,filepath,0, 'Voter turnout', 'General Election '+year,'Year','Year','Turnout',usercolors,20,0);	
			break;
			
		case 'parties_contesting':
			filepath = filepath+'ge_parties_contests';
			createGroupedBarGraph(600, 300,filepath,0, 'Number of parties contesting and represented', 'General Election '+year,'Year', 'Year', 'No of Parties', usercolors,0);	
			break;
			
		case 'seatshare':
			filepath = filepath+'ge_seatshares';
			createGridLineGraph(600, 300,filepath,0, 'Seat Share of parties', 'General Election '+year,'Year', 'Year', 'No of Seats', usercolors,0,0);
			break;
			
		case 'voteshare':
			filepath = filepath+'ge_voteshares';
			createGridLineGraph(600, 300,filepath,0, 'Party wise voteshare', 'General Election '+year,'Year', 'Year', 'Percentages',usercolors,0,0);	
			break;
		
		case 'contested_deposit_lost':
			filepath = filepath+'ge_contested_deposit_losts';
			createGroupedBarGraph(600, 300,filepath,0, 'Contested and Deposit Saved', 'General Election '+year, 'Year', 'Year', 'Total Candidates',usercolors,0);	
			break;
		
		case 'women':
			filepath = filepath+'ge_women';
			createGridLineGraph(600, 300,filepath,0, 'Women candidates and winners', 'General Election '+year,'Year', 'Year', 'Percentages',usercolors,0,0);
			break;
	}
}

function showGeMapVizualisation(elect_type, state, year, viz_option, party,filtername, filtervalue ) {
	var usercolors = getRandomColors(30);

	var root_path = 'assets/elections/'+elect_type+'/';
	var data_column = viz_option.split('#');
	var topoJsonpath = '',topoMapObj ='';
	/*var filepath ='';
	
	if(data_column[1] == 'main') {
		filepath = root_path+'All'+'/'
	} else if(data_column[1] == 'individual') {
		filepath = root_path+'parties/'
	}
	
	
	if(party !== ' ') {
		filepath = filepath+data_column[0]+'_'+elect_type+'_'+year+'_'+party+'.csv';
	} else {
		filepath = filepath+data_column[0]+'_'+elect_type+'_'+year+'.csv';
	}

	if(!doesFileExist(filepath)) {
		noDataAvailable();
		return false;
	}
	*/
	
	var api_path = 'api/ge/elections/'+year;
	var api_path2 = api_path+'/'+party;
	if(year < 1973) {
		topoJsonpath = root_path+state+'_pre.json';
		topoMapObj = 'LOKSAB14_I';
	} else {
		topoJsonpath = root_path+state+'_post.json';
		topoMapObj = 'LOK15C_ID';
	}
	var column_name = '', filter_column_name ='', csfiltervalue = '';
	
	if(filtername != '' && filtervalue !='') {
		var filterpath = filtername.split('#');
		
		//api/ae/elections/:state/:year/community/:searchvalue
		api_path = api_path+'/'+filterpath[2]+'/'+filtervalue;
		csfiltervalue = filtervalue.join('#');
	}
	
	console.log(api_path);

	switch(data_column[0]) {
		
		case 'winners':
			var partiesPath = 'api/ge/parties/'+year+'/15';
			createMapsWinners(600, 400,topoJsonpath,api_path+'/position/1',partiesPath, 6,  'Regional Distribution of Winners ','General Election '+year,'PC_No','Party1',usercolors, topoMapObj);
			break;
		
		case 'voteshare':
			createMapsVoteShare(600, 400,topoJsonpath,api_path2, 6, 'Regional Distribution of Vote Share '+party,'General Election '+year,'PC_No','Percent1','#08306B',topoMapObj);
			break;

		case 'turnout':
			createMapsTurnout(600, 400,topoJsonpath,api_path, 6, 'Regional Distribution of Turnout','General Election '+year,'PC_No','Turnout', '#336600', topoMapObj);
			break;				
	}
}

function noDataAvailable() {
	$('#mainGraphDiv').append('<div id="1"><h4><b>No Data Available for the selected year</b></h4><h4>Please check the filter options</h4></div>');
}

function createLineGraph(width, height,path, gSeqNo, mheading, sheading, xAxisHead, col1Head, col2Head, usercolor) {
	
	var margin = {top: 45, right: 65, bottom: 40, left: 55},
	width  = 800 - margin.left - margin.right,
	height = 380  - margin.top  - margin.bottom;
	
	var divid = prepare_headings(gSeqNo,mheading,sheading);
	var x = d3.scale.ordinal()                    
			.rangeRoundBands([0, width], .1);

	var y = d3.scale.linear()
			.rangeRound([height, 0]);

	var xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom");

	var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left");

	var line = d3.svg.line()
				.interpolate("linear")
				.x(function (d) { return x(d.label) + x.rangeBand() / 2; })
				.y(function (d) { return y(d.value); });

	// static color for legends
	var color = d3.scale.ordinal()
				.range(usercolor);

	
	var svg = create_svg(divid, width, height);
 
	d3.json(path, function (error, data) {

		var labelVar = xAxisHead;
		var varNames = d3.keys(data[0]).filter(function (key) { return key !== labelVar;});
		color.domain(varNames);

		var seriesData = varNames.map(function (name) {
		  return {
			name: name,
			values: data.map(function (d) {
			  return {name: name, label: d[labelVar], value: +d[name]};
			})
		  };
		});

		x.domain(data.map(function (d) { return d[labelVar]; }));
		y.domain([0,
		  
		  (d3.max(seriesData, function (c) { 
			return d3.max(c.values, function (d) { return d.value; });
		  }))+10
		]);

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
			.append("text")
			.attr("y", 30)
			.attr("x", (width/2)-50)
			.attr("dy", ".71em")
			.style("text-anchor", "start")
			.text(col1Head);

		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("x", -((height/2)-50))
			.attr("y", -50)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text(col2Head);
				
		var series = svg.selectAll(".series")
						.data(seriesData)
						.enter().append("g")
						.attr("class", "series");
	
		series.append("path")
			.attr("class", "line")
			.attr("d", function (d) { return line(d.values); })
			.style("stroke", function (d) { return color(d.name); })
			.style("stroke-width", "2px")
			.style("stroke-dasharray", "5,5")
			.style("fill", "none")

		series.selectAll(".point")
			.data(function (d) { return d.values; })
			.enter().append("circle")
			.attr("class", "point")
			.attr("cx", function (d) { return x(d.label) + x.rangeBand()/2; })
			.attr("cy", function (d) { return y(d.value); })
			.attr("r", "5px")
			.style("fill", function (d) { return color(d.name); })
			.style("stroke", "grey")
			.style("stroke-width", "1px")
			.on("mouseover", function (d) { showPopover.call(this, d); })
			.on("click", function (d) { showPopover.call(this, d); })
			.on("mouseout",  function (d) { removePopovers(); })
			
		// to display the legends on the side
		var legend = svg.selectAll(".legend")
			.data(varNames.slice().reverse())
			.enter().append("g")
			.attr("class", "legend")
			.attr("transform", function(d, i) {return "translate(" + i * 100 + ",-25)"; });
			
		legend.append("rect")
			.attr("x", 0)
			.attr("width", 50)
			.attr("height", 10)
			.style("fill", color)
			.style("stroke", "grey");

		legend.append("text")
			.attr("x", -10)
			.attr("y", -5)
			.attr("dx", ".9em")
			.style("text-anchor", "start")
			.style("text-wrap", "normal")
			.text(function (d) { return d; });
		  
		function removePopovers () {
		  $('.popover').each(function() {
			$(this).remove();
		  }); 
		}

		function showPopover (d) {
		  $(this).popover({
			title: d.name,
			placement: 'auto top',
			container: 'body',
			trigger: 'manual',
			html : true,
			content: function() { 
			  return col1Head+": " + d.label + 
					 "<br/>"+col2Head+": " + d3.format(",")(d.value ? d.value: d.y1 - d.y0); }
		  });
		  $(this).popover('show')
		}
	});
}


function createGridLineGraph(width, height,path,gSeqNo, mheading, sheading, xAxisHead, col1Head, col2Head, usercolor,yscale) {
	
	var margin = {top: 45, right: 65, bottom: 40, left: 55},
	width  = 800 - margin.left - margin.right,
	height = 380  - margin.top  - margin.bottom;
	
	var divid = prepare_headings(gSeqNo,mheading,sheading);

	var x = d3.scale.ordinal()                    
			.rangeRoundBands([0, width], 1);

	var y = d3.scale.linear()
			.rangeRound([height, 0]);

	var xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom")
				.ticks(5);

	var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left")
				.ticks(5);

	var line = d3.svg.line()
				.interpolate("linear")
				.x(function (d) { return x(d.label) + x.rangeBand() / 2; })
				.y(function (d) { return y(d.value); });

	  // static color for legends DE6035
	var color = d3.scale.ordinal()
				.range(usercolor);


	var svg = create_svg(divid, width, height);

	// function for the x grid lines
	function make_x_axis() {
		return d3.svg.axis()
			.scale(x)
			.orient("bottom")
			.ticks(5)
	}

	// function for the y grid lines
	function make_y_axis() {
	  return d3.svg.axis()
			.scale(y)
			.orient("left")
			.ticks(5)
	}
			
	d3.json(path, function (error, data) {

		var labelVar = xAxisHead;
		var varNames = d3.keys(data[0]).filter(function (key) { return key !== labelVar;});
		color.domain(varNames);

		var seriesData = varNames.map(function (name) {
		  return {
			name: name,
			values: data.map(function (d) {
			  return {name: name, label: d[labelVar], value: +d[name]};
			})
		  };
		});

		x.domain(data.map(function (d) { return d[labelVar]; }));
		y.domain([yscale,
		  
		  (d3.max(seriesData, function (c) { 
			return d3.max(c.values, function (d) { return d.value; });
		  }))+10
		]);

		// Draw the x Grid lines
		svg.append("g")
			.attr("class", "grid")
			.attr("transform", "translate(0," + height + ")")
			.call(make_x_axis()
				.tickSize(-height, 0, 0)
				.tickFormat("")
			)

		// Draw the y Grid lines
		svg.append("g")            
			.attr("class", "grid")
			.call(make_y_axis()
				.tickSize(-width, 0, 0)
				.tickFormat("")
			)
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
			.append("text")
			.attr("y", 30)
			.attr("x", (width/2)-50)
			.attr("dy", ".71em")
			.style("text-anchor", "start")
			.text(col1Head);;

		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("x", -((height/2)-50))
			.attr("y", -50)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text(col2Head);
			
		var series = svg.selectAll(".series")
						.data(seriesData)
						.enter().append("g")
						.attr("class", "series");
		
		series.append("path")
			.attr("class", "line")
			.attr("d", function (d) { return line(d.values); })
			.style("stroke", function (d) { return color(d.name); })
			.style("stroke-width", "2px")
			.style("stroke-dasharray", "5,5")
			.style("fill", "none")

		series.selectAll(".point")
			.data(function (d) { return d.values; })
			.enter().append("circle")
			.attr("class", "point")
			.attr("cx", function (d) { return x(d.label) + x.rangeBand()/2; })
			.attr("cy", function (d) { return y(d.value); })
			.attr("r", "5px")
			.style("fill", function (d) { return color(d.name); })
			.style("stroke", "grey")
			.style("stroke-width", "1px")
			.on("mouseover", function (d) { showPopover.call(this, d); })
			.on("click", function (d) { showPopover.call(this, d); })
			.on("mouseout",  function (d) { removePopovers(); })
				
		// to display the legends on the side
		var legend = svg.selectAll(".legend")
						.data(varNames.slice().reverse())
						.enter().append("g")
						.attr("class", "legend")
						.attr("transform", function(d, i) {return "translate(" + i * 110 + ",-25)"; })
						.attr("width",function (d) { return d; });
		  
		legend.append("rect")
			.attr("x", 0)
			.attr("width", 50)
			.attr("height", 10)
			.style("fill", color)
			.style("padding-Bottom", '10px')
			.style("stroke", "grey");

		legend.append("text")
			.attr("x", -10)
			.attr("y", -5)
			.attr("dx", ".9em")
			.style("text-anchor", "start")
			.style("font-size", "14px") 
			.style("font-size", "14px") 
			.style("text-wrap", "normal")
			.text(function (d) { return d; });
			  
		function removePopovers () {
		  $('.popover').each(function() {
			$(this).remove();
		  }); 
		}

		function showPopover (d) {
		  $(this).popover({
			title: d.name,
			placement: 'auto top',
			container: 'body',
			trigger: 'manual',
			html : true,
			content: function() { 
			  return col1Head+": " + d.label + 
					 "<br/>"+col2Head+": " + d3.format(",")(d.value ? d.value: d.y1 - d.y0); }
		  });
		  $(this).popover('show')
		}
	});
}
  

function createGroupedBarGraph(width, height,path,gSeqNo, mheading, sheading, xAxisHead, col1Head, col2Head, usercolor) {
	
	var margin = {top: 45, right: 65, bottom: 40, left: 55},
	width  = 800 - margin.left - margin.right,
	height = 380  - margin.top  - margin.bottom;
	
	var divid = prepare_headings(gSeqNo,mheading,sheading);
	var x0 = d3.scale.ordinal()
			.rangeRoundBands([0, width], .1);

	var x1 = d3.scale.ordinal();

	var y = d3.scale.linear()
			.range([height, 0]);

	var color = d3.scale.ordinal()
				.range(usercolor);

	var xAxis = d3.svg.axis()
				.scale(x0)
				.orient("bottom");

	var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left")
				.tickFormat(d3.format(".2s"));


	var svg = create_svg(divid, width, height);			
			
	d3.json(path, function(error, data) {
		if (error) throw error;
		var labelVar = xAxisHead;
		var ageNames = d3.keys(data[0]).filter(function(key) { return key !== labelVar; });

		data.forEach(function(d) {
			d.ages = ageNames.map(function(name) { return {name: name, value: +d[name]}; });
		});

		x0.domain(data.map(function(d) { return d[labelVar]; }));
		x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
		y.domain([0, (d3.max(data, function(d) { return d3.max(d.ages, function(d) { return d.value; }); }))+10]);

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
			.append("text")
			.attr("y", 30)
			.attr("x", (width/2)-50)
			.attr("dy", ".71em")
			.style("text-anchor", "start")
			.text(col1Head);

		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("x", -((height/2)-50))
			.attr("y", -50)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text(col2Head);

		var state = svg.selectAll(".state")
					.data(data)
					.enter().append("g")
					.attr("class", "state")
					.attr("transform", function(d) { return "translate(" + x0(d[labelVar]) + ",0)"; });

		state.selectAll("rect")
			.data(function(d) { return d.ages; })
			.enter().append("rect")
			.attr("width", x1.rangeBand())
			.attr("x", function(d) { return x1(d.name); })
			.attr("y", function(d) { return y(d.value); })
			.attr("height", function(d) { return height - y(d.value); })
			.style("fill", function(d) { return color(d.name); })
			.on("mouseover", function (d) { showPopover.call(this,d); })
			.on("click", function (d) { showPopover.call(this, d); })
			.on("mouseout",  function (d) { removePopovers(); });

		var legend = svg.selectAll(".legend")
						.data(ageNames.slice().reverse())
						.enter().append("g")
						.attr("class", "legend")
						.attr("transform", function(d, i) {return "translate(" + i * 200 + ",-25)"; })
						.attr("text-align", "middle");
			  
		legend.append("rect")
			.attr("x", 0)
			.attr("width", 50)
			.attr("height", 10)
			.style("fill", color)
			.style("stroke", "grey");

		legend.append("text")
			.attr("x", -10)
			.attr("y", -5)
			.attr("dx", ".9em")
			.style("text-anchor", "start")
			.style("text-wrap", "normal")
			.text(function (d) { return d; });
				
		  
		function removePopovers () {
          $('.popover').each(function() {
            $(this).remove();
          }); 
        }

        function showPopover (d) {
			$(this).popover({
				title: d.name,
				placement: 'auto top',
				container: 'body',
				trigger: 'manual',
				html : true,
				content: function() { 
				  return "" + d3.format(",")(d.value ? d.value: d.y1 - d.y0); }
				});
			$(this).popover('show')
        }
	});
}
	  

function createBarGraph(width, height, path,gSeqNo, mheading, sheading, xAxisHead, col1Head, col2Head, usercolor) {
	     
	var margin = {top: 45, right: 65, bottom: 40, left: 55},
	width  = 800 - margin.left - margin.right,
	height = 380  - margin.top  - margin.bottom;
	
	var divid = prepare_headings(gSeqNo,mheading,sheading);

	var x = d3.scale.ordinal()
			.rangeRoundBands([0, width], .7);

	var y = d3.scale.linear()
			.range([height, 0]);

	var color = d3.scale.ordinal()
				.range(usercolor);

	var xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom");

	var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left")
				.tickFormat(d3.format(".2s"));

	
	var svg = create_svg(divid,width, height);
			
			
	d3.json(path, function(error, data) {
		if (error) throw error;

		var ageNames = d3.keys(data[0]).filter(function(key) { return key !== col1Head; });
		data.forEach(function(d) {
			d.colvalues = ageNames.map(function(name) { return {name: name, value: +d[name]}; });
		});

		x.domain(data.map(function(d) { return d[col1Head]; }));
		y.domain([0, 150]);

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
			.append("text")
			.attr("y", 30)
			.attr("x", (width/2)-50)
			.attr("dy", ".71em")
			.style("text-anchor", "start")
			.text(col1Head);

		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("x", -((height/2)-50))
			.attr("y", -50)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text(col2Head);
          
		var state = svg.selectAll(".state")
					.data(data)
					.enter().append("g")
					.attr("class", "state")
					.attr("transform", function(d) { return "translate(" + x(d[col1Head]) + ",0)"; });

		state.selectAll("rect")
			.data(function(d) { return d.colvalues; })
			.enter().append("rect")
			.attr("width", x.rangeBand())
			.attr("x", function(d) { return x(d.name); })
			.attr("y", function(d) { return y(d.value); })
			.attr("height", function(d) { return height - y(d.value); })
			.style("fill", function(d) { return color(d.name); })
			.on("mouseover", function (d) { showPopover.call(this,d); })
			.on("click", function (d) { showPopover.call(this, d); })
			.on("mouseout",  function (d) { removePopovers(); });

		var legend = svg.selectAll(".legend")
						.data(ageNames.slice().reverse())
						.enter().append("g")
						.attr("class", "legend")
						.attr("transform", function(d, i) {return "translate(55," + i * 20 + ")"; });

		legend.append("rect")
			.attr("x", width - 10)
			.attr("width", -10)
			.attr("height", -5)
			.style("fill", color)
			.style("stroke", "grey");

		legend.append("text")
			.attr("x", width - 12)
			.attr("y", -45)
			.attr("dy", ".35em")
			.style("text-anchor", "end")
			.text(function (d) { return d; });

		function removePopovers () {
          $('.popover').each(function() {
            $(this).remove();
          }); 
        }

		function showPopover (d) {
			$(this).popover({
				title: d.name,
				placement: 'auto top',
				container: 'body',
				trigger: 'manual',
				html : true,
				content: function() { 
				return "" + d3.format(",")(d.value ? d.value: d.y1 - d.y0); }
			});
			$(this).popover('show')
		}
	});
}

function createMapsTurnout(width, height,topoJsonpath, csvPath, gSeqNo, mheading, sheading, col1Head, col2Head, usercolor, mappingColumn) {

	var margin = {top: 15, right: 15, bottom: 15, left: 15},
	width  = width - margin.left - margin.right,
	height = height  - margin.top  - margin.bottom;
	//var ext_color_domain = [];
	var color_domain = [20,30,40,50,60];
	var ext_color_domain = [0,20,30,40,50,60];
	var legend_labels = ["<20%", "20-30%", "30-40%", "40-50%", "50-60%", ">60%"];

	
	var rateById = {};
	var c = d3.rgb(usercolor);
	var minimumColor = c.brighter().toString();

	var color = d3.scale.linear().domain(color_domain).range([minimumColor, usercolor]);

	var topoObject = topoJsonpath.split('\\').pop().split('/').pop().split('.')[0];
	var divid = prepare_headings(gSeqNo,mheading,sheading);
	
	var svg = create_svg(divid,width, height);
		
	/*d3.csv(csvPath, function(data) {
		var range = d3.extent(data, function(d) { return +d[col2Head]; });
		//console.log(range[0]);
		for(var i=0; i<color_domain.length; i++) {
			ext_color_domain[i] = (color_domain[i]*range[1]/100).toFixed(3);
			
		}

		color = d3.scale.linear().domain(ext_color_domain).range([minimumColor, usercolor]);

		ext_color_domain.unshift(0);
		var legend_labels = ["<"+ext_color_domain[1], ext_color_domain[1]+"-"+ext_color_domain[2], ext_color_domain[2]+"-"+ext_color_domain[3], ext_color_domain[3]+"-"+ext_color_domain[4], ">"+ext_color_domain[4]];
		var legend = svg.selectAll(".legend")
					.data(ext_color_domain)
					.enter().append("g")
					.attr("class", "legend");
		 
		var ls_w = 20, ls_h = 20;
			 
		legend.append("rect")
			.attr("x", width-100)
			.attr("y", function(d, i){ return height - (i*ls_h) - 2*ls_h;})
			.attr("width", ls_w)
			.attr("height", ls_h)
			.style("fill", function(d, i) { return color(d); })
			.style("opacity", 0.8);
			 
		legend.append("text")
			.attr("x", width-70)
			.attr("y", function(d, i){ return height - (i*ls_h) - ls_h - 5;})
			.text(function(d, i){ return legend_labels[i]; });
			
	});*/
	
	var div = d3.select("body").append("div")
				.attr("class", "tooltip")
				.style("opacity", 0);
			
	$.getJSON(csvPath, function(data) {
       
		data.forEach(function(d) { rateById[d[col1Head]] = d; 
			if (legend_labels.indexOf(d[col2Head]) == -1) {
				legend_labels.push(d[col2Head]);
			}
			legend_labels = legend_labels.sort().reverse();

		});
		
		d3.json(topoJsonpath, function(error, mdata) {
		//if (error) throw error;

			var center_scale = getMapCenterScale(mdata.objects[topoObject].bbox, width, height);
			
			projection
			.translate([width / 2, height / 2])
			.center(center_scale[0])
			.scale(center_scale[1]);
			
			svg.append("g")
				.attr("class", "counties")
				.selectAll("path")
				.data(topojson.feature(mdata, mdata.objects[topoObject]).features)
				.enter().append("path")
				.style ( "fill" , function (d) {
					if(rateById[d.properties[mappingColumn]] !== undefined) {
						if(rateById[d.properties[mappingColumn]][col2Head] < 1) {
							return color(rateById[d.properties[mappingColumn]][col2Head]*100);
						} else {
							return color(rateById[d.properties[mappingColumn]][col2Head]);
						}
						
					}
				})
				.style("opacity", 0.9)
				.attr("d", path)
				.on("mouseover", function (d) { showPopover.call(this,d); })
				.on("click", function (d) { showPopover.call(this, d); })
				.on("mouseout",  function (d) { removePopovers(); })
		});
	});

	/*queue()
		.defer(d3.json, topoJsonpath)
		.await(ready);
		
		*/

	
	var legend1 = d3.select("#"+divid)
						.append('div')
						.append('ul')
						.attr('class','legend_list')
						.attr('height', height);

		var keys = legend1.selectAll('li.key')
						.data(ext_color_domain)
						.enter().append('li')
						.style('border-left-color', function(d, i) { return color(d); })
						.text(function(d, i){  return legend_labels[i]; });
	
	function removePopovers () {
	  $('.popover').each(function() {
		$(this).remove();
	  }); 
	}

	function showPopover (d) {
	  $(this).popover({
		title: d.name,
		placement: 'auto top',
		container: 'body',
		trigger: 'manual',
		html : true,
		content: function() { 
		var html = '';
				for(var key in rateById[d.properties[mappingColumn]]){
					if(key !== '') 
					{
						var key1 = key.replace('_', ' ')
						html+= key1 +': '+rateById[d.properties[mappingColumn]][key]+'<br>';
					}					
				}
		  return html;
		}
	  });
	  $(this).popover('show')
	}
}
 
 
 
function createMapsElectors(width, height,topoJsonpath, csvPath, gSeqNo, mheading, sheading, col1Head, col2Head, usercolor, mappingColumn) {

	var margin = {top: 15, right: 15, bottom: 15, left: 15},
	width  = width - margin.left - margin.right,
	height = height  - margin.top  - margin.bottom;
	var ext_color_domain = [];
	var color_domain = [40,50,60,70];
	var color = d3.map();
	
	var rateById = {};
	var c = d3.rgb(usercolor);
	var minimumColor = c.brighter().toString();

	//var legend_labels = ["<10%", "10-20%", "20-30%", "30-40%", "40-50%", "50-60%", "60-70%","70-80%","80-90%", ">90%"];
	//var color = d3.scale.linear().domain(color_domain).range([minimumColor, usercolor]);

	var topoObject = topoJsonpath.split('\\').pop().split('/').pop().split('.')[0];
	var divid = prepare_headings(gSeqNo,mheading,sheading);
	
	var svg = create_svg(divid,width, height);
		
	d3.json(csvPath, function(data) {
		var range = d3.extent(data, function(d) { return +d[col2Head]; });
		//console.log(range[0]);
		for(var i=0; i<color_domain.length; i++) {
			ext_color_domain[i] = (color_domain[i]*range[1]/100).toFixed(3);
			
		}

		color = d3.scale.linear().domain(ext_color_domain).range([minimumColor, usercolor]);

		ext_color_domain.unshift(0);
		var legend_labels = ["<"+ext_color_domain[1], ext_color_domain[1]+"-"+ext_color_domain[2], ext_color_domain[2]+"-"+ext_color_domain[3], ext_color_domain[3]+"-"+ext_color_domain[4], ">"+ext_color_domain[4]];
		var legend1 = d3.select("#"+divid)
						.append('div')
						.append('ul')
						.attr('class','legend_list')
						.attr('height', height);

		var keys = legend1.selectAll('li.key')
						.data(ext_color_domain)
						.enter().append('li')
						.style('border-left-color', function(d, i) { return color(d); })
						.text(function(d, i){  return legend_labels[i]; });
			
	});
	
	var div = d3.select("body").append("div")
				.attr("class", "tooltip")
				.style("opacity", 0);
			
	$.getJSON(csvPath, function(data) {
       
		data.forEach(function(d) { rateById[d[col1Head]] = d;
		});
		
		d3.json(topoJsonpath, function(error, mdata) {
			if (error) throw error;

			var center_scale = getMapCenterScale(mdata.objects[topoObject].bbox, width, height);
			
			projection
			.translate([width / 2, height / 2])
			.center(center_scale[0])
			.scale(center_scale[1]);
			
			svg.append("g")
				.attr("class", "counties")
				.selectAll("path")
				.data(topojson.feature(mdata, mdata.objects[topoObject]).features)
				.enter().append("path")
				.style ( "fill" , function (d) {
					if(rateById[d.properties[mappingColumn]] !== undefined) {
						if(rateById[d.properties[mappingColumn]][col2Head] < 1) {
							return color(rateById[d.properties[mappingColumn]][col2Head]*100);
						} else {
							return color(rateById[d.properties[mappingColumn]][col2Head]);
						}
						
					}
				})
				.style("opacity", 0.9)
				.attr("d", path)
				.on("mouseover", function (d) { showPopover.call(this,d); })
				.on("click", function (d) { showPopover.call(this, d); })
				.on("mouseout",  function (d) { removePopovers(); })
		});
	});

	/*queue()
		.defer(d3.json, topoJsonpath)
		.await(ready);
		
	*/
	
		
	function removePopovers () {
	  $('.popover').each(function() {
		$(this).remove();
	  }); 
	}

	function showPopover (d) {
	  $(this).popover({
		title: d.name,
		placement: 'auto top',
		container: 'body',
		trigger: 'manual',
		html : true,
		content: function() { 
		var html = '';
				for(var key in rateById[d.properties[mappingColumn]]){
					if(key !== '') 
					{
						var key1 = key.replace('_', ' ')
						html+= key1 +': '+rateById[d.properties[mappingColumn]][key]+'<br>';
					}					
				}
		  return html;
		}
	  });
	  $(this).popover('show')
	}
}
 
function createMapsVoteShare(width, height,topoJsonpath, csvPath, gSeqNo, mheading, sheading, col1Head, col2Head, usercolor, mappingColumn) {
	var margin = {top: 15, right: 15, bottom: 15, left: 15},
	width  = width - margin.left - margin.right,
	height = height  - margin.top  - margin.bottom;
	
	var color_domain = [20,30,40,50,60];
	var ext_color_domain = [0,20,30,40,50,60];
	var legend_labels = ["<20%", "20-30%", "30-40%", "40-50%", "50-60%", ">60%"];

	
	//d3.csv(csvPath, function(data){
		//var max = d3.max(data, function(d) { return +d.field_goal_attempts;} );
	//}
	//var max = d3.max(data, function(d) { return d.column1; });
	
	var topoObject = topoJsonpath.split('\\').pop().split('/').pop().split('.')[0];
	var divid = prepare_headings(gSeqNo,mheading,sheading);
	
	var svg = create_svg(divid,width, height);

	var rateById = {};
	var c = d3.rgb(usercolor);
	var minimumColor = c.brighter().toString();
	
	var color = d3.scale.linear().domain(color_domain).range([minimumColor, usercolor]);
	var div = d3.select("body").append("div")
				.attr("class", "tooltip")
				.style("opacity", 0);
				
	$.getJSON(csvPath, function(data) {
       
		data.forEach(function(d) { rateById[d[col1Head]] = d; 
			if (legend_labels.indexOf(d[col2Head]) == -1) {
				legend_labels.push(d[col2Head]);
			}
			legend_labels = legend_labels.sort().reverse();
		});
		
		d3.json(topoJsonpath, function(error, mdata) {
	//if (error) throw error;

			var center_scale = getMapCenterScale(mdata.objects[topoObject].bbox,width, height);

			projection
			.translate([width / 2, height / 2])
			.center(center_scale[0])
			.scale(center_scale[1]);
			
			svg.append("g")
				.attr("class", "counties")
				.selectAll("path")
				.data(topojson.feature(mdata, mdata.objects[topoObject]).features)
				.enter().append("path")
				.style ( "fill" , function (d) {
					if(rateById[d.properties[mappingColumn]] !== undefined) {
						if(rateById[d.properties[mappingColumn]][col2Head] < 1) {
							return color(rateById[d.properties[mappingColumn]][col2Head]*100);
						} else {
							return color(rateById[d.properties[mappingColumn]][col2Head]);
						}
						
					}
				})
				.style("opacity", 0.9)
				.attr("d", path)
				.on("mouseover", function (d) { showPopover.call(this, d); })
				.on("click", function (d) { showPopover.call(this, d); })
				.on("mouseout",  function (d) { removePopovers(); })

		});
	});

	/*queue()
		.defer(d3.json, topoJsonpath)
		.await(ready);*/
	
	
		
		
		var legend1 = d3.select("#"+divid)
						.append('div')
						.append('ul')
						.attr('class','legend_list')
						.attr('height', height);

		var keys = legend1.selectAll('li.key')
						.data(ext_color_domain)
						.enter().append('li')
						.style('border-left-color', function(d, i) { return color(d); })
						.text(function(d, i){  return legend_labels[i]; });
						
	function removePopovers () {
	  $('.popover').each(function() {
		$(this).remove();
	  }); 
	}
	function showPopover (d) {
	  $(this).popover({
		title: d.name,
		placement: 'auto top',
		container: 'body',
		trigger: 'manual',
		html : true,
		content: function() { 
		var html = '';
				for(var key in rateById[d.properties[mappingColumn]]){
					if(key !== '') 
					{
						var key1 = key.replace('_', ' ')
						html+= key1 +': '+rateById[d.properties[mappingColumn]][key]+'<br>';
					}					
				}
		  return html;
		}
	  });
	  $(this).popover('show')
	}
}

function createMapsWinners(width, height,topoJsonpath, csvPath, partiesPath, gSeqNo, mheading, sheading, col1Head, col2Head, usercolor, mappingColumn) {
	
	var margin = {top: 15, right: 15, bottom: 15, left: 15},
	width  = width - margin.left - margin.right,
	height = height  - margin.top  - margin.bottom;
	
	var divid = prepare_headings(gSeqNo,mheading,sheading);
	var topoObject = topoJsonpath.split('\\').pop().split('/').pop().split('.')[0];
	
	var svg = create_svg(divid,width, height);
	var rateById = {};
	var color = d3.map();

	var legend_labels=[], other_parties=[];
	var div = d3.select("body").append("div")
				.attr("class", "tooltip")
				.style("opacity", 0);
				
	$.getJSON(partiesPath, function(data) {
       
		data.forEach(function(d) {
				legend_labels.push(d['party']);
		});
	});
			

	$.getJSON(csvPath, function(data) {
       
		data.forEach(function(d) { rateById[d[col1Head]] = d; 
			if (legend_labels.indexOf(d[col2Head]) == -1 && legend_labels.length < 16) {
				if(legend_labels.length == 15) {
					legend_labels.push('Others');
				} else {
					legend_labels.push(d[col2Head]);
				}
				
			} else if(legend_labels.length > 15) {
				other_parties.push(d[col2Head]);
			}
			//legend_labels = legend_labels.sort().reverse();*/
		});
		
		var color = d3.scale.ordinal().domain(legend_labels).range(usercolor);

	//function ready(error, mdata) {
	//	if (error) throw error;
	
		d3.json(topoJsonpath, function(error, mdata) {
			var center_scale = getMapCenterScale(mdata.objects[topoObject].bbox,width, height);

			projection
			.translate([width / 2, height / 2])
			.center(center_scale[0])
			.scale(center_scale[1]);

			svg.append("g")
				.attr("class", "counties")
				.selectAll("path")
				.data(topojson.feature(mdata, mdata.objects[topoObject]).features)
				.enter().append("path")
				.style ( "fill" , function (d) {
					if(rateById[d.properties[mappingColumn]] !== undefined) {
						//return color(rateById[d.properties[mappingColumn]][col2Head]);
						if(color_codes.get(rateById[d.properties[mappingColumn]][col2Head])) {
							return color_codes.get(rateById[d.properties[mappingColumn]][col2Head]);
						} else {
							if(other_parties.indexOf(rateById[d.properties[mappingColumn]][col2Head]) == -1) {
								return color(rateById[d.properties[mappingColumn]][col2Head]);
							} else {
								return color('Others');
							}
							
						}
					}
				})
				.style("opacity", 0.9)
				.attr("d", path)
				.on("mouseover", function (d) { showPopover.call(this, d); })
				.on("click", function (d) { showPopover.call(this, d); })
				.on("mouseout",  function (d) { removePopovers(); })

			var legend1 = d3.select("#"+divid)
							.append('div')
							.append('ul')
							.attr('class','legend_list')
							.attr('height', height);

			var keys = legend1.selectAll('li.key')
							.data(legend_labels)
							.enter().append('li')
							.style('border-left-color', function(d, i) { 
								if(color_codes.get(d)) {
									return color_codes.get(d);
								} else {
									if(other_parties.indexOf(d) == -1) {
										return color(d);
									} else {
										return color('Others');
									}
								}
							})
							.text(function(d, i){  return legend_labels[i]; });
							
			function removePopovers () {
			  $('.popover').each(function() {
				$(this).remove();
			  }); 
			}

			function showPopover (d) {
			  $(this).popover({
				title: d.name,
				placement: 'auto top',
				container: 'body',
				trigger: 'manual',
				html : true,
				content: function() { 
				var html = '';
						for(var key in rateById[d.properties[mappingColumn]]){
							if(key !== '') 
							{
								var key1 = key.replace('_', ' ')
								html+= key1 +': '+rateById[d.properties[mappingColumn]][key]+'<br>';
							}					
						}
				  return html;
				}
			  });
			  $(this).popover('show')
			}
			
			function showPartyColor() {
				
			}
		});
	});

	/*queue()
		.defer(d3.json, topoJsonpath)
		.defer(d3.json, csvPath, function(d) {
       console.log(d);
			rateById[d[col1Head]] = d; 
				if (legend_labels.indexOf(d[col2Head]) == -1) {
					legend_labels.push(d[col2Head]);
				}
				legend_labels = legend_labels.sort().reverse();
			
		})
		.await(ready);*/
    
	
}

function createMapsCategory(width, height,topoJsonpath, csvPath, gSeqNo, mheading, sheading, col1Head, col2Head, usercolor, mappingColumn) {
	
	var margin = {top: 15, right: 15, bottom: 15, left: 15},
	width  = width - margin.left - margin.right,
	height = height  - margin.top  - margin.bottom;
	
	var divid = prepare_headings(gSeqNo,mheading,sheading);
	var topoObject = topoJsonpath.split('\\').pop().split('/').pop().split('.')[0];
	
	var svg = create_svg(divid,width, height);
	var rateById = {};
	var color = d3.map();

	var legend_labels=[];
	var div = d3.select("body").append("div")
				.attr("class", "tooltip")
				.style("opacity", 0);
				
	
			

	$.getJSON(csvPath, function(data) {
       
		data.forEach(function(d) { rateById[d[col1Head]] = d; 
			if (legend_labels.indexOf(d[col2Head]) == -1) {
				legend_labels.push(d[col2Head]);
			}
			legend_labels = legend_labels.sort().reverse();
		});
		
		var color = d3.scale.ordinal().domain(legend_labels).range(usercolor);

	//function ready(error, mdata) {
	//	if (error) throw error;
	
		d3.json(topoJsonpath, function(error, mdata) {
			var center_scale = getMapCenterScale(mdata.objects[topoObject].bbox,width, height);

			projection
			.translate([width / 2, height / 2])
			.center(center_scale[0])
			.scale(center_scale[1]);

			svg.append("g")
				.attr("class", "counties")
				.selectAll("path")
				.data(topojson.feature(mdata, mdata.objects[topoObject]).features)
				.enter().append("path")
				.style ( "fill" , function (d) {
					if(rateById[d.properties[mappingColumn]] !== undefined) {
						return color(rateById[d.properties[mappingColumn]][col2Head]);
					}
				})
				.style("opacity", 0.9)
				.attr("d", path)
				.on("mouseover", function (d) { showPopover.call(this, d); })
				.on("click", function (d) { showPopover.call(this, d); })
				.on("mouseout",  function (d) { removePopovers(); })

			var legend1 = d3.select("#"+divid)
							.append('div')
							.append('ul')
							.attr('class','legend_list')
							.attr('height', height);

			var keys = legend1.selectAll('li.key')
							.data(legend_labels)
							.enter().append('li')
							.style('border-left-color', function(d, i) { return color(d); })
							.text(function(d, i){  return legend_labels[i]; });
							
			function removePopovers () {
			  $('.popover').each(function() {
				$(this).remove();
			  }); 
			}

			function showPopover (d) {
			  $(this).popover({
				title: d.name,
				placement: 'auto top',
				container: 'body',
				trigger: 'manual',
				html : true,
				content: function() { 
				var html = '';
						for(var key in rateById[d.properties[mappingColumn]]){
							if(key !== '') 
							{
								var key1 = key.replace('_', ' ')
								html+= key1 +': '+rateById[d.properties[mappingColumn]][key]+'<br>';
							}					
						}
				  return html;
				}
			  });
			  $(this).popover('show')
			}
		});
	});

	/*queue()
		.defer(d3.json, topoJsonpath)
		.defer(d3.json, csvPath, function(d) {
       console.log(d);
			rateById[d[col1Head]] = d; 
				if (legend_labels.indexOf(d[col2Head]) == -1) {
					legend_labels.push(d[col2Head]);
				}
				legend_labels = legend_labels.sort().reverse();
			
		})
		.await(ready);*/
    
	
}