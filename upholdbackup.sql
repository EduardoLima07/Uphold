PGDMP             	            x           Uphold    12.3    12.3                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    16393    Uphold    DATABASE     �   CREATE DATABASE "Uphold" WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'Portuguese_Brazil.1252' LC_CTYPE = 'Portuguese_Brazil.1252';
    DROP DATABASE "Uphold";
                postgres    false            �            1259    16451    transaction_type    TABLE     s   CREATE TABLE public.transaction_type (
    typeid integer NOT NULL,
    typedesc character varying(50) NOT NULL
);
 $   DROP TABLE public.transaction_type;
       public         heap    postgres    false            �            1259    16458    transaction_type_typeid_seq    SEQUENCE     �   ALTER TABLE public.transaction_type ALTER COLUMN typeid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.transaction_type_typeid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    203            �            1259    16445    transactions    TABLE     �   CREATE TABLE public.transactions (
    transid integer NOT NULL,
    transtype integer NOT NULL,
    transdesc character varying(250) NOT NULL,
    transvalue numeric NOT NULL,
    transprofit double precision NOT NULL,
    transdate date NOT NULL
);
     DROP TABLE public.transactions;
       public         heap    postgres    false            �            1259    16462    transactions_transid_seq    SEQUENCE     �   ALTER TABLE public.transactions ALTER COLUMN transid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.transactions_transid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    202            	          0    16451    transaction_type 
   TABLE DATA           <   COPY public.transaction_type (typeid, typedesc) FROM stdin;
    public          postgres    false    203   [                 0    16445    transactions 
   TABLE DATA           i   COPY public.transactions (transid, transtype, transdesc, transvalue, transprofit, transdate) FROM stdin;
    public          postgres    false    202   �                  0    0    transaction_type_typeid_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public.transaction_type_typeid_seq', 4, true);
          public          postgres    false    204                       0    0    transactions_transid_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.transactions_transid_seq', 295, true);
          public          postgres    false    205            �
           2606    16457 &   transaction_type transaction_type_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.transaction_type
    ADD CONSTRAINT transaction_type_pkey PRIMARY KEY (typeid);
 P   ALTER TABLE ONLY public.transaction_type DROP CONSTRAINT transaction_type_pkey;
       public            postgres    false    203            �
           2606    16461    transactions transactions_pkey 
   CONSTRAINT     a   ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (transid);
 H   ALTER TABLE ONLY public.transactions DROP CONSTRAINT transactions_pkey;
       public            postgres    false    202            	   &   x�3�t*��2�N���2�qq�2��F\1z\\\ �>�         �   x�}�=n�0��>�/�?2%eL��1S�&������JaC&`n����gKI�pz�^o������O����8VV�ɲL�%��Ё�4H�}-V1��鲯9#'�
]nu�@'S�Х�hƔX�t:X�*&Rf���=�)�6�R���2�T�m���5��P���Z�]́&�9��fK:��T�v�R�������]��<W�_K�o��F_p��ٷ     