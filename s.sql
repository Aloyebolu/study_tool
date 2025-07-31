--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (Ubuntu 16.9-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.9 (Ubuntu 16.9-0ubuntu0.24.04.1)

-- Started on 2025-07-29 20:35:18 WAT

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
-- TOC entry 245 (class 1255 OID 16389)
-- Name: notify_change(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.notify_change() RETURNS trigger
    LANGUAGE plpgsql
    AS $$DECLARE
  payload JSON;
BEGIN
 IF (TG_OP = 'INSERT') THEN
    payload := json_build_object(
      'type', 'insert',
      'conversation_id', NEW.conversation_id,
      'data', row_to_json(NEW)
    );
ELSIF (TG_OP = 'UPDATE') THEN
    payload := json_build_object(
      'type', 'update',
      'conversation_id', NEW.conversation_id,
      'data', row_to_json(NEW)
    );
ELSIF (TG_OP = 'DELETE') THEN
    payload := json_build_object(
      'type', 'delete',
      'conversation_id', OLD.conversation_id,
      'data', row_to_json(OLD)
    );
END IF;


  PERFORM pg_notify('notify_change', payload::text); -- Make sure this matches what you're LISTENing to
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- TOC entry 244 (class 1259 OID 24621)
-- Name: badges; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.badges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id bigint NOT NULL,
    type text NOT NULL,
    expires_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 215 (class 1259 OID 16403)
-- Name: blocked_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blocked_users (
    id integer NOT NULL,
    blocker_id bigint NOT NULL,
    blocked_id bigint NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 216 (class 1259 OID 16407)
-- Name: blocked_users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.blocked_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3610 (class 0 OID 0)
-- Dependencies: 216
-- Name: blocked_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.blocked_users_id_seq OWNED BY public.blocked_users.id;


--
-- TOC entry 232 (class 1259 OID 16474)
-- Name: room_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.room_roles (
    id integer NOT NULL,
    room_id integer,
    user_id integer,
    role character varying(20) DEFAULT 'viewer'::character varying,
    joined_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    raised_hand boolean DEFAULT false,
    is_muted boolean DEFAULT false,
    status character varying DEFAULT 'inside'::character varying,
    "position" integer
);


--
-- TOC entry 243 (class 1259 OID 24580)
-- Name: c; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.c AS
 SELECT id,
    room_id,
    user_id,
    role,
    joined_at,
    raised_hand,
    is_muted,
    status,
    "position"
   FROM public.room_roles
  WITH NO DATA;


--
-- TOC entry 217 (class 1259 OID 16408)
-- Name: global_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.global_id_seq
    START WITH 10000000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 218 (class 1259 OID 16409)
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
-- TOC entry 219 (class 1259 OID 16418)
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
-- TOC entry 220 (class 1259 OID 16429)
-- Name: followers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.followers (
    id integer NOT NULL,
    user_id integer NOT NULL,
    follower_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 221 (class 1259 OID 16433)
-- Name: followers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.followers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3611 (class 0 OID 0)
-- Dependencies: 221
-- Name: followers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.followers_id_seq OWNED BY public.followers.id;


--
-- TOC entry 222 (class 1259 OID 16434)
-- Name: images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.images (
    id integer DEFAULT nextval('public.global_id_seq'::regclass) NOT NULL,
    image_data bytea,
    user_id bigint
);


--
-- TOC entry 223 (class 1259 OID 16440)
-- Name: images_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3612 (class 0 OID 0)
-- Dependencies: 223
-- Name: images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.images_id_seq OWNED BY public.images.id;


--
-- TOC entry 224 (class 1259 OID 16441)
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
-- TOC entry 225 (class 1259 OID 16450)
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
-- TOC entry 226 (class 1259 OID 16455)
-- Name: profile_views; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profile_views (
    id integer NOT NULL,
    profile_owner_id bigint NOT NULL,
    viewer_id bigint NOT NULL,
    viewed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 227 (class 1259 OID 16459)
-- Name: profile_views_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.profile_views_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3613 (class 0 OID 0)
-- Dependencies: 227
-- Name: profile_views_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.profile_views_id_seq OWNED BY public.profile_views.id;


--
-- TOC entry 228 (class 1259 OID 16460)
-- Name: room_events_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.room_events_log (
    id integer NOT NULL,
    room_id integer,
    user_id integer,
    event_type text,
    event_detail text,
    event_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 229 (class 1259 OID 16466)
-- Name: room_events_log_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.room_events_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3614 (class 0 OID 0)
-- Dependencies: 229
-- Name: room_events_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.room_events_log_id_seq OWNED BY public.room_events_log.id;


--
-- TOC entry 230 (class 1259 OID 16467)
-- Name: room_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.room_messages (
    id integer NOT NULL,
    room_id integer,
    sender_id integer,
    message text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 231 (class 1259 OID 16473)
-- Name: room_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.room_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3615 (class 0 OID 0)
-- Dependencies: 231
-- Name: room_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.room_messages_id_seq OWNED BY public.room_messages.id;


--
-- TOC entry 233 (class 1259 OID 16484)
-- Name: room_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.room_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3616 (class 0 OID 0)
-- Dependencies: 233
-- Name: room_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.room_roles_id_seq OWNED BY public.room_roles.id;


--
-- TOC entry 234 (class 1259 OID 16485)
-- Name: rooms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rooms (
    id integer NOT NULL,
    type text,
    room_description text,
    room_status character varying(20) DEFAULT 'live'::character varying,
    room_type character varying(20),
    max_participants integer DEFAULT 100,
    is_recorded boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    started_at timestamp without time zone,
    ended_at timestamp without time zone,
    tag text,
    messaging_status text
);


--
-- TOC entry 235 (class 1259 OID 16494)
-- Name: rooms_room_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.rooms_room_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3617 (class 0 OID 0)
-- Dependencies: 235
-- Name: rooms_room_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.rooms_room_id_seq OWNED BY public.rooms.id;


--
-- TOC entry 236 (class 1259 OID 16495)
-- Name: to_do; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.to_do (
    value character(200),
    id integer NOT NULL
);


--
-- TOC entry 237 (class 1259 OID 16498)
-- Name: to_do_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.to_do_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3618 (class 0 OID 0)
-- Dependencies: 237
-- Name: to_do_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.to_do_id_seq OWNED BY public.to_do.id;


--
-- TOC entry 238 (class 1259 OID 16499)
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
-- TOC entry 3619 (class 0 OID 0)
-- Dependencies: 238
-- Name: unread_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.unread_messages_id_seq OWNED BY public.messages_last_read.id;


--
-- TOC entry 239 (class 1259 OID 16500)
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
-- TOC entry 240 (class 1259 OID 16507)
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
-- TOC entry 3620 (class 0 OID 0)
-- Dependencies: 240
-- Name: user_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_images_id_seq OWNED BY public.user_images.id;


--
-- TOC entry 241 (class 1259 OID 16508)
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
-- TOC entry 242 (class 1259 OID 16515)
-- Name: your_table_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.your_table_id_seq
    START WITH 10000000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3360 (class 2604 OID 16518)
-- Name: blocked_users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blocked_users ALTER COLUMN id SET DEFAULT nextval('public.blocked_users_id_seq'::regclass);


--
-- TOC entry 3370 (class 2604 OID 16519)
-- Name: followers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.followers ALTER COLUMN id SET DEFAULT nextval('public.followers_id_seq'::regclass);


--
-- TOC entry 3375 (class 2604 OID 16520)
-- Name: messages_last_read id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages_last_read ALTER COLUMN id SET DEFAULT nextval('public.unread_messages_id_seq'::regclass);


--
-- TOC entry 3378 (class 2604 OID 16521)
-- Name: profile_views id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profile_views ALTER COLUMN id SET DEFAULT nextval('public.profile_views_id_seq'::regclass);


--
-- TOC entry 3380 (class 2604 OID 16522)
-- Name: room_events_log id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.room_events_log ALTER COLUMN id SET DEFAULT nextval('public.room_events_log_id_seq'::regclass);


--
-- TOC entry 3382 (class 2604 OID 16523)
-- Name: room_messages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.room_messages ALTER COLUMN id SET DEFAULT nextval('public.room_messages_id_seq'::regclass);


--
-- TOC entry 3384 (class 2604 OID 16524)
-- Name: room_roles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.room_roles ALTER COLUMN id SET DEFAULT nextval('public.room_roles_id_seq'::regclass);


--
-- TOC entry 3390 (class 2604 OID 16525)
-- Name: rooms id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rooms ALTER COLUMN id SET DEFAULT nextval('public.rooms_room_id_seq'::regclass);


--
-- TOC entry 3395 (class 2604 OID 16526)
-- Name: to_do id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.to_do ALTER COLUMN id SET DEFAULT nextval('public.to_do_id_seq'::regclass);


--
-- TOC entry 3396 (class 2604 OID 16527)
-- Name: user_images id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_images ALTER COLUMN id SET DEFAULT nextval('public.user_images_id_seq'::regclass);


--
-- TOC entry 3440 (class 2606 OID 24629)
-- Name: badges badges_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.badges
    ADD CONSTRAINT badges_pkey PRIMARY KEY (id);


--
-- TOC entry 3406 (class 2606 OID 16537)
-- Name: blocked_users blocked_users_blocker_id_blocked_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blocked_users
    ADD CONSTRAINT blocked_users_blocker_id_blocked_id_key UNIQUE (blocker_id, blocked_id);


--
-- TOC entry 3408 (class 2606 OID 16539)
-- Name: blocked_users blocked_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blocked_users
    ADD CONSTRAINT blocked_users_pkey PRIMARY KEY (id);


--
-- TOC entry 3410 (class 2606 OID 16541)
-- Name: conversation_participants conversation_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation_participants
    ADD CONSTRAINT conversation_participants_pkey PRIMARY KEY (id);


--
-- TOC entry 3412 (class 2606 OID 16543)
-- Name: conversations conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_pkey PRIMARY KEY (id);


--
-- TOC entry 3414 (class 2606 OID 16545)
-- Name: followers followers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.followers
    ADD CONSTRAINT followers_pkey PRIMARY KEY (id);


--
-- TOC entry 3416 (class 2606 OID 16547)
-- Name: images images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id);


--
-- TOC entry 3418 (class 2606 OID 16549)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- TOC entry 3424 (class 2606 OID 16551)
-- Name: profile_views profile_views_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profile_views
    ADD CONSTRAINT profile_views_pkey PRIMARY KEY (id);


--
-- TOC entry 3426 (class 2606 OID 16553)
-- Name: room_events_log room_events_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.room_events_log
    ADD CONSTRAINT room_events_log_pkey PRIMARY KEY (id);


--
-- TOC entry 3428 (class 2606 OID 16555)
-- Name: room_messages room_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.room_messages
    ADD CONSTRAINT room_messages_pkey PRIMARY KEY (id);


--
-- TOC entry 3430 (class 2606 OID 16557)
-- Name: room_roles room_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.room_roles
    ADD CONSTRAINT room_roles_pkey PRIMARY KEY (id);


--
-- TOC entry 3432 (class 2606 OID 16559)
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);


--
-- TOC entry 3434 (class 2606 OID 16561)
-- Name: to_do to_do_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.to_do
    ADD CONSTRAINT to_do_pkey PRIMARY KEY (id);


--
-- TOC entry 3420 (class 2606 OID 16563)
-- Name: messages_last_read unique_user_convo; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages_last_read
    ADD CONSTRAINT unique_user_convo UNIQUE (user_id, conversation_id);


--
-- TOC entry 3422 (class 2606 OID 16565)
-- Name: messages_last_read unread_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages_last_read
    ADD CONSTRAINT unread_messages_pkey PRIMARY KEY (id);


--
-- TOC entry 3436 (class 2606 OID 16567)
-- Name: user_images user_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_images
    ADD CONSTRAINT user_images_pkey PRIMARY KEY (id);


--
-- TOC entry 3438 (class 2606 OID 16569)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3460 (class 2620 OID 16570)
-- Name: messages notify_change; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER notify_change AFTER INSERT OR DELETE OR UPDATE ON public.messages FOR EACH ROW EXECUTE FUNCTION public.notify_change();


--
-- TOC entry 3459 (class 2606 OID 24630)
-- Name: badges badges_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.badges
    ADD CONSTRAINT badges_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3441 (class 2606 OID 16571)
-- Name: blocked_users blocked_users_blocked_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blocked_users
    ADD CONSTRAINT blocked_users_blocked_id_fkey FOREIGN KEY (blocked_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3442 (class 2606 OID 16576)
-- Name: blocked_users blocked_users_blocker_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blocked_users
    ADD CONSTRAINT blocked_users_blocker_id_fkey FOREIGN KEY (blocker_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3443 (class 2606 OID 16581)
-- Name: conversation_participants conversation_participants_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation_participants
    ADD CONSTRAINT conversation_participants_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;


--
-- TOC entry 3450 (class 2606 OID 24597)
-- Name: profile_views fk_profile_owner; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profile_views
    ADD CONSTRAINT fk_profile_owner FOREIGN KEY (profile_owner_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3451 (class 2606 OID 24602)
-- Name: profile_views fk_viewer; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profile_views
    ADD CONSTRAINT fk_viewer FOREIGN KEY (viewer_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3444 (class 2606 OID 16601)
-- Name: followers followers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.followers
    ADD CONSTRAINT followers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3446 (class 2606 OID 16606)
-- Name: messages messages_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;


--
-- TOC entry 3447 (class 2606 OID 16611)
-- Name: messages messages_reply_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_reply_fkey FOREIGN KEY (reply) REFERENCES public.messages(id) ON DELETE SET NULL;


--
-- TOC entry 3452 (class 2606 OID 16616)
-- Name: room_events_log room_events_log_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.room_events_log
    ADD CONSTRAINT room_events_log_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id);


--
-- TOC entry 3453 (class 2606 OID 16621)
-- Name: room_events_log room_events_log_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.room_events_log
    ADD CONSTRAINT room_events_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3454 (class 2606 OID 16626)
-- Name: room_messages room_messages_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.room_messages
    ADD CONSTRAINT room_messages_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id);


--
-- TOC entry 3455 (class 2606 OID 16631)
-- Name: room_messages room_messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.room_messages
    ADD CONSTRAINT room_messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id);


--
-- TOC entry 3456 (class 2606 OID 24607)
-- Name: room_roles room_roles_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.room_roles
    ADD CONSTRAINT room_roles_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id) ON DELETE CASCADE;


--
-- TOC entry 3457 (class 2606 OID 16641)
-- Name: room_roles room_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.room_roles
    ADD CONSTRAINT room_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3448 (class 2606 OID 16646)
-- Name: messages_last_read unread_messages_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages_last_read
    ADD CONSTRAINT unread_messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;


--
-- TOC entry 3449 (class 2606 OID 16651)
-- Name: messages_last_read unread_messages_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages_last_read
    ADD CONSTRAINT unread_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3445 (class 2606 OID 16656)
-- Name: images user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3458 (class 2606 OID 24592)
-- Name: user_images user_images_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_images
    ADD CONSTRAINT user_images_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2025-07-29 20:35:20 WAT

--
-- PostgreSQL database dump complete
--

