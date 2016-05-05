"use strict";

//common variables
var margin = {top: 55, right: 30, bottom: 55, left: 0};

var projection = d3.geo.mercator().scale(1);
var path = d3.geo.path().projection(projection);
var brand1 = 'Source: Adapted from ECI Data', brand2 = 'Trivedi Center for Political Data, Ashoka University';
var root_path = 'assets/elections/';
var consDetailsArr = ["AC_Name","AC_Type","Position","Cand1","Sex1","Party1","Votes1","Turnout","Margin_percent","Runner","Runner_party","Runner_sex"];

var color_codes = d3.map();
var empty_area_color = "gray";
var test_arr = [{'Male':'#1f77b4','Female':'#8c564b','General':'#1f77b4','SC':'#ff7f0e','ST':'#2ca02c','Hindu':'#fd8d3c', 'Muslim':'#74c476'}];

$.getJSON("api/party/colors", function(json){

	json.forEach(function(d) { 
		color_codes.set(d.party, d.color); 
	});

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
   //$('#mainGraphDiv').append('<div style="text-align:center" id="'+divid+'"><h4><b>'+mheading+'</b></h4><h4>'+sheading+'</h4><p class="brand">'+brand+'</p> </div>'); 
    $('#mainGraphDiv').append('<div style="text-align:center" id="'+divid+'" class="graph_area"></div>'); 
   return divid;
}
 
function create_svg(divid, width, height) { 

	var svg = d3.select("#"+divid).append("div").append("svg")
				.attr("width",  width  + margin.left + margin.right)
				.attr("height", height + margin.top  + margin.bottom)
				.style("font-family", "'Ruluko', sans-serif")
				//.append("g")
				
				/*.append("text")
				.attr("x", (width / 2))             
				.attr("y", 0 - (margin.top / 2))
				.attr("text-anchor", "middle")  
				.style("font-size", "16px") 
				.style("text-decoration", "underline")  
				.text("Value vs Date Graph")
				.append("g");*/
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



//console.log(getLegendRanges([20,30,40,50,60],'%'));

function getLegendRanges(range_values, unit) {

	range_values.reverse();
	range_values.push(0);
	range_values.reverse();
	//var range_values_zeroed = range_values;
	var range =[];
	for(var i=0;i<range_values.length;i++){
		if(i==0){
			range[i] = '<'+range_values[i+1]+unit;
		} else if(i == range_values.length-1){
			range[i] = '>'+range_values[i]+unit;
		} else {
			range[i] = range_values[i]+unit+'-'+range_values[i+1]+unit;
		}
		
		
	}
	return [range_values,range];
}


function createlegendBorder(svg) {
	var legendPadding= 5;
	var legend_box = svg.selectAll(".legend-box").data([true]);

	legend_box.enter().append("rect")
	.style("fill","none")
	.style("stroke","black")
    .style("stroke-width","1px")
    .style("opacity","1")
	.classed("legend-box",true)
	var	legend_grp = svg.selectAll(".legend_grp").data([true]) ;
	
	var legend_grp_size = legend_grp[0][0].getBBox();
	if(legend_grp_size.height > 0) {
		legend_box.attr("x",(legend_grp_size.x-legendPadding))
			.attr("y",(legend_grp_size.y-legendPadding+71))
			.attr("height",(legend_grp_size.height+2*legendPadding))
			.attr("width",(legend_grp_size.width+2*legendPadding))
	}
	
}

function resizeSvg(svg, drawAreaClass) {
	var	title_dim = svg.selectAll(".title_grp").data([true]) ;
	var title_area = title_dim[0][0].getBoundingClientRect();
	
	var	ldgrp_dim = svg.selectAll(".legend-box").data([true]) ;
	var ldgrp_area = ldgrp_dim[0][0].getBoundingClientRect();

		
	var map_dim = svg.selectAll(drawAreaClass).data([true]) ;
	var map_area = map_dim[0][0].getBoundingClientRect();

	var right_padding = 15;
	if(drawAreaClass == '.counties') {
		right_padding = 50;
	}	
		
	var	svg_dim =d3.select("svg").data([true]) ;
	var svg_area = svg_dim[0][0].getBoundingClientRect();
		
	var diff_width = (map_area.width + ldgrp_area.width) - svg_area.width
	var diff_height = (map_area.height + title_area.height) - svg_area.height
	//var diff_height = (map_area.y + map_area.height) - (Math.abs(svg_area.y) + svg_area.height)
				//console.log(diff_width +','+diff_height);
	if(diff_width > 0) {
		svg.attr('width',svg_area.width+ Math.abs(diff_width)+right_padding)
	}
	if(diff_height > 0) {
		svg.attr('height',svg_area.height+ Math.abs(diff_height)+5)
	}
	
}

function writeDownloadLink(){
	var html = d3.select("svg")
		.attr("title", "svg_title")
		.attr("version", 1.1)
		.attr("xmlns", "http://www.w3.org/2000/svg")
		.node().parentNode.innerHTML;
	
	d3.select(this)
		.attr("href-lang", "image/svg+xml")
		.attr("href", "data:image/svg+xml;base64,\n" + btoa(html))
		.on("mousedown", function(){
			d3.select(this)
					.html("Download As SVG");
			})
		.on("mouseout", function(){
			d3.select(this)
				.html("Download As SVG");
		});
};


function showAeChartsVizualisation(elect_type, state, year, viz_option, party ) {
	var usercolors = getRandomColors(10);
	var filepath ='';
	var data_column = viz_option.split('#');
	
	filepath = 'api/elections/'
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
	$('#filtervalued').empty();
	
	
}

function showAeMapVizualisation(elect_type, state, year, viz_option, party, filtername, filtervalue ) {
	var usercolors = getRandomColors(30);
	var data_column = viz_option.split('#');
	
	var root_path = 'assets/elections/'+elect_type+'/'+state+'/';

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
			createMapsVoteShare(600, 300,topoJsonpath,api_path2, 6, 'Individual party vote share across constituencies',state+' '+year,'AC_No',column_name,'#d62728', 'ac');
			break;
			
		case 'position':
			column_name = 'Position';
			createMapsPositions(600, 300,topoJsonpath,api_path2, 6, 'Individual party positions across constituencies ',state+' '+year,'AC_No',column_name,'#393b79', 'ac');
			break;
		
		case 'candidates':
			column_name = 'N_cand';
			createMapsTurnout(600, 300,topoJsonpath,api_path, 6, 'Number of candidates contesting across constituencies',state+' '+year,'AC_No',column_name,'#843c39', 'ac',[5,15],'');
					break;
					
		case 'Turnout':
			column_name = 'Turnout';
			createMapsTurnout(600, 300,topoJsonpath,api_path, 6, 'Turnout across constituencies',state+' '+year,'AC_No',column_name,'#393b79', 'ac',[40,50,60,70],'%');
					break;

		case 'Electors':
			column_name = 'Electors';
			createMapsTurnout(600, 300,topoJsonpath,api_path, 6, 'Electors distribution across constituencies',state+' '+year,'AC_No',column_name,'#31a354', 'ac',[100000,150000,200000], '');
					break;
					
		case 'nota':
			column_name = 'NOTA_percent';
			createMapsTurnout(600, 300,topoJsonpath,api_path, 6, 'NOTA across constituencies',state+' '+year,'AC_No',column_name,'#756bb1', 'ac',[1,3,5],'%');
					break;
					
		case 'margin_victory':
			column_name = 'Margin_percent';
			createMapsTurnout(600, 300,topoJsonpath,api_path, 6, 'Margin of victory across constituencies',state+' '+year,'AC_No',column_name,'#756bb1', 'ac',[5,10,20],'%');
					break;
					
		case 'community':
			filter_column_name = 'AC_Type';
			createMapsCategory(600, 300,topoJsonpath,api_path, 6, 'General, SC and ST seats (only winners)',state+' '+year,'AC_No',filter_column_name,usercolors, 'ac');
					break;
					
		case 'religion':
			filter_column_name = 'RELIGION';
			createMapsCategory(600, 300,topoJsonpath,api_path, 6, 'Muslim candidates across constituencies',state+' '+year,'AC_No',filter_column_name,usercolors, 'ac');
				break;
					
		case 'winners':
			filter_column_name = 'Party1';
			var partiesPath = 'api/ae/parties/'+state+'/'+year+'/5';
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

				if($.inArray( item, filtervalue ) > 0) {
					console.log(item+'<>'+ filtervalue);
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
	var filepath = '';
	var data_column = viz_option.split('#');
	
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
			filepath = filepath+'ge_womens';
			createGridLineGraph(600, 300,filepath,0, 'Women candidates and winners', 'General Election '+year,'Year', 'Year', 'Percentages',usercolors,0,0);
			break;
	}
}

function showGeMapVizualisation(elect_type, state, year, viz_option, party,filtername, filtervalue ) {
	var usercolors = getRandomColors(30);

	var root_path = 'assets/elections/'+elect_type+'/';
	var data_column = viz_option.split('#');
	var topoJsonpath = '',topoMapObj ='';
	
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
		api_path = api_path+'/'+filterpath[2]+'/'+filtervalue;
		csfiltervalue = filtervalue.join('#');
	}
	
	switch(data_column[0]) {
		
		case 'winners':
			filter_column_name = 'Party1';
			var partiesPath = 'api/ge/parties/'+year+'/15';
			createMapsWinners(600, 400,topoJsonpath,api_path+'/position/1',partiesPath, 6,  'Regional Distribution of Winners ','General Election '+year,'PC_No',filter_column_name,usercolors, topoMapObj);
			break;
		
		case 'voteshare':
			createMapsVoteShare(600, 400,topoJsonpath,api_path2, 6, 'Regional Distribution of Vote Share '+party,'General Election '+year,'PC_No','Percent1','#08306B',topoMapObj);
			break;

		case 'turnout':
			createMapsTurnout(600, 400,topoJsonpath,api_path, 6, 'Regional Distribution of Turnout','General Election '+year,'PC_No','Turnout', '#336600', topoMapObj,[40,50,60,70],'%');
			//createMapsTurnout(600, 400,topoJsonpath,api_path, 6, 'Turnout across constituencies',state+' '+year,'AC_No',filter_column_name,'#393b79', 'ac',[40,50,60,70],'%');				
			break;				
	}
	if(filter_column_name != '') {
		createSideFilter('ge', state, year, filter_column_name, data_column[0], filtervalue);
	} else {
		$('#filtervalued').empty();
	}
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
		 d3.select("#download")
			.on("mouseover", writeDownloadLink);
	});
}


function createGridLineGraph(width, height,path,gSeqNo, mheading, sheading, xAxisHead, col1Head, col2Head, usercolor,yscale) {
	
	var margin = {top: 15, right: 15, bottom: 35, left:55};
	var divid = prepare_headings(gSeqNo,mheading,sheading);
	var svg = create_svg(divid, width, height);
	createMapTitle(svg, width, height, margin, mheading, sheading);
	
	
	width  = width - margin.left - margin.right,
	height = height  - margin.top  - margin.bottom;
	
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

	
	var	title_dim = svg.selectAll(".title_grp").data([true]) ;
	var title_area = title_dim[0][0].getBBox();

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


		var chart_element = svg.append("g")
							.attr("class","chart_area")
							.attr("transform", "translate(" + margin.left + "," +(title_area.height ) + ")")
		// Draw the x Grid lines
		chart_element.append("g")
			.attr("class", "grid")
			.attr("transform", "translate(0," + height + ")")
			.style("stroke","lightgrey")
			.style("stroke-opacity","0.7")
			.style("shape-rendering","crispEdges")
			.call(make_x_axis()
				.tickSize(-height, 0, 0)
				.tickFormat("")
			)

		// Draw the y Grid lines
		chart_element.append("g")            
			.attr("class", "grid")
			.style("stroke","lightgrey")
			.style("stroke-opacity","0.7")
			.style("shape-rendering","crispEdges")
			.call(make_y_axis()
				.tickSize(-width, 0, 0)
				.tickFormat("")
			)
		chart_element.append("g")
			.attr("class", "x axis")
			.style("font-size", "12px")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
			.append("text")
			.attr("y", 30)
			.attr("x", (width/2)-50)
			.attr("dy", ".71em")
			.style("text-anchor", "start")
			.text(col1Head);;

		chart_element.append("g")
			.attr("class", "y axis")
			.style("font-size", "12px")
			.call(yAxis)
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("x", -((height/2)-50))
			.attr("y", -50)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.style("font-size", "12px")
			.text(col2Head);
			
		var series = chart_element.selectAll(".series")
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
				
		chart_element.selectAll('.axis path')
					.style({'stroke': "#c0c0c0", 'fill': 'none', 'stroke-width': '2px'});
					
					
		var	chart_dim = svg.selectAll(".chart_area").data([true]) ;
		var chart_area = chart_dim[0][0].getBBox();
	
		// to display the legends on the side
				var ls_w = 20, ls_h = 15;
							
		var legend = svg.append("g")
						.attr("class","legend_grp")
						.attr("transform", "translate(0," +(title_area.height ) + ")")
						
						.selectAll(".legend")
						.data(varNames.slice().reverse())
						.enter().append("g")
						.attr("class", "legend");
						//.attr("transform", function(d, i) {return "translate(" + i * 110 + ",-25)"; })
		  legend.append("rect")
					.attr("x", chart_area.width+10)
					.attr("y", function(d, i){ return (chart_area.y + title_area.y + (i*ls_h) + 2*ls_h) + (2*i);})
					.attr("width", ls_w)
					.attr("height", ls_h)
					.style("fill",color)
					.style("opacity", 0.8);
					 
				legend.append("text")
					.attr("x", chart_area.width+40)
					.attr("y", function(d, i){ return (chart_area.y + (i*ls_h) + 2*ls_h) + (2*i) + ls_h-2;})
					.style("font-size","12px")
					.text(function (d) { return d; });
				createlegendBorder(svg)
				resizeSvg(svg, '.chart_area');
				/*
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
			.text(function (d) { return d; });*/

			  
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
		d3.select("#download")
			.on("mouseover", writeDownloadLink);
	});
}
  

function createGroupedBarGraph(width, height,path,gSeqNo, mheading, sheading, xAxisHead, col1Head, col2Head, usercolor) {
	
	var margin = {top: 15, right: 15, bottom: 35, left:55};
	var divid = prepare_headings(gSeqNo,mheading,sheading);
	var svg = create_svg(divid, width, height);
	createMapTitle(svg, width, height, margin, mheading, sheading);
	
	width  = width - margin.left - margin.right,
	height = height  - margin.top  - margin.bottom;
	
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


	var	title_dim = svg.selectAll(".title_grp").data([true]) ;
	var title_area = title_dim[0][0].getBBox();		
			
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

		var chart_element = svg.append("g")
							.attr("class","chart_area")
							.attr("transform", "translate(" + margin.left + "," +(title_area.height ) + ")")
		chart_element.append("g")
			.attr("class", "x axis")
			.style("font-size", "12px")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
			.append("text")
			.attr("y", 30)
			.attr("x", (width/2)-50)
			.attr("dy", ".71em")
			.style("text-anchor", "start")
			.text(col1Head);

		chart_element.append("g")
			.attr("class", "y axis")
			.style("font-size", "12px")
			.call(yAxis)
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("x", -((height/2)-50))
			.attr("y", -50)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text(col2Head);

		chart_element.selectAll('.axis path')
				.style({'stroke': "#c0c0c0", 'fill': 'none', 'stroke-width': '2px'});
		var state = chart_element.selectAll(".state")
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

		var	chart_dim = svg.selectAll(".chart_area").data([true]) ;
		var chart_area = chart_dim[0][0].getBBox();
		var ls_w = 20, ls_h = 15;
		console.log(chart_area);
		var legend = svg.append("g")
						.attr("class","legend_grp")
						.attr("transform", "translate(0," +(title_area.height ) + ")")
						.selectAll(".legend")
						.data(ageNames.slice().reverse())
						.enter().append("g")
						.attr("class", "legend");

		  legend.append("rect")
					.attr("x", chart_area.width+10)
					.attr("y", function(d, i){ return (chart_area.y + title_area.y + (i*ls_h) + 2*ls_h) + (2*i);})
					.attr("width", ls_w)
					.attr("height", ls_h)
					.style("fill",color)
					.style("opacity", 0.8);
					 
				legend.append("text")
					.attr("x", chart_area.width+40)
					.attr("y", function(d, i){ return (chart_area.y + (i*ls_h) + 2*ls_h) + (2*i) + ls_h-2;})
					.style("font-size","12px")
					.text(function (d) { return d; });
				createlegendBorder(svg)
				resizeSvg(svg, '.chart_area');			
						
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
		d3.select("#download")
		.on("mouseover", writeDownloadLink);
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
		d3.select("#download")
			.on("mouseover", writeDownloadLink);
		
		
		
	});
}


function createMapsTurnout(width, height,topoJsonpath, csvPath, gSeqNo, mheading, sheading, col1Head, col2Head, usercolor, mappingColumn, legend_values, legend_unit) {

	var margin = {top: 15, right: 15, bottom: 15, left: 15};
	var divid = prepare_headings(gSeqNo,mheading,sheading);
	var svg = create_svg(divid,width, height);
	createMapTitle(svg, width, height, margin, mheading, sheading);
	
	width  = width - margin.left - margin.right,
	height = height  - margin.top  - margin.bottom;
	
	var color_domain = legend_values;
	var legend_ranges = getLegendRanges(color_domain,legend_unit)
	var ext_color_domain = legend_ranges[0];
	var legend_labels = legend_ranges[1];

	var rateById = {};
	var c = d3.rgb(usercolor);
	var minimumColor = c.brighter().toString();

	var color = d3.scale.linear().domain(color_domain).range([minimumColor, usercolor]);

	var topoObject = topoJsonpath.split('\\').pop().split('/').pop().split('.')[0];
	
	var	title_dim = svg.selectAll(".title_grp").data([true]) ;
	var title_area = title_dim[0][0].getBBox();
			
	$.getJSON(csvPath, function(data) {
       
		data.forEach(function(d) { 
		//console.log(d);
		//if((d[col2Head] > .40) && (d[col2Head] < .50)) {
			rateById[d[col1Head]] = d; 
		//}
		
			/*if (legend_labels.indexOf(d[col2Head]) == -1) {
				legend_labels.push(d[col2Head]);
			}
			legend_labels = legend_labels.sort().reverse();*/

		});
		
		d3.json(topoJsonpath, function(error, mdata) {
		//if (error) throw error;

			var center_scale = getMapCenterScale(mdata.objects[topoObject].bbox, width, height);
			
			var new_height = height- title_area.y;
			projection
			.translate([width / 2, new_height / 2])
			.center(center_scale[0])
			.scale(center_scale[1]);

			svg.append("g")				
				.attr("transform", "translate(" + margin.left + "," +(title_area.height + 10) + ")")
				.attr("class", "counties")
				.selectAll("path")
				.data(topojson.feature(mdata, mdata.objects[topoObject]).features)
				.enter().append("path")
				.style("stroke","#ffffff")
				.style("stroke-width","1px")		
				.style ( "fill" , function (d) {
					if(rateById[d.properties[mappingColumn]] !== undefined) {
						if(rateById[d.properties[mappingColumn]][col2Head] < 1) {
							return color(rateById[d.properties[mappingColumn]][col2Head]*100);
						} else {
							return color(rateById[d.properties[mappingColumn]][col2Head]);
						}
						
					} else {
						return empty_area_color;
					}
				})
				.style("opacity", 0.9)
				.attr("d", path)			
				.on("mouseover", function (d) { showPopover.call(this,d); })
				.on("click", function (d) { showPopover.call(this, d); })
				.on("mouseout",  function (d) { removePopovers(); })
				
				var	graph_dim = svg.selectAll(".counties").data([true]) ;
				var graph_area = graph_dim[0][0].getBBox();
				
				var ls_w = 20, ls_h = 15;
				 
				var legend = svg.append("g")
					.attr("transform", "translate(0," +(title_area.height ) + ")")
					.attr("class","legend_grp")
					.selectAll(".legend")
					.data(ext_color_domain)
					.enter().append("g")
					.attr("class", "legend");

				legend.append("rect")
					.attr("x", graph_area.x + graph_area.width+30)
					.attr("y", function(d, i){ return (graph_area.y + title_area.y + (i*ls_h) + 2*ls_h) + (2*i);})
					.attr("width", ls_w)
					.attr("height", ls_h)
					.style("fill", function(d){ return color(d); })
					.style("opacity", 0.8);
					 
				legend.append("text")
					.attr("x", graph_area.x + graph_area.width + 60)
					.attr("y", function(d, i){ return (graph_area.y + (i*ls_h) + 2*ls_h) + (2*i) + ls_h-2;})
					.style("font-size","12px")
					.text(function(d, i){ return legend_labels[i]; });
				createlegendBorder(svg)
				
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
								if(key !== '' && consDetailsArr.indexOf(key) > -1) 
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
				resizeSvg(svg, '.counties');
				d3.select("#download")
				.on("mouseover", writeDownloadLink);
			
		});
	});
}
 
 
function createMapTitle(svg, width, height, margin, mheading, sheading) {
	
	var title = svg.append("g")
	.attr("class","title_grp");
	
	title.append("text")
	  .attr("class", "title")
	  .attr("x", width/2)
	  .attr("y", 20)
	  .attr("text-anchor", "middle")
	  .style("font-weight","Bold")
	  .style("font-size","18px")
	  .text(mheading);
	  
	 title.append("text")
	  .attr("class", "title")
	  .attr("x", width/2)
	  .attr("y", 40 )
	  .attr("text-anchor", "middle")
	  .style("font-size","18px")
	  .text(sheading);
	  
	  title.append("text")
	  .attr("class", "title")
	  .attr("x", width/2)
	  .attr("y", 60)
	  .attr("text-anchor", "middle")
	  .style("font-size","10px")
	  .text(brand1);
	  
	  title.append("text")
	  .attr("class", "title")
	  .attr("x", width/2)
	  .attr("y", 70)
	  .attr("text-anchor", "middle")
	  .style("font-size","10px")
	  .text(brand2);
	  
	  title.append("text")
	  .attr("class", "title")
	  .attr("x", width/2)
	  .attr("y", 110)
	  .attr("text-anchor", "middle")
	  .style("font-size","10px")
	  .text('    ');

}

function createMapsVoteShare(width, height,topoJsonpath, csvPath, gSeqNo, mheading, sheading, col1Head, col2Head, usercolor, mappingColumn) {
	var margin = {top: 15, right: 15, bottom: 15, left: 15};
	var divid = prepare_headings(gSeqNo,mheading,sheading);
	
	var svg = create_svg(divid,width, height);
	createMapTitle(svg, width, height, margin, mheading, sheading);
	width  = width - margin.left - margin.right,
	height = height  - margin.top  - margin.bottom;
	
	var color_domain = [20,30,40,50,60];
	var ext_color_domain = [0,20,30,40,50,60];
	var legend_labels = ["<20%", "20-30%", "30-40%", "40-50%", "50-60%", ">60%"];

	
	var topoObject = topoJsonpath.split('\\').pop().split('/').pop().split('.')[0];
	
	
	var	title_dim = svg.selectAll(".title_grp").data([true]) ;
	var title_area = title_dim[0][0].getBBox();

	var rateById = {};
	var c = d3.rgb(usercolor);
	var minimumColor = c.brighter().toString();
	
	var color = d3.scale.linear().domain(color_domain).range([minimumColor, usercolor]);
				
	$.getJSON(csvPath, function(data) {
       
		data.forEach(function(d) { rateById[d[col1Head]] = d; 
			/*if (legend_labels.indexOf(d[col2Head]) == -1) {
				legend_labels.push(d[col2Head]);
			}
			legend_labels = legend_labels.sort().reverse();*/
		});
		
		d3.json(topoJsonpath, function(error, mdata) {
	//if (error) throw error;

			var center_scale = getMapCenterScale(mdata.objects[topoObject].bbox,width, height);
			var new_height = height- title_area.y;
			projection
			.translate([width / 2, new_height / 2])
			.center(center_scale[0])
			.scale(center_scale[1]);

			svg.append("g")				
				.attr("transform", "translate(" + margin.left + "," +(title_area.height + 10) + ")")
				.attr("class", "counties")
				.selectAll("path")
				.data(topojson.feature(mdata, mdata.objects[topoObject]).features)
				.enter().append("path")
				.style("stroke","#ffffff")
				.style("stroke-width","1px")
				.style ( "fill" , function (d) {
					if(rateById[d.properties[mappingColumn]] !== undefined) {
						if(rateById[d.properties[mappingColumn]][col2Head] < 1) {
							return color(rateById[d.properties[mappingColumn]][col2Head]*100);
						} else {
							return color(rateById[d.properties[mappingColumn]][col2Head]);
						}
						
					} else {
						return empty_area_color;
					}
				})
				.style("opacity", 0.9)
				.attr("d", path)
				.on("mouseover", function (d) { showPopover.call(this, d); })
				.on("click", function (d) { showPopover.call(this, d); })
				.on("mouseout",  function (d) { removePopovers(); })

				var	graph_dim = svg.selectAll(".counties").data([true]) ;
				var graph_area = graph_dim[0][0].getBBox();
				
				var ls_w = 20, ls_h = 15;
				 
				var legend = svg.append("g")
					.attr("transform", "translate(0," +(title_area.height ) + ")")
					.attr("class","legend_grp")
					.selectAll(".legend")
					.data(ext_color_domain)
					.enter().append("g")
					.attr("class", "legend");

				legend.append("rect")
					.attr("x", graph_area.x + graph_area.width+30)
					.attr("y", function(d, i){ return (graph_area.y + title_area.y + (i*ls_h) + 2*ls_h) + (2*i);})
					.attr("width", ls_w)
					.attr("height", ls_h)
					.style("fill", function(d){ return color(d); })
					.style("opacity", 0.8);
					 
				legend.append("text")
					.attr("x", graph_area.x + graph_area.width + 60)
					.attr("y", function(d, i){ return (graph_area.y + (i*ls_h) + 2*ls_h) + (2*i) + ls_h-2;})
					.style("font-size","12px")
					.text(function(d, i){ return legend_labels[i]; });
				createlegendBorder(svg)
				
				resizeSvg(svg, '.counties');	
				d3.select("#download")
				.on("mouseover", writeDownloadLink);

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
								if(key !== '' && consDetailsArr.indexOf(key) > -1) 
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
		
}

function createMapsWinners(width, height,topoJsonpath, csvPath, partiesPath, gSeqNo, mheading, sheading, col1Head, col2Head, usercolor, mappingColumn) {
	
	var margin = {top: 15, right: 15, bottom: 15, left: 15};
	var divid = prepare_headings(gSeqNo,mheading,sheading);
	var svg = create_svg(divid,width, height);
	createMapTitle(svg, width, height, margin, mheading, sheading);
	
	width  = width - margin.left - margin.right,
	height = height  - margin.top  - margin.bottom;
	
	
	var topoObject = topoJsonpath.split('\\').pop().split('/').pop().split('.')[0];
	
	
	var	title_dim = svg.selectAll(".title_grp").data([true]) ;
	var title_area = title_dim[0][0].getBBox();

	var rateById = {};
	var color = d3.map();

	var legend_labels=[], other_parties=[];
					
	$.getJSON(partiesPath, function(data) {
       
		data.forEach(function(d) {
				legend_labels.push(d['party']);
		});
	});
			

	$.getJSON(csvPath, function(data) {
       
		data.forEach(function(d) { rateById[d[col1Head]] = d; 
			if (legend_labels.indexOf(d[col2Head]) == -1 && legend_labels.length < 6) {
				if(legend_labels.length == 5) {
					legend_labels.push('Others');
				} else {
					legend_labels.push(d[col2Head]);
				}
				
			} else if(other_parties.indexOf(d[col2Head]) == -1 && legend_labels.length > 5) {
				other_parties.push(d[col2Head]);
			}
			//legend_labels = legend_labels.sort().reverse();*/
		});
		
		
		
		var color = d3.scale.category10().domain(legend_labels);

		d3.json(topoJsonpath, function(error, mdata) {
			var center_scale = getMapCenterScale(mdata.objects[topoObject].bbox,width, height);
			var new_height = height- title_area.y;
			projection
			.translate([width / 2, new_height / 2])
			.center(center_scale[0])
			.scale(center_scale[1]);

			svg.append("g")				
				.attr("transform", "translate(" + margin.left + "," +(margin.top + title_area.y + title_area.height + 10) + ")")
				.attr("class", "counties")
				.selectAll("path")
				.data(topojson.feature(mdata, mdata.objects[topoObject]).features)
				.enter().append("path")
				.style("stroke","#ffffff")
				.style("stroke-width","1px")
				.style ( "fill" , function (d) {
					if(rateById[d.properties[mappingColumn]] !== undefined) {
						if(legend_labels.indexOf(rateById[d.properties[mappingColumn]][col2Head]) == -1) {
							return color('Others');
						} else {
							if(color_codes.get(rateById[d.properties[mappingColumn]][col2Head])) {
								return color_codes.get(rateById[d.properties[mappingColumn]][col2Head]);
							} else {
								return color(rateById[d.properties[mappingColumn]][col2Head]);
							}
						}
					} else {
						return empty_area_color;
					}
				})
				.style("opacity", 0.9)
				.attr("d", path)
				.on("mouseover", function (d) { showPopover.call(this, d); })
				.on("click", function (d) { showPopover.call(this, d); })
				.on("mouseout",  function (d) { removePopovers(); })		
			
			var	graph_dim = svg.selectAll(".counties").data([true]) ;
			var graph_area = graph_dim[0][0].getBBox();
			
			var ls_w = 20, ls_h = 15;
			 
			var legend = svg.append("g")
				.attr("transform", "translate(0," +(title_area.height ) + ")")
				.attr("class","legend_grp")
				.selectAll(".legend")
				.data(legend_labels)
				.enter().append("g")
				.attr("class", "legend");

			legend.append("rect")
				.attr("x", graph_area.x + graph_area.width+30)
				.attr("y", function(d, i){ return (title_area.y + title_area.height + (i*ls_h) + 2*ls_h) + (2*i);})
				.attr("width", ls_w)
				.attr("height", ls_h)
				.style("fill", function(d, i) { 
						if(legend_labels.indexOf(d) == -1) {
							return color('Others');
						} else {
							if(color_codes.get(d)) {
								return color_codes.get(d);
							} else {
								return color(d);
							}
						}
				})
				.style("opacity", 0.8);
				 
			legend.append("text")
				.attr("x", graph_area.x + graph_area.width + 60)
				.attr("y", function(d, i){ return (title_area.y + title_area.height + (i*ls_h) + 2*ls_h) + (2*i) + ls_h-2;})
				.style("font-size","12px")
				.text(function(d, i){ return legend_labels[i]; });
			createlegendBorder(svg);
			
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
							if(key !== '' && consDetailsArr.indexOf(key) > -1)
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
			resizeSvg(svg, '.counties');
			d3.select("#download")
			.on("mouseover", writeDownloadLink);
		});
		
	});
	
}

function createMapsCategory(width, height,topoJsonpath, csvPath, gSeqNo, mheading, sheading, col1Head, col2Head, usercolor, mappingColumn) {
	
	var margin = {top: 15, right: 15, bottom: 15, left: 15};
	var divid = prepare_headings(gSeqNo,mheading,sheading);
	var svg = create_svg(divid,width, height);
	createMapTitle(svg, width, height, margin, mheading, sheading);
	
	width  = width - margin.left - margin.right,
	height = height  - margin.top  - margin.bottom;
	
	var topoObject = topoJsonpath.split('\\').pop().split('/').pop().split('.')[0];
	
	
	var	title_dim = svg.selectAll(".title_grp").data([true]) ;
	var title_area = title_dim[0][0].getBBox();
	
	var rateById = {};
	var color = d3.map();

	var legend_labels=[];


	$.getJSON(csvPath, function(data) {
       
		data.forEach(function(d) { rateById[d[col1Head]] = d; 
			if (legend_labels.indexOf(d[col2Head]) == -1) {
				legend_labels.push(d[col2Head]);
			}
			legend_labels = legend_labels.sort().reverse();
		});

		var color = d3.scale.category10().domain(legend_labels);

	//function ready(error, mdata) {
	//	if (error) throw error;
	
		d3.json(topoJsonpath, function(error, mdata) {
			var center_scale = getMapCenterScale(mdata.objects[topoObject].bbox,width, height);

			var new_height = height- title_area.y;
			projection
			.translate([width / 2, new_height / 2])
			.center(center_scale[0])
			.scale(center_scale[1]);

			svg.append("g")				
				.attr("transform", "translate(" + margin.left + "," +(title_area.height + 10) + ")")
				.attr("class", "counties")
				.selectAll("path")
				.data(topojson.feature(mdata, mdata.objects[topoObject]).features)
				.enter().append("path")
				.style("stroke","#ffffff")
				.style("stroke-width","1px")
				.style ( "fill" , function (d) {
					if(rateById[d.properties[mappingColumn]] !== undefined) {
						if(test_arr[0][rateById[d.properties[mappingColumn]][col2Head]]) {
							return test_arr[0][rateById[d.properties[mappingColumn]][col2Head]]
						} else {
							return color(rateById[d.properties[mappingColumn]][col2Head]);
						}
						
					} else {
						return empty_area_color;
					}
				})
				.style("opacity", 0.9)
				.attr("d", path)
				.on("mouseover", function (d) { showPopover.call(this, d); })
				.on("click", function (d) { showPopover.call(this, d); })
				.on("mouseout",  function (d) { removePopovers(); })

				
			var	graph_dim = svg.selectAll(".counties").data([true]) ;
			var graph_area = graph_dim[0][0].getBBox();
			
			var ls_w = 20, ls_h = 15;
			 
			var legend = svg.append("g")
				.attr("transform", "translate(0," +(title_area.height ) + ")")
				.attr("class","legend_grp")
				.selectAll(".legend")
				.data(legend_labels)
				.enter().append("g")
				.attr("class", "legend");

			legend.append("rect")
				.attr("x", graph_area.x + graph_area.width+30)
				.attr("y", function(d, i){ return (graph_area.y + title_area.y + (i*ls_h) + 2*ls_h) + (2*i);})
				.attr("width", ls_w)
				.attr("height", ls_h)
				.style("fill", function(d, i) { 
						if(test_arr[0][d]) {
							return test_arr[0][d];
						} else {
							return color(d);
						}
				})
				.style("opacity", 0.8);
				 
			legend.append("text")
				.attr("x", graph_area.x + graph_area.width + 60)
				.attr("y", function(d, i){ return (graph_area.y + (i*ls_h) + 2*ls_h) + (2*i) + ls_h-2;})
				.style("font-size","12px")
				.text(function(d, i){ return legend_labels[i]; });
			createlegendBorder(svg)
			
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
							if(key !== '' && consDetailsArr.indexOf(key) > -1) 
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
			resizeSvg(svg, '.counties');
			d3.select("#download")
			.on("mouseover", writeDownloadLink);
		});	
	});
}

function createMapsPositions(width, height,topoJsonpath, csvPath, gSeqNo, mheading, sheading, col1Head, col2Head, usercolor, mappingColumn, legend_values) {
	
	var margin = {top: 15, right: 15, bottom: 15, left: 15};
	var divid = prepare_headings(gSeqNo,mheading,sheading);
	var svg = create_svg(divid,width, height);
	createMapTitle(svg, width, height, margin, mheading, sheading);
	
	width  = width - margin.left - margin.right,
	height = height  - margin.top  - margin.bottom;
	var topoObject = topoJsonpath.split('\\').pop().split('/').pop().split('.')[0];
	
	var color_domain = [1,2,3];
	var ext_color_domain = [0,1,2,3];
	var legend_labels = ["1", "2", "3", ">3"];
	
	var	title_dim = svg.selectAll(".title_grp").data([true]) ;
	var title_area = title_dim[0][0].getBBox();

	var rateById = {};
	var color = d3.map();

	$.getJSON(csvPath, function(data) {
       
		data.forEach(function(d) { 
			rateById[d[col1Head]] = d; 
		});
		var c = d3.rgb(usercolor);
		var minimumColor = c.brighter().toString();
		
		var color = d3.scale.linear().domain(legend_labels).range([minimumColor, usercolor]);

		d3.json(topoJsonpath, function(error, mdata) {
			var center_scale = getMapCenterScale(mdata.objects[topoObject].bbox,width, height);
			var new_height = height- title_area.y;
			projection
			.translate([width / 2, new_height / 2])
			.center(center_scale[0])
			.scale(center_scale[1]);

			svg.append("g")				
				.attr("transform", "translate(" + margin.left + "," +(title_area.y + title_area.height + 10) + ")")
				.attr("class", "counties")
				.selectAll("path")
				.data(topojson.feature(mdata, mdata.objects[topoObject]).features)
				.enter().append("path")
				.style("stroke","#ffffff")
				.style("stroke-width","1px")
				.style ( "fill" , function (d) {
					if(rateById[d.properties[mappingColumn]] !== undefined) {	
						return color(rateById[d.properties[mappingColumn]][col2Head]);
					} else {
						return empty_area_color;
					}
				})
				.style("opacity", 0.9)
				.attr("d", path)
				.on("mouseover", function (d) { showPopover.call(this, d); })
				.on("click", function (d) { showPopover.call(this, d); })
				.on("mouseout",  function (d) { removePopovers(); })

			var	graph_dim = svg.selectAll(".counties").data([true]) ;
			var graph_area = graph_dim[0][0].getBBox();
			
			var ls_w = 20, ls_h = 15;
			 
			var legend = svg.append("g")
				.attr("transform", "translate(0," +(title_area.height ) + ")")
				.attr("class","legend_grp")
				.selectAll(".legend")
				.data(legend_labels)
				.enter().append("g")
				.attr("class", "legend");

			legend.append("rect")
				.attr("x", graph_area.x + graph_area.width+30)
				.attr("y", function(d, i){ return (graph_area.y + title_area.y + (i*ls_h) + 2*ls_h) + (2*i);})
				.attr("width", ls_w)
				.attr("height", ls_h)
				.style("fill", function(d, i) { return color(d); })
				.style("opacity", 0.8);
				 
			legend.append("text")
				.attr("x", graph_area.x + graph_area.width + 60)
				.attr("y", function(d, i){ return (graph_area.y + (i*ls_h) + 2*ls_h) + (2*i) + ls_h-2;})
				.style("font-size","12px")
				.text(function(d, i){ return legend_labels[i]; });
			createlegendBorder(svg)
		
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
							if(key !== '' && consDetailsArr.indexOf(key) > -1) 
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
			resizeSvg(svg, '.counties');
			d3.select("#download")
			.on("mouseover", writeDownloadLink);
		});
	});

}