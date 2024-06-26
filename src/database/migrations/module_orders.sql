create type public.payment_status as enum ('PENDING', 'PAID', 'EXPIRED', 'DECLINED');
create type public.order_status as enum ('WAITING_PAYMENT', 'PAYMENT_ERROR', 'PAYMENT_PAID', 'WAITING_APPROVAL', 'IN_PROGRESS', 'ON_DELIVERY', 'DELIVERED', 'COMPLETED');

create table if not exists public.sales_orders (
  id bigint generated by default as identity constraint sales_orders_pkey primary key,
  user_id bigint references public.users,
  status public.payment_status default 'PENDING'::payment_status,
  amount numeric,
  payment_metadata jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone
);

create table if not exists public.orders (
  id bigint generated by default as identity constraint orders_pkey primary key,
  sales_order_id bigint references public.sales_orders,
  user_id bigint references public.users,
  shop_id bigint references public.shops,
  status public.order_status default 'WAITING_PAYMENT'::order_status,
  amount numeric,
  shipping_metadata jsonb,
  user_metadata jsonb,
  shop_metadata jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone
);

create table if not exists public.order_items (
  id bigint generated by default as identity constraint order_items_pkey primary key,
  order_id bigint references public.orders,
  product_id bigint references public.products,
  warehouse_id bigint references public.warehouses,
  quantity numeric,
  price numeric,
  product_metadata jsonb,
  warehouse_metadata jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone
);