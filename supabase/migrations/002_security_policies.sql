-- 检查并授予必要的权限给 anon 和 authenticated 角色

-- 为 user_profiles 表授予权限
GRANT SELECT ON user_profiles TO anon;
GRANT ALL PRIVILEGES ON user_profiles TO authenticated;

-- 为 favorites 表授予权限
GRANT SELECT ON favorites TO anon;
GRANT ALL PRIVILEGES ON favorites TO authenticated;

-- 为 print_history 表授予权限
GRANT SELECT ON print_history TO anon;
GRANT ALL PRIVILEGES ON print_history TO authenticated;

-- 为 user_settings 表授予权限
GRANT SELECT ON user_settings TO anon;
GRANT ALL PRIVILEGES ON user_settings TO authenticated;

-- 更新 RLS 策略以增强安全性

-- 用户配置表的安全策略
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 收藏表的安全策略
DROP POLICY IF EXISTS "Users can manage own favorites" ON favorites;

CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- 打印历史表的安全策略
DROP POLICY IF EXISTS "Users can manage own print history" ON print_history;

CREATE POLICY "Users can view own print history" ON print_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own print history" ON print_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own print history" ON print_history
  FOR DELETE USING (auth.uid() = user_id);

-- 用户设置表的安全策略
DROP POLICY IF EXISTS "Users can manage own settings" ON user_settings;

CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 创建安全函数来验证用户权限
CREATE OR REPLACE FUNCTION check_user_permission(target_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- 检查当前用户是否有权限访问目标用户的数据
  RETURN auth.uid() = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建数据清理函数（用于用户删除账户时）
CREATE OR REPLACE FUNCTION cleanup_user_data(target_user_id UUID)
RETURNS VOID AS $$
BEGIN
  -- 只允许用户删除自己的数据
  IF auth.uid() != target_user_id THEN
    RAISE EXCEPTION 'Unauthorized: Cannot delete other users data';
  END IF;
  
  -- 删除用户相关数据
  DELETE FROM favorites WHERE user_id = target_user_id;
  DELETE FROM print_history WHERE user_id = target_user_id;
  DELETE FROM user_settings WHERE user_id = target_user_id;
  DELETE FROM user_profiles WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建数据导出函数（用于GDPR合规）
CREATE OR REPLACE FUNCTION export_user_data(target_user_id UUID)
RETURNS JSON AS $$
DECLARE
  user_data JSON;
BEGIN
  -- 只允许用户导出自己的数据
  IF auth.uid() != target_user_id THEN
    RAISE EXCEPTION 'Unauthorized: Cannot export other users data';
  END IF;
  
  -- 收集用户数据
  SELECT json_build_object(
    'profile', (
      SELECT row_to_json(up.*) 
      FROM user_profiles up 
      WHERE up.id = target_user_id
    ),
    'favorites', (
      SELECT json_agg(row_to_json(f.*)) 
      FROM favorites f 
      WHERE f.user_id = target_user_id
    ),
    'print_history', (
      SELECT json_agg(row_to_json(ph.*)) 
      FROM print_history ph 
      WHERE ph.user_id = target_user_id
    ),
    'settings', (
      SELECT row_to_json(us.*) 
      FROM user_settings us 
      WHERE us.user_id = target_user_id
    )
  ) INTO user_data;
  
  RETURN user_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建审计日志表（可选，用于记录重要操作）
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id TEXT,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用审计日志表的 RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 审计日志的安全策略（只有管理员可以查看）
CREATE POLICY "Only admins can view audit logs" ON audit_logs
  FOR SELECT USING (false); -- 暂时禁用，需要管理员角色时再开启

-- 为审计日志表授予权限
GRANT SELECT ON audit_logs TO authenticated;

-- 创建触发器函数来记录重要操作
CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS TRIGGER AS $$
BEGIN
  -- 记录数据变更
  INSERT INTO audit_logs (user_id, action, table_name, record_id, old_values, new_values)
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id::TEXT, OLD.id::TEXT),
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 为重要表添加审计触发器
CREATE TRIGGER audit_user_profiles
  AFTER INSERT OR UPDATE OR DELETE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_favorites
  AFTER INSERT OR DELETE ON favorites
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- 创建数据保留策略函数
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS VOID AS $$
BEGIN
  -- 清理超过1年的审计日志
  DELETE FROM audit_logs 
  WHERE created_at < NOW() - INTERVAL '1 year';
  
  -- 清理超过2年的打印历史（可选）
  -- DELETE FROM print_history 
  -- WHERE created_at < NOW() - INTERVAL '2 years';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 注释：可以设置定时任务来定期执行数据清理
-- SELECT cron.schedule('cleanup-old-data', '0 2 * * 0', 'SELECT cleanup_old_data();');

COMMIT;