SET standard_conforming_strings = off;
SET check_function_bodies = false;
SET escape_string_warning = off;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;
CREATE TABLE public.cart_items (
    id uuid DEFAULT public.uuid_generate_v1() NOT NULL,
    product_id uuid NOT NULL,
    cart_id uuid NOT NULL,
    quantity integer NOT NULL
);
CREATE TABLE public.carts (
    id uuid DEFAULT public.uuid_generate_v1() NOT NULL,
    user_id uuid NOT NULL,
    is_complete boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);
CREATE TABLE public.categories (
    id uuid DEFAULT public.uuid_generate_v1() NOT NULL,
    name text NOT NULL
);
CREATE TABLE public.manufacturers (
    id uuid DEFAULT public.uuid_generate_v1() NOT NULL,
    name text NOT NULL
);
CREATE TABLE public.products (
    id uuid DEFAULT public.uuid_generate_v1() NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    price integer NOT NULL,
    manufacturer uuid NOT NULL,
    category uuid NOT NULL,
    image text NOT NULL,
    country_of_origin text NOT NULL
);
CREATE TABLE public.reviews (
    id uuid DEFAULT public.uuid_generate_v1() NOT NULL,
    product_id uuid NOT NULL,
    user_id uuid NOT NULL,
    rating integer NOT NULL,
    text text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);
CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v1() NOT NULL,
    name text NOT NULL,
    email text NOT NULL
);
ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.manufacturers
    ADD CONSTRAINT manufacturers_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
CREATE TRIGGER set_public_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_reviews_updated_at ON public.reviews IS 'trigger to set value of column "updated_at" to current timestamp on row update';
ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_cart_id_foreign FOREIGN KEY (cart_id) REFERENCES public.carts(id);
ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_id_foreign FOREIGN KEY (product_id) REFERENCES public.products(id);
ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_foreign FOREIGN KEY (category) REFERENCES public.categories(id);
ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_manufacturer_foreign FOREIGN KEY (manufacturer) REFERENCES public.manufacturers(id);
ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_product_id_foreign FOREIGN KEY (product_id) REFERENCES public.products(id);
ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id);
