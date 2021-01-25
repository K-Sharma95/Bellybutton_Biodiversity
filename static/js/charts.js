function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
})}

init();

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    //var metadata = data.metadata;
    var samples= data.samples;
    var metadata = data.metadata;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var samplesArray = samples.filter(sampleObj => sampleObj.id == sample);
   // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var del1 = samplesArray[0];
    
    // 2. Create a variable that holds the first sample in the metadata array.
    var del3 = resultArray[0]

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = del1.otu_ids;

    var otu_labels = del1.otu_labels;

    var sample_values = del1.sample_values;

    // 3. Create a variable that holds the washing frequency.
    var wfreq = data.metadata.map(person => person.wfreq);
    console.log(wfreq);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    
    var topten = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();
    
    // 8. Create the trace for the bar chart. 
    var trace1 = {
      x: sample_values.slice(0,10).reverse(),
      y: topten,
      text: otu_labels.slice(0,10).reverse(),
      orientation: "h",
      type: "bar"
    };

    var barData = [trace1];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     
    title: " Top 10 Bacteria Cultures Found",
    xaxis: { title: ""},
    yaxis: { title: ""},
    
    };
  
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
    
    // 1. Create the trace for the bubble chart.
    var trace2 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values,
        autotick: false,
        tick0: 0,
        
      }
    }
    var bubbleData = [trace2];

   // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures",
      xaxis: {title: {text:"Otu Id"}},
      hovermode: otu_labels
    };

   // 3. Use Plotly to plot the data with the layout.
   Plotly.newPlot("bubble", bubbleData, bubbleLayout);
   // 4. Create the trace for the gauge chart.
    var trace3 =[ {
      domain: { x: [0, 1], y: [0, 1] },
      value: wfreq,
      title: { text: "Belly Button Washing Frequency" },
      type: "indicator",
      mode:"gauge+number",
      gauge: {
        axis: { range: [null, 10] },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lightgreen" },
          { range: [8, 10], color: "darkgreen" },
        ],
        threshold: {
          line: { color: "red", width: 4 },
          thickness: 0.75,
          value: 490
        }
      }
    }
  ];
      
    var gaugeData = [trace3];

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
    
    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);


   
  });
}

