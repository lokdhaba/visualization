"use strict";

//common variables
var margin = {top: 55, right: 55, bottom: 55, left: 55};

//initialise the project for map
var projection = d3.geo.mercator().scale(1);
var path = d3.geo.path().projection(projection);
var limit_parties_legend = 5;
//TCPD name in title
var brand1 = 'Source: Adapted from ECI Data', brand2 = 'Trivedi Centre for Political Data, Ashoka University';

var root_path = 'assets/elections/';

//List of items to display in popup
var consDetailsArr = ["AC_Name","AC_Type","Position","Cand1","Sex1","Party1","Votes1","NOTA_percent","Turnout","Margin_percent","Vote_percent","Runner","Runner_party","Runner_sex"];

//Substitution for the field name from DB for popup
var renamedPopupFields = [{"AC_Name":"AC Name","AC_Type":"AC Type","Position":"Position","Cand1":"Candidate","Sex1":"Sex","Party1":"Party","Votes1":"Votes","NOTA_percent":"NOTA","Turnout":"Turnout","Margin_percent":"Margin","Runner":"Runner","Runner_party":"Runner party","Runner_sex":"Runner sex"}];

var empty_area_color = "#D0D0D0";
var color_code_legends = [{'Male':'#1f77b4','Female':'#8c564b','General':'#1f77b4','SC':'#ff7f0e','ST':'#2ca02c','Hindu':'#fd8d3c', 'Muslim':'#74c476'}];

//get party color codes
var color_codes = d3.map();
$.getJSON(api_root_path+"api/party/colors", function(json){

	json.forEach(function(d) { 
		color_codes.set(d.party, d.color); 
	});
});
/*
//To create div with specific id for SVG maps/graphs drawing area
function create_draw_area(gSeqNo,mheading,sheading) {
   var divid = 'graph_area'+gSeqNo;
    $('.mainGraphDiv').append('<div style="text-align:center" id="'+divid+'" class="graph_area"></div>'); 
   return divid;
}

//To create svg inside the divid
function create_svg(divid, width, height) { 

	var svg = d3.select("#"+divid).append("div").append("svg")
				.attr("width",  width  + margin.left + margin.right)
				.attr("height", height + margin.top  + margin.bottom)
				.attr("transform", "translate(-" + margin.left + "," +(10) + ")")
				//.attr("width",  width  )
				//.attr("height", height)
				.style("font-family", "'Droid Serif', serif")
				.style("color", "#333333")
				.style("z-index","-1");
		//svg.append('g').attr('class','svg_title');
		//svg.append('g').attr('class','svg_legend');
				
	return svg;
}
*/

/*** follwoing three functions for embedd responsive display **/
//To create div with specific id for SVG maps/graphs drawing area
function create_draw_area(gSeqNo,mheading,sheading) {
	var divid = 'graph_area'+gSeqNo;
	$('#mainGraphDiv').append('<div style="text-align:center" id="'+divid+'" class="graph_area svg-container"></div>'); 
   return divid;
   
}

function getUrlVars() {

	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++)
	{
		hash = hashes[i].split('=');
		vars[hash[0]] = hash[1];
	}
	return vars;
}

//To create svg inside the divid
function create_svg(divid, width, height) { 

	var svg = d3.select("#"+divid).append("div").append("svg")
				.attr("preserveAspectRatio", "xMinYMin meet")
	if(getUrlVars()['type'].indexOf('charts') > -1) {
		svg.attr("viewBox", "0 0 700 400")
	} else {
		svg.attr("viewBox", "0 0 600 500")
	}
   //class to make it responsive
   svg.classed("svg-content-responsive", true);
				
	return svg;
}
/*** end responsive display **/

//Get map centerpoints to project map according to the page. Used boundary points from geojson file
function getMapCenterScale(boundry_points,width, height) {

	var b = boundry_points;
	var center = [(b[0] + b[2]) / 2, (b[1] + b[3]) / 2]
	var wScale = width  / (Math.abs(b[0] - b[2]) / 360) / 2 / Math.PI
	var hScale = height / (Math.abs(b[1] - b[3]) / 360) / 2 / Math.PI
	var scale = Math.min(wScale, hScale)
	return [center, scale];
}


//Create legends for maps : eg getLegendRanges([20,30,40,50,60],'%') => o/p: [0,20,30,40,50,60],["<20%","20-30%",...,">60%"]
function getLegendRanges(range_values, unit) {

	range_values.reverse();
	range_values.push(0);
	range_values.reverse();
	//var range_values_zeroed = range_values;
	var range =[];
	for(var i=0;i<range_values.length;i++){
		if(i==0) {
			range[i] = '<'+range_values[i+1]+unit;
		} else if(i == range_values.length-1) {
			range[i] = '>'+range_values[i]+unit;
		} else {
			range[i] = range_values[i]+unit+'-'+range_values[i+1]+unit;
		}
	}
	return [range_values,range];
}

//Creates border to legend based on the legend width and height, specific to SVG
function createlegendBorder(svg) {
	var legendPadding= 5;
	var legend_box = svg.selectAll(".legend-box").data([true]);

	legend_box.enter().append("rect")
	.style("fill","none")
	.style("stroke","gray")
    .style("stroke-width","1px")
    .style("opacity","1")
	.classed("legend-box",true)
	var	legend_grp = svg.selectAll(".legend_grp").data([true]) ;
	
	var legend_grp_size = legend_grp[0][0].getBBox();
	if(legend_grp_size.height > 0) {
		legend_box.attr("x",(legend_grp_size.x-legendPadding))
			.attr("y",(legend_grp_size.y-legendPadding+69))
			.attr("height",(legend_grp_size.height+2*legendPadding))
			.attr("width",(legend_grp_size.width+2*legendPadding))
	}
}


//removes special characters from for the given value
function getCleanedClassname(value) {
	if(value!='' && isNaN(value)) {
		return value.replace(/\W/g, "0");
	} else {
		return value;
	}
	
}

//removes special characters from for the given value
function getCleanedLegendname(value) {
	//console.log(value);
	if(isNaN(value)) {
		//console.log(value.replace(/\W/g, " "));
		return value.replace("_", " ");
	} else {
		return value;
	}
	
}

//binds constituency data to popup
function getPopupDetails(popupdata) {
	if(popupdata != undefined) {
		
	var html = '';
		if(popupdata['ac_name']) {
			html+= '<b>Seat</b>: '+ popupdata['ac_name'] + ' ('+popupdata['ac_type']+')<br>';
		}
		if(popupdata['turnout']) {
			html+= '<b>Turnout</b>: '+ ((popupdata['turnout']< 1)? (parseFloat(popupdata['turnout'])*100).toFixed(2) : popupdata['turnout'])+'%<br>';
		}
		if(popupdata['cand1']) {
			html+= '<b>Winner</b>: '+ popupdata['cand1'] +'<br>';
		}
		if(popupdata['party1']) {
			html+= '<b>Party</b>: '+ popupdata['party1'] +'<br>';
		}
		if(popupdata['sex1']) {
			html+= '<b>Sex</b>: '+ popupdata['sex1'] +'<br>';
		}
		if(popupdata['votes1']) {
			html+= '<b>Votes</b>: '+ popupdata['votes1'] +'<br>';
		}
		if(popupdata['vote_percent']) {
			html+= '<b>Vote share</b>: '+((popupdata['vote_percent']< 1)? (parseFloat(popupdata['vote_percent'])*100).toFixed(2) : popupdata['vote_percent'])+'%<br>';
		}
		if(popupdata['margin_percent']) {
			html+= '<b>Margin</b>: '+((popupdata['margin_percent']< 1)? (parseFloat(popupdata['margin_percent'])*100).toFixed(2) : popupdata['margin_percent'])+'%<br>';
		}
		if(popupdata['runner']) {
			html+= '<hr>'
			html+= '<b>Runner-up</b>: '+ popupdata['runner'] +'<br>';
		}
		if(popupdata['runner_party']) {
			html+= '<b>Party</b>: '+ popupdata['runner_party'] +'<br>';
		}	
		if(popupdata['runner_sex']) {
			html+= '<b>Sex: '+ popupdata['runner_sex'] +'<br>';
		}
		return html;
	}
}

//Create title for maps/graphs for specific svg
function createMapTitle(svg, width, height, margin, mheading, sheading) {
	
	
	var title = svg.append("g")
	.attr("class","title_grp");
	
	var mtitle = title.append("text")
	  .attr("class", "title")
	  .attr("x", width/2)
	  .attr("y", 20)
	  .attr("text-anchor", "middle")
	  .style("font-size","20px")
	  .attr("editable","simple")
	  .text(mheading);
	  
	 title.append("text")
	  .attr("class", "stitle")
	  .attr("x", (width/2)+5)
	  .attr("y", 20 )
	  .attr("text-anchor", "middle")
	  .style("font-size","16px")
	  .style("font-style","italic")
      .style("color","#666666")
	  .text(' '+sheading.replace("_",' '))
	  
	  title.append("text")
	  .attr("class", "b1title")
	  .attr("x", 50+(width/2))
	  .attr("y", 60)
	  .attr("text-anchor", "middle")
	  .style("font-size","12px")
	  .style("color","#333333")
	  .text(brand1); 
		  
	title.append("foreignObject")
		.attr("x", width)
		.attr("y", 40)
		.attr("width", 30)
		.attr("height", 30)
		.append("image")
		.attr("src","./assets/edit.svg")
		.attr("width", 30)
		.attr("height", 30)
		
	  title.append("text")
	  .attr("class", "b2title")
	  .attr("x", 50+(width/2))
	  .attr("y", 80)
	  .attr("text-anchor", "middle")
	  .style("font-size","12px")
	  .style("color","#333333 !important")
	  .text(brand2);
	  
	  title.append("rect")
	  .attr("class", "title_rect")
	  .attr('width','10')
	  .attr('height','20')
	  .attr("x", width/2)
	  .attr("y", 100)
	  .style('fill','none')
	  .attr("text-anchor", "middle")
	  .style("font-size","10px")
	  .text('    ');
	
var title_l = svg.append("g")
	.attr("class","title_line_grp");
	title_l.append("line")
		.attr("class", "title_line")
		.attr("x1", 0)
		.attr("y1", 40)
		.attr("x2", width)
		.attr("y2", 40)
		.style("stroke","#DADADA")
		.style("stroke-width","1px")
		.style("shape-rendering","crispEdges");
		
		alignTitle();
		
		
}

function alignTitle() {
	var G1 = document.getElementsByClassName("title")
	var G2 = document.getElementsByClassName("stitle")
	var G3 = document.getElementsByClassName("title_line")
	var BB1 = G1[0].getBBox()
	var BB2 = G2[0].getBBox()
	var BB3 = G3[0].getBBox()
	
	//console.log(BB1);
	G2[0].setAttribute("transform", "translate("+ ((BB1.x+BB1.width+5)-BB2.x) + 0 +")")
	G3[0].setAttribute("x2", ((BB1.x+BB1.width+BB2.width+(2*margin.left))))
}

//Resize all svg elemnts to avoid overlapping 
function reSizeSvgElements(type) {
	alignTitle();
	var G1 = document.getElementsByClassName("title_grp")
	var G2 = document.getElementsByClassName("chart_area")
	
	var BB1 = G1[0].getBBox()
	var BB2 = G2[0].getBBox()
	
	G2[0].setAttribute("transform", "translate("+ margin.left + " " + ((BB1.y+BB1.height)-BB2.y) + ")")
	if(type == 'maps') {
		G2[1].setAttribute("transform", "translate("+ margin.left + " " + ((BB1.y+BB1.height)-BB2.y) + ")")
	}
		
	var G3 = document.getElementsByClassName("legend_grp");
	var BB3 = G3[0].getBBox();
	G3[0].setAttribute("transform", "translate(" + ((BB2.x+BB2.width+margin.left +20 )-BB3.x) + " " + ((BB1.y+BB1.height)-BB3.y) + ")")
	
	if(BB1.width < (BB2.width+BB3.width)) {
		//d3.select('svg').attr('width', ((BB2.x+BB2.width+BB3.width+ (2*margin.left))) )
		
		d3.select('.title_line').attr('x2', ((BB2.x+BB2.width+BB3.width+ (2*margin.left))) )
	} else {
		//d3.select('svg').attr('width', ((BB1.x+BB1.width+(2*margin.left))) )
		d3.select('.title_line').attr('x2', ((BB1.x+BB1.width+ (2*margin.left))) )
	}
	
	d3.select('svg').style('height', '100%')
}


//Creates AE charts based on the selection box values
//showAeChartsVizualisation('AE', 'Bihar', '1962', 'voter_turnout', '' )
function showAeChartsVizualisation(elect_type, state, year, viz_option, party ) {
	var usercolors = d3.scale.category10();
	var filepath ='';
	
	
	filepath = api_root_path+'api/elections/'
	switch(viz_option) {
		
		case 'voter_turnout':
			filepath = filepath+'ae_voter_turnouts?state='+state;
			createGridLineGraph(700, 300,filepath,0, 'Voter turnout', state+' '+year,'year','Year of election','turnout %',20);	
			break;
			
		case 'parties_contesting':
			filepath = filepath+'ae_parties_contests?state='+state;
			createGroupedBarGraph(600, 300,filepath,0, 'Name change - Parties represented in vidhan sabha / lok sabha', state+' '+year,'year', 'Year of election', 'parties contested');	
			break;
			
		case 'seatshare':
			filepath = filepath+'ae_seatshares?state='+state;
			createPartyGridLineGraph(600, 300,filepath,0, 'Seat Share of parties', state+' '+year,'year', ' Year of election', 'seat share %',0,'seats');
			break;
			
		case 'voteshare':
			filepath = filepath+'ae_voteshares?state='+state;
			createPartyGridLineGraph(600, 300,filepath,0, 'Party wise voteshare', state+' '+year,'year', 'Year of election', 'vote share %',0,'votes');	
			break;
		
		case 'contested_deposit_lost':
			filepath = filepath+'ae_contested_deposit_losts?state='+state;
			createGroupedBarGraph(600, 300,filepath,0, 'Contested and Deposit Saved', state+' '+year, 'year', 'Year of election', 'total candidates');	
			break;
		
		case 'women':
			filepath = filepath+'ae_womens?state='+state;
			createGridLineGraph(600, 300,filepath,0, 'Women candidates and winners', state+' '+year,'year', 'Year of election', '% of women winners',0);
			break;
	}
}

//Creates AE maps based on the selection box values
//showAeMapVizualisation('AE', 'Bihar', '1962', 'gender', '' )
function showAeMapVizualisation(elect_type, state, year, viz_option, party) {
	
	var usercolors = d3.scale.category10();
	var year_sa = year.split("#");
	var root_path = 'assets/elections/'+elect_type+'/'+state+'/';

	var api_path = api_root_path+'api/ae/elections?state='+state+'&year='+year_sa[0]+'&sa_no='+year_sa[1];
	//console.log(api_path);
	var api_path2 = api_root_path+'api/ae/elections/partypositions?state='+state+'&year='+year_sa[0]+'&sa_no='+year_sa[1]+'&party1='+party;
	var topoJsonpath = root_path+state+'.json';
	var filter_column_name ='';
	
	switch(viz_option) {
		case 'gender':
			filter_column_name = 'sex1';
			createMapsCategory(600, 300,topoJsonpath,api_path, 6, 'Constituencies with women winners ',state+' '+year,'ac_no',filter_column_name,'ac');
			break;
					

		case 'vote_share':
			filter_column_name = 'vote_percent';
			createMapsRanges(600, 300,topoJsonpath,api_path2, 6, 'Individual party vote share across constituencies',state+' '+year,'ac_no',filter_column_name,'#d62728', 'ac',[10,20,30,40],'%');
			break;
			
		case 'position':
			filter_column_name = 'position';
			createMapsPositions(600, 300,topoJsonpath,api_path2, 6, 'Individual party positions across constituencies ',state+' '+year,'ac_no',filter_column_name,'#393b79', 'ac');
			break;
		
		case 'candidates':
			filter_column_name = 'n_cand';
			createMapsRanges(600, 300,topoJsonpath,api_path, 6, 'Number of candidates contesting across constituencies',state+' '+year,'ac_no',filter_column_name,'#843c39', 'ac',[5,15],'');
					break;
					
		case 'Turnout':

			filter_column_name = 'turnout';
			createMapsRanges(600, 300,topoJsonpath,api_path, 6, 'Turnout across constituencies',state+' '+year,'ac_no',filter_column_name,'#393b79', 'ac',[40,50,60,70],'%');
					break;

		case 'Electors':
			filter_column_name = 'electors';
			createMapsRanges(600, 300,topoJsonpath,api_path, 6, 'Electors distribution across constituencies',state+' '+year,'ac_no',filter_column_name,'#31a354', 'ac',[100000,150000,200000], '');
					break;
					
		case 'nota':
			filter_column_name = 'nota_percent';
			createMapsRanges(600, 300,topoJsonpath,api_path, 6, 'NOTA across constituencies',state+' '+year,'ac_no',filter_column_name,'#756bb1', 'ac',[1,3,5],'%');
					break;
					
		case 'margin_victory':
			filter_column_name = 'margin_percent';
			createMapsRanges(600, 300,topoJsonpath,api_path, 6, 'Margin of victory across constituencies',state+' '+year,'ac_no',filter_column_name,'#756bb1', 'ac',[5,10,20],'%');
					break;
					
		case 'community':
			filter_column_name = 'ac_type';
			createMapsCategory(600, 300,topoJsonpath,api_path, 6, 'General, SC and ST seats (only winners)',state+' '+year,'ac_no',filter_column_name,'ac');
					break;
					
		case 'religion':
			filter_column_name = 'religion';
			createMapsCategory(600, 300,topoJsonpath,api_path, 6, 'Muslim candidates across constituencies',state+' '+year,'ac_no',filter_column_name, 'ac');
				break;
					
		case 'winners':
			filter_column_name = 'party1';
			var partiesPath = api_root_path+'api/ae/parties?state='+state+'&year='+year_sa[0]+'&sa_no='+year_sa[1]+'&limit='+limit_parties_legend;
			console.log(partiesPath);
			createMapsWinners(600, 300,topoJsonpath,api_path, partiesPath, 6, 'Winners across constituencies',state+' '+year,'ac_no',filter_column_name,usercolors, 'ac');
				break;
				
	}
	
	
}

//Creates GE charts based on the selection box values
//showGeChartsVizualisation('GE', 'Bihar', '1962', 'voter_turnout', '' )
function showGeChartsVizualisation(elect_type, state, year, viz_option,party ) {
	var usercolors = d3.scale.category10();
	var filepath = '';
	
	
	filepath = api_root_path+'api/elections/';	
	switch(viz_option) {
		
		case 'voter_turnout':
			filepath = filepath+'ge_voter_turnouts';
			createGridLineGraph(600, 300,filepath,0, 'Voter turnout', 'General Election '+year,'year','Year','Turnout',20);	
			break;
			
		case 'parties_contesting':
			filepath = filepath+'ge_parties_contests';
			createGroupedBarGraph(600, 300,filepath,0, 'Number of parties contesting and represented', 'General Election '+year,'year', 'Year', 'No of Parties');	
			break;
			
		case 'seatshare':
			filepath = filepath+'ge_seatshares';
			createPartyGridLineGraph(600, 300,filepath,0, 'Seat Share of parties', 'General Election '+year,'year', 'Year', 'No of Seats',0,'seats');
			break;
			
		case 'voteshare':
			filepath = filepath+'ge_voteshares';
			createPartyGridLineGraph(600, 300,filepath,0, 'Party wise voteshare', 'General Election '+year,'year', 'Year', 'Percentages',0,'votes');	
			break;
		
		case 'contested_deposit_lost':
			filepath = filepath+'ge_contested_deposit_losts';
			createGroupedBarGraph(600, 300,filepath,0, 'Contested and Deposit Saved', 'General Election '+year, 'year', 'Year', 'Total Candidates');	
			break;
		
		case 'women':
			filepath = filepath+'ge_womens';
			createGridLineGraph(600, 300,filepath,0, 'Women candidates and winners', 'General Election '+year,'year', 'Year', 'Percentages',0);
			break;
	}
}

//Creates GE maps based on the selection box values
//showGeMapVizualisation('GE', 'Bihar', '1962', 'voter_turnout', '' )
function showGeMapVizualisation(elect_type, state, year, viz_option, party) {
	var usercolors = d3.scale.category10();

	var root_path = 'assets/elections/'+elect_type+'/';
	
	var topoJsonpath = '',topoMapObj ='';
	var years_ga = year.split("#");
	var api_path = api_root_path+'api/ge/elections?year='+years_ga[0]+'&ga_no='+years_ga[1];
	var api_path2 = api_path+'&party='+party;
	
	//get topojson 	
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
			var partiesPath = api_root_path+'api/ge/parties?year='+years_ga[0]+'&ga_no='+years_ga[1]+'&limit='+limit_parties_legend;
			createMapsWinners(600, 400,topoJsonpath,api_path+'&position=1',partiesPath, 6,  'Regional Distribution of Winners ','General Election '+year,'pc_no',column_name,usercolors, topoMapObj);
			break;
		
		case 'voteshare':
			createMapsRanges(600, 400,topoJsonpath,api_path2, 6, 'Regional Distribution of Vote Share '+party,'General Election '+year,'pc_no','Percent1','#08306B',topoMapObj,[40,50,60,70],'%');
			break;

		case 'turnout':
			createMapsRanges(600, 400,topoJsonpath,api_path, 6, 'Regional Distribution of Turnout','General Election '+year,'pc_no','Turnout', '#336600', topoMapObj,[40,50,60,70],'%');			
			break;				
	}
}


/*Section:1 Charts/Graphs*/
/*Creates Line graph with grid 
	parameters:
	width = width of the svg area
	height = height of the svg area
	path = api path for json data
	gSeqNo = to differentiate the maps/graphs. if gSeqNo=2, then the div enclosing svg will have id="graph_area2"
	mheading = mainheading for the maps/graph(line 1 in title)
	sheading = sub heading for the maps/graph(line 2 in title)
	xAxishead = Value from JSON that is to be mapped for xaxis
	col1Head = xaxis label
	col2Head = yaxis label
	yscale = to spicify starting value for yaxis
*/
function createGridLineGraph(width, height,path,gSeqNo, mheading, sheading, xAxisHead, col1Head, col2Head,yscale) {
	
	var margin = {top: 15, right: 0, bottom: 35, left:55};
	var divid = create_draw_area(gSeqNo,mheading,sheading);
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

	  // create color range
	var color = d3.scale.category10();
	
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
		
		if(data.length == 0) {
			svg.append("g")
			.attr("class","chart_area")
			.attr("transform", "translate(" + (margin.left) + "," +(100 ) + ")")
			.append("text").text("No Data Available"); 
			return false;
		}
		var labelVar = xAxisHead;
		var varNames = d3.keys(data[0]).filter(function (key) { return key !== labelVar;}).sort();;
		color.domain(varNames);

		var seriesData = varNames.map(function (name) {
		  return {
			name: name,
			values: data.map(function (d) {
			  return {name: name, label: d[labelVar], value: +d[name]};
			})
		  };
		});

		x.domain(data.map(function (d) { return d[labelVar]; }).sort());
		y.domain([yscale,
		  
		  (d3.max(seriesData, function (c) { 
			return d3.max(c.values, function (d) { return d.value; });
		  }))+10
		]);


		var chart_element = svg.append("g")
							.attr("class","chart_area")
							.attr("transform", "translate(" + margin.left + " ," + margin.left +")")
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
		/*chart_element.append("g")
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
		*/
		// Add the X Axis
		chart_element.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")	
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-65)" 
                });
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
			
		//Create lines and circle point 
		var series = chart_element.selectAll(".series")
						.data(seriesData)
						.enter().append("g")
						.attr("class", "series")
						.attr("class", function(d, i) { return 'colors_'+i});
		
		series.append("path")
			.attr("class", "line")
			.attr("class", function(d, i) { return 'colors_'+i+' class_'+getCleanedClassname(d.name);})
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
			.attr("class", function(d,i) { return 'color_plot class_'+getCleanedClassname(d.name);})
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
					
			
			createLegends(svg, varNames, color_code_legends, color);
			function createLegends(svg, varNames, color_code_legends, color) {

				var legend = svg.append("g")
						.attr("class","legend_grp")
											
						.selectAll(".legend")
						.data(varNames)
						.enter().append("g")
						.attr("class", "legend")
						.style("border","1px solid #000");
						//.attr("transform", function(d, i) {return "translate(" + i * 110 + ",-25)"; })
				legend.append("rect")
					.attr("class", function(d) { return 'class_'+getCleanedClassname(d);})
					.attr("x", 10)
					.attr("y", function(d, i){ return ( (i*ls_h) + (4*ls_h) + (20*i)) })
					.attr("rx",5)
							.attr("ry",100)
							.attr("width",25)
							.attr("height",10)
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
                      filterGraph(getCleanedClassname(d), lVisibility);
					});
					 
				legend.append("text")
					.attr("class", function(d) { return 'classleg_'+getCleanedClassname(d);})
					.attr("x", 60)
					.attr("y", function(d, i){ return ((i*ls_h) + (4*ls_h) + (20*i)+10 ) })
					.style("font-size","12px")
					.style("opacity", 1)
					.text(function (d) { return getCleanedLegendname(d); })
					.on("click", function (d, i) {
                      var lVisibility = this.style.opacity 
                      filterGraph(getCleanedClassname(d), lVisibility);
					});
					
				legend.append("line")
					.attr("x1", 10)
					.attr("y1", function(d, i){ return ( (i*ls_h) + (4*ls_h) + (20*i) +20) })
					.attr("x2", 200)
					.attr("y2", function(d, i){ return ( (i*ls_h) + (4*ls_h) + (20*i) +20) })
					.style("stroke","#DADADA")
					.style("stroke-width","1px")
					.style("shape-rendering","crispEdges");
					
					reSizeSvgElements();
			}
					
					
		//remove popoup  
		function removePopovers () {
		  $('.popover').each(function() {
			$(this).remove();
		  }); 
		}
		//Show popup
		function showPopover (d) {
		  $(this).popover({
			title: d.name,
			placement: 'auto top',
			container: 'body',
			trigger: 'manual',
			html : true,
			content: function() { 
			  return col1Head+": " + d.label + 
					 "<br/>"+col2Head+": " + d3.format(",")(d.value !=='' ? d.value: d.y1 - d.y0); }
		  });
		  $(this).popover('show')
		}
	});
}


/*Creates Line graph with grid Specific for seatshare and voteshare 
	Sample Data format: 
		year  party  seats/ votes
		1990  BJP     20
		1990  INC      7
	
	parameters:
	width = width of the svg area
	height = height of the svg area
	path = api path for json data
	gSeqNo = to differentiate the maps/graphs. if gSeqNo=2, then the div enclosing svg will have id="graph_area2"
	mheading = mainheading for the maps/graph(line 1 in title)
	sheading = sub heading for the maps/graph(line 2 in title)
	xAxishead = Value from JSON that is to be mapped for xaxis
	col1Head = xaxis label
	col2Head = yaxis label
	yscale = to spicify starting value for yaxis
	shares_name = 'seats' for seatshare and 'votes' for Voteshare
*/
function createPartyGridLineGraph(width, height,path,gSeqNo, mheading, sheading, xAxisHead, col1Head, col2Head,yscale, shares_name) {
	
	var margin = {top: 15, right: 0, bottom: 35, left:55};
	var divid = create_draw_area(gSeqNo,mheading,sheading);
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

	  // create color range
	var color = d3.scale.category10();
	
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
		
		if(data.length == 0) {
			svg.append("g")
			.attr("class","chart_area")
			.attr("transform", "translate(" + (margin.left) + "," +(100 ) + ")")
			.append("text").text("No Data Available"); 
			return false;
		}
		var labelVar = xAxisHead;
		var varNames  = [];
		data.forEach(function(d) { 		
			if(varNames.indexOf(d['party']) == -1){
				varNames.push(d['party']);
			}
		});
		
		varNames = varNames.sort();
		var seriesData = varNames.map(function (name) {
		  return {
			name: name,
			values: data.filter(function (d) {
				if(name == d['party']) {
					return true;
				} else {
					return false;
				}
			}).map(function (d) {
				return {name: name, label: d[labelVar], value: d[shares_name]};
			})
		  };
		});
		x.domain(data.map(function (d) { return d[labelVar]; }).sort());
		y.domain([yscale,
		  
		  (d3.max(seriesData, function (c) { 
			return d3.max(c.values, function (d) { return d.value; });
		  }))+10
		]);


		var chart_element = svg.append("g")
							.attr("class","chart_area")
							.attr("transform", "translate(" + margin.left + " ," + margin.left +")")
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
		/*chart_element.append("g")
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
*/
// Add the X Axis
		chart_element.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")	
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-65)" 
                });
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
			
		//Create lines and circle point 
		var series = chart_element.selectAll(".series")
						.data(seriesData)
						.enter().append("g")
						.attr("class", "series")
						.attr("class", function(d, i) { return 'colors_'+i});
		
		series.append("path")
			.attr("class", "line")
			.attr("class", function(d, i) { return 'colors_'+i+' class_'+getCleanedClassname(d.name);})
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
			.attr("class", function(d,i) { return 'color_plot class_'+getCleanedClassname(d.name);})
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
				
				
			createLegends(svg, varNames, color_code_legends, color);
			function createLegends(svg, varNames, color_code_legends, color) {
				d3.select(".legend_grp").remove()
				var ls_w = 20, ls_h = 15;
					
				var legend = svg.append("g")
						.attr("class","legend_grp")
											
						.selectAll(".legend")
						.data(varNames)
						.enter().append("g")
						.attr("class", "legend")
						.style("border","1px solid #000");
						//.attr("transform", function(d, i) {return "translate(" + i * 110 + ",-25)"; })
				legend.append("rect")
					.attr("class", function(d) { return 'class_'+getCleanedClassname(d);})
					.attr("x", 10)
					.attr("y", function(d, i){ return ( (i*ls_h) + (4*ls_h) + (20*i)) })
					.attr("rx",5)
							.attr("ry",100)
							.attr("width",25)
							.attr("height",10)
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
                      filterGraph(getCleanedClassname(d), lVisibility);
					});
					 
				legend.append("text")
					.attr("class", function(d) { return 'classleg_'+getCleanedClassname(d);})
					.attr("x", 60)
					.attr("y", function(d, i){ return ((i*ls_h) + (4*ls_h) + (20*i)+10 ) })
					.style("font-size","12px")
					.style("opacity", 1)
					.text(function (d) { return getCleanedLegendname(d); })
					.on("click", function (d, i) {
                      var lVisibility = this.style.opacity 
                      filterGraph(getCleanedClassname(d), lVisibility);
					});
					
				legend.append("line")
					.attr("x1", 10)
					.attr("y1", function(d, i){ return ( (i*ls_h) + (4*ls_h) + (20*i) +20) })
					.attr("x2", 200)
					.attr("y2", function(d, i){ return ( (i*ls_h) + (4*ls_h) + (20*i) +20) })
					.style("stroke","#DADADA")
					.style("stroke-width","1px")
					.style("shape-rendering","crispEdges");					
					
					reSizeSvgElements();
			}
					
					
		//remove popoup  
		function removePopovers () {
		  $('.popover').each(function() {
			$(this).remove();
		  }); 
		}
		//Show popup
		function showPopover (d) {
		  $(this).popover({
			title: d.name,
			placement: 'auto top',
			container: 'body',
			trigger: 'manual',
			html : true,
			content: function() { 
			  return col1Head+": " + d.label + 
					 "<br/>"+col2Head+": " + d3.format(",")(d.value !==''? d.value: d.y1 - d.y0); }
		  });
		  $(this).popover('show')
		}
	});
}

/*Creates Grouped bar graph 
	parameters:
	width = width of the svg area
	height = height of the svg area
	path = api path for json data
	gSeqNo = to differentiate the maps/graphs. if gSeqNo=2, then the div enclosing svg will have id="graph_area2"
	mheading = mainheading for the maps/graph(line 1 in title)
	sheading = sub heading for the maps/graph(line 2 in title)
	xAxishead = Value from JSON that is to be mapped for xaxis
	col1Head = xaxis label
	col2Head = yaxis label
*/
function createGroupedBarGraph(width, height,path,gSeqNo, mheading, sheading, xAxisHead, col1Head, col2Head) {
	
	var margin = {top: 15, right: 0, bottom: 35, left:55};
	var divid = create_draw_area(gSeqNo,mheading,sheading);
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


	
	d3.json(path, function(error, data) {
		if(data.length == 0) {
			svg.append("g")
			.attr("class","chart_area")
			.attr("transform", "translate(" + (margin.left) + "," +(100 ) + ")")
			.append("text").text("No Data Available"); 
			return false;
		}
		if (error) throw error;
		var labelVar = xAxisHead;
		var ageNames = d3.keys(data[0]).filter(function(key) { return (key !== labelVar && key !== 'id'); });

		ageNames = ageNames.sort();
		data.forEach(function(d) {
			d.ages = ageNames.map(function(name) { return {name: name, value: +d[name]}; });
		});

		x0.domain(data.map(function(d) { return d[labelVar]; }).sort());
		x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
		y.domain([0, (d3.max(data, function(d) { return d3.max(d.ages, function(d) { return d.value; }); }))+10]);

		var chart_element = svg.append("g")
							.attr("class","chart_area")
							//.attr("transform", "translate()");
		/*chart_element.append("g")
			.attr("class", "x axis")
			.style("font-size", "12px")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
			.append("text")
			.attr("y", 30)
			.attr("x", (width/2)-50)
			.attr("dy", ".71em")
			.style("text-anchor", "start")
			.text(col1Head);*/
		// Add the X Axis
		chart_element.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
			.selectAll("text")	
				.style("text-anchor", "end")
				.attr("dx", "-.8em")
				.attr("dy", ".15em")
				.attr("transform", function(d) {
					return "rotate(-65)" 
					});

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
			.attr("class", function(d, i) { 
					return 'colors_'+i+' class_'+getCleanedClassname(d.name);
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
					
			createLegends(svg, ageNames, color_code_legends, color);					
		
			function createLegends(svg, ageNames, color_code_legends, color) {
				d3.select(".legend_grp").remove()
				var ls_w = 20, ls_h = 15;
					
				var legend = svg.append("g")
						.attr("class","legend_grp")
											
						.selectAll(".legend")
						.data(ageNames)
						.enter().append("g")
						.attr("class", "legend")
						.style("border","1px solid #000");
						//.attr("transform", function(d, i) {return "translate(" + i * 110 + ",-25)"; })
				legend.append("rect")
					.attr("class", function(d) { return 'legend_'+getCleanedClassname(d);})
					.attr("x", 10)
					.attr("y", function(d, i){ return ( (i*ls_h) + (4*ls_h) + (20*i)) })
					.attr("rx",5)
							.attr("ry",100)
							.attr("width",25)
							.attr("height",10)
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
                      filterGraph(getCleanedClassname(d), lVisibility);
					});
					 
				legend.append("text")
					.attr("class", function(d) { return 'classleg_'+getCleanedClassname(d);})
					.attr("x", 60)
					.attr("y", function(d, i){ return ((i*ls_h) + (4*ls_h) + (20*i)+10 ) })
					.style("font-size","12px")
					.style("opacity", 1)
					.text(function (d) { return getCleanedLegendname(d); })
					.on("click", function (d, i) {
                      var lVisibility = this.style.opacity 
                      filterGraph(getCleanedClassname(d), lVisibility);
					});
					
				legend.append("line")
					.attr("x1", 10)
					.attr("y1", function(d, i){ return ( (i*ls_h) + (4*ls_h) + (20*i) +20) })
					.attr("x2", 200)
					.attr("y2", function(d, i){ return ( (i*ls_h) + (4*ls_h) + (20*i) +20) })
					.style("stroke","#DADADA")
					.style("stroke-width","1px")
					.style("shape-rendering","crispEdges");
										
					reSizeSvgElements();
			}
		//remove popoup 			
		function removePopovers () {
          $('.popover').each(function() {
            $(this).remove();
          }); 
        }

		//Show popup
        function showPopover (d) {
			$(this).popover({
				title: d.name,
				placement: 'auto top',
				container: 'body',
				trigger: 'manual',
				html : true,
				content: function() { 
				  return "" + d3.format(",")(d.value !=='' ? d.value: d.y1 - d.y0); }
				});
			$(this).popover('show')
        }
	});
}

/* Section:2 Maps */
/*Creates Maps based on the given col2Head value and given legend_values range  
	parameters:
	width = width of the svg area
	height = height of the svg area
	topoJsonpath = geojson file path for map plotting
	csvPath = api path for JSON data
	mheading = mainheading for the maps/graph(line 1 in title)
	sheading = sub heading for the maps/graph(line 2 in title)
	col1Head = Constituency number (field name) from json data
	col2Head = field for  which the data to be displayed from json data
	mappingColumn = common variable that is used to map between json data and geojson data
	legend_values = values that needs to be in legends eg: [20,30,40,50]
	legend_unit = unit for legend eg: %
*/


 
function createMapsRanges(width, height,topoJsonpath, csvPath, gSeqNo, mheading, sheading, col1Head, col2Head, usercolor, mappingColumn, legend_values, legend_unit) {

	var margin = {top: 15, right: 15, bottom: 15, left: 15};
	var divid = create_draw_area(gSeqNo,mheading,sheading);
	var svg = create_svg(divid,width, height);
	createMapTitle(svg, width, height, margin, mheading, sheading);
	
	width  = width - margin.left - margin.right,
	height = height  - margin.top  - margin.bottom;
	
	var color_domain = legend_values;
	var legend_ranges = getLegendRanges(color_domain,legend_unit)
	var ext_color_domain = legend_ranges[0];
	var legend_labels = legend_ranges[1];
//usercolor = '#004E94';
	var rateById = {};
	var c = d3.rgb(usercolor);
	var minimumColor = c.brighter().toString();
	var new_domain = ''
	if(usercolor == '#393b79') {
		//var minimumColor = "#BFD3E6", usercolor = "#88419D";
		var minimum = 20, maximum = 74;
		var minimumColor = "#BFD3E6"
		var new_domain = [minimum,maximum];
	} else {
		var new_domain = color_domain;
	}
	

	var color = d3.scale.linear().domain(new_domain).range([minimumColor, usercolor]);

	var topoObject = topoJsonpath.split('\\').pop().split('/').pop().split('.')[0];

	$.getJSON(csvPath, function(data) {
       
		data.forEach(function(d) { 
			rateById[d[col1Head]] = d; 
		});
		
		d3.json(topoJsonpath, function(error, mdata) {
		//if (error) throw error;

			var center_scale = getMapCenterScale(mdata.objects[topoObject].bbox, width, height);
			
			//var new_height = height- title_area.y;
			var new_height = height;
			projection
			.translate([width / 2, new_height / 2])
			.center(center_scale[0])
			.scale(center_scale[1]);

			svg.append("g")
			.attr('class','chart_area')
			.attr("transform", "translate(" + margin.left + "," +(margin.top + 10) + ")")
			.selectAll("path")
			.data(topojson.feature(mdata, mdata.objects[topoObject]).features)
			.enter().append("path")
			.style ( "fill" , '#D0D0D0')
			.style("stroke-width","1px")
			.style("stroke","#fff")
			.attr("d", path)
		
			svg.append("g")				
			.attr("transform", "translate(" + margin.left + "," +(margin.top + 10) + ")")
			.attr("class", "chart_area")
			
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
			.style("stroke","#fff")
			.style("stroke-width","1px")
			.style("opacity", 1)
			.attr("d", path)			
			.on("mouseover", function (d) { showPopover.call(this,d); })
			.on("click", function (d) { showPopover.call(this, d); })
			.on("mouseout",  function (d) { removePopovers(); })
						
			createLegends(svg, ext_color_domain, legend_labels, color);
				
			function createLegends(svg, ext_color_domain, legend_labels, color) {
				d3.select(".legend_grp").remove()
				var ls_w = 20, ls_h = 15;
					//console.log(legend_labels);
				var legend = svg.append("g")
						.attr("class","legend_grp")
											
						.selectAll(".legend")
						.data(ext_color_domain)
						.enter().append("g")
						.attr("class", "legend")
						.style("border","1px solid #000");
						//.attr("transform", function(d, i) {return "translate(" + i * 110 + ",-25)"; })
				legend.append("rect")
					.attr("class", function(d) { return 'legend_'+getCleanedClassname(d);})
					.attr("x", 10)
					.attr("y", function(d, i){ return ( (i*ls_h) + (4*ls_h) + (20*i)) })
					.attr("rx",5)
							.attr("ry",100)
							.attr("width",25)
							.attr("height",10)
					.style("fill",function(d){
							return color(d);
					})
					
				legend.append("text")
					.attr("class", function(d) { return 'classleg_'+getCleanedClassname(d);})
					.attr("x", 60)
					.attr("y", function(d, i){ return ((i*ls_h) + (4*ls_h) + (20*i)+10 ) })
					.style("font-size","12px")
					.style("opacity", 1)
					.text(function(d, i){ return getCleanedLegendname(legend_labels[i]); });
					
				legend.append("line")
					.attr("x1", 10)
					.attr("y1", function(d, i){ return ( (i*ls_h) + (4*ls_h) + (20*i) +20) })
					.attr("x2", 200)
					.attr("y2", function(d, i){ return ( (i*ls_h) + (4*ls_h) + (20*i) +20) })
					.style("stroke","#DADADA")
					.style("stroke-width","1px")
					.style("shape-rendering","crispEdges");
					
					reSizeSvgElements('maps');
			}				
				
			
				function getClassNameForTurnout(d) {
					//d = 0.0556; 0,1,3,5           <1
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
						for(var i=1;i<ext_color_domain.length-1;i++){
							if((new_d) >= parseInt(ext_color_domain[i]) && new_d <= parseInt(ext_color_domain[i+1])) {
								return ext_color_domain[i];
							}
						}
					}
					
				}
					
				//remove popoup 	
				function removePopovers () {
				  $('.popover').each(function() {
					$(this).remove();
				  }); 
				}

				//Show popup
				function showPopover (d) {
				  $(this).popover({
					title: d.name,
					placement: 'auto top',
					container: 'body',
					trigger: 'manual',
					html : true,
					content: function() { 
						return getPopupDetails(rateById[d.properties[mappingColumn]]);
					}
				  });
				  $(this).popover('show')
				}
				
				//bind download svg link to the download button on sidepanel
				d3.select("#download")
				.on("mouseover", writeDownloadLink);
			
		});
	});
	//alert('map3');
}
 
 
/* Section:2 Maps */
/*Creates Maps for the winners   
	parameters:
	width = width of the svg area
	height = height of the svg area
	topoJsonpath = geojson file path for map plotting
	csvPath = api path for JSON data
	mheading = mainheading for the maps/graph(line 1 in title)
	sheading = sub heading for the maps/graph(line 2 in title)
	col1Head = Constituency number (field name) from json data
	col2Head = field for  which the data to be displayed from json data
	mappingColumn = common variable that is used to map between json data and geojson data
*/
function createMapsWinners(width, height,topoJsonpath, csvPath, partiesPath, gSeqNo, mheading, sheading, col1Head, col2Head, usercolor, mappingColumn) {
	
	var margin = {top: 15, right: 15, bottom: 15, left: 15};
	var divid = create_draw_area(gSeqNo,mheading,sheading);
	var svg = create_svg(divid,width, height);
	createMapTitle(svg, width, height, margin, mheading, sheading);
	
	width  = width - margin.left - margin.right,
	height = height  - margin.top  - margin.bottom;
	
	
	var topoObject = topoJsonpath.split('\\').pop().split('/').pop().split('.')[0];
	
	var rateById = {};
	var color = d3.map();

	var legend_labels=[], other_parties=[];
	var count_labels ={};
					
	$.getJSON(partiesPath, function(data) {
       
		data.forEach(function(d) {
				legend_labels.push(d['party1']);
				count_labels[d['party1']] = d['count'];
		});
		//console.log(legend_labels);
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
		legend_labels = legend_labels.sort();
		legend_labels.push('Others');
		
		
		//console.log(count_labels);
		/*other_parties = other_parties.join("<br />");
		var tooltip = d3.select("body")
					.append("div")
					.attr("class","legendtooltip")
					.style("position", "absolute")
					.style("z-index", "10")
					.style("visibility", "hidden")
					.html(other_parties);*/
					
		var color = d3.scale.category10().domain(legend_labels);

		d3.json(topoJsonpath, function(error, mdata) {
			var center_scale = getMapCenterScale(mdata.objects[topoObject].bbox,width, height);
			var new_height = height;
			projection
			.translate([width / 2, new_height / 2])
			.center(center_scale[0])
			.scale(center_scale[1]);

			svg.append("g")	
				.attr('class','chart_area')
				.attr("transform", "translate(" + margin.left + "," +(margin.top + 10) + ")")
				.selectAll("path")
				.data(topojson.feature(mdata, mdata.objects[topoObject]).features)
				.enter().append("path")
				.style ( "fill" , '#D0D0D0')
				.style("stroke-width","1px")
				.style("stroke","#fff")
				.attr("d", path)
				
			svg.append("g")		
				.attr('class','chart_area')
				.attr("transform", "translate(" + margin.left + "," +(margin.top + 10) + ")")
				.selectAll("path")
				.data(topojson.feature(mdata, mdata.objects[topoObject]).features)
				.enter().append("path")
				.attr("class", function(d) { 
					if(rateById[d.properties[mappingColumn]] !== undefined) {
						if(legend_labels.indexOf(rateById[d.properties[mappingColumn]][col2Head]) == -1) {
								return 'class_Others';
						} else {
							return 'class_'+getCleanedClassname(rateById[d.properties[mappingColumn]][col2Head]);
						}
					}
				})
				.style("stroke","#fff")
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

				
			createLegends(svg, legend_labels, color_codes, color);
			
			
			function createLegends(svg, legend_labels, color_codes, color) {
				d3.select(".legend_grp").remove()
				var ls_w = 20, ls_h = 15;
					
				var legend = svg.append("g")
						.attr("class","legend_grp")
											
						.selectAll(".legend")
						.data(legend_labels)
						.enter().append("g")
						.attr("class", "legend")
						.style("border","1px solid #000");
						//.attr("transform", function(d, i) {return "translate(" + i * 110 + ",-25)"; })
				legend.append("rect")
					.attr("class", function(d) { return 'legend_'+getCleanedClassname(d);})
					.attr("x", 10)
					.attr("y", function(d, i){ return ( (i*ls_h) + (4*ls_h) + (20*i)) })
					.attr("rx",5)
							.attr("ry",100)
							.attr("width",25)
							.attr("height",10)
					.style("fill",function(d, i) { 
									if(legend_labels.indexOf(d) == -1) {
										return color('Others');
									} else {
										if(color_codes.get(d)) {
											return color_codes.get(d);
										} else {
											return color(d);
										}
									}});
					
				legend.append("text")
					.attr("class", function(d) { return 'classleg_'+getCleanedClassname(d);})
					.attr("x", 60)
					.attr("y", function(d, i){ return ((i*ls_h) + (4*ls_h) + (20*i)+10 ) })
					.style("font-size","12px")
					.style("opacity", 1)
					.text(function(d, i){ return getCleanedLegendname(legend_labels[i]); });
					
				legend.append("line")
					.attr("x1", 10)
					.attr("y1", function(d, i){ return ( (i*ls_h) + (4*ls_h) + (20*i) +20) })
					.attr("x2", 200)
					.attr("y2", function(d, i){ return ( (i*ls_h) + (4*ls_h) + (20*i) +20) })
					.style("stroke","#DADADA")
					.style("stroke-width","1px")
					.style("shape-rendering","crispEdges");					
					
					reSizeSvgElements('maps');
			}
			
				
			//remove popoup 
			function removePopovers () {
			  $('.popover').each(function() {
				$(this).remove();
			  }); 
			}

			//Show popup
			function showPopover (d) {
			  $(this).popover({
				title: d.name,
				placement: 'auto top',
				container: 'body',
				trigger: 'manual',
				html : true,
				content: function() { 
					return getPopupDetails(rateById[d.properties[mappingColumn]]);
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
					return getPopupDetails(rateById[d.properties[mappingColumn]]);
				}
			  });
			  $(this).popover('show')
			}

		});
		
	});
	
}


/*Creates Category maps 
	parameters:
	width = width of the svg area
	height = height of the svg area
	topoJsonpath = geojson file path for map plotting
	csvPath = api path for JSON data
	mheading = mainheading for the maps/graph(line 1 in title)
	sheading = sub heading for the maps/graph(line 2 in title)
	col1Head = Constituency number (field name) from json data
	col2Head = field for  which the data to be displayed from json data
	mappingColumn = common variable that is used to map between json data and geojson data
*/
function createMapsCategory(width, height,topoJsonpath, csvPath, gSeqNo, mheading, sheading, col1Head, col2Head, mappingColumn) {
	
	var margin = {top: 15, right: 15, bottom: 15, left: 15};
	var divid = create_draw_area(gSeqNo,mheading,sheading);
	var svg = create_svg(divid,width, height);
	createMapTitle(svg, width, height, margin, mheading, sheading);
	
	width  = width - margin.left - margin.right,
	height = height  - margin.top  - margin.bottom;
	
	var topoObject = topoJsonpath.split('\\').pop().split('/').pop().split('.')[0];
	var  newOpacity ='';
	
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

		legend_labels = legend_labels.sort();
		var color = d3.scale.category10().domain(legend_labels);

	//function ready(error, mdata) {
	//	if (error) throw error;
	
		d3.json(topoJsonpath, function(error, mdata) {
			var center_scale = getMapCenterScale(mdata.objects[topoObject].bbox,width, height);

			var new_height = height;
			projection
			.translate([width / 2, new_height / 2])
			.center(center_scale[0])
			.scale(center_scale[1]);
			
			svg.append("g")				
				.attr('class','chart_area')
				.attr("transform", "translate(" + margin.left + "," +(margin.top + 10) + ")")
				.selectAll("path")
				.data(topojson.feature(mdata, mdata.objects[topoObject]).features)
				.enter().append("path")
				.style ( "fill" , '#D0D0D0')
				.style("stroke-width","1px")
				.style("stroke","#fff")
				.attr("d", path)
				
			svg.append("g")				
				.attr('class','chart_area')
				.attr("transform", "translate(" + margin.left + "," +(margin.top + 10) + ")")
				.selectAll("path")
				.data(topojson.feature(mdata, mdata.objects[topoObject]).features)
				.enter().append("path")
				.attr("class", function(d) { 
					if(rateById[d.properties[mappingColumn]] !== undefined) {
						return 'class_'+getCleanedClassname(rateById[d.properties[mappingColumn]][col2Head]);
					}
				})
				.style("stroke","#fff")
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
				.on("mouseout",  function (d) { removePopovers(); 
				})

				createLegends(svg, legend_labels, color_code_legends, color);
			
			
			function createLegends(svg, legend_labels, color_code_legends, color) {
				d3.select(".legend_grp").remove()
				var ls_w = 20, ls_h = 15;

				var legend = svg.append("g")
						.attr("class","legend_grp")											
						.selectAll(".legend")
						.data(legend_labels)
						.enter().append("g")
						.attr("class", "legend")
						.style("border","1px solid #000");
						//.attr("transform", function(d, i) {return "translate(" + i * 110 + ",-25)"; })
				legend.append("rect")
					.attr("class", function(d) { return 'legend_'+getCleanedClassname(d);})
					.attr("x", 10)
					.attr("y", function(d, i){ return ( (i*ls_h) + (4*ls_h) + (20*i)) })
					.attr("rx",5)
							.attr("ry",100)
							.attr("width",25)
							.attr("height",10)
					.style("fill",function(d, i) { 
									if(legend_labels.indexOf(d) == -1) {
										return color('Others');
									} else {
										if(color_code_legends[0][d]) {
											return color_code_legends[0][d];
										} else {
											return color(d);
										}
									}});
					
				legend.append("text")
					.attr("class", function(d) { return 'classleg_'+getCleanedClassname(d);})
					.attr("x", 60)
					.attr("y", function(d, i){ return ((i*ls_h) + (4*ls_h) + (20*i)+10 ) })
					.style("font-size","12px")
					.style("opacity", 1)
					.text(function(d, i){ return getCleanedLegendname(legend_labels[i]); });
					
				legend.append("line")
					.attr("x1", 10)
					.attr("y1", function(d, i){ return ( (i*ls_h) + (4*ls_h) + (20*i) +20) })
					.attr("x2", 200)
					.attr("y2", function(d, i){ return ( (i*ls_h) + (4*ls_h) + (20*i) +20) })
					.style("stroke","#DADADA")
					.style("stroke-width","1px")
					.style("shape-rendering","crispEdges");
					
					reSizeSvgElements('maps');
			}

			//remove popoup 
			function removePopovers () {
			  $('.popover').each(function() {
				$(this).remove();
			  }); 
			}

			//Show popup
			function showPopover (d) {
			  $(this).popover({
				title: d.name,
				placement: 'auto top',
				container: 'body',
				trigger: 'manual',
				html : true,
				content: function() { 
					return getPopupDetails(rateById[d.properties[mappingColumn]]);
				}
			  });
			  $(this).popover('show')
			}

		});	
	});
}

/*Creates Cadidate position plot
	parameters:
	width = width of the svg area
	height = height of the svg area
	topoJsonpath = geojson file path for map plotting
	csvPath = api path for JSON data
	mheading = mainheading for the maps/graph(line 1 in title)
	sheading = sub heading for the maps/graph(line 2 in title)
	col1Head = Constituency number (field name) from json data
	col2Head = field for  which the data to be displayed from json data
	mappingColumn = common variable that is used to map between json data and geojson data
*/
function createMapsPositions(width, height,topoJsonpath, csvPath, gSeqNo, mheading, sheading, col1Head, col2Head, usercolor, mappingColumn) {
	
	var margin = {top: 15, right: 15, bottom: 15, left: 15};
	var divid = create_draw_area(gSeqNo,mheading,sheading);
	var svg = create_svg(divid,width, height);
	createMapTitle(svg, width, height, margin, mheading, sheading);
	
	width  = width - margin.left - margin.right,
	height = height  - margin.top  - margin.bottom;
	var topoObject = topoJsonpath.split('\\').pop().split('/').pop().split('.')[0];
	
	var color_domain = [1,2,3];
	var ext_color_domain = [0,1,2,3];
	var legend_labels = ["1", "2", "3", ">3"];
	
	var rateById = {};
	var color = d3.map();

	$.getJSON(csvPath, function(data) {
       //console.log(csvPath);
		data.forEach(function(d) { 
			rateById[d[col1Head]] = d; 
		});
		var c = d3.rgb(usercolor);
		var minimumColor = c.brighter().toString();
		
		var color = d3.scale.linear().domain(legend_labels).range([minimumColor, usercolor]);

		d3.json(topoJsonpath, function(error, mdata) {
			var center_scale = getMapCenterScale(mdata.objects[topoObject].bbox,width, height);
			var new_height = height;
			projection
			.translate([width / 2, new_height / 2])
			.center(center_scale[0])
			.scale(center_scale[1]);
			
			svg.append("g")				
				.attr('class','chart_area')
				.attr("transform", "translate(" + margin.left + "," +(margin.top + 10) + ")")
				.selectAll("path")
				.data(topojson.feature(mdata, mdata.objects[topoObject]).features)
				.enter().append("path")
				.style ( "fill" , '#D0D0D0')
				.style("stroke-width","1px")
				.style("stroke","#fff")
				.attr("d", path)
				
			svg.append("g")				
				.attr('class','chart_area')
				.attr("transform", "translate(" + margin.left + "," +(margin.top + 10) + ")")
				.selectAll("path")
				.data(topojson.feature(mdata, mdata.objects[topoObject]).features)
				.enter().append("path")
				.attr("class", function(d) { 
					if(rateById[d.properties[mappingColumn]] !== undefined) {
						return 'class_'+getClassNameForTurnout(rateById[d.properties[mappingColumn]][col2Head]);
					}
				})
				.style("stroke","#ffffff")
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
				
			
				createLegends(svg, ext_color_domain, legend_labels, color);
				
			function createLegends(svg, ext_color_domain, legend_labels, color) {
				d3.select(".legend_grp").remove()
				var ls_w = 20, ls_h = 15;
				
				var legend = svg.append("g")
						.attr("class","legend_grp")
											
						.selectAll(".legend")
						.data(ext_color_domain)
						.enter().append("g")
						.attr("class", "legend")
						.style("border","1px solid #000");

				legend.append("rect")
					.attr("class", function(d) { return 'legend_'+getCleanedClassname(d);})
					.attr("x", 10)
					.attr("y", function(d, i){ return ( (i*ls_h) + (4*ls_h) + (20*i)) })
					.attr("rx",5)
					.attr("ry",100)
							.attr("width",25)
							.attr("height",10)
					.style("fill",function(d){
							return color(d);
					})
					
				legend.append("text")
					.attr("class", function(d) { return 'classleg_'+getCleanedClassname(d);})
					.attr("x", 60)
					.attr("y", function(d, i){ return ((i*ls_h) + (4*ls_h) + (20*i)+10 ) })
					.style("font-size","12px")
					.style("opacity", 1)
					.text(function(d, i){ return getCleanedLegendname(legend_labels[i]); });
					
				legend.append("line")
					.attr("x1", 10)
					.attr("y1", function(d, i){ return ( (i*ls_h) + (4*ls_h) + (20*i) +20) })
					.attr("x2", 200)
					.attr("y2", function(d, i){ return ( (i*ls_h) + (4*ls_h) + (20*i) +20) })
					.style("stroke","#DADADA")
					.style("stroke-width","1px")
					.style("shape-rendering","crispEdges");
					
					reSizeSvgElements('maps');
			}
			
		
			function getClassNameForTurnout(d) {
				var new_d = d;
				if(new_d> ext_color_domain[ext_color_domain.length-1]){
					return ext_color_domain[ext_color_domain.length-1];
				} else {
					return d-1;
				}
				
			}
			//remove popoup 
			function removePopovers () {
			  $('.popover').each(function() {
				$(this).remove();
			  }); 
			}

			//Show popup
			function showPopover (d) {
			  $(this).popover({
				title: d.name,
				placement: 'auto top',
				container: 'body',
				trigger: 'manual',
				html : true,
				content: function() { 
					return getPopupDetails(rateById[d.properties[mappingColumn]]);
				}
			  });
			  $(this).popover('show')
			}
		});
	});
}
