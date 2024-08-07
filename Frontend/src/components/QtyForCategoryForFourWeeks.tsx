import Plot from 'react-plotly.js';
import { addWeeks, format } from 'date-fns';
import React, { useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Button from './Button';
import {
  aggregatedDataByWeek,
  calculateMedian,
  fillColor1,
  fillColor2,
  layoutOptions,
  lineColor1,
  lineColor2,
  trace,
  xaxis_values,
  yaxis_values,
} from '../Helpers/Helper';
import { category, predicted_qty, productcode, qty, week_start_date } from '../Helpers/columnnames';

const QtyForCategoryForFourWeeks = () => {
  // Get the necessary data from the Redux store
  const data = useSelector((state: any) => state.categoryDataFiltered);
  const categories = useSelector((state: any) => state.categories);
  const plot = useSelector((state: any) => state.plot);

  // Use ref to access the Plot component instance
  const plotRef = useRef(null);
  const [range, setRange] = useState(null);

  // Handle relayout event to set the range
  const handleRelayout = (event: any) => {
    if (event['xaxis.range']) {
      setRange(event['xaxis.range']);
    }
  };

  // Handle button click event to reset the scale
  const handleButtonClick = (event: any) => {
    const buttonId = event.buttonId;
    if (buttonId === 'resetScale') {
      setRange(null);
      if (plotRef.current) {
        Plot.relayout(plotRef.current, {
          'xaxis.autorange': true,
          'yaxis.autorange': true,
        });
      }
    }
  };

  // Function to reset the range
  const resetRange = () => {
    setRange(null);
  };

  // Memoize the calculation of traces and xlabels to avoid unnecessary computations
  const { traces, xlabels } = useMemo(() => {
    const allLabels = new Set();
    const allTraces = Array.from(data.entries()).flatMap(([code, categoryData]) => {
      const earliestDate = new Date(
        Math.min(
          ...categoryData.map((item) => new Date(item[week_start_date]))
        )
      );
      const endDate = addWeeks(earliestDate, 5);
    
      const aggregateQuantitiesByWeek = aggregatedDataByWeek(
        categoryData,
        endDate,
        code
      );
      let { labels, quantities, predictedQuantities, texts } = aggregateQuantitiesByWeek;
    
      // Generate actual texts for tooltips
      let actualTexts = labels.map((date) => {
        const filteredData = categoryData.filter(
          (item) =>
            new Date(item[week_start_date]).toISOString().split('T')[0] ===
            new Date(date).toISOString().split('T')[0]
        );
        const filteredDict = new Map();
    
        let weeklyActualQuantity = 0;
        let weeklyQuantities = [];
    
        filteredData.forEach((item) => {
          if (!filteredDict.has(item[productcode])) {
            filteredDict.set(item[productcode], 0);
          }
          filteredDict.set(item[productcode], filteredDict.get(item[productcode]) + item[qty]);
          weeklyActualQuantity += item[qty];
          weeklyQuantities.push(item[qty]);
        });
    
        const minQuantity = Math.min(...weeklyQuantities);
        const maxQuantity = Math.max(...weeklyQuantities);
        const medianQuantity = calculateMedian(weeklyQuantities);
    
        let text = `Week: ${new Date(date).toISOString().split('T')[0]}<br>
          Weekly Actual Quantity: ${weeklyActualQuantity}<br>
          Min Quantity: ${minQuantity}<br>
          Max Quantity: ${maxQuantity}<br>
          Median Quantity: ${medianQuantity}<br>`;
    
        for (const [key, value] of filteredDict.entries()) {
          text += `${key}: ${value}<br>`;
        }
    
        return text;
      });
    
      // Generate predicted texts for tooltips
      let predictedTexts = labels.map((date) => {
        const filteredData = categoryData.filter(
          (item) =>
            new Date(item[week_start_date]).toISOString().split('T')[0] ===
            new Date(date).toISOString().split('T')[0]
        );
        const filteredDict = new Map();
    
        let weeklyPredictedQuantity = 0;
        let weeklyQuantities = [];
    
        filteredData.forEach((item) => {
          if (!filteredDict.has(item[productcode])) {
            filteredDict.set(item[productcode], 0);
          }
          filteredDict.set(item[productcode], filteredDict.get(item[productcode]) + item[predicted_qty]);
          weeklyPredictedQuantity += item[predicted_qty];
          weeklyQuantities.push(item[qty]);
        });
    
        const minQuantity = Math.min(...weeklyQuantities);
        const maxQuantity = Math.max(...weeklyQuantities);
        const medianQuantity = calculateMedian(weeklyQuantities);
    
        let text = `Week: ${new Date(date).toISOString().split('T')[0]}<br>
          Weekly Predicted Quantity: ${weeklyPredictedQuantity}<br>
          Min Quantity: ${minQuantity}<br>
          Max Quantity: ${maxQuantity}<br>
          Median Quantity: ${medianQuantity}<br>`;
    
        for (const [key, value] of filteredDict.entries()) {
          text += `${key}: ${value}<br>`;
        }
    
        return text;
      });
    
      // Adjust data for 'Box' plot type
      if (['Box'].includes(plot)) {
        quantities = categoryData.map((item) => item[qty]);
        labels = categoryData.map((item) => item[category]);
        actualTexts = categoryData.map(
          (item) => `Week: ${format(
            new Date(item[week_start_date]),
            'dd-MM-yyyy'
          )}<br>
          Category: ${item[category]}<br>
          Qty: ${item[qty]}
          `
        );
        predictedTexts = categoryData.map(
          (item) => `Week: ${format(
            new Date(item[week_start_date]),
            'dd-MM-yyyy'
          )}<br>
          Category: ${item[category]}<br>
          Qty: ${item[predicted_qty]}
          `
        );
      }
    
      labels.forEach((label) => allLabels.add(label)); // Add labels to the set
    
      return [
        trace(
          labels,
          quantities,
          actualTexts,
          `${code}`,
          plot,
          fillColor1,
          lineColor1
        ),
        // Uncomment the following code if you want to add predicted quantities
        // trace(
        //   labels,
        //   predictedQuantities,
        //   predictedTexts,
        //   `${code}`,
        //   plot,
        //   fillColor2,
        //   lineColor2,
        // )
      ];
    });
    

    return {
      traces: allTraces,
      xlabels: Array.from(allLabels).sort(), // Convert set to sorted array
    };
  }, [data, plot]);

  // Define layout for the plot
  const layout = {
    title: `Total Quantity for Category(ies) for Four Weeks`,
    xaxis: xaxis_values(xlabels, range, plot),
    yaxis: yaxis_values(),
    ...layoutOptions(),
  };

  return (
    <div className="plot">
      <Plot
        data={traces}
        layout={layout}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
        onRelayout={handleRelayout}
        onButtonClicked={handleButtonClick}
        ref={plotRef}
      />
      <Button text={'Reset Range'} className={'resetBtn'} func={resetRange} />
    </div>
  );
};

export default React.memo(QtyForCategoryForFourWeeks);
