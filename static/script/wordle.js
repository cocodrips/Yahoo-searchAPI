$(function(){
    var data = $('#static_data').attr("data-json");
    data = data.replace(/u'/g, "'");    //parseできる形に変更
    data = data.replace(/'/g, '"');

    //CONSTANT
    jsonData = JSON.parse(data);
    box_margin = 0;

    var fill = d3.scale.category20();
    paintWordle(fill);
});

var d3FontSize = function(priority){
    if(priority > 1000)  return 24;
    if(priority > 100)  return 20;
    if(priority > 20)   return 16;
    if(priority > 1)    return 14;
    return 12;
}


var paintWordle = function(fill){
    for(var i = 0; i < jsonData.keywordsData[0].clusterMax; i++){
        var keywords = jsonData.keywords;

        var branch_keywords = [];   //ブランチに入るキーワードの中身
        var branch_key_size = [];   //キーワードのサイズ
        var branch_size = 0;
        var max_length = 0;
        for( k in keywords ){
            if(keywords[k].cluster == i){
                var key_font_size = d3FontSize(keywords[k].priority);
                var key = keywords[k].keyword;

                branch_keywords.push(key);
                branch_key_size[key] = key_font_size;
                branch_size += ( key_font_size * key.length ) * key_font_size; //キーワードの面積
                max_length = Math.max(max_length, key_font_size * key.length);
            }
        }

        console.log(branch_size);
        var width = Math.round(Math.max(max_length, Math.sqrt(branch_size))) + box_margin;
        var height = Math.round(branch_size / width) + box_margin;

        d3.layout.cloud().size([width, height])
            .words(branch_keywords.map(function(d) {
                return {text: d, size: branch_key_size[d]};
            }))
            .rotate(function() { return ~~ 0; })
            .font("Impact")
            .fontSize(function(d) { return d.size; })
            .on("end", draw)
            .start();

        function draw(words) {
            var canvas = d3
                .select("id_name")
                .append("svg")
                .attr("width", width)
                .attr("height", height);

//                canvas.append("rect")
//                .attr("fill", "gray") //function(d, i) { return fill(i); }
//                .attr("x", 0)
//                .attr("y", 0)
//                .attr("width", width)
//                .attr("height", height);
            var g = canvas.append("g")
                .attr("transform", "translate("+width/2+","+height/2+")")
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", function(d) { return d.size + "px"; })
                .style("font-family", "Impact")
                .attr("fill", "red") //function(d, i) { return fill(i); }
                .attr("text-anchor", "middle")
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function(d) { return d.text; });
        }
    }
}

