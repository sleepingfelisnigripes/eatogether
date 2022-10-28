PGDMP         &            	    z        
   eatogether    14.1    14.4 C    F           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            G           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            H           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            I           1262    16384 
   eatogether    DATABASE     ^   CREATE DATABASE eatogether WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.utf8';
    DROP DATABASE eatogether;
                postgres    false            �            1259    16385    conversation    TABLE     �   CREATE TABLE public.conversation (
    conversation_id integer NOT NULL,
    group_id integer NOT NULL,
    user_id integer NOT NULL,
    conversation_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    conversation_text text NOT NULL
);
     DROP TABLE public.conversation;
       public         heap    postgres    false            �            1259    16391     conversation_conversation_id_seq    SEQUENCE     �   CREATE SEQUENCE public.conversation_conversation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 7   DROP SEQUENCE public.conversation_conversation_id_seq;
       public          postgres    false    209            J           0    0     conversation_conversation_id_seq    SEQUENCE OWNED BY     e   ALTER SEQUENCE public.conversation_conversation_id_seq OWNED BY public.conversation.conversation_id;
          public          postgres    false    210            �            1259    16392    group    TABLE       CREATE TABLE public."group" (
    group_id integer NOT NULL,
    restaurant_id integer NOT NULL,
    group_meeting_timestamp timestamp with time zone NOT NULL,
    group_maximum smallint DEFAULT 6 NOT NULL,
    group_init_user_id integer DEFAULT 0 NOT NULL
);
    DROP TABLE public."group";
       public         heap    postgres    false            �            1259    16397    group_group_id_seq    SEQUENCE     �   CREATE SEQUENCE public.group_group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.group_group_id_seq;
       public          postgres    false    211            K           0    0    group_group_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.group_group_id_seq OWNED BY public."group".group_id;
          public          postgres    false    212            �            1259    16398 
   restaurant    TABLE     a  CREATE TABLE public.restaurant (
    restaurant_id integer NOT NULL,
    restaurant_name text NOT NULL,
    restaurant_image text,
    restaurant_cuisine_type text,
    restaurant_address text,
    restaurant_lat numeric NOT NULL,
    restaurant_lng numeric NOT NULL,
    restaurant_open_hours text,
    restaurant_rating smallint DEFAULT 5 NOT NULL
);
    DROP TABLE public.restaurant;
       public         heap    postgres    false            �            1259    16404    restaurant_id_seq    SEQUENCE     �   CREATE SEQUENCE public.restaurant_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.restaurant_id_seq;
       public          postgres    false    213            L           0    0    restaurant_id_seq    SEQUENCE OWNED BY     R   ALTER SEQUENCE public.restaurant_id_seq OWNED BY public.restaurant.restaurant_id;
          public          postgres    false    214            �            1259    16405    review    TABLE       CREATE TABLE public.review (
    review_id integer NOT NULL,
    restaurant_id integer NOT NULL,
    reviewer_id integer NOT NULL,
    review_rating smallint NOT NULL,
    review_text text,
    review_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    review_image text
);
    DROP TABLE public.review;
       public         heap    postgres    false            �            1259    16411    review_review_id_seq    SEQUENCE     �   CREATE SEQUENCE public.review_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.review_review_id_seq;
       public          postgres    false    215            M           0    0    review_review_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.review_review_id_seq OWNED BY public.review.review_id;
          public          postgres    false    216            �            1259    16412    user    TABLE     �   CREATE TABLE public."user" (
    user_id integer NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    gender text NOT NULL,
    user_photo text
);
    DROP TABLE public."user";
       public         heap    postgres    false            �            1259    16417    user_favourite_restaurant    TABLE     �   CREATE TABLE public.user_favourite_restaurant (
    user_favourite_id integer NOT NULL,
    user_id integer NOT NULL,
    restaurant_id integer NOT NULL,
    active boolean DEFAULT false NOT NULL
);
 -   DROP TABLE public.user_favourite_restaurant;
       public         heap    postgres    false            �            1259    16421 /   user_favourite_restaurant_user_favourite_id_seq    SEQUENCE     �   CREATE SEQUENCE public.user_favourite_restaurant_user_favourite_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 F   DROP SEQUENCE public.user_favourite_restaurant_user_favourite_id_seq;
       public          postgres    false    218            N           0    0 /   user_favourite_restaurant_user_favourite_id_seq    SEQUENCE OWNED BY     �   ALTER SEQUENCE public.user_favourite_restaurant_user_favourite_id_seq OWNED BY public.user_favourite_restaurant.user_favourite_id;
          public          postgres    false    219            �            1259    16422 
   user_group    TABLE     �   CREATE TABLE public.user_group (
    user_group_id integer NOT NULL,
    group_id integer NOT NULL,
    user_id integer NOT NULL,
    joined_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    active boolean DEFAULT true NOT NULL
);
    DROP TABLE public.user_group;
       public         heap    postgres    false            �            1259    16426    user_group_user_group_id_seq    SEQUENCE     �   CREATE SEQUENCE public.user_group_user_group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE public.user_group_user_group_id_seq;
       public          postgres    false    220            O           0    0    user_group_user_group_id_seq    SEQUENCE OWNED BY     ]   ALTER SEQUENCE public.user_group_user_group_id_seq OWNED BY public.user_group.user_group_id;
          public          postgres    false    221            �            1259    16427    user_id_seq    SEQUENCE     �   CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.user_id_seq;
       public          postgres    false    217            P           0    0    user_id_seq    SEQUENCE OWNED BY     B   ALTER SEQUENCE public.user_id_seq OWNED BY public."user".user_id;
          public          postgres    false    222            }           2604    16428    conversation conversation_id    DEFAULT     �   ALTER TABLE ONLY public.conversation ALTER COLUMN conversation_id SET DEFAULT nextval('public.conversation_conversation_id_seq'::regclass);
 K   ALTER TABLE public.conversation ALTER COLUMN conversation_id DROP DEFAULT;
       public          postgres    false    210    209            �           2604    16429    group group_id    DEFAULT     r   ALTER TABLE ONLY public."group" ALTER COLUMN group_id SET DEFAULT nextval('public.group_group_id_seq'::regclass);
 ?   ALTER TABLE public."group" ALTER COLUMN group_id DROP DEFAULT;
       public          postgres    false    212    211            �           2604    16430    restaurant restaurant_id    DEFAULT     y   ALTER TABLE ONLY public.restaurant ALTER COLUMN restaurant_id SET DEFAULT nextval('public.restaurant_id_seq'::regclass);
 G   ALTER TABLE public.restaurant ALTER COLUMN restaurant_id DROP DEFAULT;
       public          postgres    false    214    213            �           2604    16431    review review_id    DEFAULT     t   ALTER TABLE ONLY public.review ALTER COLUMN review_id SET DEFAULT nextval('public.review_review_id_seq'::regclass);
 ?   ALTER TABLE public.review ALTER COLUMN review_id DROP DEFAULT;
       public          postgres    false    216    215            �           2604    16432    user user_id    DEFAULT     i   ALTER TABLE ONLY public."user" ALTER COLUMN user_id SET DEFAULT nextval('public.user_id_seq'::regclass);
 =   ALTER TABLE public."user" ALTER COLUMN user_id DROP DEFAULT;
       public          postgres    false    222    217            �           2604    16433 +   user_favourite_restaurant user_favourite_id    DEFAULT     �   ALTER TABLE ONLY public.user_favourite_restaurant ALTER COLUMN user_favourite_id SET DEFAULT nextval('public.user_favourite_restaurant_user_favourite_id_seq'::regclass);
 Z   ALTER TABLE public.user_favourite_restaurant ALTER COLUMN user_favourite_id DROP DEFAULT;
       public          postgres    false    219    218            �           2604    16434    user_group user_group_id    DEFAULT     �   ALTER TABLE ONLY public.user_group ALTER COLUMN user_group_id SET DEFAULT nextval('public.user_group_user_group_id_seq'::regclass);
 G   ALTER TABLE public.user_group ALTER COLUMN user_group_id DROP DEFAULT;
       public          postgres    false    221    220            6          0    16385    conversation 
   TABLE DATA                 public          postgres    false    209   R       8          0    16392    group 
   TABLE DATA                 public          postgres    false    211   �R       :          0    16398 
   restaurant 
   TABLE DATA                 public          postgres    false    213   �S       <          0    16405    review 
   TABLE DATA                 public          postgres    false    215   �W       >          0    16412    user 
   TABLE DATA                 public          postgres    false    217   �X       ?          0    16417    user_favourite_restaurant 
   TABLE DATA                 public          postgres    false    218   �c       A          0    16422 
   user_group 
   TABLE DATA                 public          postgres    false    220   Hd       Q           0    0     conversation_conversation_id_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('public.conversation_conversation_id_seq', 3, true);
          public          postgres    false    210            R           0    0    group_group_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.group_group_id_seq', 16, true);
          public          postgres    false    212            S           0    0    restaurant_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.restaurant_id_seq', 7, true);
          public          postgres    false    214            T           0    0    review_review_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.review_review_id_seq', 11, true);
          public          postgres    false    216            U           0    0 /   user_favourite_restaurant_user_favourite_id_seq    SEQUENCE SET     ^   SELECT pg_catalog.setval('public.user_favourite_restaurant_user_favourite_id_seq', 20, true);
          public          postgres    false    219            V           0    0    user_group_user_group_id_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public.user_group_user_group_id_seq', 43, true);
          public          postgres    false    221            W           0    0    user_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.user_id_seq', 85, true);
          public          postgres    false    222            �           2606    16436    conversation conversation_pkey 
   CONSTRAINT     i   ALTER TABLE ONLY public.conversation
    ADD CONSTRAINT conversation_pkey PRIMARY KEY (conversation_id);
 H   ALTER TABLE ONLY public.conversation DROP CONSTRAINT conversation_pkey;
       public            postgres    false    209            �           2606    16508    group group_group_maximum_check    CHECK CONSTRAINT     p   ALTER TABLE public."group"
    ADD CONSTRAINT group_group_maximum_check CHECK ((group_maximum >= 2)) NOT VALID;
 F   ALTER TABLE public."group" DROP CONSTRAINT group_group_maximum_check;
       public          postgres    false    211    211            �           2606    16438    group group_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public."group"
    ADD CONSTRAINT group_pkey PRIMARY KEY (group_id);
 <   ALTER TABLE ONLY public."group" DROP CONSTRAINT group_pkey;
       public            postgres    false    211            �           2606    16507 E   group group_restaurant_id_group_init_user_id_group_meeting_timest_key 
   CONSTRAINT     �   ALTER TABLE ONLY public."group"
    ADD CONSTRAINT group_restaurant_id_group_init_user_id_group_meeting_timest_key UNIQUE (restaurant_id, group_init_user_id, group_meeting_timestamp) INCLUDE (restaurant_id, group_meeting_timestamp, group_init_user_id);
 q   ALTER TABLE ONLY public."group" DROP CONSTRAINT group_restaurant_id_group_init_user_id_group_meeting_timest_key;
       public            postgres    false    211    211    211            �           2606    16440    restaurant restaurant_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public.restaurant
    ADD CONSTRAINT restaurant_pkey PRIMARY KEY (restaurant_id);
 D   ALTER TABLE ONLY public.restaurant DROP CONSTRAINT restaurant_pkey;
       public            postgres    false    213            �           2606    16442    review review_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_pkey PRIMARY KEY (review_id);
 <   ALTER TABLE ONLY public.review DROP CONSTRAINT review_pkey;
       public            postgres    false    215            �           2606    16444 8   user_favourite_restaurant user_favourite_restaurant_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.user_favourite_restaurant
    ADD CONSTRAINT user_favourite_restaurant_pkey PRIMARY KEY (user_favourite_id);
 b   ALTER TABLE ONLY public.user_favourite_restaurant DROP CONSTRAINT user_favourite_restaurant_pkey;
       public            postgres    false    218            �           2606    16497 Y   user_favourite_restaurant user_favourite_restaurant_user_id_restaurant_id_user_id1_re_key 
   CONSTRAINT     �   ALTER TABLE ONLY public.user_favourite_restaurant
    ADD CONSTRAINT user_favourite_restaurant_user_id_restaurant_id_user_id1_re_key UNIQUE (user_id, restaurant_id) INCLUDE (user_id, restaurant_id);
 �   ALTER TABLE ONLY public.user_favourite_restaurant DROP CONSTRAINT user_favourite_restaurant_user_id_restaurant_id_user_id1_re_key;
       public            postgres    false    218    218            �           2606    16503 =   user_group user_group_group_id_user_id_group_id1_user_id1_key 
   CONSTRAINT     �   ALTER TABLE ONLY public.user_group
    ADD CONSTRAINT user_group_group_id_user_id_group_id1_user_id1_key UNIQUE (group_id, user_id) INCLUDE (group_id, user_id);
 g   ALTER TABLE ONLY public.user_group DROP CONSTRAINT user_group_group_id_user_id_group_id1_user_id1_key;
       public            postgres    false    220    220            �           2606    16446    user_group user_group_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public.user_group
    ADD CONSTRAINT user_group_pkey PRIMARY KEY (user_group_id);
 D   ALTER TABLE ONLY public.user_group DROP CONSTRAINT user_group_pkey;
       public            postgres    false    220            �           2606    16448    user user_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (user_id);
 :   ALTER TABLE ONLY public."user" DROP CONSTRAINT user_pkey;
       public            postgres    false    217            �           2606    16450    user username 
   CONSTRAINT     N   ALTER TABLE ONLY public."user"
    ADD CONSTRAINT username UNIQUE (username);
 9   ALTER TABLE ONLY public."user" DROP CONSTRAINT username;
       public            postgres    false    217            �           2606    16451    user_group group_id    FK CONSTRAINT     {   ALTER TABLE ONLY public.user_group
    ADD CONSTRAINT group_id FOREIGN KEY (group_id) REFERENCES public."group"(group_id);
 =   ALTER TABLE ONLY public.user_group DROP CONSTRAINT group_id;
       public          postgres    false    3215    211    220            �           2606    16456    conversation group_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.conversation
    ADD CONSTRAINT group_id FOREIGN KEY (group_id) REFERENCES public."group"(group_id) NOT VALID;
 ?   ALTER TABLE ONLY public.conversation DROP CONSTRAINT group_id;
       public          postgres    false    209    3215    211            �           2606    16461    group restaurant_id    FK CONSTRAINT     �   ALTER TABLE ONLY public."group"
    ADD CONSTRAINT restaurant_id FOREIGN KEY (restaurant_id) REFERENCES public.restaurant(restaurant_id);
 ?   ALTER TABLE ONLY public."group" DROP CONSTRAINT restaurant_id;
       public          postgres    false    3219    213    211            �           2606    16466    review restaurant_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.review
    ADD CONSTRAINT restaurant_id FOREIGN KEY (restaurant_id) REFERENCES public.restaurant(restaurant_id) NOT VALID;
 >   ALTER TABLE ONLY public.review DROP CONSTRAINT restaurant_id;
       public          postgres    false    215    3219    213            �           2606    16471 '   user_favourite_restaurant restaurant_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_favourite_restaurant
    ADD CONSTRAINT restaurant_id FOREIGN KEY (restaurant_id) REFERENCES public.restaurant(restaurant_id);
 Q   ALTER TABLE ONLY public.user_favourite_restaurant DROP CONSTRAINT restaurant_id;
       public          postgres    false    3219    213    218            �           2606    16476    review reviewer_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.review
    ADD CONSTRAINT reviewer_id FOREIGN KEY (reviewer_id) REFERENCES public."user"(user_id) NOT VALID;
 <   ALTER TABLE ONLY public.review DROP CONSTRAINT reviewer_id;
       public          postgres    false    217    215    3223            �           2606    16481    user_group user_id    FK CONSTRAINT     w   ALTER TABLE ONLY public.user_group
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public."user"(user_id);
 <   ALTER TABLE ONLY public.user_group DROP CONSTRAINT user_id;
       public          postgres    false    220    3223    217            �           2606    16486    conversation user_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.conversation
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public."user"(user_id) NOT VALID;
 >   ALTER TABLE ONLY public.conversation DROP CONSTRAINT user_id;
       public          postgres    false    217    3223    209            �           2606    16491 !   user_favourite_restaurant user_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_favourite_restaurant
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public."user"(user_id);
 K   ALTER TABLE ONLY public.user_favourite_restaurant DROP CONSTRAINT user_id;
       public          postgres    false    217    218    3223            6   �   x���v
Q���W((M��L�K��+K-*N,���S�@��g��(���Y�ũE`���������t�ԊM�0G�P�`cC#u###]C]3CS+c+3=CScmCCu���q
��y%�y%��\\\ Us92      8   �   x���M�@໿b���l�٩C!
ʺ���Bk�����>�C���2�,�0��b=[�-�%zw��},Ϻ�����80(�J��Lsuo��2%�c���Ųx�EH-�V�B%����n���f���!������|r�y�C�01��ĊL1�~���C����y�I�π]@�+`���辁�g���f�dz�����'l��us3f      :   �  x�ݖMs�8���+tKR��$����$@�� J��F��r���!�25;[\9Yj����h�h4;� ��q4)*�j�)&4�>�G����+ؒ��%��Z&Y�F���:9���S�KOl1ӧ}1;�˄�Q(3u:M1���_��F���	�@'dѕ�Z'�]���8�r�,�j"��B'rYJJ�G�%�հ�9�&Q�0�`f���U�A�U�-��=���+l���`\X�̷�o���9����ÚR��<��z�*@�ft�"�<d!�`�r!ŷ b\���C	�9fY�~��[@
�j�f2���G����檵l�d�AM.�~u�y@_��'_�p�^k8hW�
$�q��6[5
��(<��W4a"oRx>S��� ���Ξ)r�"��櫖}s9/&4�l)�D�V�ٰ����Xm*a�*7�W�C�#��u_Y!�����O�����������Φfi�����a���g�{x�:����ہq��9Y�n{.2�+w�_,9�#�a��*�,^�*�83�����l���o|ֳ��:(�Iy���W��d��u�~�����)H��@~�
3�"���h��Z��J�Ssj )�ق��*��:~��?rvm�#!���9�G1%nN�3�{����a[������3���>�m��k��%�W~��Z|���jw$�q���ȶSml �"�s��|�>�!,�LL� hJ��n1s�mL_�c_
����
e���Hs�����Bj2�K��� �!#�gc����}y�D�g=�8��Q�)��%�ݜ�]7t�l��]�u��i��j�?��P�F��_�.�o�ȳT|'�����l�X�'�a�Ov-َm�]`��!1$۲�Yyeug����V����K���+`�㍙`<(�&*L�lvt���35�&�y���b8���w�e[΃��2m����������Ї�;B�����Ӑ�2��o��H������r�>^	����r��.90���|eI�      <   &  x�ՑMo�0���
�D�AHB	;��b�Jw��6�H|��}���X;&���:ɒ�Ɩ��u�n7��i� m�\��䋒����^�6��Dm��X��L�;aT����o�[�jP��U�\.��>�m�� A��B��҃e��:�{蠘R�`3 ,�8ZaĹ�b�-!CC�K��_=��.�Ս�?��\
m`���3��OOW��6g��%��(���.�iu�y�UH
����CZ��mو��c��̧ܝ�un_��7F�	�@E��<�h�e} e;R      >   �
  x���Y������W\E-u"u{�'���y��K��x���Cu.GyI�HE���9{���yI?h�^2����� ���E�_~����?���/J��~�Q{]7U��$*è����Yߪ��������_����Eq�F�o���"ޯ0���B$=�j����G%��>�N�dQ:{+�Sjk���Ǣsͳ�����ӭ���� X�A7���؁0}�����¿ �||����1�s�$�M�繥�x�̌�n6�i�1�SGaQXc�b�W8<�S���x�Ja��R��RO�|���5^���W#�E�9$�c�MrvJVә�b��]\��)����^���WI�ߢ��>��^y��������V�e�2N�''����aO]�8���� V�nתV��8�v�l$g�� ��}�����I���6�S�O�	�YÞ��!fE�d���>�k���&�� �ɡ�|l�'�m?�������u�Ȍ�2�6��z@��Āp$��;�ė8��Ra�<�-N�|'����p��(&(�{�,�@�� �JG��xݺ>�T�{�a=D	�Y�;���s��?9�g�]w���Zal+1����x�f��)���b�D����ɏǷ����wq"?9��ŷ��%eJj]m\�k���E(�V�"UX���I�̨�򺣢�˜$��o�[��Io8��@�T�䁚o@��
(�6 &ʽ��W��O��������%�-Ny��W`h*����Bh�]���`�3��E0��lc��du qh_�;�!^���SK�m.iK��Ϥ�k��!�E�G鄻�9��5����)3�(� f���kE��Z��$���u�{���q��b< 9�+��KR;��LV�`�i��o��̽ׯ��]��tWtH%+渰:��[��S�e�.R�;k� �J�U�y����pq|�Z��o�Sj�:#gS�sh�1�1��Њ�Aq�Ld�'�"��㪯F�_�SC���2���l��MHᬛ�:��vZ*�`�.��k��U�<�������~��ol�*�D�N�*W����(O�#F��#�e�){�� �J������^�O�ښ�"����Ddt��nH�,�Q�r�YL
S��<�ld'�}G�q'�x�.��oh5��j-'O0}�3Ӝ�th��C!���Ýب`N*D�A��hs�<;_`�!���6�zE���ڠ�����b����I,4-��2Ue�MM��(��H�+L�ϰ�l��c�5(���6�B6C�^$�W>Er��̲�Ȃ��%�l�O���)��&��thd�z32�� _;#�m��	��
��r�iy�<w2��bk��8���;*��H�b��H���#ۆ�	c��?	{1	*�X6�6��7{ǱB sN�U�p�oZ���M���H��`XJN�t�ZW��O���]��Y�õ	��>���_���G��j�EJ�車�,ҭ���ɷ��a�Z��KTt��b �P�u*s��pe8P񒱼�(,_=<.%����>�tk-K�N���1��Iʙ�WfB�Uy���r@�h�ϯ&,�C���V�?��*'XNhX�����@_)g�U��]��`��l��V]�^���	���޴)�3ע[�,�H�`ͱ	��yf�t���s��Ct7�e�����<s�Ҽs��wt��������m���X�KGy��"3)z��>Y1�Go�jwf�C� U!`j	����B����g�F�a���M��G�xt#��J�r�Hg�C�ƍ�%��)9�So��o�J���5B��q��8s�<$���`l6�G��\"%F��Ύ�k���G �@�!�k����I���w9��B|+FT^�2�-Y��p��f�ًW0p�������;^�T�8q�t���%!(��[1E�@j8���D��s��4A{��mW��[[Du �#/w�)����d�/���r�� iz���|�w�)"�JYCQ$%E<L�Ze#���͈�$�[�K������C(������h@F��0QkErw�*v�Pm�_�d��};h)��5����~Jo� �q�~��%[U�xr�.E��gR�2�g��h�mt�.��^zY�%�d��4��ip��`W�>�.O������#��ˆ}�`����m�RCcxx��T ���V���ͥ�L�F�.���)#�+͖�RT�/�%�"�6����]U��h�8�R^���Aj���h�p &N@D Oc]H��($}w2n�ۥKu,���%��n�����{Z�Q�}�h5�B����,rQ�L��3r�.�$ls�k�#�R��/�O�$�^Mw9^���[eƺ$�pnxbƑ�븝;I���DF���L_��P�]��|�L�F.�&�3Z��LS���;�/�|��,�.�iU)o��V�|� �]��|z
���J�Gb���S*;(4ۃ����`��UjY*�����)(S��;�P�]��|ND���S��U�q̜�:\�"I�^�Z�mmĒ^��qff�����4������i!�y�|�z�ʟp�
�#1��A����_v�&����
�PN�Z� )<���"��:$�i��6b(�z��T���@�}Y�).�7��ކ���%[)R�}˔񬶑N������l�34 ln���BB���(Jn�\���2:�wQ�ЮV�&,��s�/X��b$��˫V����m�c;W�����f$����G: �LAM0��BD,�<��۟�&�OC���/�       ?   }   x���v
Q���W((M��L�+-N-�OK,�/-�,I�/J-.I,-J�+Q�@��L�Q �u`nbrIfY��B��O�k������%��jZsy��fC��@�������(����f��� �u��      A   Y  x���MO�@�;�bo@,��ٝ�����D�+A���@��w��h��&{���'�L��|1}|��Ӄ8T��b-�S~\���A����d�<5��c_|�eY��S��2�Z��W>/w��Ӆa&�L	�&$���R���0��Ƿ��1��W(դt�"'�Ā,	�I�2�:&�uP�3�Om�=A�:(0ҐV�R�2�������^C�we�REH��1�V��ڞR�|ˢ>��prA��]��/K!(��wخ��4�ɢ��r�rݬ�_�b]y6��
#	uo90 ɨ�S���غ��!f��IAG��R�T��~�o��q��{}     