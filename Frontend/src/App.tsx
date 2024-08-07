import './App.css';
import QtyForEachProductForFourWeeks from './components/QtyForEachProductForFourWeeks';
import QtyForEachProductForAllWeeks from './components/QtyForEachProductForAllWeeks';
import QtyForCategoryForFourWeeks from './components/QtyForCategoryForFourWeeks';
import QtyForLocationAndProduct from './components/QtyForLocationAndProduct';
import QtyForLocationAndCategory from './components/QtyForLocationAndCategory';

import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar';
import { setData } from './Store/store';
import React from 'react';

type DataItem = {
  ProductCode: number;
  Category: number;
  CFACode: number;
};

const App: React.FC = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data);
  console.log(data.length);

  const fetchData = useCallback(async () => {
    let start = 0;
    try {
      while (true) {
        const end = start + 5000
        const response = await axios.get<{
          start: number;
          data: DataItem[];
        }>(`http://192.168.1.12:8081/data/range?startId=${start}&endId=${end}`);
        const newData = response.data;

        if (newData.length > 0) {
          dispatch(setData(newData));
          start = end;
        } else {
          break; // Break the loop if there's no new data
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const memoizedData = useMemo(() => data, [data]);

  return (
    <>
      <Navbar />
      {memoizedData.length > 0 ? (
        <div className="plots">
          <div className="plot-row">
            <QtyForEachProductForAllWeeks />
          </div>
          <div className="plot-row">
            <QtyForEachProductForFourWeeks />
            <QtyForCategoryForFourWeeks />
          </div>
          <div className="plot-row">
            <QtyForLocationAndProduct />
            <QtyForLocationAndCategory />
          </div>
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </>
  );
};

export default React.memo(App);
