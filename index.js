function DrawBar(dataset) {
  var margin  = {top: 50, right: 20, bottom: 50, left: 50},
      width = 800,
      height = 400,
      barWidth = width / dataset.length;
  
  var yearsDate = dataset.map(function(item) {
    return new Date(item[0]);
  });
  
  var minDate = d3.min(yearsDate);
  
  var maxDate = d3.max(yearsDate);
  maxDate.setMonth(maxDate.getMonth() + 3);
  
  var xScale = d3.scaleTime()
    .domain([minDate, maxDate])
    .range([0, width]);
  
  var xAxis = d3.axisBottom(xScale);
  
  var yScale = d3.scaleLinear()
      .domain([0, d3.max(dataset, function(d) { 
                   return d[1]; 
                   })
              ])
      .range([height, 0]);
  
  var yAxis = d3.axisLeft(yScale);
  
  var tooltip = d3.select('body').append('div')
    .attr('id', 'tooltip')
    .style('position', 'absolute')
    .style('padding', '4px')
    .style('background', '#fff')
    .style('border', '1px solid #000')
    .style('color', '#000')
    .style('opacity', 0)

  var svgContainer = d3.select("#barGraph")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", "graph-svg-component")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  svgContainer.selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('data-date', function(d, i) {
          return d[0]
        })
        .attr('data-gdp', function(d, i) {
          return d[1]
        })
        .attr('class', 'bar')
        .style('fill', 'lightblue')
        .attr('x', function(d, i) { 
          return (i * barWidth); 
          })
        .attr('y', function(d) { 
          return yScale(d[1]); 
          })
        .attr('width', barWidth)
        .attr('height', function(d) { 
          return height - yScale(d[1]); 
          })
        .on('mouseover', function(d) {
          tooltip.transition().style('opacity', 1)
          tooltip.style('left', (d3.event.pageX + 10) + 'px')
            .style('top', (d3.event.pageY + 15) + 'px')
            .html('<p>' + d[0] + '</p>' +
                 '<p>' + d[1] + '</p>')
            .attr('data-date', d[0])
            d3.select(this).style('opacity', 0.5)
        })
        .on('mouseout', function(d) {
          tooltip.transition().style('opacity', 0)
          d3.select(this).style('opacity', 1)
        })
  
  var xAxisGroup = svgContainer.append('g')
    .call(xAxis)
    .attr('id', 'x-axis')
    .attr("transform", "translate(0, " + height + ")")
  
  var yAxisGroup = svgContainer.append('g')
    .call(yAxis)
    .attr('id', 'y-axis')
  
}

d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', function(data) {
 var dataset = data.data;
  DrawBar(dataset);
 });