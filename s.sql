--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (Ubuntu 16.9-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.9 (Ubuntu 16.9-0ubuntu0.24.04.1)

-- Started on 2025-07-31 06:17:57 WAT

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
-- TOC entry 215 (class 1259 OID 32885)
-- Name: global_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.global_id_seq
    START WITH 10000000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 216 (class 1259 OID 32886)
-- Name: conversation_participants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conversation_participants (
    role text DEFAULT 'member'::text,
    joined_at timestamp without time zone DEFAULT now(),
    id bigint DEFAULT nextval('public.global_id_seq'::regclass) NOT NULL,
    conversation_id bigint,
    user_id bigint,
    CONSTRAINT conversation_participants_role_check CHECK ((role = ANY (ARRAY['member'::text, 'admin'::text])))
);


--
-- TOC entry 217 (class 1259 OID 32895)
-- Name: conversations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conversations (
    type text DEFAULT 'private'::text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    name text,
    new_id bigint DEFAULT ((((EXTRACT(epoch FROM now()))::bigint % (1000000)::bigint) * 100) + (floor(((random() * (9000)::double precision) + (1000)::double precision)))::bigint),
    id bigint DEFAULT nextval('public.global_id_seq'::regclass) NOT NULL,
    last_updated timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT conversations_type_check CHECK ((type = ANY (ARRAY['private'::text, 'group'::text])))
);


--
-- TOC entry 225 (class 1259 OID 32981)
-- Name: courses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.courses (
    id integer NOT NULL,
    title character varying(100) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 224 (class 1259 OID 32980)
-- Name: courses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.courses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3569 (class 0 OID 0)
-- Dependencies: 224
-- Name: courses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.courses_id_seq OWNED BY public.courses.id;


--
-- TOC entry 231 (class 1259 OID 33021)
-- Name: file_contents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.file_contents (
    id integer NOT NULL,
    file_id integer,
    title character varying(100),
    content text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at date
);


--
-- TOC entry 230 (class 1259 OID 33020)
-- Name: file_contents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.file_contents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3570 (class 0 OID 0)
-- Dependencies: 230
-- Name: file_contents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.file_contents_id_seq OWNED BY public.file_contents.id;


--
-- TOC entry 238 (class 1259 OID 33109)
-- Name: global_files_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.global_files_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 229 (class 1259 OID 33006)
-- Name: files; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.files (
    id integer DEFAULT nextval('public.global_files_seq'::regclass) NOT NULL,
    user_id integer,
    type character varying,
    name character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    parent_id bigint,
    path text
);


--
-- TOC entry 228 (class 1259 OID 33005)
-- Name: files_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3571 (class 0 OID 0)
-- Dependencies: 228
-- Name: files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.files_id_seq OWNED BY public.files.id;


--
-- TOC entry 237 (class 1259 OID 33090)
-- Name: folders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.folders (
    id integer DEFAULT nextval('public.global_files_seq'::regclass) NOT NULL,
    name text NOT NULL,
    parent_id bigint,
    user_id bigint NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    path text
);


--
-- TOC entry 236 (class 1259 OID 33089)
-- Name: folders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.folders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3572 (class 0 OID 0)
-- Dependencies: 236
-- Name: folders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.folders_id_seq OWNED BY public.folders.id;


--
-- TOC entry 218 (class 1259 OID 32906)
-- Name: messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.messages (
    message text,
    attachment text,
    reaction character varying(20) DEFAULT NULL::character varying,
    sender_id bigint,
    id bigint DEFAULT nextval('public.global_id_seq'::regclass) NOT NULL,
    conversation_id bigint,
    created_at timestamp without time zone,
    reply bigint,
    type character(341)
);


--
-- TOC entry 219 (class 1259 OID 32913)
-- Name: messages_last_read; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.messages_last_read (
    id integer NOT NULL,
    user_id integer NOT NULL,
    conversation_id integer NOT NULL,
    last_updated timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    last_count integer DEFAULT 0 NOT NULL
);


--
-- TOC entry 235 (class 1259 OID 33075)
-- Name: projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    user_id integer NOT NULL,
    name text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 234 (class 1259 OID 33074)
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3573 (class 0 OID 0)
-- Dependencies: 234
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- TOC entry 227 (class 1259 OID 32991)
-- Name: sections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sections (
    id integer NOT NULL,
    course_id integer,
    title character varying(100),
    description text,
    code text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 226 (class 1259 OID 32990)
-- Name: sections_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3574 (class 0 OID 0)
-- Dependencies: 226
-- Name: sections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sections_id_seq OWNED BY public.sections.id;


--
-- TOC entry 220 (class 1259 OID 32918)
-- Name: unread_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.unread_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3575 (class 0 OID 0)
-- Dependencies: 220
-- Name: unread_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.unread_messages_id_seq OWNED BY public.messages_last_read.id;


--
-- TOC entry 221 (class 1259 OID 32919)
-- Name: user_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_images (
    id integer NOT NULL,
    user_id integer NOT NULL,
    image_path text NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 222 (class 1259 OID 32926)
-- Name: user_images_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3576 (class 0 OID 0)
-- Dependencies: 222
-- Name: user_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_images_id_seq OWNED BY public.user_images.id;


--
-- TOC entry 233 (class 1259 OID 33056)
-- Name: user_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_settings (
    id integer NOT NULL,
    user_id bigint,
    setting_key text NOT NULL,
    setting_value jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 232 (class 1259 OID 33055)
-- Name: user_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3577 (class 0 OID 0)
-- Dependencies: 232
-- Name: user_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_settings_id_seq OWNED BY public.user_settings.id;


--
-- TOC entry 223 (class 1259 OID 32927)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    name text,
    email text,
    password text,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    id bigint DEFAULT nextval('public.global_id_seq'::regclass) NOT NULL,
    age integer,
    gender text,
    bio text,
    country text,
    last_seen timestamp with time zone,
    salt text
);


--
-- TOC entry 3359 (class 2604 OID 32984)
-- Name: courses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses ALTER COLUMN id SET DEFAULT nextval('public.courses_id_seq'::regclass);


--
-- TOC entry 3365 (class 2604 OID 33024)
-- Name: file_contents id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.file_contents ALTER COLUMN id SET DEFAULT nextval('public.file_contents_id_seq'::regclass);


--
-- TOC entry 3351 (class 2604 OID 32934)
-- Name: messages_last_read id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages_last_read ALTER COLUMN id SET DEFAULT nextval('public.unread_messages_id_seq'::regclass);


--
-- TOC entry 3370 (class 2604 OID 33078)
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- TOC entry 3361 (class 2604 OID 32994)
-- Name: sections id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sections ALTER COLUMN id SET DEFAULT nextval('public.sections_id_seq'::regclass);


--
-- TOC entry 3354 (class 2604 OID 32935)
-- Name: user_images id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_images ALTER COLUMN id SET DEFAULT nextval('public.user_images_id_seq'::regclass);


--
-- TOC entry 3367 (class 2604 OID 33059)
-- Name: user_settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_settings ALTER COLUMN id SET DEFAULT nextval('public.user_settings_id_seq'::regclass);


--
-- TOC entry 3377 (class 2606 OID 32937)
-- Name: conversation_participants conversation_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation_participants
    ADD CONSTRAINT conversation_participants_pkey PRIMARY KEY (id);


--
-- TOC entry 3379 (class 2606 OID 32939)
-- Name: conversations conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_pkey PRIMARY KEY (id);


--
-- TOC entry 3391 (class 2606 OID 32989)
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- TOC entry 3397 (class 2606 OID 33029)
-- Name: file_contents file_contents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.file_contents
    ADD CONSTRAINT file_contents_pkey PRIMARY KEY (id);


--
-- TOC entry 3395 (class 2606 OID 33014)
-- Name: files files_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);


--
-- TOC entry 3407 (class 2606 OID 33098)
-- Name: folders folders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.folders
    ADD CONSTRAINT folders_pkey PRIMARY KEY (id);


--
-- TOC entry 3381 (class 2606 OID 32941)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- TOC entry 3405 (class 2606 OID 33083)
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- TOC entry 3393 (class 2606 OID 32999)
-- Name: sections sections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_pkey PRIMARY KEY (id);


--
-- TOC entry 3399 (class 2606 OID 33041)
-- Name: file_contents unique_file_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.file_contents
    ADD CONSTRAINT unique_file_id UNIQUE (file_id);


--
-- TOC entry 3383 (class 2606 OID 32943)
-- Name: messages_last_read unique_user_convo; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages_last_read
    ADD CONSTRAINT unique_user_convo UNIQUE (user_id, conversation_id);


--
-- TOC entry 3385 (class 2606 OID 32945)
-- Name: messages_last_read unread_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages_last_read
    ADD CONSTRAINT unread_messages_pkey PRIMARY KEY (id);


--
-- TOC entry 3387 (class 2606 OID 32947)
-- Name: user_images user_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_images
    ADD CONSTRAINT user_images_pkey PRIMARY KEY (id);


--
-- TOC entry 3401 (class 2606 OID 33065)
-- Name: user_settings user_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_settings
    ADD CONSTRAINT user_settings_pkey PRIMARY KEY (id);


--
-- TOC entry 3403 (class 2606 OID 33067)
-- Name: user_settings user_settings_user_id_setting_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_settings
    ADD CONSTRAINT user_settings_user_id_setting_key_key UNIQUE (user_id, setting_key);


--
-- TOC entry 3389 (class 2606 OID 32949)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3408 (class 2606 OID 32950)
-- Name: conversation_participants conversation_participants_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation_participants
    ADD CONSTRAINT conversation_participants_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;


--
-- TOC entry 3416 (class 2606 OID 33035)
-- Name: file_contents file_contents_file_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.file_contents
    ADD CONSTRAINT file_contents_file_id_fkey FOREIGN KEY (file_id) REFERENCES public.files(id) ON DELETE CASCADE;


--
-- TOC entry 3415 (class 2606 OID 33015)
-- Name: files files_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3419 (class 2606 OID 33099)
-- Name: folders folders_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.folders
    ADD CONSTRAINT folders_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.folders(id) ON DELETE CASCADE;


--
-- TOC entry 3420 (class 2606 OID 33104)
-- Name: folders folders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.folders
    ADD CONSTRAINT folders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3409 (class 2606 OID 32955)
-- Name: messages messages_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;


--
-- TOC entry 3410 (class 2606 OID 32960)
-- Name: messages messages_reply_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_reply_fkey FOREIGN KEY (reply) REFERENCES public.messages(id) ON DELETE SET NULL;


--
-- TOC entry 3418 (class 2606 OID 33084)
-- Name: projects projects_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3414 (class 2606 OID 33000)
-- Name: sections sections_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- TOC entry 3411 (class 2606 OID 32965)
-- Name: messages_last_read unread_messages_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages_last_read
    ADD CONSTRAINT unread_messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;


--
-- TOC entry 3412 (class 2606 OID 32970)
-- Name: messages_last_read unread_messages_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages_last_read
    ADD CONSTRAINT unread_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3413 (class 2606 OID 32975)
-- Name: user_images user_images_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_images
    ADD CONSTRAINT user_images_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3417 (class 2606 OID 33068)
-- Name: user_settings user_settings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_settings
    ADD CONSTRAINT user_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2025-07-31 06:17:58 WAT

--
-- PostgreSQL database dump complete
--

