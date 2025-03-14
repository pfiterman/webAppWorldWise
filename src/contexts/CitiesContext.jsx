/* eslint-disable eqeqeq */
import {
  useReducer,
  useEffect,
  useContext,
  createContext,
  useCallback,
} from "react";
import { initialState, citiesReducer } from "../reducers/citiesReducer";

// const BASE_URL = "http://localhost:9000";
const BASE_URL = "https://api.jsonbin.io/v3/b";
const BIN_ID = "67816fd6e41b4d34e4756ce4";
const API_KEY = "$2a$10$708n2sn1c7BNwXCHvo4Uyu1HvWiqEvRdVEvguL.Du6clhuPDyvYWq";

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    citiesReducer,
    initialState
  );

  // useEffect(function () {
  //   async function fetchCities() {
  //     dispatch({ type: "loading" });
  //     try {
  //       const res = await fetch(`${BASE_URL}/cities`);
  //       const data = await res.json();
  //       dispatch({ type: "cities/loaded", payload: data });
  //     } catch {
  //       dispatch({
  //         type: "rejected",
  //         payload: "There was an error loading cities.",
  //       });
  //     }
  //   }
  //   fetchCities();
  // }, []);

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/${BIN_ID}/latest`, {
          method: "GET",
          headers: {
            "X-Master-Key": API_KEY,
            "X-Bin-Meta": false,
          },
        });
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data.cities });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading cities.",
        });
      }
    }
    fetchCities();
  }, []);

  // const getCity = useCallback(
  //   async function getCity(id) {
  //     if (Number(id) === currentCity.id) return;
  //     dispatch({ type: "loading" });
  //     try {
  //       const res = await fetch(`${BASE_URL}/cities/${id}`);
  //       const data = await res.json();
  //       dispatch({ type: "city/loaded", payload: data });
  //     } catch {
  //       dispatch({
  //         type: "rejected",
  //         payload: "There was an error loading the city.",
  //       });
  //     }
  //   },
  //   [currentCity.id]
  // );

  const getCity = useCallback(
    async function getCity(id) {
      if (Number(id) === currentCity.id) return;
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/${BIN_ID}/latest`, {
          method: "GET",
          headers: {
            "X-Master-Key": API_KEY,
            "X-Bin-Meta": false,
            "X-JSON-Path": `$..cities[?(@.id==${id})]`,
          },
        });
        const data = await res.json();
        dispatch({ type: "city/loaded", payload: data.cities });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading the city.",
        });
      }
    },
    [currentCity.id]
  );

  // async function createCity(newCity) {
  //   dispatch({ type: "loading" });
  //   try {
  //     const res = await fetch(`${BASE_URL}/cities`, {
  //       method: "POST",
  //       body: JSON.stringify(newCity),
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const data = await res.json();
  //     dispatch({ type: "city/created", payload: data });
  //   } catch {
  //     dispatch({
  //       type: "rejected",
  //       payload: "There was an error creating the city.",
  //     });
  //   }
  // }

  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/${BIN_ID}`, {
        method: "PUT",
        body: JSON.stringify({
          cities: [
            ...cities,
            { id: crypto.randomUUID().substring(0, 4), ...newCity },
          ],
        }),
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": API_KEY,
        },
      });
      const { record } = await res.json();
      const { cities: newRecord } = record;
      dispatch({
        type: "city/created",
        payload: newRecord[newRecord.length - 1],
      });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error creating the city.",
      });
    }
  }

  // async function deleteCity(id) {
  //   dispatch({ type: "loading" });
  //   try {
  //     await fetch(`${BASE_URL}/cities/${id}`, {
  //       method: "DELETE",
  //     });
  //     dispatch({ type: "city/deleted", payload: id });
  //   } catch {
  //     dispatch({
  //       type: "rejected",
  //       payload: "There was an error deleting the city.",
  //     });
  //   }
  // }

  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${BASE_URL}/${BIN_ID}`, {
        method: "PUT",
        body: JSON.stringify({
          cities: [...cities.filter((city) => city.id !== id)],
        }),
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": API_KEY,
        },
      }).then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      });
      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting the city.",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside the CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
