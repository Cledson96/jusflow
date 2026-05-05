INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('case-documents', 'case-documents', false, 52428800, NULL)
ON CONFLICT (id) DO UPDATE
SET public = false,
    file_size_limit = 52428800,
    allowed_mime_types = NULL;
