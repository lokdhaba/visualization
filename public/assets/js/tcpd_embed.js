"use strict";

//common variables
var margin = {top: 55, right: 30, bottom: 55, left: 0};

var projection = d3.geo.mercator().scale(1);
var path = d3.geo.path().projection(projection);
var brand1 = 'Source: Adapted from ECI Data', brand2 = 'Trivedi Center for Political Data, Ashoka University';
var root_path = 'assets/elections/';
var consDetailsArr = ["AC_Name","AC_Type","Position","Cand1","Sex1","Party1","Votes1","Turnout","Margin_percent","Runner","Runner_party","Runner_sex"];

var color_codes = d3.map();
var empty_area_color = "#D0D0D0";
var color_code_legends = [{'Male':'#1f77b4','Female':'#8c564b','General':'#1f77b4','SC':'#ff7f0e','ST':'#2ca02c','Hindu':'#fd8d3c', 'Muslim':'#74c476'}];

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
    $('#mainGraphDiv').append('<div style="text-align:center" id="'+divid+'" class="graph_area svg-container"></div>'); 
   return divid;
}
 
function getUrlVars()
{

	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++)
	{
		hash = hashes[i].split('=');
		vars[hash[0]] = hash[1];
	}
	return vars;
}

function create_svg(divid, width, height) { 
	var svg = d3.select("#"+divid).append("div").append("svg")
			.attr("preserveAspectRatio", "xMinYMin meet")
	if(getUrlVars()['type'].indexOf('charts') > -1) {
		svg.attr("viewBox", "0 0 700 400")
	} else {
		svg.attr("viewBox", "0 0 600 400")
	}
   //class to make it responsive
   svg.classed("svg-content-responsive", true);
				
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
	/*var	title_dim = svg.selectAll(".title_grp").data([true]) ;
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
	}*/
	
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



function  checkboxToggle(obj) {
	
	$("input[type=checkbox][name^=class_]").prop("checked", $(obj).prop('checked'));
			//if($(this).prop('checked') != true) {
	$("input[type=checkbox][name^=class_]").each(function(){
		sidefilterGraph(this);
	})
}
function filterGraph(aType, aVisibility) {
	var  newOpacity = '', legendOpacity = '';
	if(aVisibility < 1) {
		newOpacity = 1;
		legendOpacity = 1;
		$("input[name=class_" + aType+"]").prop("checked", true);
		//console.log('1');
	} else {
		newOpacity = 0;
		legendOpacity = 0.2;
		$("input[name=class_" + aType+"]").prop( "checked", false );
		//console.log('0');
	}
	d3.selectAll(".class_" + aType).transition().duration(300).style("opacity", newOpacity);
	d3.selectAll(".classleg_" + aType).transition().duration(300).style("opacity", legendOpacity);
	changeAllChkBox();
}

function sidefilterGraph( obj) {
	if($(obj).prop('checked') == true) {
		d3.selectAll("."+obj.value).transition().duration(300).style("opacity", "1");
		d3.selectAll("."+obj.value.replace('class','classleg')).transition().duration(300).style("opacity", "1");
	} else {
		d3.selectAll("."+obj.value).transition().duration(300).style("opacity", "0");
		d3.selectAll("."+obj.value.replace('class','classleg')).transition().duration(300).style("opacity", "0.2");
	} 
	changeAllChkBox();
}

function changeAllChkBox() {
	var count = 0;
	$("input[type=checkbox][name^=class_]").each(function(){
		if($(this).prop('checked') == false) {
			count++;
		}
	})
	if(count == 0) {
		$("input[type=checkbox][id=All]").prop( "checked", true )
	} else {
		$("input[type=checkbox][id=All]").prop( "checked", false )
	}
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

function showAeChartsVizualisation(elect_type, state, year, viz_option, party ) {
	var usercolors = getRandomColors(10);
	var filepath ='';
	
	
	filepath = 'api/elections/'
	switch(viz_option) {
		
		case 'voter_turnout':
			filepath = filepath+'ae_voter_turnouts';
			createGridLineGraph(600, 300,filepath,0, 'Voter turnout', state+' '+year,'Year','Year of election','Turnout %',usercolors,20,0);	
			break;
			
		case 'parties_contesting':
			filepath = filepath+'ae_parties_contests';
			createGroupedBarGraph(600, 300,filepath,0, 'Name change - Parties represented in vidhan sabha / lok sabha', state+' '+year,'Year', 'Year of election', 'Parties contested', usercolors,0);	
			break;
			
		case 'seatshare':
			filepath = filepath+'ae_seatshares';
			createGridLineGraph(600, 300,filepath,0, 'Seat Share of parties', state+' '+year,'Year', ' Year of election', 'Seat share %', usercolors,0,0);
			break;
			
		case 'voteshare':
			filepath = filepath+'ae_voteshares';
			createGridLineGraph(600, 300,filepath,0, 'Party wise voteshare', state+' '+year,'Year', 'Year of election', 'Vote share %',usercolors,0,0);	
			break;
		
		case 'contested_deposit_lost':
			filepath = filepath+'ae_contested_deposit_losts';
			createGroupedBarGraph(600, 300,filepath,0, 'Contested and Deposit Saved', state+' '+year, 'Year', 'Year of election', 'Total Candidates',usercolors,0);	
			break;
		
		case 'women':
			filepath = filepath+'ae_womens';
			createGridLineGraph(600, 300,filepath,0, 'Women candidates and winners', state+' '+year,'Year', 'Year of election', '% of women winners',usercolors,0,0);
			break;
	}
	

}

function showAeMapVizualisation(elect_type, state, year, viz_option, party) {
	var usercolors = getRandomColors(30);

	var root_path = 'assets/elections/'+elect_type+'/'+state+'/';

	var api_path = 'api/ae/elections/'+state+'/'+year;
	var api_path2 = api_path+'/'+party;
	var topoJsonpath = root_path+state+'.json';
	var filter_column_name ='';
	
	switch(viz_option) {
		case 'gender':
			filter_column_name = 'Sex1';
			createMapsCategory(600, 300,topoJsonpath,api_path, 6, 'Constituencies with women winners ',state+' '+year,'AC_No',filter_column_name,usercolors, 'ac');
			break;
					

		case 'vote_share':
			filter_column_name = 'Vote_percent';
			createMapsVoteShare(600, 300,topoJsonpath,api_path2, 6, 'Individual party vote share across constituencies',state+' '+year,'AC_No',filter_column_name,'#d62728', 'ac');
			break;
			
		case 'position':
			filter_column_name = 'Position';
			createMapsPositions(600, 300,topoJsonpath,api_path2, 6, 'Individual party positions across constituencies ',state+' '+year,'AC_No',filter_column_name,'#393b79', 'ac');
			break;
		
		case 'candidates':
			filter_column_name = 'N_cand';
			createMapsTurnout(600, 300,topoJsonpath,api_path, 6, 'Number of candidates contesting across constituencies',state+' '+year,'AC_No',filter_column_name,'#843c39', 'ac',[5,15],'');
					break;
					
		case 'Turnout':
			filter_column_name = 'Turnout';
			createMapsTurnout(600, 300,topoJsonpath,api_path, 6, 'Turnout across constituencies',state+' '+year,'AC_No',filter_column_name,'#393b79', 'ac',[40,50,60,70],'%');
					break;

		case 'Electors':
			filter_column_name = 'Electors';
			createMapsTurnout(600, 300,topoJsonpath,api_path, 6, 'Electors distribution across constituencies',state+' '+year,'AC_No',filter_column_name,'#31a354', 'ac',[100000,150000,200000], '');
					break;
					
		case 'nota':
			filter_column_name = 'NOTA_percent';
			createMapsTurnout(600, 300,topoJsonpath,api_path, 6, 'NOTA across constituencies',state+' '+year,'AC_No',filter_column_name,'#756bb1', 'ac',[1,3,5],'%');
					break;
					
		case 'margin_victory':
			filter_column_name = 'Margin_percent';
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
}

function showGeChartsVizualisation(elect_type, state, year, viz_option,party ) {
	var usercolors = getRandomColors(10);
	var filepath = '';
	
	
	filepath = 'api/elections/';	
	switch(viz_option) {
		
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

function showGeMapVizualisation(elect_type, state, year, viz_option, party) {
	var usercolors = getRandomColors(30);

	var root_path = 'assets/elections/'+elect_type+'/';
	
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
	var column_name = '';
	switch(viz_option) {
		
		case 'winners':
			column_name = 'Party1';
			var partiesPath = 'api/ge/parties/'+year+'/5';
			createMapsWinners(600, 400,topoJsonpath,api_path+'/position/1',partiesPath, 6,  'Regional Distribution of Winners ','General Election '+year,'PC_No',column_name,usercolors, topoMapObj);
			break;
		
		case 'voteshare':
			createMapsVoteShare(600, 400,topoJsonpath,api_path2, 6, 'Regional Distribution of Vote Share '+party,'General Election '+year,'PC_No','Percent1','#08306B',topoMapObj);
			break;

		case 'turnout':
			createMapsTurnout(600, 400,topoJsonpath,api_path, 6, 'Regional Distribution of Turnout','General Election '+year,'PC_No','Turnout', '#336600', topoMapObj,[40,50,60,70],'%');			
			break;				
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
	var color = d3.scale.category10();

	
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
			.attr("class", function(d) { return 'class_'+d.name.replace(/ /g,"_");})
			.attr("d", function (d) { return line(d.values); })
			.style("stroke", function (d) {
				if(color_code_legends[0][d.name]) {
					return color_code_legends[0][d.name];
				} else {
					return color(d.name);
				}
							
			})
			.style("stroke-width", "2px")
			.style("stroke-dasharray", "5,5")
			.style("fill", "none")
			.style("opacity", 1);

		series.selectAll(".point")
			.data(function (d) { return d.values; })
			.enter().append("circle")
			.attr("class", "point")
			.attr("class", function(d) { return 'class_'+d.name.replace(/ /g,"_");})
			.attr("cx", function (d) { return x(d.label) + x.rangeBand()/2; })
			.attr("cy", function (d) { return y(d.value); })
			.attr("r", "5px")
			.style("fill", function (d) { 
				if(color_code_legends[0][d.name]) {
					return color_code_legends[0][d.name];
				} else {
					return color(d.name);
				}
			})
			.style("stroke", "grey")
			.style("stroke-width", "1px")
			.style("opacity", 1)
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
					.attr("class", function(d) { return 'classleg_'+d.replace(/ /g,"_");})
					.attr("x", chart_area.width+10)
					.attr("y", function(d, i){ return (chart_area.y + title_area.y + (i*ls_h) + 2*ls_h) + (2*i);})
					.attr("width", ls_w)
					.attr("height", ls_h)
					.style("fill",function(d){
						if(color_code_legends[0][d]) {
							return color_code_legends[0][d];
						} else {
							return color(d);
						}
					})
					.style("opacity", 1)
					.on("click", function (d, i) {
                      var lVisibility = this.style.opacity 
                      filterGraph(d, lVisibility);
					});
					 
				legend.append("text")
					.attr("class", function(d) { return 'classleg_'+d.replace(/ /g,"_");})
					.attr("x", chart_area.width+40)
					.attr("y", function(d, i){ return (chart_area.y + (i*ls_h) + 2*ls_h) + (2*i) + ls_h-2;})
					.style("font-size","12px")
					.style("opacity", 1)
					.text(function (d) { return d; })
					.on("click", function (d, i) {
                      var lVisibility = this.style.opacity 
                      filterGraph(d.replace(/ /g,"_"), lVisibility);
					});
					
				createlegendBorder(svg)
				resizeSvg(svg, '.chart_area');
				
				d3.select("#filtervalued")
							.append('div')
							.append('ul')

							.attr('class','legend_list')
							.attr('height', height)
							.append('li')
							.append('label')
							.attr('for','All')
							.text('All')
							.append("input")
							.attr("checked", true)
							.attr("type", "checkbox")
							.attr("id", "All")
							.on("change", function (d) {checkboxToggle(this)});
							
					
				var legend1 = d3.select("#filtervalued")
							.append('div')
							.append('ul')
							.attr('class','legend_list')
							.attr('height', height);

				var keys = legend1.selectAll('li.key')
							.data(varNames.slice().reverse())
							.enter().append('li')
							.append('label')
							.attr('for',function(d) { return 'class_'+d.replace(/ /g,"_");})
							.text(function(d){  return d; })
							.append("input")
							.attr("checked", true)
							.attr("type", "checkbox")
							.attr("value", function(d) { return 'class_'+d.replace(/ /g,"_");})
							.attr("name", function(d) { return 'class_'+d.replace(/ /g,"_");})
							.attr("id", function(d) { return 'class_'+d.replace(/ /g,"_");})
							.on("click", function (d, i) {
								sidefilterGraph(this);
							});
				
			  
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

	var color = d3.scale.category10();

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

		
		var bars = state.selectAll("rect")
					.data(function(d) { return d.ages; }) // (data) is an array/iterable thing, second argument is an ID generator function

		  bars.exit()
			.transition()
			.duration(300)
			.attr("y", y(0))
			.attr("height", height - y(0))
			.style('fill-opacity', 1e-6)
			.remove();

		  // data that needs DOM = enter() (a set/selection, not an event!)
		  bars.enter().append("rect")
			.attr("class", "bar")
			.attr("class", function(d) { 
					return 'class_'+d.name.replace(/ /g,"_");
				})
			
			.attr("y", y(0))
			.attr("height", height - y(0))
			.on("mouseover", function (d) { showPopover.call(this,d); })
					.on("click", function (d) { showPopover.call(this, d); })
					.on("mouseout",  function (d) { removePopovers(); });;

		  // the "UPDATE" set:
		  bars.transition().duration(300).attr("x", function(d) { return x1(d.name); }) // (d) is one item from the data array, x is the scale object from above
			.attr("width",  x1.rangeBand()) // constant, so no callback function(d) here
			.attr("y", function(d) { return y(d.value); })
			.attr("height", function(d) { return height - y(d.value); }) // flip the height, because y's domain is
			.style("fill", function(d) { return color(d.name); })
					

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
					.attr("class", function(d) { return 'classleg_'+d.replace(/ /g,"_");})
					.attr("x", chart_area.width+10)
					.attr("y", function(d, i){ return (chart_area.y + title_area.y + (i*ls_h) + 2*ls_h) + (2*i);})
					.attr("width", ls_w)
					.attr("height", ls_h)
					.style("fill",color)
					.style("opacity", 1)
					.on("click", function (d, i) {
                      var lVisibility = this.style.opacity 
                      filterGraph(d.replace(/ /g,"_"), lVisibility);
					});
					 
				legend.append("text")
					.attr("class", function(d) { return 'classleg_'+d.replace(/ /g,"_");})
					.attr("x", chart_area.width+40)
					.attr("y", function(d, i){ return (chart_area.y + (i*ls_h) + 2*ls_h) + (2*i) + ls_h-2;})
					.style("font-size","12px")
					.style("opacity", 1)
					.text(function (d) { return d; })
					.on("click", function (d, i) {
                      var lVisibility = this.style.opacity 
                      filterGraph(d.replace(/ /g,"_"), lVisibility);
					});
				createlegendBorder(svg)
				resizeSvg(svg, '.chart_area');	

				d3.select("#filtervalued")
							.append('div')
							.append('ul')

							.attr('class','legend_list')
							.attr('height', height)
							.append('li')
							.append('label')
							.attr('for','All')
							.text('All')
							.append("input")
							.attr("checked", true)
							.attr("type", "checkbox")
							.attr("id", "All")
							.on("change", function (d) {checkboxToggle(this)});
							
					
				var legend1 = d3.select("#filtervalued")
							.append('div')
							.append('ul')
							.attr('class','legend_list')
							.attr('height', height);

				var keys = legend1.selectAll('li.key')
							.data(ageNames.slice().reverse())
							.enter().append('li')
							.append('label')
							.attr('for',function(d) { return 'class_'+d.replace(/ /g,"_");})
							.text(function(d){  return d; })
							.append("input")
							.attr("checked", true)
							.attr("type", "checkbox")
							.attr("value", function(d) { return 'class_'+d.replace(/ /g,"_");})
							.attr("name", function(d) { return 'class_'+d.replace(/ /g,"_");})
							.attr("id", function(d) { return 'class_'+d.replace(/ /g,"_");})
							.on("click", function (d, i) {
								sidefilterGraph(this);
							});				
						
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
			rateById[d[col1Head]] = d; 
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
				.selectAll("path")
				.data(topojson.feature(mdata, mdata.objects[topoObject]).features)
				.enter().append("path")
				.style ( "fill" , '#D0D0D0')
				.style("stroke-width","1px")
				.style("stroke","#fff")
				.attr("d", path)
			
				svg.append("g")				
				.attr("transform", "translate(" + margin.left + "," +(title_area.height + 10) + ")")
				.attr("class", "counties")
				
				.selectAll("path")
				.data(topojson.feature(mdata, mdata.objects[topoObject]).features)
				.enter().append("path")
				.attr("class", function(d) { 
					if(rateById[d.properties[mappingColumn]] !== undefined) {
						return 'class_'+getClassNameForTurnout(rateById[d.properties[mappingColumn]][col2Head]);
					}
				})
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
				.style("stroke","#ccc")
				.style("stroke-width","1px")
				.style("opacity", 1)
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
					.attr("class", function(d) { return 'classleg_'+d;})
					.attr("x", graph_area.x + graph_area.width+30)
					.attr("y", function(d, i){ return (graph_area.y + title_area.y + (i*ls_h) + 2*ls_h) + (2*i);})
					.attr("width", ls_w)
					.attr("height", ls_h)
					.style("fill", function(d){ return color(d); })
					.style("opacity", 1)
					.on("click", function (d, i) {
                      // register on click event
                     // console.log ('opacity:' + this.style.opacity  );
                      var lVisibility = this.style.opacity 
                     // console.log ('lVisibility:' + lVisibility  );
                      filterGraph(d, lVisibility);
					});
					 
				legend.append("text")
					.attr("class", function(d) { return 'classleg_'+d;})
					.attr("x", graph_area.x + graph_area.width + 60)
					.attr("y", function(d, i){ return (graph_area.y + (i*ls_h) + 2*ls_h) + (2*i) + ls_h-2;})
					.style("font-size","12px")
					.style("opacity", 1)
					.text(function(d, i){ return legend_labels[i]; })
					.on("click", function (d, i) {
                      // register on click event
                     // console.log ('opacity:' + this.style.opacity  );
                      var lVisibility = this.style.opacity 
                     // console.log ('lVisibility:' + lVisibility  );
                      filterGraph(d, lVisibility);
					});
				createlegendBorder(svg)
				
				d3.select("#filtervalued")
							.append('div')
							.append('ul')

							.attr('class','legend_list')
							.attr('height', height)
							.append('li')
							.append('label')
							.attr('for','All')
							.text('All')
							.append("input")
							.attr("checked", true)
							.attr("type", "checkbox")
							.attr("id", "All")
							.on("change", function (d) {checkboxToggle(this)});
							
					
				var legend1 = d3.select("#filtervalued")
							.append('div')
							.append('ul')
							.attr('class','legend_list')
							.attr('height', height);

				var keys = legend1.selectAll('li.key')
							.data(ext_color_domain)
							.enter().append('li')
							.append('label')
							.attr('for',function(d) { return 'class_'+d;})
							.text(function(d, i){  return legend_labels[i]; })
							.append("input")
							.attr("checked", true)
							.attr("type", "checkbox")
							.attr("value", function(d) { return 'class_'+d;})
							.attr("name", function(d) { return 'class_'+d;})
							.attr("id", function(d) { return 'class_'+d;})
							.on("click", function (d, i) {
								sidefilterGraph(this);
							});
							
							/*var zoom = d3.behavior.zoom()
							.on("zoom",function() {
								g.attr("transform","translate("+ 
									d3.event.translate.join(",")+")scale("+d3.event.scale+")");
								g.selectAll("path")  
									.transition().duration(300).attr("d", path.projection(projection)); 
						});

						g.call(zoom)*/
						
					function getClassNameForTurnout(d) {
						var new_d = '';
						if(d < 1) {
							new_d = d*100;
						} else {
							new_d = d;
						}
						if(new_d< ext_color_domain[1]){
							return ext_color_domain[0];
						} else if(new_d> ext_color_domain[ext_color_domain.length-1]){
							return ext_color_domain[ext_color_domain.length-1];
						} else {
							return Math.floor(new_d / 10) * 10
						}
						
					}
					
					
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
				.selectAll("path")
				.data(topojson.feature(mdata, mdata.objects[topoObject]).features)
				.enter().append("path")
				.style ( "fill" , '#D0D0D0')
				.style("stroke-width","1px")
				.style("stroke","#fff")
				.attr("d", path)
				
			svg.append("g")				
				.attr("transform", "translate(" + margin.left + "," +(title_area.height + 10) + ")")
				.attr("class", "counties")
				.selectAll("path")
				.data(topojson.feature(mdata, mdata.objects[topoObject]).features)
				.enter().append("path")
				.attr("class", function(d) { 
					if(rateById[d.properties[mappingColumn]] !== undefined) {
						return 'class_'+getClassNameForTurnout(rateById[d.properties[mappingColumn]][col2Head]);
					}
				})
				.style("stroke","#ccc")
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
				.style("opacity", 1)
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
					.attr("class", function(d) { return 'classleg_'+d;})
					.attr("x", graph_area.x + graph_area.width+30)
					.attr("y", function(d, i){ return (graph_area.y + title_area.y + (i*ls_h) + 2*ls_h) + (2*i);})
					.attr("width", ls_w)
					.attr("height", ls_h)
					.style("fill", function(d){ return color(d); })
					.style("opacity", 1)
					.on("click", function (d, i) {
						var lVisibility = this.style.opacity 
                        filterGraph(d, lVisibility);
					});;
					 
				legend.append("text")
					.attr("class", function(d) { return 'classleg_'+d;})
					.attr("x", graph_area.x + graph_area.width + 60)
					.attr("y", function(d, i){ return (graph_area.y + (i*ls_h) + 2*ls_h) + (2*i) + ls_h-2;})
					.style("font-size","12px")
					.style("opacity", 1)
					.text(function(d, i){ return legend_labels[i]; })
					.on("click", function (d, i) {
                        var lVisibility = this.style.opacity 
						filterGraph(d, lVisibility);
					});
				createlegendBorder(svg);
				d3.select("#filtervalued")
							.append('div')
							.append('ul')

							.attr('class','legend_list')
							.attr('height', height)
							.append('li')
							.append('label')
							.attr('for','All')
							.text('All')
							.append("input")
							.attr("checked", true)
							.attr("type", "checkbox")
							.attr("id", "All")
							.on("change", function (d) {checkboxToggle(this)});
							
					
				var legend1 = d3.select("#filtervalued")
							.append('div')
							.append('ul')
							.attr('class','legend_list')
							.attr('height', height);

				var keys = legend1.selectAll('li.key')
							.data(ext_color_domain)
							.enter().append('li')
							.append('label')
							.attr('for',function(d) { return 'class_'+d;})
							.text(function(d, i){  return legend_labels[i]; })
							.append("input")
							.attr("checked", true)
							.attr("type", "checkbox")
							.attr("value", function(d) { return 'class_'+d;})
							.attr("name", function(d) { return 'class_'+d;})
							.attr("id", function(d) { return 'class_'+d;})
							.on("click", function (d, i) {
								sidefilterGraph(this);
							});
							
				function getClassNameForTurnout(d) {
					var new_d = '';
					if(d < 1) {
						new_d = d*100;
					} else {
						new_d = d;
					}
					if(new_d< ext_color_domain[1]){
						return ext_color_domain[0];
					} else if(new_d> ext_color_domain[ext_color_domain.length-1]){
						return ext_color_domain[ext_color_domain.length-1];
					} else {
						return Math.floor(new_d / 10) * 10
					}
					
				}
					
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
	var count_labels ={};
					
	$.getJSON(partiesPath, function(data) {
       
		data.forEach(function(d) {
				legend_labels.push(d['_id']);
				count_labels[d['_id']] = d['count'];
		});
		//console.log(data);
	});

	$.getJSON(csvPath, function(data) {
       count_labels['Others'] = 0;
		data.forEach(function(d) { rateById[d[col1Head]] = d; 
		
			if(other_parties.indexOf(d[col2Head]) == -1 && legend_labels.indexOf(d[col2Head]) == -1) {
				other_parties.push(d[col2Head]);
			}
			if(other_parties.indexOf(d[col2Head]) > -1) {
				count_labels['Others'] += 1;
			}
		});
		legend_labels.push('Others');
		//console.log(count_labels);
		//other_parties = other_parties.join("<br />");
		/*var tooltip = d3.select("body")
					.append("div")
					.attr("class","legendtooltip")
					.style("position", "absolute")
					.style("z-index", "10")
					.style("visibility", "hidden")
					.html(other_parties);*/
					
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
				.selectAll("path")
				.data(topojson.feature(mdata, mdata.objects[topoObject]).features)
				.enter().append("path")
				.style ( "fill" , '#D0D0D0')
				.style("stroke-width","1px")
				.style("stroke","#fff")
				.attr("d", path)
				
			svg.append("g")				
				.attr("transform", "translate(" + margin.left + "," +(margin.top + title_area.y + title_area.height + 10) + ")")
				.attr("class", "counties")
				.selectAll("path")
				.data(topojson.feature(mdata, mdata.objects[topoObject]).features)
				.enter().append("path")
				.attr("class", function(d) { 
					if(rateById[d.properties[mappingColumn]] !== undefined) {
						if(legend_labels.indexOf(rateById[d.properties[mappingColumn]][col2Head]) == -1) {
								return 'class_Others';
						} else {
							return 'class_'+getCleanedClassname(rateById[d.properties[mappingColumn]][col2Head])) 
						}
					}
				})
				.style("stroke","#ccc")
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
				.style("opacity",1)
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
				.attr("class", function(d) { return 'classleg_'+getCleanedClassname(d);})
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
				.style("opacity", 1)
				.on("click", function (d, i) {
                      var lVisibility = this.style.opacity 
                      filterGraph(getCleanedClassname(d), lVisibility);
                   });
				 
			 
			legend.append("text")
				.attr("class", function(d) { return 'classleg_'+getCleanedClassname(d);})
				.attr("x", graph_area.x + graph_area.width + 60)
				.attr("y", function(d, i){ return (title_area.y + title_area.height + (i*ls_h) + 2*ls_h) + (2*i) + ls_h-2;})
				.style("font-size","12px")
				.style("opacity", 1)
				.text(function(d, i){ return legend_labels[i]+' ('+count_labels[legend_labels[i]]+')'; })
				.on("click", function (d, i) {
                     var lVisibility = this.style.opacity 
                      filterGraph(getCleanedClassname(d), lVisibility);
					});
					
				/*legend.selectAll('.classleg_Others')
				.on("mouseover", function(i){return tooltip.style("visibility", "visible");})
				.on("mousemove", function(){return tooltip.style("top",
					(d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
				.on("mouseout", function(){return tooltip.style("visibility", "hidden");});*/
				
			createlegendBorder(svg);
			
			
			d3.select("#filtervalued")
							.append('div')
							.append('ul')

							.attr('class','legend_list')
							.attr('height', height)
							.append('li')
							.append('label')
							.attr('for','All')
							.text('All')
							.append("input")
							.attr("checked", true)
							.attr("type", "checkbox")
							.attr("id", "All")
							.on("change", function (d) {checkboxToggle(this)});
							
					
			var legend1 = d3.select("#filtervalued")
						.append('div')
						.append('ul')
						.attr('class','legend_list')
						.attr('height', height);

			var keys = legend1.selectAll('li.key')
						.data(legend_labels)
						.enter().append('li')
						.append('label')
						.attr('for',function(d) { return 'class_'+getCleanedClassname(d);})
						.text(function(d, i){  return legend_labels[i]; })
						.append("input")
						.attr("checked", true)
						.attr("type", "checkbox")
						.attr("value", function(d) { return 'class_'+getCleanedClassname(d);})
						.attr("name", function(d) { return 'class_'+getCleanedClassname(d);})
						.attr("id", function(d) { return 'class_'+getCleanedClassname(d);})
						.on("click", function (d, i) {
							sidefilterGraph(this);
						});
			
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
			function removeLengendPopovers () {
			  $('.popover').each(function() {
				$(this).remove();
			  }); 
			}

			function showLegendPopover (d) {
			  $(this).popover({
				title: d.name,
				placement: 'auto bottom',
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
	var  newOpacity ='';
	
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
				.selectAll("path")
				.data(topojson.feature(mdata, mdata.objects[topoObject]).features)
				.enter().append("path")
				.style ( "fill" , '#D0D0D0')
				.style("stroke-width","1px")
				.style("stroke","#fff")
				.attr("d", path)
				
			svg.append("g")				
				.attr("transform", "translate(" + margin.left + "," +(title_area.height + 10) + ")")
				.attr("class", "counties")
				.selectAll("path")
				.data(topojson.feature(mdata, mdata.objects[topoObject]).features)
				.enter().append("path")
				.attr("class", function(d) { 
					if(rateById[d.properties[mappingColumn]] !== undefined) {
						return 'class_'+rateById[d.properties[mappingColumn]][col2Head];
					}
				})
				.style("stroke","#ccc")
				.style("stroke-width","1px")
				.style ( "fill" , function (d) {
					if(rateById[d.properties[mappingColumn]] !== undefined) {
						if(color_code_legends[0][rateById[d.properties[mappingColumn]][col2Head]]) {
							return color_code_legends[0][rateById[d.properties[mappingColumn]][col2Head]]
						} else {
							return color(rateById[d.properties[mappingColumn]][col2Head]);
						}
						
					} else {
						return empty_area_color;
					}
				})
				.style("opacity", 1)
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
				.attr("class", function(d) { return 'classleg_'+d;})
				.attr("x", graph_area.x + graph_area.width+30)
				.attr("y", function(d, i){ return (graph_area.y + title_area.y + (i*ls_h) + 2*ls_h) + (2*i);})
				.attr("width", ls_w)
				.attr("height", ls_h)
				.style("fill", function(d, i) { 
						if(color_code_legends[0][d]) {
							return color_code_legends[0][d];
						} else {
							return color(d);
						}
				})
				.style("opacity", 1)
				.on("click", function (d, i) {
                      var lVisibility = this.style.opacity 
                      filterGraph(d, lVisibility);
                   });
			legend.append("text")
				.attr("class", function(d) { return 'classleg_'+d;})
				.attr("x", graph_area.x + graph_area.width + 60)
				.attr("y", function(d, i){ return (graph_area.y + (i*ls_h) + 2*ls_h) + (2*i) + ls_h-2;})
				.style("font-size","12px")
				.style("opacity", 1)
				.text(function(d, i){ return legend_labels[i]; })
				.on("click", function (d, i) {
                      var lVisibility = this.style.opacity 
                      filterGraph(d, lVisibility);
				});
				
			createlegendBorder(svg);
			d3.select("#filtervalued")
							.append('div')
							.append('ul')

							.attr('class','legend_list')
							.attr('height', height)
							.append('li')
							.append('label')
							.attr('for','All')
							.text('All')
							.append("input")
							.attr("checked", true)
							.attr("type", "checkbox")
							.attr("id", "All")
							.on("change", function (d) {checkboxToggle(this)});
				
			var legend1 = d3.select("#filtervalued")
							.append('div')
							.append('ul')
							.attr('class','legend_list')
							.attr('height', height);

				var keys = legend1.selectAll('li.key')
							.data(legend_labels)
							.enter().append('li')
							.append('label')
							.attr('for',function(d) { return 'class_'+d;})
							.text(function(d, i){  return legend_labels[i]; })
							.append("input")
							.attr("checked", true)
							.attr("type", "checkbox")
							.attr("value", function(d) { return 'class_'+d;})
							.attr("name", function(d) { return 'class_'+d;})
							.attr("id", function(d) { return 'class_'+d;})
							.on("click", function (d, i) {
								sidefilterGraph(this);
							});
			
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
				.selectAll("path")
				.data(topojson.feature(mdata, mdata.objects[topoObject]).features)
				.enter().append("path")
				.style ( "fill" , '#D0D0D0')
				.style("stroke-width","1px")
				.style("stroke","#fff")
				.attr("d", path)
				
			svg.append("g")				
				.attr("transform", "translate(" + margin.left + "," +(title_area.y + title_area.height + 10) + ")")
				.attr("class", "counties")
				.selectAll("path")
				.data(topojson.feature(mdata, mdata.objects[topoObject]).features)
				.enter().append("path")
				.attr("class", function(d) { 
					if(rateById[d.properties[mappingColumn]] !== undefined) {
						return 'class_'+getClassNameForTurnout(rateById[d.properties[mappingColumn]][col2Head]);
					}
				})
				.style("stroke","none")
				.style("stroke-width","1px")
				.style ( "fill" , function (d) {
					if(rateById[d.properties[mappingColumn]] !== undefined) {	
						return color(rateById[d.properties[mappingColumn]][col2Head]);
					} else {
						return empty_area_color;
					}
				})
				.style("opacity", 1)
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
				.attr("class", function(d) { return 'classleg_'+d;})
				.attr("x", graph_area.x + graph_area.width+30)
				.attr("y", function(d, i){ return (graph_area.y + title_area.y + (i*ls_h) + 2*ls_h) + (2*i);})
				.attr("width", ls_w)
				.attr("height", ls_h)
				.style("fill", function(d, i) { return color(d); })
				.style("opacity", 1)
				.on("click", function (d, i) {
				  var lVisibility = this.style.opacity 
				  filterGraph(d, lVisibility);
				});
				 
			legend.append("text")
				.attr("class", function(d) { return 'classleg_'+d;})
				.attr("x", graph_area.x + graph_area.width + 60)
				.attr("y", function(d, i){ return (graph_area.y + (i*ls_h) + 2*ls_h) + (2*i) + ls_h-2;})
				.style("font-size","12px")
				.style('opacity',1)
				.text(function(d, i){ return legend_labels[i]; })
				.on("click", function (d, i) {
                      var lVisibility = this.style.opacity 
                      filterGraph(d, lVisibility);
					});
					
			createlegendBorder(svg)
			d3.select("#filtervalued")
							.append('div')
							.append('ul')

							.attr('class','legend_list')
							.attr('height', height)
							.append('li')
							.append('label')
							.attr('for','All')
							.text('All')
							.append("input")
							.attr("checked", true)
							.attr("type", "checkbox")
							.attr("id", "All")
							.on("change", function (d) {checkboxToggle(this)});
							
					
			var legend1 = d3.select("#filtervalued")
						.append('div')
						.append('ul')
						.attr('class','legend_list')
						.attr('height', height);

			var keys = legend1.selectAll('li.key')
						.data(ext_color_domain)
						.enter().append('li')
						.append('label')
						.attr('for',function(d) { return 'class_'+d;})
						.text(function(d, i){  return legend_labels[i]; })
						.append("input")
						.attr("checked", true)
						.attr("type", "checkbox")
						.attr("value", function(d) { return 'class_'+d;})
						.attr("name", function(d) { return 'class_'+d;})
						.attr("id", function(d) { return 'class_'+d;})
						.on("click", function (d, i) {
							sidefilterGraph(this);
						});

			function getClassNameForTurnout(d) {
				var new_d = d;
				if(new_d> ext_color_domain[ext_color_domain.length-1]){
					return ext_color_domain[ext_color_domain.length-1];
				} else {
					return d-1;
				}
				
			}
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

function getCleanedClassname(value) {
	if(isNaN(value)) {
		return value.replace(/\W/g, "0");
	} else {
		return value;
	}
	
}