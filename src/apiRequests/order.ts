import http from '@/lib/http';
import {
  CreateOrdersBodyType,
  CreateOrdersResType,
  GetOrderDetailResType,
  GetOrdersQueryParamsType,
  GetOrdersResType,
  PayGuestOrdersBodyType,
  PayGuestOrdersResType,
  UpdateOrderBodyType,
  UpdateOrderResType,
  GetRevenueResType,
  RejectGuestOrdersBodyType,
  RejectGuestOrdersResType,
} from '@/schemaValidations/order.schema';
import queryString from 'query-string';

const orderApiRequest = {
  createOrders: (body: CreateOrdersBodyType) =>
    http.post<CreateOrdersResType>('/orders', body),
  getOrderList: (queryParams: GetOrdersQueryParamsType) => {
    return http.get<GetOrdersResType>(
      '/orders?' +
        queryString.stringify({
          fromDate: queryParams.fromDate?.toLocaleString('en-US', {
            timeZone: 'Asia/Ho_Chi_Minh',
          }),
          toDate: queryParams.toDate?.toLocaleString('en-US', {
            timeZone: 'Asia/Ho_Chi_Minh',
          }),
        })
    );
  },
  updateOrder: (orderId: number, body: UpdateOrderBodyType) =>
    http.put<UpdateOrderResType>(`/orders/${orderId}`, body),
  getOrderDetail: (orderId: number) =>
    http.get<GetOrderDetailResType>(`/orders/${orderId}`),
  getRevenue: () => http.get<GetRevenueResType>(`/orders/revenue`),
  pay: (body: PayGuestOrdersBodyType) =>
    http.post<PayGuestOrdersResType>(`/orders/pay`, body),
  reject: (body: RejectGuestOrdersBodyType) =>
    http.post<RejectGuestOrdersResType>(`/orders/reject`, body),
};

export default orderApiRequest;
