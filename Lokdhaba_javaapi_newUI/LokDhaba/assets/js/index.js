	//api path for json data
	var api_root_path = 'http://localhost:8080/tcpd_ga_new/';
	
	$(function(){
		
		function mapDataFromSearchToResult(element_id, data_value) {
			//$("#year").html('');
			console.log()
			console.log($("#"+element_id ).html());
			$('#'+element_id).removeClass('js-dropdown-active').prev().html($("#"+element_id +" li[data-value ='"+data_value+"'] a").text());	
			$('#'+element_id +' li').removeClass('selected');
			//$(this).parent().addClass('selected');
			
			$("#"+element_id +" li[data-value ='"+data_value+"']").addClass('selected');

		}
	
		function getListForVariables(viz, elect_type) {
		//console.log(viz+','+elect_type);
			if((viz == 'Charts/Graphs' || viz =='charts') && elect_type == 'AE') {
				var html ='';
				html += "<li data-value='voter_turnout'><a href=''>Voter Turnout</a></li>";
				html += "<li data-value='parties_contesting'><a href=''>Total Contested and Represented Parties</a></li>";
				html += "<li data-value='seatshare'><a href=''>Seat Share Party-wise</a></li>";
				html += "<li data-value='voteshare'><a href=''>Vote Share Party-wise</a></li>";
				html += "<li data-value='contested_deposit_lost'><a href=''>Total Contested and Deposits Saved</a></li>";
				html += "<li data-value='women'><a href=''>Gender-wise Winners and Candidates</a></li>";


				
			} else if((viz == 'Maps' || viz =='maps') && elect_type == 'AE') {
				/*$(".ae_graph_chart_select").hide();
				$(".ge_graph_chart_select").hide();
				$(".ae_map_select").show();
				
				dropdownUpdate('ae_map_select');
				$(".ge_map_select").hide();
				//$(".default_select").hide();*/
				var html ='';
				html += "<li data-value='gender'><a href='#'>Gender-wise Winners</a></li>";
				html += "<li class='parties' data-value='vote_share'><a href='#'>Party-wise Voteshares</a></li>";
				html += "<li class='parties' data-value='position'><a href='#'>Party-wise Positions</a></li>";
				html += "<li data-value='candidates'><a href='#'>Total candidates in each constituency</a></li>";
				html += "<li data-value='Turnout'><a href='#'>Voter Turnout</a></li>";
				html += "<li data-value='Electors'><a href='#'>Total Electors</a></li>";
				html += "<li data-value='nota'><a href='#'>NOTA</a></li>";
				html += "<li data-value='margin_victory'><a href='#'>Victory Margin</a></li>";
				html += "<li data-value='community'><a href='#'>Constituency type wise Winners</a></li>";
				html += "<li data-value='religion'><a href='#'>Religion-wise Winners</a></li>";
				html += "<li data-value='winners'><a href='#'>Party-wise Winners</a></li>";
				
			} else if((viz == 'Maps' || viz =='maps') && elect_type == 'GE') {
				/*$(".ae_graph_chart_select").hide();
				$(".ge_graph_chart_select").hide();
				$(".ae_map_select").hide();
				$(".ge_map_select").show();
				dropdownUpdate('ge_map_select');
				//$(".default_select").hide();*/
				var html ='';
					html += "<li data-value='winners'><a href='#'>Regional Distribution of Winners</a></li>";
					html += "<li class='parties' data-value='voteshare'><a href='#'>Individual party vote share across constituencies</a></li>";
					html += "<li data-value='turnout'><a href='#'>Turnout across constituencies</a></li>";
				
			} else if((viz == 'Charts/Graphs' || viz =='charts') && elect_type == 'GE') {
				/*$(".ae_graph_chart_select").hide();
				$(".ge_graph_chart_select").show();
				dropdownUpdate('ge_graph_chart_select');
				$(".ae_map_select").hide();
				$(".ge_map_select").hide();
				//$(".default_select").hide();*/
				var html ='';
				html += "<li data-value='voter_turnout'><a href='#'>Voter Turnout</a></li>";
				html += "<li data-value='parties_contesting'><a href='#'>Total Contested and Represented Parties</a></li>";
				html += "<li data-value='seatshare'><a href='#'>Seat Share Party-wise</a></li>";
				html += "<li data-value='voteshare'><a href='#'>Vote Share Party-wise</a></li>";
				html += "<li data-value='contested_deposit_lost'><a href='#'>Total Contested and Deposits Saved</a></li>";
				html += "<li data-value='women'><a href='#'>Gender-wise Winners and Candidates</a></li>";
				
			} else {
				/*$(".ae_graph_chart_select").hide();
				$(".ge_graph_chart_select").hide();
				$(".ae_map_select").hide();
				$(".ge_map_select").hide();
				//$(".default_select").show();*/
				var html ='';
					html += "<li><a href='#'></a></li>";
				$(".results_div").hide();
				$(".parties_td").hide();
			}
			return html;
		}
		
		$("#side_panel").hide();
		$(".state").hide();
		$(".parties_td").hide();
		$(".results_div").hide();
		$(".ge_select").hide();
		//$(".ae_select").hide();
		$("#default_select").show(); 
		//$("#download").hide();
		var party ='';
		var viz_option ='';
		var viz = '';
		var state = '';
		var year = '';
		var years_list = {};
		$.getJSON(api_root_path+'api/ge/year', function(data) {
			//console.log("inside year");
			//$('#year').find('option').remove().end().append('<option value="">Select</option>');
			//var s1 = $("#year");
			var list='';
			$.each(data, function(i, item) {
				//$('<option />', {value: item, text:item}).appendTo(s1);
				list += '<li data-value="'+item+'"><a href="#">'+item+'</a></li>';
			});	
			$("#year").html(list);
			dropdownUpdate('year');
			years_list = data;
			//$(".menu").foundation();
		});
		
		//Load Result.html page with the parameters from search.html
		//Section starts
		var params = getUrlVars();
		if(params['search'] == 1) {
			$('.results_div').show();
			var html = getListForVariables(params['viz'], params['type']);
		
			$('#viz_results').html(html);
			
			//mapDataFromSearchToResult('state', params['state'] );
			//mapDataFromSearchToResult('year', params['year'] );
			mapDataFromSearchToResult('viz_type', params['viz'] );
			mapDataFromSearchToResult('viz_results', params['dis'] );
			$.getJSON(api_root_path+'api/ge/year', function(data) {	
				var list='';
				$.each(data, function(i, item) {
					list += '<li data-value="'+item+'"><a href="#">'+item+'</a></li>';
				});	
				$("#year").html(list);
				mapDataFromSearchToResult('year', params['year'] );
			});
			$("input[name=election-type][value=" + params['type'] + "]").prop('checked', true);
			if(params['type'] == 'GE') {
				$.getJSON(api_root_path+'/api/ge/year', function(data) {
					var list='';
					$.each(data, function(i, item) {
						//$('<option />', {value: item, text:item}).appendTo(s1);
						list += '<li data-value="'+item+'"><a href="#">'+item+'</a></li>';
					});	
					$("#year").html(list);
					mapDataFromSearchToResult('year', params['year'] );
					createmaps('','','');
				});
				$(".state").hide();
			} else {
				$.getJSON(api_root_path+'api/ae/states', function(data) {
					var list='';
					$.each(data, function(i, item) {
						//$('<option />', {value: item, text:item}).appendTo(s1);
						list += '<li data-value="'+item+'"><a href="#">'+item.replace("_"," ")+'</a></li>';
					});	
					$("#state").html(list);
					mapDataFromSearchToResult('state', params['state'] );
					createmaps('','','');
				});
				$(".state").show();
			}
		}
		
		
		$('#state').on('change', function() {
			$.getJSON(api_root_path+'api/ae/year?state='+this.value, function(data) {
				var list='';
				$.each(data, function(i, item) {
					//$('<option />', {value: item, text:item}).appendTo(s1);
					list += '<li data-value="'+item+'"><a href="#">'+item+'</a></li>';
				});	
				$("#year").html(list);
				dropdownUpdate('year');
				years_list = data;	
			});
		});
		
		
		
		$('input[type=radio][name=election-type]').change(function() {
			$('#filtervalued').empty();
			//$('#state').find('option').remove().end().append('<option value="">Select</option>');
			//$('#year').find('option').remove().end().append('<option value="">Select</option>');
			$('#parties').find('option').remove().end().append('<option value="">Select</option>');
			//$("select#state").removeAttr('selected').find('option:first').attr('selected', 'selected');
			//$("select#year").removeAttr('selected').find('option:first').attr('selected', 'selected');
			$("select#viz_type").removeAttr('selected').find('option:first').attr('selected', 'selected');
			$("select[name=viz_options]").removeAttr('selected').find('option:first').attr('selected', 'selected');
			$('.results_div').hide();
			$(".parties_td").hide();
			party ='';
			viz_option ='';
			viz = '';
			state = '';
			year = '';
			
			
			
			
			//$('select[name=viz_options]').hide();
			if(this.value == 'GE') {
				$.getJSON(api_root_path+'/api/ge/year', function(data) {
					var list='';
					$.each(data, function(i, item) {
						//$('<option />', {value: item, text:item}).appendTo(s1);
						list += '<li data-value="'+item+'"><a href="#">'+item+'</a></li>';
					});	
					$("#year").html(list);
					dropdownUpdate('year');
				});
				$(".state").hide();
			} else {
				$.getJSON(api_root_path+'api/ae/states', function(data) {
					var list='';
					$.each(data, function(i, item) {
						//$('<option />', {value: item, text:item}).appendTo(s1);
						list += '<li data-value="'+item+'"><a href="#">'+item.replace("_"," ")+'</a></li>';
					});	
					$("#state").html(list);
					dropdownUpdate('state');
					/*var s1 = $("#state");
					$.each(data, function(i, item) {
						$('<option />', {value: item, text:item.replace("_"," ")}).appendTo(s1);
					});*/
					years_list = data;
				});
				$(".state").show();
			}
		});
		
		$("#viz_type li a").click(function () { 
		//viz = $(this).attr('data-value')text();
		//$('#viz_type').change(function() {
			var elect_type = $("input[name='election-type']:checked").val();
			viz_option = '';
			viz = $(this).text();
			$('.results_div').show();
			var html = getListForVariables(viz, elect_type);
		
			$('#viz_results').html(html);
			dropdownUpdate('viz_results');
		});
		
		$("#viz_results").on('click','li',function () {
			
		//console.log('test');
			party = '';
			var year = $("#year li.selected").attr('data-value');
			var state = $("#state li.selected").attr('data-value');
			console.log(year);
			if($(this).hasClass('parties')) {
				var api_path='';
				$(".parties_td").show();
				//alert($(this).attr('class'));
				if($("input[name='election_type']:checked").val() == 'AE') {
					api_path = api_root_path+'api/ae/partieslist?state='+state+'&year='+year;
				} else {
					api_path = api_root_path+'api/ge/partieslist?year='+year;
				}
				console.log(api_path);
				//$('#parties').find('option').remove().end().append('<option value="">Select</option>');
				$.getJSON(api_path, function(data) {
					var list='';
					$.each(data, function(i, item) {
						//$('<option />', {value: item, text:item}).appendTo(s1);
						list += '<li data-value="'+item+'"><a href="#">'+item.replace("_"," ")+'</a></li>';
					});	
					$("#parties").html(list);
					dropdownUpdate('parties');
				/*var s1 = $("#parties");
					$.each(data, function(i, item) {
						$('<option />', {value: item, text:item}).appendTo(s1);
					});	*/
				});
			} else {
				//$('#parties').find('option').remove().end().append('<option value="">Select</option>');
				$(".parties_td").hide();
				party = ' ';
			}
			viz_option = $(this).attr('data-value');
//console.log(viz_option+','+list);			
		});
		
		$('#parties').change(function() {
			party = $("#parties li.selected").attr('data-value');
		});

		$(".show_viz").on('click',function () {
			
			createmaps('','','');
			return false;
	
		});
	
		function createmaps(year_from_slider) {
		
			$('#legend_panel').empty();
			$('#legend_filter').empty();
			$('#selectionbox > input:hidden').attr("disabled",true);
			
			$( "#mainGraphDiv" ).empty();
			var elect_type = $("input[name='election-type']:checked").val();
			if(elect_type == 'AE') {
				state = $("#state li.selected").attr('data-value');
			} else {
				state = 'All';
			}
			//alert(state);
			party = $("#parties li.selected").attr('data-value');
			var year = '';
			if(year_from_slider != '') {
				 year = year_from_slider;
				 $('#year').val(year_from_slider);
			} else {
				year = $("#year li.selected").attr('data-value');
			}
			
			var viz_type = $("#viz_type li.selected").attr('data-value');
			var viz_option = $("#viz_results li.selected").attr('data-value');
			var year1 = '2000';
			
			//var url = "http:localhost:1234\?type=ae&state=Bihar&year=2016&viz=charts&dis=women";
			var embedd_path= window.location+'embed.html?type='+elect_type+'_'+viz_type+'&state='+state+'&year='+year+'&dis='+viz_option+'&party='+party;
			//alert(embedd_path);
			$("#embed_url").html(embedd_path);
		
			if (viz_type == 'maps' && elect_type == 'GE') {
				showGeMapVizualisation(elect_type, state, year, viz_option, party );
			} else if (viz_type == 'charts' && elect_type == 'GE') {
				showGeChartsVizualisation(elect_type, state, year, viz_option, party );
			} else if (viz_type == 'maps' && elect_type == 'AE') {
				//alert('inside map');
				showAeMapVizualisation(elect_type, state, year, viz_option, party);
			} else if (viz_type == 'charts' && elect_type == 'AE') {
			//alert();
				showAeChartsVizualisation(elect_type, state, year, viz_option, party );
			}
			/*
			$("#download").show();
			$("#side_panel").show();
			if(viz_type == 'maps') {
				$(".graph_area").append("<div id='outer_div'><div id='inner_div' class='slider'></div><div>");
				generateSlider(years_list, year)
			} else {
				$( ".slider" ).remove();
			}*/
			
		}
		
		function generateSlider(data, selected_value) {
			$(".slider")				
			// activate the slider with options
			.slider({ 
				min: 0, 
				max: data.length-1,
				value: data.indexOf(parseInt(selected_value))
			})
							
			// add pips with the labels set to "months"
			.slider("pips", {
				rest: "label",
				labels: data
			})
			.on("slidechange", function(e,ui) {
				createmaps(data[ui.value]);
			});
		  }
		  $("body").on('input','.iframedim', function(){
				var fid = $(this).attr('id').replace('iframe_','');
				if($("#viz_type").val() == 'maps') {
						$("#iframew").html($(this).val());
						$("#iframeh").html($(this).val());
						$(".iframedim:not("+$(this).attr('id')+")").val($(this).val());
				} else {
					if(fid == 'width') {
						$("#iframew").html($(this).val());
					} else {
						$("#iframeh").html($(this).val());
					}
				}
		  })
		  
		  //Search page to result page passing variables
		  $("#search_submit").click(function(e){
			  //e.preventDefault();

			var elect_type = $("input[name='election-type']:checked").val();
			if(elect_type == 'AE') {
				state = $("#state li.selected").attr('data-value');
			} else {
				state = 'All';
			}
			var party = '';
			party = $("#parties li.selected").attr('data-value');
			year = $("#year li.selected").attr('data-value');

			
			var viz_type = $("#viz_type li.selected").attr('data-value');
			var params = { type:elect_type,state:state, year:year,viz:viz_type,dis:viz_option,party:party };
			var str = $.param( params );
			console.log(str);
			
			$(this).attr("href", 'result.html?'+str+'&search=1');
			//var recursiveEncoded = $.param( myObject );
			//var recursiveDecoded = decodeURIComponent( $.param( myObject ) );

			 // $("#selectionbox")[0].submit();
		  })
	})
	function getUrlVars() {
	
		//var url = "http:localhost:1234\?type=ae&state=Bihar&year=2016&viz=charts&dis=women";
		var vars = [], hash;
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		//var hashes = url.slice(url.indexOf('?') + 1).split('&');
		for(var i = 0; i < hashes.length; i++)
		{
			hash = hashes[i].split('=');
			//vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		//console.log(vars);
		return vars;
	}
	
		
	$(document).ready(function(){
		
	})