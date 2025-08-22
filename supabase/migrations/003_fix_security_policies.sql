-- 修正安全策略和权限配置

-- 删除所有现有的 RLS 策略
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can manage own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can view own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can insert own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can manage own print history" ON print_history;
DROP POLICY IF EXISTS "Users can view own print history" ON print_history;
DROP POLICY IF EXISTS "Users can insert own print history" ON print_history;
DROP POLICY IF EXISTS "Users can delete own print history" ON print_history;
DROP POLICY IF EXISTS "Users can manage own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can view own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON user_settings;

-- 为所有表授予必要的权限
GRANT SELECT ON user_profiles TO anon;
GRANT ALL PRIVILEGES ON user_profiles TO authenticated;

GRANT SELECT ON favorites TO anon;
GRANT ALL PRIVILEGES ON favorites TO authenticated;

GRANT SELECT ON print_history TO anon;
GRANT ALL PRIVILEGES ON print_history TO authenticated;

GRANT SELECT ON user_settings TO anon;
GRANT ALL PRIVILEGES ON user_settings TO authenticated;

-- 重新创建用户配置表的安全策略
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 重新创建收藏表的安全策略
CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- 重新创建打印历史表的安全策略
CREATE POLICY "Users can view own print history" ON print_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own print history" ON print_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own print history" ON print_history
  FOR DELETE USING (auth.uid() = user_id);

-- 重新创建用户设置表的安全策略
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

COMMIT;