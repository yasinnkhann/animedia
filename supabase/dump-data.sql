SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Ubuntu 15.1-1.pgdg20.04+1)
-- Dumped by pg_dump version 15.5 (Ubuntu 15.5-1.pgdg20.04+1)

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
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', '5d26ef60-24e7-4855-80ba-9156e389e427', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"yasinkhan500@gmail.com","user_id":"7967aba4-e543-4aac-a954-ea1a5f19841f","user_phone":""}}', '2024-04-07 06:08:24.85204+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '7967aba4-e543-4aac-a954-ea1a5f19841f', 'authenticated', 'authenticated', 'yasinkhan500@gmail.com', '$2a$10$tGTqJJpf4R47b/nkK/v/GuFIdCayhNGSJjepE1el3zeB.46W1XtMO', '2024-04-07 06:08:24.858297+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-04-07 06:08:24.843953+00', '2024-04-07 06:08:24.858515+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('7967aba4-e543-4aac-a954-ea1a5f19841f', '7967aba4-e543-4aac-a954-ea1a5f19841f', '{"sub": "7967aba4-e543-4aac-a954-ea1a5f19841f", "email": "yasinkhan500@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2024-04-07 06:08:24.850438+00', '2024-04-07 06:08:24.850489+00', '2024-04-07 06:08:24.850489+00', '072a8069-ce5f-40a7-b6de-a3955457368c');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--



--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."User" ("id", "name", "email", "email_verified", "image", "password", "created_at") VALUES
	('cl8ci8ztd000809lbdb6ewkh0', 'Yasin Khan', 'yasinkhan500@gmail.com', '2022-10-24 05:55:55.184', 'https://lh3.googleusercontent.com/a-/ACNPEu-a6YanN6tQ9xlCau9ZK-ChUJnmdV3IhfgNgNyQjA=s96-c', NULL, '2022-10-24 05:53:55.184'),
	('cl8o2wzlv002109l5ub1zc61l', 'Andhi Bonanza', 'abawesome150@gmail.com', '2022-11-01 07:06:29.934', 'https://lh3.googleusercontent.com/a-/ACNPEu85PDiJW_UCVrE4iiUOEEYcx-wcW2qHkak8lc-g=s96-c', NULL, '2022-11-01 07:02:29.934'),
	('cl9g5ai7n000609mkr0wz9rdi', 'Andrew Ablong', 'ablongandrew@gmail.com', NULL, 'https://lh3.googleusercontent.com/a/ALm5wu1W2vujud78HUBXMVoI8rgj-fhYnFzjBIvavNEJsA=s96-c', NULL, '2022-10-06 23:27:26.154'),
	('cl9yuquvw0000mi08480z8975', 'koubaka', 'cruiser83@boranora.com', '2022-11-01 23:40:37.046', NULL, '$2a$12$vJRyf2E3F0YBmCCHadTJK.uQQKhh2.9rDtWTwXxou.4dVIE0ciL.O', '2022-11-01 23:34:37.046'),
	('cl9z06br70000l008v4aawtns', 'admin', 'aliens@gmail.com', NULL, NULL, '$2a$12$Het.a9nDQ86qYmXnppfDBexWvNsx.b0Q5e.WLC6bHtzpLFThafJLK', '2022-10-08 00:00:00'),
	('cla0my1by0000l908demr936a', 'Andrew Ablong', 'ajablong@sbcglobal.net', '2022-11-03 05:37:27.269', NULL, '$2a$12$k17Icfe251HjCeD6HMmH3uVw2E3Y/ipzV3ffETL5y7qFzeWF2m9E6', '2022-11-03 05:31:27.269'),
	('clbd1gzaw0000mg084o3y7zmz', 'Yasin Khan', 'yasinkhan500@yahoo.com', '2022-12-07 02:37:41.148', NULL, '$2a$12$7bWIknnEp6VXmpnATVYlk.YYvhe0S4rzeq42JgnG.5J1rqxv0X2cu', '2022-12-07 02:32:41.148'),
	('cllk4zcc10000jq083kvownf9', 'Chad Mendez', 'kalvan@wen3xt.xyz', NULL, NULL, '$2a$12$tOyhTNEV202zoLfPHVV22.cKqxr4N6knhVm8uN66QewMPgq.wLVbm', '2023-08-21 00:26:06.002'),
	('clqzrmzca0000jx08j08zk0t3', 'Fred ', 'bloodhunger@saamoo.com', NULL, NULL, '$2a$12$nzS3E9O93uc0/KR/zBtdA.WkPbsdaoqXcKkwN6motpufBJ8rVagwe', '2024-01-04 22:15:24.778');


--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."Account" ("id", "user_id", "type", "provider", "provider_account_id", "refresh_token", "access_token", "expires_at", "token_type", "scope", "id_token", "session_state") VALUES
	('cl8ci904o001509lbp9sopi20', 'cl8ci8ztd000809lbdb6ewkh0', 'oauth', 'google', '118165962497665342812', NULL, 'ya29.a0Aa4xrXOJO8UCO9z2rzEpAyb6mCaby2JOp9AFbdMLlbe_auKfKA7TNBrz7D5o4OMURaXplcV3-422MqzxIsu2JvIwuSK7ByqN2noQXFV5ufLFPpXz2oytCWJXeAvcqdMV9zirJeJwImOf-Oj_F3YuIMGBXK7jaCgYKATASARASFQEjDvL97l_ppPSPp0L6VRCNRUm74Q0163', 1663821550, 'Bearer', 'openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile', 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjIwOWMwNTdkM2JkZDhjMDhmMmQ1NzM5Nzg4NjMyNjczZjdjNjI0MGYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxODcxODk2NjAwODMtMnFidmJoZjZyaDFzdjcwbzBqdDluZXQyaTMxdmNybjIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIxODcxODk2NjAwODMtMnFidmJoZjZyaDFzdjcwbzBqdDluZXQyaTMxdmNybjIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTgxNjU5NjI0OTc2NjUzNDI4MTIiLCJlbWFpbCI6Inlhc2lua2hhbjUwMEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6ImFRUnZ3SklUcVloeUR2eUZPUTJGVnciLCJuYW1lIjoiWWFzaW4gS2hhbiIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS0vQUNOUEV1LWE2WWFuTjZ0UTl4bENhdTlaSy1DaFVKbm1kVjNJaGZnTmdOeVFqQT1zOTYtYyIsImdpdmVuX25hbWUiOiJZYXNpbiIsImZhbWlseV9uYW1lIjoiS2hhbiIsImxvY2FsZSI6ImVuIiwiaWF0IjoxNjYzODE3OTUxLCJleHAiOjE2NjM4MjE1NTF9.nx3zCGreXM0PAKYX6B3bNPlTPdgby821hMY-Tk1y6YJk_WYueCT3hx8m10NnkAIVkUI13EiKj6jtpnzrACtyrCslvvSfUbFXvLOKxW809oMYQbhsQf4ewK8XnxhsAG0-jw-mDybupihkrBrVp-el_ZLWHZCJeXG1icOLTJBwUSz2Z-_JwtSOx8cmnIkRUDHaC1pAwMOS09I0jrdMRTCZpLFmRnm0qdaLlk1UFO2hGBvg-VnVjPRK8SfjiDBrRa0boRunNnEwv0HY9xzwrorp3NuAPRX_RGwRGt_WBHF26UTJbC4T5AqDOJzXo_uLkeTAMD5gQxmx8OUhXSFvSxK-fw', NULL),
	('cl8o2wzx5002909l50uvteava', 'cl8o2wzlv002109l5ub1zc61l', 'oauth', 'google', '111613811673695219399', NULL, 'ya29.a0Aa4xrXPcPRMk1432I9NBkqW57JrToRbPKtLwidcFvoEU_X6B4_qca-U8yYnKF5SD7vWhMld2goC0ghVu8-vkpeW_VJWP6GBAwSHxxYotGOP6-pQWreDs8kWziCkgKqajyhIoWthON0xBW2JSgcVgJLf8ZApaaCgYKATASARESFQEjDvL96aEE5X8R5KuCD3hNp6nSTw0163', 1664521389, 'Bearer', 'openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile', 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImJhMDc5YjQyMDI2NDFlNTRhYmNlZDhmYjEzNTRjZTAzOTE5ZmIyOTQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxODcxODk2NjAwODMtMnFidmJoZjZyaDFzdjcwbzBqdDluZXQyaTMxdmNybjIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIxODcxODk2NjAwODMtMnFidmJoZjZyaDFzdjcwbzBqdDluZXQyaTMxdmNybjIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTE2MTM4MTE2NzM2OTUyMTkzOTkiLCJlbWFpbCI6ImFiYXdlc29tZTE1MEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6ImUxWVdad2swMHFaN0o2c1N1RzNWSVEiLCJuYW1lIjoiQW5kaGkgQm9uYW56YSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS0vQUNOUEV1ODVQRGlKV19VQ1ZyRTRpaVVPRUVZY3gtd2NXMnFIa2FrOGxjLWc9czk2LWMiLCJnaXZlbl9uYW1lIjoiQW5kaGkiLCJmYW1pbHlfbmFtZSI6IkJvbmFuemEiLCJsb2NhbGUiOiJlbiIsImlhdCI6MTY2NDUxNzc5MCwiZXhwIjoxNjY0NTIxMzkwfQ.F0jGLCgAOw5KqfmOnLY7zGv0kok2EcV0oPWpAu_QTdijk35eEuL9p4-dC2nTtFqIp8UJbpBeqFa_a07LeN7raajoUmibSZMv7fj38y-PpP_ED3x9hAvprbejxY6Ww7sP5NnCnOtl2sJJp6O08nsAUJaMbsjDHGvz1tc-UCjpjO_1QT-h1I8AvkcwJb0w4Mey7VGfaDUytydC96OsorBJsDaBtAqePx1tP5vgIenDRu2QZ0ZLuUol2tN8zpsmxTCk3HA3GhsIH-Z3CLERBqo4QSU4NeDVrPis3MKYSRIevEEaow0Pt4yd4DjlH0b1PNx8RwP0hR3pOhSM85maR4FkvQ', NULL),
	('cl9g5aiiw001409mk1wag0ty1', 'cl9g5ai7n000609mkr0wz9rdi', 'oauth', 'google', '114614085517427626509', NULL, 'ya29.a0Aa4xrXOwOkZv1H9PGCZ4dUBBfaNJG2QmRYxMQbEGAdTanrfAzj36Aa96V9VX_pNBDunJc-GPPzyN7xduJNOcGGizMSoT6gwC383JizPGZXN-HcdoGpVcJbysCjIlpHTIwZkZ23M16uP_OMw6UQEXQz-1b4x9aCgYKATASARASFQEjDvL9CcranKNzMzVyiKkqtdDZaw0163', 1666218431, 'Bearer', 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid', 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImVlMWI5Zjg4Y2ZlMzE1MWRkZDI4NGE2MWJmOGNlY2Y2NTliMTMwY2YiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxODcxODk2NjAwODMtMnFidmJoZjZyaDFzdjcwbzBqdDluZXQyaTMxdmNybjIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIxODcxODk2NjAwODMtMnFidmJoZjZyaDFzdjcwbzBqdDluZXQyaTMxdmNybjIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTQ2MTQwODU1MTc0Mjc2MjY1MDkiLCJlbWFpbCI6ImFibG9uZ2FuZHJld0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6ImdneGNETVU0c09hUGszZUVoTG5Tb1EiLCJuYW1lIjoiQW5kcmV3IEFibG9uZyIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BTG01d3UxVzJ2dWp1ZDc4SFVCWE1Wb0k4cmdqLWZoWW5GempCSXZhdk5FSnNBPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IkFuZHJldyIsImZhbWlseV9uYW1lIjoiQWJsb25nIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE2NjYyMTQ4MzMsImV4cCI6MTY2NjIxODQzM30.LDR4vDXG99ogrNZn_jaaDh0pVP1jCMkzfEkhLGXrnQkm2n44Nk-9uqWZaVTpKNsgTEb530Maxo5AlkTvUl2Hv_4dTu6MChDVPoQlXAUlOdDbhFbsKy7VxK-lSVD5uttg3jwII9S0wLM60riz-khSB9CXN-uiBW5Ke3XH82PwVPe1u9_LBhQFdAm0BbkCKfJDC6k0VGoZvY24HRuRH8iWrx26HVgemDiiyiu_PKVygTtFJ4KoHqn1nNLzw7vOc4ca1Vq8YfS8jAXs2Z-ZQudP2H6DlEnnbeHxtSMXu6lBkyAWMgmlwSFDUHpoVFcm0P5NHR9tC2bGrqx2lSx8gcY9BQ', NULL);


--
-- Data for Name: Movies; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."Movies" ("id", "name", "status", "rating", "user_id") VALUES
	('1003581', 'Justice League: Warworld', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('100402', 'Captain America: The Winter Soldier', 'COMPLETED', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('1011985', 'Kung Fu Panda 4', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('10135', 'Road House', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('10138', 'Iron Man 2', 'COMPLETED', 7, 'cl8ci8ztd000809lbdb6ewkh0'),
	('10195', 'Thor', 'COMPLETED', 6, 'cl8ci8ztd000809lbdb6ewkh0'),
	('10201', 'Yes Man', 'COMPLETED', 7, 'cl8ci8ztd000809lbdb6ewkh0'),
	('102382', 'The Amazing Spider-Man 2', 'COMPLETED', 7, 'cl8ci8ztd000809lbdb6ewkh0'),
	('102899', 'Ant-Man', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('103', 'Taxi Driver', 'COMPLETED', 7, 'cl8ci8ztd000809lbdb6ewkh0'),
	('10528', 'Sherlock Holmes', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('10536', 'The Italian Job', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('106598', 'The 50 Years War: Israel and the Arabs', 'WATCHING', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('106646', 'The Wolf of Wall Street', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('10865', 'Atlantis: The Lost Empire', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('109424', 'Captain Phillips', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('109443', 'Anchorman 2: The Legend Continues', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('111', 'Scarface', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('1124', 'The Prestige', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('11324', 'Shutter Island', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('1149947', 'To End All War: Oppenheimer & the Atomic Bomb', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('116741', 'The Internship', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('117263', 'Olympus Has Fallen', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('118340', 'Guardians of the Galaxy', 'COMPLETED', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('120', 'The Lord of the Rings: The Fellowship of the Ring', 'COMPLETED', 9, 'cl8ci8ztd000809lbdb6ewkh0'),
	('121', 'The Lord of the Rings: The Two Towers', 'COMPLETED', 9, 'cl8ci8ztd000809lbdb6ewkh0'),
	('12117', 'Instinct', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('121856', 'Assassin''s Creed', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('122', 'The Lord of the Rings: The Return of the King', 'COMPLETED', 10, 'cl8ci8ztd000809lbdb6ewkh0'),
	('122917', 'The Hobbit: The Battle of the Five Armies', 'COMPLETED', 9, 'cl8ci8ztd000809lbdb6ewkh0'),
	('1239251', 'Megamind vs. the Doom Syndicate', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('12444', 'Harry Potter and the Deathly Hallows: Part 1', 'COMPLETED', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('12445', 'Harry Potter and the Deathly Hallows: Part 2', 'COMPLETED', 9, 'cl8ci8ztd000809lbdb6ewkh0'),
	('124905', 'Godzilla', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('1250', 'Ghost Rider', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('12610', 'Osmosis Jones', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('1271', '300', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('127585', 'X-Men: Days of Future Past', 'COMPLETED', 7, 'cl8ci8ztd000809lbdb6ewkh0'),
	('129', 'Spirited Away', 'COMPLETED', 9, 'cl8ci8ztd000809lbdb6ewkh0'),
	('13', 'Forrest Gump', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('13183', 'Watchmen', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('132144', 'The Battle of Chile: Part I', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('135397', 'Jurassic World', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('1359', 'American Psycho', 'COMPLETED', 9, 'cl8ci8ztd000809lbdb6ewkh0'),
	('1366', 'Rocky', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('1372', 'Blood Diamond', 'COMPLETED', 9, 'cl8ci8ztd000809lbdb6ewkh0'),
	('1372', 'Blood Diamond', 'PLAN_TO_WATCH', NULL, 'cl8o2wzlv002109l5ub1zc61l'),
	('1389', 'Out of Sight', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('141052', 'Justice League', 'COMPLETED', 6, 'cl8ci8ztd000809lbdb6ewkh0'),
	('14161', '2012', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('1417', 'Pan''s Labyrinth', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('14756', 'Ip Man', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('1487', 'Hellboy', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('152601', 'Her', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('155', 'The Dark Knight', 'COMPLETED', 10, 'cl8ci8ztd000809lbdb6ewkh0'),
	('156022', 'The Equalizer', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('157336', 'Interstellar', 'COMPLETED', 9, 'cl8ci8ztd000809lbdb6ewkh0'),
	('1579', 'Apocalypto', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('158999', 'Blackfish', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('161', 'Ocean''s Eleven', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('1624', 'Liar Liar', 'COMPLETED', 7, 'cl8ci8ztd000809lbdb6ewkh0'),
	('1635', 'The Island', 'COMPLETED', 9, 'cl8ci8ztd000809lbdb6ewkh0'),
	('168259', 'Furious 7', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('16869', 'Inglourious Basterds', 'COMPLETED', 9, 'cl8ci8ztd000809lbdb6ewkh0'),
	('1724', 'The Incredible Hulk', 'COMPLETED', 9, 'cl8ci8ztd000809lbdb6ewkh0'),
	('1726', 'Iron Man', 'COMPLETED', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('1729', 'The Forbidden Kingdom', 'COMPLETED', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('1771', 'Captain America: The First Avenger', 'COMPLETED', 7, 'cl8ci8ztd000809lbdb6ewkh0'),
	('177677', 'Mission: Impossible - Rogue Nation', 'COMPLETED', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('185', 'A Clockwork Orange', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('1858', 'Transformers', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('1865', 'Pirates of the Caribbean: On Stranger Tides', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('18785', 'The Hangover', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('190859', 'American Sniper', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('1930', 'The Amazing Spider-Man', 'COMPLETED', 7, 'cl8ci8ztd000809lbdb6ewkh0'),
	('194662', 'Birdman or (The Unexpected Virtue of Ignorance)', 'COMPLETED', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('197', 'Braveheart', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('1979', 'Fantastic Four: Rise of the Silver Surfer', 'COMPLETED', 7, 'cl8ci8ztd000809lbdb6ewkh0'),
	('198184', 'Chappie', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('19995', 'Avatar', 'COMPLETED', 9, 'cl8ci8ztd000809lbdb6ewkh0'),
	('2048', 'I, Robot', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('20526', 'TRON: Legacy', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('205584', 'Gods of Egypt', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('205596', 'The Imitation Game', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('2059', 'National Treasure', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('2080', 'X-Men Origins: Wolverine', 'COMPLETED', 7, 'cl8ci8ztd000809lbdb6ewkh0'),
	('209112', 'Batman v Superman: Dawn of Justice', 'COMPLETED', 7, 'cl8ci8ztd000809lbdb6ewkh0'),
	('2105', 'American Pie', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('2135', 'The Time Machine', 'COMPLETED', 6, 'cl8ci8ztd000809lbdb6ewkh0'),
	('2140', 'Kiss of the Dragon', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('218', 'The Terminator', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('228150', 'Fury', 'COMPLETED', 7, 'cl8ci8ztd000809lbdb6ewkh0'),
	('238', 'The Godfather', 'COMPLETED', 9, 'cl8ci8ztd000809lbdb6ewkh0'),
	('24', 'Kill Bill: Vol. 1', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('240', 'The Godfather Part II', 'COMPLETED', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('242', 'The Godfather Part III', 'COMPLETED', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('242582', 'Nightcrawler', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('24428', 'The Avengers', 'COMPLETED', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('244786', 'Whiplash', 'COMPLETED', 9, 'cl8ci8ztd000809lbdb6ewkh0'),
	('245891', 'John Wick', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('246655', 'X-Men: Apocalypse', 'COMPLETED', 7, 'cl8ci8ztd000809lbdb6ewkh0'),
	('249170', 'Dinosaur 13', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('2501', 'The Bourne Identity', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('2502', 'The Bourne Supremacy', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('2503', 'The Bourne Ultimatum', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('251519', 'Son of Batman', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('256274', 'As Above, So Below', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('258489', 'The Legend of Tarzan', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('263115', 'Logan', 'COMPLETED', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('264660', 'Ex Machina', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('264999', 'Magic Mike XXL', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('268896', 'Pacific Rim: Uprising', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('270303', 'It Follows', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('271110', 'Captain America: Civil War', 'COMPLETED', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('272', 'Batman Begins', 'COMPLETED', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('27205', 'Inception', 'COMPLETED', 9, 'cl8ci8ztd000809lbdb6ewkh0'),
	('278', 'The Shawshank Redemption', 'COMPLETED', 9, 'cl8ci8ztd000809lbdb6ewkh0'),
	('27850', 'Halloweentown', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('280', 'Terminator 2: Judgment Day', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('281957', 'The Revenant', 'COMPLETED', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('283995', 'Guardians of the Galaxy Vol. 2', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('284052', 'Doctor Strange', 'COMPLETED', 7, 'cl8ci8ztd000809lbdb6ewkh0'),
	('284053', 'Thor: Ragnarok', 'COMPLETED', 7, 'cl8ci8ztd000809lbdb6ewkh0'),
	('284054', 'Black Panther', 'COMPLETED', 9, 'cl8ci8ztd000809lbdb6ewkh0'),
	('286217', 'The Martian', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('287947', 'Shazam!', 'COMPLETED', 6, 'cl8ci8ztd000809lbdb6ewkh0'),
	('289', 'Casablanca', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('290859', 'Terminator: Dark Fate', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('293660', 'Deadpool', 'COMPLETED', 7, 'cl8ci8ztd000809lbdb6ewkh0'),
	('295964', 'Burnt', 'COMPLETED', 7, 'cl8ci8ztd000809lbdb6ewkh0'),
	('296', 'Terminator 3: Rise of the Machines', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('297762', 'Wonder Woman', 'COMPLETED', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('297802', 'Aquaman', 'COMPLETED', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('298618', 'The Flash', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('299534', 'Avengers: Endgame', 'COMPLETED', 9, 'cl8ci8ztd000809lbdb6ewkh0'),
	('299536', 'Avengers: Infinity War', 'COMPLETED', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('299537', 'Captain Marvel', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('300668', 'Annihilation', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('308266', 'War Dogs', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('310', 'Bruce Almighty', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('311324', 'The Great Wall', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('315011', 'Shin Godzilla', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('315162', 'Puss in Boots: The Last Wish', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('315635', 'Spider-Man: Homecoming', 'COMPLETED', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('316029', 'The Greatest Showman', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('320288', 'Dark Phoenix', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('321528', 'Batman vs. Robin', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('324552', 'John Wick: Chapter 2', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('324558', 'X-Rated: The Greatest Adult Movies of All Time', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('324857', 'Spider-Man: Into the Spider-Verse', 'COMPLETED', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('329', 'Jurassic Park', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('329865', 'Arrival', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('330459', 'Rogue One: A Star Wars Story', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('335787', 'Uncharted', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('335977', 'Indiana Jones and the Dial of Destiny', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('335983', 'Venom', 'COMPLETED', 7, 'cl8ci8ztd000809lbdb6ewkh0'),
	('335984', 'Blade Runner 2049', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('335988', 'Transformers: The Last Knight', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('337339', 'The Fate of the Furious', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('337401', 'Mulan', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('338953', 'Fantastic Beasts: The Secrets of Dumbledore', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('343674', 'Gerald''s Game', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('345887', 'The Equalizer 2', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('346698', 'Barbie', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('353081', 'Mission: Impossible - Fallout', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('356305', 'Why Him?', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('359410', 'Road House', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('361743', 'Top Gun: Maverick', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('363088', 'Ant-Man and the Wasp', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('365222', 'Ip Man 3', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('36647', 'Blade', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('36657', 'X-Men', 'COMPLETED', 7, 'cl8ci8ztd000809lbdb6ewkh0'),
	('36658', 'X2', 'COMPLETED', 7, 'cl8ci8ztd000809lbdb6ewkh0'),
	('36668', 'X-Men: The Last Stand', 'COMPLETED', 7, 'cl8ci8ztd000809lbdb6ewkh0'),
	('366924', 'Batman: Bad Blood', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('37169', 'The Human Centipede (First Sequence)', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('373571', 'Godzilla: King of the Monsters', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('37472', 'Ip Man 2', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('37799', 'The Social Network', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('379291', 'Justice League vs. Teen Titans', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('380', 'Rain Man', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('38055', 'Megamind', 'COMPLETED', 10, 'cl8ci8ztd000809lbdb6ewkh0'),
	('383498', 'Deadpool 2', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('38356', 'Transformers: Dark of the Moon', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('385128', 'F9', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('385687', 'Fast X', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('393', 'Kill Bill: Vol. 2', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('399566', 'Godzilla vs. Kong', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('405774', 'Bird Box', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('407806', '13th', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('408647', 'Teen Titans: The Judas Contract', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('414906', 'The Batman', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('417261', 'Forever My Girl', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('42044', 'Shoah', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('423', 'The Pianist', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('427641', 'Rampage', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('429', 'The Good, the Bad and the Ugly', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('429', 'The Good, the Bad and the Ugly', 'COMPLETED', 9, 'cl9g5ai7n000609mkr0wz9rdi'),
	('429200', 'Good Time', 'COMPLETED', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('429617', 'Spider-Man: Far From Home', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('432976', 'Icarus', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('436270', 'Black Adam', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('436969', 'The Suicide Squad', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('438631', 'Dune', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('440249', 'After Porn Ends 2', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('447365', 'Guardians of the Galaxy Volume 3', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('44912', 'Green Lantern', 'COMPLETED', 5, 'cl8ci8ztd000809lbdb6ewkh0'),
	('449924', 'Ip Man 4: The Finale', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('453395', 'Doctor Strange in the Multiverse of Madness', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('453405', 'Gemini Man', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('454', 'Romeo + Juliet', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('458156', 'John Wick: Chapter 3 - Parabellum', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('464052', 'Wonder Woman 1984', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('466272', 'Once Upon a Time… in Hollywood', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('475557', 'Joker', 'COMPLETED', 9, 'cl8ci8ztd000809lbdb6ewkh0'),
	('49026', 'The Dark Knight Rises', 'COMPLETED', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('49040', 'The Bourne Legacy', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('49046', 'All Quiet on the Western Front', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('49047', 'Gravity', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('49051', 'The Hobbit: An Unexpected Journey', 'COMPLETED', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('493922', 'Hereditary', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('49521', 'Man of Steel', 'COMPLETED', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('49530', 'In Time', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('49538', 'X-Men: First Class', 'COMPLETED', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('496243', 'Parasite', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('501', 'Grizzly Man', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('502356', 'The Super Mario Bros. Movie', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('50546', 'Just Go with It', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('505642', 'Black Panther: Wakanda Forever', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('507086', 'Jurassic World Dominion', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('510', 'One Flew Over the Cuckoo''s Nest', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('51876', 'Limitless', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('524', 'Casino', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('524434', 'Eternals', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('526896', 'Morbius', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('532639', 'Pinocchio', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('534', 'Terminator Salvation', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('545609', 'Extraction', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('549559', 'Apollo 11', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('550', 'Fight Club', 'COMPLETED', 10, 'cl8ci8ztd000809lbdb6ewkh0'),
	('550988', 'Free Guy', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('557', 'Spider-Man', 'COMPLETED', 9, 'cl8ci8ztd000809lbdb6ewkh0'),
	('558', 'Spider-Man 2', 'COMPLETED', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('559', 'Spider-Man 3', 'COMPLETED', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('56292', 'Mission: Impossible - Ghost Protocol', 'COMPLETED', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('565770', 'Blue Beetle', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('566525', 'Shang-Chi and the Legend of the Ten Rings', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('568', 'Apollo 13', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('569094', 'Spider-Man: Across the Spider-Verse', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('57158', 'The Hobbit: The Desolation of Smaug', 'COMPLETED', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('572802', 'Aquaman and the Lost Kingdom', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('575264', 'Mission: Impossible - Dead Reckoning Part One', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('577922', 'Tenet', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('578', 'Jaws', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('579', 'Jaws 2', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('579583', 'The King of Staten Island', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('580489', 'Venom: Let There Be Carnage', 'COMPLETED', 6, 'cl8ci8ztd000809lbdb6ewkh0'),
	('593643', 'The Menu', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('594767', 'Shazam! Fury of the Gods', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('597', 'Titanic', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('598', 'City of God', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('600', 'Full Metal Jacket', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('601', 'E.T. the Extra-Terrestrial', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('603', 'The Matrix', 'COMPLETED', 10, 'cl8ci8ztd000809lbdb6ewkh0'),
	('603692', 'John Wick: Chapter 4', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('604', 'The Matrix Reloaded', 'COMPLETED', 9, 'cl8ci8ztd000809lbdb6ewkh0'),
	('607', 'Men in Black', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('609681', 'The Marvels', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('610150', 'Dragon Ball Super: Super Hero', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('615', 'The Passion of the Christ', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('615777', 'Babylon', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('616', 'The Last Samurai', 'COMPLETED', 9, 'cl8ci8ztd000809lbdb6ewkh0'),
	('616037', 'Thor: Love and Thunder', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('618344', 'Justice League Dark: Apokolips War', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('624860', 'The Matrix Resurrections', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('629', 'The Usual Suspects', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('634492', 'Madame Web', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('634649', 'Spider-Man: No Way Home', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('639933', 'The Northman', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('639933', 'The Northman', 'PLAN_TO_WATCH', NULL, 'cl8o2wzlv002109l5ub1zc61l'),
	('640', 'Catch Me If You Can', 'COMPLETED', 10, 'cl8ci8ztd000809lbdb6ewkh0'),
	('640146', 'Ant-Man and the Wasp: Quantumania', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('642885', 'Hocus Pocus 2', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('64682', 'The Great Gatsby', 'COMPLETED', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('64690', 'Drive', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('6479', 'I Am Legend', 'COMPLETED', 7, 'cl8ci8ztd000809lbdb6ewkh0'),
	('652', 'Troy', 'COMPLETED', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('667538', 'Transformers: Rise of the Beasts', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('671', 'Harry Potter and the Philosopher''s Stone', 'COMPLETED', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('672', 'Harry Potter and the Chamber of Secrets', 'COMPLETED', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('673', 'Harry Potter and the Prisoner of Azkaban', 'COMPLETED', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('674', 'Harry Potter and the Goblet of Fire', 'COMPLETED', 9, 'cl8ci8ztd000809lbdb6ewkh0'),
	('675', 'Harry Potter and the Order of the Phoenix', 'COMPLETED', 7, 'cl8ci8ztd000809lbdb6ewkh0'),
	('677179', 'Creed III', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('680', 'Pulp Fiction', 'COMPLETED', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('68718', 'Django Unchained', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('68721', 'Iron Man 3', 'COMPLETED', 6, 'cl8ci8ztd000809lbdb6ewkh0'),
	('68726', 'Pacific Rim', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('695721', 'The Hunger Games: The Ballad of Songbirds & Snakes', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('697843', 'Extraction 2', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('700391', '65', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('70160', 'The Hunger Games', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('7347', 'Elite Squad', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('74', 'War of the Worlds', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('74997', 'The Human Centipede 2 (Full Sequence)', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('753342', 'Napoleon', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('7555', 'Rambo', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('76170', 'The Wolverine', 'COMPLETED', 7, 'cl8ci8ztd000809lbdb6ewkh0'),
	('76338', 'Thor: The Dark World', 'COMPLETED', 7, 'cl8ci8ztd000809lbdb6ewkh0'),
	('76600', 'Avatar: The Way of Water', 'COMPLETED', 9, 'cl8ci8ztd000809lbdb6ewkh0'),
	('767', 'Harry Potter and the Half-Blood Prince', 'COMPLETED', 7, 'cl8ci8ztd000809lbdb6ewkh0'),
	('769', 'GoodFellas', 'COMPLETED', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('770', 'Gone with the Wind', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('77930', 'Magic Mike', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('78', 'Blade Runner', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('7840', '10,000 BC', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('787428', 'Two Distant Strangers', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('787699', 'Wonka', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('791373', 'Zack Snyder''s Justice League', 'COMPLETED', 9, 'cl8ci8ztd000809lbdb6ewkh0'),
	('79990', 'Desi Boyz', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('80274', 'Ender''s Game', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('805320', 'Bird Box Barcelona', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('823464', 'Godzilla x Kong: The New Empire', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('8247', 'Jumper', 'COMPLETED', 7, 'cl8ci8ztd000809lbdb6ewkh0'),
	('8358', 'Cast Away', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('8373', 'Transformers: Revenge of the Fallen', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('84287', 'The Imposter', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('854', 'The Mask', 'COMPLETED', 9, 'cl8ci8ztd000809lbdb6ewkh0'),
	('857', 'Saving Private Ryan', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('8699', 'Anchorman: The Legend of Ron Burgundy', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('871', 'Planet of the Apes', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('87101', 'Terminator Genisys', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('872585', 'Oppenheimer', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('87827', 'Life of Pi', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('8909', 'Wanted', 'COMPLETED', 9, 'cl8ci8ztd000809lbdb6ewkh0'),
	('8960', 'Hancock', 'COMPLETED', 7, 'cl8ci8ztd000809lbdb6ewkh0'),
	('9016', 'Treasure Planet', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('906221', 'Magic Mike''s Last Dance', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('91314', 'Transformers: Age of Extinction', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('926393', 'The Equalizer 3', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('9319', 'The Last Boy Scout', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('9339', 'Click', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('94365', 'The Human Centipede 3 (Final Sequence)', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('9459', 'Woodstock', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('9462', 'The Way of the Dragon', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('948713', 'The Last Kingdom: Seven Kings Must Die', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('949', 'Heat', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('954', 'Mission: Impossible', 'COMPLETED', 9, 'cl8ci8ztd000809lbdb6ewkh0'),
	('955', 'Mission: Impossible II', 'COMPLETED', 7, 'cl8ci8ztd000809lbdb6ewkh0'),
	('956', 'Mission: Impossible III', 'COMPLETED', 7, 'cl8ci8ztd000809lbdb6ewkh0'),
	('9694', 'One Missed Call', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('9738', 'Fantastic Four', 'COMPLETED', 7, 'cl8ci8ztd000809lbdb6ewkh0'),
	('97630', 'Zero Dark Thirty', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('98', 'Gladiator', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('980489', 'Gran Turismo', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('9806', 'The Incredibles', 'COMPLETED', 9, 'cl8ci8ztd000809lbdb6ewkh0'),
	('9836', 'Happy Feet', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('985939', 'Fall', 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('99861', 'Avengers: Age of Ultron', 'COMPLETED', 7, 'cl8ci8ztd000809lbdb6ewkh0');


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."Session" ("id", "session_token", "user_id", "expires") VALUES
	('cl8o2x08d003509l5t7sjshen', '550afe7b-5949-4728-9dc2-8e027b567acf', 'cl8o2wzlv002109l5ub1zc61l', '2022-11-19 06:06:49.097'),
	('cl8us8toe001609k5fh7ao7vr', '7b7926d9-2b44-407b-be87-0cd22def0f4a', 'cl8ci8ztd000809lbdb6ewkh0', '2022-11-03 22:38:50.94'),
	('cl9dovcjx004209l651xklhff', '3022956a-e683-4b22-b11f-ed87d51fc349', 'cl8ci8ztd000809lbdb6ewkh0', '2022-11-22 08:03:19.049');


--
-- Data for Name: Shows; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."Shows" ("id", "name", "current_episode", "status", "rating", "user_id") VALUES
	('100088', 'The Last of Us', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('103540', 'Percy Jackson and the Olympians', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('105971', 'Star Wars: The Bad Batch', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('108978', 'Reacher', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('110316', 'Alice in Borderland', 8, 'ON_HOLD', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('1104', 'Mad Men', 92, 'COMPLETED', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('1104', 'Mad Men', 92, 'COMPLETED', 10, 'cl9g5ai7n000609mkr0wz9rdi'),
	('110492', 'Peacemaker', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('110971', 'How To with John Wilson', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('111111', 'Blood of Zeus', 8, 'COMPLETED', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('113988', 'Dahmer – Monster: The Jeffrey Dahmer Story', 10, 'COMPLETED', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('114461', 'Ahsoka', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('115036', 'The Book of Boba Fett', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('119051', 'Wednesday', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('123548', 'Castlevania: Nocturne', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('1396', 'Breaking Bad', 62, 'COMPLETED', 9, 'cl8ci8ztd000809lbdb6ewkh0'),
	('1398', 'The Sopranos', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('1399', 'Game of Thrones', 73, 'COMPLETED', 9, 'cl8ci8ztd000809lbdb6ewkh0'),
	('1400', 'Seinfeld', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('1402', 'The Walking Dead', 130, 'ON_HOLD', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('1405', 'Dexter', 96, 'COMPLETED', 9, 'cl8ci8ztd000809lbdb6ewkh0'),
	('1412', 'Arrow', 160, 'ON_HOLD', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('1413', 'American Horror Story', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('1425', 'House of Cards', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('1434', 'Family Guy', 0, 'ON_HOLD', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('154385', 'BEEF', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('154494', 'Lycoris Recoil', 13, 'COMPLETED', 8, 'cl8o2wzlv002109l5ub1zc61l'),
	('1618', 'Justice League', 50, 'COMPLETED', 10, 'cl8ci8ztd000809lbdb6ewkh0'),
	('1892', 'The Fresh Prince of Bel-Air', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('1973', '24', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('19885', 'Sherlock', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('2022', 'The Batman', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('2038', 'Drake & Josh', 57, 'COMPLETED', 10, 'cl8ci8ztd000809lbdb6ewkh0'),
	('205715', 'Gen V', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('2085', 'Courage the Cowardly Dog', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('2098', 'Batman: The Animated Series', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('2164', 'The Marvel Super Heroes', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('2190', 'South Park', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('2309', 'Danny Phantom', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('240', 'Jackie Chan Adventures', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('246', 'Avatar: The Last Airbender', 61, 'COMPLETED', 10, 'cl8ci8ztd000809lbdb6ewkh0'),
	('2660', 'Codename: Kids Next Door', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('2723', 'Samurai Jack', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('31109', 'Ben 10: Ultimate Alien', 52, 'COMPLETED', 10, 'cl8ci8ztd000809lbdb6ewkh0'),
	('31132', 'Regular Show', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('33217', 'Young Justice', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('33880', 'The Legend of Korra', 52, 'COMPLETED', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('3557', 'Walking with Dinosaurs', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('38691', 'World War 1 in Colour', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('39373', 'Red vs. Blue', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('40290', 'MasterChef', 33, 'WATCHING', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('42009', 'Black Mirror', 21, 'ON_HOLD', 9, 'cl8ci8ztd000809lbdb6ewkh0'),
	('42154', 'World War II in Colour', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('4303', 'Superman: The Animated Series', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('44217', 'Vikings', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('4604', 'Smallville', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('4607', 'Lost', 120, 'COMPLETED', 10, 'cl8ci8ztd000809lbdb6ewkh0'),
	('4625', 'The New Batman Adventures', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('46434', 'The Vietnam War', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('4686', 'Ben 10', 52, 'COMPLETED', 10, 'cl8ci8ztd000809lbdb6ewkh0'),
	('46922', 'Ben 10: Omniverse', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('48866', 'The 100', 0, 'ON_HOLD', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('513', 'Batman Beyond', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('52', 'That ''70s Show', 200, 'COMPLETED', 9, 'cl8ci8ztd000809lbdb6ewkh0'),
	('52814', 'Halo', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('5835', 'Goosebumps', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('58474', 'Cosmos', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('60059', 'Better Call Saul', 63, 'COMPLETED', 9, 'cl8ci8ztd000809lbdb6ewkh0'),
	('604', 'Teen Titans', 65, 'COMPLETED', 10, 'cl8ci8ztd000809lbdb6ewkh0'),
	('6040', 'Ben 10: Alien Force', 46, 'COMPLETED', 10, 'cl8ci8ztd000809lbdb6ewkh0'),
	('60574', 'Peaky Blinders', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('60625', 'Rick and Morty', 61, 'WATCHING', 9, 'cl8ci8ztd000809lbdb6ewkh0'),
	('60735', 'The Flash', 3, 'ON_HOLD', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('61889', 'Marvel''s Daredevil', 13, 'ON_HOLD', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('62127', 'Marvel''s Iron Fist', 5, 'ON_HOLD', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('62688', 'Supergirl', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('63174', 'Lucifer', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('63351', 'Narcos', 30, 'COMPLETED', 9, 'cl8ci8ztd000809lbdb6ewkh0'),
	('64840', 'Signal', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('66732', 'Stranger Things', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('67178', 'Marvel''s The Punisher', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('71024', 'Castlevania', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('71446', 'Money Heist', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('71912', 'The Witcher', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('7225', 'Merlin', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('75006', 'The Umbrella Academy', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('75450', 'Titans', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('76479', 'The Boys', 24, 'COMPLETED', 9, 'cl8ci8ztd000809lbdb6ewkh0'),
	('77169', 'Cobra Kai', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('79525', 'The Last Dance', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('79788', 'Watchmen', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('80020', 'Super Dragon Ball Heroes', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('80752', 'See', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('81356', 'Sex Education', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('82596', 'Emily in Paris', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('82856', 'The Mandalorian', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('83867', 'Star Wars: Andor', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('84200', 'Justice League Unlimited', 39, 'COMPLETED', 9, 'cl8ci8ztd000809lbdb6ewkh0'),
	('84773', 'The Lord of the Rings: The Rings of Power', 8, 'COMPLETED', 7, 'cl8ci8ztd000809lbdb6ewkh0'),
	('84958', 'Loki', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('85271', 'WandaVision', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('85552', 'Euphoria', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('86831', 'Love, Death & Robots', 30, 'ON_HOLD', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('87108', 'Chernobyl', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('88396', 'The Falcon and the Winter Soldier', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('888', 'Spider-Man', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('92749', 'Moon Knight', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('92783', 'She-Hulk: Attorney at Law', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('92830', 'Obi-Wan Kenobi', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('93297', 'Monarca', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('93405', 'Squid Game', 9, 'COMPLETED', 9, 'cl8ci8ztd000809lbdb6ewkh0'),
	('93740', 'Foundation', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('94605', 'Arcane', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('94997', 'House of the Dragon', 10, 'COMPLETED', 8, 'cl8ci8ztd000809lbdb6ewkh0'),
	('94997', 'House of the Dragon', 9, 'WATCHING', 8, 'cl9g5ai7n000609mkr0wz9rdi'),
	('95171', 'Prehistoric Planet', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('95557', 'Invincible', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('96677', 'Lupin', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0'),
	('126308', 'Shōgun', 0, 'PLAN_TO_WATCH', NULL, 'cl8ci8ztd000809lbdb6ewkh0');


--
-- Data for Name: VerificationToken; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, false);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
