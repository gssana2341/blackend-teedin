-- แก้ไขปัญหา RLS Policy ที่ขัดขวางการเปลี่ยน role column type

-- 1. ดู policy ทั้งหมดที่เกี่ยวข้องกับ role column
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE qual LIKE '%role%' OR with_check LIKE '%role%';

-- 2. ลบ policy ที่เกี่ยวข้องชั่วคราว (เราจะสร้างใหม่ทีหลัง)
DROP POLICY IF EXISTS "Users can view their own agent documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload agent documents" ON storage.objects;
DROP POLICY IF EXISTS "Agents can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can manage their own documents" ON storage.objects;

-- ลองดู policy อื่นๆ ที่อาจเกี่ยวข้อง
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE qual LIKE '%users.role%' OR with_check LIKE '%users.role%';

-- 3. หลังจากลบ policy แล้ว ให้แก้ไข role column
-- ลบ constraint เก่า
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- ขยายขนาด column
ALTER TABLE users ALTER COLUMN role TYPE VARCHAR(20);

-- เพิ่ม constraint ใหม่
ALTER TABLE users ADD CONSTRAINT users_role_check 
CHECK (role IN ('customer', 'agent', 'admin', 'super_admin'));

-- 4. สร้าง policy ใหม่ (ถ้าจำเป็น)
-- สร้าง policy ใหม่สำหรับ storage.objects
CREATE POLICY "Users can view their own agent documents" ON storage.objects
FOR SELECT USING (
    bucket_id = 'agent-documents' AND 
    auth.uid()::text = (storage.foldername(name))[1] AND
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE users.id = auth.uid() 
        AND users.role IN ('agent', 'admin', 'super_admin')
    )
);

CREATE POLICY "Users can upload agent documents" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'agent-documents' AND 
    auth.uid()::text = (storage.foldername(name))[1] AND
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE users.id = auth.uid() 
        AND users.role IN ('agent', 'admin', 'super_admin')
    )
);

-- 5. ตรวจสอบว่าการเปลี่ยนแปลงสำเร็จ
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'role';

-- 6. ทดสอบ constraint ใหม่
SELECT conname, consrc 
FROM pg_constraint 
WHERE conname = 'users_role_check';
