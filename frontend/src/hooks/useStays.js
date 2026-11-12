import { useEffect, useState } from 'react';

import { createStayBooking, getStayBooking, getStayById, getStayOffers, searchStays, simulateStayPayment } from '@/services/stayService';

function useAsync(loader, key) {
  const [state, setState] = useState({ key: null, data: null, loading: true, error: null });
  useEffect(() => {
    let active = true;
    loader().then((data) => { if (active) setState({ key, data, loading: false, error: null }); })
      .catch((error) => { if (active) setState({ key, data: null, loading: false, error }); });
    return () => { active = false; };
  // The serialized key is the dependency contract for this request.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return state.key === key ? state : { data: null, loading: true, error: null };
}

export function useStayOffers() { return useAsync(getStayOffers, 'offers'); }
export function useStay(id) { return useAsync(() => getStayById(id), `stay:${id}`); }
export function useStayBooking(reference) { return useAsync(() => getStayBooking(reference), `booking:${reference}`); }
export function useStaySearch(params, filters, sortBy) {
  const key = JSON.stringify({ params, filters, sortBy });
  return useAsync(() => searchStays(params, filters, sortBy), key);
}

export { createStayBooking, simulateStayPayment };
