'use client';

import { useEffect } from 'react';
import { usePageName } from '@/context/PageNameProvider';

function NamePageSetter({
  pageKey,
  pageName
}: {
  pageKey: string;
  pageName?: string;
}) {
  const { setPageName } = usePageName();

  useEffect(() => {
    setPageName({ name: pageName || '', key: pageKey });
  }, [pageKey, setPageName, pageName]);

  return null;
}

export default NamePageSetter;
