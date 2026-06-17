-- Payment fields for appointments (Razorpay). A booking is only created
-- after a successful, server-verified payment when payments are enabled.

alter table public.appointments
  add column if not exists payment_status   text default 'unpaid',
  add column if not exists payment_id        text,
  add column if not exists payment_order_id  text,
  add column if not exists amount_paid       integer;
