import { useCallback, useEffect, useState } from 'react';

import {
  createBooking,
  getBooking,
  getTaxiById,
  payBooking,
  searchTaxis,
} from '@/services/taxiService';

function useTaxiRequest(request, requestKey) {
  const [state, setState] = useState(null);

  useEffect(() => {
    let active = true;

    Promise.resolve()
      .then(request)
      .then((data) => {
        if (active) setState({ requestKey, data, error: null });
      })
      .catch((error) => {
        if (active) setState({ requestKey, data: null, error });
      });

    return () => {
      active = false;
    };
  }, [request, requestKey]);

  const current = state?.requestKey === requestKey ? state : null;
  return { data: current?.data ?? null, loading: !current, error: current?.error ?? null };
}

export function useTaxiSearch(params, filters, limit, retryKey = 0) {
  const requestKey = JSON.stringify({ params, filters, limit, retryKey });
  const request = useCallback(() => {
    const { params: search, filters: selectedFilters, limit: resultLimit } = JSON.parse(requestKey);
    return searchTaxis(search, selectedFilters, resultLimit);
  }, [requestKey]);
  return useTaxiRequest(request, requestKey);
}

export function useTaxi(id, retryKey = 0) {
  const requestKey = `${id}:${retryKey}`;
  const request = useCallback(() => getTaxiById(id), [id]);
  return useTaxiRequest(request, requestKey);
}

export function useBooking(id, retryKey = 0) {
  const requestKey = `${id}:${retryKey}`;
  const request = useCallback(() => getBooking(id), [id]);
  return useTaxiRequest(request, requestKey);
}

export { createBooking, payBooking };
