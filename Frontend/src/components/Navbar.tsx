import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Store/store'; // Import your RootState type if available
import {
  setCategories,
  setLocations,
  setPlot,
  setProductCodes,
} from '../Store/store';
import MultiSelectDropdown from '../components/MultiSelectDropdown';

type PlotType = 'Line' | 'Bar' | 'Scatter' | 'Pie' | 'Histogram' | 'Box' | 'Kde';

const Navbar: React.FC = () => {
  const dispatch = useDispatch();

  // Use RootState type for better type safety
  const selectedProductCodes = useSelector((state: RootState) => state.selectedProductCodes);
  const selectedCategories = useSelector((state: RootState) => state.selectedCategories);
  const selectedLocations = useSelector((state: RootState) => state.selectedLocations);
  const productCodes = useSelector((state: RootState) => state.productCodes);
  const categories = useSelector((state: RootState) => state.categories);
  const locations = useSelector((state: RootState) => state.locations);
  const selectedPlot = useSelector((state: RootState) => state.plot);

  // Memoize plot types array
  const plots: PlotType[] = useMemo(() => ['Line', 'Bar', 'Scatter', 'Box', 'Kde'], []);

  // Memoize handlers
  const handleProductCodeChange = useCallback(
    (selectedProductCodes: number[]) => {
      dispatch(setProductCodes(selectedProductCodes));
    },
    [dispatch]
  );

  const handleCategoryChange = useCallback(
    (selectedCategories: number[]) => {
      dispatch(setCategories(selectedCategories));
    },
    [dispatch]
  );

  const handleLocationChange = useCallback(
    (selectedLocations: number[]) => {
      dispatch(setLocations(selectedLocations));
    },
    [dispatch]
  );

  const handlePlotChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(setPlot(event.target.value as PlotType));
    },
    [dispatch]
  );

  return (
    <div className="navbar">
      <div className="nav-option">
        {/* <label htmlFor="productCodeSelect">Select Product Code(s):</label> */}
        <MultiSelectDropdown
          id="productCodeSelect"
          options={productCodes}
          selectedOptions={selectedProductCodes}
          onChange={handleProductCodeChange}
          label="Select Product Code(s)"
        />
      </div>
      <div className="nav-option">
        {/* <label htmlFor="categorySelect">Select Category(ies):</label> */}
        <MultiSelectDropdown
          id="categorySelect"
          options={categories}
          selectedOptions={selectedCategories}
          onChange={handleCategoryChange}
          label="Select Category(ies)"
        />
      </div>
      <div className="nav-option">
        {/* <label htmlFor="locationSelect">Select Location(s):</label> */}
        <MultiSelectDropdown
          id="locationSelect"
          options={locations}
          selectedOptions={selectedLocations}
          onChange={handleLocationChange}
          label="Select Location(s)"
        />
      </div>
      <div className="nav-option">
        {/* <label htmlFor="plotSelect">Select Plot:</label> */}
        <select
          id="plotSelect"
          value={selectedPlot}
          onChange={handlePlotChange}
          aria-label="Select Plot Type"
        >
          {plots.map((plot) => (
            <option key={plot} value={plot}>
              {plot}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default React.memo(Navbar);
