import { createStore } from 'redux';
import { category, cfacode, productcode } from '../Helpers/columnnames';

const initialState = {
  data: [],

  productData: {}, // Grouped by ProductCode
  selectedProductCodes: [],
  productCodes: [],
  productDataFiltered: {},

  selectedCategories: [],
  categoryData: {},
  categories: [],
  categoryDataFiltered: {},

  selectedLocations: [],
  locationData: {},
  locations: [],
  locationDataFiltered: {},

  plot: 'Line',

  locationCategoryData: {},
  locationProductCodeData: {},
};

// Actions
export const setData = (data) => ({ type: 'SET_DATA', data });
export const setCategories = (selectedCategories) => ({
  type: 'SET_CATEGORIES',
  selectedCategories,
});
export const setProductCodes = (selectedProductCodes) => ({
  type: 'SET_PRODUCT_CODES',
  selectedProductCodes,
});
export const setLocations = (selectedLocations) => ({
  type: 'SET_LOCATIONS',
  selectedLocations,
});
export const setPlot = (plot) => ({ type: 'SET_PLOT', plot });

const removeDuplicates = (data, key = 'id') => {
  const seen = new Set();
  return data.filter((item) => {
    const identifier = item[key];
    if (seen.has(identifier)) {
      return false;
    }
    seen.add(identifier);
    return true;
  });

};

// Helper function to group data by a specified field
const groupDataByField = (data, field) => {
  const result = new Map();

  data.forEach((item) => {
    const key = item[field];
    if (!result.has(key)) {
      result.set(key, []);
    }
    result.get(key).push(item);
  });

  return result;
};

const filterData = (options, data) => {
  const result = new Map();

  options.forEach((code) => {
    if (data.has(code)) {
      result.set(code, data.get(code));
    }
  });

  return result;
};

const filterBothData = (data1, data2, fieldName) => {
  const result = new Map();

  Array.from(data1.keys()).forEach(key1 => {
    data2.forEach((value2, key2) => {
      const filteredItems = (value2 || []).filter(item => item[fieldName] == key1);
      result.set(`${key2} ${key1}`, filteredItems);
    });
  });

  return result;
};

// Reducer
const dataReducer = (state: any = initialState, action: any) => {
  switch (action.type) {
    case 'SET_DATA': {
      const allData = removeDuplicates([...state.data, ...(action.data || [])]);

      // Group data by fields
      const groupedProductData = groupDataByField(allData, productcode);
      const groupedCategoryData = groupDataByField(allData, category);
      const groupedLocationData = groupDataByField(allData, cfacode);

      // Get unique values for dropdowns
      const productCodes = Array.from(
        new Set(allData.map((item) => item[productcode]))
      ).sort();
      const categories = Array.from(
        new Set(allData.map((item) => item[category]))
      ).sort();
      const locations = Array.from(
        new Set(allData.map((item) => item[cfacode]))
      ).sort();

      // Set default selections if none are provided
      const defaultProductCodes =
        productCodes.length > 0 ? [productCodes[0]] : [];
      const defaultCategories = categories.length > 0 ? [categories[0]] : [];
      const defaultLocations = locations.length > 0 ? [locations[0]] : [];

      // Filter data based on selected values
      const filteredProductData =
        state.selectedProductCodes.length > 0
          ? filterData(state.selectedProductCodes, groupedProductData)
          : filterData(defaultProductCodes, groupedProductData);

      const filteredCategoryData =
        state.selectedCategories.length > 0
          ? filterData(state.selectedCategories, groupedCategoryData)
          : filterData(defaultCategories, groupedCategoryData);

      const filteredLocationData =
        state.selectedLocations.length > 0
          ? filterData(state.selectedLocations, groupedLocationData)
          : filterData(defaultLocations, groupedLocationData);

      const filteredLocationCategoryData = filterBothData(
        filteredCategoryData,
        filteredLocationData,
        category
      );
      const filteredLocationProductCodeData = filterBothData(
        filteredProductData,
        filteredLocationData,
        productcode
      );

      return {
        ...state,
        data: allData,

        productCodes,
        categories,
        locations,

        selectedProductCodes:
          state.selectedProductCodes.length == 0
            ? defaultProductCodes
            : state.selectedProductCodes,
        selectedCategories:
          state.selectedCategories.length == 0
            ? defaultCategories
            : state.selectedCategories,
        selectedLocations:
          state.selectedLocations.length == 0
            ? defaultLocations
            : state.selectedLocations,

        productData: groupedProductData,
        categoryData: groupedCategoryData,
        locationData: groupedLocationData,

        productDataFiltered: filteredProductData,
        categoryDataFiltered: filteredCategoryData,
        locationDataFiltered: filteredLocationData,

        locationCategoryData: filteredLocationCategoryData,
        locationProductCodeData: filteredLocationProductCodeData,
      };
    }

    case 'SET_PRODUCT_CODES': {
      const selectedProductCodes = action.selectedProductCodes.length == 0? [state.productCodes[0]]: action.selectedProductCodes
      const filteredProductData = filterData(
        selectedProductCodes,
        state.productData
      );

      const filteredLocationProductCodeData = filterBothData(
        filteredProductData,
        state.locationDataFiltered,
        productcode
      );

      return {
        ...state,
        selectedProductCodes: selectedProductCodes,
        productDataFiltered: filteredProductData,
        locationProductCodeData: filteredLocationProductCodeData,
      };
    }

    case 'SET_CATEGORIES': {
      const selectedCategories = action.selectedCategories.length == 0? [state.categories[0]]: action.selectedCategories
      const filteredCategoryData = filterData(
        selectedCategories,
        state.categoryData
      );

      const filteredLocationCategoryData = filterBothData(
        filteredCategoryData,
        state.locationDataFiltered,
        category
      );

      return {
        ...state,
        selectedCategories: selectedCategories,
        categoryDataFiltered: filteredCategoryData,
        locationCategoryData: filteredLocationCategoryData,
      };
    }

    case 'SET_LOCATIONS': {
      const selectedLocations = action.selectedLocations.length == 0? [state.locations[0]]: action.selectedLocations
      const filteredLocationData = filterData(
        selectedLocations,
        state.locationData
      );

      const filteredLocationCategoryData = filterBothData(
        state.categoryDataFiltered,
        filteredLocationData,
        category
      );
      const filteredLocationProductCodeData = filterBothData(
        state.productDataFiltered,
        filteredLocationData,
        productcode
      );

      return {
        ...state,
        selectedLocations: selectedLocations,
        locationDataFiltered: filteredLocationData,
        locationCategoryData: filteredLocationCategoryData,
        locationProductCodeData: filteredLocationProductCodeData,
      };
    }

    case 'SET_PLOT':
      return {
        ...state,
        plot: action.plot,
      };

    default:
      return state;
  }
};

const dataStore = createStore(dataReducer);

export default dataStore;
