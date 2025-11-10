'use client'
import React from 'react';
export type FilterState = {
    currentPage: number,
    leagueFilter: string,
    searchTerm: string
  }


 export  type Payload = {
        field: keyof FilterState;
        value: string | number | boolean;
      }
type Action =
  | {
      type: 'SET_FILTER';
      payload: Payload;
    }
  | { type: 'CHANGE_PAGE'; payload: number }
  | { type: 'RESET_FILTER' };

export const useFilters = () => {
  const initialState:  FilterState = {
    currentPage: 1,
    leagueFilter: 'all',
    searchTerm: ""
  }

  const queryReducer = (state: FilterState, action: Action) => {
    switch (action.type) {
      case 'SET_FILTER':
        return {
          ...state,
          [action.payload.field]: action.payload.value,
        }
      case 'CHANGE_PAGE':
        return {
          ...state,
          pageIndex: state.currentPage + 1,
        }
      case 'RESET_FILTER':
        return initialState
      default:
        return state
    }
  }
  const [filters, dispatch] = React.useReducer(queryReducer, initialState)


  const setFilters = React.useCallback(
    (payload: Payload ) => {
      dispatch({ type: 'SET_FILTER', payload })
    },
    [dispatch]
  )

  const resetFilters = React.useCallback(() => {
    dispatch({ type: 'RESET_FILTER' })
  }, [dispatch])

  const handlePageChange = React.useCallback(
    (page: number ) => {
      dispatch({ type: 'CHANGE_PAGE', payload: page })
    },
   // eslint-disable-next-line react-hooks/exhaustive-deps 
    [filters, dispatch]
  )


  return {
    setFilters,
    resetFilters,
    filters,
    handlePageChange,
  }
}
