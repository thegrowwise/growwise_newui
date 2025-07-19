'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchContentStart } from '@/store/slices/contentSlice';

function ContentInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.content);

  useEffect(() => {
    if (!data && !loading && !error) {
      dispatch(fetchContentStart());
    }
  }, [dispatch, data, loading, error]);

  return <>{children}</>;
}

export default function ContentProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ContentInitializer>
        {children}
      </ContentInitializer>
    </Provider>
  );
} 