/**
* Created by liuju on 11/21/2016.
*/

// show the Keyword Graph function.
$("#keyword_network").on("click", function(){
    document.getElementById("streaming_tweets").style.backgroundColor = "lightslategrey";
    document.getElementById("keyword_network").style.backgroundColor = "darkblue";
    document.getElementById("streaming_tweets_div").style.display = "none";
    document.getElementById("keyword_graph").style.display = "block";
});


// Search the keyword based on two parameters: number of the bubble and frequency of the bubble.
function search_keyword() {
    var search_keyword = $("#keyword_search_input").val();
    document.getElementById("keyword_network_div").style.display = "block";
    document.getElementById("keyword_search_div").style.display = "none";
    document.getElementById("return_to_search_btn").style.display = "block";
    document.getElementById("d3_chart").style.display = "block";
    document.getElementById("keyword_graph").style.display = "block";

    // get the search result to plot the canvas.
    $.ajax({
        'url': get_canvas_data_url,
        'type': 'post',
        'data': {
            'keyword': $("#keyword_search_network").val(),
            'number_of_bubble': $("#number_of_bubble").val() == 'No limit' ? 0 : $("#number_of_bubble").val(),
            'frequency_of_bubble': $("#frequency_of_bubble").val() == 'No limit' ? 0 : $("#frequency_of_bubble").val()
        },
        'dataType': 'json',
        'success': function(data) {
            data.forEach(function(d) {
                d.Type = d["Type"];
                d.value = +d["Amount"];
            });

            //bubbles needs very specific format, convert data to this.
            var nodes = bubble.nodes({children:data}).filter(function(d) { return !d.children; });

            //setup the chart
            var bubbles = svg.append("g")
                .attr("transform", "translate(0,0)")
                .selectAll(".bubble")
                .data(nodes)
                .enter();

            //create the bubbles
            bubbles.append("circle")
                .attr("r", function(d){ return d.r; })
                .attr("cx", function(d){ return d.x; })
                .attr("cy", function(d){ return d.y; })
                .style("fill", function(d) { return color(d.value); })
                .on("click", function(d){ // add click event to show the information of the relevant tweets.
                    var keyword = d.Type;
                    $.ajax({
                        'url': get_tweets_info_url,
                        'type': 'post',
                        'data': {
                            'keyword': keyword
                        },
                        'dataType': 'json',
                        'success': function(data) {
                            document.getElementById("tweets").style.display = "block";
                            document.getElementById("d3_chart").style.display = "none";
                            document.getElementById("return_to_search_btn").style.display = "none";
                            document.getElementById("tweets").style.display = "block";
                            // pass the data into vue-js framework and initiate the vue-part.
                            // vue-js is used to show the tweets information.
                            var APP_tweets = app(data);
                        }
                    });
                });

            //format the text for each bubble
            bubbles.append("text")
                .attr("x", function(d){ return d.x; })
                .attr("y", function(d){ return d.y + 5; })
                .attr("text-anchor", "middle")
                .text(function(d){ return d["Type"]; })
                .style({
                    "fill":"white",
                    "font-family":"Helvetica Neue, Helvetica, Arial, san-serif",
                    "font-size": "12px"
                });
        }
    });
}

var diameter = 600, //max size of the bubbles
    color    = d3.scale.category20b(); //color category

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);

var svg = d3.select("#d3_chart")
    .attr("align", "center")
    .append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

// from the bubble chart to the search page.
function return_to_search() {
    document.getElementById("keyword_network_div").style.display = "none";
    document.getElementById("keyword_graph").style.display = "block";
    document.getElementById("keyword_search_div").style.display = "block";
}

// from the tweets information page to the bubble chart page.
function return_to_canvas() {
    document.getElementById("tweets").style.display = "none";
    document.getElementById("d3_chart").style.display = "block";
    document.getElementById("return_to_search_btn").style.display = "block";
}
