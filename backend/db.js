const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'serenest.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      specialist TEXT NOT NULL,
      session_type TEXT NOT NULL,
      preferred_date TEXT NOT NULL,
      time_slot TEXT NOT NULL,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      reaching_out_as TEXT,
      subject TEXT,
      message TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS doctor_applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      specialty TEXT NOT NULL,
      years_experience TEXT NOT NULL,
      introduction TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS visits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page TEXT,
      referrer TEXT,
      ip TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS grievances (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT,
      message TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      excerpt TEXT,
      body TEXT NOT NULL,
      category TEXT,
      author_name TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS slots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      specialist TEXT NOT NULL,
      slot_date TEXT NOT NULL,
      slot_time TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      full_name TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL REFERENCES patients(id),
      token TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL REFERENCES patients(id),
      token TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      used INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS otp_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT NOT NULL,
      code TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      used INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      specialist_name TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      comment TEXT,
      patient_name TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS specialists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      display_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS email_verification_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL REFERENCES patients(id),
      token TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      used INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS pricing_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT NOT NULL,
      title TEXT NOT NULL,
      amount TEXT NOT NULL,
      note TEXT,
      features TEXT NOT NULL,
      is_featured INTEGER DEFAULT 0,
      display_order INTEGER DEFAULT 0,
      active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS faq_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      display_order INTEGER DEFAULT 0,
      active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      icon TEXT DEFAULT '🧬',
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      features TEXT NOT NULL,
      display_order INTEGER DEFAULT 0,
      active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quote TEXT NOT NULL,
      author_name TEXT NOT NULL,
      author_meta TEXT,
      rating INTEGER DEFAULT 5,
      avatar_initials TEXT,
      active INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // ── Migrations: add columns if they don't exist ──
  const migrations = [
    "ALTER TABLE bookings ADD COLUMN payment_id TEXT",
    "ALTER TABLE bookings ADD COLUMN video_link TEXT",
    "ALTER TABLE bookings ADD COLUMN patient_id INTEGER REFERENCES patients(id)",
    "ALTER TABLE bookings ADD COLUMN status TEXT DEFAULT 'pending'",
    "ALTER TABLE bookings ADD COLUMN confirmed_at TEXT",
    "ALTER TABLE patients ADD COLUMN google_id TEXT",
    "ALTER TABLE patients ADD COLUMN phone TEXT",
    "ALTER TABLE patients ADD COLUMN avatar_url TEXT",
    "ALTER TABLE patients ADD COLUMN email_verified INTEGER DEFAULT 0",
    // Rich specialist fields
    "ALTER TABLE specialists ADD COLUMN title TEXT",
    "ALTER TABLE specialists ADD COLUMN bio TEXT",
    "ALTER TABLE specialists ADD COLUMN qualifications TEXT",
    "ALTER TABLE specialists ADD COLUMN experience_years INTEGER DEFAULT 0",
    "ALTER TABLE specialists ADD COLUMN languages TEXT DEFAULT 'English, Hindi'",
    "ALTER TABLE specialists ADD COLUMN photo_url TEXT",
    "ALTER TABLE specialists ADD COLUMN available INTEGER DEFAULT 1",
    // pricing_plans migrations
    "ALTER TABLE pricing_plans ADD COLUMN active INTEGER DEFAULT 1",
    // faq_items migrations
    "ALTER TABLE faq_items ADD COLUMN active INTEGER DEFAULT 1",
    // services migrations
    "ALTER TABLE services ADD COLUMN active INTEGER DEFAULT 1",
    // testimonials migrations
    "ALTER TABLE testimonials ADD COLUMN active INTEGER DEFAULT 1",

  ];
  for (const sql of migrations) {
    try { db.exec(sql); } catch (e) { if (!e.message || (!e.message.includes('already exists') && !e.message.includes('duplicate column'))) throw e; }
  }

  // ── Seed specialists with rich data if empty ──
  const specCount = db.prepare('SELECT COUNT(*) as n FROM specialists').get();
  if (specCount && specCount.n === 0) {
    const ins = db.prepare(`INSERT INTO specialists (name, title, bio, qualifications, experience_years, languages, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)`);
    const specs = [
      ['Dr. Chirag Aambalia', 'Psychiatrist', 'Dr. Aambalia specialises in mood disorders, anxiety, and adult psychiatry. He combines evidence-based pharmacotherapy with a deeply empathetic, patient-centred approach.', 'MBBS, MD (Psychiatry)', 10, 'English, Hindi, Gujarati', 0],
      ['Dr. Priya Sharma', 'Psychiatrist', 'Dr. Sharma focuses on women\'s mental health, perinatal psychiatry, and OCD. She is known for creating a safe, non-judgmental space for her patients.', 'MBBS, DPM, DNB (Psychiatry)', 8, 'English, Hindi', 1],
      ['Ms. Kavya Nair', 'Clinical Psychologist', 'Ms. Nair uses Cognitive Behavioural Therapy (CBT) and mindfulness-based approaches to help patients manage anxiety, depression, and relationship challenges.', 'M.Phil (Clinical Psychology), RCI Licensed', 6, 'English, Malayalam, Hindi', 2],
      ['Mr. Arjun Mehta', 'Counselling Psychologist', 'Mr. Mehta works with young adults navigating career stress, identity, and life transitions. His approach is warm, collaborative, and goal-oriented.', 'MA (Psychology), M.Sc (Counselling)', 5, 'English, Hindi', 3],
      ['Dr. Meera Iyer', 'Addiction Psychiatrist', 'Dr. Iyer has extensive experience in de-addiction psychiatry and helping patients with substance use disorders, compulsive behaviours, and dual diagnoses.', 'MBBS, MD (Psychiatry), PGDAC', 12, 'English, Tamil, Hindi', 4],
      ['Ms. Ananya Gupta', 'Trauma Therapist', 'Ms. Gupta is trained in EMDR and trauma-focused CBT, supporting survivors of complex trauma, PTSD, and adverse childhood experiences.', 'MSW (Clinical), Certified EMDR Practitioner', 7, 'English, Hindi', 5],
    ];
    specs.forEach(s => ins.run(...s));
  }

  // ── Seed blog posts if empty ──
  const postCount = db.prepare('SELECT COUNT(*) as n FROM posts').get();
  if (postCount && postCount.n === 0) {
    const ins = db.prepare(`INSERT INTO posts (title, slug, excerpt, body, category, author_name) VALUES (?, ?, ?, ?, ?, ?)`);
    const posts = [
      [
        'Understanding Anxiety: What It Is and When to Seek Help',
        'understanding-anxiety',
        'Anxiety is one of the most common mental health conditions in India. Learn the difference between everyday worry and an anxiety disorder — and when professional support makes all the difference.',
        `<p>Anxiety is your body's natural response to stress. It's a feeling of fear or apprehension about what's to come. But when anxiety becomes persistent, overwhelming, or starts interfering with daily life, it may be time to seek help.</p><h2>What does anxiety feel like?</h2><p>Anxiety can show up as a racing heart, difficulty concentrating, excessive worry, muscle tension, irritability, or trouble sleeping. Many people experience physical symptoms — headaches, an upset stomach, or shortness of breath — without realising anxiety is the cause.</p><h2>The difference between normal and clinical anxiety</h2><p>Feeling anxious before a job interview or exam is completely normal. Clinical anxiety disorders are different: the worry is persistent (lasting 6+ months), difficult to control, and significantly impacts your work, relationships, or quality of life.</p><h2>When to seek help</h2><p>If anxiety is stopping you from doing things you want to do, affecting your sleep, or causing you to avoid situations entirely, speaking with a mental health professional is a strong first step. Effective treatments — including CBT, medication, and mindfulness — are available and work well.</p><p>At Serenest, our psychiatrists and therapists are experienced in treating all forms of anxiety. <a href="/book.html">Book a confidential consultation</a> to get started.</p>`,
        'Mental Health',
        'Dr. Priya Sharma'
      ],
      [
        'How Telepsychiatry Works: Your First Online Session Explained',
        'how-telepsychiatry-works',
        'Never had an online therapy session before? Here\'s exactly what to expect — from booking to your first video call with a specialist.',
        `<p>Telepsychiatry — mental healthcare delivered via video — has made it possible for millions of people to access quality care without leaving home. If you're new to it, here's a simple walkthrough of how it works at Serenest.</p><h2>Step 1: Book your session</h2><p>Visit our <a href="/book.html">booking page</a>, choose your specialist, pick a date and time, and submit a brief note about what you'd like support with. No lengthy forms, no waiting rooms.</p><h2>Step 2: Confirmation</h2><p>You'll receive a confirmation email with your session details. A few hours before your session, you'll receive a secure video link.</p><h2>Step 3: The session</h2><p>Click the link at your appointment time. Your session takes place over an encrypted video call — just like a face-to-face consultation, but from the comfort of your home. Most initial sessions last 45–60 minutes.</p><h2>Is it as effective as in-person care?</h2><p>Research consistently shows that telepsychiatry is as effective as in-person therapy for most conditions. Many patients actually find it easier to open up from the comfort of their own space.</p><p>Ready to try? <a href="/book.html">Book your first session today</a>.</p>`,
        'Platform',
        'Serenest Team'
      ],
      [
        '5 Signs You Might Be Experiencing Burnout (and What to Do)',
        'signs-of-burnout',
        'Burnout is more than just being tired. It\'s a state of chronic stress that leads to physical and emotional exhaustion. Here are five signs to watch for.',
        `<p>Burnout has become one of the most talked-about mental health topics — and for good reason. In India's high-pressure work culture, burnout is widespread. But it's often misunderstood as simply "being tired."</p><h2>1. You feel emotionally exhausted, not just physically tired</h2><p>Burnout goes beyond physical fatigue. You feel drained even after a full night's sleep, emotionally numb, and unable to feel enthusiasm for things you used to enjoy.</p><h2>2. You've become cynical or detached</h2><p>Burnout often leads to a sense of detachment — from your work, your colleagues, and sometimes from your personal life. You might find yourself going through the motions without real engagement.</p><h2>3. Your performance is suffering</h2><p>Difficulty concentrating, making more mistakes, and a drop in productivity are common signs. It's not laziness — it's your nervous system signalling overload.</p><h2>4. Physical symptoms with no clear cause</h2><p>Frequent headaches, stomach issues, getting sick more often — burnout has real physical manifestations. Your body keeps the score.</p><h2>5. You dread going to work every day</h2><p>Sunday evening dread, persistent anxiety about the week ahead, and dreading your inbox are warning signs worth taking seriously.</p><h2>What to do</h2><p>Burnout doesn't resolve on its own. Talking to a therapist or counsellor can help you identify root causes and build sustainable strategies. <a href="/book.html">Book a consultation with one of our specialists.</a></p>`,
        'Wellbeing',
        'Ms. Kavya Nair'
      ],
      [
        'Breaking the Stigma: Talking to Your Family About Mental Health',
        'talking-to-family-about-mental-health',
        'In many Indian families, mental health is still a taboo subject. Here\'s how to start the conversation — gently, clearly, and without fear.',
        `<p>In many South Asian families, seeking mental health support is still seen as a sign of weakness or something to be ashamed of. This stigma keeps countless people from getting the help they deserve. But conversations are changing — and you can be part of that change.</p><h2>Start with education, not emotion</h2><p>If your family dismisses mental health struggles as "drama" or "overthinking," it's often because they don't have the right information. Share a short article (like this one), a documentary, or a trusted resource that explains what mental health conditions actually are.</p><h2>Choose the right moment</h2><p>Don't bring it up in the middle of an argument or a stressful family event. Choose a calm, private moment when you have time to talk without interruptions.</p><h2>Use "I" statements</h2><p>Instead of "you never understand me," try "I've been feeling overwhelmed and I'd like to talk to someone professionally." This reduces defensiveness and keeps the focus on your experience.</p><h2>Be patient</h2><p>Your family may not understand or accept it immediately. That's okay. Plant the seed and give it time. Change in attitudes often happens gradually.</p><h2>You don't need permission</h2><p>Ultimately, your mental health is your responsibility. You don't need anyone's permission to seek help. If you're ready, <a href="/book.html">book a confidential session</a> — your first step is between you and your specialist.</p>`,
        'Family & Relationships',
        'Mr. Arjun Mehta'
      ],
      [
        'Sleep and Mental Health: Why Rest Is Not a Luxury',
        'sleep-and-mental-health',
        'Poor sleep and poor mental health are deeply connected. Understanding this relationship is the first step to breaking the cycle.',
        `<p>We live in a culture that glorifies "grinding" and often treats sleep as optional. But sleep is one of the most powerful tools for mental wellbeing — and neglecting it has real consequences.</p><h2>The sleep-mental health connection</h2><p>Sleep and mental health have a bidirectional relationship. Poor sleep worsens anxiety, depression, and emotional regulation. And anxiety and depression make it harder to sleep. It's a cycle that's hard to break without addressing both sides.</p><h2>How much sleep do you actually need?</h2><p>Most adults need 7–9 hours of quality sleep per night. Less than 6 hours consistently is associated with significantly elevated risks of depression, anxiety, and burnout.</p><h2>Signs your sleep is affecting your mental health</h2><ul><li>Mood swings or irritability that feel out of proportion</li><li>Difficulty concentrating or making decisions</li><li>Increased anxiety or a sense of dread in the mornings</li><li>Relying on caffeine to function normally</li></ul><h2>What helps</h2><p>Consistent sleep and wake times, limiting screens before bed, keeping your bedroom cool and dark, and avoiding caffeine after 2pm are all evidence-based strategies. But if sleep problems persist despite these efforts, they may be a symptom of an underlying condition worth exploring with a professional.</p><p>Serenest specialists can help address sleep disorders alongside other mental health concerns. <a href="/book.html">Book a consultation today.</a></p>`,
        'Wellbeing',
        'Dr. Chirag Aambalia'
      ],
    ];
    posts.forEach(p => ins.run(...p));
  }

  // ── Seed pricing plans if empty ──
  const pricingCount = db.prepare('SELECT COUNT(*) as n FROM pricing_plans').get();
  if (pricingCount && pricingCount.n === 0) {
    const ins = db.prepare(`INSERT INTO pricing_plans (label, title, amount, note, features, is_featured, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)`);
    ins.run('Single session', 'First Consultation', '₹1,500', 'One-time · 45–60 min', 'Video or audio session|Assessment and treatment plan|Prescription if needed|Follow-up summary by email', 0, 0);
    ins.run('Most popular', 'Follow-up Session', '₹1,200', 'Per session · 30–45 min', 'Video or audio|Ongoing care with same doctor|Medication review|Best value for regular care', 1, 1);
    ins.run('Package', '4-Session Pack', '₹4,200', '₹1,050 per session · Save ₹300', '4 follow-up sessions|Use within 3 months|Same specialist preferred|Ideal for therapy or maintenance', 0, 2);
  }

  // ── Seed FAQ items if empty ──
  const faqCount = db.prepare('SELECT COUNT(*) as n FROM faq_items').get();
  if (faqCount && faqCount.n === 0) {
    const ins = db.prepare(`INSERT INTO faq_items (question, answer, display_order) VALUES (?, ?, ?)`);
    const faqs = [
      ['How do I book a consultation?', 'Go to the Book a Consultation page, choose your specialist type and session type (video/audio), pick a date and time slot, and fill in your details. We will confirm your appointment by email.', 0],
      ['Is my information kept private?', 'Yes. All sessions and personal data are confidential. We follow Indian data protection norms and our clinicians adhere to medical confidentiality. We do not share your information with third parties for marketing.', 1],
      ['What happens in my first session?', 'The first session is usually an assessment: the psychiatrist or therapist will ask about your concerns, history, and goals. There is no pressure — it is a chance to see if the approach and the specialist feel right for you.', 2],
      ['Can I cancel or reschedule?', 'Yes. Please cancel or reschedule at least 24 hours before your appointment. You can do this by replying to your confirmation email or by contacting us. Late cancellations may be subject to our cancellation policy.', 3],
      ['How do I pay for sessions?', 'Payment is collected at or before the time of booking. We accept major cards, UPI, and other methods. You will receive a receipt by email.', 4],
      ['Do you prescribe medication?', 'Our psychiatrists can prescribe medication when clinically appropriate, in line with Indian telemedicine guidelines. Prescriptions are shared electronically. Therapists do not prescribe; they provide therapy.', 5],
      ['Is Serenest only for people in India?', 'Our specialists are licensed to practise in India and our services are designed for patients based in India. If you are travelling or living abroad, please contact us to check if we can support you.', 6],
    ];
    faqs.forEach(([q, a, o]) => ins.run(q, a, o));
  }

  // ── Seed services if empty ──
  const servicesCount = db.prepare('SELECT COUNT(*) as n FROM services').get();
  if (servicesCount && servicesCount.n === 0) {
    const ins = db.prepare(`INSERT INTO services (icon, title, description, features, display_order) VALUES (?, ?, ?, ?, ?)`);
    ins.run('🧬', 'Psychiatry Consultation', 'Evidence-based psychiatric assessment, diagnosis, and medication management from board-certified psychiatrists via secure video call.', 'Diagnostic assessment & formulation|Medication management & prescriptions|Mood disorders, anxiety, OCD, ADHD|Follow-up care & monitoring', 0);
    ins.run('💬', 'Therapy & Counselling', 'Individual therapy sessions with licensed clinical psychologists and counsellors. Evidence-based modalities including CBT, DBT, EMDR, and more.', 'Cognitive Behavioural Therapy (CBT)|Trauma-focused therapy (EMDR)|Relationship & family counselling|Life transitions & grief', 1);
    ins.run('🌿', 'De-addiction Support', 'Specialist support for alcohol, substance use, and behavioural addictions. Combining psychiatric care with counselling for lasting recovery.', 'Alcohol & substance use disorders|Behavioural addiction support|Motivational interviewing|Relapse prevention planning', 2);
  }

  // ── Seed testimonials if empty ──
  const testimonialsCount = db.prepare('SELECT COUNT(*) as n FROM testimonials').get();
  if (testimonialsCount && testimonialsCount.n === 0) {
    const ins = db.prepare(`INSERT INTO testimonials (quote, author_name, author_meta, rating, avatar_initials, display_order) VALUES (?, ?, ?, ?, ?, ?)`);
    const items = [
      ['I was sceptical about online therapy but Serenest changed my mind completely. Dr. Sharma was warm, thorough, and really listened. I felt better after just the first session.', 'Meera R.', 'Patient · Mumbai', 5, 'MR', 0],
      ['As someone with bad social anxiety, even calling a clinic felt impossible. With Serenest I could book online and join from my bedroom. It made all the difference.', 'Rohan K.', 'Patient · Bengaluru', 5, 'RK', 1],
      ['My therapist Ms. Nair helped me understand patterns I had been stuck in for years. The CBT tools she gave me actually work. Grateful every day.', 'Priya A.', 'Patient · Delhi', 5, 'PA', 2],
      ['I was struggling with burnout but did not know what to call it. The assessment was very thorough and I finally felt heard. Highly recommend.', 'Ankit S.', 'Patient · Pune', 5, 'AS', 3],
      ['Getting help for my son was difficult — he refused to see anyone in person. The online format worked perfectly for him and the psychiatrist was excellent.', 'Sunita V.', 'Parent · Ahmedabad', 5, 'SV', 4],
      ['Quality of care is outstanding. Very professional, private, and easy to use. I have recommended Serenest to three friends already.', 'Dr. Vishal M.', 'Patient · Hyderabad', 5, 'VM', 5],
    ];
    items.forEach(r => ins.run(...r));
  }

  // ── Seed site settings if empty ──
  const settingsCount = db.prepare('SELECT COUNT(*) as n FROM site_settings').get();
  if (settingsCount && settingsCount.n === 0) {
    const ins = db.prepare(`INSERT OR IGNORE INTO site_settings (key, value) VALUES (?, ?)`);
    ins.run('site_name', 'Serenest');
    ins.run('tagline', 'Premium Mental Health Care');
    ins.run('hero_headline', "India's most trusted telepsychiatry platform");
    ins.run('hero_subtext', 'Confidential video consultations with verified psychiatrists and therapists. Book in under 2 minutes.');
    ins.run('contact_email', 'hello@serenest.in');
    ins.run('contact_phone', '+91 98765 43210');
    ins.run('whatsapp_number', '919876543210');
    ins.run('instagram_url', 'https://instagram.com/serenest_in');
    ins.run('linkedin_url', 'https://linkedin.com/company/serenest');
    ins.run('pricing_note', 'All prices in INR, inclusive of GST where applicable. If you have financial constraints, mention it when you book — we may offer subsidised slots.');
    ins.run('booking_note', 'Sessions confirmed within 2 hours. Cancel or reschedule 24 hours before your appointment.');
    ins.run('footer_copyright', '© 2026 Serenest. All rights reserved.');
    ins.run('announcement_bar', '');
    ins.run('announcement_bar_active', '0');
  }

  console.log('Database initialized at', dbPath);
}

module.exports = { db, initDb };