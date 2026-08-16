-- 1. Enable RLS on the resumes table
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies if they exist (to allow safe re-running)
DROP POLICY IF EXISTS "Allow authenticated users to read resumes" ON resumes;
DROP POLICY IF EXISTS "Allow authenticated users to insert resumes" ON resumes;
DROP POLICY IF EXISTS "Allow authenticated users to update resumes" ON resumes;
DROP POLICY IF EXISTS "Allow authenticated users to delete resumes" ON resumes;

-- 3. Create policies that ONLY allow authenticated users to access the table
CREATE POLICY "Allow authenticated users to read resumes"
ON resumes FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert resumes"
ON resumes FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update resumes"
ON resumes FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete resumes"
ON resumes FOR DELETE
TO authenticated
USING (true);
