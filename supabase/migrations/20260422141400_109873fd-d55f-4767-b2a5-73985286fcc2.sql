
-- Create a demo auth user
DO $$
DECLARE
  demo_id uuid := '00000000-0000-0000-0000-000000000001';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = demo_id) THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', demo_id, 'authenticated', 'authenticated',
      'demo@hn-immobilier.ma', crypt('Demo!Password2026', gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"HN Immobilier (Demo)"}'::jsonb,
      false, '', '', '', ''
    );
  END IF;
END $$;

-- Ensure profile + owner role
INSERT INTO public.profiles (id, full_name, type, city, verified, phone, bio)
VALUES ('00000000-0000-0000-0000-000000000001', 'HN Immobilier', 'agency', 'Casablanca', true, '+212600000000', 'Agence partenaire de démonstration.')
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, type = EXCLUDED.type, verified = true;

INSERT INTO public.user_roles (user_id, role) VALUES
  ('00000000-0000-0000-0000-000000000001', 'owner')
ON CONFLICT DO NOTHING;

-- Seed 10 properties
WITH owner AS (SELECT '00000000-0000-0000-0000-000000000001'::uuid AS id),
ins AS (
  INSERT INTO public.properties (
    owner_id, title, title_ar, description, description_ar,
    transaction_type, property_type, price, currency,
    surface, rooms, bathrooms, city, district, address,
    status, featured, verified, published_at
  )
  SELECT (SELECT id FROM owner), t.* FROM (VALUES
    ('Appartement moderne vue mer','شقة عصرية بإطلالة على البحر','Superbe T3 lumineux à Anfa avec terrasse, cuisine équipée et parking sécurisé.','شقة رائعة بثلاث غرف في حي أنفا مع شرفة ومطبخ مجهز.','sale'::transaction_type,'apartment'::property_type,1850000,'MAD',120,3,2,'Casablanca','Anfa','Boulevard Anfa, Casablanca','active'::property_status,true,true,now()),
    ('Villa avec piscine à Marrakech','فيلا مع مسبح في مراكش','Villa de standing 5 chambres, piscine privée, jardin paysager, route de l''Ourika.','فيلا فاخرة بخمس غرف، مسبح خاص وحديقة على طريق أوريكا.','sale'::transaction_type,'villa'::property_type,4200000,'MAD',380,5,4,'Marrakech','Route Ourika','Route de l''Ourika, Marrakech','active'::property_status,true,true,now()),
    ('Appartement meublé Rabat','شقة مفروشة بالرباط','T2 meublé proche tramway, idéal jeune cadre. Charges incluses.','شقة مفروشة قرب الترامواي، مثالية للمحترفين.','rent'::transaction_type,'apartment'::property_type,6500,'MAD',75,2,1,'Rabat','Agdal','Avenue de France, Rabat','active'::property_status,false,true,now()),
    ('Riad authentique Médina','رياض أصيل في المدينة العتيقة','Riad rénové 4 chambres au cœur de la médina, patio, terrasse panoramique.','رياض مرمم بأربع غرف في قلب المدينة، فناء وشرفة بانورامية.','sale'::transaction_type,'riad'::property_type,3100000,'MAD',220,4,3,'Marrakech','Médina','Derb Sidi Bouloukat, Marrakech','active'::property_status,true,true,now()),
    ('Maison familiale Tanger','منزل عائلي بطنجة','Maison R+1, 4 chambres, jardin, garage, quartier résidentiel calme.','منزل من طابقين بأربع غرف، حديقة وكراج في حي هادئ.','sale'::transaction_type,'house'::property_type,1650000,'MAD',180,4,2,'Tanger','Malabata','Route de Malabata, Tanger','active'::property_status,false,true,now()),
    ('Studio neuf Agadir','استوديو جديد بأكادير','Studio neuf face mer, parfait investissement locatif saisonnier.','استوديو جديد مقابل البحر، استثمار مثالي للكراء الموسمي.','sale'::transaction_type,'studio'::property_type,580000,'MAD',38,1,1,'Agadir','Founty','Secteur Founty, Agadir','active'::property_status,false,true,now()),
    ('Bureau Casa Finance City','مكتب في كازا فايننس سيتي','Plateau de bureaux 200m², open space, vue panoramique, parkings.','مكاتب بمساحة 200م²، فضاء مفتوح وإطلالة بانورامية.','rent'::transaction_type,'office'::property_type,28000,'MAD',200,0,2,'Casablanca','CFC','Casa Anfa, Casablanca','active'::property_status,true,true,now()),
    ('Terrain constructible Fès','أرض للبناء بفاس','Terrain titré 800m², zone résidentielle R+3 autorisée.','أرض ذات رسم عقاري 800م²، منطقة سكنية مرخصة.','sale'::transaction_type,'land'::property_type,950000,'MAD',800,0,0,'Fès','Route Immouzer','Route d''Immouzer, Fès','active'::property_status,false,true,now()),
    ('Villa contemporaine Tanger','فيلا عصرية بطنجة','Villa contemporaine 6 pièces, piscine, vue baie de Tanger.','فيلا عصرية بست غرف ومسبح بإطلالة على خليج طنجة.','sale'::transaction_type,'villa'::property_type,5800000,'MAD',420,6,5,'Tanger','Cap Spartel','Route du Cap Spartel, Tanger','active'::property_status,true,true,now()),
    ('Local commercial Casa','محل تجاري بالدار البيضاء','Local 90m² sur boulevard très passant, idéal commerce ou restaurant.','محل بمساحة 90م² على شارع رئيسي، مثالي للتجارة.','rent'::transaction_type,'commercial'::property_type,18000,'MAD',90,0,1,'Casablanca','Maarif','Boulevard Zerktouni, Casablanca','active'::property_status,false,true,now())
  ) AS t(title,title_ar,description,description_ar,transaction_type,property_type,price,currency,surface,rooms,bathrooms,city,district,address,status,featured,verified,published_at)
  RETURNING id, title
)
INSERT INTO public.property_images (property_id, image_url, is_primary, display_order)
SELECT i.id, img.url, img.ord = 0, img.ord
FROM ins i
CROSS JOIN LATERAL (
  SELECT * FROM (VALUES
    (CASE i.title
      WHEN 'Appartement moderne vue mer' THEN 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200'
      WHEN 'Villa avec piscine à Marrakech' THEN 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200'
      WHEN 'Appartement meublé Rabat' THEN 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200'
      WHEN 'Riad authentique Médina' THEN 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200'
      WHEN 'Maison familiale Tanger' THEN 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200'
      WHEN 'Studio neuf Agadir' THEN 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200'
      WHEN 'Bureau Casa Finance City' THEN 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200'
      WHEN 'Terrain constructible Fès' THEN 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200'
      WHEN 'Villa contemporaine Tanger' THEN 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200'
      WHEN 'Local commercial Casa' THEN 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=1200'
    END, 0),
    ('https://images.unsplash.com/photo-1560448204-61dc36dc98c8?w=1200', 1),
    ('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200', 2)
  ) AS v(url, ord)
) img;
