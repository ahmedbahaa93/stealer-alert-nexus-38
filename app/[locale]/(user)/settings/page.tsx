import NamePageSetter from '@/components/NamePageSetter';
import Settings from '@/components/user/settings/Settings';

function Page() {
  return (
    <>
      <Settings />
      <NamePageSetter pageKey="settings" />
    </>
  );
}

export default Page;
