$(document).ready(function (){
//static
    var data = $('#static_data').attr("data-json");
    data = data.replace(/u'/g, "'");    //parseできる形に変更
    data = data.replace(/'/g, '"');
    jsonData = JSON.parse(data);

    var diameter = 600 - 30,
        limit=5000,
        format = d3.format(",d"),
        color = d3.scale.category20c();

    var bubble = d3.layout.pack()
        .sort(null)
        .size([diameter, diameter])
        .padding(0.1);

    var svg = d3.select("#svgid").append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .attr("class", "bubble");

//  ここはデータ生成
    var wordMap=[];
    var wordList = [];
    var wordCount=[];
    var wordIdList=[];
    var wordId = 0;

    for(i in jsonData.keywords){
        var key = jsonData.keywords;
        wordList.push(key[i].keyword);
        wordCount.push(key[i].priority);
        wordMap[key[i].keyword] = wordId;
        wordIdList.push(wordId);
        wordId++;
    }

    wordIdList.sort(function(x, y){
        return -wordCount[x] + wordCount[y]
    }
);

    var data=[
        wordList,
        wordCount
    ];
    console.log(data);
    var dobj=[];
    for (var di=0;di<data[0].length;di++){
        dobj.push({"key":di,"value":data[1][di]});
        console.log(dobj);
    }

    display_pack({children: dobj});
//    console.log(dobj);

    function display_pack(root){
        var node = svg.selectAll(".node")
            .data(bubble.nodes(root)
                .filter(function(d) { return !d.children; }))
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
            .style("fill", function(d) { return color(data[0][d.key]); })
            .on("mouseover", function(d,i){
                d3.select(this).style("fill", "gold");
                showToolTip(" "+data[0][i]+"<br>"+data[1][i]+" ",d.x+d3.mouse(this)[0]+50,d.y+d3.mouse(this)[1],true);
            })
            .on("mousemove", function(d,i){
                tooltipDivID.css({top:d.y+d3.mouse(this)[1],left:d.x+d3.mouse(this)[0]+50});
            })
            .on("mouseout", function(){
                d3.select(this).style("fill", function(d) { return color(data[0][d.key]); });
                showToolTip(" ",0,0,false);
            });

//        node.append("circle")
//            .attr("r", function(d) { return d.r; });
//        .style("fill", function(d) { return color(data[0][d.key]); });

        node.append("rect")
            .attr("x", function(d) { return -d.r*(1/Math.sqrt(2)); })
            .attr("y", function(d) { return -d.r*(1/Math.sqrt(2)); })
            .attr("width", function(d) { return d.r*Math.sqrt(2); })
            .attr("height", function(d) { return d.r*Math.sqrt(2); });

//        node.append("text")
//            .attr("dy", ".0em")
//            .style("text-anchor", "middle")
//            .style("fill","black")
//            .text(function(d) { return data[0][d.key].substring(0, d.r / 3); });
    }

    function showToolTip(pMessage,pX,pY,pShow)
    {
        if (typeof(tooltipDivID)=="undefined")
        {
            tooltipDivID =$('<div id="messageToolTipDiv" style="position:absolute;display:block;z-index:10000;border:2px solid black;background-color:rgba(0,0,0,0.8);margin:auto;padding:3px 5px 3px 5px;color:white;font-size:12px;font-family:arial;border-radius: 5px;vertical-align: middle;text-align: center;min-width:50px;overflow:auto;"></div>');

            $('body').append(tooltipDivID);
        }
        if (!pShow) { tooltipDivID.hide(); return;}
        //MT.tooltipDivID.empty().append(pMessage);
        tooltipDivID.html(pMessage);
        tooltipDivID.css({top:pY,left:pX});
        tooltipDivID.show();
    }

//d3.select(self.frameElement).style("height", diameter + "px");

    }
)

var d3FontSize = function(priority){
    if(priority > 1000)  return 24;
    if(priority > 100)  return 20;
    if(priority > 20)   return 16;
    if(priority > 1)    return 14;
    return 12;
}