-- Create a table for storing heart disease risk assessments
create table public.assessments (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) not null,
  
  -- Clinical Parameters
  age integer not null,
  sex integer not null,         -- 1 = Male, 0 = Female
  cp integer not null,          -- Chest Pain Type (0-3)
  trestbps integer not null,    -- Resting Blood Pressure
  chol integer not null,        -- Serum Cholesterol
  fbs integer not null,         -- Fasting Blood Sugar > 120 (1 = True, 0 = False)
  restecg integer not null,     -- Resting ECG Results (0-2)
  thalach integer not null,     -- Max Heart Rate
  exang integer not null,       -- Exercise Induced Angina (1 = Yes, 0 = No)
  oldpeak float not null,       -- ST Depression
  slope integer not null,       -- Slope of Peak Exercise ST Segment (0-2)
  ca integer not null,          -- Number of Major Vessels (0-3)
  thal integer not null,        -- Thalassemia (1 = Normal, 2 = Fixed, 3 = Reversable)

  -- Prediction Results
  prediction integer not null,  -- 1 = Positive (High Risk), 0 = Negative (Low Risk)
  probability float,            -- Confidence score (0.0 to 1.0)
  
  -- Metadata
  status text default 'completed' check (status in ('completed', 'reviewed'))
);

-- Enable Row Level Security (RLS)
alter table public.assessments enable row level security;

-- Policy: Users can only view their own assessments
create policy "Users can view their own assessments"
  on public.assessments for select
  using (auth.uid() = user_id);

-- Policy: Users can only insert their own assessments
create policy "Users can insert their own assessments"
  on public.assessments for insert
  with check (auth.uid() = user_id);

-- Create an index on user_id for faster queries
create index assessments_user_id_idx on public.assessments(user_id);
