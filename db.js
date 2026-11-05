/* =====================================================================
   STORE – lớp lưu dữ liệu của ứng dụng kho HTL
   - Có SUPABASE_URL + SUPABASE_ANON_KEY trong config.js → lưu lên CSDL Supabase (đăng nhập email / mật khẩu).
   - Chưa cấu hình → "Chế độ thử trên máy": lưu trong trình duyệt (localStorage) của máy đang dùng.
   Nạp toàn bộ dữ liệu trước, rồi mới chạy app.js (app.js đọc dữ liệu đồng bộ qua STORE.tx(), STORE.get()...).
   Ghi dữ liệu: ghi ngay vào bộ nhớ; ghi lên máy chủ lỗi (mất mạng) → giữ trong hàng chờ và tự gửi lại.
   ===================================================================== */
(function(){
  const CFG = window.HTL_CONFIG || {};
  const ONLINE = !!(CFG.SUPABASE_URL && CFG.SUPABASE_ANON_KEY);
  const LKEY = 'htlLocalDB', QKEY = 'htlOutbox';
  const D = {kv:{}, tx:[], bb:[], ds:[]};
  let sb = null, user = null;

  /* ---- Chuyển đổi dòng giao dịch <-> bảng giao_dich ---- */
  const TXF = ['so','ngay','loai','chu','ma','sl','slp','hong','dvt','lo','lydo','diem','tuyen','booking','xe','nguoi','dt','gc','anh','bb','ct','vitri'];
  const txRow = (t, i) => { const r = {dong:i+1, nguoi_lap:t.user||null, thu_kho:t.thukho||null};
    TXF.forEach(k=>{ r[k] = (t[k]===undefined || t[k]==='') ? null : t[k]; }); return r; };
  const txObj = r => { const t = {user:r.nguoi_lap||'', thukho:r.thu_kho||''};
    TXF.forEach(k=>{ if(r[k]!==null && r[k]!==undefined) t[k] = r[k]; });
    ['sl','slp','hong'].forEach(k=>{ if(t[k]!==undefined) t[k] = Number(t[k]); });
    if(t.hong===undefined) t.hong = 0; if(t.gc===undefined) t.gc = '';
    return t; };
  const bbRow = b => ({so:b.so, px:b.px, chu:b.chu, ngay:b.ngay, xe:b.xe||null, taixe:b.taixe||null, file:b.file||null,
                       file_path:b.file_path||null, gc:b.gc||null, st:b.st, dong:b.dong||[]});
  const bbObj = r => ({so:r.so, px:r.px, chu:r.chu, ngay:r.ngay, xe:r.xe||'', taixe:r.taixe||'', file:r.file||'',
                       file_path:r.file_path||'', gc:r.gc||'', st:r.st, dong:(r.dong||[]).map(d=>({...d, sl:Number(d.sl), slp:Number(d.slp)}))});

  /* ---- Chế độ thử trên máy ---- */
  function loadLocal(){
    try{ Object.assign(D, JSON.parse(localStorage.getItem(LKEY)||'{}')); }catch(e){}
    // lần đầu: lấy danh mục / lái xe / thông tin công ty đã lưu ở bản mockup (nếu cùng trình duyệt)
    ['htlDuLieuDauVao','htlDanhMucMoi','htlPalletCty'].forEach(k=>{ if(D.kv[k]===undefined){ try{ const v = localStorage.getItem(k); if(v) D.kv[k] = JSON.parse(v); }catch(e){} } });
    if(D.kv.htlPalletLogo===undefined && localStorage.getItem('htlPalletLogo')) D.kv.htlPalletLogo = localStorage.getItem('htlPalletLogo');
  }
  function saveLocal(){
    try{ localStorage.setItem(LKEY, JSON.stringify(D)); }
    catch(e){ msg('⚠ Bộ nhớ trình duyệt đầy – không lưu được. Hãy chuyển sang lưu trên máy chủ (Supabase).'); }
  }

  /* ---- Hàng chờ gửi lên máy chủ ---- */
  let Q = []; try{ Q = JSON.parse(localStorage.getItem(QKEY)||'[]'); }catch(e){}
  const saveQ = () => { try{ localStorage.setItem(QKEY, JSON.stringify(Q)); }catch(e){} updFoot(); };
  async function runOp(o){
    let r;
    if(o.t==='tx')  r = await sb.from('giao_dich').upsert(o.rows, {onConflict:'so,dong'});
    if(o.t==='bb')  r = await sb.from('bien_ban').upsert(o.row, {onConflict:'so'});
    if(o.t==='ds')  r = await sb.from('doi_soat').upsert({so:o.so, nguoi:user?.email||null}, {onConflict:'so'});
    if(o.t==='kv')  r = await sb.from('cai_dat').upsert({khoa:o.k, gia_tri:o.v, cap_nhat:new Date().toISOString()}, {onConflict:'khoa'});
    if(o.t==='kvd') r = await sb.from('cai_dat').delete().eq('khoa', o.k);
    if(r && r.error) throw r.error;
  }
  let flushing = false;
  async function flush(){
    if(!ONLINE || flushing || !Q.length) return;
    flushing = true;
    try{ while(Q.length){ await runOp(Q[0]); Q.shift(); saveQ(); } }
    catch(e){ console.warn('Gửi dữ liệu lỗi, sẽ thử lại', e); }
    finally{ flushing = false; updFoot(); }
  }
  function push(op){
    if(!ONLINE){ saveLocal(); return Promise.resolve(); }
    Q.push(op); saveQ();
    return flush().then(()=>{ if(Q.length) msg(`⚠ Chưa gửi được ${Q.length} thay đổi lên máy chủ – sẽ tự gửi lại khi có mạng`, 4000); });
  }
  setInterval(flush, 30000); window.addEventListener('online', flush);

  /* ---- Nạp dữ liệu từ máy chủ ---- */
  async function all(table, order){
    const out = []; const N = 1000;
    for(let from=0;;from+=N){
      const {data, error} = await sb.from(table).select('*').order(order[0]).order(order[1]||order[0]).range(from, from+N-1);
      if(error) throw error; out.push(...data); if(data.length < N) break;
    }
    return out;
  }
  async function loadRemote(){
    await flush();
    const [kv, tx, bb, ds] = await Promise.all([all('cai_dat',['khoa']), all('giao_dich',['so','dong']), all('bien_ban',['so']), all('doi_soat',['so'])]);
    kv.forEach(r=>{ D.kv[r.khoa] = r.gia_tri; });
    D.tx = tx.map(txObj); D.bb = bb.map(bbObj); D.ds = ds.map(r=>r.so);
  }

  /* ---- Đăng nhập ---- */
  function loginForm(err){
    return new Promise(ok=>{
      let box = document.getElementById('loginBox');
      if(!box){ box = document.createElement('div'); box.id = 'loginBox'; document.body.appendChild(box); }
      box.innerHTML = `<style>#loginBox{position:fixed;inset:0;background:#f4f5f7;display:flex;align-items:center;justify-content:center;z-index:9999;font-family:'Segoe UI',sans-serif}
        #loginBox form{background:#fff;padding:28px;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,.08);width:min(360px,92vw);border-top:5px solid #e11b22}
        #loginBox h2{margin:0 0 4px;font-size:20px;color:#231f20}#loginBox p{margin:0 0 18px;color:#666;font-size:13px}
        #loginBox input{width:100%;box-sizing:border-box;height:44px;font-size:16px;margin:6px 0 12px;padding:0 12px;border:1px solid #ccc;border-radius:8px}
        #loginBox button{width:100%;height:46px;background:#e11b22;color:#fff;border:0;border-radius:8px;font-size:16px;font-weight:600}
        #loginBox .err{color:#b91c1c;font-size:13px;margin:-4px 0 10px}</style>
        <form><h2>Kho HTL – Đăng nhập</h2><p>Quản lý hàng xuất nhập kho · Thọ Phát</p>
        <label>Email<input type="email" name="e" autocomplete="username" required></label>
        <label>Mật khẩu<input type="password" name="p" autocomplete="current-password" required></label>
        ${err?`<div class="err">${err}</div>`:''}<button>Đăng nhập</button></form>`;
      box.querySelector('form').onsubmit = async ev => {
        ev.preventDefault(); const f = ev.target; f.querySelector('button').textContent = 'Đang đăng nhập…';
        const {data, error} = await sb.auth.signInWithPassword({email:f.e.value.trim(), password:f.p.value});
        if(error) return ok(loginForm('Sai email hoặc mật khẩu.'));
        box.remove(); ok(data.user);
      };
    });
  }
  function loadingBox(t){
    let b = document.getElementById('loadBox');
    if(t===false){ b && b.remove(); return; }
    if(!b){ b = document.createElement('div'); b.id = 'loadBox';
      b.style.cssText = 'position:fixed;inset:0;background:#f4f5f7;display:flex;align-items:center;justify-content:center;z-index:9998;font:16px Segoe UI,sans-serif;color:#444;padding:20px;text-align:center';
      document.body.appendChild(b); }
    b.innerHTML = t;
  }
  function loadLib(){
    return new Promise((ok, err)=>{ const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'; s.onload = ok; s.onerror = () => err(new Error('Không tải được thư viện Supabase – kiểm tra mạng.'));
      document.head.appendChild(s); });
  }

  /* ---- Thông báo + chân menu ---- */
  function msg(m, ms){ if(typeof toast==='function') toast(m, ms); else console.warn(m); }
  function updFoot(){
    const f = document.querySelector('.side-foot'); if(!f) return;
    f.innerHTML = ONLINE
      ? `Phiên bản 1.0 · ${user?.email||''}${Q.length?` · <b style="color:#b45309">${Q.length} chờ gửi</b>`:''}<br><a href="#" id="logoutLnk" style="color:inherit">Đăng xuất</a>`
      : 'Phiên bản 1.0 · <b style="color:#b45309">Chế độ thử trên máy</b><br><span style="font-size:11px">Dữ liệu chỉ lưu trong trình duyệt này</span>';
    const l = document.getElementById('logoutLnk');
    if(l) l.onclick = async e => { e.preventDefault(); if(Q.length && !confirm(`Còn ${Q.length} thay đổi chưa gửi lên máy chủ. Vẫn đăng xuất?`)) return;
      await sb.auth.signOut(); location.reload(); };
  }

  /* ---- Nén ảnh biên bản về ~200 KB mà vẫn đọc rõ chữ ----
     - Giữ cạnh dài tối đa 2000 px (đủ đọc chữ viết tay trên khổ A4), không nhỏ hơn 1400 px trừ khi bắt buộc.
     - Tìm chất lượng JPEG cao nhất mà file ≤ 200 KB (tìm nhị phân 0.55–0.92); chưa đủ nhỏ thì thu nhỏ dần 10%.
     - Làm nét nhẹ (unsharp) sau khi thu nhỏ để nét chữ không bị nhòe.
     - File PDF, ảnh đã ≤ 200 KB, hoặc ảnh trình duyệt không đọc được (HEIC trên Chrome) → giữ nguyên. */
  const NEN = {max:200*1024, canh:2000, canhMin:1400, qMin:0.55, qMax:0.92};
  async function docAnh(file){
    if(window.createImageBitmap){ try{ return await createImageBitmap(file, {imageOrientation:'from-image'}); }catch(e){} }
    return new Promise((ok, err)=>{ const u = URL.createObjectURL(file), i = new Image();
      i.onload = () => { URL.revokeObjectURL(u); ok(i); }; i.onerror = () => { URL.revokeObjectURL(u); err(new Error('Không đọc được ảnh')); }; i.src = u; });
  }
  function lamNet(ctx, w, h, k){            // unsharp mask 3x3 nhẹ
    const src = ctx.getImageData(0, 0, w, h), a = src.data, out = ctx.createImageData(w, h), b = out.data, W = w*4;
    for(let y=0;y<h;y++) for(let x=0;x<w;x++){
      const i = y*W + x*4;
      for(let c=0;c<3;c++){
        if(x===0||y===0||x===w-1||y===h-1){ b[i+c] = a[i+c]; continue; }
        const v = a[i+c]*(1+4*k) - k*(a[i-4+c] + a[i+4+c] + a[i-W+c] + a[i+W+c]);
        b[i+c] = v<0?0:v>255?255:v;
      }
      b[i+3] = 255;
    }
    ctx.putImageData(out, 0, 0);
  }
  const toBlob = (cv, q) => new Promise(ok => cv.toBlob(ok, 'image/jpeg', q));
  async function nenAnh(file){
    if(!file || !/^image\//.test(file.type) || file.size <= NEN.max) return file;
    let img; try{ img = await docAnh(file); }catch(e){ return file; }
    const W0 = img.width, H0 = img.height;
    let scale = Math.min(1, NEN.canh / Math.max(W0, H0)), best = null;
    for(let lan=0; lan<8; lan++){
      const w = Math.round(W0*scale), h = Math.round(H0*scale);
      const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
      const ctx = cv.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0,0,w,h);
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high'; ctx.drawImage(img, 0, 0, w, h);
      if(scale < 1) lamNet(ctx, w, h, 0.25);
      let lo = NEN.qMin, hi = NEN.qMax, ok = null;
      const top = await toBlob(cv, hi); if(top.size <= NEN.max) ok = top;
      else for(let i=0;i<6;i++){ const q = (lo+hi)/2, b = await toBlob(cv, q); if(b.size <= NEN.max){ ok = b; lo = q; } else hi = q; }
      if(ok){ best = ok; break; }
      best = await toBlob(cv, NEN.qMin);
      // giữ tối thiểu 1400 px cạnh dài trước, rồi mới thu nhỏ thêm nếu vẫn quá nặng
      const next = scale*0.9, canhSau = Math.max(W0, H0)*next;
      scale = (canhSau < NEN.canhMin && Math.max(w,h) > NEN.canhMin) ? NEN.canhMin/Math.max(W0,H0) : next;
    }
    if(img.close) img.close();
    if(!best || best.size >= file.size) return file;
    return new File([best], file.name.replace(/\.[^.]+$/, '') + '.jpg', {type:'image/jpeg', lastModified:Date.now()});
  }

  /* ---- API cho app.js ---- */
  window.STORE = {
    online: ONLINE,
    get: k => D.kv[k],
    set: (k, v) => { D.kv[k] = v; return push({t:'kv', k, v}); },
    del: k => { delete D.kv[k]; return push({t:'kvd', k}); },
    tx: () => D.tx, bb: () => D.bb, ds: () => D.ds,
    // lines: các dòng của 1 phiếu (cùng số phiếu) – app.js đã push vào mảng tx (= D.tx)
    addTx: lines => push({t:'tx', rows: lines.map(txRow)}),
    addBB: async (bb, file) => {
      if(ONLINE && file){
        const goc = file.size; file = await nenAnh(file);
        if(file.size < goc) msg(`Đã nén ảnh biên bản: ${Math.round(goc/1024)} KB → ${Math.round(file.size/1024)} KB`, 3000);
        const p =`${bb.so}/${Date.now()}_${file.name.replace(/[^\w.\-]+/g,'_')}`;
        const {error} = await sb.storage.from('bien-ban').upload(p, file);
        if(error) msg('⚠ Chưa tải được file biên bản lên máy chủ: '+error.message, 4000); else bb.file_path = p;
      }
      return push({t:'bb', row: bbRow(bb)});
    },
    nenAnh,
    addDS: so => { if(!D.ds.includes(so)) D.ds.push(so); return push({t:'ds', so}); },
    // link xem file biên bản đã tải lên (hết hạn sau 1 giờ)
    fileUrl: async p => { if(!ONLINE || !p) return ''; const {data} = await sb.storage.from('bien-ban').createSignedUrl(p, 3600); return data?.signedUrl||''; },
  };

  /* ---- Khởi động ---- */
  async function start(){
    try{
      if(ONLINE){
        loadingBox('Đang kết nối máy chủ…');
        await loadLib();
        sb = supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY);
        user = (await sb.auth.getSession()).data.session?.user || null;
        if(!user){ loadingBox(false); user = await loginForm(); loadingBox('Đang tải dữ liệu…'); }
        else loadingBox('Đang tải dữ liệu…');
        await loadRemote();
      } else loadLocal();
      const s = document.createElement('script'); s.src = 'app.js';
      s.onload = () => { loadingBox(false); updFoot(); };
      document.body.appendChild(s);
    }catch(e){
      console.error(e);
      loadingBox(`<div>⚠ Không tải được dữ liệu.<br><small>${String(e.message||e)}</small><br><br><button onclick="location.reload()" style="height:42px;padding:0 18px">Thử lại</button></div>`);
    }
  }
  if('serviceWorker' in navigator && (location.protocol==='https:' || location.hostname==='localhost')) navigator.serviceWorker.register('sw.js');
  start();
})();
