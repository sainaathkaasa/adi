import React, { useMemo, useRef, useState, useCallback } from 'react';
import Plot from 'react-plotly.js';
import Plotly from 'plotly.js-dist';
import { format } from 'date-fns';
import {
  aggregatedDataByWeek,
  fillColor1,
  fillColor2,
  layoutOptions,
  lineColor1,
  lineColor2,
  trace,
  xaxis_values,
  yaxis_values,
} from '../Helpers/Helper';
import Button from './Button';
import { useSelector } from 'react-redux';
import { cfacode, productcode, qty, week_start_date } from '../Helpers/columnnames';

const QtyForLocationAndProduct = () => {
  const data = useSelector((state) => state.locationProductCodeData);
  const plot = useSelector((state) => state.plot);
  const plotRef = useRef(null);
  const [range, setRange] = useState(null);

  const handleRelayout = useCallback((event) => {
    if (event['xaxis.range']) {
      setRange(event['xaxis.range']);
    }
  }, []);

  const handleButtonClick = useCallback((event) => {
    const buttonId = event.buttonId;
    if (buttonId === 'resetScale') {
      setRange(null);
      if (plotRef.current) {
        Plotly.relayout(plotRef.current, {
          'xaxis.autorange': true,
          'yaxis.autorange': true,
        });
      }
    }
  }, []);

  const resetRange = useCallback(() => {
    setRange(null);
  }, []);

  const { traces, xlabels } = useMemo(() => {
    const allLabels = new Set();
    const allTraces = Array.from(data.entries()).flatMap(([code, locationProductData]) => {
      const aggregateQuantitiesByWeek = aggregatedDataByWeek(locationProductData, null, code);
      let { labels, quantities, predictedQuantities, texts } = aggregateQuantitiesByWeek;
    
      if (['Box'].includes(plot)) {
        quantities = locationProductData.map((item) => item[qty]);
        labels = locationProductData.map((item) => `${item[cfacode]}${item[productcode]}`);
        texts = locationProductData.map(
          (item) => `Week: ${format(
            new Date(item[week_start_date]),
            'dd-MM-yyyy'
          )}<br>
          Product Code: ${item[productcode]}<br>
          Qty: ${item[qty]}`
        );
      }
    
      labels.forEach(label => allLabels.add(label)); // Add labels to the set
    
      return [
        trace(
          labels,
          quantities,
          texts,
          `${code}`,
          plot,
          fillColor1,
          lineColor1
        ),
        // Uncomment if you want to include predicted quantities
        // trace(
        //   labels,
        //   predictedQuantities,
        //   texts,
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

  const layout = useMemo(() => ({
    title: `Total Quantity for Location(s) & Product(s) Over Each Week`,
    xaxis: xaxis_values(xlabels, range, plot),
    yaxis: yaxis_values(),
    ...layoutOptions(),
  }), [data, xlabels, range, plot]);

  return (
    <div className="plot plot-head">
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

export default React.memo(QtyForLocationAndProduct);
