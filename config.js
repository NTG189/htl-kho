/* Cấu hình kết nối CSDL Supabase.
   - Để trống 2 dòng dưới → ứng dụng chạy "Chế độ thử trên máy" (dữ liệu chỉ lưu trong trình duyệt đang dùng).
   - Điền URL + khoá công khai (publishable / anon) của dự án Supabase (Project Settings → API Keys) → dữ liệu lưu trên máy chủ, có đăng nhập.
   Khoá publishable là khoá công khai (được phép nằm trong trang web); quyền truy cập do chính sách RLS trong schema.sql quyết định.
   KHÔNG BAO GIỜ dán khoá secret (sb_secret_...) vào đây. */
window.HTL_CONFIG = {
  SUPABASE_URL: 'https://ouuygvpwqruvdsskkinm.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_RLRPpL-D7YsMyp_vlujTdg_evD8jH6K',
};
