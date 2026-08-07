-- =============================================================
-- CropWise AI Care — storage bucket + seed data
-- Run after 0001_init.sql (supabase db push applies in order).
-- =============================================================

-- ---------- Storage: public crop-images bucket ----------
insert into storage.buckets (id, name, public)
values ('crop-images', 'crop-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read crop images" on storage.objects;
create policy "Public read crop images"
  on storage.objects for select
  using (bucket_id = 'crop-images');

drop policy if exists "Authenticated users can upload crop images" on storage.objects;
create policy "Authenticated users can upload crop images"
  on storage.objects for insert
  with check (
    bucket_id = 'crop-images'
    and auth.role() = 'authenticated'
  );

-- ---------- Seed: curated disease library ----------
insert into public.diseases (slug, name, crop, pathogen, severity, symptoms, causes, organic_treatments, chemical_treatments, prevention)
values
  (
    'tomato-early-blight',
    'Early Blight',
    'Tomato',
    'Alternaria solani',
    'high',
    '["Dark brown spots with concentric rings on older leaves", "Yellowing around leaf spots", "Spots enlarge and merge, causing leaf drop"]',
    '["Warm, humid weather (24-29°C)", "Fungal spores spread by wind and rain splash", "Overhead irrigation keeps foliage wet"]',
    '["Neem oil spray every 5 days", "Remove and destroy infected lower leaves", "Copper-based fungicide (Bordeaux mixture)"]',
    '["Chlorothalonil 75% WP at 2 g/L", "Mancozeb 75% WP at 2.5 g/L", "Alternate fungicides to avoid resistance"]',
    '["Use disease-free seeds", "Rotate crops — avoid tomato on same land for 2 years", "Mulch to prevent soil splash", "Water at the base, not the foliage"]'
  ),
  (
    'tomato-late-blight',
    'Late Blight',
    'Tomato',
    'Phytophthora infestans',
    'high',
    '["Water-soaked, greasy-looking lesions on leaves", "White fuzzy growth on underside of leaves", "Dark firm lesions on stems and fruits"]',
    '["Cool (15-22°C) and very humid conditions", "Rain or heavy dew for 10+ hours", "Infected potato crops nearby"]',
    '["Remove and destroy affected plants immediately", "Copper oxychloride spray at 3 g/L", "Increase plant spacing for airflow"]',
    '["Metalaxyl + Mancozeb 72% WP at 2.5 g/L", "Cymoxanil + Mancozeb at 3 g/L", "Apply preventively before rainy spells"]',
    '["Use certified, disease-free transplants", "Avoid overhead irrigation in cool weather", "Remove volunteer tomato/potato plants", "Scout fields daily during humid spells"]'
  ),
  (
    'wheat-leaf-rust',
    'Leaf Rust',
    'Wheat',
    'Puccinia triticina',
    'medium',
    '["Small orange-brown pustules on leaf blades", "Pustules break open releasing orange spores", "Heavy infection turns leaves brown and dry"]',
    '["Mild temperatures (15-22°C) with dew", "Airborne spores carried long distances by wind", "Continuous wheat cropping"]',
    '["Spray neem-based formulations early", "Grow rust-tolerant varieties", "Remove volunteer wheat plants"]',
    '["Propiconazole 25% EC at 1 mL/L", "Tebuconazole 250 EC at 1 mL/L", "Apply at first pustule appearance"]',
    '["Plant resistant varieties", "Delay sowing to avoid peak disease window", "Balanced nitrogen — avoid excess", "Monitor weekly during flag leaf stage"]'
  ),
  (
    'rice-blast',
    'Rice Blast',
    'Rice',
    'Magnaporthe oryzae',
    'high',
    '["Diamond-shaped lesions with grey centre on leaves", "Dark brown borders around lesions", "Neck blast causes panicle breakage and grain loss"]',
    '["High humidity with temperature swings (25-28°C)", "Excess nitrogen fertiliser", "Dense planting reduces airflow"]',
    '["Silicon-rich amendments strengthen plant tissue", "Remove infected stubble after harvest", "Avoid late evening irrigation"]',
    '["Tricyclazole 75% WP at 0.6 g/L", "Isoprothiolane 40% EC at 1.5 mL/L", "Foliar spray at booting stage"]',
    '["Use blast-resistant varieties", "Seed treatment with fungicide before sowing", "Split nitrogen application", "Maintain 2-3 cm standing water"]'
  ),
  (
    'chilli-leaf-curl',
    'Leaf Curl Virus',
    'Chilli',
    'Whitefly-borne begomovirus',
    'high',
    '["Upward curling and crinkling of leaves", "Reduced leaf size and bushy appearance", "Stunted plants with poor fruit set"]',
    '["Whitefly infestation transmits the virus", "Hot, dry weather favours whitefly breeding", "Infected seedlings planted into field"]',
    '["Yellow sticky traps for whitefly monitoring", "Neem oil spray (5 mL/L) repels whiteflies", "Remove and destroy infected plants"]',
    '["Imidacloprid 17.8 SL at 0.3 mL/L for whitefly", "Thiamethoxam 25 WG at 0.3 g/L", "Control vector before disease spreads"]',
    '["Use virus-free seedlings from screened nurseries", "Install insect-proof nets in nursery", "Remove weeds that host whitefly", "Avoid planting near old chilli fields"]'
  )
on conflict (slug) do update set
  name = excluded.name,
  crop = excluded.crop,
  pathogen = excluded.pathogen,
  severity = excluded.severity,
  symptoms = excluded.symptoms,
  causes = excluded.causes,
  organic_treatments = excluded.organic_treatments,
  chemical_treatments = excluded.chemical_treatments,
  prevention = excluded.prevention;

-- ---------- Seed: agri centres (sample) ----------
insert into public.agri_centres (name, type, address, phone, lat, lng, hours)
values
  ('Nashik Krishi Kendra', 'krishi_kendra', 'College Road, Nashik, Maharashtra', '+91 253 234 5678', 19.9975, 73.7898, '9 AM – 6 PM'),
  ('Pune Soil Testing Lab', 'soil_lab', 'Shivajinagar, Pune, Maharashtra', '+91 20 2553 4120', 18.5204, 73.8567, '9:30 AM – 5:30 PM'),
  ('Vidarbha Agro Inputs', 'input_dealer', 'Besa Road, Nagpur, Maharashtra', '+91 712 264 8899', 21.1458, 79.0882, '8 AM – 8 PM'),
  ('Ludhiana Krishi Vigyan Kendra', 'krishi_kendra', 'PAU Campus, Ludhiana, Punjab', '+91 161 240 1960', 30.9010, 75.8573, '9 AM – 5 PM'),
  ('Punjab Agro Seed Centre', 'input_dealer', 'G.T. Road, Amritsar, Punjab', '+91 183 222 3456', 31.6340, 74.8723, '9 AM – 7 PM')
on conflict (id) do nothing;
