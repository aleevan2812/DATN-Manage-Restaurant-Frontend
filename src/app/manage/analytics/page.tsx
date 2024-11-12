import accountApiRequest from '@/apiRequests/account';
import ChartOrder from '@/app/manage/analytics/chart-order';
import { cookies } from 'next/headers';

export default async function Analytics() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken')?.value!;
  let name = '';
  try {
    const result = await accountApiRequest.sMe(accessToken);
    name = result.payload.data.name;
  } catch (error: any) {
    if (error.digest?.includes('NEXT_REDIRECT')) {
      throw error;
    }
  }
  return (
    <div>
      <ChartOrder />
    </div>
  );
}
