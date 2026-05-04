ALTER TABLE login_logs
    DROP CONSTRAINT IF EXISTS login_logs_user_id_fkey,
    ADD CONSTRAINT login_logs_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL;

ALTER TABLE audit_logs
    DROP CONSTRAINT IF EXISTS audit_logs_user_id_fkey,
    ADD CONSTRAINT audit_logs_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL;
