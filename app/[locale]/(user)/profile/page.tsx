import NamePageSetter from '@/components/NamePageSetter';
import Profile from '@/components/user/profile/Profile';

function Page() {
  return (
    <>
      <Profile />
      <NamePageSetter pageKey="profile" />
    </>
  );
}

export default Page;
