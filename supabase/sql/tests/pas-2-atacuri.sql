begin;
create temp table r (n serial, ok bool, t text);
grant all on r to anon, authenticated; grant usage on sequence r_n_seq to anon, authenticated;
create function pg_temp.t_ok(lbl text, q text) returns void language plpgsql as $f$
begin begin execute q; insert into r(ok,t) values (true, lbl); exception when others then insert into r(ok,t) values (false, lbl||' -> '||sqlerrm); end; end $f$;
create function pg_temp.t_err(lbl text, q text) returns void language plpgsql as $f$
declare ok bool := false; begin begin execute q; exception when others then ok := true; end;
insert into r(ok,t) values (ok, lbl||case when ok then '' else ' (a trecut, trebuia refuz)' end); end $f$;
create function pg_temp.t_eq(lbl text, q text, exp text) returns void language plpgsql as $f$
declare v text; begin begin execute q into v; insert into r(ok,t) values (v is not distinct from exp, lbl||' = '||coalesce(v,'null')||' (asteptat '||exp||')'); exception when others then insert into r(ok,t) values (false, lbl||' -> '||sqlerrm); end; end $f$;
-- date de test: A = gama, B = alt workspace
insert into workspaces(id,name,slug) values ('aaaaaaaa-0000-0000-0000-000000000001','TEST A','test-a-rt'),('bbbbbbbb-0000-0000-0000-000000000002','TEST B','test-b-rt');
insert into products(id,workspace_id,name,slug,price,ms_id,ms_type) values
 ('a0000000-0000-0000-0000-00000000000b','aaaaaaaa-0000-0000-0000-000000000001','Buchet','buchet',300,'ms-b','bundle'),
 ('a0000000-0000-0000-0000-0000000000a1','aaaaaaaa-0000-0000-0000-000000000001','Balon','balon',20,'ms-1','product'),
 ('a0000000-0000-0000-0000-0000000000a2','aaaaaaaa-0000-0000-0000-000000000001','Heliu','heliu',10,'ms-2','product'),
 ('a0000000-0000-0000-0000-0000000000a3','aaaaaaaa-0000-0000-0000-000000000001','Fara stoc','fara-stoc',50,'ms-3','product'),
 ('a0000000-0000-0000-0000-0000000000a4','aaaaaaaa-0000-0000-0000-000000000001','Manual','manual',50,null,null),
 ('b0000000-0000-0000-0000-0000000000b1','bbbbbbbb-0000-0000-0000-000000000002','Produs B','pb',10,'ms-x','product');
insert into product_components(workspace_id,product_id,component_id,quantity,is_required) values
 ('aaaaaaaa-0000-0000-0000-000000000001','a0000000-0000-0000-0000-00000000000b','a0000000-0000-0000-0000-0000000000a1',5,false),
 ('aaaaaaaa-0000-0000-0000-000000000001','a0000000-0000-0000-0000-00000000000b','a0000000-0000-0000-0000-0000000000a2',5,true);
insert into stock_cache(product_id,workspace_id,stock) values
 ('a0000000-0000-0000-0000-0000000000a1','aaaaaaaa-0000-0000-0000-000000000001',5),
 ('a0000000-0000-0000-0000-0000000000a2','aaaaaaaa-0000-0000-0000-000000000001',100),
 ('a0000000-0000-0000-0000-0000000000a3','aaaaaaaa-0000-0000-0000-000000000001',0);
insert into orders(id,workspace_id,order_number,customer_email,total_amount) values
 ('0a000000-0000-0000-0000-000000000001','aaaaaaaa-0000-0000-0000-000000000001','O1','x@y.md',300),
 ('0a000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001','O2','x@y.md',300);
insert into order_items(id,workspace_id,order_id,product_id,product_name,unit_price,quantity,line_total) values
 ('01000000-0000-0000-0000-000000000001','aaaaaaaa-0000-0000-0000-000000000001','0a000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-00000000000b','Buchet',300,1,300),
 ('01000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001','0a000000-0000-0000-0000-000000000002','a0000000-0000-0000-0000-00000000000b','Buchet',300,1,300);
insert into order_item_components(workspace_id,order_item_id,component_id,component_name,quantity,unit_price) values
 ('aaaaaaaa-0000-0000-0000-000000000001','01000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-0000000000a1','Balon',5,20),
 ('aaaaaaaa-0000-0000-0000-000000000001','01000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-0000000000a2','Heliu',5,10),
 ('aaaaaaaa-0000-0000-0000-000000000001','01000000-0000-0000-0000-000000000002','a0000000-0000-0000-0000-0000000000a1','Balon',5,20),
 ('aaaaaaaa-0000-0000-0000-000000000001','01000000-0000-0000-0000-000000000002','a0000000-0000-0000-0000-0000000000a2','Heliu',5,10);

-- S1 anon pe tabelele noi
set role anon;
select pg_temp.t_err('S1 anon citeste stock_cache','select count(*) from stock_cache');
select pg_temp.t_err('S1 anon citeste order_items','select count(*) from order_items');
select pg_temp.t_err('S1 anon citeste catalog_produse','select count(*) from catalog_produse');
select pg_temp.t_err('S1 anon scrie product_components','insert into product_components(workspace_id,product_id,component_id,quantity) values (''aaaaaaaa-0000-0000-0000-000000000001'',''a0000000-0000-0000-0000-0000000000a4'',''a0000000-0000-0000-0000-0000000000a1'',1)');
select pg_temp.t_err('S1 anon apeleaza rezerva_stoc','select rezerva_stoc(''0a000000-0000-0000-0000-000000000001'')');
select pg_temp.t_err('S1 anon citeste order_status_history','select count(*) from order_status_history');
select pg_temp.t_ok('S12 anon citeste products (ca inainte)','select count(*) from products');
select pg_temp.t_ok('S12 anon insereaza comanda checkout (ca inainte)','insert into orders(workspace_id,order_number,customer_email,total_amount,status,payment_status) values (''aaaaaaaa-0000-0000-0000-000000000001'',''x'',''rt-test-anon@example.invalid'',10,''new'',''pending'')');
reset role;
-- politica checkout nu exista in stub (doar trigger) -> verificam fortarea campurilor noi
set role authenticated;
select pg_temp.t_err('S1 authenticated citeste product_images','select count(*) from product_images');
reset role;
insert into orders(workspace_id,order_number,customer_email,total_amount,stock_reservation,ms_order_id) values ('aaaaaaaa-0000-0000-0000-000000000001','Z-RT','z@z.md',1,'rezervat','ms-fals');
select pg_temp.t_eq('S1 server poate pune rezervat (doar serverul)', 'select stock_reservation from orders where order_number=''Z-RT''', 'rezervat');

-- S2/S3/S7 legaturi intre workspace-uri
select pg_temp.t_err('S3/S7 componenta din alt workspace','insert into product_components(workspace_id,product_id,component_id,quantity) values (''aaaaaaaa-0000-0000-0000-000000000001'',''a0000000-0000-0000-0000-00000000000b'',''b0000000-0000-0000-0000-0000000000b1'',1)');
select pg_temp.t_err('S3 stock_cache cu workspace fals','insert into stock_cache(product_id,workspace_id,stock) values (''b0000000-0000-0000-0000-0000000000b1'',''aaaaaaaa-0000-0000-0000-000000000001'',5)');
select pg_temp.t_err('S3 order_item cu produs din B','insert into order_items(workspace_id,order_id,product_id,product_name,unit_price,quantity,line_total) values (''aaaaaaaa-0000-0000-0000-000000000001'',''0a000000-0000-0000-0000-000000000002'',''b0000000-0000-0000-0000-0000000000b1'',''x'',1,1,1)');
select pg_temp.t_err('S3 product_tags amestec','insert into tags(id,workspace_id,kind,slug,name) values (''7a000000-0000-0000-0000-000000000001'',''bbbbbbbb-0000-0000-0000-000000000002'',''ocazie'',''nunta'',''Nunta''); insert into product_tags values (''a0000000-0000-0000-0000-0000000000a1'',''7a000000-0000-0000-0000-000000000001'',''aaaaaaaa-0000-0000-0000-000000000001'')');
select pg_temp.t_err('S2 mutare comanda in alt workspace','update orders set workspace_id=''bbbbbbbb-0000-0000-0000-000000000002'' where id=''0a000000-0000-0000-0000-000000000001''');
-- S7 cantitati
select pg_temp.t_err('S7 cantitate 0 reteta','insert into product_components(workspace_id,product_id,component_id,quantity) values (''aaaaaaaa-0000-0000-0000-000000000001'',''a0000000-0000-0000-0000-0000000000a4'',''a0000000-0000-0000-0000-0000000000a1'',0)');
select pg_temp.t_err('S7 cantitate negativa','insert into order_items(workspace_id,order_id,product_name,unit_price,quantity,line_total) values (''aaaaaaaa-0000-0000-0000-000000000001'',''0a000000-0000-0000-0000-000000000002'',''x'',1,-1,-1)');
select pg_temp.t_err('S7 cantitate uriasa','insert into order_items(workspace_id,order_id,product_name,unit_price,quantity,line_total) values (''aaaaaaaa-0000-0000-0000-000000000001'',''0a000000-0000-0000-0000-000000000002'',''x'',1,100000,100000)');
select pg_temp.t_err('S7 cantitate zecimala linie','insert into order_items(workspace_id,order_id,product_name,unit_price,quantity,line_total) values (''aaaaaaaa-0000-0000-0000-000000000001'',''0a000000-0000-0000-0000-000000000002'',''x'',1,1.5,1.5)');
select pg_temp.t_err('S5 total linie falsificat','insert into order_items(workspace_id,order_id,product_name,unit_price,quantity,line_total) values (''aaaaaaaa-0000-0000-0000-000000000001'',''0a000000-0000-0000-0000-000000000002'',''x'',100,2,1)');
select pg_temp.t_err('S7 produs cu el insusi ca componenta','insert into product_components(workspace_id,product_id,component_id,quantity) values (''aaaaaaaa-0000-0000-0000-000000000001'',''a0000000-0000-0000-0000-0000000000a1'',''a0000000-0000-0000-0000-0000000000a1'',1)');

-- S6 obligatoriu
select pg_temp.t_err('S6 eliminare heliu (is_required trimis false)','insert into order_item_components(workspace_id,order_item_id,component_id,component_name,quantity,unit_price,is_required,change) values (''aaaaaaaa-0000-0000-0000-000000000001'',''01000000-0000-0000-0000-000000000002'',''a0000000-0000-0000-0000-0000000000a2'',''Heliu'',0,10,false,''eliminat'')');
select pg_temp.t_ok('S6 eliminare balon (optional)','insert into order_item_components(workspace_id,order_item_id,component_id,component_name,quantity,unit_price,change) values (''aaaaaaaa-0000-0000-0000-000000000001'',''01000000-0000-0000-0000-000000000002'',''a0000000-0000-0000-0000-0000000000a1'',''Balon2'',0,20,''eliminat'')');

-- S8 catalog
select pg_temp.t_eq('S8 vizibile in catalog (gama)', 'select string_agg(slug,'','' order by slug) from catalog_produse where workspace_id=''aaaaaaaa-0000-0000-0000-000000000001''', 'balon,buchet,heliu,manual');
update stock_cache set stock=1 where product_id='a0000000-0000-0000-0000-0000000000a2';
select pg_temp.t_eq('S8 compozitie dispare fara heliu suficient', 'select count(*) from catalog_produse where slug=''buchet''', '0');
update stock_cache set stock=100 where product_id='a0000000-0000-0000-0000-0000000000a2';
update products set made_to_order=true where slug='fara-stoc';
select pg_temp.t_eq('S8 la comanda apare fara stoc', 'select la_comanda::text from catalog_produse where slug=''fara-stoc''', 'true');

-- S9 rezervare: doua comenzi pe ultimele 5 baloane
select pg_temp.t_eq('S9 rezerva O1', 'select rezerva_stoc(''0a000000-0000-0000-0000-000000000001'')', 'rezervat');
select pg_temp.t_err('S9 rezerva O2 (stoc epuizat)', 'select rezerva_stoc(''0a000000-0000-0000-0000-000000000002'')');
select pg_temp.t_eq('S9 reserved balon', 'select reserved::int::text from stock_cache where product_id=''a0000000-0000-0000-0000-0000000000a1''', '5');
select pg_temp.t_eq('S9 reserved heliu (O2 a facut rollback)', 'select reserved::int::text from stock_cache where product_id=''a0000000-0000-0000-0000-0000000000a2''', '5');
select pg_temp.t_eq('S9 dubla rezervare O1', 'select rezerva_stoc(''0a000000-0000-0000-0000-000000000001'')', 'deja_rezervat');
select pg_temp.t_eq('S8 balon dispare cand e rezervat tot', 'select count(*) from catalog_produse where slug=''balon''', '0');

-- S5 inghetare dupa confirmare
update orders set status='confirmed' where id='0a000000-0000-0000-0000-000000000001';
select pg_temp.t_err('S5 modificare pret linie', 'update order_items set unit_price=1 where id=''01000000-0000-0000-0000-000000000001''');
select pg_temp.t_err('S5 modificare componenta', 'update order_item_components set quantity=1 where order_item_id=''01000000-0000-0000-0000-000000000001''');
select pg_temp.t_err('S5 stergere componenta dupa confirmare', 'delete from order_item_components where order_item_id=''01000000-0000-0000-0000-000000000001''');
select pg_temp.t_err('S5 modificare total dupa confirmare', 'update orders set total_amount=1 where id=''0a000000-0000-0000-0000-000000000001''');
select pg_temp.t_eq('istoric status', 'select old_status||''->''||new_status from order_status_history where order_id=''0a000000-0000-0000-0000-000000000001''', 'new->confirmed');

-- S10 stergere produs folosit
delete from products where id='a0000000-0000-0000-0000-0000000000a1';
select pg_temp.t_eq('S10 linia istorica ramane cu nume', 'select component_name||'':''||coalesce(component_id::text,''null'') from order_item_components where order_item_id=''01000000-0000-0000-0000-000000000001'' and component_name=''Balon''', 'Balon:null');
select pg_temp.t_eq('elibereaza O1', 'select elibereaza_stoc(''0a000000-0000-0000-0000-000000000001'')', 'eliberat');
select pg_temp.t_eq('heliu eliberat', 'select reserved::int::text from stock_cache where product_id=''a0000000-0000-0000-0000-0000000000a2''', '0');

-- S13 poze
select pg_temp.t_err('S13 URL extern', 'insert into product_images(workspace_id,product_id,storage_path) values (''aaaaaaaa-0000-0000-0000-000000000001'',''a0000000-0000-0000-0000-0000000000a2'',''https://evil.com/x.jpg'')');
select pg_temp.t_err('S13 path traversal', 'insert into product_images(workspace_id,product_id,storage_path) values (''aaaaaaaa-0000-0000-0000-000000000001'',''a0000000-0000-0000-0000-0000000000a2'',''aaaaaaaa-0000-0000-0000-000000000001/../b/x.jpg'')');
select pg_temp.t_err('S13 prefix alt workspace', 'insert into product_images(workspace_id,product_id,storage_path) values (''aaaaaaaa-0000-0000-0000-000000000001'',''a0000000-0000-0000-0000-0000000000a2'',''bbbbbbbb-0000-0000-0000-000000000002/x.jpg'')');
select pg_temp.t_err('S13 javascript:', 'insert into product_images(workspace_id,product_id,storage_path) values (''aaaaaaaa-0000-0000-0000-000000000001'',''a0000000-0000-0000-0000-0000000000a2'',''javascript:alert(1)'')');
select pg_temp.t_ok('S13 cheie corecta', 'insert into product_images(workspace_id,product_id,storage_path,is_primary) values (''aaaaaaaa-0000-0000-0000-000000000001'',''a0000000-0000-0000-0000-0000000000a2'',''aaaaaaaa-0000-0000-0000-000000000001/heliu/1.webp'',true)');
select pg_temp.t_err('S13 a doua poza principala', 'insert into product_images(workspace_id,product_id,storage_path,is_primary) values (''aaaaaaaa-0000-0000-0000-000000000001'',''a0000000-0000-0000-0000-0000000000a2'',''aaaaaaaa-0000-0000-0000-000000000001/heliu/2.webp'',true)');

-- S11 recursivitate: nu exista politici noi
select pg_temp.t_eq('S11 politici pe tabelele noi', 'select count(*) from pg_policies where tablename in (''ms_folders'',''product_components'',''stock_cache'',''tags'',''product_tags'',''product_images'',''blocked_days'',''order_items'',''order_item_components'',''order_status_history'')', '0');
select pg_temp.t_err('S5 schimbare componenta in alt produs', 'update order_item_components set component_id=''a0000000-0000-0000-0000-0000000000a3'' where order_item_id=''01000000-0000-0000-0000-000000000001'' and component_name=''Heliu''');
select pg_temp.t_err('S5 golire legatura + schimbare cantitate', 'update order_item_components set component_id=null, quantity=99 where order_item_id=''01000000-0000-0000-0000-000000000001'' and component_name=''Heliu''');

-- ===== Defecte găsite de echipa roșie (25.11.2026) =====
insert into products(id,workspace_id,name,slug,price,ms_id,ms_type,made_to_order) values
 ('c0000000-0000-0000-0000-000000000001','aaaaaaaa-0000-0000-0000-000000000001','Stoc10','stoc10',5,'ms-s10','product',false),
 ('c0000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001','LaComanda','lacomanda',5,'ms-lc','product',true),
 ('c0000000-0000-0000-0000-000000000003','aaaaaaaa-0000-0000-0000-000000000001','RetetaReq','reteta-req',100,'ms-rr','bundle',false),
 ('c0000000-0000-0000-0000-000000000004','aaaaaaaa-0000-0000-0000-000000000001','CompInactiva','comp-inactiva',5,'ms-ci','product',false);
insert into stock_cache(product_id,workspace_id,stock) values
 ('c0000000-0000-0000-0000-000000000001','aaaaaaaa-0000-0000-0000-000000000001',10),
 ('c0000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',3),
 ('c0000000-0000-0000-0000-000000000004','aaaaaaaa-0000-0000-0000-000000000001',50);
insert into orders(id,workspace_id,order_number,customer_email,total_amount) values
 ('0d000000-0000-0000-0000-000000000003','aaaaaaaa-0000-0000-0000-000000000001','O3','x@y.md',20),
 ('0d000000-0000-0000-0000-000000000004','aaaaaaaa-0000-0000-0000-000000000001','O4','x@y.md',20),
 ('0d000000-0000-0000-0000-000000000005','aaaaaaaa-0000-0000-0000-000000000001','O5','x@y.md',15),
 ('0d000000-0000-0000-0000-000000000006','aaaaaaaa-0000-0000-0000-000000000001','O6','x@y.md',10),
 ('0d000000-0000-0000-0000-000000000007','aaaaaaaa-0000-0000-0000-000000000001','O7','x@y.md',100);
insert into order_items(workspace_id,order_id,product_id,product_name,unit_price,quantity,line_total) values
 ('aaaaaaaa-0000-0000-0000-000000000001','0d000000-0000-0000-0000-000000000003','c0000000-0000-0000-0000-000000000001','Stoc10',5,4,20),
 ('aaaaaaaa-0000-0000-0000-000000000001','0d000000-0000-0000-0000-000000000005','c0000000-0000-0000-0000-000000000002','LaComanda',5,3,15),
 ('aaaaaaaa-0000-0000-0000-000000000001','0d000000-0000-0000-0000-000000000006','c0000000-0000-0000-0000-000000000002','LaComanda',5,2,10),
 ('aaaaaaaa-0000-0000-0000-000000000001','0d000000-0000-0000-0000-000000000007','c0000000-0000-0000-0000-000000000003','RetetaReq',100,1,100);
insert into product_components(workspace_id,product_id,component_id,quantity,is_required) values
 ('aaaaaaaa-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000003','c0000000-0000-0000-0000-000000000004',1,true);

select pg_temp.t_eq('A1 rezerva O3', 'select rezerva_stoc(''0d000000-0000-0000-0000-000000000003'')', 'rezervat');
select pg_temp.t_err('A1 stergere linie dupa rezervare', 'delete from order_items where order_id=''0d000000-0000-0000-0000-000000000003''');
select pg_temp.t_err('A1 adaugare linie dupa rezervare', 'insert into order_items(workspace_id,order_id,product_name,unit_price,quantity,line_total) values (''aaaaaaaa-0000-0000-0000-000000000001'',''0d000000-0000-0000-0000-000000000003'',''x'',1,1,1)');
select pg_temp.t_eq('A1 elibereaza O3', 'select elibereaza_stoc(''0d000000-0000-0000-0000-000000000003'')', 'eliberat');
select pg_temp.t_eq('A1 reserved revine la 0', 'select reserved::int::text from stock_cache where product_id=''c0000000-0000-0000-0000-000000000001''', '0');
select pg_temp.t_eq('A1 a doua eliberare nu scade din nou', 'select elibereaza_stoc(''0d000000-0000-0000-0000-000000000003'')', 'nimic_de_eliberat');
select pg_temp.t_eq('A4 O5 rezerva 3 la comanda', 'select rezerva_stoc(''0d000000-0000-0000-0000-000000000005'')', 'rezervat');
select pg_temp.t_eq('A4 O6 (stoc epuizat, la comanda) fara a lua stoc', 'select rezerva_stoc(''0d000000-0000-0000-0000-000000000006'')', 'rezervat');
select pg_temp.t_eq('A4 elibereaza O6', 'select elibereaza_stoc(''0d000000-0000-0000-0000-000000000006'')', 'eliberat');
select pg_temp.t_eq('A4 reserved ramane 3 (O5)', 'select reserved::int::text from stock_cache where product_id=''c0000000-0000-0000-0000-000000000002''', '3');
select pg_temp.t_err('A2 insert linie pe comanda confirmata', 'insert into order_items(workspace_id,order_id,product_name,unit_price,quantity,line_total) values (''aaaaaaaa-0000-0000-0000-000000000001'',''0a000000-0000-0000-0000-000000000001'',''x'',0,1,0)');
select pg_temp.t_err('A2 insert componenta pe comanda confirmata', 'insert into order_item_components(workspace_id,order_item_id,component_name,quantity,unit_price) values (''aaaaaaaa-0000-0000-0000-000000000001'',''01000000-0000-0000-0000-000000000001'',''x'',1,0)');
update orders set status='confirmed' where id='0d000000-0000-0000-0000-000000000004';
update orders set status='new' where id='0d000000-0000-0000-0000-000000000004';
select pg_temp.t_err('A3 total dupa new->confirmed->new', 'update orders set total_amount=1 where id=''0d000000-0000-0000-0000-000000000004''');
select pg_temp.t_err('A3 linie dupa new->confirmed->new', 'insert into order_items(workspace_id,order_id,product_name,unit_price,quantity,line_total) values (''aaaaaaaa-0000-0000-0000-000000000001'',''0d000000-0000-0000-0000-000000000004'',''x'',1,1,1)');
select pg_temp.t_ok('S5 status se schimba liber (ca in aplicatie)', 'update orders set status=''in_productie'' where id=''0d000000-0000-0000-0000-000000000004''');
select pg_temp.t_err('A5 stergere comanda confirmata', 'delete from orders where id=''0a000000-0000-0000-0000-000000000001''');
select pg_temp.t_ok('A5 stergere comanda noua, fara istoric', 'delete from orders where customer_email=''rt-test-anon@example.invalid''');
select pg_temp.t_err('S6 linie reteta fara componente nu se rezerva', 'select rezerva_stoc(''0d000000-0000-0000-0000-000000000007'')');
insert into ms_folders(id,workspace_id,ms_id,name,is_synced) values ('f0000000-0000-0000-0000-000000000001','aaaaaaaa-0000-0000-0000-000000000001','mf1','Mapa X',false);
update products set ms_folder_id='f0000000-0000-0000-0000-000000000001' where id='c0000000-0000-0000-0000-000000000001';
select pg_temp.t_eq('S8 produs din mapa nesincronizata ascuns', 'select count(*) from catalog_produse where slug=''stoc10''', '0');
update ms_folders set is_synced=true where id='f0000000-0000-0000-0000-000000000001';
select pg_temp.t_eq('S8 produs din mapa sincronizata apare', 'select count(*) from catalog_produse where slug=''stoc10''', '1');
select pg_temp.t_eq('S8 compozitie cu componenta activa apare', 'select count(*) from catalog_produse where slug=''reteta-req''', '1');
update products set is_active=false where id='c0000000-0000-0000-0000-000000000004';
select pg_temp.t_eq('S8 compozitie cu componenta obligatorie inactiva ascunsa', 'select count(*) from catalog_produse where slug=''reteta-req''', '0');
select pg_temp.t_eq('S11 politici pe tabelele noi (final)', 'select count(*) from pg_policies where tablename in (''ms_folders'',''product_components'',''stock_cache'',''tags'',''product_tags'',''product_images'',''blocked_days'',''order_items'',''order_item_components'',''order_status_history'',''order_stock_reservations'')', '0');
set role anon;
select pg_temp.t_err('S1 anon citeste order_stock_reservations', 'select count(*) from order_stock_reservations');
reset role;

reset role;
do $d$ begin raise exception 'REZULTAT: % teste, % cazute. %', (select count(*) from r), (select count(*) from r where not ok),
  coalesce((select string_agg(t, ' | ' order by n) from r where not ok), 'toate trec'); end $d$;
