import { format } from 'date-fns';
import { predicted_qty, qty, week_start_date } from './columnnames';

export const fillColor1 = 'rgba(54, 162, 235, 0.2)';
export const fillColor2 = 'rgba(255,99,132,0.2)';
export const hoverBGColor = 'rgba(255, 255, 255, 0.8)';
export const hoverTextColor = 'black';
export const lineColor1 = 'rgba(54, 162, 235, 1)';
export const lineColor2 = 'rgba(255,99,132,1)';

export const xaxis_values = (labels, range, plot = 'Line') => {
  return {
    // title: 'Week Start Date',
    tickformat: '%Y-%m-%d',
    tickvals: labels,
    ticktext: ['box', 'histogram'].includes(plot.toLowerCase())
      ? labels.map((label) => label)
      : labels.map((date) => format(new Date(date), 'dd-MM-yyyy')),
    tickangle: -45, // Rotate tick labels counterclockwise
    showgrid: true,
    gridcolor: 'rgba(200, 200, 200, 0.2)',
    tickfont: {
      size: 10, // Adjust the size of x-axis tick labels
      color: 'black', // Optionally adjust the color
    },
    rangeselector: {},
    rangeslider: { visible: true, thickness: 0.1 }, // Adjust the thickness of the range slider
    type: 'category',
    fixedrange: true, // Allow zooming and panning
    range: range || undefined,
  };
};

export const yaxis_values = () => {
  return {
    title: 'Quantity',
    showgrid: true,
    gridcolor: 'rgba(200, 200, 200, 0.2)',
  };
};

export const trace = (
  x = [],
  y = [],
  text = [],
  label = '',
  plot = 'Line',
  fillColor = 'rgba(255,99,132,0.2)',
  borderColor = 'rgba(255,99,132,1)'
) => {
  // Define default properties for different plot types
  const plotTypeDefaults = {
    line: {
      mode: 'lines+markers',
      x,
      y,
      line: {
        shape: 'spline',
        smoothing: 0.6,
        // color: borderColor
      },
      fill: 'tozeroy',
      // fillcolor: fillColor,
    },
    scatter: {
      mode: 'markers',
      x,
      y,
      // marker: { color: borderColor },
      // fill: 'tonexty',
    },
    bar: {
      type: 'bar',
      mode: 'lines',
      x,
      y,
      // marker: { color: borderColor },
    },
    histogram: {
      type: 'histogram',
      x,
      y,
      // marker: { color: borderColor },
    },
    // pie: {
    //   type: 'pie',
    //   labels: x.map((date) => format(new Date(date), 'yyyy-MM-dd')), // x represents labels for pie chart
    //   values: y, // y represents values for pie chart
    //   textinfo: 'label+percent',
    //   hoverinfo: 'label+percent+value',
    // },
    box: {
      type: 'box',
      x,
      y,
      // marker: { color: borderColor },
      // boxpoints: 'all', // Display all points
      jitter: 0.5, // Spread them out for better visibility
      // pointpos: -1.8, // Position points inside the box
    },
    kde: {
      type: 'histogram2dcontour',
      mode: 'lines',
      x,
      y,
      autobinx: false,
      autobiny: false,
      colorscale: 'Viridis',
      contours: {
        coloring: 'heatmap',
      },

    },
    default: {
      marker: { color: borderColor },
    },
  };

  const plotType = plot.toLowerCase();
  const defaults = plotTypeDefaults[plotType] || plotTypeDefaults.default;

  // Common properties for all plot types
  const commonProps = {
    name: label,
    text,
    hovertemplate: '%{text}<extra></extra>',
    hoverlabel: {
      bgcolor: hoverBGColor,
      bordercolor: borderColor,
      font: {
        color: hoverTextColor,
        size: 12,
      },
    },
  };

  return {
    ...commonProps,
    ...defaults,
  };
};

export const layoutOptions = () => {
  return {
    margin: {
      l: 60,
      r: 20,
      b: 80, // Increase the bottom margin to accommodate rotated labels
      t: 60,
      pad: 4,
    },
    paper_bgcolor: 'rgba(245, 246, 249, 1)',
    plot_bgcolor: 'rgba(245, 246, 249, 1)',
    hovermode: 'closest',
    showlegend: true, // Display the legend for multiple traces
    legend: {
      orientation: 'h', // Horizontal legend
      // x: 0.5, // Center horizontally
      // xanchor: 'center', // Align horizontally at center
      // y: 1.1, // Position just below the title
      yanchor: 'top', // Align vertically at the bottom
      bgcolor: 'rgba(0,0,0,0)', // Transparent background
    },
  };
};


export const calculateMedian = (values) => {
  const sorted = values.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
};

export const aggregatedDataByWeek = (
  data,
  endDate = null,
  productCode = ''
) => {
  if (data.length === 0) {
    return { labels: [], quantities: [], predictedQuantities: [], texts: [] };
  }

  const aggregatedData = {
    quantities: new Map(),
    predictedQuantities: new Map(),
  };

  data.forEach((item) => {
    const itemDate = new Date(item[week_start_date]);
    if (!endDate || itemDate < endDate) {
      const week = itemDate.toISOString().split('T')[0]; // Convert date to string format

      if (!aggregatedData.quantities.has(week)) {
        aggregatedData.quantities.set(week, []);
        aggregatedData.predictedQuantities.set(week, 0);
      }

      aggregatedData.quantities.get(week).push(item[qty]);
      aggregatedData.predictedQuantities.set(week, aggregatedData.predictedQuantities.get(week) + item[predicted_qty]);
    }
  });

  const labels = Array.from(aggregatedData.quantities.keys()).map(
    (date) => new Date(date)
  );

  const quantities = Array.from(aggregatedData.quantities.values()).map(
    (quantitiesArray) => quantitiesArray.reduce((a, b) => a + b, 0)
  );

  const predictedQuantities = Array.from(aggregatedData.predictedQuantities.values());

  const texts = labels.map((date) => {
    const week = date.toISOString().split('T')[0];
    const weekQuantities = aggregatedData.quantities.get(week);
    const minQuantity = Math.min(...weekQuantities);
    const maxQuantity = Math.max(...weekQuantities);
    const medianQuantity = calculateMedian(weekQuantities);
    const meanQuantity = (weekQuantities.reduce((a, b) => a + b) / weekQuantities.length).toFixed(2);

    const index = labels.findIndex(d => d.toISOString().split('T')[0] === week);

    return `ProductCode: ${productCode}<br>
      Week: ${format(date, 'yyyy-MM-dd')}<br>
      Quantity: ${quantities[index]}<br>
      Predicted Quantity: ${predictedQuantities[index]}<br>
      Max Quantity: ${maxQuantity}<br>
      Mean Quantity: ${meanQuantity}<br>
      Median Quantity: ${medianQuantity}<br>
      Min Quantity: ${minQuantity}<br>
    `;
  });

  return { labels, quantities, predictedQuantities, texts };
};


