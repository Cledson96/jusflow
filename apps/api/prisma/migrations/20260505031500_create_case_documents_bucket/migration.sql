DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'storage'
      AND table_name = 'buckets'
  ) THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES ('case-documents', 'case-documents', false, 52428800, NULL)
    ON CONFLICT (id) DO UPDATE
    SET public = false,
        file_size_limit = 52428800,
        allowed_mime_types = NULL;
  END IF;
END $$;
