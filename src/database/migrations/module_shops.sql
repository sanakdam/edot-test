create type public.shop_status as enum ('ACTIVE', 'INACTIVE');
create type public.warehouse_status as enum ('ACTIVE', 'INACTIVE');
create type public.product_status as enum ('ON_REVIEW', 'ACTIVE', 'INACTIVE');

create table if not exists public.shops (
  id bigint generated by default as identity constraint shops_pkey primary key,
  user_id bigint references public.users,
  name varchar,
  status public.shop_status,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone
);

create table if not exists public.products (
  id bigint generated by default as identity constraint products_pkey primary key,
  shop_id bigint references public.shops,
  name varchar,
  status public.product_status default 'ON_REVIEW'::product_status,
  description text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone
);

create table if not exists public.warehouses (
  id bigint generated by default as identity constraint warehouses_pkey primary key,
  shop_id bigint references public.shops,
  status public.warehouse_status default 'ACTIVE'::warehouse_status,
  name varchar,
  location varchar,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone
);

create table if not exists public.product_stocks (
  id bigint generated by default as identity constraint product_stocks_pkey primary key,
  product_id bigint references public.products,
  shop_id bigint references public.shops,
  warehouse_id bigint references public.warehouses,
  quantity numeric,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone
);