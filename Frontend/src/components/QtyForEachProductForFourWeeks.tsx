import React, { useMemo, useRef, useState, useCallback } from 'react';
import Plot from 'react-plotly.js';
import Plotly from 'plotly.js-dist';
import { addWeeks } from 'date-fns';
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
import { productcode, qty, week_start_date } from '../Helpers/columnnames';

const QtyForEachProductForFourWeeks = () => {
  const data = useSelector((state) => state.productDataFiltered);
  const selectedProductCodes = useSelector(
    (state) => state.selectedProductCodes
  );
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
    const allTraces = selectedProductCodes.flatMap((productCode) => {
      const productData = data.get(productCode) || [];
      const earliestDate = new Date(
        Math.min(...productData.map((item) => new Date(item[week_start_date])))
      );
      const endDate = addWeeks(earliestDate, 5);
      const aggregateQuantitiesByWeek = aggregatedDataByWeek(
        productData,
        endDate,
        productCode
      );
      let { labels, quantities, predictedQuantities, texts } =
        aggregateQuantitiesByWeek;

      if (['Box'].includes(plot)) {
        quantities = productData.map((item) => item[qty]);
        labels = productData.map((item) => item[productcode]);
        texts = productData.map(
          (item) => `Week: ${format(
            new Date(item[week_start_date]),
            'dd-MM-yyyy'
          )}<br>
          Product Code: ${item[productcode]}<br>
          Qty: ${item[qty]}`
        );
      }

      labels.forEach((label) => allLabels.add(label)); // Add labels to the set

      return [
        trace(
          labels,
          quantities,
          texts,
          `${productCode}`,
          plot,
          fillColor1,
          lineColor1
        ),
        // Uncomment the following lines if you want to include predicted quantities
        // trace(
        //   labels,
        //   predictedQuantities,
        //   texts,
        //   `${productCode}`,
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
  }, [data, selectedProductCodes, plot]);

  const layout = useMemo(
    () => ({
      title: `Quantity of Product(s) Over Four Weeks`,
      xaxis: xaxis_values(xlabels, range, plot),
      yaxis: yaxis_values(),
      ...layoutOptions(),
    }),
    [xlabels, range, plot]
  );

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

export default React.memo(QtyForEachProductForFourWeeks);
