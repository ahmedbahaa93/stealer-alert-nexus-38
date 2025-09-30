import NamePageSetter from '@/components/NamePageSetter';
import UserInfo from '@/components/user/user-info/UserInfo';

function Page() {
  return (
    <>
      <UserInfo />
      <NamePageSetter pageKey="user-info" />
    </>
  );
}

export default Page;
