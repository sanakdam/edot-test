--
-- PostgreSQL database dump
--

-- Dumped from database version 14.12 (Ubuntu 14.12-1.pgdg22.04+1)
-- Dumped by pg_dump version 16.3 (Ubuntu 16.3-1.pgdg22.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: order_status; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public.order_status AS ENUM (
    'WAITING_PAYMENT',
    'PAYMENT_ERROR',
    'PAYMENT_PAID',
    'WAITING_APPROVAL',
    'IN_PROGRESS',
    'ON_DELIVERY',
    'DELIVERED',
    'COMPLETED'
);


ALTER TYPE public.order_status OWNER TO root;

--
-- Name: payment_status; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public.payment_status AS ENUM (
    'PENDING',
    'PAID',
    'EXPIRED',
    'DECLINED'
);


ALTER TYPE public.payment_status OWNER TO root;

--
-- Name: product_status; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public.product_status AS ENUM (
    'ON_REVIEW',
    'ACTIVE',
    'INACTIVE'
);


ALTER TYPE public.product_status OWNER TO root;

--
-- Name: shop_status; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public.shop_status AS ENUM (
    'ACTIVE',
    'INACTIVE'
);


ALTER TYPE public.shop_status OWNER TO root;

--
-- Name: user_type; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public.user_type AS ENUM (
    'CUSTOMER',
    'SHOP'
);


ALTER TYPE public.user_type OWNER TO root;

--
-- Name: warehouse_status; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public.warehouse_status AS ENUM (
    'ACTIVE',
    'INACTIVE'
);


ALTER TYPE public.warehouse_status OWNER TO root;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.order_items (
    id bigint NOT NULL,
    order_id bigint,
    product_id bigint,
    warehouse_id bigint,
    quantity numeric,
    price numeric,
    product_metadata jsonb,
    warehouse_metadata jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);


ALTER TABLE public.order_items OWNER TO root;

--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

ALTER TABLE public.order_items ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.order_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: orders; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.orders (
    id bigint NOT NULL,
    sales_order_id bigint,
    user_id bigint,
    shop_id bigint,
    status public.order_status DEFAULT 'WAITING_PAYMENT'::public.order_status,
    amount numeric,
    user_metadata jsonb,
    shop_metadata jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone,
    shipping_metadata jsonb
);


ALTER TABLE public.orders OWNER TO root;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

ALTER TABLE public.orders ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: product_stocks; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.product_stocks (
    id bigint NOT NULL,
    product_id bigint,
    shop_id bigint,
    warehouse_id bigint,
    quantity numeric,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);


ALTER TABLE public.product_stocks OWNER TO root;

--
-- Name: product_stocks_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

ALTER TABLE public.product_stocks ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.product_stocks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: products; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.products (
    id bigint NOT NULL,
    shop_id bigint,
    name character varying,
    status public.product_status DEFAULT 'ON_REVIEW'::public.product_status,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone,
    price numeric
);


ALTER TABLE public.products OWNER TO root;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

ALTER TABLE public.products ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: sales_orders; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.sales_orders (
    id bigint NOT NULL,
    user_id bigint,
    status public.payment_status DEFAULT 'PENDING'::public.payment_status,
    amount numeric,
    payment_metadata jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);


ALTER TABLE public.sales_orders OWNER TO root;

--
-- Name: sales_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

ALTER TABLE public.sales_orders ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.sales_orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: shops; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.shops (
    id bigint NOT NULL,
    name character varying,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone,
    status public.shop_status,
    user_id bigint
);


ALTER TABLE public.shops OWNER TO root;

--
-- Name: shops_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

ALTER TABLE public.shops ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.shops_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    name character varying,
    email character varying,
    phone character varying,
    password text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone,
    type public.user_type
);


ALTER TABLE public.users OWNER TO root;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: warehouses; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.warehouses (
    id bigint NOT NULL,
    shop_id bigint,
    status public.warehouse_status DEFAULT 'ACTIVE'::public.warehouse_status,
    name character varying,
    location character varying,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);


ALTER TABLE public.warehouses OWNER TO root;

--
-- Name: warehouses_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

ALTER TABLE public.warehouses ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.warehouses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.order_items (id, order_id, product_id, warehouse_id, quantity, price, product_metadata, warehouse_metadata, created_at, updated_at) FROM stdin;
1	1	1	2	2	15000	{"id": "1", "name": "Product 1", "price": "15000", "shopId": "13", "shopName": "San Shop", "description": "Description 1"}	{"id": "2", "name": "Warehouse 1", "location": "Jakarta"}	2024-05-30 15:36:49.284813-04	2024-05-30 15:36:49.284813-04
2	2	1	4	2	15000	{"id": "1", "name": "Product 1", "price": "15000", "shopId": "13", "shopName": "San Shop", "description": "Description 1"}	{"id": "4", "name": "Warehouse 3", "location": "Surabaya"}	2024-05-30 15:38:19.542965-04	2024-05-30 15:38:19.542965-04
3	3	1	2	2	15000	{"id": "1", "name": "Product 1", "price": "15000", "shopId": "13", "shopName": "San Shop", "description": "Description 1"}	{"id": "2", "name": "Warehouse 1", "location": "Jakarta"}	2024-05-30 15:40:10.065947-04	2024-05-30 15:40:10.065947-04
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.orders (id, sales_order_id, user_id, shop_id, status, amount, user_metadata, shop_metadata, created_at, updated_at, shipping_metadata) FROM stdin;
1	1	13	13	WAITING_PAYMENT	500030000	{"id": "13", "name": "San", "email": "san.akdam@gmail.com", "phone": "08123456789", "createdAt": "2024-05-30T02:05:27.622Z"}	{"id": "13", "name": "San Shop", "status": "ACTIVE", "picName": "San", "picEmail": "san.shop@gmail.com", "picPhone": "081234567810", "createdAt": "2024-05-30T12:12:23.906Z"}	2024-05-30 15:36:49.284813-04	2024-05-30 15:36:49.284813-04	{"fee": "5000", "method": "COD"}
2	2	13	13	WAITING_PAYMENT	500030000	{"id": "13", "name": "San", "email": "san.akdam@gmail.com", "phone": "08123456789", "createdAt": "2024-05-30T02:05:27.622Z"}	{"id": "13", "name": "San Shop", "status": "ACTIVE", "picName": "San", "picEmail": "san.shop@gmail.com", "picPhone": "081234567810", "createdAt": "2024-05-30T12:12:23.906Z"}	2024-05-30 15:38:19.542965-04	2024-05-30 15:38:19.542965-04	{"fee": "5000", "method": "COD"}
3	3	13	13	WAITING_PAYMENT	35000	{"id": "13", "name": "San", "email": "san.akdam@gmail.com", "phone": "08123456789", "createdAt": "2024-05-30T02:05:27.622Z"}	{"id": "13", "name": "San Shop", "status": "ACTIVE", "picName": "San", "picEmail": "san.shop@gmail.com", "picPhone": "081234567810", "createdAt": "2024-05-30T12:12:23.906Z"}	2024-05-30 15:40:10.065947-04	2024-05-30 15:40:10.065947-04	{"fee": "5000", "method": "COD"}
\.


--
-- Data for Name: product_stocks; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.product_stocks (id, product_id, shop_id, warehouse_id, quantity, created_at, updated_at) FROM stdin;
2	1	13	3	5	2024-05-30 09:15:05.666375-04	2024-05-30 09:15:05.666375-04
4	2	13	2	5	2024-05-30 13:41:07.298565-04	2024-05-30 13:41:07.298565-04
3	1	13	4	0	2024-05-30 09:15:05.666375-04	2024-05-30 09:15:05.666375-04
1	1	13	2	1	2024-05-30 09:15:05.666375-04	2024-05-30 09:15:05.666375-04
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.products (id, shop_id, name, status, description, created_at, updated_at, price) FROM stdin;
1	13	Product 1	ACTIVE	Description 1	2024-05-30 09:15:05.666375-04	2024-05-30 09:15:05.666375-04	15000
2	13	Product 1	ACTIVE	Description 1	2024-05-30 13:41:07.298565-04	2024-05-30 13:41:07.298565-04	12000
\.


--
-- Data for Name: sales_orders; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.sales_orders (id, user_id, status, amount, payment_metadata, created_at, updated_at) FROM stdin;
1	13	PENDING	500030000	{"fee": "0", "method": "CASH"}	2024-05-30 15:36:49.284813-04	2024-05-30 15:36:49.284813-04
2	13	PENDING	500030000	{"fee": "0", "method": "CASH"}	2024-05-30 15:38:19.542965-04	2024-05-30 15:38:19.542965-04
3	13	PENDING	35000	{"fee": "0", "method": "CASH"}	2024-05-30 15:40:10.065947-04	2024-05-30 15:40:10.065947-04
\.


--
-- Data for Name: shops; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.shops (id, name, created_at, updated_at, status, user_id) FROM stdin;
13	San Shop	2024-05-30 08:12:23.906563-04	2024-05-30 08:12:23.906563-04	ACTIVE	32
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.users (id, name, email, phone, password, created_at, updated_at, type) FROM stdin;
13	San	san.akdam@gmail.com	08123456789	$2b$10$d/grSw9t8HHJf9sRR/bZyuhjfMJomcGVkzZzTYBD2ez4.XD8h.Mxa	2024-05-29 22:05:27.622401-04	2024-05-29 22:05:27.622401-04	CUSTOMER
32	San	san.shop@gmail.com	081234567810	$2b$10$yczfT5zvYokIb65xu6b24.3C1zjAcu1SuL6ZZQZR4sjE/DblKmb1G	2024-05-30 08:12:23.906563-04	2024-05-30 08:12:23.906563-04	SHOP
\.


--
-- Data for Name: warehouses; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.warehouses (id, shop_id, status, name, location, created_at, updated_at) FROM stdin;
2	13	ACTIVE	Warehouse 1	Jakarta	2024-05-30 08:12:23.906563-04	2024-05-30 08:12:23.906563-04
3	13	INACTIVE	Warehouse 2	Malang	2024-05-30 05:17:15.339-04	2024-05-30 05:17:14.021-04
4	13	ACTIVE	Warehouse 3	Surabaya	2024-05-30 09:29:25.615-04	2024-05-30 09:29:26.694-04
\.


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.order_items_id_seq', 3, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.orders_id_seq', 3, true);


--
-- Name: product_stocks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.product_stocks_id_seq', 4, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.products_id_seq', 2, true);


--
-- Name: sales_orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.sales_orders_id_seq', 3, true);


--
-- Name: shops_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.shops_id_seq', 13, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.users_id_seq', 33, true);


--
-- Name: warehouses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.warehouses_id_seq', 4, true);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: product_stocks product_stocks_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.product_stocks
    ADD CONSTRAINT product_stocks_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: sales_orders sales_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.sales_orders
    ADD CONSTRAINT sales_orders_pkey PRIMARY KEY (id);


--
-- Name: shops shops_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.shops
    ADD CONSTRAINT shops_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: warehouses warehouses_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.warehouses
    ADD CONSTRAINT warehouses_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: order_items order_items_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id);


--
-- Name: orders orders_sales_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_sales_order_id_fkey FOREIGN KEY (sales_order_id) REFERENCES public.sales_orders(id);


--
-- Name: orders orders_shop_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES public.shops(id);


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: product_stocks product_stocks_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.product_stocks
    ADD CONSTRAINT product_stocks_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: product_stocks product_stocks_shop_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.product_stocks
    ADD CONSTRAINT product_stocks_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES public.shops(id);


--
-- Name: product_stocks product_stocks_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.product_stocks
    ADD CONSTRAINT product_stocks_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id);


--
-- Name: products products_shop_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES public.shops(id);


--
-- Name: sales_orders sales_orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.sales_orders
    ADD CONSTRAINT sales_orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: shops shops_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.shops
    ADD CONSTRAINT shops_user_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: warehouses warehouses_shop_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.warehouses
    ADD CONSTRAINT warehouses_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES public.shops(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

