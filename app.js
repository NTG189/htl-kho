/* Ứng dụng kho HTL – tách từ mockup-pallet-tho-phat.html (05/11/2026). Dữ liệu qua STORE (db.js). */
/* ---------- DANH MỤC (MẪU) ---------- */
const OWNERS = [
  {ma:'HTL', ten:'Pallet HTL', mo:'Pallet thuộc sở hữu Công ty HTL, dùng cho vận hành kho & vận tải', mau:'var(--htl)'},
  {ma:'TP',  ten:'Pallet Thọ Phát', mo:'Pallet của Thọ Phát gửi tại kho HTL, HTL quản lý hộ', mau:'var(--tp)'},
];
// Tồn đầu kỳ pallet = 0 (người dùng chốt 05/11/2026: bắt đầu dùng phần mềm từ số 0)
const PALLETS = [
  {ma:'PG12', ten:'Pallet gỗ 1000×1200',  kt:'1000×1200×150', dau:{HTL:0,TP:0}},
  {ma:'PN11', ten:'Pallet nhựa 1100×1100', kt:'1100×1100×150', dau:{HTL:0,TP:0}},
  {ma:'PN12', ten:'Pallet nhựa 1000×1200', kt:'1000×1200×150', dau:{HTL:0,TP:0}},
  {ma:'PS',   ten:'Pallet sắt',            kt:'1000×1200×130', dau:{HTL:0,TP:0}},
];
const TUYEN = [
  {ma:'T01', ten:'T01 – Hà Đông / Thanh Xuân'},
  {ma:'T02', ten:'T02 – Long Biên / Gia Lâm'},
  {ma:'T03', ten:'T03 – Bắc Ninh'},
  {ma:'T04', ten:'T04 – Hải Phòng'},
  {ma:'T05', ten:'T05 – Thái Nguyên'},
];
const DIEM = [
  {ma:'NM-TP', ten:'Nhà máy Thọ Phát', kv:'Hà Nội', tuyen:''},
  {ma:'NPP-HD', ten:'NPP Hà Đông', kv:'Hà Nội', tuyen:'T01'},
  {ma:'NPP-LB', ten:'NPP Long Biên', kv:'Hà Nội', tuyen:'T02'},
  {ma:'NPP-BN', ten:'NPP Bắc Ninh', kv:'Bắc Ninh', tuyen:'T03'},
  {ma:'NPP-HP', ten:'NPP Hải Phòng', kv:'Hải Phòng', tuyen:'T04'},
  {ma:'NPP-TN', ten:'NPP Thái Nguyên', kv:'Thái Nguyên', tuyen:'T05'},
];
const NPP = DIEM.filter(d=>d.tuyen);
/* Loại hàng – pallet cũng là 1 loại hàng; Nhập/Xuất dùng chung 1 luồng. Mỗi loại có mẫu phiếu riêng */
const LOAI = [
  {ma:'HTL',  ten:'Pallet HTL',          nhom:'PALLET', phieu:'PHIẾU NHẬP KHO PALLET HTL',          pre:'PNH', mau:'#e11b22', ky:'Đại diện HTL',
   nguon:DIEM.map(d=>d.ten), lydo:['Thu hồi từ điểm giao','HTL bổ sung','Chuyển kho đến','Sửa chữa xong']},
  {ma:'TP',   ten:'Pallet Thọ Phát',     nhom:'PALLET', phieu:'PHIẾU NHẬP KHO PALLET THỌ PHÁT',     pre:'PNT', mau:'#7e22ce', ky:'Đại diện Thọ Phát',
   nguon:DIEM.map(d=>d.ten), lydo:['Thu hồi từ điểm giao','Thọ Phát cấp mới','Chuyển kho đến','Sửa chữa xong']},
  {ma:'SALE', ten:'Hàng sale',           nhom:'HANG',   phieu:'PHIẾU NHẬP KHO HÀNG SALE',           pre:'PNS', mau:'#ea580c', ky:'Đại diện chủ hàng',
   nguon:['Nhà cung cấp','Kho tổng HTL','Khách hàng trả về'], lydo:['Nhập hàng sale','Hàng trả về','Chuyển kho đến','Nhập điều chỉnh']},
  {ma:'KIDO', ten:'Bánh mỳ KIDO',        nhom:'HANG',   phieu:'PHIẾU NHẬP KHO BÁNH MỲ KIDO',        pre:'PNK', mau:'#ca8a04', ky:'Đại diện KIDO',
   nguon:['Nhà máy KIDO','Kho KIDO miền Bắc','NPP trả về'], lydo:['Nhập hàng từ nhà máy','Hàng trả về','Chuyển kho đến','Nhập điều chỉnh']},
  {ma:'BBTP', ten:'Bánh bao Thọ Phát',   nhom:'HANG',   phieu:'PHIẾU NHẬP KHO BÁNH BAO THỌ PHÁT',   pre:'PNB', mau:'#16a34a', ky:'Đại diện Thọ Phát',
   nguon:['Nhà máy Thọ Phát','NPP trả về'], lydo:['Nhập hàng từ nhà máy','Hàng trả về','Chuyển kho đến','Nhập điều chỉnh']},
  {ma:'HD',   ten:'Dược phẩm Hoàng Đức', nhom:'HANG',   phieu:'PHIẾU NHẬP KHO DƯỢC PHẨM HOÀNG ĐỨC', pre:'PND', mau:'#0891b2', ky:'Đại diện Hoàng Đức',
   nguon:['Công ty Dược phẩm Hoàng Đức','Nhà phân phối trả về'], lydo:['Nhập hàng từ nhà sản xuất','Hàng trả về','Chuyển kho đến','Nhập điều chỉnh']},
];
const LYDO_X  = ['Giao hàng cho điểm giao','Trả về chủ hàng','Chuyển kho đi','Thanh lý / hủy'];
const LYDO_DS = ['Thu hồi từ điểm giao','Hàng trả về'];   // lý do nhập cần đối soát
/* Mặt hàng MẪU – thay bằng danh mục thật */
const HANG = {
  SALE:[{ma:'SL-01',ten:'Thùng hàng sale tổng hợp',dvt:'Thùng'},{ma:'SL-02',ten:'Quà tặng khuyến mãi',dvt:'Kiện'},{ma:'SL-03',ten:'Hàng trưng bày',dvt:'Kiện'}],
  KIDO:[{ma:'KD-01',ten:'Bánh mỳ KIDO ruốc',dvt:'Thùng'},{ma:'KD-02',ten:'Bánh mỳ KIDO bơ sữa',dvt:'Thùng'},{ma:'KD-03',ten:'Bánh mỳ KIDO socola',dvt:'Thùng'}],
  BBTP:[{ma:'BB-01',ten:'Bánh bao nhân thịt',dvt:'Thùng'},{ma:'BB-02',ten:'Bánh bao xá xíu',dvt:'Thùng'},{ma:'BB-03',ten:'Bánh bao chay',dvt:'Thùng'}],
  HD:  [{ma:'HD-01',ten:'Sản phẩm Hoàng Đức A',dvt:'Thùng'},{ma:'HD-02',ten:'Sản phẩm Hoàng Đức B',dvt:'Thùng'},{ma:'HD-03',ten:'Sản phẩm Hoàng Đức C',dvt:'Kiện'}],
};
const DVT = ['Thùng','Kiện','Cái','Pallet','Khối'];   // đơn vị tính chọn được
const XE = ['29C-123.45','29H-567.89','30K-246.80','29C-888.12'];
const TAIXE = ['Nguyễn Văn Hùng','Trần Văn Nam','Lê Văn Tuấn','Phạm Văn Đức'];   // tên lái xe mẫu (dùng sinh dữ liệu)
const USERS = ['Trần Văn Bình','Lê Minh Quân'];                                    // thủ kho mẫu (dùng sinh dữ liệu)
/* Dữ liệu đầu vào (MẪU) – lái xe & nhân viên kho; người dùng sửa / nhập từ Excel ở trang "Lái xe & nhân viên kho" */
const LAIXE0 = [
  {ten:'Nguyễn Văn Hùng', sdt:'0912 345 671', cccd:'001088012345', gplx:'C',  xe:'29C-123.45', dv:'HTL', tt:'Đang làm'},
  {ten:'Trần Văn Nam',    sdt:'0912 345 672', cccd:'001089023456', gplx:'C',  xe:'29H-567.89', dv:'HTL', tt:'Đang làm'},
  {ten:'Lê Văn Tuấn',     sdt:'0912 345 673', cccd:'001090034567', gplx:'FC', xe:'30K-246.80', dv:'HTL', tt:'Đang làm'},
  {ten:'Phạm Văn Đức',    sdt:'0912 345 674', cccd:'001087045678', gplx:'C',  xe:'29C-888.12', dv:'Thuê ngoài', tt:'Đang làm'},
];
const NHANVIEN0 = [
  {ma:'NV01', ten:'Nguyễn Thị Lan', cv:'Trưởng kho',    ca:'Hành chính', sdt:'0983 111 201', tt:'Đang làm'},
  {ma:'NV02', ten:'Trần Văn Bình',  cv:'Thủ kho',       ca:'Ca ngày',    sdt:'0983 111 202', tt:'Đang làm'},
  {ma:'NV03', ten:'Lê Minh Quân',   cv:'Thủ kho',       ca:'Ca đêm',     sdt:'0983 111 203', tt:'Đang làm'},
  {ma:'NV04', ten:'Phạm Thu Hà',    cv:'Kiểm đếm',      ca:'Ca ngày',    sdt:'0983 111 204', tt:'Đang làm'},
  {ma:'NV05', ten:'Hoàng Văn Sơn',  cv:'Lái xe nâng',   ca:'Ca ngày',    sdt:'0983 111 205', tt:'Đang làm'},
];
const CHUCVU = ['Trưởng kho','Thủ kho','Nhân viên kho','Kiểm đếm','Lái xe nâng','Bảo vệ'];
const CA = ['Ca ngày','Ca đêm','Hành chính'];
const GPLX = ['B2','C','CE','FC','D'];
let LAIXE = LAIXE0.map(x=>({...x})), NHANVIEN = NHANVIEN0.map(x=>({...x}));
try{ const d = STORE.get('htlDuLieuDauVao'); if(d){ if(d.laixe) LAIXE = d.laixe; if(d.nhanvien) NHANVIEN = d.nhanvien; } }catch(e){}
function saveDL(){ STORE.set('htlDuLieuDauVao', {laixe:LAIXE, nhanvien:NHANVIEN}); }
function resetDL(){ if(!confirm('Khôi phục danh sách lái xe & nhân viên kho mẫu? Các thay đổi sẽ mất.')) return; STORE.del('htlDuLieuDauVao').then(()=>location.reload()); }
const activeLX = () => LAIXE.filter(x=>x.tt!=='Nghỉ');
const activeNV = () => NHANVIEN.filter(x=>x.tt!=='Nghỉ');

/* ---------- TIỆN ÍCH ---------- */
const LN = ma => LOAI.find(o=>o.ma===ma);
const allHang = () => Object.values(HANG).flat();
const isPalC = c => c==='HTL' || c==='TP';
const today = new Date(); today.setHours(0,0,0,0);
const fmtISO = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const addDays = (d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
const fmtVN = s => s.split('-').reverse().join('/');
const TODAY = fmtISO(today);
const sum = (arr,f)=>arr.reduce((s,x)=>s+f(x),0);
const rnd = (a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const esc = s => String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const pName = ma => PALLETS.find(p=>p.ma===ma)?.ten || allHang().find(h=>h.ma===ma)?.ten || ma;
const cName = c => LN(c)?.ten || c;
const cTag = c => `<span class="tag" style="background:${LN(c).mau}1a;color:${LN(c).mau}">${cName(c)}</span>`;
const tName = ma => TUYEN.find(t=>t.ma===ma)?.ten || '—';
const dvtOf = (c,ma) => isPalC(c) ? 'Cái' : (allHang().find(h=>h.ma===ma)?.dvt || '');
const dvtR = r => r.dvt || dvtOf(r.chu, r.ma);
const dvtSel = v => `<select class="dvt">${DVT.map(x=>`<option${x===v?' selected':''}>${x}</option>`).join('')}</select>`;
const tag = l => l==='NHAP'?'<span class="tag in">Nhập</span>':'<span class="tag out">Xuất</span>';
const byNew = (a,b)=>b.ngay.localeCompare(a.ngay)||b.so.localeCompare(a.so);
const clTxt = (slp,sl) => sl===slp ? 'Khớp' : sl<slp ? `Thiếu ${slp-sl}` : `Thừa ${sl-slp}`;
const clHTML = (slp,sl) => sl===slp ? '<span class="note">Khớp</span>' : `<span class="${sl<slp?'cl-thieu':'cl-thua'}">${clTxt(slp,sl)}</span>`;
const TAG_AM = '<span class="tag" style="background:#fee2e2;color:#b91c1c">Âm tồn – cần kiểm tra</span>';

/* ---------- DANH MỤC THÊM MỚI (lưu trong trình duyệt) ---------- */
const PALETTE = ['#db2777','#4f46e5','#0d9488','#65a30d','#9333ea','#c2410c','#0369a1','#be123c'];
const mkLoai = x => ({ma:x.ma, ten:x.ten, nhom:'HANG', khach:x.khach, moi:true, phieu:'PHIẾU NHẬP KHO '+x.ten.toUpperCase(), pre:x.pre, mau:x.mau,
  ky:'Đại diện '+(x.khach||x.ten), nguon:[x.khach||x.ten,'NPP trả về'], lydo:['Nhập hàng từ khách hàng','Hàng trả về','Chuyển kho đến','Nhập điều chỉnh']});
let EXTRA = {loai:[],hang:{},diem:[],tuyen:[],xe:[],taixe:[],nguon:{}};
try{ Object.assign(EXTRA, STORE.get('htlDanhMucMoi')||{}); }catch(e){}
EXTRA.tuyen.forEach(t=>TUYEN.push(t));
EXTRA.diem.forEach(d=>{DIEM.push(d); NPP.push(d);});
EXTRA.loai.forEach(x=>{LOAI.push(mkLoai(x)); HANG[x.ma]=[];});
Object.entries(EXTRA.hang).forEach(([c,a])=>HANG[c] && HANG[c].push(...a));
Object.entries(EXTRA.nguon).forEach(([c,a])=>LN(c) && LN(c).nguon.push(...a));
XE.push(...EXTRA.xe);
EXTRA.taixe.forEach(t=>{ if(!LAIXE.some(x=>x.ten===t)) LAIXE.push({ten:t, tt:'Đang làm'}); });   // lái xe thêm ở bản trước
LAIXE.forEach(x=>{ if(x.xe && !XE.includes(x.xe)) XE.push(x.xe); });
LOAI.forEach(o=>o.phieuX = o.phieu.replace('NHẬP','XUẤT'));
function saveExtra(){ STORE.set('htlDanhMucMoi', EXTRA); }
function resetExtra(){ if(!confirm('Xoá toàn bộ khách hàng / điểm giao / xe... đã thêm mới?')) return; STORE.del('htlDanhMucMoi').then(()=>location.reload()); }

/* ---------- GIAO DỊCH ---------- */
// tx: {so, ngay, loai:'NHAP'|'XUAT', chu: mã loại hàng, ma: mã pallet/mặt hàng, sl, slp (SL theo phiếu xuất), dvt, hong, lo,
//      lydo, diem, tuyen, booking, vitri, ct, xe, nguoi, gc, user, bb}
let tx = STORE.tx();
let seqN = {}; const soN = c => LN(c).pre + String(seqN[c]=(seqN[c]||0)+1).padStart(4,'0');   // dãy số nhập riêng từng loại
let seqX = 0;  const soX = () => 'PX' + String(++seqX).padStart(4,'0');
let seqBB = 0; const BB = STORE.bb();  // biên bản lái xe (thừa/thiếu khi bàn giao)
const DS = new Set(STORE.ds());        // số phiếu thu hồi / trả về đã đối soát
function initSeq(){                    // số phiếu tiếp theo = số lớn nhất đã có + 1 (gọi lại sau mỗi lần đồng bộ)
  const num = s => +(String(s).match(/(\d+)$/)||[0,0])[1];
  tx.forEach(t=>{ if(t.loai==='XUAT') seqX = Math.max(seqX, num(t.so)); else seqN[t.chu] = Math.max(seqN[t.chu]||0, num(t.so)); });
  BB.forEach(b=>{ seqBB = Math.max(seqBB, num(b.so)); });
}
initSeq();

/* ĐỒNG BỘ – tải lại phiếu từ máy chủ để thấy phiếu do thiết bị khác vừa lập (điện thoại ↔ máy tính).
   Tự chạy khi quay lại ứng dụng, mỗi 60 giây khi đang mở, và ngay trước khi lưu phiếu (để số phiếu không trùng). */
let syncAt = Date.now(), syncing = null;
function dongBo(hien){
  if(!STORE.online) return Promise.resolve();
  if(syncing) return syncing;
  syncing = (async()=>{
    try{
      const ok = await STORE.reload();
      if(ok){ DS.clear(); STORE.ds().forEach(s=>DS.add(s)); initSeq(); capNhatSo(); renderAll(); syncAt = Date.now();
              if(hien) toast('✔ Đã cập nhật dữ liệu mới nhất'); }
      else if(hien) toast('⚠ Chưa cập nhật được – còn phiếu chờ gửi lên máy chủ (mất mạng?)', 3500);
    }catch(e){ console.warn('Đồng bộ lỗi', e); if(hien) toast('⚠ Không tải được dữ liệu mới: '+(e.message||e), 3500); }
    finally{ syncing = null; }
  })();
  return syncing;
}
function capNhatSo(){   // cập nhật số phiếu đang hiện trên form sau khi đồng bộ (không xoá nội dung đang nhập)
  if(typeof NLOAI!=='undefined') nSo.value = LN(NLOAI).pre + String((seqN[NLOAI]||0)+1).padStart(4,'0');
  if(typeof NLOAI!=='undefined') nBBso.value = 'BB' + String(seqBB+1).padStart(4,'0');
  if(typeof XLOAI!=='undefined'){ xSo.value = 'PX' + String(seqX+1).padStart(4,'0'); xBBso.value = 'BB' + String(seqBB+1).padStart(4,'0'); }
}
window.dongBo = dongBo;
document.addEventListener('visibilitychange', ()=>{ if(document.visibilityState==='visible' && Date.now()-syncAt>15000) dongBo(); });
setInterval(()=>{ if(document.visibilityState==='visible') dongBo(); }, 60000);
let dangLuu = false;
async function truocKhiLuu(fn){   // đồng bộ nhanh trước khi lưu → số phiếu tiếp theo đúng với máy chủ
  if(dangLuu) return; dangLuu = true;
  try{ if(STORE.online && navigator.onLine) await Promise.race([dongBo(), new Promise(r=>setTimeout(r,6000))]); fn(); }
  finally{ dangLuu = false; }
}

/* TỒN – cho phép âm. lo=null: cộng mọi lô */
function ton(c, ma, lo=null, to=TODAY){
  const base = isPalC(c) ? (PALLETS.find(p=>p.ma===ma)?.dau[c]||0) : 0;
  return tx.filter(t=>t.chu===c && t.ma===ma && (lo===null || (t.lo||'')===lo) && t.ngay<=to)
           .reduce((s,t)=>s+(t.loai==='NHAP'?t.sl:-t.sl), lo===null?base:0);
}
/* Các lô của 1 mặt hàng, lô nhập trước xếp trước (nhập trước – xuất trước) */
function lots(c, ma, to=TODAY){
  const m = {};
  tx.filter(t=>t.chu===c && t.ma===ma && t.ngay<=to).forEach(t=>{
    const k = t.lo||''; m[k] = m[k] || {lo:k, ngay:'', ton:0};
    m[k].ton += t.loai==='NHAP' ? t.sl : -t.sl; if(t.loai==='NHAP' && (!m[k].ngay || t.ngay<m[k].ngay)) m[k].ngay = t.ngay;
  });
  return Object.values(m).sort((a,b)=>(a.ngay||'9999').localeCompare(b.ngay||'9999')||a.lo.localeCompare(b.lo));
}
/* Các dòng N–X–T của 1 loại hàng trong kỳ */
function stockRows(c, from, to){
  const before = fmtISO(addDays(new Date(from+'T00:00:00'),-1));
  const keys = isPalC(c) ? PALLETS.map(p=>({ma:p.ma, lo:null}))
                         : (HANG[c]||[]).flatMap(h=>lots(c,h.ma,to).map(l=>({ma:h.ma, lo:l.lo})));
  return keys.map(k=>{
    const r = tx.filter(t=>t.chu===c && t.ma===k.ma && (k.lo===null||(t.lo||'')===k.lo) && t.ngay>=from && t.ngay<=to);
    const dau = ton(c,k.ma,k.lo,before), n = sum(r.filter(t=>t.loai==='NHAP'),t=>t.sl), x = sum(r.filter(t=>t.loai==='XUAT'),t=>t.sl);
    return {...k, chu:c, dau, n, x, c:dau+n-x, h:sum(r,t=>t.hong||0), dvt:dvtOf(c,k.ma)};
  });
}
function phieuList(arr){
  const m = new Map();
  arr.forEach(t=>{ if(!m.has(t.so)) m.set(t.so,{...t, lines:[]}); m.get(t.so).lines.push(t); });
  return [...m.values()];
}
/* SL thực tế của 1 dòng: nhập = tốt + hỏng (số thực nhận), xuất = SL thực giao. SL chứng từ / theo phiếu = slp (dòng nhập cũ chưa có slp → coi như khớp) */
const thucTe = t => t.loai==='NHAP' ? (t.sl||0) + (t.hong||0) : (t.sl||0);
const ctOf = t => (t.slp===undefined || t.slp===null || isNaN(t.slp)) ? thucTe(t) : t.slp;
const bbNhap = b => !String(b.px||'').startsWith('PX');
function taoBB(so, file, gc){
  const L = tx.filter(t=>t.so===so);
  const bb = {so:'BB'+String(++seqBB).padStart(4,'0'), px:so, chu:L[0].chu, ngay:L[0].ngay, xe:L[0].xe, taixe:L[0].nguoi, file, gc, st:'Chờ kiểm tra',
              dong:L.filter(t=>thucTe(t)!==t.slp).map(t=>({ma:t.ma, lo:t.lo, slp:t.slp, sl:thucTe(t)}))};
  BB.push(bb); L.forEach(t=>t.bb=bb.so);
  return bb;
}

/* ---------- DỮ LIỆU MẪU (sinh ngẫu nhiên 14 ngày) ---------- */
function seedDemo(){   // CHỈ dùng thử nghiệm – không gọi trong bản chạy thật
  const push = o => tx.push(Object.assign({hong:0, gc:'', user:USERS[rnd(0,1)], thukho:USERS[rnd(0,1)], xe:XE[rnd(0,3)]}, o));
  const GOODS = ['SALE','KIDO','BBTP','HD'];
  const NPP0 = NPP.slice(0,5);
  for(let i=13;i>=0;i--){
    const d = fmtISO(addDays(today,-i));
    for(let k=0,n=rnd(1,2);k<n;k++){
      const c = GOODS[rnd(0,3)], L = LN(c), so = soN(c), tu = NPP0[rnd(0,4)].tuyen, bk = 'BK-'+rnd(10000,99999), xe = XE[rnd(0,3)];
      HANG[c].slice(0,rnd(1,3)).forEach((h,j)=>push({so, ngay:d, loai:'NHAP', lydo:L.lydo[0], diem:L.nguon[0], chu:c, ma:h.ma, sl:rnd(20,80), xe,
        lo:`L${d.replace(/-/g,'').slice(2)}-${k+1}${j+1}`, ct:'PO-'+rnd(1000,9999),
        booking:d, nguoi:TAIXE[rnd(0,3)]}));
    }
    for(let k=0,n=rnd(1,2);k<n;k++){
      const c = GOODS[rnd(0,3)], npp = NPP0[rnd(0,4)];
      const lines = HANG[c].map(h=>{const l = lots(c,h.ma,d).find(l=>l.ton>0); return l && {h,l}}).filter(Boolean).slice(0,2);
      if(!lines.length) continue;
      const so = soX(), xe = XE[rnd(0,3)], don = 'DH-'+rnd(10000,99999), lx = TAIXE[rnd(0,3)];
      lines.forEach(({h,l})=>{ const sl = Math.min(rnd(10,40), l.ton);
        push({so, ngay:d, loai:'XUAT', lydo:LYDO_X[0], diem:npp.ten, chu:c, ma:h.ma, lo:l.lo, sl, slp:sl, booking:don, tuyen:npp.tuyen, xe, nguoi:lx}); });
    }
    for(let k=0,n=rnd(1,3);k<n;k++){
      const npp = NPP0[rnd(0,4)], p = PALLETS[rnd(0,2)], c = OWNERS[rnd(0,1)].ma;
      const sl = Math.min(rnd(4,14), ton(c,p.ma,null,d)); if(sl<=0) continue;
      push({so:soX(), ngay:d, loai:'XUAT', lydo:LYDO_X[0], diem:npp.ten, chu:c, ma:p.ma, sl, slp:sl, tuyen:npp.tuyen, booking:'DH-'+rnd(10000,99999), nguoi:TAIXE[rnd(0,3)]});
    }
    for(let k=0,n=rnd(1,2);k<n;k++){
      const npp = NPP0[rnd(0,4)], p = PALLETS[rnd(0,2)], c = OWNERS[rnd(0,1)].ma;
      const r = tx.filter(t=>t.diem===npp.ten && t.chu===c && t.ma===p.ma);
      const daGiao = sum(r,t=>t.loai==='XUAT'?t.sl:-t.sl);
      const sl = Math.min(rnd(5,15), daGiao); if(sl<=0) continue;
      push({so:soN(c), ngay:d, loai:'NHAP', lydo:'Thu hồi từ điểm giao', diem:npp.ten, chu:c, ma:p.ma, sl, hong:rnd(0,2), tuyen:npp.tuyen, vitri:'Khu pallet '+c, nguoi:TAIXE[rnd(0,3)]});
    }
  }
  push({so:soN('TP'),  ngay:fmtISO(addDays(today,-10)), loai:'NHAP', lydo:'Thọ Phát cấp mới', diem:'Nhà máy Thọ Phát', chu:'TP',  ma:'PG12', sl:60, vitri:'Khu pallet TP'});
  push({so:soN('HTL'), ngay:fmtISO(addDays(today,-6)),  loai:'NHAP', lydo:'HTL bổ sung',      diem:'Nhà máy Thọ Phát', chu:'HTL', ma:'PN11', sl:40, vitri:'Khu pallet HTL'});
  // Ví dụ xuất vượt tồn (cho phép âm): pallet sắt Thọ Phát tồn đầu 10, xuất 13
  push({so:soX(), ngay:fmtISO(addDays(today,-1)), loai:'XUAT', lydo:LYDO_X[0], diem:'NPP Hải Phòng', chu:'TP', ma:'PS', sl:13, slp:13, tuyen:'T04', booking:'DH-50321', nguoi:TAIXE[2], gc:'Xuất trước – chờ Thọ Phát cấp bổ sung'});
  // Hàng trả về từ NPP (giữ số lô gốc)
  const PX = phieuList(tx.filter(t=>t.loai==='XUAT' && !isPalC(t.chu)));
  [PX[1], PX[Math.floor(PX.length/2)]].filter(Boolean).forEach(p=>{
    const t = p.lines[0], d = fmtISO(addDays(new Date(p.ngay+'T00:00:00'),1)); if(d>TODAY) return;
    push({so:soN(t.chu), ngay:d, loai:'NHAP', lydo:'Hàng trả về', diem:t.diem, chu:t.chu, ma:t.ma, lo:t.lo, sl:Math.min(3,t.sl), tuyen:t.tuyen,
          vitri:'Khu hàng trả về', ct:'Phiếu trả '+t.so, gc:'Bao bì móp', nguoi:t.nguoi});
  });
  // Biên bản lái xe mẫu: thừa/thiếu khi bàn giao
  const pick = (back, pal) => phieuList(tx.filter(t=>t.loai==='XUAT' && isPalC(t.chu)===pal && t.ngay===fmtISO(addDays(today,-back)) && t.sl>3))[0];
  [[5,false,-2,'Đã xử lý'],[2,false,-2,'Chờ kiểm tra'],[1,true,1,'Chờ kiểm tra']].forEach(([back,pal,dl,st])=>{
    const p = pick(back,pal); if(!p) return;
    p.lines[0].sl = p.lines[0].slp + dl;
    const b = taoBB(p.so, `BB_laixe_${p.so}.jpg`, dl<0?'Lái xe báo thiếu khi kiểm đếm trên xe':'Lái xe nhận dư 1 pallet');
    b.st = st;
  });
  tx.filter(t=>t.loai==='NHAP' && LYDO_DS.includes(t.lydo) && t.ngay<fmtISO(addDays(today,-4))).forEach(t=>DS.add(t.so));
}

/* ---------- BỘ LỌC LOẠI HÀNG (header) ---------- */
let FL = '';
const scoped = () => FL ? tx.filter(t=>t.chu===FL) : tx;
const loaiInScope = () => FL ? [LN(FL)] : LOAI;
function setFL(c){ FL = c; fLoai.value = c; renderAll(); }
fLoai.addEventListener('change',()=>setFL(fLoai.value));

/* ---------- TỔNG QUAN ---------- */
function renderDashboard(){
  const P = phieuList(scoped());
  const pt = l => P.filter(p=>p.ngay===TODAY && p.loai===l);
  const subOf = a => a.length ? `${sum(a,p=>p.lines.length)} dòng · ${[...new Set(a.map(p=>cName(p.chu)))].join(', ')}` : 'Chưa có phiếu';
  kNhap.textContent = pt('NHAP').length; kNhapSub.textContent = subOf(pt('NHAP'));
  kXuat.textContent = pt('XUAT').length; kXuatSub.textContent = subOf(pt('XUAT'));
  const am = loaiInScope().flatMap(o=>stockRows(o.ma,TODAY,TODAY).filter(r=>r.c<0));
  kAm.textContent = am.length;
  const bbCho = BB.filter(b=>b.st!=='Đã xử lý' && (!FL||b.chu===FL));
  const dsCho = phieuList(scoped().filter(t=>t.loai==='NHAP' && LYDO_DS.includes(t.lydo))).filter(p=>!DS.has(p.so));
  kCho.textContent = bbCho.length + dsCho.length;
  kChoSub.textContent = `${bbCho.length} biên bản · ${dsCho.length} phiếu thu hồi/trả về`;

  const days = [...Array(7)].map((_,i)=>fmtISO(addDays(today,i-6)));
  const vals = days.map(d=>({n:P.filter(p=>p.ngay===d&&p.loai==='NHAP').length, x:P.filter(p=>p.ngay===d&&p.loai==='XUAT').length}));
  const max = Math.max(...vals.flatMap(v=>[v.n,v.x]),1);
  chart.innerHTML = vals.map(v=>`<div class="day"><div class="bars">
     <div class="bar in" style="height:${v.n/max*100}%" data-v="${v.n}"></div>
     <div class="bar out" style="height:${v.x/max*100}%" data-v="${v.x}"></div></div></div>`).join('');
  chartX.innerHTML = days.map(d=>`<div>${fmtVN(d).slice(0,5)}</div>`).join('');

  dashTon.innerHTML = loaiInScope().map(o=>{
    const R = stockRows(o.ma,TODAY,TODAY).filter(r=>r.c!==0), na = R.filter(r=>r.c<0).length;
    return `<tr class="click" onclick="setFL('${FL?'':o.ma}')"><td>${cTag(o.ma)}</td><td class="num"><div><b>${sum(R,r=>r.c).toLocaleString('vi')}</b> <span class="note">${[...new Set(R.map(r=>r.dvt))].join('/')}</span></div></td>
      <td class="num ${na?'negv':''}">${na||'–'}</td></tr>`;
  }).join('');

  const chk = [
    ...am.map(r=>`<tr><td>${TAG_AM}</td><td><div>${cTag(r.chu)} ${pName(r.ma)}${r.lo?' · lô '+r.lo:''}: <b class="negv">${r.c}</b> ${r.dvt}</div></td><td><span class="lnk" onclick="go('ton')">Xem tồn kho</span></td></tr>`),
    ...bbCho.map(b=>`<tr><td><span class="tag warn">${bbNhap(b)?'Thừa / thiếu nhập kho':'Thừa / thiếu bàn giao'}</span></td><td><div>${cTag(b.chu)} ${b.dong.map(x=>`${pName(x.ma)}: ${clHTML(x.slp,x.sl)}`).join(', ')}</div></td>
      <td><div><span class="lnk" onclick="xemPhieu('${b.so}')">${b.so}</span> · <span class="lnk" onclick="xemPhieu('${b.px}')">${b.px}</span></div></td></tr>`),
    ...dsCho.map(p=>`<tr><td><span class="tag out">Chờ đối soát</span></td><td><div>${cTag(p.chu)} ${p.lydo} · ${p.diem} · ${sum(p.lines,l=>l.sl)} ${dvtOf(p.chu,p.ma)}</div></td>
      <td><div><span class="lnk" onclick="xemPhieu('${p.so}')">${p.so}</span> · <span class="lnk" onclick="go('doisoat')">Đối soát</span></div></td></tr>`)];
  dashCheck.innerHTML = chk.join('') || '<tr><td colspan="3" class="note">Không có việc cần kiểm tra</td></tr>';

  dashRecent.innerHTML = P.sort(byNew).slice(0,8).map(p=>`<tr><td><b class="lnk" onclick="xemPhieu('${p.so}')">${p.so}</b></td><td>${fmtVN(p.ngay)}</td><td><div>${tag(p.loai)} ${cTag(p.chu)}</div></td>
    <td>${p.diem}</td><td class="num ${p.loai==='NHAP'?'pos':'neg'}">${p.loai==='NHAP'?'+':'−'}${sum(p.lines,l=>l.sl)}</td><td>${bgCell(p)}</td></tr>`).join('');
}
const bgCell = t => t.bb ? `<span class="tag warn lnk" onclick="xemPhieu('${t.bb}')">${t.bb}</span>` : (t.loai==='XUAT' || (t.slp!==undefined && t.slp!==null)) ? '<span class="tag ok">Khớp</span>' : '';

/* ---------- TỒN KHO ---------- */
function renderTon(){
  const from = tFrom.value, to = tTo.value; let html = '';
  loaiInScope().forEach(o=>{
    const R = stockRows(o.ma,from,to).filter(r=>isPalC(o.ma) || r.dau || r.n || r.x || r.c);
    html += `<tr class="group"><td colspan="7">${cTag(o.ma)} <span class="note">· ${R.length} dòng</span></td></tr>`;
    html += R.map(r=>`<tr><td><div><b>${pName(r.ma)}</b><span class="sub2">${r.ma} · ${r.dvt}</span></div></td>
      <td>${r.lo===null?'—':(r.lo||'(chưa rõ lô)')}</td>
      <td class="num">${r.dau}</td><td class="num pos">${r.n}</td><td class="num neg">${r.x}</td><td class="num ${r.c<0?'negv':''}"><b>${r.c}</b></td><td>${r.c<0?TAG_AM:''}</td></tr>`).join('')
      || '<tr><td colspan="7" class="note">Không có tồn trong kỳ</td></tr>';
    html += `<tr class="subtotal"><td colspan="2">Cộng ${o.ten}</td><td class="num" data-l="Tồn đầu">${sum(R,r=>r.dau)}</td><td class="num pos" data-l="Nhập">${sum(R,r=>r.n)}</td>
      <td class="num neg" data-l="Xuất">${sum(R,r=>r.x)}</td><td class="num" data-l="Tồn cuối">${sum(R,r=>r.c)}</td><td></td></tr>`;
  });
  tonBody.innerHTML = html;
}
function taiTon(){
  taiFile(`TonKho_${tFrom.value}_${tTo.value}.xls`, headerPhieu('') + `<h3 style="color:#e11b22">BÁO CÁO NHẬP – XUẤT – TỒN</h3><p>Kỳ: ${fmtVN(tFrom.value)} – ${fmtVN(tTo.value)}${FL?' · Loại hàng: '+cName(FL):''}</p>`
    + `<table border="1" style="border-collapse:collapse">${tonTable.innerHTML}</table>`);
}

/* ---------- THU HỒI / TRẢ VỀ + BIÊN BẢN LÁI XE ---------- */
function renderDoiSoat(){
  const st = dsSt.value;
  const all = phieuList(scoped().filter(t=>t.loai==='NHAP' && LYDO_DS.includes(t.lydo))).sort(byNew);
  const P = all.filter(p=>!st || (st==='da')===DS.has(p.so));
  const cho = all.filter(p=>!DS.has(p.so));
  dsTong.innerHTML = `<div><small>Tổng phiếu</small><b>${all.length}</b></div><div><small>Chờ đối soát</small><b class="warnc">${cho.length}</b></div><div><small>Đã đối soát</small><b>${all.length-cho.length}</b></div>`;
  dsBody.innerHTML = P.map(p=>{ const h = sum(p.lines,l=>l.hong||0);
    return `<tr><td><b class="lnk" onclick="xemPhieu('${p.so}')">${p.so}</b></td><td>${fmtVN(p.ngay)}</td><td>${cTag(p.chu)}</td>
    <td><div>${p.lydo}<span class="sub2">${p.diem}</span></div></td><td class="num">${sum(p.lines,l=>l.sl)}${h?` <span class="note">(${h} hỏng)</span>`:''}</td>
    <td>${DS.has(p.so)?'<span class="tag ok">Đã đối soát</span>':`<button class="ico-btn go" onclick="xacNhanDS('${p.so}')">✔ Xác nhận đối soát</button>`}</td></tr>`}).join('')
    || '<tr><td colspan="6" class="note">Không có phiếu</td></tr>';
  bbBody.innerHTML = BB.filter(b=>!FL||b.chu===FL).slice().reverse().map(b=>`<tr><td><b class="lnk" onclick="xemPhieu('${b.so}')">${b.so}</b></td><td>${fmtVN(b.ngay)}</td>
    <td><div><span class="tag ${bbNhap(b)?'in':'out'}">${bbNhap(b)?'Nhập':'Xuất'}</span> <span class="lnk" onclick="xemPhieu('${b.px}')">${b.px}</span> ${cTag(b.chu)}</div></td><td><div>${b.taixe||'—'}<span class="sub2">${b.xe}${b.file?' · 📎 '+b.file:''}</span></div></td>
    <td><div>${b.dong.map(x=>`${pName(x.ma)}: ${clHTML(x.slp,x.sl)}`).join('<br>')}</div></td>
    <td>${b.st==='Đã xử lý'?'<span class="tag ok">Đã xử lý</span>':`<button class="ico-btn go" onclick="xuLyBB('${b.so}')">✔ Đánh dấu đã xử lý</button>`}</td></tr>`).join('')
    || '<tr><td colspan="6" class="note">Chưa có biên bản</td></tr>';
}
/* ---------- BÁO CÁO THỪA / THIẾU (nhập: thực nhận so với chứng từ · xuất: thực giao so với phiếu) ---------- */
let bcSel = '';   // kỳ đang chọn để xem chi tiết
function bcKyDoi(){
  const thang = bcKy.value==='thang';
  bcFrom.value = thang ? TODAY.slice(0,4)+'-01-01' : fmtISO(new Date(today.getFullYear(), today.getMonth(), 1)); bcTo.value = TODAY;
  bcSel = ''; renderBaoCao();
}
function bcRows(){
  const from = bcFrom.value, to = bcTo.value, k = bcLoai.value;
  return scoped().filter(t=>(!k||t.loai===k) && t.ngay>=from && t.ngay<=to)
    .map(t=>{ const ct = ctOf(t), th = thucTe(t); return {...t, ct, th, d:th-ct}; });
}
const bcKey = t => bcKy.value==='thang' ? t.ngay.slice(0,7) : t.ngay;
const bcKyTxt = k => k.length===7 ? `Tháng ${k.slice(5)}/${k.slice(0,4)}` : fmtVN(k);
function bcGroup(R){
  const P = phieuList(R), G = {};
  P.forEach(p=>{ const k = bcKey(p), g = G[k] = G[k] || {k, n:0, lech:0, thua:0, thieu:0, ct:0, th:0, nThua:0, nThieu:0};
    const du = sum(p.lines,l=>Math.max(0,l.d)), thieu = sum(p.lines,l=>Math.max(0,-l.d));
    g.n++; g.lech += p.lines.some(l=>l.d!==0)?1:0; g.thua += du; g.thieu += thieu; g.ct += sum(p.lines,l=>l.ct); g.th += sum(p.lines,l=>l.th);
    if(du) g.nThua++; if(thieu) g.nThieu++; });
  return Object.values(G).sort((a,b)=>b.k.localeCompare(a.k));
}
function renderBaoCao(){
  if(!bcFrom.value){ bcKyDoi(); return; }
  const R = bcRows(), P = phieuList(R), G = bcGroup(R), thang = bcKy.value==='thang', lk = bcLoai.value;
  const lech = P.filter(p=>p.lines.some(l=>l.d!==0)), du = sum(R,r=>Math.max(0,r.d)), thieu = sum(R,r=>Math.max(0,-r.d));
  const bbCho = BB.filter(b=>b.st!=='Đã xử lý' && (!FL||b.chu===FL) && (!lk || (lk==='NHAP')===bbNhap(b)) && b.ngay>=bcFrom.value && b.ngay<=bcTo.value).length;
  const ten = lk==='NHAP'?'Phiếu nhập':lk==='XUAT'?'Phiếu xuất':'Phiếu nhập + xuất';
  bcTong.innerHTML = `<div><small>${ten} trong kỳ</small><b>${P.length}</b></div>`
    + `<div><small>Phiếu có chênh lệch</small><b class="${lech.length?'warnc':''}">${lech.length}</b></div>`
    + `<div><small>Tỷ lệ lệch</small><b>${P.length?Math.round(lech.length/P.length*1000)/10:0}%</b></div>`
    + `<div><small>Tổng thừa (+)</small><b class="cl-thua">${du?'+'+du:0}</b></div>`
    + `<div><small>Tổng thiếu (−)</small><b class="cl-thieu">${thieu?'−'+thieu:0}</b></div>`
    + `<div><small>Biên bản chờ xử lý</small><b class="${bbCho?'warnc':''}">${bbCho}</b></div>`;
  // biểu đồ: 12 kỳ gần nhất trong khoảng – số phiếu thừa / số phiếu thiếu
  const C = G.slice(0,12).reverse(), max = Math.max(1, ...C.flatMap(g=>[g.nThua,g.nThieu]));
  bcChart.innerHTML = C.map(g=>`<div class="day"><div class="bars"><div class="bar thua" style="height:${g.nThua/max*100}%" data-v="${g.nThua}"></div><div class="bar thieu" style="height:${g.nThieu/max*100}%" data-v="${g.nThieu}"></div></div></div>`).join('') || '<p class="note">Không có phiếu trong kỳ</p>';
  bcChartX.innerHTML = C.map(g=>`<div>${thang ? g.k.slice(5)+'/'+g.k.slice(2,4) : fmtVN(g.k).slice(0,5)}</div>`).join('');
  // theo loại hàng
  bcLoaiBody.innerHTML = loaiInScope().map(o=>{ const r = R.filter(t=>t.chu===o.ma), p = phieuList(r); if(!p.length) return '';
    return `<tr><td>${cTag(o.ma)}</td><td class="num">${p.length}</td><td class="num">${p.filter(x=>x.lines.some(l=>l.d!==0)).length||'–'}</td>
      <td class="num cl-thua">${sum(r,x=>Math.max(0,x.d))||'–'}</td><td class="num cl-thieu">${sum(r,x=>Math.max(0,-x.d))||'–'}</td></tr>`; }).join('') || '<tr><td colspan="5" class="note">Không có phiếu</td></tr>';
  // tổng hợp theo kỳ
  bcKyTh.textContent = thang ? 'Tháng' : 'Ngày'; bcKyTitle.textContent = 'Tổng hợp theo ' + (thang ? 'tháng' : 'ngày');
  bcKyBody.innerHTML = G.map(g=>`<tr class="${bcSel===g.k?'sel':''}" onclick="bcSel=bcSel==='${g.k}'?'':'${g.k}';renderBaoCao()"><td><b>${bcKyTxt(g.k)}</b></td><td class="num">${g.n}</td>
      <td class="num ${g.lech?'warnc':''}">${g.lech||'–'}</td><td class="num">${g.n?Math.round(g.lech/g.n*1000)/10:0}%</td><td class="num">${g.ct}</td><td class="num">${g.th}</td>
      <td class="num cl-thua">${g.thua?'+'+g.thua:'–'}</td><td class="num cl-thieu">${g.thieu?'−'+g.thieu:'–'}</td></tr>`).join('')
    || '<tr><td colspan="8" class="note">Không có phiếu trong kỳ</td></tr>';
  // chi tiết
  const D = R.filter(r=>r.d!==0 && (!bcSel || bcKey(r)===bcSel)).sort(byNew);
  bcCtTitle.textContent = 'Chi tiết dòng hàng thừa / thiếu' + (bcSel ? ' – ' + bcKyTxt(bcSel) : ' – cả kỳ');
  bcCtBody.innerHTML = D.map(r=>{ const b = BB.find(x=>x.px===r.so);
    return `<tr><td>${fmtVN(r.ngay)}</td><td><div><b class="lnk" onclick="xemPhieu('${r.so}')">${r.so}</b><span class="sub2">${r.loai==='NHAP'?'Nhập':'Xuất'} · ${cName(r.chu)}</span></div></td><td>${esc(r.diem||'')}</td><td><div>${pName(r.ma)}<span class="sub2">${r.lo?'Lô '+r.lo+' · ':''}${r.dvt||dvtOf(r.chu,r.ma)}</span></div></td>
      <td class="num">${r.ct}</td><td class="num">${r.th}</td><td>${clHTML(r.ct, r.th)}</td>
      <td>${b?`<div><span class="lnk" onclick="xemPhieu('${b.so}')">${b.so}</span><span class="sub2" style="color:${b.st==='Đã xử lý'?'#15803d':'#b45309'}">${b.st==='Đã xử lý'?'✔ Đã xử lý':'⏳ Chờ kiểm tra'}</span></div>`:'<span class="note">Chưa có</span>'}</td></tr>`; }).join('')
    || '<tr><td colspan="9" class="note">Không có dòng thừa / thiếu</td></tr>';
}
function taiBaoCao(){
  const lk = bcLoai.value, ten = lk==='NHAP'?'NHẬP KHO':lk==='XUAT'?'XUẤT KHO (BÀN GIAO LÁI XE)':'NHẬP + XUẤT KHO';
  const sel = bcSel; bcSel = ''; renderBaoCao();
  taiFile(`BaoCao_ThuaThieu_${bcFrom.value}_${bcTo.value}.xls`, headerPhieu('') + `<h3 style="color:#e11b22">BÁO CÁO THỪA / THIẾU HÀNG – ${ten}</h3><p>Kỳ: ${fmtVN(bcFrom.value)} – ${fmtVN(bcTo.value)} · theo ${bcKy.value==='thang'?'tháng':'ngày'}${FL?' · Loại hàng: '+cName(FL):''}</p>`
    + `<p>${[...bcTong.querySelectorAll('div')].map(d=>d.querySelector('small').textContent+': <b>'+d.querySelector('b').textContent+'</b>').join(' · ')}</p>`
    + `<h4>Tổng hợp theo ${bcKy.value==='thang'?'tháng':'ngày'}</h4><table border="1" style="border-collapse:collapse">${bcKyTable.innerHTML}</table>`
    + `<h4>Chi tiết dòng hàng thừa / thiếu</h4><table border="1" style="border-collapse:collapse">${bcCtTable.innerHTML}</table>`);
  bcSel = sel; renderBaoCao();
}

/* ---------- LƯU TRỮ BIÊN BẢN / CHỨNG TỪ ĐÃ KÝ (bảng chung_tu + file biên bản thừa / thiếu) ---------- */
const CT = STORE.ct();
const CT_LOAI = {BG:'Biên bản bàn giao hàng', NH:'Biên bản nhập hàng', TT:'Biên bản ghi nhận thừa / thiếu', KHAC:'Chứng từ khác'};
const ctLoaiGoiY = so => /^PX/i.test(so) ? 'BG' : /^BB/i.test(so) ? 'TT' : so ? 'NH' : 'KHAC';
/* Danh sách hồ sơ: biên bản / chứng từ đã lưu + file đính kèm của biên bản thừa / thiếu (lập trên phiếu) */
function hoSo(){
  const a = CT.map(c=>({...c, src:'ct'}));
  BB.filter(b=>b.file).forEach(b=>{ if(!a.some(c=>c.so===b.so && c.file===b.file))
    a.push({id:'bb-'+b.so, so:b.so, px:b.px, loai:'TT', ngay:b.ngay, file:b.file, file_path:b.file_path||'', gc:(b.gc||'') + ' · đính kèm khi lập phiếu ' + b.px, src:'bb'}); });
  return a;
}
const coPhieu = so => tx.some(t=>t.so===so) || BB.some(b=>b.so===so);
const lnkSo = so => coPhieu(so) ? `<b class="lnk" onclick="xemPhieu('${esc(so)}')">${esc(so)}</b>` : `<b>${esc(so)}</b>`;
const soGoc = h => h.px || (String(h.so).startsWith('BB') ? (BB.find(b=>b.so===h.so)?.px||'') : h.so);   // phiếu nhập / xuất liên quan
async function xemFile(path, name){
  if(!path) return toast(STORE.online ? '⚠ File này chưa được tải lên máy chủ' : 'Chế độ thử trên máy: file không được lưu, chỉ lưu tên file', 3500);
  const w = window.open('', '_blank');
  try{ const u = await STORE.fileUrl(path); if(!u) throw new Error('không lấy được đường dẫn'); if(w) w.location = u; else location.href = u; }
  catch(e){ if(w) w.close(); toast('⚠ Không mở được file: '+(e.message||e), 3500); }
}
function ltInit(){
  ltLoai.innerHTML = Object.entries(CT_LOAI).map(([k,v])=>opt(k,v)).join('');
  ltLocLoai.innerHTML = '<option value="">Tất cả loại biên bản</option>' + Object.entries(CT_LOAI).map(([k,v])=>opt(k,v)).join('');
  ltFrom.value = fmtISO(new Date(today.getFullYear(), today.getMonth(), 1)); ltTo.value = TODAY; ltNgay.value = TODAY;
}
function ltSoDoi(){
  const so = ltSo.value.trim().toUpperCase(), P = phieuList(tx.filter(t=>t.so===so))[0], b = BB.find(x=>x.so===so);
  if(so) ltLoai.value = ctLoaiGoiY(so);
  if(P) ltNgay.value = P.ngay; else if(b) ltNgay.value = b.ngay;
  ltHint.innerHTML = P ? `${P.loai==='NHAP'?'Phiếu nhập':'Phiếu xuất'} ${cName(P.chu)} · ${fmtVN(P.ngay)} · ${esc(P.diem||'')}`
    : b ? `Biên bản thừa / thiếu của phiếu ${b.px} · ${fmtVN(b.ngay)}` : so ? '⚠ Chưa có phiếu / biên bản số này – vẫn lưu được (VD chứng từ khác)' : '';
}
function themCT(so){
  dongPhieu(); go('luutru'); ltSo.value = so; ltSoDoi(); ltGc.value = ''; ltFile.value = '';
  ltForm.scrollIntoView({behavior:'smooth'});
}
let dangLuuCT = false;
async function luuCT(){
  const so = ltSo.value.trim().toUpperCase(), F = [...ltFile.files];
  if(!so) return toast('⚠ Vui lòng nhập số phiếu / biên bản');
  if(!F.length) return toast('⚠ Vui lòng chọn file ảnh / PDF biên bản');
  if(dangLuuCT) return; dangLuuCT = true; toast(`Đang lưu ${F.length} file…`, 8000);
  let ok = 0;
  try{ for(const f of F){ if(await STORE.addCT({so, loai:ltLoai.value, ngay:ltNgay.value||TODAY, gc:ltGc.value.trim()}, f)) ok++; } }
  finally{ dangLuuCT = false; }
  if(ok){ toast(`✔ Đã lưu ${ok} file biên bản cho ${so}`); ltFile.value = ''; ltGc.value = ''; }
  renderLuuTru();
}
/* Lưu biên bản đã ký chọn ngay trên phiếu nhập / xuất (không bắt buộc) */
function luuKyFile(inp, so, loai, ngay){
  const F = [...(inp.files||[])]; inp.value = '';
  F.forEach(f=>STORE.addCT({so, loai, ngay, gc:'Đính kèm khi lập phiếu'}, f).then(()=>renderLuuTru()));
}
function ltRows(){
  const q = ltQ.value.trim().toLowerCase(), lo = ltLocLoai.value, from = ltFrom.value, to = ltTo.value;
  return hoSo().filter(h=>(!lo||h.loai===lo) && (!from||h.ngay>=from) && (!to||h.ngay<=to)
      && (!FL || (phieuList(tx.filter(t=>t.so===soGoc(h)))[0]?.chu===FL))
      && (!q || [h.so, soGoc(h), h.gc, h.file].join(' ').toLowerCase().includes(q)))
    .sort((a,b)=>(b.ngay||'').localeCompare(a.ngay||'') || String(b.luc||b.id).localeCompare(String(a.luc||a.id)));
}
function renderLuuTru(){
  if(!ltFrom.value) ltInit();
  const R = ltRows(), dem = k => R.filter(h=>h.loai===k).length;
  ltTong.innerHTML = `<div><small>Tổng file</small><b>${R.length}</b></div>` + ['BG','NH','TT'].map(k=>`<div><small>${CT_LOAI[k].replace('Biên bản ','')}</small><b>${dem(k)}</b></div>`).join('');
  ltBody.innerHTML = R.map(h=>{ const g = soGoc(h), P = phieuList(tx.filter(t=>t.so===g))[0];
    return `<tr><td>${h.ngay?fmtVN(h.ngay):'—'}</td><td><span class="tag ${h.loai==='TT'?'warn':h.loai==='NH'?'in':h.loai==='BG'?'out':''}">${CT_LOAI[h.loai]||h.loai}</span></td>
      <td><div>${lnkSo(h.so)}${g&&g!==h.so?`<span class="sub2">phiếu ${lnkSo(g)}</span>`:''}</div></td>
      <td><div>${P?cTag(P.chu):''}<span class="sub2">${esc(P?.diem||'')}</span></div></td>
      <td><div><span class="lnk" onclick="xemFile('${esc(h.file_path)}')">👁 ${esc(h.file)}</span></div></td>
      <td><div>${esc(h.gc||'')}<span class="sub2">${esc(h.nguoi||'')}</span></div></td></tr>`; }).join('')
    || '<tr><td colspan="6" class="note">Chưa có biên bản nào trong kỳ</td></tr>';
  const coBB = new Set(hoSo().map(soGoc));
  const thieu = phieuList(scoped().filter(t=>t.ngay>=ltFrom.value && t.ngay<=ltTo.value)).filter(p=>!coBB.has(p.so)).sort(byNew);
  ltThieu.innerHTML = thieu.slice(0,100).map(p=>`<tr><td>${fmtVN(p.ngay)}</td><td><div>${tag(p.loai)} <b class="lnk" onclick="xemPhieu('${p.so}')">${p.so}</b></div></td>
      <td>${cTag(p.chu)}</td><td>${esc(p.diem||'')}</td><td><button class="ico-btn go" onclick="themCT('${p.so}')">📎 Lưu biên bản</button></td></tr>`).join('')
    || '<tr><td colspan="5" class="note">Tất cả phiếu trong kỳ đã có biên bản</td></tr>';
  ltSoList.innerHTML = [...new Set([...tx.map(t=>t.so), ...BB.map(b=>b.so)])].sort().reverse().slice(0,300).map(s=>`<option value="${s}">`).join('');
}
function taiLuuTru(){
  taiFile(`LuuTru_BienBan_${ltFrom.value}_${ltTo.value}.xls`, headerPhieu('') + `<h3 style="color:#e11b22">DANH SÁCH BIÊN BẢN / CHỨNG TỪ ĐÃ LƯU</h3><p>Kỳ: ${fmtVN(ltFrom.value)} – ${fmtVN(ltTo.value)}</p>`
    + `<table border="1" style="border-collapse:collapse">${ltTable.innerHTML}</table>`);
}
/* Trong cửa sổ xem phiếu: liệt kê biên bản đã lưu của phiếu đó */
function ctCuaPhieu(so){
  const H = hoSo().filter(h=>h.so===so || soGoc(h)===so);
  return H.length ? `<div class="ct-list"><b>📎 Biên bản / chứng từ đã lưu (${H.length})</b>${H.map(h=>`<div><span class="lnk" onclick="xemFile('${esc(h.file_path)}')">👁 ${esc(h.file)}</span> <span class="note">· ${CT_LOAI[h.loai]||h.loai} · ${h.ngay?fmtVN(h.ngay):''}</span></div>`).join('')}</div>`
    : `<div class="ct-list note">Chưa lưu biên bản đã ký cho ${esc(so)}. Bấm <b style="display:inline">📎 Lưu biên bản</b> để chụp / tải lên.</div>`;
}

function xacNhanDS(so){ DS.add(so); STORE.addDS(so); toast('✔ Đã đối soát '+so); renderAll(); }
function xuLyBB(id){ const b = BB.find(b=>b.so===id); b.st = 'Đã xử lý'; STORE.addBB(b); toast('✔ Đã xử lý biên bản '+id); renderAll(); }

/* ---------- LỊCH SỬ ---------- */
function lsRows(){
  const q = lsSearch.value.toLowerCase(), ty = lsType.value, pl = lsPallet.value;
  return [...scoped()].sort(byNew).filter(t=>(!ty||t.loai===ty)&&(!pl||t.ma===pl)&&(!q||[t.so,t.xe,t.diem,t.booking,t.bb,t.lo].join(' ').toLowerCase().includes(q)));
}
function renderLichSu(){
  lsBody.innerHTML = phieuList(lsRows()).map(p=>{ const n = p.lines.length;
    return `<tr><td><b class="lnk" onclick="xemPhieu('${p.so}')">${p.so}</b></td><td>${fmtVN(p.ngay)}</td><td><div>${tag(p.loai)} ${cTag(p.chu)}</div></td><td>${p.diem}</td>
    <td><div>${pName(p.ma)}${n>1?` <span class="note">+${n-1} dòng</span>`:''}${p.lo?`<span class="sub2">Lô ${p.lo}</span>`:''}</div></td>
    <td class="num ${p.loai==='NHAP'?'pos':'neg'}">${p.loai==='NHAP'?'+':'−'}${sum(p.lines,l=>l.sl)}</td><td>${bgCell(p)}</td>
    <td><div class="acts"><button class="ico-btn" onclick="xemPhieu('${p.so}')">Xem</button><button class="ico-btn" onclick="inPhieu('${p.so}')">PDF</button><button class="ico-btn" onclick="taiExcel('${p.so}')">Excel</button></div></td></tr>`}).join('')
    || '<tr><td colspan="8" class="note">Không có dữ liệu</td></tr>';
}

/* ---------- DANH MỤC ---------- */
function renderDanhMuc(){
  dmLoai.innerHTML = LOAI.map(o=>`<tr><td><div>${cTag(o.ma)}${o.moi?' <span class="tag ok">Mới</span>':''}</div></td><td>${o.khach||o.ky}</td><td>${o.nhom==='PALLET'?'Pallet':'Hàng hóa (theo lô)'}</td>
    <td><div>${o.phieu}<span class="sub2">${o.phieuX}</span></div></td><td>${o.pre} / PX</td></tr>`).join('');
  dmPallet.innerHTML = PALLETS.map(p=>`<tr><td>${p.ten}</td><td>${p.ma}</td><td>${p.kt}</td><td class="num">${p.dau.HTL}</td><td class="num">${p.dau.TP}</td></tr>`).join('');
  dmOwner.innerHTML = OWNERS.map(o=>`<div class="owner-card"><div class="owner-dot" style="background:${o.mau}"></div><div><b>${o.ma} – ${o.ten}</b><div class="note">${o.mo}</div></div></div>`).join('');
  dmDiem.innerHTML = DIEM.map(d=>`<tr><td>${d.ten}</td><td>${d.kv||'—'}</td><td>${d.tuyen||'—'}</td></tr>`).join('');
  dmTuyen.innerHTML = TUYEN.map(t=>`<tr><td>${t.ten}</td><td>${NPP.filter(d=>d.tuyen===t.ma).map(d=>d.ten).join(', ')||'—'}</td></tr>`).join('');
  dmHang.innerHTML = Object.entries(HANG).map(([c,arr])=>arr.map(h=>`<tr><td>${h.ten}</td><td>${h.ma}</td><td>${cTag(c)}</td><td>${h.dvt}</td></tr>`).join('')).join('');
  dmXe.innerHTML = XE.map(x=>`<span class="chip">${x}</span>`).join('');
  dmTaiXe.innerHTML = activeLX().map(x=>`<span class="chip">${esc(x.ten)}</span>`).join('');
  const n = EXTRA.loai.length + EXTRA.diem.length + EXTRA.tuyen.length + EXTRA.xe.length + EXTRA.taixe.length + sum(Object.values(EXTRA.hang),a=>a.length) + sum(Object.values(EXTRA.nguon),a=>a.length);
  dmExtraNote.textContent = `Đã thêm ${n} mục (khách hàng, mặt hàng, điểm giao, tuyến, xe, lái xe, nguồn nhập). Các mục này được lưu trong trình duyệt nên không mất khi tải lại trang.`;
}

/* ---------- DROPLIST + "THÊM MỚI" ---------- */
const NEWLBL = {loai:'＋ Khách hàng / loại hàng mới…', nguon:'＋ Thêm nguồn nhập mới…', diem:'＋ Thêm điểm giao mới…', tuyen:'＋ Thêm tuyến mới…',
  xe:'＋ Thêm xe mới…', taixe:'＋ Thêm lái xe mới…', hang:'＋ Thêm mặt hàng mới…', nhanvien:'＋ Thêm nhân viên kho mới…'};
const NEWOPT = k => `<option value="__new__" class="newopt">${NEWLBL[k]}</option>`;
const opt = (v,t=v) => `<option value="${esc(v)}">${esc(t)}</option>`;
const loaiOpts = () => `<optgroup label="Pallet">${LOAI.filter(o=>o.nhom==='PALLET').map(o=>opt(o.ma,o.ten)).join('')}</optgroup>`
  + `<optgroup label="Hàng hóa">${LOAI.filter(o=>o.nhom!=='PALLET').map(o=>opt(o.ma,o.ten)).join('')}</optgroup>` + NEWOPT('loai');
const palletOpts = () => PALLETS.map(p=>opt(p.ma,p.ten)).join('');
const hangOpts = (c, withNew) => (HANG[c]||[]).map(h=>opt(h.ma,h.ten)).join('') + (withNew?NEWOPT('hang'):'');
const tuyenOpts = () => '<option value="">— Chưa xác định —</option>' + TUYEN.map(t=>opt(t.ma,t.ten)).join('') + NEWOPT('tuyen');
const xeOpts = () => '<option value="">— Chọn xe —</option>' + XE.map(x=>opt(x)).join('') + NEWOPT('xe');
const taixeOpts = () => '<option value="">— Chọn lái xe —</option>' + activeLX().map(x=>opt(x.ten)).join('') + NEWOPT('taixe');
const nvOpts = () => '<option value="">— Chọn nhân viên —</option>' + activeNV().map(x=>opt(x.ten, `${x.ten} · ${x.cv}`)).join('') + NEWOPT('nhanvien');
let CUR_USER = ''; try{ CUR_USER = localStorage.getItem('htlNguoiLap')||''; }catch(e){}
const defUser = () => activeNV().some(x=>x.ten===CUR_USER) ? CUR_USER : (activeNV().find(x=>/thủ kho/i.test(x.cv))||activeNV()[0])?.ten || '';
const defThuKho = () => (activeNV().find(x=>x.cv==='Thủ kho' && x.ten===defUser()) || activeNV().find(x=>x.cv==='Thủ kho') || activeNV()[0])?.ten || '';
function setUser(v){ if(!v) return; CUR_USER = v; try{ localStorage.setItem('htlNguoiLap', v); }catch(e){} document.querySelectorAll('.uLbl').forEach(e=>e.textContent=v);
  [nUser,xUser].forEach(s=>{ if([...s.options].some(o=>o.value===v)) s.value = v; }); }
function fillNV(u, tk){ u.innerHTML = nvOpts(); tk.innerHTML = nvOpts(); u.value = defUser(); tk.value = defThuKho(); u.dataset.prev = u.value; document.querySelectorAll('.uLbl').forEach(e=>e.textContent=defUser()||'—'); }
// Chọn lái xe → tự điền xe thường chạy (nếu ô biển số còn trống)
const dtLX = ten => LAIXE.find(l=>l.ten===ten)?.sdt || '';
function lxChange(sel, xeSel, dtInp){ const x = LAIXE.find(l=>l.ten===sel.value); if(dtInp) dtInp.value = x?.sdt || ''; if(x && x.xe && !xeSel.value && [...xeSel.options].some(o=>o.value===x.xe)){ xeSel.value = x.xe; toast('Đã điền xe thường chạy của '+x.ten+': '+x.xe); } }
const nguonOpts = () => [...new Set([...LN(NLOAI).nguon, ...NPP.map(d=>d.ten)])].map(x=>opt(x)).join('') + NEWOPT('nguon');
function keepSel(sel, html){ const v = sel.value; sel.innerHTML = html; if([...sel.options].some(o=>o.value===v)) sel.value = v; }

// Chọn "＋ Thêm mới…" trong bất kỳ droplist nào → mở form thêm nhanh (chặn sự kiện change gốc)
window.addEventListener('focusin', e=>{ if(e.target.tagName==='SELECT') e.target.dataset.prev = e.target.value; }, true);
window.addEventListener('change', e=>{
  const s = e.target; if(s.tagName!=='SELECT') return;
  if(s.value!=='__new__'){ s.dataset.prev = s.value; return; }
  e.stopImmediatePropagation(); e.stopPropagation();
  const prev = s.dataset.prev; s.value = (prev && prev!=='__new__' && [...s.options].some(o=>o.value===prev)) ? prev : s.options[0].value;
  const kind = s.dataset.add, preset = {};
  if(kind==='hang') preset.c = s.closest('#xLines') ? XLOAI : NLOAI;
  openAdd(kind, s, preset);
}, true);

const ADDF = {
  loai:{t:'Thêm khách hàng / loại hàng mới', note:'Hệ thống tạo mẫu phiếu nhập & phiếu xuất riêng cho khách hàng này (quản lý theo lô).',
    f:[{k:'ten',l:'Tên loại hàng (in trên phiếu)',ph:'VD: Sữa Vinamilk',req:1},{k:'khach',l:'Tên khách hàng / chủ hàng',ph:'VD: Công ty CP Sữa Việt Nam'},
       {k:'hang',l:'Mặt hàng đầu tiên',ph:'VD: Sữa tươi 180ml',req:1},{k:'dvt',l:'Đơn vị tính',opts:()=>DVT.map(x=>[x,x])},
       {k:'pre',l:'Tiền tố số phiếu nhập',ph:'Để trống để tự tạo, VD: PNV'}]},
  nguon:{t:'Thêm nguồn nhập mới', f:[{k:'ten',l:'Tên nguồn nhập',ph:'VD: Kho trung chuyển Bắc Ninh',req:1}]},
  diem:{t:'Thêm điểm giao / NPP mới', f:[{k:'ten',l:'Tên điểm giao',ph:'VD: NPP Cầu Giấy',req:1},{k:'kv',l:'Khu vực',ph:'VD: Hà Nội'},
       {k:'tuyen',l:'Tuyến giao',opts:()=>[['','— Chưa xác định —'],...TUYEN.map(t=>[t.ma,t.ten])]}]},
  tuyen:{t:'Thêm tuyến giao mới', f:[{k:'ma',l:'Mã tuyến',ph:'VD: T06',req:1},{k:'ten',l:'Tên tuyến',ph:'VD: Nam Định',req:1}]},
  xe:{t:'Thêm xe mới', f:[{k:'ten',l:'Biển số xe',ph:'VD: 29C-999.99',req:1}]},
  taixe:{t:'Thêm lái xe mới', f:[{k:'ten',l:'Họ tên lái xe',ph:'VD: Nguyễn Văn A',req:1},{k:'sdt',l:'Điện thoại',ph:'VD: 0912 345 678'},
       {k:'cccd',l:'Số CCCD',ph:'12 số'},{k:'gplx',l:'Hạng GPLX',opts:()=>[['','—'],...GPLX.map(x=>[x,x])]},
       {k:'xe',l:'Xe thường chạy',opts:()=>[['','— Chưa gắn xe —'],...XE.map(x=>[x,x])]},{k:'dv',l:'Đơn vị',opts:()=>[['HTL','HTL'],['Thuê ngoài','Thuê ngoài']]},
       {k:'tt',l:'Trạng thái',opts:()=>[['Đang làm','Đang làm'],['Nghỉ','Nghỉ (ẩn khỏi droplist)']]}]},
  nhanvien:{t:'Thêm nhân viên kho mới', f:[{k:'ten',l:'Họ tên',ph:'VD: Nguyễn Thị B',req:1},{k:'ma',l:'Mã nhân viên',ph:'Để trống để tự tạo, VD: NV06'},
       {k:'cv',l:'Chức vụ',opts:()=>CHUCVU.map(x=>[x,x])},{k:'ca',l:'Ca làm việc',opts:()=>CA.map(x=>[x,x])},{k:'sdt',l:'Điện thoại',ph:'VD: 0983 000 000'},
       {k:'tt',l:'Trạng thái',opts:()=>[['Đang làm','Đang làm'],['Nghỉ','Nghỉ (ẩn khỏi droplist)']]}]},
  hang:{t:'Thêm mặt hàng mới', f:[{k:'c',l:'Loại hàng',opts:()=>LOAI.filter(o=>o.nhom==='HANG').map(o=>[o.ma,o.ten])},
       {k:'ten',l:'Tên mặt hàng',ph:'VD: Bánh bao trứng muối',req:1},{k:'dvt',l:'Đơn vị tính',opts:()=>DVT.map(x=>[x,x])}]},
};
let AM = {};
function openAdd(kind, src=null, preset={}, edit=null){
  AM = {kind, src, edit}; const F = ADDF[kind];
  amTitle.textContent = edit!=null ? F.t.replace('Thêm','Sửa thông tin').replace(' mới','') : F.t;
  amBody.innerHTML = (F.note?`<p class="note">${F.note}</p>`:'') + F.f.map(f=>`<label><span>${f.l}${f.req?' <i>*</i>':''}</span>${f.opts
      ? `<select data-k="${f.k}">${f.opts().map(([v,t])=>opt(v,t)).join('')}</select>`
      : `<input data-k="${f.k}" placeholder="${esc(f.ph||'')}" value="${esc(preset[f.k]??f.v??'')}">`}</label>`).join('');
  F.f.filter(f=>f.opts && preset[f.k]!=null).forEach(f=>{ const s = amBody.querySelector(`[data-k="${f.k}"]`); if([...s.options].some(o=>o.value===preset[f.k])) s.value = preset[f.k]; });
  addModal.classList.add('show');
  setTimeout(()=>amBody.querySelector('input')?.focus(), 60);
}
function dongAdd(){ addModal.classList.remove('show'); }
amBody.addEventListener('keydown', e=>{ if(e.key==='Enter'){ e.preventDefault(); luuAdd(); } });
const noDau = s => s.normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D');
const preUsed = p => LOAI.some(o=>o.pre===p) || /^(PX|BB)/.test(p);
function suggestPre(ten){
  const w = noDau(ten).toUpperCase().replace(/[^A-Z ]/g,' ').split(/\s+/).filter(Boolean);
  for(const ch of [...w.map(x=>x[0]).reverse(), ...'ABCDEFGHIJLMOQRUVWXYZ']) if(!preUsed('PN'+ch)) return 'PN'+ch;
  let i = 1; while(preUsed('PN'+i)) i++; return 'PN'+i;
}
const ADD_SAVE = {
  loai(v){
    if(LOAI.some(o=>o.ten.toLowerCase()===v.ten.toLowerCase())) return toast('⚠ Loại hàng này đã có'), false;
    const pre = (v.pre ? noDau(v.pre).toUpperCase().replace(/[^A-Z0-9]/g,'') : suggestPre(v.ten));
    if(preUsed(pre)) return toast('⚠ Tiền tố '+pre+' đã dùng – chọn tiền tố khác'), false;
    let i = EXTRA.loai.length+1, ma; while(LN(ma='KH'+String(i).padStart(2,'0'))) i++;
    const x = {ma, ten:v.ten, khach:v.khach, pre, mau:PALETTE[EXTRA.loai.length % PALETTE.length]};
    const o = mkLoai(x); o.phieuX = o.phieu.replace('NHẬP','XUẤT'); LOAI.push(o);
    HANG[ma] = [{ma:ma+'-01', ten:v.hang, dvt:v.dvt||'Thùng'}];
    EXTRA.loai.push(x); EXTRA.hang[ma] = HANG[ma].slice();
    return ma;
  },
  nguon(v){ LN(NLOAI).nguon.push(v.ten); (EXTRA.nguon[NLOAI] = EXTRA.nguon[NLOAI]||[]).push(v.ten); return v.ten; },
  diem(v){
    if(DIEM.some(d=>d.ten.toLowerCase()===v.ten.toLowerCase())) return toast('⚠ Điểm giao này đã có'), false;
    const d = {ma:'DG-'+String(DIEM.length+1).padStart(2,'0'), ten:v.ten, kv:v.kv, tuyen:v.tuyen||''};
    DIEM.push(d); NPP.push(d); EXTRA.diem.push(d); return d.ten;
  },
  tuyen(v){
    const ma = v.ma.toUpperCase().replace(/\s+/g,''); if(TUYEN.some(t=>t.ma===ma)) return toast('⚠ Mã tuyến đã có'), false;
    const t = {ma, ten:`${ma} – ${v.ten}`}; TUYEN.push(t); EXTRA.tuyen.push(t); return ma;
  },
  xe(v){ if(XE.includes(v.ten)) return v.ten; XE.push(v.ten); EXTRA.xe.push(v.ten); return v.ten; },
  taixe(v){ return upsertDL(LAIXE, v, AM.edit) && v.ten; },
  nhanvien(v){ if(!v.ma && AM.edit==null) v.ma = nextMaNV(); return upsertDL(NHANVIEN, v, AM.edit) && v.ten; },
  hang(v){
    const c = v.c, arr = HANG[c] = HANG[c]||[], pre = arr[0]?.ma.split('-')[0] || c;
    let i = arr.length+1, ma; while(allHang().some(h=>h.ma===(ma=pre+'-'+String(i).padStart(2,'0')))) i++;
    const h = {ma, ten:v.ten, dvt:v.dvt||'Thùng'}; arr.push(h); (EXTRA.hang[c] = EXTRA.hang[c]||[]).push(h);
    return {c, ma};
  },
};
function luuAdd(){
  const v = {}; amBody.querySelectorAll('[data-k]').forEach(i=>v[i.dataset.k]=i.value.trim());
  const F = ADDF[AM.kind], miss = F.f.find(f=>f.req && !v[f.k]);
  if(miss) return toast('⚠ Vui lòng nhập: '+miss.l);
  const val = ADD_SAVE[AM.kind](v); if(val===false) return;
  saveExtra(); dongAdd(); afterAdd(AM.kind, val, AM.src);
  toast((AM.edit!=null?'✔ Đã cập nhật: ':'✔ Đã thêm: ')+(v.ten||v.ma));
}
function refreshSelects(){
  keepSel(nLoaiSel, loaiOpts()); keepSel(xLoaiSel, loaiOpts());
  keepSel(nNguon, nguonOpts());
  [nXe,xXe].forEach(s=>keepSel(s, xeOpts())); [nNguoi,xNguoi].forEach(s=>keepSel(s, taixeOpts())); [nUser,xUser,nThuKho,xThuKho].forEach(s=>keepSel(s, nvOpts()));
  fillNoi();
  if(!isPalC(NLOAI)) nLines.querySelectorAll('.pl').forEach(s=>keepSel(s, hangOpts(NLOAI,true)));
  if(!isPalC(XLOAI)) xLines.querySelectorAll('.pl').forEach(s=>keepSel(s, hangOpts(XLOAI)));
  keepSel(fLoai, '<option value="">Tất cả loại hàng</option>' + LOAI.map(o=>opt(o.ma,o.ten)).join(''));
  keepSel(lsPallet, '<option value="">Tất cả mặt hàng</option>' + [...PALLETS,...allHang()].map(p=>opt(p.ma,p.ten)).join(''));
  renderDanhMuc(); renderDuLieu();
}
function afterAdd(kind, val, src){
  refreshSelects();
  if(kind==='loai'){ if(src) src.id==='xLoaiSel' ? chonLoaiX(val) : chonLoai(val); renderAll(); return; }
  if(!src) return;
  const v = kind==='hang' ? val.ma : val;
  if(![...src.options].some(o=>o.value===v)) return;
  src.value = v; src.dataset.prev = v;
  src.dispatchEvent(new Event('change',{bubbles:true}));
}

/* ---------- FORM CHUNG ---------- */
const DEL = '<td class="delc"><button class="del" title="Xoá dòng" onclick="delLine(this)">✕</button></td>';
const NUM = cls => `<input type="number" min="0" inputmode="numeric" value="0" class="${cls}">`;
function delLine(b){
  const tb = b.closest('tbody'); if(tb.rows.length<=1) return toast('Phiếu cần ít nhất 1 dòng');
  b.closest('tr').remove(); tb.id==='nLines' ? updSumN() : updSumX();
}

/* ---------- PHIẾU NHẬP ---------- */
let NLOAI = 'BBTP';
function chonLoai(ma){
  NLOAI = ma; const L = LN(ma), pal = L.nhom==='PALLET';
  clearOCRMarks(nCard);
  nCard.style.setProperty('--c', L.mau);
  nLoaiSel.innerHTML = loaiOpts(); nLoaiSel.value = ma; nLoaiSel.dataset.prev = ma;
  nTitle.textContent = L.phieu;
  nSo.value = L.pre + String((seqN[ma]||0)+1).padStart(4,'0');
  nNgay.value = TODAY;
  nNguon.innerHTML = nguonOpts();
  nXe.innerHTML = xeOpts(); nNguoi.innerHTML = taixeOpts(); fillNV(nUser, nThuKho);
  nBooking.value = nGc.value = nDT.value = '';
  nSec3.textContent = pal ? 'Pallet nhập (tách tốt / hỏng)' : 'Hàng nhập';
  const ctH = `<th class="num tgc">SL theo chứng từ</th><th class="tgc">Chênh lệch</th>`;
  nHead.innerHTML = pal
    ? `<tr><th class="stt">#</th><th style="width:40%">Loại pallet</th><th class="num">SL tốt</th><th class="num">SL hỏng</th>${ctH}<th style="width:36px"></th></tr>`
    : `<tr><th class="stt">#</th><th style="width:26%">Mặt hàng</th><th class="num" style="width:11%">SL thực nhận</th><th style="width:12%">ĐVT</th><th style="width:17%">Số lô</th>${ctH}<th style="width:36px"></th></tr>`;
  nAddTxt.textContent = pal ? '+ Thêm loại pallet' : '+ Thêm mặt hàng';
  nNote.textContent = pal ? 'Lưu phiếu → tăng tồn pallet.' : 'Số lô để trống sẽ tự tạo theo ngày nhập.';
  nBBso.value = 'BB' + String(seqBB+1).padStart(4,'0'); nBBfile.value = ''; nBBgc.value = ''; nBBnn.selectedIndex = 0;
  nLines.innerHTML = ''; addLineN(); setDC('khop');
}
function updViTri_cu(){
  const pal = isPalC(NLOAI), t = nTuyen.value;
  nViTri.value = t ? `Khu ${t}${pal?' – pallet '+NLOAI:' – xếp theo lô'}` : (pal ? 'Khu pallet '+NLOAI : '');
}
function addLineN(){
  const tr = document.createElement('tr');
  const ctC = `<td class="num tgc">${NUM('ct')}</td><td class="tgc cl"></td>`;
  tr.innerHTML = isPalC(NLOAI)
    ? `<td class="stt"></td><td class="w2"><select class="pl">${palletOpts()}</select></td><td class="num">${NUM('sl')}</td><td class="num">${NUM('hong')}</td>${ctC}${DEL}`
    : `<td class="stt"></td><td class="w2"><select class="pl" data-add="hang" onchange="this.closest('tr').querySelector('.dvt').value=dvtOf(NLOAI,this.value)">${hangOpts(NLOAI,true)}</select></td>
       <td class="num">${NUM('sl')}</td><td>${dvtSel(dvtOf(NLOAI,HANG[NLOAI][0]?.ma))}</td><td><input class="lo" placeholder="Tự tạo nếu để trống"></td>${ctC}${DEL}`;
  nLines.appendChild(tr); updSumN();
}
/* Đối chiếu chứng từ khi nhập (giống bàn giao lái xe ở phiếu xuất): khớp → SL chứng từ = SL thực nhận; có thừa / thiếu → nhập SL chứng từ + biên bản */
let DCM = 'khop';
function setDC(m){
  DCM = m;
  nTable.classList.toggle('nobg', m==='khop'); nbbBox.classList.toggle('show', m==='lech');
  dcOpt.querySelectorAll('label').forEach(l=>l.classList.toggle('on', l.dataset.m===m));
  dcOpt.querySelector(`input[value="${m}"]`).checked = true;
  updSumN();
}
function updLineN(tr){
  const thuc = (+tr.querySelector('.sl').value||0) + (+(tr.querySelector('.hong')?.value||0)), ct = tr.querySelector('.ct');
  if(ct.dataset.t!=='1') ct.value = thuc;
  tr.querySelector('.cl').innerHTML = clHTML(+ct.value||0, thuc);
}
function updSumN(){
  [...nLines.rows].forEach((tr,i)=>{ tr.cells[0].textContent = i+1; updLineN(tr); });
  const R = [...nLines.rows].map(tr=>({sl:+tr.querySelector('.sl').value||0, hong:+(tr.querySelector('.hong')?.value||0), ct:+tr.querySelector('.ct').value||0}));
  const L = LN(NLOAI), pal = L.nhom==='PALLET', tct = sum(R,r=>r.ct), tth = sum(R,r=>r.sl+r.hong), d = tth - tct;
  nSum.innerHTML = `<div><small>Số dòng</small><b>${R.filter(r=>r.sl>0).length}</b></div>`
    + (pal?`<div><small>Pallet hỏng</small><b>${sum(R,r=>r.hong)}</b></div>`:'')
    + (DCM==='lech' ? `<div><small>Theo chứng từ</small><b>${tct}</b></div><div><small>Chênh lệch</small><b class="${d<0?'cl-thieu':d>0?'cl-thua':''}">${d>0?'+':''}${d}</b></div>` : '')
    + `<div class="tot" style="background:${L.mau};border-color:${L.mau}"><small style="color:rgba(255,255,255,.85)">Tổng ${pal?'pallet tốt':'số lượng'}</small><b>${sum(R,r=>r.sl)}</b></div>`;
}
nLines.addEventListener('input',e=>{ if(e.target.classList.contains('ct')) e.target.dataset.t = '1'; updSumN(); }); nLines.addEventListener('change',updSumN);
/* Phiếu nhập không còn ô "Lý do nhập" (theo mẫu Word 05/11/2026) – hệ thống tự suy ra từ nguồn nhập để trang Đối soát vẫn lọc được hàng thu hồi / trả về */
function lyDoNhap(ma, nguon){
  const L = LN(ma), pal = isPalC(ma), npp = NPP.some(d=>d.ten===nguon);
  if(/trả về/i.test(nguon||'')) return 'Hàng trả về';
  if(npp) return pal ? 'Thu hồi từ điểm giao' : 'Hàng trả về';
  return pal ? (L.lydo[1] || L.lydo[0]) : L.lydo[0];
}
function saveNhap(){ return truocKhiLuu(luuNhap); }
function luuNhap(){
  if(!kiemOCR(nCard)) return;
  const L = LN(NLOAI), pal = L.nhom==='PALLET';
  const rows = [...nLines.rows].map(tr=>{ const sl = +tr.querySelector('.sl').value||0, hong = +(tr.querySelector('.hong')?.value||0);
      return {ma:tr.querySelector('.pl').value, sl, hong, slp: DCM==='lech' ? (+tr.querySelector('.ct').value||0) : sl+hong,
      lo:tr.querySelector('.lo')?.value.trim()||'', dvt:tr.querySelector('select.dvt')?.value}; }).filter(r=>r.sl>0||r.hong>0||r.slp>0);
  if(!rows.length) return toast('⚠ Vui lòng nhập số lượng');
  if(DCM==='lech' && rows.every(r=>r.sl+r.hong===r.slp)) return toast('⚠ Chưa có dòng thừa / thiếu – nếu đủ, chọn "Đủ – khớp chứng từ"');
  const loAuto = 'L' + (nNgay.value||TODAY).replace(/-/g,'').slice(2);
  if(!pal) rows.forEach((r,i)=>{ if(!r.lo) r.lo = `${loAuto}-${i+1}`; });
  const so = soN(NLOAI);
  rows.forEach(r=>tx.push({so, ngay:nNgay.value||TODAY, loai:'NHAP', lydo:lyDoNhap(NLOAI, nNguon.value), diem:nNguon.value, chu:NLOAI, ...r, gc:nGc.value, booking:nBooking.value,
    xe:nXe.value||'—', nguoi:nNguoi.value, dt:nDT.value, user:nUser.value, thukho:nThuKho.value, anh:OCR.used==='N'?OCR.name:''}));
  OCR.used = '';
  const bb = DCM==='lech' ? taoBB(so, nBBfile.files[0]?.name||'', [nBBnn.value, nBBgc.value].filter(Boolean).join(' – ')) : null;
  STORE.addTx(tx.filter(t=>t.so===so)); if(bb) STORE.addBB(bb, nBBfile.files[0]); luuKyFile(nKyFile, so, 'NH', nNgay.value||TODAY);
  toast(`✔ Đã lưu ${so} – tăng tồn ${sum(rows,r=>r.sl)}${bb?' + biên bản '+bb.so:''}`, bb?4000:2600);
  chonLoai(NLOAI); renderAll(); xemPhieu(so);
}

/* ---------- PHIẾU XUẤT ---------- */
let XLOAI = 'BBTP', BGM = 'khop';
function chonLoaiX(ma){
  XLOAI = ma; const L = LN(ma), pal = L.nhom==='PALLET';
  clearOCRMarks(xCard);
  xCard.style.setProperty('--c', L.mau);
  xLoaiSel.innerHTML = loaiOpts(); xLoaiSel.value = ma; xLoaiSel.dataset.prev = ma;
  xTitle.textContent = L.phieuX;
  xSo.value = 'PX' + String(seqX+1).padStart(4,'0');
  xNgay.value = TODAY; xDon.value = xGc.value = '';
  xXe.innerHTML = xeOpts(); xNguoi.innerHTML = taixeOpts(); fillNV(xUser, xThuKho);
  xLyDo.innerHTML = LYDO_X.map(x=>opt(x)).join('');
  xNoi.value = ''; xDT.value = ''; fillNoi(); noiChange();
  xSec3.textContent = pal ? 'Pallet xuất' : 'Hàng xuất – gợi ý lô nhập trước (★)';
  const tg = `<th class="num tgc">SL thực giao</th><th class="tgc">Chênh lệch</th>`;
  xHead.innerHTML = pal
    ? `<tr><th class="stt">#</th><th style="width:34%">Loại pallet</th><th class="num">SL theo phiếu</th><th class="num">Tồn hiện tại</th>${tg}<th style="width:36px"></th></tr>`
    : `<tr><th class="stt">#</th><th style="width:24%">Mặt hàng</th><th style="width:24%">Số lô</th><th class="num">SL theo phiếu</th><th>ĐVT</th><th class="num">Tồn lô</th>${tg}<th style="width:36px"></th></tr>`;
  xAddTxt.textContent = pal ? '+ Thêm loại pallet' : '+ Thêm mặt hàng';
  xBBso.value = 'BB' + String(seqBB+1).padStart(4,'0'); xBBfile.value = ''; xBBgc.value = '';
  xLines.innerHTML = ''; addLineX(); setBG('khop');
}
/* Ô "Tuyến giao / nơi nhận" (mẫu Word 05/11/2026): chọn tuyến, chọn NPP, hoặc gõ tên công ty nhận */
const tuyenTxt = t => t.ten.startsWith(t.ma) ? t.ten : `${t.ma} – ${t.ten}`;
const noiKhac = () => LN(XLOAI).nguon.filter(x=>!NPP.some(d=>d.ten===x) && !/trả về/i.test(x));
function fillNoi(){
  xNoiList.innerHTML = TUYEN.map(t=>`<option value="${esc(tuyenTxt(t))}">Tuyến giao</option>`).join('')
    + NPP.map(d=>`<option value="${esc(d.ten)}">NPP · tuyến ${esc(d.tuyen)}</option>`).join('')
    + [...noiKhac(), 'Kho HTL khác'].map(x=>`<option value="${esc(x)}">Trả về chủ hàng / nơi khác</option>`).join('');
  updHint();
}
function noiInfo(v){
  v = (v||'').trim(); const lc = v.toLowerCase();
  if(!v) return {kind:''};
  const t = TUYEN.find(t=>lc===t.ma.toLowerCase() || lc===t.ten.toLowerCase() || lc===tuyenTxt(t).toLowerCase() || lc.startsWith(t.ma.toLowerCase()+' '));
  if(t) return {kind:'tuyen', tuyen:t.ma};
  const d = NPP.find(d=>d.ten.toLowerCase()===lc); if(d) return {kind:'npp', tuyen:d.tuyen};
  if(lc==='kho htl khác') return {kind:'kho'};
  if(noiKhac().some(x=>x.toLowerCase()===lc)) return {kind:'chu'};
  return {kind:'cty'};
}
// Chọn điểm giao → tự điền tuyến & lý do (đã ẩn trong "Thông tin thêm")
function noiChange(){
  const i = noiInfo(xNoi.value);
  xLyDo.value = i.kind==='kho' ? 'Chuyển kho đi' : i.kind==='chu' ? 'Trả về chủ hàng' : 'Giao hàng cho điểm giao';
  updHint();
}
function updHint(){ const i = noiInfo(xNoi.value);
  xHint.textContent = [i.kind==='tuyen' ? 'Giao theo tuyến' : i.kind==='npp' ? 'NPP – tuyến '+tName(i.tuyen) : i.kind==='cty' ? 'Nơi nhận mới (công ty / NPP ngoài danh mục)' : '', xLyDo.value].filter(Boolean).join(' · '); }
function addLineX(){
  const tr = document.createElement('tr');
  const tail = `<td class="num tgc">${NUM('tg')}</td><td class="tgc cl"></td>${DEL}`;
  tr.innerHTML = isPalC(XLOAI)
    ? `<td class="stt"></td><td class="w2"><select class="pl">${palletOpts()}</select></td><td class="num">${NUM('sl')}</td><td class="num avail"></td>${tail}`
    : `<td class="stt"></td><td class="w2"><select class="pl">${hangOpts(XLOAI)}</select></td><td class="w2"><select class="lo"></select></td>
       <td class="num">${NUM('sl')}</td><td>${dvtSel('Thùng')}</td><td class="num avail"></td>${tail}`;
  xLines.appendChild(tr);
  if(!isPalC(XLOAI)) fillLots(tr);
  updLine(tr); updSumX();
}
function fillLots(tr){
  const ma = tr.querySelector('.pl').value, ls = lots(XLOAI,ma).filter(l=>l.ton>0);
  tr.querySelector('.dvt').value = dvtOf(XLOAI,ma);
  tr.querySelector('.lo').innerHTML = ls.length
    ? ls.map((l,i)=>`<option value="${esc(l.lo)}">${i===0?'★ ':''}${l.lo||'(chưa rõ lô)'} · nhập ${l.ngay?fmtVN(l.ngay).slice(0,5):'—'} · tồn ${l.ton}</option>`).join('')
    : '<option value="">Không còn lô tồn – xuất sẽ âm</option>';
}
function updLine(tr){
  const ma = tr.querySelector('.pl').value, loEl = tr.querySelector('.lo'), lo = loEl ? loEl.value : null;
  const sl = +tr.querySelector('.sl').value||0, tg = tr.querySelector('.tg');
  if(tg.dataset.t!=='1') tg.value = sl;
  const av = ton(XLOAI, ma, lo), out = BGM==='lech' ? (+tg.value||0) : sl;
  tr.querySelector('.avail').innerHTML = out>av ? `${av} <span class="warnc">→ ${av-out} ⚠ âm</span>` : av;
  tr.querySelector('.cl').innerHTML = clHTML(sl, +tg.value||0);
}
function updSumX(){
  [...xLines.rows].forEach((tr,i)=>tr.cells[0].textContent=i+1);
  const R = [...xLines.rows].map(tr=>({sl:+tr.querySelector('.sl').value||0, tg:+tr.querySelector('.tg').value||0, am:!!tr.querySelector('.avail .warnc')}));
  const L = LN(XLOAI), tp = sum(R,r=>r.sl), tg = sum(R,r=>r.tg), na = R.filter(r=>r.am).length, d = tg-tp;
  xSum.innerHTML = `<div><small>Số dòng</small><b>${R.filter(r=>r.sl>0).length}</b></div>`
    + (na ? `<div><small>Dòng sẽ âm tồn</small><b class="warnc">${na}</b></div>` : '')
    + (BGM==='lech' ? `<div><small>Thực giao</small><b>${tg}</b></div><div><small>Chênh lệch</small><b class="${d<0?'cl-thieu':d>0?'cl-thua':''}">${d>0?'+':''}${d}</b></div>` : '')
    + `<div class="tot" style="background:${L.mau};border-color:${L.mau}"><small style="color:rgba(255,255,255,.85)">Tổng theo phiếu</small><b>${tp}</b></div>`;
}
xLines.addEventListener('input', e=>{ const tr = e.target.closest('tr'); if(!tr) return;
  if(e.target.classList.contains('tg')) e.target.dataset.t = '1'; updLine(tr); updSumX(); });
xLines.addEventListener('change', e=>{ const tr = e.target.closest('tr'); if(!tr) return;
  if(e.target.classList.contains('pl') && tr.querySelector('.lo')) fillLots(tr); if(e.target.classList.contains('dvt')) return; updLine(tr); updSumX(); });
function setBG(m){
  BGM = m;
  xTable.classList.toggle('nobg', m==='khop'); bbBox.classList.toggle('show', m==='lech');
  bgOpt.querySelectorAll('label').forEach(l=>l.classList.toggle('on', l.dataset.m===m));
  bgOpt.querySelector(`input[value="${m}"]`).checked = true;
  [...xLines.rows].forEach(updLine); updSumX();
}
function saveXuat(){ return truocKhiLuu(luuXuat); }
function luuXuat(){
  if(!kiemOCR(xCard)) return;
  const pal = isPalC(XLOAI);
  if(!xNoi.value.trim()) return toast('⚠ Vui lòng chọn tuyến giao hoặc nhập nơi nhận');
  const rows = [...xLines.rows].map(tr=>{
    const ma = tr.querySelector('.pl').value, lo = pal ? undefined : (tr.querySelector('.lo').value||'');
    const slp = +tr.querySelector('.sl').value||0, sl = BGM==='lech' ? (+tr.querySelector('.tg').value||0) : slp;
    return {ma, lo, dvt: tr.querySelector('select.dvt')?.value, slp, sl};
  }).filter(r=>r.slp>0||r.sl>0);
  if(!rows.length) return toast('⚠ Vui lòng nhập số lượng xuất');
  if(BGM==='lech' && rows.every(r=>r.sl===r.slp)) return toast('⚠ Chưa có dòng thừa / thiếu – nếu bàn giao đủ, chọn "Đủ – khớp phiếu"');
  const am = rows.filter(r=>ton(XLOAI, r.ma, pal?null:r.lo) - r.sl < 0).length;
  const so = soX();
  rows.forEach(r=>tx.push({so, ngay:xNgay.value||TODAY, loai:'XUAT', lydo:xLyDo.value, diem:xNoi.value.trim(), chu:XLOAI, ...r, hong:0, gc:xGc.value, booking:xDon.value,
    tuyen:noiInfo(xNoi.value).tuyen||'', xe:xXe.value||'—', nguoi:xNguoi.value, dt:xDT.value, user:xUser.value, thukho:xThuKho.value, anh:OCR.used==='X'?OCR.name:''}));
  OCR.used = '';
  const bb = BGM==='lech' ? taoBB(so, xBBfile.files[0]?.name||'', xBBgc.value) : null;
  STORE.addTx(tx.filter(t=>t.so===so)); if(bb) STORE.addBB(bb, xBBfile.files[0]); luuKyFile(xKyFile, so, 'BG', xNgay.value||TODAY);
  toast(`✔ Đã lưu ${so}${bb?' + biên bản '+bb.so:''}${am?` · ⚠ ${am} dòng tồn âm`:''}`, 4000);
  chonLoaiX(XLOAI); renderAll(); xemPhieu(so);
}


/* ---------- MẪU EXCEL TRỐNG cho thủ kho ghi tay → chụp ảnh → "Đọc từ ảnh phiếu" (05/11/2026) ----------
   Nhãn trên mẫu trùng với nhãn bộ đọc phiếu nhận ra (Nguồn nhập:, Ngày booking:, Biển số xe:, Tài xế:, Số đơn: DH-, Giao đến:, Tuyến:, Lái xe:);
   tên hàng của loại hàng đang chọn được in sẵn để thủ kho chỉ cần ghi số. */
function mauExcel(kind){
  const B = 'border:.5pt solid #000;', H = `${B}background:#e11b22;color:#fff;font-weight:bold;text-align:center;`, TD = `${B}height:26pt;`;
  const c = kind==='N' ? NLOAI : kind==='X' ? XLOAI : '', L = c ? LN(c) : null, pal = c && isPalC(c);
  const head = (mau, title) => `<table style="font-family:'Times New Roman';font-size:12pt;table-layout:fixed;width:700px"><colgroup>${[45,95,95,95,75,70,70,70,85].map(w=>`<col width="${w}" style="width:${w}px">`).join('')}</colgroup>
    <tr><td colspan="6"><b style="font-size:14pt">${CTY.ten}</b></td><td colspan="3" style="text-align:right">Mẫu: ${mau}</td></tr>
    <tr><td colspan="9">${CTY.diachi?'Địa chỉ: '+CTY.diachi:''}</td></tr>
    <tr><td colspan="6">${[CTY.mst&&'MST: '+CTY.mst, CTY.kho&&'Kho: '+CTY.kho].filter(Boolean).join(' &nbsp;·&nbsp; ')}</td><td colspan="3" style="text-align:right">Số: ................</td></tr>
    <tr><td colspan="9" style="text-align:center;font-size:18pt;font-weight:bold;color:#e11b22;height:34pt">${title}</td></tr>
    <tr><td colspan="9" style="text-align:center;font-style:italic">Ngày: ......../......../20......</td></tr><tr><td colspan="9"></td></tr>`;
  const DOT = '..............................';
  const info = pairs => pairs.map(([a,b])=>`<tr><td colspan="4" style="height:24pt;white-space:nowrap">${a}: ${DOT}</td><td colspan="5" style="height:24pt;white-space:nowrap">${b?b+': '+DOT:''}</td></tr>`).join('') + '<tr><td colspan="9"></td></tr>';
  const grid = (cols, names, n) => `<tr>${cols.map(([t,sp])=>`<td colspan="${sp||1}" style="${H}">${t}</td>`).join('')}</tr>`
    + Array.from({length:Math.max(n, names.length+3)}, (_,i)=>`<tr>${cols.map(([t,sp],j)=>`<td colspan="${sp||1}" style="${TD}${j===0?'text-align:center':''}">${j===0?i+1:j===1?esc(names[i]?.ten||''):j===2&&names[i]?esc(names[i].dvt||''):''}</td>`).join('')}</tr>`).join('')
    + `<tr>${cols.map(([t,sp],j)=>`<td colspan="${sp||1}" style="${B}font-weight:bold;background:#d9d9d9">${j===1?'TỔNG CỘNG':''}</td>`).join('')}</tr><tr><td colspan="9"></td></tr>`;
  const ky = arr => `<tr><td colspan="9"></td></tr><tr>${arr.map((t,i)=>`<td colspan="${i===arr.length-1?3:2}" style="text-align:center;height:34pt"><b>${t}</b><br style='mso-data-placement:same-cell'><i>(Ký, họ tên)</i></td>`).join('')}</tr><tr><td colspan="9" style="height:60pt"></td></tr>`;
  const tip = `<tr><td colspan="9" style="font-style:italic;color:#555;font-size:10pt">Hướng dẫn: ghi chữ số rõ ràng bằng bút mực đen, mỗi ô một giá trị; không ghi đè lên chữ in sẵn. Ghi xong chụp ảnh thẳng, đủ sáng, rõ 4 góc → bấm "📷 Đọc từ ảnh phiếu" trong phần mềm.</td></tr>`;
  const line = t => `<tr><td colspan="9" style="height:22pt">${t}</td></tr>`;
  const names = c ? (pal ? PALLETS.map(x=>({ten:x.ten, dvt:'Cái'})) : (HANG[c]||[]).map(h=>({ten:h.ten, dvt:h.dvt}))) : [];
  let html, file;
  if(kind==='N'){
    html = head(L.pre+'-NK', L.phieu) + info([['Loại hàng',''],['Nguồn nhập','Tài xế'],['Biển số xe','Điện thoại'],['Ngày booking','']]).replace('Loại hàng: '+DOT, 'Loại hàng: <b>'+esc(L.ten)+'</b>')
      + grid(pal ? [['STT'],['Loại pallet',3],['ĐVT'],['SL tốt',2],['SL hỏng',2]] : [['STT'],['Tên hàng',3],['ĐVT'],['Số lượng',2],['Số lô',2]], names, 8)
      + line('<b>Ghi chú:</b> ...............................................................................................')
      + line('<b>Đối chiếu chứng từ:</b> ☐ Khớp chứng từ &nbsp;&nbsp; ☐ Có chênh lệch (lập biên bản thừa / thiếu)')
      + ky(['Người lập phiếu','Người giao','Thủ kho',L.ky]) + tip + '</table>';
    file = `Mau-phieu-nhap-${c}.xls`;
  } else if(kind==='X'){
    html = head('PX-'+c, L.phieuX) + info([['Loại hàng',''],['Số đơn','Lái xe'],['Giao đến','Biển số xe'],['Tuyến','Điện thoại']]).replace('Loại hàng: '+DOT, 'Loại hàng: <b>'+esc(L.ten)+'</b>').replace('Số đơn: ...', 'Số đơn: DH-...')
      + grid([['STT'],['Tên hàng',3],['ĐVT'],['Số lượng',2],['Số lô',2]], names, 8)
      + line('<b>Bàn giao cho lái xe:</b> ☐ Đủ – khớp phiếu &nbsp;&nbsp; ☐ Có thừa / thiếu – Biên bản số: ....................')
      + line('<b>Ghi chú:</b> ...............................................................................................')
      + ky(['Người lập phiếu','Lái xe nhận hàng','Thủ kho',L.ky]) + tip + '</table>';
    file = `Mau-phieu-xuat-${c}.xls`;
  } else {
    html = head('BB-LX', 'BIÊN BẢN GHI NHẬN THỪA / THIẾU HÀNG')
      + line('<b>Thời điểm phát hiện:</b> ☐ Nhận hàng nhập kho &nbsp;&nbsp; ☐ Bàn giao cho lái xe &nbsp;&nbsp; ☐ Giao tại NPP')
      + info([['Phiếu nhập / xuất số','Loại hàng'],['Nơi nhận / tuyến','Địa điểm lập'],['Lái xe','Biển số xe'],['Điện thoại','Giờ lập']])
      + grid([['STT'],['Tên hàng / Loại pallet',2],['ĐVT'],['Số lô'],['SL theo phiếu'],['SL thực tế'],['Thừa (+)'],['Thiếu (−)']], [], 6)
      + line('<b>Nguyên nhân:</b> ☐ Đếm sai &nbsp; ☐ Hỏng / móp &nbsp; ☐ Thiếu từ nguồn &nbsp; ☐ Nhầm lô &nbsp; ☐ Khác')
      + line('<b>Mô tả chi tiết:</b> ..........................................................................................................')
      + line('<b>Hướng xử lý:</b> ☐ Trừ tồn theo SL thực tế &nbsp; ☐ Bổ sung / giao bù &nbsp; ☐ Trả lại hàng thừa')
      + line('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ☐ Lái xe chịu trách nhiệm &nbsp; ☐ Báo chủ hàng &nbsp; ☐ Khác: ...............')
      + line('<b>Ảnh / chứng từ đính kèm:</b> ☐ Có (...... ảnh) &nbsp;&nbsp; ☐ Không')
      + line('<i>Biên bản lập thành 02 bản, mỗi bên giữ 01 bản, có giá trị như nhau.</i>')
      + ky(['Lái xe','Thủ kho','Người lập biên bản','Đại diện chủ hàng']) + tip.replace('bấm "📷 Đọc từ ảnh phiếu" trong phần mềm', 'đính kèm vào phiếu xuất (mục Bàn giao cho lái xe)') + '</table>';
    file = 'Mau-bien-ban-thua-thieu.xls';
  }
  const XH = `<style>td{vertical-align:middle;white-space:normal}@page{margin:.5in .4in}</style><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Mau</x:Name><x:WorksheetOptions><x:FitToPage/><x:Print><x:FitHeight>1</x:FitHeight><x:FitWidth>1</x:FitWidth><x:PaperSizeIndex>9</x:PaperSizeIndex><x:ValidPrinterInfo/></x:Print><x:DoNotDisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->`;
  taiFile(file, html, XH);
}
/* ---------- PHIẾU: XEM / IN PDF / TẢI EXCEL ---------- */
let pmSo = '';
let LOGO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAaYAAACOCAYAAAB6+azsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAIdUAACHVAQSctJ0AAHZkSURBVHhe7X0HuB1HdfAzNRCMsaT37s7s7rR9ko3oOKZ3AgR+SCCE3gyYXgPE9Bqc0EMAQyghgdACpgfTQmx6s8GA3GTp7s4+dVmyJEvu0vu/M3vn7ezZmb33CSHdJ9/zfefbnXPOnJk5MzszO3Vq6iiH+ampY/JIPaKg4k1FT3ykiMS/F0QZ1FR9oh/LjxSxOKMfyw9bnCPqQyUV/7CB0hTrGwXWEXXvgsovF7HYXMTqQBmr+YKK63XEr9GRvKqI1RWa8t0lUbsKKrYXlG8tiNjcj+ScQSrXAeZEXlxSuaYkck0Rqd/qnvqNJvxXmsifa6J+WsTixznl5xRU/l8eqe/pSH1HE/mtksivF0R+vYzlFzUVXyqi7HM5VZ/JE/5pTeQnIe0lVR8tYvnhgrAzNOUfKIl4X9Fj790QidPLSP1TSdWbSyreMEfka3UkX5FT+cqSyBeXlL9QE/HcvMefpXv8lLlIPjWP1cPLZUmM7TCBCnLOb6Np+igdyXeWUC566leaZrokYndJxHU6VvNlks3DM4/VvCby2nJGXK178qqc8j0lFbuhvBSEXwZlRVOxpSBqI5SVgsr1JZXrNFGXaCr/kBP+u7Knzssp/2VB5M9zKn6sCf9BGcnvFlR9uyDiG5qKM+eI/HxJ1Jma8g8W0+xe8J3geA+Di2+1akU/Su43F6vnaSLflff4pzSVX54z5U98oxwgvPvcLq2Lh2m+5zAafvfRcFxw+K7bR+/Sj3V20THPF05J5XdLIj9SEHVvnC8TGGNYOzt786LHHlQQ9asilrqI5baCyp2aqsstFhUCbUfhoKbZDh3LrXkk1xU9+Wysuwv6PfHqPJKljuUeHStT6QzwACA0VDrO9hex3K9jdX1B5fVGjgLKazVV12oqrymovKak6mptUMLzqpJmV2mqriwAY7WviOU+Hcu9OlZ7NVVX6FheoU2jp/YUVO7RVO6uMNsFWKJ054O0G4zVZQPcPsBtZZxt1XG2taBqi6bZFk3V5pKqTYAFVRs1lRs0VRt0nOmCyrWaql9AYz8X8Udgu9zQYG5ZnOQ9+ZaC8u8VVKzRsSxLsCuVuyH/IK8LqqAMHCjjqlGyCGWkoAOMpSkrA7y+KifquoLKQXmR1zhoyglgQaVbTvZqKq8ooHxAuYjl7jloBKn4cUnEw+ZXr74Zjj+GYsWJpB+Jp/eJ+EgZi2/qRP5Cx+oiTVWuqdpkygxVl5dU7S6pgrK3B8phhfbdlEkvgp/aX9vtQx/fR6vQpQ/iFcs9ZewPpyt8N31Wri1fp73JG8hCuIOwS08YzXCcOMVqL+RdQeW/bSTZXeen7n8TN582rKCrip54qe6Jjxc9/rU84j/QRP5ME3FuGYnfaCJ+C1gOUBOGENNd2Ypev1s6P19H/LyCyM9fkqycdFC7IKf8njmVazbH2fyWJJvflGTzGwHjECrz3ATvSTa/OZmd35mshN7rz4seeyTW74Oc8icWRPxhRzJrdOAKB9yAc4Mn/ElhBF4TgWaxcm+IM4OWbt1NtPQqXUG0dgEbQfoHtsII9rDPCsGu9pnNbwM+pBcaSKp+1yfiw3qGKWyjoxHcv41+L757ScR/lER9v4CGPFbz2wa2MmVwkD9Ax2XDdfvotvzgMlOXnbo8NMsN0AaYZPP70lXzORHfzGP+wK3Tq2/VTE0Fa6ambqYj+bh+T51REPmpkqrvaqIu1lTt0rG8fnMC6Zqd3zooAzZtG+PZhTJo01q/O/FoIS6/tb9aj99PUwbLYj4KKwn5mR1gm+fVg+TatoD3+luEcOGbq3g4fv6wLjNlaBZGX06fi8Wd5qced2PIq8293p8XRL54PZGfLqg8p+osyD0FkdeVVJrvckuczW81qOa3GcwMgruNVs7KVE8rb98t7jB1nZwvIvFGzdjxuCxNwAFN1TOuTFeayhx/7L6P3v3wrRsKjumJEvEhrN8HOeVf07E0hcgXRl2xtButhoynUcM4asWGsStsnXhoHbp9aQObbU9mq/hR+bkykiefPTXV6NUdjQAdoSISpxdEnLU1UaZTAxV23QmpbOXLf+zGdB+vC0N+oILbBXSqPqN72e1wGgBykj06j7PXFVS9L6fyPE3V/GWmUsxMIwT5Cw1d1Ri20xWKQ/jdH3+sB9N8fJeO9YV4XXiw/nx+fXGs34eHA52bgsrLcyLfoo+rK38dqb/IqfoENEZbk6rxgo5iM5/ceLnYzLu2XDu+PoRG1Yy63EA6ogcN649Xx2kiXwuZhDMcu7HRmzRleholUf+Nw/BBTsV50Hvw6W3rbhaKBm+go12osI52OkLoCwdjHW4zzl3+QumAj2JXuhI+pq/MxfKO2FZHC8xPTd00X8HvkhPxv1eks6ZicD/62k5NmmtjbLsFGSc/WrwheYPzBRolHcv9ZY9/z63YAODvKO/FDygIe0oRq4uuYqvmd6VVBWcrt7b+cNhuuF3vIfTJYB0uvSnT1oflQugLt8HzfNvD3hvyHf4xujwY9cmp3Jr3+Ftsnl20fPmx+Ux8j4Kq713PTjB/rLi+8KEvjZbWTEOI3nyvOl4K6sgL8bDiBBD0o4gXRLwPeu44Y7BxfXT3eVm8cl5H2VdwGBjmp6ZupGN5LlRMuAfkC8/NcPOH5Cm0uGDgRgrHF2MlY/nttGH9DX8QHydOobBcN9YHz73pyvk+Ee9Z1+vNYJstddg6PX2rcpr/lSZi085AWWvYCuWxazPX7XvH2MVzZQDNHzwVV2uS/sCNPwxBXkjpcj2T/rWO2OXQqYIKbjAfuqiwcJg4HYvR4UOf3hC/wibPJxvW0c4H1w9++mjNuLTDwv4wWjpMMfQjefn6GfkKm28XLT/hWE35KQWVc5ens2ZOEvsLhY/d2B+Ww37xE4YWS5rtmuupM9aMMFd5g4azp+5/k4LKF8FcT23k7ozwZUj1QZuC8Ukchg90zP8Xxt7n3Ap9xMqoTQvR2zSX15Zr+/H59/ldcHvS0IVNXWp+M83m1/fkW7G9ljJctmz21n0intsn6qpNcbtRCtkT292HbkcF5wXGrjwFND1aWCxBxDdwGsokmc2pfD/Mf9nvw+rBujANh9vEbj/YXyOcQCfNdft0d+r00Hz8CsHdTp/PT9vvgPZHfC9NOgyHi3lohGyewZxgHvHXwyKaQSeioWNYfF03pmE+pmF/8ISOeEHV78okWXYwKztvcJAT9ZjttJp8xMb1GdmXGTBmq6kqNFEvx/p9oCP+Ck3l3GXJypauLrQfI46LrzHFMlgXlg/57UIruxg/rj9Mhw5CTuWnNhKyAttsKcLaZbO3Loh8dk7Vle44vtsJsPbAtvDRsXsYr5GvngbMPs2iB5pBx+qzly1bdms3DZqo+5glyE68Q3rccLv4TVkfrV2mXb2Y3oXD5NtxbcuMiqPEb1QZTAvRIb7b09n5dTP8SfNTU+ZPBLYdzBH1Mlh9GypvWBd2Y7prJ6wL812/ttxVIwXyN27ZmkAH5Mfx2+Q99cycqk0wEQ3zHTvT2fkdg3mA7YOVZIAw5AcIdOBfnq6c31PNj1yrCX8rDNlg/T4wv9g9dYom8je7E9BT6arCq1Ywwbg9IDR6LlYr3OqeK8aFgtLRG/MVMNdv+72tw6cP0xv8jvhYGUibjtUlOuIvwDZbijAX8b8tidhWrbx0P+LmB43tgG0TQtfuoTywdB/P8i9Psvmc8P/S02nmxl9Pi4cWVH63iNV+3OsOVXhYPw4Ly/hoo6IvbdhtadhvSN4na2ScDmFIvnq3Mu2wsE5Mc3nDvhcYRoV6ABYUwKgPzJdDnq2dmrr5uhn+5D5RO9x5P5+tGuGheGOan16Vg7a+Whaeg7KzK6fig275msAQ+FmS3GI9lY/URL2spOpNRaROL4l63xxVH9dUflZTdSZshC2J/AKsVMqp+DhsFCyoOh02lxZEPmUjUQzr7QIoSP1I3K8fiecVsXp1GYu3F1R+VFP5lZKq72mqztFE/lRT+QMH/6+iibWbaGYaM1MwB2PH+G+qWVia9IWC6ulJ+7CrAA7DkF5Mh6WyBZFX9nvsw9heSw3yFfzhRY//Clap4XT60u7SQ7wu9Pnz0TDuSFbC8t2vlFFyshv/spfcXsNG21jth1WDVo/bGOH8D4XXpte6wjJtHua7dBwXjK7fhbR0VP5YHofvoy3QB6tW2zx4hsPswoU4D56QJ7BXsaTyo/CHtFDuzCEB8kLo3LbDb8fZdWN5HHaNYZvjRgme0IkvqPzO+hVylVvGJrAImJ/ifwaNRj7No3I6mS0TeQdN2Emw3HID5Xcue+r2l05nsxvJqhW/PY7fZs1UPZG3iLHThhwsiIAhlM29VRIqiLkef8BGIh9SFTL1YMC5WD1IU/mXsCm1iNnT1kXyn0uiPgWbIOHPyhSCQCXoL1wDmvMR+WRcWcz3FcxR0advMM8xX/TEZ137LDUok+QWeU9+bMfg48XptOnHtFF4NeK88Fc62F9Fq+SgR10QdXHRUw9qxH8quYWm4r/KWF07+It1Js39YQ0LE6PVheWG+fXRKmz668IFPSM2TNa9WBrmV7ZrhzUKunrgO6k2V8tzLk2SWZtvG2b4PTWV39mZVlMEvnjYd+zGYbjhhuk+WkvXgX0wqkRGm3+fwFEAUIHk8DcXy+tgjixUiFBBWRS6/gIFr8XzuX2ybXk1vwkWkfTk0NWN4wz9SD1DU3UBDP+66fPZAdNC/Mb7iB2QkB+wc1W5yX0lkc9e42yezTn/MzhGCmQGf0oLJ07gRgnnYTMeFYb8YXk3zqE0YJkufV28YbpDvBCG4hsK37VHm9emYTrsVdJUXpDPyCfbfJufmrqxjsRnthu9TX++sHyNMpbpooXshOmm8xOr/SVV/7TwgUzg6Id1hMF5e+fgJe+4wIQQFyT77ivMPn8hmlvwse6mn+Y7/P3lhH8dp3MpQUHVj8zco2d5rn3H9q1pfntixL1Vl4Z1YxysIr26IOLLGwm5ZSPuPfagzR5dGLHOZjzacjhtPsSVJdYRQiyDw6/DbevDccS6MfrkcXghxDJY3tUXokPe5VTs1xF7h5tvejp7uqbqItNoWX8Be3blAw4bI07rMHmIT0nV1+Zm+D3c+E7gBgBFrM7YnQ6WvDtzRm5hWnjHhdXTc7J+fIWv6x0XeFyIhyH04mGBR0H513AalwqUU1O3gIbJDqe4dgjZxGcfLBOSw7I+GdtDt26zEbOnLsBxhyG9gqhL7ApVn64uejO8puwwP7XfdpqxDlfGpYUQh4H1+94PRsbH88WvdrdlfTpchIo+p/zf1hOyMKf9ZtgbSeXvq72R7XCxjhB9FBpOh0vDfgFhAzYcYtAsaRO4QYCO1Yegh44LR1ch8tGxDC5kB4v4A6zpzTChYdoEh4YS/iWcxqUAMMdYROw/4Pwxs6FwSOXg8qqnfW/nQeh9sQgLZkqa/frS49PGUUN6eUo1ke+GjsEw/TguXfLD+JVMnWbsz+fXT2vasAutf6ynK7w2r3a3ed3YJdv1rVSLg8QlOeGPtvkGm1X7cFgulVd3bXk5FOjG200zTk9tL+gEifmSsEUdcD2BowSqP6aVrYLkw6oQ4YLUlmvK1+/4I8SFchj65I1OONamGjs/oAn/NE7jUoGciLXQuGJbhdK9kH5P5YbdDXsF8qD53tQ9ONNxR0nY21vxpvyFRSy2NZaF479rT2WMy04ozg2ZwfJ5TO9CNx04/T4M26Tb3zC0afbFH8fLZ6ODCd/qgYNRdZQ+3w6/Vlf1RLftE3l5dZRUN+K4YR6mLdBbqzLburEewKq8if/BKz4ncAOBgsr370nDe5swhgogpvnQLXi4MLs935C+LjqcpAw9vyKSH8VpHHeAlZVzsVpZULnNrpLEGLILtqXvHfvFdJ9eLAdn9JWEfzHv9YQb97mZ+I6aym/ZoaCQruZxVSGZpn+frmZ8m3yfPMa6cmzaqUuHz0ajfi8+DPn1h+PPo/p7aetw3YMDpg+URPw8J/xEm2/remoGVk/CtSiwyADrdt0YcXx8cbQ2xn5dP9hdo6rOgyTiJXD6iVveJnADAJ2mtKDyq7ApeFhh7EJcyLrQV4grusU2z/Ubeq/2ZkhdUvUPOJ3jDuuVOq6k8h1w5xUcPeRLf8guLh3b1rUnthdGrNeVNZuyiVyvI/Y4HPeCiPfCHUkgY+WxDqwP00IYknXT66N34cE0TNZflzuEYX1tuj8vfLQ6HdgPljULHkzDxJ/kLlbRRD4E7uJq+x+eNtePfW9i2w/GUJwX3qnaj7ciTOAGAObIGyr+RcfSnC7QXXDaBQvL+Oi48Hb5ceW6ZEJoeuxU/s+GaX5nnNZxh4IxoonYUm8+bNvBZxOfTG3nto1cGZ9fLGsR7srJI/nKNeh0kvUz8o5wH1l1XqQ/XBwOjgMOC2OdHng2w8D+fW4cDnZjrP34eG0a9huSGxamfTbT25ZtYjN92A/EA5Zb96m8oNEopWlWEHEGbLDH9ujaTlDr9dsT6/LJY8R+B7bbX0Ty5zCK4Ja3CYwIMAQDE4hwk63ZwzHGCAUTjjOC3vlm8xvPXw837po/DfQxdRWkxWBd2Jof+yj6Q4U8xIPztNZF4p9xHi0FgA+wjPh1eEjFTS+mNWwxOAcR8xb4qCLx0X1o86zosQKuRnfjbPe+FFRe4evYtPXU4WLeMLqP56NjGezGNB9/FN2VvH0fTd6GgWmYbt8rnW1ZLN9FH4wibNNR+nSoo2ze6Vg+rqBy7yj6R7HJMJ6PFgpjsAjjujzmL59cCLhIWDs1e3NzwsNyfuJcxB6rI/U8uN2xJNmLS/McE0zki0sqX1TQ7FUlVafnVJzZJ6LUcXY99KTcMWBbUNynr1BVvApxYcNyPsT+fIgLrX1idHWazbWRejPOq3EHOCWkH4k3QzrcC/8qbNsCp32BPmic7Lsrj/27frGepmz1nlN+yvblJxzrxtusxKNqi+3YYD1d4WA534IGN61YV4OHGmWffAhDctgOw967aBXdz7M0Hw/LDKNZuqtzazzbWtq/fkb2CiLe4y4PD6HVV6Gl+fj+eHWl26W74cBfXJ+Iq3WvufJzAgGAv6M+EQ/TPf5TTWSpY1XAXSXw11HAzYo022FuWGxgRav41o3RkY8zI4vR+m3T7HutZ84J08HL4Qh7TdVV0BjZ65Rx4cCFyy1AXYXJV/iwXuzGdMwfRnPpgxU8Ou/xZ+J8G3eAI6tyws+HtHTdhNyFXR0FnD+2ssB07HdwdM1+HcuLYejHjfMGSpdvoPJjJc2u8i0zrnRjd7scuHF0n1jG6qvj7tc5DGt5f7nGOvE7dvt0Y5lRdbu6MGI9mO+RPQArbXOqfrEpiribd/mMepIm6oLBcVGOPtfO7Xj7wvXRQ+kKvbtor0/RRJ47+VsaAeanTrrpepLep6Dy93O02qhWneI9a06/HYZQcbpu6GViGR+CP+zXr68dD1fG6BlMhLqVX6iA1PxmgcOFq8u/r0CH5C0dP7veXbe5rwUOzl0WJzjvxh1KkjyshPtwPHZpYzv9Pju7tgm5h/Gg3BSx2lcQ8RJ3iTE8zVmQVO3yNYhNvd3510XH/tweO+YNe8cYspnLw/RR9GI5V9coerGMT75Jq+zi2gSeV5hbC8TvcsIfg8tbEcn3wybpBXvav2wUVxwmpmF0deBygcNoytV6oczBQpqiJ06HMyNx3CeAoPoQxenQGA0bT3czCtNCiGV98wW4cOACibEpO1zGut1C05JfxJCJj4/drhz+uFzEfjDCBmEdZ0/H+TbuABef6Yi/vjpFvJ0ujL78DtkKv2N/WAcOB/a2lFSuK1Yw4sYZerIwbA2dK9+cWB1Wd5ywny5am4/dOGzfe1uuGUabj/VbHnZjWoMXGFbFGOI349hMjy0PFjckan4XyFB5HqzCWzs7tTCvBJBP0zsXRHwfrspZ0Ok0GhWtDgOH24VuPGz8Fvx6Tkx3ZS1tC7wT2S9n5B2+ODV1YzfuE/BAtYpFfl4n2YFRh1t8mYBlQvy6MOPC6Ops8jHi8Lv4rn4cTkMGrdgJvfvcYXpViC1amS7dGOGsv7lY/S3Ot3GHvMcfWBB5dnXgqU1rO32YHrKNa7cQfRSshkbVrpLwf2vFmWb31LHqt+KDTppfTJghOV9aMA+jz08Vl7a/5rtfD8aGH8/fBpbtapjcuGJeQwcKo3qv4gwIfxrQadZEXq0jcbbupY9yby6woAl/S0HlZvNngvT74uQ+hyHWMYr/Ol1VOmBUp4z4T3G8JxCAC1cwUkTidDCer5fYhb6C5UMfvy58g0z2/Em5/jFtMegL38fHMjhuWAb7s+nBdKwP03w64d3kB1G/g9tScb6NO+SRen5B1V7fPE1X+kfBUFlp2rFCLFOdQK1+tz5KTsbXscD9YfvSVU5+tvMG6/Mh9ofpIb4rh2kVvV3mQjiM35RrymK/2I5uHMwtv2Zed3DjL+BgiN3SK6wm//HTop0bNvTBML05gZvKKwoq15Qz8gt4TsmFIuY/gstLffEMpcuHvm89pAN3Zht6Fmw0GDqmcqcm/EM43hMIAPxWrp9O76OpvMY2TL4M9WUApvncocy1mYblMIboXejz46MNQxwv7A7JYj8+uaZMW585Hw8KdCSfik+6HndYMzV1M5gXu7w1Cd3Me5+9fO6239pf1zvWb3quNJvXUfv6kHUr1MqCqDOgd27u9IGNmwMd9YpCu7qw0mURaDW9Kd/006T7EM+T2rjb+PvS57MRpvvQ6vMh1oHdFuFqGTiVpEZl8SpYQGIWJXkQeJZfDPyWxl92pY7VFQVVV2qiNuc9+dHze70ZnF8WoHPRX05PgM6GOVHBE0dfGnB6cCPTZeMQYnn7DqMeBVW/XDet7o3jP4EOWJMky/qx+iIUKOi9YIOHDO/SfBmCecPoPmx+0O3wK+zihbEOv+nG7z4cNbw63h6a0zvDOkEehsFyyu+C82vcAfYFFUR8G185gu2CaRhxJYP9NO3VzDtsU0CwZ0HlxoKKN+I4l5Q/sYzlb8t4tizjbAv0cAuq9mki9m+i0lw7YhH0wOKgCu1ioZrvoo8HNEvHuuBpr5zH6cFpcm1Ry1rs/iZC9C50/1QH+4j2zNHsszmVr89j+dr1VL6+oOJVZntJIl9YUhfVM0uinlQS+WSEzzY3ZBN1WpGo0zbEs48rlyUxLBAAhL2U+M/WBehYw4KCgsrtdhgvlDZsQ8zvQteew+zqhgF5sSOenZ+L5JK+5POIASyC0ET9EFbm2Y8DJhzNr7azis78ZqPfcThqxv0t9yH8zmOaRevflal1t+UNmqGCpnxjOMAJt4kVH/4OcUELFTZc4DANF0afPH7Huip6hdad98TVfSpOwHk17lBQ8SYdq8vc8X5sgxBWtmnaEcv40Gdf7BdOcciJ/NTWqeYpDwBwDbdOZ7MyyWZhU/AGKlfB+Wt5xG9bRGy1TrPb/akRwtpAV965pOINRSyD9sPpaqbdX758DZ3Lx3p8ctYNHY4yVrAI4cmbotlpWDRi7MfY8TuVOg5OXtl+wgnHwv4wQHDDpYvw549x6/TqW8GZceAfcLGjAwempm5eULnOLGhZRDpw2g8l2vAAq2Xicl4TcQaO+wRGhHyaw8qW92oif6+p2g6/0gVVG2AfDWABTyJLoOVUbSyo2gjPnMoBqo3lAk0YGsgADXqqQKt6rLXfmu/B2OqqaZqqDSCvidoCmyBLmplnQQXg1jwW23Ustpex2F7EYntOxA5N1OUWCyp2ayL3aCL3w4qxncnKhR6qW6Ca2PywQxgq8PjDwGh5NhxzIjKVV/d74oy10ew0zqdxB03Vl+CW2lFs1sS2nYbZDmNYNpvfC9cj9Pj7cXynOnrkRwJgL1UZyTWwkstnQ59NfDRsD7fBd+3i89tFg5WiOZVH/KR7+JPasJyeUFC5290M7cY9nA6fLdqIdWG+D11504gT9X1YDITjP4FFQD8SvCTZo0uSnZr35LP6VD2jiMTT5iL5VEB419Rckf2MDYNnnwqDXbSKLpz3WkcXQviATT3qFIhbSWvMqXxWQeSzC8JOLQh7zgBP7RPxXJiIn4vU8wBzyl+QR/yFmvCXwzL5uVh9vSByJ/RO4U/KLYw1tgvfqDjKB4A/oqqnLK+ARQ/nTp10U5xH4wxQUZRU/gQuBMTpXBSilXAtfgevTYM/bLOya1vRYy/GcR5H0JH67baFCtSfdh8N07Hbh4vxB/sKi1hdsj6WT8VxPtywkZAVOuIfg3kq++3iuPvTEbYrRmsbn418cpi+FxbTTK5P/6NhrHqOhwPgaoOyJ96uqTq/iOW19v6WUEHDhRHTmvxw4fd+PEk1jg/DlzmV2+HDw/Eddyh64rSCyBLmS4bZp5V+l+ZZHeXK+miuG/N3JHARoPxoOZ3M4jiPI+hYXVANmS3Gju20j4rYX+h9F3Q4qHynPu7In16wucdFGcuFYXmcJhz3LnS/U5x2bBsfhvgwcqBj9TIc9wlMYCTQVD5Kx+q30Cj4PnCfGxdCV2ahQA+ZkMU80/Oj6rp+JH78Rc9+jXGHkshzrQ3dtGHb+eiV229PH8333sLBMK25yZjIJ+P4jiPAEWFlrC68DBrTITbAtsM8bB/sB8thWu2/og2uMB+L47E2kvS+1bLy7riH0HYcXRthGVff6HorfrVnTpyXR/wROO4TmMDIUEbijZrKrVDYuwrfsL8g16+P5vNj381mQqrm1s/IU+GUaxzHcYY1t06WlVStH/QSW+mz7lE+7hC6DV7Tdu2wal42vy3N5vNk/BsmWGW2dVrcqaSqX83TeRrbQDqxXfDTlfHRffz6vVpoVBB5fhGzI36XEKxWzQn/gV2K34w/djft5rOhu6E4JIPpmI95sNhmHeFjX+YmMOYw1xN311SeZZc5+wpnXTH6CyaWxR/JMDTDN1St2bYiXtm1THbcAK4eKGLxNB3Lrc2JaL9tXHR5Ppu7MpZv/kQH81DYH9Yx+As9cy6Wd8TxHjeAVWxzVP0S/prxhvdhZQmn26VjGuZjGd++Hug0wXzt2mXLjvjNq3OResRGgtIBcV7kCEWIhm2C3VgW0wB3p7NwkeHkb2kCfxysJ4rlVH0G7j8KFTZcGENyVUEOu7EOi1ugsqXsbBy3cQfYC5cnfG0RywPhdFr028xnE5eO/bm0Nt/adLDnJpKPg42/ON7jBrBcGjaYwt8JTiu21TB07Y5pXdi2ZaXjsgSuX0nuh+N8uGF+9eqbzRH1UlhRi+OO4+8rb/70uWWtTQ/J+3VV9Dziv1tH2Ek4/hOYwKJgA+V3KWP1jVHuc/EVUvfdV2B9flyZ6gRiubWk7HQct3EHc2twLA8MGwbFNvDJ+myDZX3uml5VDpVbmbt71kXpX+A4jxvAGXDrZtiDCyqvPaQNU2s/VPPp8+OivSakIOJnZXLkF4+U0+JhZSR/Ul8EajshbXT5bhpxOtvuNi3kH8vZ4cX1PfmicVgkMoElDtUSclXAklhcGIdh8yPwf/T16cZtf4DVkSrZT8pI3B/HbZwBLpcsiXhYQdV1UKHiDzWE9QeOKwX/R9+0sT8Ma3uLpkKN1Pl6erZx79I4Qt7joojkV4tYXd8exvOnF8t47YWGVhfbMFWNpLy2jPgL4RJRHO/DDUWPnbaBSCcd3Y1R6H1YukdFtxGDJ9jLNE4zyR1w3CcwgUXBWtjdT/kPt47Q4+/6oKuC7+eHeFYnbPjVRH56nvM/w/EbZ4CTEoqIfxcaAXtOHE47Tq9Ld/lYFrtDtJpX5081tySvhiNvdo5BhToM1kfyZN8KMx+asoTmU+oy1mHPEeZgMMIWioLKy+FkChznww0bp6ZuWfTYh3c684uN9HWk3dJC9LCfdjiY79oeMKdq+/rjCcPxn8AfCTDxfigR618MYF0DvNEAMb0LrZ8bnT01dZOc8z+De4NyQk7URP4fTDj7NuqFCnMIQ3twamxXIHAic0HENf0Z9iac/nEH2Ai8I5Dmpg0dGzXe/fJNm7XRDcsnP7hfbM+6meQOb56auhGO9zgBxG9dxP8WH0Pkw24bt8vWMMTy7nt1pI66No/4j8fhgjs4BkkT+VtYiBFqZHF6MG9UmYPBqhFXVxZEfhKOWMLxP6oBVbY3PZeQW57f6/35oUBYcXPhihUk7/VEP4r4pkgsIJwKYWnwbL5bGaBZfxEHPWvjOIHzsGyccXoCcAx8rJt7vT+fi2cTGOawYcDGOui9bVrGb3vJDFMbiWJ1HOs4uTTwD37s2WdllJw8NwMnWcgv5JRfURXUumDWBbhdUJt8WxEgvrNCaBQ010FTeW4Ry8diQ4w76Bn5EJjHsWnHaXNthWk+7OJZPsa2TIX9WPR/snz5sTjO4wb9nrh7QdW3qz1goTSFyxxGtyw3/TTzwpZTTLdYzeNkWwuSvQQWHeB4H24oiPgw3IQAHUg3rjh9vrRgWUxfLPp0VPaS2zRlfwkH0OL4H3VgK/S5XvwATdlZmqoLcyrm4HIsHWdbdKwGCO8W1ZZigE1ek1bLWD1yq47VtiKWCwhuSzOGd/guz3VXcnKbTtS2kmabS6Jy3ZPn6Rn2lzh9LqyL1CNyKn5ZUL5OU7W51teI0/YBori14+H60bEyCIdkwoVxZqhnoSIzH2Gw0IVwWEH3fTSWbp9mR30s//HcqamldQQRFScURH7B19Ov0ty0JbYFbryHyWO7hd4Hp1/vyAl/11KoIIqI/V1BoIPks4m1QdOmrk0wDuNbmWE02EuVx+ridb3ezCI6lX8SuPhWZEWfyh+4+7vcOA9L8zB5n9unA9NdN0wFFFRtufBYuhzH/6gFuMlUU/XDIpb74ZexPjLfHp/vYk23iI/ft3I1v+2nC12/fnR1V0ftaKrmc6I2FZH8u0GyGoVdR+r5Ghqwwa2P3eG06aE0VDqa8jDUgyeZFwob2nCH0Ufvkg/xrbsaypNri0h9v6Tqe+YZZQbh3YflAlZy5p0Mnq4cAR0e+oK/GgtS6zZyA3eFzbjMEfVt+MvLqdiF55ZC6fTZoAtd+S5/mGcqL6r6mqT3haFbt4yNG8Ay9n4k3uDOb3bZska/vM8domO3Sx/s/7q+iOTXcZyPBJQ9/sySqnVmGM/EsR3nUHqGyWF711jzXDrWU9tLXlNQeda4Dx0fUtCR+iBcS1EtyfUbeFRc8D/CZH8IQ/589DoDq+Nhikie3V/RXH3WXw69b/X9PcnKwflX/kLRoDVWHPnCrRDHxdWB/XQhjkOIF5LB8vYdLqaDgr0tnp3fHs/OwwGe8F6h7x2eLh3zrJ4KrU54WrrLN+5k1lTote6mPA4H6HACttu4h9Lu2tvlYbkQDfPxX0WTDx0auP1X/Aw2/rplbBwBVmEWVH7XnPoxQvp9GLIp/j58tmv6rRDeB6eQ9PtEvBTH+UiAjsU37TBeKP6j0jEP0xZs5eE1/Dm2hA6xjqUue3JJHBR8yCAn8tP2xGFsoMWiW0ix0bsyAsthWoju0syVyUTN55H8gJs+HfHnayrX2g8U+8M0G39Mr901tv3XOtq8pjzmY/vgdxyvEPrCchtjH73ZWPvT6H5MVrZ586ovDXa+oR1W/V7fsOrSm/GsdTf1h+3to7lujMaPp9xaHJxRtrsk7MNu+RpX0LF6jY7lHvcAYZymYejat2H3kRom13+NsH0hp/I7l1Ka4jgfbljXUzNFXB0OHEo7xm66xy4eGn7H6NrSLAAi4pdbjmMKx/+ohvVUfrr63W8baBSDht4xdvnzyWD5ELoysDQ6p7xxp0tO5Guh8MEwm88Pptlwm3H18300rL+Lh7HJGz39ODwssxh044v1+mjYP9aF3W2a37bYH9ax4MdTqSzIeRaLYF2Y5wsfEA4a1bH8jSbib9zyNY4Aw4wFlZ/akTb3zlmb4GOXcFp9GJLz2cytS1y+uWwTvtFYfBDH+XADrJ5dN81P0VTtcOsGjDhtGN30NWzQGEJtymMdWJ99hw7bZrjck/AzcfyPetCx+CQcWWONN4rhcCaEsEvWR+vCWpdfB9Bh/qiIxUfc9BUz4jmaqIuh8fXrc3U0C5mPj9/dZ1s+nI6QHyzjC6PLL9bTog3s4Ku0sd5RGw2fLiyH6Y20LMy9teOB/eF3H+IwsK4QYrnab3XeYB7LL5TJ1BFf3jwM4BQDTeQv6isuwnbDae5CLIfti/muH3hWDYAsCiJeguN8uOFiQlb0I/6/BVqN50vDQloX8b3gtGM/WI+PDtMrOVEbcyJfh+N/1IOO1Idg8UBjTN9WXiNk2DDeMGxmbLtwNyor9Nfjxq1qeOS5morHu+mDu3IKKr+Ne48h9BU+H7rx7I5/m9bF8+mp3Fam7Qcj/kB86AvDpbthYl3YHcLh+v00G7avYcf6fIj1+vhdccN0qLgKIq7tR2xJXM6mI/EhGHY0tyg73zK2QwhHlV3IK88347MlfIM5FR/cFEVH/AblPIpum8f1obY4vj708e23ViHmHbzt4QnDngUR3984ze6N43/Uw8bjCdNEfv4atmqwoqxtTNdYNgNwb9pn3GHoC8OHNlz8DgjxhfmjvdDwEP4WnD6AkspXFlTtvDydNZVMKCys26Vj2ig8V6aRVmd1HvYfotf82vZWxifb/GB8/CavET+PH8zHvKauNs8n79J8PNwRwXLYr5/eDKsd17CNLJqePhG/Lwl7Ci5b4wYbydQtS6p+bpc/uzYZlk4s69KwP9duIR7WPZhfegWO8+GGNdPTt4JNtbA4qG6YLPrjjtPs0txnTW/b0KcL02qemr+MZvNFT7wXx/8GA7BBtKTqTZqq321NqhVubZz10DC6Mlgeu1fOX5Gu8sjUcnDEe1i24sNtk0WsvgZXnuvlKcVpA9jcUzNw7pom8t05FRt2Iz0uuuFcls56LwxrFaRAj9F9DxXgpkxbtn53Zdt6QgUdxwOH65PF/moZf9jYT8336xkVsU4XsWztp02z/ts6/WnBCHfgFES9Z9wPz4S5JdiYDPdXbR9cCIjT0ki/Z/jV58fl+2gYsQxgtThJbuxH8nE43ocb1s/IO/Zh7yMqL7g8hNKC090l22UTnz/rHtjrmjw68g35EYXLj+O3KWL5/3QsXlZS9Q8FUacdCiyJOq1P1KsxFgPEdMtz3hf0YN0FFf+gKX9BmciT7UY9vGHPda9dFid9Kp5QUvEqq88Nw8W5WL2mpPJrWwZL6UMFKlTwfDRMx4Xbx6/fw3qaNH9Bt++2ccF+Mbpxszp8Hy6u3LBfl+aT66LhhrqmtWUbfG+FG/LjT4PrF06g6EfqeW65GkeASyBzIs7UsdqHTxL3YdsWfnTz0+enzWvLwB9cEak3rZ+RPRzvww3reuxBsCXBxh3HtZmuuryF5C3NZx9MM++BO79cNKe2EHW2npGdBwdM4AYIl0zTOxeR+Jym5nQHbwHFhaqrksP+XHT5WKeP7pPx/aG4/qr3pl8s7/Pb9I/i6kmvV84TDqa3w2vHcXjD1I5TpbP9vsD3yNt3GPrNieyv78lH4fIxbgCndBdU7OpaZRZKJ8Y6D+o8aeaNP09DPNhHuIFm94J44s7j4YSNU+SWZSRfaOeccTzb6bBlrk43bnixTYbq9JQ37Mdck0PUa2DYEadhAhOAj+gmc4S/W8dqLz6MFRemELqyvkJcYfMjWaB3zUehORisu3pvxsN9Nv2202TDxjqH6XLdIRpGn26f28Sjo+LFfn10XNl0oankKX/HhjHYd9MFsOl340z6ELgQsPrDb5eXENq8dfMYP7G86w/zMM3QCZzkwe+B4324Ya7HHwgn3WxCG49xvHH5wO9d34uL2A5Yl0G0qhX4G6m5e+mROP4TmEADSqJ+C4UGH5NTF9Q2HfNCMlYO0w4G3Q+m9WcwJAzMt25Mx+hLm8+Pqw83Dj75pv5KHvOwXNNPHSdc0fj8YDogDPmsHYMKdRiUSRKXVHxLU3mt70gsk55AxYnthv1invts+m37r05byfaXRJy2kaxageN9uKGfqNOuMGdIttNbpadOiy+NTVmc/rZciOeGhWWAXhCR5z3+QBz/CUxgAWDsvqTyX2Az3uDaA09h8hdgHw6Tcwu9LcChvwSsq+tDcePoiy92Y8T+Q7xhNJ9eVz7kr5Zrp7PpburHcqEwGrIDe/cjeSCfGf+G6dJeejs45QGnfSGtgb/rLqzk2nazvLZsW6e5siFW+zeskKtwnI8EaCpfDwub3HiH0uHyQunrwoPxAx1fGJmZm2HPgdsTcPwnMIEF+OLU1I01Ec/V5viS5jJc/O4r1K4bP7FfrA/LYp1dPExr8AfDBzgeo+rA8eySxX5GofnoWMYn33yv0OfXlffpNKuiYnW9jvjr147BvpsugOFmPZP+NQw7hlaRdtnTx8ONP5ZfVB4ROQfH/+B4H26Yi/jfFkT9Cm+2b8XXgya9niOrQuUHy2C5kCyUO4jfXCzuhOM/gQm0IKfyAyVVO90Veu7vfleBc+khmYPFkD4fDaPPL3b75PA79rOYxgDzQm4s79U/yJum39qN/bl/Aw09g6usTU+fjkdPvwtymt0zp/LXdpgZp/OPQawL520oPKDByfuaqssLM4xHbonjfbih6Mn3a1KfzYjji9OB3T6az18X3aejppvnAU3EtqLHJI7/BCbQAHMjLRW/03F2oHngaF25dRU6zPfJhNDINpaXYpnF6cM4zK+NL05D9fTFx+U3G6Oud5/+Ud0LOOQMOEwLNUyQx4BFJLfDSjdcHsYF7Oq2nKjHwN1bPlsuBpv+2nnld7f1WIQjkeDus4t7TI7DlQ19os683Ozvasd1VMRpx9+/lcF2cuWxTovQGSrjbF8RsVeNc7mbwBgAHGlUJuINBVVXVQWnWaG1C1/bjWldiAuu8d/6S6srDex/MThK3LrSiePq8tynq6eLvhgc5mcYvwvNUT5U7tEz4oxxX647f9JJNy1p9srqUsi2DUa1g7swwvp1nz6dvvy3/IXGnYpfwVA4jvfhBrj9tYjlr6vDeNvxHhWxPTDa9GPbY7dPX3XjtNoFN2zj+E/g6AfoZS4gulL+GPiIoLei0xOoJvK+uifOgI8e39cyDEOFE8sNQ6xjMYj9YV3Y/ceiq8+n10fDfrt6ob73EGJ5nx8fDdDMQVCVb1++nB7JPTejgKbyUZqqX5pKDaWtywZuPmE7+OQwdi3GAayW2ctNZSTeiON8JKCk/EvVvUv+OON3mw5sn6A9AvQmv23nOrxqfqlPZX7uSSctnRun4bgR6B3Bce2wWgOOR1mTJMtgmMk+LYIb8ywN07v8+WSwLqzPPjcSsqILYUIZJkRhJ7gP82keFSsYwbh1mkdw9NBcHCcubqBZupEo1o8EtwjjtBY397iA56VJMmtRp2m2Lo5XrqdyFcwl5ISf2I/FnebgNIhYXQS71X0F2S2IXQV3lMK6oMezZ6jLv1ugRw3T6DyI1VlW1kcbJa7DdGA3poWwDruyA9Y3ii4fH+7nKai6EFZj4u9w3CDvybdsptYGdfnBaXLTG+K7vJBMxfPRmvLVMJ78eRGx1TjORwI0Ub/Y7JQVHF8f+mS67OdDX3n02RjmrotYbi+pOv3sqfvfBMd/LOFsWHUzLR6qI/EZHfESTg7WsdoFv33DsKRZi9bm1zK1fNbgwbtPl6X5eMMQ63Tdg+fugsrd8PS9W6xo9r1+lgN6A+MKy1gtvDdR7dFUXaVjtd+dJF1sYezqUTbkAgUVY4g3jO5W2l3yIXTjF0KcBuwH+8fuNi0UZoje1DNMBsu7blNBEHlZEfH34+9w3AAaziKWH96JTjHAeYDzAqcZY4g/jF4/lbmRuCDyyzjOhxug7pzrZQ/UsSrwhYD4u8Dp6MKQHUP0ENoOqTnpgarz1xPCxv0v3Rg17/FTCiJ/rakqiljuhd+9TUn1AWGE3+f6fbbFH4auH9AFbqvT8nwyYR3+OPh0hbCKQ0jO6mmmvaJbfxarS8qwjppWy7n7QXw9cbcQYtqoaHtt7sfg+zC6wmjy/P4x+ng+2qh8H89Hw+imN4Su7bH8ML8hHObPXDVAxS/L5cnJ+HscN9BUnVJQucZWuK6dcDrb7pqG/bX9t23vk6vc9rQMqfUYHEBaJsktCpp+FG7zdc8PbMe7XS58f4auX9efzz+W97mtDrjkVFP+Exz/sQMYltKEv1UT2Ycxb0DfkTjYqNhY2CghxLoW6xf78fmtw3Dd8GzqwP586MrhuOL32r24MFzEfur4enjeZcuLD9NF127W7dJDHxGWr/340+ND7Nc3Vt6lG8tgXKy9fLwq/W2668dFzLc6dsKqLaK+jr/HcYS5SH1CU3X9KPOf2LauHULvWB7rxGhl4A+uIOrrcIo3jvPhBli8khO+FpZh1ytq23HG6ajtYbFpI58fTHPpTX5TV7WsXm4KXdszNrBtBSM54e8uidi509nQiRO8gJ75CSyD/Qd1DfXTpvtkMa2p26XXGe/6C1W0uJBUiN2+cGudrqzPny9sLOfG042PeV9kRTsa+tNg09aWbyIO342zj7+A5nbjppwvPN8H3OS3aQu8RdgrrN+1Sdifi1jG3EdGs51zRL4Vf5PjBjDHrIk8Z3vsrx+wXbBtXZqP19bTprlh1H7V/BbYnByJ03GcDzeYa0AIOykn6srBUuzGNxRKL6ZhG2J5TPPJtnXW7+ZAWSJ/UKxgd8VpGCsoI/HmgorLYWkjTpAPfTuSXWP4eE05ePqN5tdXZxaW8SGWw25MC+mu6c1MD6GbfhvvEK9JtzYJxc/np60Lo88PlgnJV+5mvHw6mvFo84aFgdE3V4ZtE6K78aufTV5XeoYt1Gi6a31YzpU1MoHvCobxSqq+t5HI++Jvctyg7PFnaipze4qBLz3ud4p5rk1cd41N2VAYNb16H9z2u1lH4uk4zocb4Gy+IlJvLuPsOruIyU1DM73+tGHEctgProvd8o51WawWioiPj/3ckqbyCg0HH3oSgw3j0jHNR3czBcuGEIeJ3Rhx5viw0tEuKO4ziNCLR71sHCesF+sMyWIedmNZjD4ejouX7mkAMFp5Xxg+mWBYHv8hHnZjOg6r3fB44hFocHzyPjmMi+GF3gHN6ARR7yunklvgb3KcADarlkR8o6Tq6tAwHk43Tq+P5/rBfJfWxYP5rpLI/9YkOwnH+3DDBipO0CQ7t6pL/fF10z0s/SHEdsV+Ma0Oo9pUC2dw6jG42XcoFJHcUVB5/bCPfBTskvfpDLl9elx6/V4bHcs0/bX1N8JFZ7lhHW4YTb1tOSyD3Y1wvfw2vVs+HOeQP+zfRSzT5X8UHuZj9wK91ftr+3XpXTz87vLdpw9xHDAfoxsfX5hYFp7m3qVI7OsT9lz8PY4bXHgsXV7G2aatzt6lxaR1GA3rxDTsz33fns7O573kiTjORwL6kbgfLGbypaMrjaPwMd3UEQvfS9s2ITr8Lc1R+ZW5nrg7jv/YwVwkn6ojtQGudN6YVGc7Wax/z9tGDKHPsJiPZSxtMeFU2KWrWUiaGduOY3e82jqw3Cj8pmw7rtifD31+Qn7xX6LrH7+H0MfH/rAby9bvYVkfzUe3/iusdDbpfh0u+vjY3Yy363bDbtoR6wkhrCTLCf9+P0ruh7/HcQI4c66k/FmwjQMqXZwOm3bsxnYZ5ieEPl0urYjVFZoe+VtXc7iRm4iX4CXiYWymoy7D9Xvtdsoh+vtv6/WjDQuOSNJEvnYp7Jmb2jq9+lZlL7kbDCtoIv+gidmrM7+JZPObYzm/OYEJxmx+O8nmd9JsfgdV87vT2fnd6crBEyPQmzw4+r2mefhspSOzcn5XOttAV3flbsu6tIrelNnN2n6a2PSP0ZXB8jUdv9s4N+mXD8KsnjWtjSvnd6Yr57cO9o7ggtZ+bxfKUdHVB88iVgfg1x82/laI3y3Omp5Ym17zmnwsi91dOkP0mgeVgx1y8n28bkPWxWtUCJ6GB/vHfJ+MRYhvHvG/3zw13sfBbKAnLi+JPLvsunfJg5iP3SG663afGKuOM5wkzj+9ntIjfvCtjtK/0ER80xwvFUiLi66M+8SI/WFsNmJ+P5Zm7EXl5UUk/w7Hf6wBTi/QRDxU98TjdSyernvqlJzyZ61P5LMLIp9dzMhT52bEcwA1Vc8HzKl8YUHki4tYvbRIspdUKAbPCksHQzLgX8fy7+EcLsCcyhaWBi2vLWf9YnqNbV5B1KvhSuHDgrF6zRwgka8rqXpjYVC8Ed4rtxjQap6O5VvmYvWBgsofb/UUeFwQcQ/LV0BdWSzj4mA8ejPcwFnS7CxN5Xc0VQYLKg1W7xVWPKBZtDQXXX6lA/u1NB+9Dr+OgxuXkspvlVT9qKRyo+194nR32cTSuugVr1mpjOavtnlB5DWwiR1/g+MG62fiO+pY7htWVtr2qWk+GUzzyYZ48A6V7AYq5zVJHzoOvf+c8CcVRF7pnrjuSytOl30PyftoNdrpB0z323JwJuPXcsrvguM/gQkYgM3M8EF1IZyjt2b16pttmZG9uUg9oozkf0MhDB1bZAukr1D6eL4C7SL8xRVUfS3v8QdsJOo+ZSTu50MYWwfEdCyDaSGe1eej+2RcWR2pv8gj6CyJDW7DFLKJtUuX26VjXfgd8zFvziyHN3cG/d+6GXkHXC7GCeAMx4Kw50B5a55y306fL/0+OUzrkg/xKrqaLyNxdZmsjHG8jwQUVPwDjPi4NrDxxDbwp8dv1xB9gRdY+IVpEI9NIE/kqWumV4/1QcETWGIwtyxO8phfUMTyAC7w7geMCyWWC30ILg0qInOGG1GvxvEYd1jfk4/cSJsV2sH8OWF+10pG17+bF1hmrjoXb74fpc/LOb8Njvs4QdlTty8i+V2Ie+i4LPyO3Zjn2sZH88m7dEDzV0LVNXkk/wfOucTxPtxgzsek8qMwR9+Mv798uOnz8Q4Gu3TYsl8QdVV/enIh4AQOMcxPPe7Gc1H2tIKqjTB57la2+APuLqjWT7sysO/mmBeifpZH6uE4HuMMMGdTRvKVMC/XTmvbFtgO2B4+O3bpcnX4/IO/PFL71i6LExz3cQPdk4/aQZtzmxjb6WvbEfN8NJ/dMc/avTqCSO3oU3HCONy7lFP1zILItXhxiF3pi9MZskPTBm37YH/YjbG2I7hhCbv4UZkkszj+E5jAIYE+Eb+yJxfjgtjlHsZzCz9U7AURLz13amrpHIlvJuv5XTSRn8ero3wfdkW32Oa5frEb0zC2ZRauId+vibxYpynFcR8nqK5PF881h3160uem0+eunxX6ZEN+hmG1bF1unR+TU7ELIj8Me9Lc9LhpwenCfFfG5bnfd5cfjFiXGfqn8uq5iD12HG72ncBRCprITxZU7g1tdgxhs9C3C7qLBZX74e4dHPa4g5lfonIfTI6H0orfu9wu+vSFZDFCJQOH9haxuqyYlo+F62Rw3McJihn14CKSP8Z/Ac00hXk47V2yPvv7bAzP6mBUuU9TcSYcAYTjfSRAU/UJWDHsS1dXun3YlfaQvhDd8sBmOeU7N0Wz0zjuE5jAIYOix96jqdxuKw1ceHHB9PGxXM2vVuPlkfi4nk4zHPa4gybybbtgr4bnI3XTiWmY78pYu7g8nwzWg+VhOXtO5daLlp9wLI73uIEm6mVmstyTplHS7ONjN6bZBqyiWbs15WE7QEHl7+fi+E7jcKQOXO5ZUPUjc8yPJ03DEKfP+q9t2OZbGUzzYXWrr7q+7Mlfnz+5qXYCf0rII/7xgsorYPmnW3jdAu0WYHecG1cabXnbMPG/GodluIuFgqj32tVR+CN1bYJpGHHlMNTGnsbKRTOMR+GwUfkLHOdxBE3lO65w5ulC6XJt4LNHU861U21Tn5/QX9blVeM+Ntc1FJH8qBm98HxjLoZWzzVkRihHwxD7M0c2UbVxQ089cX5qCd1UO4GlBWvhNmEqf2g/bFxp4oJq6J7hmLoCaFYGRaz2F5G6OO9xgcMed7j0+PR2mogzYXVUM13N9LvuUCVQ0du2xP5dHS5iP2ZehMp+3uPPwvEeNyhJ8rCC8nPgD89NH06TL/3D5LEsptfuCi0PnnAqjaZqb78nP4LjfKSgIOKX0Fi66fC+Dz3ubHgZCtGxjOseHBS8Bsd7AhM4ZAB7NmBBAlyJbFYmDSms3R9CUw4Q/sAKqq6c66nXXLZs9tY4/HGHPmGnaSrnzH0zAdtgm+CKoHY3bYQxpNd1uzphT5iO5f/iOI8jaCr+a9vg+hGcLpxGX3pdXtMOfvtgXTWtyatuXZXnwH41HOcjATCUWFD1K3eBiC/dofS5cj4+9o+xS966TeeCynNx3CdwmGB+9eqbwcax7ctPOBYQ/izs+7jjsLieS8gtYWmsjuS/6ohfWy16aBdMXIhxgcV0LA+NXRHLbZtuIzi271KAgsovbw/8Hbppx0ObXbby2Qvrdp+uX+uGYTy4LiKP5ZK4EFDH6qtVQ9pMC05Xww7epdHdflydPhlsWziiS1PxiXEYYoaFF3mkHlFQuc5eBYLj7kvbKO8+Gtbn2sbnFxAWABVUHSgi9R0c/wkcBoCNiiXlL9RU/l+fiD/oWF2kY3WxpvIiiyVVF5UL75W7plc8S7fY5NduV68Py1gZxP7dMFz5gsiLCyov7FN5gYuaqguLSF2SR3IDXE1SxOp6X+GsCqj/o8AF3HW7MnZJqabirHOX6Fh0Eauvm8rL85H60t9lK2xfHzb0BConeJqKi8pz55bAGWUbqHqwjuVv4Cw/X1qwXVz7YTq2xyiI/Vm3qWSJuDaP+OtxnI8EwIksfcJ/oKm8xj1DEJejYVjZrU0fBbG9m+4KYY4pJ/LS9XF8xG/3vUFBPxLPK6jcqmO5HXaDmzmSWB2wCFccV89sQJPI3Xy3bkzD/Ka7ptnwXB7279MxkN0PCGmAZxln+0EOChz8JbWXh7crhFDBHUaHOZAyVv0+FY8fh9VOBwNzgZ5+CN1KBMtiGnb7ZF10ebvTVTCM98mlsIdER/Kr8B1BWeuyT52+br5rB+wnxMN0eA4a9/9ZT9R9cJyPBKydnb15QVVRbUtopxdjKL0LNE/HZhjaxqdr2BnoBZXXFnFW5LG6uIgVdIAXsKCVG56AOZUXAGqqzNO+Vzhwx5Xb8l0ZeLe6DAbCq97rcPtUXZQT1S966owtMzNH/DSPPwrgsquCym0w2Q1Lp93rOvC1HSG6y68+MPvezvgaLd/VN8xP7dfK4zj54mv1VoWsXXgrfpvexccfCeg3B8QSdfa4768JwcW9HhwL82PfhlCc/i4MyVp603Yur+Zbm9o83p5A5cCO+NXfo0BB+O+hEajT4bdHyCYYsQ7XPlgO+3URtgAUkXjTxqnxaNzXTE3dLKdq+2Zz1Xw7Lb70hOiWF6L5eE25sAzQoQxuSWZN424R/qR87xVWskBv87CcxZCuSm6YLpgLg2+3oGqfpvKzl6bZ7bDNlwzASblXM+iNmj+QRmbgj6GLjhHL1dikYTnsHubHvvv8YTf2G5Ib9pG4hdjyqlOH1eUlEe/FNl4qoGP+ch3LAp/4MOyvEuMocm4nw6W5OiwfKgRNxXmapH+D4zxOAPM2czP8HnksSrjmxk0HTn/Na5Z9LOND199i/BREXq174gk43kcC4FSMuV5894LK3bDXC8cXp7NBa5XPMIbs69PtQyvXtLnLHzydOIXyx5Z5rN92nl1aOxx/fLF+eMIQchGrfWWUvR/bfUkAnM6tqfwy3FcUSrjPAKPQQzycAVjG0rCcTwa7LQ0/MTb9+t0hGq5Q7fMyc1irPHvDDL8ntvNSgZJKuJbjWthPgj80+8Q2bdqpbXefn4re5tUfbpNuyidRb99wLF2O4zxOsLnX+/OCiE8Wsdpbna5QpwvbCL8vBrEOrKftrvbVFUR8H06Ox/E+ErCB0uWa8HeXVF017KT/Fi1wTYUPff4tPcQLydVPy3d4IzRMIbePZnW6PCwXppm57muLSG7Edl8SsGZ6+lZlrL4Bcwq+BA43gN9oPtmaV8tgOTczXXT52N0lb3gdm/LqihDT2/qw7ua7mr8Mhg4Jfxe28VKCggizOgqnG9tlwe3pufpsjXVYm2Eb+sIANMcQReJpOL7jBqayjVUf5jp9vWCcrmE4qn/L88lY2kZwE/GyMkmW4XgfCTD31kXyPG0WI6H0BL5ZS/N1anB6a3fTjqPigh9Y8o9WSvrkMK/LD/aLaa5OnB4f3dqrljOjNwd0xK7Ddl8yoKn6L1/D5Ku02zJtwy6G70PX6BU6PE8PAmeSpft0unq8dI/bpw/zNsEYORVbCsJegu27lCAn/JItnr03blpHsYkPm/rafB+CnJkYp/LcDTS7F47vuEE5k9yhT8XVvj8AbFMfhmRCdMz3frODbyan/Jp8BR2by+0uTbJZHast0Ih3NTRV+up0YTn87iK2kU9vKAws26XH0jEvFLfKHdaF/Vr5hXeov5yhYlf/Ao2q/UVP7MN2XzKQR+YW3dyeU+UzMMaWEVp87AaZgbxnmMinAyPOgAV0G6tB7wbHzRcGdmNeFx/7h+XVOeGvg8lcbN+lBDkRl1YrC/22snmH+a5cyOYhPyE+uOGvw/wtUfHGfJpHOL7jBHCnUdETb4ftCPj69JBNKlo77Q0/rd6wXx6j9VPFJbteE/FTPcMUjveRgvVUriqIGPxZtuPupmGU9GL/rg7Md+VceRyWcQ8p81jPYuk4vC551+36xTrMymOaXVlQeT62+5IBOJRwPZWPLKn67pVs5fzudKXZYQ+VrYs+GuZXMt1yNQ6X35nOzu9IZ82hk/buJDeDmpnlb/RwZuJ3LBfid7mvYifMF3H2HGzbpQTnT/X+vE9l35wL5vlIfWn38bEclsFuzGuimt9Esvlimt0bx3fcICf8xIKwn9s/AJw2N+22dz6KHX12wfwuNHNdVF5dzLBTty9fPhYH38LCh/W99FEwvIgbZpy+g0kzRp+dbfmq32sZHJ6PhrFLxkcP0dz6K6TXRzP0gV9YXV3Gavsc5R/Atl9SYPYTEHZXHWdPLxL5lILIU+HYnjzir9AR//sK5eAZQuBXMnk8oNmng4Zn6I58Sxf/e034y4tIvKqIxJtLIj9SEPH7LbGc35lAL9pkAOxZCmaYL+NCaP25frA7hGZSmcpvFSS7K7brUgFYBLNuBTsJLk90G6baFu104w+olq0++LaOcL649rd86ElXZw6K3y+FMwdzWI1HxXU4XTitGEMytR3bPIwhHYAwrFhQse3S42mK43ykAO7R0kS+1SyyQfHH5aQuE93fJvbX5DXlfDJY1zAZjD4/jU5y4Hup/Fp009iWq3mesBw3LBuH0zT0CnIStv1RAXBkCNxueSQQNqhChbl9avmxW2aYKiL2dzriry+I+AYc+WPPucNoMw1nXI1tuluRNgsx9tv2Z/YNROyx43DEy8HCgdnZm5cz/Ek6VgvnB9ZpbNpkgd5pf/yRuXnSzhtfnkGDX1J1tSb8LeMyYR+CL05N3Tgn6knb0YkZbppwml0ZTKv9hvlh/7W7Ok5HXp9H/BfzJ43PSSTrY3nHIpZfs/d9tdPQLj+Yh/lYpilfIaa7/rEb04ahTx6P4PiwbpTaOppxbpYlHMeaN7jZgMhzsN0n8CeEuThe2afiE7AnA3rVOKPdjPO5cea3/dWFotlItf3BsE1O1a5NEVuN47mUoEySW2yI5AsKqnbgS+186caI7Y39YdsPkweEvS0FUTvhNt1xb/TLJIlzIv+xvf+rnfbFIvbXLKPddoS8hBNd8pnsleN0XUNB2b00Eb/BKxdD6ehCnw18GJIx/hvD/22ZCg8uHF/DFCoTOC2u275jfVjenNVJ5YY8kmNx7NQNCjRhJ8GfE2y8xBkTymws5+OF5HzualJZXlvS7P0w8Y3juJQAGqa5WDxHx+oy3DANw7YN23Zryrf9emWomu/35IXj3igBrOslt88J/xT+23TTiWkYcYXY5QeXUSxb0aohnX6sfgtzOjjORxLmevyBJZH9UMdyVMRlrwtxhe7q8Lmx3mHuxaDr15eGmufymzz8bt0wgpPH6hvjvljoqIUiln9n77oJoS/jfO/WjQtIF5q5pVjuhb+lpXoungWYY5yL5WPtEKlriy6bhHru9h3TR8XBKRp7yp78z3Hq6YdgfU/eTRPxTdd22BYutmXaNvDJu3bFMq6s1QnxyWP1IxzfIw1lkj0M/s59lW0IsQ0wLUQP6W/KW2z78en26WnEZcgQnk9nW699b8v69MHTdJapuq6M5DuwzSdwmGAuZg/akIhWBvkzzs3oblkfz77XBcBUnNfrnvwNXKmB47bUAOZIdC+9HQwBuMvFfTboslNNb8tjnSG/gGbyNlYXwdXfMN+I4ztuUNDsXkWsvgdL2900YsT0Yfb1YZfdXDoMKxZUXppT+UIc3yMNBZWP1FRdg9Pf5caI+fbd0v28CrEujL4GE+tsytdh++gL7kCD5TaMmOfq6uIDwkrmgsh/08tTim0+gcME/Ujcf47IVuZgrDK0fm/zujMby8C7GUKk2eb+DHvOUr3eAgOkI6dyPZz84LOBzxYVrW2zsGxbd0N+8McBm3yLmI9dTz8EZSLvBqd228sVcbp8z4U0e+zkQ1duFHnY9gHHjY3j3jpNsr8pSXc6fDycftzQhPw0sR3WKOjTjRHL4EbI1wA109Kua3AYmN70L2Ej9QuwvSdwGKEfycfBqcQ403AG+jPRn+E+xDoAzUV6VFyw5tbJsqU+jOdCn4o+vkMI28G1B7aNj4f9YMT+Ye8anPQwF/GH4/iNK5Q9dfuSSDPHhNPs2gOnvQux31H0uRUh3BZQUvlvOK7jAPlM9ugygrQE0hGgYRtU9HYZ8ss13aFwhsn6dGLZkB/c+GC/C/TANxhC8Lc3XQnbAv65WMEItvcEDhOsp3RVGYv/cHuoOJMtDWdiLdumh9DVM5hb2pcT/p84Xksdcip/AePUvklp7we0YHN/ZeDKN+nND9XSIVxzVh/lS+pU5HJZEuvBqjzXDm66fXYJY9uWXfoWaIMKzZziQsTP9Uz61ziu4wB9Iv6mGIx24HTitPnSj/3g92EyWM5143fs9tGx7lH84PeG30E5wnQfwve60XTQ5U/h/EGw79HUWV4ykB8HN+2KN2kqrnArUJz5OANdrApEm+5DrAs++pLKX2sy+1Act6UOZsNzLLVd7dj14TVxGL+2Y60T3psfpzmun/JfaJo+CsdtnOHcqambFpF8qh0GbQ0xLdDb9nTt4spg+2HE8rW7KqNFT74Yx3NcoKDskZrwa6yNcBqaNH/aK9m27UL6MPpkXLePPqq+YbKufp+czz+OT9V5sfPd2da5ePYeY7mCFVpJWMEES3/hlk84agiO4QdcM736Vl1o5QDBH/i3CPrg4ruDWR1l4rR69c1AD4SzdXr1rS5afsKxXQgybtyAtv54ddzFhKwop5NZTcUHC6p2mspzhJ4FztCQ/LCCUj3hlloF5+J9Cqf1aAFYhm+vQcF2cO3RZUtXBtNDCOd7FVRclRP+GIjHUuv1re8ldysIvzqUdrd81ei3mSuL9WEaDsvcbUSyP5QkexiO47iAnhYP1T2xzf1jxumw9mmkfeGP1Pprly+fTTAP0zG/S6Yl63Q6sAyWdd0+P9iNEeuAP6WSqp16Wr1nbC8nhZUY+TT/K3NNeiRepYl8naby9RuoeqOOs38sqDodsPQ8NZFvg4MyNc1en1P5+jKSr9REvRwQjiYqe/yZG4l4KDQQONwQwGqqjUSxkvBHF1T9Qxmrt2sq39GP5L/0qQeBHsl/ARkTt1i9vaDqn+DivTwSnykicZGmcqGXNQq6BQAXDoxu762iteXN0CFV+TiudDpUUMbyP6srwf02wvRW5RH46HzyrsymRM33qXgCnPaB47QUQE+nWUH4N+AYJTwU6tostDKrC10/uHLCtt9ExXw+zf8Wx2+cQBN53zki/lB/c820+NKIbdKwjyOL7TLML8aQH6zbJ+/z19RRpxX77fKP/cCzOgNRXVVQ9uWx/FM6l5BbFlS8CZaGwp+EhltUabarpHJ3SdVuHas9gEUsr6hQXaEHCO9A07EE/p4yBnm5W1O1C3Romu0qqALcWcRyuyZ8rZ5OYQirsze7NpqdLmbEP/eJKAsqd+g6HhDuXh3LvbAHqEagZXuBV8dzAfcWVMFJufvt/AfOJJvB/oqzmdm4IIT4Ls/q3mau9xZvHsuCcIgAKlhN5Bd3eY7X8b132dKHda+3/sCgIcyJfOtS3qgMw3n58vgBOuLXutdeYLthG/lorj/c8GO+RQjTnCodyXeN+3JhWCyiifxy1QGqv1vcwPjsg9Pto7kNAOb5cJh+l1fnS7Mc+/y7sl26hiEeGTJnDFIFef35DfTY8bs8ExolPSP+uqBqC6wIAoTNifCxwxP2VVg3FFxDdxAKBqZZvy7CaQCAcF10Qfgv8pg/EMfFwsVk1YqCqJdCwwbDCuCvjkM7fPtB4Ti48YV3t9DiDMeZ7JMJIfbrQ+BfAUOHEX//RkIYTvPRBjmVL9BU7TAbXRv2abq7ev7N/KjzzyIc52SO8KHyOh2JT1xKs7E5ZPRgQR/HjtdEnFVSdQ1UHq4t8DwTthWmjcK3dPhG4E9NU3lOOZ3N4niNG8CUgY7F06vyZdPRTncIQ/aoeU03lsHyPp2+d6zL9YP1+Pz70CcXsgXwTX1MoQOiPrF5XA837sfiTn0ifg6VPz53ChsHJ34YzYdgMFgqXVL5ShwXC2WU3K+k4kf2fic7SecLq/nefIbQly6sE1eEXfKY7va24ARz+OhhCbOO+MfgbwKn92gEWGVWEPGey2AMG31o2P5d+eWxp3lCo2QOv6XqSk3VJ/Ll/EQch6UIcOjxpZTdK4/k3BankmnbzF/+fHbDPIxQUZk/NCJ/W0bi/jhO4wpzcJArnFIwYjoxDrNhF+L8CNEw+mQszeVhOewH+8e6ML1yQ927cr4k6qpyRv7ruhVqJbbp2EAe84fvScPGwInzJXgYHeOedBVUKP8U2rinqXiCpnK7HWev4uEPx8YxFFcf+mTdzKzfw36w/6Zc5RfiPziBAHr1n14/M7Nkh5kOBqCxKHryLOiI2FOgffYbtVJx8wju2CpiubUg6n2bIn5bHPZSh3Uz4mWaiC2XD2znm6/sQrccYp4rAyMkZjiMyl+XhD8Jx2OcAU6MzyP5r5DGxZ7PeDCIy68vP0L0YXxL9/Esv8vt49XPam57cB/deXDc0JZxr4s0kQ+xeyd8CcSJ9CUc033o6oLL/TSV74TVezg+AH2aPSGP1XY7fox1Vfqamenigkxgkjgkj+MZ4jXCMO91AbBP6IXCO8yt9an6Ek7jDQWKHpM6Er+F+T13OLULsd1ruh2yVfM5lRtzKl8JQzo4zKMFNkTsjZqIy0x5QmXetZWvXLo2s0/rH9zQaaoOjM32llT+uCRqSTVKFuAorILIc2AY0o76hLaAdCGWc+2Jn6MizidMGxV9fnz1Gkb7vZi/YSr3llSdXcTs/1nbjfWqVbicTlN1nltwfZniQ8xz/fnclgbnMWnC3xZaPVUS8TC40heGwHCYOGw3vjjsrnhgmWGyLRlPwQA6fBQwzFTE8pqCyjVlxI/a1Xejwvqp44/rw82sVF5T2Slg0wZaeo06zg6UcbavoHxrvxffHYdzNIGtNMyKVCIuBdtBuaqG25t2w7bsQqdxuj6nYp+m6oNLYU6pC+BW3T6V3y6ovLag8rrqBuDKTnU58tcTPvTVgz50G/qa1u3Hh8PkQ/xmmty01t9LQdXV/Uhsz6P0Q9huYw35FP+zS2eSR0PLOuqlWyGadYcyzPI2Jt3nMcHu45zId8E+I184TX3N+C7QPQ1HCH36Q3w3vCa92kENFUdOuS4IO3XcL6c73HApke/KidqxeeFDCpW12tZgT+igVKcei7yk8kU557fBuo9mgCNiYNtFTuQ2sANeyIPLYpPetCV8532q9ucx/1VxFJxq70LRk4/UPfUlHcmyoOJa+Mu0C6Nwg45tFbJj257NBssn38V33SE5HAamt8Orn9Uf4+DklUhu0j31mkuPX6KLgjZF0XRJ5acgcXA+FsyLwAnRMMRnEdyYDrvULc9g2vTj+gOEuYbNxCzrfRtcjYzj4UJO+V0Kqn60NZ6dvyxZ2Y7PIKyFsFtx89Nr7KZXWLkt3b4DHdID8YKNpJugUBCZ5z35qT4RD9UzTMGGYJymGzqsXTZ767WQr5GAIap85+D2XljkYssSIJzeAPQdyUo46Xh3SeTXNRXPWBvHCWyexnpvCADphmHRkrBTdSy+WRC5Z2c8a+bawH7tb7OyKXxzsPCmWk6v1hWRfH9O+T3BlkdTowQAV6/AdgHY+7ieylX9GfHXOZFv0UScqYk8vyBqxwaijD3Abrbs2foJ1wd2lTJ89/YdsF5hPLvwvrAC2awiHqxkRiuSMc3K1zIQThVWXT/VYdd1UR2nKo9nzfTIYKVdv+jJT62L+CMunc5m4XABbKclA7CRdV0cr8yJfLIm8l3QSBWx+oKm6kuaqjMBcwddGpw+XEDFQdQ3AXMivgkfjnkCUvnVMlZf1FR9OifZu/orxBNGOSRwzerVNysIu2tO+fPnYLghll8oqfya0WnCgPAgHFW9G/cgfKA3aJVsE5vyLr0k6hvgpyTimwWV3y2o+h5gSdV3NZVnFZDmOPukptk7SyJfXBL+mIKwe8OQCIx547RMoAmbe2pGE3Uf3UsfD3u6NBUfN2WKKLD3V4tYfhI2U/epeIam8i+hZ39DbZAwQOOue9nt8l72QJgX0kS+VlP5AbOBnIhvVOVVfge+lZLI/9REvEcT8bKcqMfkM9k91xN11G9VsLBmavXN4LK7POK3hdPb8zh7YB6pR+SEP7kg4iUFVW8qiHqvjuTH5iL1GU2zrxRUwPcNNvxuQdT3YV5GU3UOdJI1kT/TRP1ME/HLgsjfAGoqzy9iuQaG7QuiLi6oWldQBftBEcIeURcrem7k5Vrwr6m8QMfqN5rIn2oifwD1TRmr78IT4mPcA6zqJPmdPpGfL6h6X0myl5Qke3Qxnd0LVtuFpkmWLMAyX9i8Bn8smmUnbSIVagddWhnJk+d64u75DL/n3Ay/Rx7ze8zF1RNoUCBgHqtM1O3XxrMJDi8ACz25c0+auin8gcD12HNxHY7FHJ6DMBfcTjxcmg9DPKBvoPye64m8L+wyt1gQdW8dqb/YFK287SXJynh+amrRxyxNoIYNlC7vU3EC2BR68nBhXsHY6i1LeKPs4YSdx6vj4E9q/Ux8RyizVXlV9yl78m6be+ntNhyfpTBcj/3d0GHt1OzNL6R0OTTU/eXihLkZeccykSdDB9N+63AtThGrBwFuoOrBGkZDiHhoHvGHw1l95rw+Kv66TPijzVxgJB+rafZ4Hc8+ro3Sg7OP69Ps8XBhKTQq0HmAe6Zg1CXv8QeYeKTN+qeJ6j455XeGP8TQCucJTGACE5jABCYwgQlMYAITmMAEJjCBCUxgAhOYwAQmMIEJTGACE5jABCYwgQlMYAITmMAEJjCBCUxgAhOYwAQmMIEJTGACE5jABCYwgQlMYAITmMAEJjCBCUxgAhOYwAQmMIEJTGACE5jABCYwgQlMYAITmMAEJrCE4Ki6a2cJwjja/0jGqSvsLt4fC39K3T443OEdnUApXc7j+IEySU5evXr1ITs6nXMuMsZOyhi7l0zT+4okuZ9FcCvG7q3S9C+EEBz7HQLHEEJWzHJ+F875PVWa3qelG2hC3D1Jknhqcfcj3UjF8UoWxw+ScXxHzBwCN0nT9HZJIk+GtOE0Q5wgvpzzuySLuNmWEXYSj+MHuLqG4QnLlw+9HGx2dvbmKxlTIM85PzFJkltgmS6YTdNMJsndfGkFN2PsXkKIO0m56OsrbsQYUxljdw2VHQZhJsnJg/w9HPfOHMM5vw2kh3N+D1zmAG2Z44SfOLts9tZYQRfMzs7eGvyJWNxdkfQ+OM2gO6P8njKWd+R8UVdY3Bj0iSS5P3wzmHkwwCm/s0zlQ1ZyftuubwvKF4QN3xLYDvMxqOPVcVAPYbuGEL4J+JawHh/Mzs5OQ10EdpWUrsL8LiCE3BLqgq585zG/B4/4bSEfsf8uOOGEE44VlJ7A49irG+KbUXYvqOvAntj/EDgmTdMM6tjgd0TZvRhhd1VjeEfXMSxJTs0Yn1dpehHnPMICBwHH9Ho9wdP005LxOcn59YqLeZWyBcy4mJeM75cp3yQZ+zeojLCSEIARZcpfqxhbxxm7GnRX8R/oNijmFWO7Zco/wCK2GusIAWPseBGnn51lfF4myXcxvwNuBB+gSNOfcca3q5QdcNOrQJ+xgbhKcr5OpOnzpqamRqlgbiTiZJ2bPqzXoEtL0gNQGLEiDKsYkxnj/wl+RMr+nTEmsUwAoMDfTjL2ZcX4ZZKJAwv5y2y82Lxg7HqR8gsEY2/oqsAwQGXDGf+iZEwrxq+FstLIXyHmJecHZMq2Scb+hVcV5J8U0jSlgrGXCs7XSMavMHnpxEmaMpdCuneplP1Q0vRRWEcH3Fgy9lSZsv+TMduTJakpw9aOGecm/VnKrpSM/57F7EGjVlKEECaTFOw1zzl/DOYfDMhEnHdithLS/99dZRg6eCpJ52fBVpQ9GPMxwPcD350pQ8a2A/vaMmXL++Abh3fB+I+xHh9kjD1HpumcSJJrFGPvG/WvRil1nEqSJ0rGzvflu8l7xuZlwveqhP1IMvZIrKMLpJSPU4x9TybpFTJNTTlydRsbJPw6yfhaniR/tYhOyU2SKDlZpOmXVZpulmkKOqDOXSivVbzZdTLhfZGyM7ry8rCDStVfKCa+Ch8/JAL+nrDMYgF6J4KxtYqL/aZS6cBZIeGj0zKO/98oPV/GVhCRJG+Hwo51hVDEKRh9JDA9F8b+TzFT0E7H/BBkjJ2qGL8eh+1DSLPifI1I06djPQhulPR6twf7GDt5dHnwgEzFH0aprKEHqdL0EvAnafKs2WXLRurtQa9QxslOT9gtNGllfE7E8Z1GaZwEIQ+VSfLbkdILutP06iyO34X1HEqAHjOjyRugQmrFwYMrpYLKFCq/kUDF8aszxkbOY5HynySJvAPWgwH+UmTCXqwYv04xtm02TR+KZRYJx0RRNK24uOCEbBYqzQ9igQVYPXWzNE0fZe2Rcf5ALIJBJMnDVo5oA1OuUr5JJOzNWI8PVMo/ulKoeYj7SiHuN2rDxFP+AtPxHQFXSTUvU/5OrCMEKhXPgPiMmu8yZXvhTwfr8QF0SFSyiG+Ui41pSu47Sh18WICn6QsGPZQ9WZK8uNfr/TmWWQxMT0/fisXsqYrz62XKruNpegpjjGRJMusi/JnJNH2rZGyP4mKHSvnLRxlGlCQ5VcXJVRnjuyRjz2aMrTbDPgO9MLxk9FN+F8XEhSco8wF9HOsJAY/5axTjOxQX61TCn4j5PjC/+py/Cz5AmbI5GBaDvw83vTBkpmK1UnL+esX5DsV4KZh4LtaFAXrGMCQKfiFtSsHfonwIFCgTHufPgt68TTc8YXjrpKmTht6qK9P0IbaBV3H8oFEaDhiWg0o3Y3x/xtglkvMnQ/g4f2ehAhPifauUgo7HFqiYTjpphDhBAwkNABOXJ0lye2xHi3JmpqeY+Dk0ToKxf8F6DiVIqGAZOxe+EcXEm6DRd8uczV8YNhFM/HhQEf/rqKMAGRc/gQqZJ8kXMkpTm5cWwQbwFylT/jqTVynvwzAm1oMBhqxkmv5s4OdLKkluj2UWCTeWUXRyxkQumdgvGDsNC1hYmSSxZOwdEDZnrGCMnYRlMMB3BOXcphuGu0XC/nlQcW8Cu1i7gxxMAfDjjhs6RAgg4+Q/V5lOkjgb80IwmG74nmIC/vw/k6Xp7XB5hDiZ4TLGf2W+RyY+PDXi36xK2TmrVAYjKf8DIxCgy0WTPs7vLDl/LdgRGr5MiIdhPRiM3Zg4Db5Rwdi5jLHHQn7gbwjqZcbYqyTjlynOtyvGHjTKN3pYQKXpq8E4ivEt6fR0NurHFAIwpuD8E2BIkab/1TU8JNL0ZYoJaGQ0o/Reo1SMWcr/ETJIMb4hufWtg/M0kRAcGqYToWfHR2+YVMrPXCUzqFh+MuoQIGPskZLxXygOQ5PpZzHfBZGmn6sqCnGeZBL+EhcNlNITBjr2wbwD5o8KivMnVR8T2w/DLpjvA5kkd5BJurP6ExJvhgYIy1jIOH/bibNmyGcbxHlY2Vo9PX2rjPF3mPxN+c4u+TTt3U4xdoliYp7F7O2YfyiBMXa6+TvjYn2SJHfDfBc442tXZbNg0/djnhemp28F5RR65SwxQ55eMEPMjJ0G+Q5DflBJYhkMUKnB0CLEHTqI0GnEMosBqLREzJ5jOpKMnS/S9K+xjAUp5R0V5983f/Bx+k6oBLHMCHBjmfJ3w/cI3ztmLgZUmn5mpZRQJ30L80LAE/5Cxfgu6EQO6qcgyCT9uWk4OH8H5nngmDRdThUTF62E/EySf8YCFqCR4YOGSaRsC8zbYhkM0MiJNNWzXM7LNH0ndByxjAWVsNMgDtAZH3VU47CAYuI002qn4tJDESkzP5AyMzwEQ1VdH4NIkjeZCpaLNVOj3Vd/M5gzqv5M+E8w04FjGGUPFlxcIBnbK9L01VggBBkX/wvDFJKJr2JeCDjnr5Oc74OKi8f84ZjvAoxBS8ZeDM+Dmc+DP1qZJE+uKij++5WU3xnLjAKgRzH20qqBSS8edYEC5K8ZAoDx6jSFX/8gsCR5EcwTZWn6lVEWVnBK7ylT9i2Ik0z5/2K+C/BXCH9rUFHC5C3mH0qQKf8YNDYq5edhHgbG2FMUY6fBZDjmYbj/1NRNRJo+I2N8K8zF8oQ/E8tYgL8fxdgXzfeSsPdCDxjLYGCM3dXMKXAxn44w5zgMIA+hs2kaG8Y+CxUglrFQLYjhZcbFflikcDBDRLKX3E2m7Kxq2C4d+U8HA1TMivPvzULDxNKRv2uZVqMgMNw2NTUVrMcAVJpecIIyHdq3YZ4Hbsw5f4TiYoNibINKkmC+wx8izNXbjj78nWEZDPA3PSuqkRAYHsV8F2Ypv0uW8Fdmafp0dfzxx406xPknB8XEP1UVvfgt5h0MwMQs9GJhiCgl6X0w3wWZsPcPehm/wzwfQK8bJtwzLq6XjH0E811Iesnt01S8LE3Tl3FKR1q5A5Bx8YNZAX8RHBZkjASCsfdCrzSDCUqSPBpW8MwyttoirF6yv87Y72ILAufkRJmmYANoPD8Lv/xYZhSA+Mgk+Yip6Bj71KirBDPO7wkVhUjZfhiyxHwXkiS5A0uSp0hK/xLzfAAdmeoviF8rOD8TKlYIw9oRhtCggqaUpp6GblF2XAxkTPwHdN4E43+A4TBAN39hNRZUIDD/gv12AaRBcX6OGapK2VmwKgvLWGCE3Fsk6RYzNJbyU0ZZdclj/sBBxw8WPnTm1SiwbNmyW0vGLh3MoZ3OeXgYDTpoKjWV435YCIX5owAM66qUr4eGW8XxyzF/VIAhf8VFH0ZnBGPvwfwA3FSl/NMnZDDUxs/FTAduBKvqFBdlNSzH34IFMJg/zwSGw8VVivHvdXXwOKd3Fml63qBhesYo+S6lPLkaTjYdkqfDdAf8YbtlVkq5CoaNsd+xADP5zfg3BuP0Z2H+wYBKquEhmHDlURScgIdFForxL5hhRM5/hfk+gJ4FFFTFxSaZ8hdYOqf0zrBiRQjxUJFWyDl/gErVfVSvN9PUEoaZ42ZUxvi5KuVXq4S9CfNDIGP+zsysTOPXyDT9qWDsy5Kxz1lUnH9Gcf4xyfnbBGNP6/q1Hgac8wdKxq4yDVPCXgxDPFhmFIA/NpWmF2Zc7BOMvWSUuUUzB5Akz4SKlDO+Y5QFFosB+PAU45eY8sj5Bsn416wNs+r5WRgmlmn6bvPXCR2AEcfz/xiAlYsrq4ZpT8bYWYrzMzPGPm/ilbLPqZT/l2LiDJ7y14g0hbIXrLBdMH+/nO8dVPRvV8r0WL2QUpjnMkMuB2CpfNcwJwA/jt9GxNUfccb4vkPRMKXLl1OoTM0kP2MvwnwXVMKfCfOLivNroSOB+aOATPlboR7JOP9115TAMJBp+smM8QOSiZ8xJkfqJHFCToS8HtSNX8F8C+YvMmEvgTlRyfg1w+wCYDokafo7mFcUCftwl31gmb9i7ErTwYiikf56ZSJPNvkuBHxHv4LvSDH2Bfh+nHrpkzAHyJPkmTAsjnUcUZBp+gqV8m2K8e08Sl+P+YsFqCRhaLCquNjFgz0mXoBfTMX4L83YOmOfw3wfyIR/DMZNFePnU2fMV5jfdDUPGQ1hW4QhOcHMyrqRlkGaJehc7JCMXwpj8pgfAsX5MxVjv1WMXwOYcXEd9BQRmjjByiBoCLqGOLtAcf6I6i9T7B+1oPpApeJlg9U4lyVRcv9RFkvAGDTMwQ2GCH76x1QWPoCGDuYD4Y844+LKjEOl1LLjAagsTGWept+HISOs51ADS9g/ScavzoTYV1WUJn44XnZ1E/Rsg3MvLlTDqXy3+V46hnMAJGNPgTTzJNnXVZFZyGBvSsK/Xg35pj9UhPyx+1RuBB1AyBdIo2TssVjAghlmTfm7zJ815xpW6WKZUQAWLQ0WknQO6w4DGbPvmBV5Kf/oqH/WsNwf6hnJ+Fae8ldgvgVYTi4Z++9qNSz7MnT2sQyG44477jaKiyuquX2zgCQYJ8nY3w3+fg7Anxnm+wD+6AVjc1C2TH3ETH2Ey+yBqj6CoeHka11xOOwAvTyo0BXn5/V6f3yrKag4QaVm4cMBwfnHu4aHZMJfCZmeMX6JSNPHY74PYFk7NDYZ5z9IpqYWhnIkib+g4mSXitMNMk43cMZgyONANYkuXtbUEgbFxXmD3uvXGSGLmrcQUcRVHP+tTJJXZpz/o2LsPYqJ9ykm3gsIvRSRpFdXwzb8M7BREusYBaBhMnGMk12BocGRQKb89dWYuNh43FR4SMYFWJ0Ge4cU41eLJHnJYEz6kAL84SpKHyzi+HkZhx6za0f2XsHYv3POL4CtCIqxqyVjp2IdhxrMqsskuYOI46cJxt6Ycf5OJap8VYl4r0j5B6HMQJkzw+KcPwvr8MGxxx4LowZ7zJ4cmoRXgHL+Z/CHOOjw/Xp2dviQofkjZmyDGS6i6SmwsATLLAagl58kyWOgopNpesFg3sgL1aZr/g1oxOGPYLGbTgdwjGL862ZZOuOL2U/YAugAV42AGHUYD1Yrv0WaP2T+K0XCnR+o4yRj55pGuNqbOBSWLVsWm3yHxQmMPRXzLRyv1HGCsX8Y5PtlixhpOYYeeywcmvBwlaYvy1L+NsX5u2GVbF0fiY/ANo7BQrIfMtY7pJ3MPwokE/+xsvrd/h7mHQyAIWSSXpBxsVey5NSu4SHG2Blmf0DKvjXqkk8o7OZvIU0/36D3ejO81xOzcZzA5GBK08fDEJWCDWtJ8hRXtgsyxguorCUbaWVNC2DzG4wBQy8K/h4twkcNO7dlykzvGHqTB9mDvZFMklONDsrWqp4aeZgSAwyTQCUqGINh1M5hIQsiTZ9gNgAyvqfrbxhAxfEjVExeA0/MGwXgjxLbEXbJw9J5maT/Co2jSvgmQdMnYL+HEBq9SCjP5oQGzm9j4wTvA/e9oVc6mGd4suvPB5A+mFODhkOkbC+P+d9iGQuwbF6k3Cw6EIx9cpShQsX5E6vGm+/uWjk5KpgNxmn67+bPIGFfUL3w0nMZs8fKhK+D0QeoE0bZBoIBhmkVEz+DjjNn7AuYPyLARnCqGL+4auDEe7FACESSftP8qTBxVrIsXNahYYIVbaZDwtjjMN8DN4Ghtqp+EpslY8GVudVyf/5RM4yXpmd2dfQH0CivYHdffVQN/5NbqpR/39iF8+8f/yfoZB40iJR/qRo7P0TzS5w/3ywCMPuSzERucCWOSNlZg2XqsHt8KMDEK/wpmX03Ce9YinvSTWViNrteI5Pk16NuSAMwG1mVqaxfhXkhgCW81c5t/kLMc2GwMuhK06h0DIN0ASzikIx9oRqeYd8ZoaB6wQy1MPYf1QIKPvJHz+IY9qdBnu0etgNdpfxjcPIG/PFgng9g+Eum/NOwqKVrEYBpCFJ2TrVog38R9qthmUMJkvN3yjQ9B05HwTwXKKX3NMOrYB/evTITII7jhCXsa1DRK8bP6VrFB3Nv0HtXTOyBvW+ehR8tkAl79qBivfxQ7E0x+wWTZLOxe8LeyKfDK0p5mv79YFPqxsEqspE6Pi5IZspaH7axcM7/HvNHAUg3T5InDvbRQeU+6urcY1TKfmZGZ5hodIIRHBPH8d1hsU7VoR3+XcPcukzTtykurocTQrq2e8DKYpnyX0BHH06ugD93LIMB9ibKlP1QJMl/DVtlDXNogzn+L2LeEQPohcGS66qlH61xGAaK89dUmcm3dv0R9Ho9CeO3JuyUfwzzfQBDBxmsioJjQVIenA+DBkAm6dlmvD9N3wNDbFjGA8eAXMbEZjhyBHZ7Y4EQcMZ+bDI3Zf+OeS7A5LPi/MCg9xOseLuAc/5MUY0bXyHi9NVdf6RdwBP6RBiOgUpLVHtnRhpfhrkx2AsCm5uhA4D5FhI4P4zxi6sGlL8b830ACxqqyoOf17V5dHqaRzxl26tKV556//uHOz+HAG6kOL8AlhmzNA02sNBpYpS+qmos2S/gjD8sg0FSuUqkrIThHJWy93T9gaqUv2ZQxmAfixpW0Zuhx5T/o/kjTtm2UfO3C2CDLDQ2g44VDD8F7c4Ze381JC7WjdKI+gD23yiYz0r59+GsSMwfBczCBM4/BH/XUNdBpY1lfAD7IzPOzzWLPBJzXJoXjoO/jyR5Q/VN8/4o33UCm//j9FLwkzH2/q55WhimltWc5vbZmN8DthdgGQww5AuNpIrTXV15NKiDodGblzwd6Rs9LFBtbuXFYML2p7CaDlbSuGiWWSb8SYPVV52tLwCciTb4C9ojU/6Kgf9aJ+enQGUC45swhAHnP8G+D6zHByIVTzCnMcACA87PFEw8rRFXzp+VMfE0maZvyeB8McbneRzD8MjQeEMFz+P05VWjxzbAkBWWCYFI0sG8FD/HLHdGNoSFEbOMPTtL+btglQxP0ksGG9kWDTzlr63mBMWmrGf2kAxNmw9kmv7r4I/j4mH7HBw4xlaQVd6xFylYRecpM5LxH1YLJNiP4465CBdkmn7MNNyM/w7mBc2CEqQ7S8XT4fQDmbL98GcuUxlcZnsI4Bh23HHHQ3xMWLBCkPMny4Q/C8cJ7KJS9kv4m4cFNLPR8Ml+s2Q35XsGFf1XJOd/b46oaZedpyomvg0Le2SSjLSXBxr2jLGvmLmJNN0lGHsuLps2HXAiBwz1YB0Yqr0x1aIiKcRHMiGeq1J+CorvKWALYzMGQ35mscFBgUgG+5cY+/fpqYObH7sjrHpMWbUcn/O3jZJOyHc4VQS2sFQ2T38AG9Fb+c7Y0yTnrxOM/d4syIrTV48yZApzlXC0lbFjwp+8enV4/6ZioqpPudiULFsGHZehHQyZsBeZDckp3y45f2Erj+w3yvkHzNl/qdko/TdYzxEDniRwwOpeW9igcsU4MMpe+EUdZTiAwUGJjO/LmNiPdRlUduWcqRT3QeM16vhzxshd4Qw7u/qppXuAg4Z2p0zSs0b8W5qCikQk/KeDFUxfXsxqN5mkcJDpXrtSzIfQ4zYHWXKxUTD2nFHmCHwg0/R1VUXGYTP0QUPGxZcGk8o/gl4f5ocAGn9z7hoX+01e+tI6OPdLJunlKaXPxzpCwFjyBkgX+IUygvVa3VAJZJC/THx7lNMP/hiABTbQYze920CcbLzMnFfKLoK9W1iPD0QkeJaIHygmrgiW54GNB52IX426UhQqPMn4H2xetPQ6CEOno5zuD0N5PEk07AWC8oz1GBQL+Q9zW1/r2i4yBG4qkvSSwbL0gz5uypwVGCd9iBt0ZDE/BLBQBDoDCyvXcDoHuJDvibgoHvXkFCnvOKijhm16vrlK2PvMVEvKLhy1EwplBLYUZExcH/qOIJ/MwouUXcFo8sZRhggPGwgmzoIzoMzy2wDOCnkAjkvBfkMAiw9kzF+nErFZVUt9kU6+X6XpPthEyRh76cyIpw1YUCw5TaTppSJlV7d1w250fo1gIocVgbAkE/sPwQlmgpRdvlKqA/DntJil3OYI+ZR9TjC+RXEBS8WbceL8Ws5hST6M+7KXjNoQ+0Cm/C0rpTwg0vQPmLcYUNzsH4O5DVgmOjLASkLJ+Kck4zsWlm43cT9P092csfNZzB7Hp7rnoVzo9XozcPSPSJL1Kkn3KmzHlF3P43S3jPnvZZx+4GCHiBYLPE1fzhn7pWAM9qm0vhfJ+ZUiZblM+BdpdQVDcPgEAwx3q5T/MEv5rsyj25x1lrJdPGHflTH7O+w/BLC8WaZ8G3y/LZ0IRZTcf9jQIADMKUrG/pIzfj5P0ytN5Yd1Jew6lSRbVJp8rGs4dgjcKF6xYiWcxzcrxAEex6OcpOAFWFavON8HZb1r9ZsPOIG/Y3G2YgJOdGmlVTJzDugWWCkshBh63JYFGBKFfOFpuh3+njDfAuwZg71GYAPF+ZcwPwTV1R7sszJmWiYp7HfE3+l+FYsdMmG/gfpo1JW9/x8r379CZlG3NwAAAABJRU5ErkJggg==';
const CTY = {ten:'CÔNG TY TNHH GIẢI PHÁP HẬU CẦN HTL', tenEn:'HTL LOGISTICS SOLUTIONS', diachi:'Lầu 04, Tòa nhà Kicotrans, 20 Sông Thao, Phường Tân Sơn Hòa, Thành phố Hồ Chí Minh, Việt Nam.', mst:'0314771860',
  dt:'', email:'', kho:'HTL HAN', da:''};
const CTY_DEF = {...CTY};
const CTY_FIELDS = [['ten','Tên công ty',1],['tenEn','Tên tiếng Anh',1],['diachi','Địa chỉ trụ sở',1],['mst','Mã số thuế'],['dt','Điện thoại'],['email','Email'],['kho','Kho',0],['da','Dự án',1]];
function renderCty(){
  document.querySelectorAll('.logoImg').forEach(i=>i.src=LOGO);
  ctyForm.innerHTML = CTY_FIELDS.map(([k,l,full])=>`<label class="${full?'full':''}">${l}<input data-k="${k}" value="${esc(CTY[k])}"></label>`).join('');
}
try{ Object.assign(CTY, STORE.get('htlPalletCty')||{}); Object.keys(CTY_DEF).forEach(k=>{ if(/\[.*\]|Quản lý pallet/.test(CTY[k]||'')) CTY[k] = CTY_DEF[k]; }); LOGO = STORE.get('htlPalletLogo') || LOGO; }catch(e){}
function luuCty(){
  ctyForm.querySelectorAll('input').forEach(i=>CTY[i.dataset.k]=i.value.trim());
  STORE.set('htlPalletCty', {...CTY}); toast('✔ Đã lưu thông tin công ty');
}
function doiLogo(inp){
  const file = inp.files[0]; if(!file) return;
  const r = new FileReader(); r.onload = () => { LOGO = r.result; renderCty(); STORE.set('htlPalletLogo', LOGO); toast('✔ Đã đổi logo'); }; r.readAsDataURL(file);
}
function headerPhieu(soLine){
  const ln = [CTY.diachi&&('Địa chỉ: '+CTY.diachi), [CTY.mst&&('MST: '+CTY.mst), CTY.dt&&('ĐT: '+CTY.dt), CTY.email&&('Email: '+CTY.email)].filter(Boolean).join(' · ')].filter(Boolean);
  return `<table style="width:100%;border-collapse:collapse;border-bottom:3px solid #e11b22"><tr>
    <td style="width:150px;vertical-align:middle;padding:0 12px 8px 0"><img src="${LOGO}" style="width:140px;height:auto"></td>
    <td style="vertical-align:middle;padding-bottom:8px;font-size:12.5px"><b style="font-size:15px">${CTY.ten}</b>${CTY.tenEn?`<br><span style="letter-spacing:1px">${CTY.tenEn}</span>`:''}${ln.map(x=>'<br>'+x).join('')}</td>
    <td style="vertical-align:top;text-align:right;white-space:nowrap;font-size:13px;padding-bottom:8px">${soLine}</td></tr></table>`;
}
const P_TD = 'border:1px solid #9a9394;padding:6px 8px', P_TH = 'border:1px solid #e11b22;padding:7px 8px;background:#e11b22;color:#fff;font-weight:bold;text-align:center';
const BLANK = '......................................';
/* cols: [tiêu đề, giá trị(r,i), căn lề, tổng(L)] */
function bang(cols, L){
  const cell = (c,v) => `<td style="${P_TD};text-align:${c[2]||'left'}">${v}</td>`;
  return `<table style="width:100%;border-collapse:collapse;${cols.length>8?"font-size:12px":""}"><thead><tr>${cols.map(c=>`<th style="${P_TH}">${c[0]}</th>`).join('')}</tr></thead><tbody>
    ${L.map((r,i)=>'<tr>'+cols.map(c=>cell(c,c[1](r,i))).join('')+'</tr>').join('')}
    <tr style="font-weight:bold;background:#231f20;color:#fff">${cols.map((c,j)=>cell(c, j===1?'TỔNG CỘNG':c[3]?c[3](L):'')).join('')}</tr></tbody></table>`;
}
function infoTbl(pairs){
  let h = ''; for(let i=0;i<pairs.length;i+=2) h += '<tr>'+pairs.slice(i,i+2).map(([k,v])=>`<td style="padding:3px 0;width:50%">${k}: ${v}</td>`).join('')+'</tr>';
  return `<table style="width:100%;border-collapse:collapse;margin-bottom:12px">${h}</table>`;
}
const kyTbl = arr => `<table style="width:100%;margin-top:26px;text-align:center"><tr>${arr.map(([t,n])=>`<td style="width:${100/arr.length}%;vertical-align:top"><b>${t}</b><br><i>(Ký, họ tên)</i><br><br><br><br>${n||''}</td>`).join('')}</tr></table>`;
const docWrap = (mau, so, title, ngay, inner) => { const d = ngay.split('-');
  return `<div style="font-family:'Times New Roman',serif;color:#000;font-size:14px;line-height:1.45">
  ${headerPhieu(`Mẫu: ${mau}<br>Số: <b style="font-size:15px">${so}</b>`)}
  <div style="font-size:12.5px;margin-top:6px">${[CTY.da, CTY.kho&&('Kho: '+CTY.kho)].filter(Boolean).join(' &nbsp;|&nbsp; ')}</div>
  <h2 style="text-align:center;margin:18px 0 2px;font-size:24px;color:#e11b22;letter-spacing:1px">${title}</h2>
  <div style="text-align:center;font-style:italic;margin-bottom:14px">Ngày ${d[2]} tháng ${d[1]} năm ${d[0]}</div>${inner}</div>`; };
function phieuData(so){
  const L = tx.filter(t=>t.so===so), h = L[0], cat = LN(h.chu);
  return {h, L, nhap:h.loai==='NHAP', cat, hang:cat.nhom==='HANG', bb:BB.find(b=>b.px===so)};
}
const bkTxt = b => /^\d{4}-\d\d-\d\d$/.test(b||'') ? fmtVN(b) : (b||'');
const noiTxt = h => h.diem + (h.tuyen && !h.diem.startsWith(h.tuyen+' ') ? ' – tuyến '+h.tuyen : '');
function phieuHTML(so){
  if(so.startsWith('BB')) return bbHTML(so);
  const {h,L,nhap,cat,hang,bb} = phieuData(so);
  const cols = [['STT',(r,i)=>i+1,'center'],['Mã',r=>r.ma],[hang?'Tên hàng':'Loại pallet',r=>pName(r.ma)],['ĐVT',dvtR,'center']];
  if(hang) cols.push(['Số lô',r=>r.lo||'']);
  if(nhap){ cols.push([hang?'Số lượng':'SL tốt',r=>r.sl,'right',L=>sum(L,r=>r.sl)]); if(!hang) cols.push(['SL hỏng',r=>r.hong||0,'right',L=>sum(L,r=>r.hong||0)]);
           if(bb) cols.push(['SL theo chứng từ',r=>ctOf(r),'right',L=>sum(L,ctOf)],['Chênh lệch',r=>clTxt(ctOf(r),thucTe(r)),'center']); }
  else { cols.push(['SL theo phiếu',r=>r.slp,'right',L=>sum(L,r=>r.slp)]);
         if(bb) cols.push(['SL thực giao',r=>r.sl,'right',L=>sum(L,r=>r.sl)],['Chênh lệch',r=>clTxt(r.slp,r.sl),'center']); }
  const info = nhap
    ? [['Loại hàng',`<b>${cat.ten}</b>`],['Người giao (tài xế)',h.nguoi||BLANK],['Nguồn nhập',`<b>${h.diem}</b>`],['Biển số xe',h.xe],
       ['Ngày booking',bkTxt(h.booking)||BLANK],['Điện thoại',h.dt||dtLX(h.nguoi)||BLANK]]
    : [['Loại hàng',`<b>${cat.ten}</b>`],['Lái xe nhận hàng',h.nguoi||BLANK],['Tuyến giao / nơi nhận',`<b>${esc(noiTxt(h))}</b>`],['Biển số xe',h.xe],
       ['Lý do xuất',h.lydo],['Điện thoại',h.dt||dtLX(h.nguoi)||BLANK],['Số đơn / booking',h.booking||BLANK]];
  const gc = [...new Set(L.map(r=>r.gc).filter(Boolean))].join('; ');
  const dcIn = L.some(r=>r.slp!==undefined && r.slp!==null);   // phiếu lập từ bản 1.2 mới có đối chiếu
  const bg = nhap ? `<p style="margin:10px 0 0"><b>Đối chiếu chứng từ:</b> ${dcIn&&!bb?'☒':'☐'} Khớp chứng từ &nbsp;&nbsp;&nbsp; ${bb?'☒':'☐'} Có chênh lệch ${bb?`– Biên bản <b>${bb.so}</b>${bb.file?' (file: '+esc(bb.file)+')':''}. Tồn kho tăng theo SL thực nhận.`:'(lập biên bản chênh lệch)'}</p>` : `<p style="margin:10px 0 0"><b>Bàn giao cho lái xe:</b> ${bb ? `có thừa / thiếu – Biên bản <b>${bb.so}</b>${bb.file?' (file: '+bb.file+')':''}. Tồn kho trừ theo SL thực giao.` : 'đủ, khớp phiếu.'}</p>`;
  return docWrap(nhap?cat.pre+'-NK':'PX-'+cat.ma, h.so, nhap?cat.phieu:cat.phieuX, h.ngay, infoTbl(info) + bang(cols,L)
    + (gc?`<p style="margin:10px 0 0"><b>Ghi chú:</b> ${esc(gc)}</p>`:'') + bg
    + (h.anh?`<p style="margin:4px 0 0;font-size:12.5px"><i>Số liệu đọc tự động từ ảnh chứng từ: ${esc(h.anh)} – đã được người lập kiểm tra.</i></p>`:'')
    + kyTbl([['Người lập phiếu',h.user],[nhap?'Người giao':'Lái xe nhận hàng',h.nguoi],['Thủ kho',h.thukho||''],[cat.ky,'']]));
}
function bbHTML(id){
  const b = BB.find(x=>x.so===id), L = tx.filter(t=>t.so===b.px).map(t=>({...t, slp:ctOf(t), sl:thucTe(t)})), h = L[0], cat = LN(h.chu), hang = cat.nhom==='HANG', nh = bbNhap(b);
  const cols = [['STT',(r,i)=>i+1,'center'],['Mã',r=>r.ma],[hang?'Tên hàng':'Loại pallet',r=>pName(r.ma)],['ĐVT',dvtR,'center']];
  if(hang) cols.push(['Số lô',r=>r.lo||'']);
  cols.push([nh?'SL chứng từ':'SL theo phiếu',r=>r.slp,'right',L=>sum(L,r=>r.slp)],['SL thực tế',r=>r.sl,'right',L=>sum(L,r=>r.sl)],
    ['Thừa (+)',r=>r.sl>r.slp?`<b>${r.sl-r.slp}</b>`:'','right',L=>sum(L,r=>Math.max(0,r.sl-r.slp))||''],['Thiếu (−)',r=>r.sl<r.slp?`<b>${r.slp-r.sl}</b>`:'','right',L=>sum(L,r=>Math.max(0,r.slp-r.sl))||'']);
  const cb = (on, t) => `${on?'☒':'☐'} ${t}`;
  return docWrap('BB-LX', b.so, 'BIÊN BẢN GHI NHẬN THỪA / THIẾU HÀNG', b.ngay,
    `<p style="margin:0 0 6px"><b>Thời điểm phát hiện:</b> ${cb(nh,'Nhận hàng nhập kho')} &nbsp;&nbsp; ${cb(!nh,'Bàn giao cho lái xe')} &nbsp;&nbsp; ${cb(0,'Giao tại NPP')}</p>`
    + infoTbl([['Phiếu nhập / xuất số',`<b>${b.px}</b>`],['Loại hàng',`<b>${cat.ten}</b>`],[nh?'Nguồn nhập':'Nơi nhận / tuyến',esc(nh?h.diem:noiTxt(h))],['Địa điểm lập',CTY.kho?'Kho '+CTY.kho:BLANK],
               [nh?'Người giao (tài xế)':'Lái xe',b.taixe||BLANK],['Biển số xe',b.xe],['Điện thoại',h.dt||dtLX(b.taixe)||BLANK],['Giờ lập',BLANK]])
    + bang(cols,L)
    + `<p style="margin:10px 0 0"><b>Nội dung chênh lệch:</b> ${b.dong.map(x=>`${x.ma}${x.lo?' (lô '+x.lo+')':''}: ${clTxt(x.slp,x.sl)}`).join('; ')}</p>`
    + `<p style="margin:4px 0 0"><b>Tình trạng / nguyên nhân:</b> ☐ Đếm sai &nbsp; ☐ Hỏng / móp &nbsp; ☐ Thiếu từ nguồn &nbsp; ☐ Nhầm lô / mã &nbsp; ☐ Khác</p>`
    + `<p style="margin:4px 0 0"><b>Mô tả chi tiết:</b> ${esc(b.gc)||BLANK}</p>`
    + `<p style="margin:4px 0 0"><b>Hướng xử lý:</b> ${cb(1, nh?'Nhập tồn theo SL thực nhận':'Trừ tồn theo SL thực tế')} &nbsp; ☐ Bổ sung / giao bù &nbsp; ☐ Trả lại hàng thừa &nbsp; ☐ Lái xe chịu trách nhiệm &nbsp; ☐ Báo chủ hàng xử lý</p>`
    + `<p style="margin:4px 0 0"><b>Ảnh / chứng từ đính kèm:</b> ${b.file?'☒ Có – '+esc(b.file):'☐ Có &nbsp; ☒ Không'} &nbsp; · &nbsp; <b>Trạng thái:</b> ${b.st}</p>`
    + `<p style="margin:4px 0 0;font-style:italic">Biên bản lập thành 02 bản, mỗi bên giữ 01 bản, có giá trị như nhau.</p>`
    + kyTbl([[nh?'Người giao':'Lái xe',b.taixe],['Thủ kho',h.thukho||''],['Người lập biên bản',h.user],[cat.ky,'']]));
}
function xemPhieu(so){
  pmSo = so;
  if(so.startsWith('BB')) pmTitle.textContent = `Biên bản thừa / thiếu · ${so}`;
  else { const D = phieuData(so); pmTitle.textContent = `${D.nhap?'Phiếu nhập':'Phiếu xuất'} ${D.cat.ten} · ${so}`; }
  pmBody.innerHTML = phieuHTML(so); pmCT.innerHTML = ctCuaPhieu(so);
  phieuModal.classList.add('show');
}
function dongPhieu(){phieuModal.classList.remove('show')}
function inPhieu(so){
  const f = document.createElement('iframe'); f.style.cssText='position:fixed;width:0;height:0;border:0';
  document.body.appendChild(f);
  f.contentDocument.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${so}</title><style>@page{size:A4;margin:15mm}body{margin:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}</style></head><body>${phieuHTML(so)}</body></html>`);
  f.contentDocument.close();
  setTimeout(()=>{f.contentWindow.focus(); f.contentWindow.print(); setTimeout(()=>f.remove(),1000)},200);
}
function taiFile(name, html, head=''){
  const doc = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8">${head}</head><body>${html}</body></html>`;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['﻿'+doc],{type:'application/vnd.ms-excel'}));
  a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  toast('⬇ Đã tải '+name);
}
function taiExcel(so){ taiFile(`${so}.xls`, phieuHTML(so)); }
function taiDanhSach(){
  const td='border:1px solid #999;padding:4px', thd='border:1px solid #e11b22;padding:5px;background:#e11b22;color:#fff';
  const html = headerPhieu('') + `<h3 style="color:#e11b22">DANH SÁCH PHIẾU NHẬP – XUẤT KHO</h3><p>Ngày xuất file: ${fmtVN(TODAY)}${FL?' · Loại hàng: '+cName(FL):''}</p>
    <table style="border-collapse:collapse"><tr>${['Số phiếu','Ngày','Loại','Loại hàng','Lý do','Tuyến','Booking / đơn','Điểm giao / nguồn','Mã hàng','Tên hàng / pallet','Số lô','ĐVT','SL theo phiếu','SL thực tế','Hỏng','Biên bản','Biển số xe','Lái xe / người giao','Ghi chú','Người lập','Thủ kho'].map(x=>`<th style="${thd}">${x}</th>`).join('')}</tr>
    ${lsRows().map(t=>`<tr>${[t.so,fmtVN(t.ngay),t.loai==='NHAP'?'Nhập':'Xuất',cName(t.chu),t.lydo,t.tuyen||'',t.booking||'',t.diem,t.ma,pName(t.ma),t.lo||'',dvtR(t),t.slp??t.sl,t.sl,t.hong||0,t.bb||'',t.xe,t.nguoi||'',esc(t.gc),t.user||'',t.thukho||''].map(v=>`<td style="${td}">${v}</td>`).join('')}</tr>`).join('')}</table>`;
  taiFile(`DanhSachPhieu_${TODAY}.xls`, html);
}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){dongPhieu();dongAdd();dongOCR();dongImport();}});

/* ---------- DỮ LIỆU ĐẦU VÀO: LÁI XE & NHÂN VIÊN KHO ---------- */
const nd = s => noDau(String(s??'')).toLowerCase().trim();
const DLK = k => k==='laixe' ? {list:LAIXE, add:'taixe', ten:'lái xe'} : {list:NHANVIEN, add:'nhanvien', ten:'nhân viên kho'};
function nextMaNV(){ let i = NHANVIEN.length+1, ma; while(NHANVIEN.some(x=>x.ma===(ma='NV'+String(i).padStart(2,'0')))) i++; return ma; }
function upsertDL(list, v, edit){
  const j = list.findIndex(x=>nd(x.ten)===nd(v.ten));
  if(edit!=null){ if(j>=0 && j!==edit) return toast('⚠ Tên này đã có trong danh sách'), false; Object.assign(list[edit], v); }
  else if(j>=0){ if(AM.src) return true; return toast('⚠ '+v.ten+' đã có trong danh sách'), false; }
  else list.push({tt:'Đang làm', ...v});
  if(v.xe && !XE.includes(v.xe)) XE.push(v.xe);
  saveDL(); return true;
}
function renderDuLieu(){
  const q1 = nd(lxSearch.value), q2 = nd(nvSearch.value);
  const st = t => t==='Nghỉ' ? '<span class="tag off">Nghỉ</span>' : '<span class="tag ok">Đang làm</span>';
  const act = (k,i) => `<div class="acts"><button class="ico-btn" onclick="suaDL('${k}',${i})">Sửa</button><button class="ico-btn" onclick="xoaDL('${k}',${i})">Xoá</button></div>`;
  const f = v => esc(v)||'—';
  lxBody.innerHTML = LAIXE.map((x,i)=>[x,i]).filter(([x])=>!q1 || nd([x.ten,x.sdt,x.xe,x.cccd,x.dv].join(' ')).includes(q1))
    .map(([x,i])=>`<tr><td><b>${esc(x.ten)}</b></td><td>${f(x.sdt)}</td><td>${f(x.cccd)}</td><td>${f(x.gplx)}</td><td>${f(x.xe)}</td><td>${f(x.dv)}</td><td>${st(x.tt)}</td><td>${act('laixe',i)}</td></tr>`).join('')
    || '<tr><td colspan="8" class="note">Không có lái xe phù hợp</td></tr>';
  nvBody.innerHTML = NHANVIEN.map((x,i)=>[x,i]).filter(([x])=>!q2 || nd([x.ten,x.ma,x.cv,x.ca,x.sdt].join(' ')).includes(q2))
    .map(([x,i])=>`<tr><td><b>${esc(x.ten)}</b></td><td>${f(x.ma)}</td><td>${f(x.cv)}</td><td>${f(x.ca)}</td><td>${f(x.sdt)}</td><td>${st(x.tt)}</td><td>${act('nhanvien',i)}</td></tr>`).join('')
    || '<tr><td colspan="7" class="note">Không có nhân viên phù hợp</td></tr>';
  lxCount.textContent = `· ${activeLX().length} đang làm / ${LAIXE.length}`;
  nvCount.textContent = `· ${activeNV().length} đang làm / ${NHANVIEN.length}`;
}
function suaDL(k,i){ const D = DLK(k); openAdd(D.add, null, {...D.list[i]}, i); }
function xoaDL(k,i){
  const D = DLK(k), x = D.list[i];
  if(!confirm(`Xoá ${D.ten} "${x.ten}"?\nPhiếu đã lập vẫn giữ nguyên tên. Nếu chỉ tạm nghỉ, nên chọn Sửa → Trạng thái "Nghỉ".`)) return;
  D.list.splice(i,1); saveDL(); refreshSelects(); toast('Đã xoá '+x.ten);
}
function bangDL(k, rows){
  const F = ADDF[DLK(k).add].f, td='border:1px solid #999;padding:4px', thd='border:1px solid #e11b22;padding:5px;background:#e11b22;color:#fff';
  return `<table style="border-collapse:collapse"><tr>${F.map(f=>`<th style="${thd}">${f.l}</th>`).join('')}</tr>${rows.map(r=>`<tr>${F.map(f=>`<td style="${td};mso-number-format:'\\@'">${esc(r[f.k]||'')}</td>`).join('')}</tr>`).join('')}</table>`;
}
function taiDL(k){ taiFile(`DS_${k==='laixe'?'LaiXe':'NhanVienKho'}_${TODAY}.xls`, `<h3 style="color:#e11b22">DANH SÁCH ${DLK(k).ten.toUpperCase()}</h3>` + bangDL(k, DLK(k).list)); }
function taiMau(){ const k = IMP.k; taiFile(`Mau_${k==='laixe'?'LaiXe':'NhanVienKho'}.xls`, bangDL(k, [k==='laixe'
  ? {ten:'Nguyễn Văn A', sdt:'0912 000 000', cccd:'001090000000', gplx:'C', xe:'29C-123.45', dv:'HTL', tt:'Đang làm'}
  : {ten:'Nguyễn Thị B', ma:'NV10', cv:'Thủ kho', ca:'Ca ngày', sdt:'0983 000 000', tt:'Đang làm'}])); }

/* Nhập từ Excel: dán các dòng copy từ Excel (tab), file CSV, hoặc file .xls mẫu tải từ hệ thống */
let IMP = {k:'laixe'};
const IMP_ALIAS = {ten:['ho ten','ho va ten','ten','ten lai xe','ten nhan vien','lai xe','nhan vien'], sdt:['dien thoai','sdt','so dien thoai','dt','phone'],
  cccd:['so cccd','cccd','cmnd','can cuoc'], gplx:['hang gplx','gplx','bang lai','hang bang lai'], xe:['xe thuong chay','bien so xe','bien so','xe'],
  dv:['don vi','nha xe'], tt:['trang thai'], ma:['ma nhan vien','ma nv','ma'], cv:['chuc vu','vi tri','cong viec'], ca:['ca lam viec','ca']};
function openImport(k){
  IMP.k = k; const F = ADDF[DLK(k).add].f;
  impTitle.textContent = 'Nhập danh sách '+DLK(k).ten+' từ Excel';
  impNote.innerHTML = `Thứ tự cột: <b>${F.map(f=>f.l).join(' · ')}</b>. Có dòng tiêu đề thì hệ thống tự nhận cột. Trùng họ tên → cập nhật thông tin.`;
  impText.value = ''; impPrev.textContent = ''; impModal.classList.add('show');
}
function dongImport(){ impModal.classList.remove('show'); }
function splitRow(l, sep){ const out=[]; let cur='', q=false; for(const ch of l){ if(ch==='"'){q=!q;continue;} if(ch===sep&&!q){out.push(cur);cur='';} else cur+=ch; } out.push(cur); return out.map(x=>x.trim()); }
function bangTuText(t){
  if(/<table/i.test(t)){ const d = new DOMParser().parseFromString(t,'text/html'); return [...d.querySelectorAll('tr')].map(tr=>[...tr.cells].map(c=>c.textContent.trim())); }
  const L = t.replace(/\r/g,'').split('\n').filter(l=>l.trim()); if(!L.length) return [];
  const sep = L.some(l=>l.includes('\t')) ? '\t' : (L[0].split(';').length>L[0].split(',').length ? ';' : ',');
  return L.map(l=>splitRow(l,sep));
}
function docImport(){
  const F = ADDF[DLK(IMP.k).add].f, T = bangTuText(impText.value); if(!T.length) return [];
  const hd = T[0].map(nd), findF = h => F.find(f=>(IMP_ALIAS[f.k]||[]).includes(h)) || F.find(f=>(IMP_ALIAS[f.k]||[]).some(a=>a.length>2 && h.includes(a)));
  let map = F.map(f=>f.k);
  if(hd.filter(h=>findF(h)).length>=2 || hd.some(h=>/ho (va )?ten/.test(h))){ map = hd.map(h=>findF(h)?.k||null); T.shift(); }
  const pickOpt = (arr, v) => arr.find(x=>nd(x)===nd(v)) || v;
  return T.map(r=>{ const o = {}; map.forEach((k,i)=>{ if(k && r[i]) o[k] = r[i]; });
    if(o.tt) o.tt = /nghi/.test(nd(o.tt)) ? 'Nghỉ' : 'Đang làm';
    if(o.gplx) o.gplx = o.gplx.toUpperCase();
    if(o.cv) o.cv = pickOpt(CHUCVU, o.cv); if(o.ca) o.ca = pickOpt(CA, o.ca);
    if(o.xe) o.xe = XE.find(x=>digits(x)===digits(o.xe) && x.replace(/[^A-Z]/gi,'').toUpperCase()===o.xe.replace(/[^A-Z]/gi,'').toUpperCase()) || o.xe.toUpperCase();
    return o; }).filter(o=>o.ten && !/ho (va )?ten/.test(nd(o.ten)));
}
function xemImport(){
  const R = docImport(), L = DLK(IMP.k).list, cn = R.filter(o=>L.some(x=>nd(x.ten)===nd(o.ten))).length;
  impPrev.innerHTML = R.length ? `Đọc được <b>${R.length}</b> dòng: <b>${R.length-cn}</b> thêm mới, <b>${cn}</b> cập nhật. VD: ${esc(R[0].ten)}${R[0].sdt?' · '+esc(R[0].sdt):''}` : (impText.value.trim() ? '⚠ Chưa đọc được dòng nào có họ tên.' : '');
}
function docFileImp(inp){
  const f = inp.files[0]; if(!f) return;
  f.arrayBuffer().then(b=>{ let t = new TextDecoder('utf-8').decode(b); if(t.includes('\uFFFD')) t = new TextDecoder('windows-1258').decode(b);
    impText.value = t; xemImport(); inp.value = ''; });
}
function luuImport(){
  const R = docImport(); if(!R.length) return toast('⚠ Chưa có dữ liệu hợp lệ (cần cột Họ tên)');
  const L = DLK(IMP.k).list; let moi = 0, cn = 0;
  R.forEach(o=>{ const x = L.find(y=>nd(y.ten)===nd(o.ten));
    if(x){ Object.assign(x, o); cn++; } else { if(IMP.k==='nhanvien' && !o.ma) o.ma = nextMaNV(); L.push({tt:'Đang làm', ...o}); moi++; }
    if(o.xe && !XE.includes(o.xe)) XE.push(o.xe); });
  saveDL(); dongImport(); refreshSelects(); toast(`✔ Đã nhập: ${moi} thêm mới, ${cn} cập nhật`, 3500);
}

/* ---------- ĐỌC PHIẾU TỰ ĐỘNG TỪ ẢNH (OCR) ----------
   Mockup: dùng Tesseract.js (đọc chữ tiếng Việt ngay trên trình duyệt, tải từ Internet lần đầu).
   Văn bản đọc được → docPhieu() nhận diện loại hàng, mặt hàng, số lượng, ĐVT, số lô, biển số, lái xe, ngày, booking... → điền vào form. */
const OCR = {mode:'N', img:null, name:'', sample:'', res:null, used:'', low:new Set()};   // low: các từ OCR đọc với độ tin cậy thấp
const words = s => nd(s).split(/[^a-z0-9]+/).filter(Boolean);
const digits = s => String(s||'').replace(/\D/g,'');
const khop = (lw, name) => { const t = words(name); return t.length ? t.filter(x=>lw.includes(x)).length / t.length : 0; };
function openOCR(m){
  if(OCR.mode!==m){ OCR.img = null; OCR.name = OCR.sample = ''; ocrText.value = ''; ocrPrev.innerHTML = '<span class="note">Chưa có ảnh. Chụp rõ, đủ sáng, giữ phiếu thẳng.</span>'; ocrBtn.disabled = true; setProg(0,''); }
  OCR.mode = m; ocrTitle.textContent = m==='N' ? 'Đọc phiếu nhập từ ảnh (phiếu giao hàng / chứng từ)' : 'Đọc phiếu xuất từ ảnh (đơn xuất hàng)';
  ocrModal.classList.add('show'); phanTich();
}
function dongOCR(){ ocrModal.classList.remove('show'); }
function setProg(v, t){ ocrBar.style.width = Math.round(v*100)+'%'; ocrSt.textContent = t; }
function chonAnh(f){
  if(!f) return; OCR.img = f; OCR.name = f.name; OCR.sample = ''; OCR.low = new Set();
  ocrPrev.innerHTML = `<img src="${URL.createObjectURL(f)}" alt="Ảnh phiếu">`; ocrBtn.disabled = false;
  ocrText.value = ''; setProg(0, 'Đã chọn: '+f.name+' – bấm "Đọc phiếu"'); phanTich(); ocrFile.value = '';
}
function vanBanMau(m){
  const pick = a => a[rnd(0,a.length-1)], lx = pick(activeLX().length ? activeLX() : LAIXE0), d = fmtVN(TODAY), xe = lx.xe || XE[0];
  if(m==='N'){
    const c = NLOAI, L = LN(c), pal = isPalC(c), tu = pick(TUYEN), lo = 'L'+TODAY.replace(/-/g,'').slice(2);
    const items = pal ? PALLETS.slice(0,rnd(2,3)).map((p,i)=>`${i+1}   ${p.ten}   Cái   ${rnd(10,40)}   hỏng ${rnd(0,3)}`)
                      : (HANG[c]||[]).slice(0,3).map((h,i)=>`${i+1}   ${h.ten}   ${h.dvt}   ${rnd(10,90)}   ${lo}-${String.fromCharCode(65+i)}`);
    return [pal?'BIÊN BẢN GIAO TRẢ PALLET':'PHIẾU GIAO HÀNG', `Số: PGH-${rnd(1000,9999)}      Ngày: ${d}`,
      `Đơn vị giao: ${pal ? pick(NPP).ten : L.nguon[0]}`, ...(pal?[`Chủ sở hữu: ${L.ten}`]:[]), `Ngày booking: ${d}`,
      `Biển số xe: ${xe}      Tài xế: ${lx.ten}`, '', pal?'STT   Loại pallet   ĐVT   SL tốt   SL hỏng':'STT   Tên hàng   ĐVT   Số lượng   Số lô',
      ...items, '', pal?'Ghi chú: thu hồi theo chuyến':'Ghi chú: hàng nguyên đai nguyên kiện'].join('\n');
  }
  const c = XLOAI, L = LN(c), pal = isPalC(c), npp = pick(NPP);
  const items = pal ? PALLETS.slice(0,2).map((p,i)=>`${i+1}   ${p.ten}   Cái   ${rnd(5,20)}`)
                    : (HANG[c]||[]).slice(0,3).map((h,i)=>{ const l = lots(c,h.ma).find(l=>l.ton>0); return `${i+1}   ${h.ten}   ${h.dvt}   ${rnd(5,30)}${l?'   Lô '+l.lo:''}`; });
  return ['ĐƠN XUẤT HÀNG', `Số đơn: DH-${rnd(10000,99999)}      Ngày: ${d}`, `Chủ hàng: ${L.ten}`, `Giao đến: ${npp.ten}`, `Tuyến: ${npp.tuyen}`,
    `Biển số xe: ${xe}      Lái xe: ${lx.ten}`, '', 'STT   Tên hàng   ĐVT   Số lượng', ...items, '', 'Ghi chú: giao trước 10h'].join('\n');
}
function veAnh(text){
  const L = text.split('\n'), cv = document.createElement('canvas'); cv.width = 1400; cv.height = 120 + L.length*56;
  const g = cv.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0,0,cv.width,cv.height); g.fillStyle = '#111';
  L.forEach((l,i)=>{ g.font = i===0 ? 'bold 46px Arial' : '32px Arial'; g.fillText(l, i===0 ? (cv.width-g.measureText(l).width)/2 : 70, 90+i*56); });
  return new Promise(r=>cv.toBlob(r,'image/png'));
}
async function anhMau(){
  const t = vanBanMau(OCR.mode), b = await veAnh(t);
  chonAnh(new File([b], 'phieu-mau.png', {type:'image/png'})); OCR.sample = t;
}
function napTesseract(){
  if(window.Tesseract) return Promise.resolve();
  return new Promise((ok,err)=>{ const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
    s.onload = ok; s.onerror = ()=>err(new Error('Không tải được thư viện')); document.head.appendChild(s); setTimeout(()=>err(new Error('Hết thời gian chờ')), 25000); });
}
async function chayOCR(){
  if(!OCR.img) return;
  ocrBtn.disabled = true; setProg(.03, 'Đang tải bộ đọc chữ tiếng Việt (lần đầu ~10 giây)…');
  try{
    await napTesseract();
    const w = await Tesseract.createWorker('vie', 1, {logger:m=>{ if(m.status==='recognizing text') setProg(.3+.7*m.progress, 'Đang đọc chữ… '+Math.round(m.progress*100)+'%'); else setProg(.15, 'Đang chuẩn bị…'); }});
    const {data} = await w.recognize(await anhOCR(OCR.img)); await w.terminate();
    OCR.low = new Set((data.words||[]).filter(w=>w.confidence<60).flatMap(w=>words(w.text)));
    ocrText.value = data.text.trim(); setProg(1, `Đã đọc xong · độ tin cậy ${Math.round(data.confidence)}%`);
  }catch(e){
    console.warn('OCR', e);
    setProg(0, '⚠ Không chạy được bộ đọc chữ (cần kết nối Internet).' + (OCR.sample ? ' Đã dùng văn bản của phiếu mẫu.' : ' Có thể dán văn bản vào ô bên cạnh.'));
    if(OCR.sample) ocrText.value = OCR.sample;
  }
  ocrBtn.disabled = false; phanTich();
}
/* Chuẩn bị ảnh cho bộ đọc: thu về cạnh dài ≤ 2000 px, xoay đúng chiều → đọc nhanh hơn nhiều với ảnh điện thoại 12 MP.
   (Đã thử ảnh xám + tăng tương phản: nền bàn gỗ bị nhiễu, đọc kém hơn → không dùng.) */
async function anhOCR(f){
  try{
    const bm = await createImageBitmap(f, {imageOrientation:'from-image'});
    const k = Math.min(1, 2000/Math.max(bm.width, bm.height)); if(k===1) return f;
    const cv = document.createElement('canvas'); cv.width = Math.round(bm.width*k); cv.height = Math.round(bm.height*k);
    cv.getContext('2d').drawImage(bm, 0, 0, cv.width, cv.height); return cv;
  }catch(e){ return f; }
}
/* Năm đọc từ phiếu lệch xa năm hiện tại (VD ghi nhầm 2005) → lấy năm hiện tại, đánh dấu "chưa chắc chắn" */
function namHopLe(y){ const cur = +TODAY.slice(0,4); return (Math.abs(+y - cur) <= 1) ? [y, false] : [String(cur), true]; }
/* Nhận diện thông tin phiếu từ văn bản */
function docPhieu(text, mode){
  const raw = String(text||'').normalize('NFC').replace(/\r/g,''), U = noDau(raw).toUpperCase(), N = nd(raw), W = words(raw), LINES = raw.split('\n');
  const r = {lines:[], moi:{}, un:{}, unk:[]}; if(!raw.trim()) return r;
  const un = s => !!s && words(s).some(w=>OCR.low.has(w));   // chuỗi có từ đọc kém → chưa chắc chắn
  const TPL = /hau can htl/.test(N);   // ảnh chụp mẫu phiếu Excel của HTL: dòng tên hàng in sẵn mà không ghi số = không có hàng → bỏ qua
  const lab = re => { for(const l of LINES){ const m = nd(l).match(re); if(m) return l.slice(m.index+m[0].length).replace(/^[\s:.\-–]+/,'')
      .split(/\s{3,}|\t|\||;|\b(?:SĐT|SDT|ĐT|Biển số|BKS|Tuyến|Ngày|Booking)\b/i)[0].trim(); } return ''; };
  // 1) Dòng hàng: tìm mặt hàng / loại pallet trên từng dòng, lấy số lượng
  const cand = [...PALLETS.map(p=>({c:null, ma:p.ma, ten:p.ten, pal:true})), ...Object.entries(HANG).flatMap(([c,a])=>a.map(h=>({c, ma:h.ma, ten:h.ten, dvt:h.dvt, pal:false})))];
  const DV = {thung:'Thùng', kien:'Kiện', cai:'Cái', khoi:'Khối', pallet:'Pallet'};
  LINES.forEach(line=>{
    if(!/\d/.test(line)) return;
    const lw = words(line), L0 = noDau(line), lc = nd(line).replace(/[^a-z0-9]/g,'');
    let best = null, bs = 0;
    cand.forEach(h=>{ let sc = khop(lw, h.ten); const hc = nd(h.ten).replace(/[^a-z0-9]/g,''); if(hc.length>5 && lc.includes(hc)) sc = Math.max(sc, 1);   /* OCR dính chữ: "baoxáxíu" */ if(new RegExp('\\b'+h.ma.replace('-','[-\\s]?')+'\\b','i').test(L0)) sc = Math.max(sc, 1.01);
      if(sc>bs || (sc===bs && best && h.ten.length>best.ten.length)){ bs = sc; best = h; } });
    const rowLike = /^\s*\d{1,3}[\s.)\]]+\S/.test(line) && /[A-Za-zÀ-ỹ]{3}/.test(line);   // trông như 1 dòng trong bảng hàng (có STT)
    if(!best || bs<0.75){ if(rowLike) r.unk.push(line.trim()); return; }
    const lo = ((L0.match(/\b(L\d{4,}[-\w]*)/i) || L0.match(/\blo\b\s*[:.]?\s*([A-Z0-9][\w\-\/]{2,})/i) || [])[1] || '').toUpperCase();
    let rest = L0.replace(/\bL\d{4,}[-\w]*/gi,' ').replace(/\blo\b\s*[:.]?\s*[A-Z0-9][\w\-\/]*/gi,' ').replace(/\b[A-Z]{1,3}\d*-\d+\b/gi,' ')
      .replace(/\d+\s*[x×*]\s*\d+(\s*[x×*]\s*\d+)?/gi,' ').replace(/\b[A-Z]{1,3}\d{2,}\b/g,' ').replace(/\b\d+[a-z]+\w*/gi,' ');
    let hong = 0; const mh = rest.match(/hong\s*[:\-]?\s*(\d+)/i); if(mh){ hong = +mh[1]; rest = rest.replace(mh[0],' '); }
    const nums = (rest.match(/\b\d{1,6}\b/g)||[]).map(Number);
    if(/^\s*\d{1,3}[\s.)\]]+[A-Za-z]/.test(rest)) nums.shift();   // bỏ cột STT
    const dv = lw.filter(x=>DV[x] && !(best.pal && x==='pallet')).pop();
    if(!nums.length && TPL) return;
    r.lines.push({c:best.c, ma:best.ma, pal:best.pal, sl:nums.length?nums[0]:null, uSl: nums.length ? un(String(nums[0])) : false, uMa: bs<1 || un(line.replace(/\d+/g,' ')), hong: best.pal ? (hong || (mode==='N' ? nums[1]||0 : 0)) : 0, dvt: best.pal ? '' : (DV[dv] || best.dvt), lo});
  });
  // 2) Loại hàng: theo mặt hàng đọc được → tên loại hàng trên phiếu → loại đang chọn
  const cnt = {}; r.lines.filter(l=>!l.pal).forEach(l=>cnt[l.c]=(cnt[l.c]||0)+1);
  let loai = Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a])[0];
  if(!loai && r.lines.some(l=>l.pal)) loai = /pallet tho phat/.test(N) ? 'TP' : /pallet htl/.test(N) ? 'HTL' : isPalC(mode==='N'?NLOAI:XLOAI) ? (mode==='N'?NLOAI:XLOAI) : 'HTL';
  if(!loai) loai = LOAI.filter(o=>khop(W,o.ten)===1 || (o.khach && khop(W,o.khach)===1)).sort((a,b)=>b.ten.length-a.ten.length)[0]?.ma;
  r.loai = loai || (mode==='N' ? NLOAI : XLOAI);
  r.lines = r.lines.filter(l=> l.pal ? isPalC(r.loai) : l.c===r.loai);
  r.un.loai = !Object.keys(cnt).length && !r.lines.length;
  // 3) Thông tin đầu phiếu
  const bsTxt = noDau(lab(/(bien so( xe)?|bks)\s*[:\-–]?/)).toUpperCase(), PL1 = /\b(\d{2})\s?([A-Z]{1,2}\d?)\s*[-–.]\s*(\d{3})[.,]?(\d{2})\b/, PL2 = /\b(\d{2})\s?([A-Z]{1,2})\s*[-–]\s*(\d{4})()\b/;
  const mp = (bsTxt && (bsTxt.match(PL1) || bsTxt.match(PL2) || bsTxt.match(/\b(\d{2})\s?([A-Z]{1,2}\d?)\s*(\d{3})[.,]?(\d{2})\b/))) || U.match(PL1) || U.match(PL2);   // ưu tiên chữ sau nhãn Biển số
  if(mp){ const v = mp[4] ? `${mp[1]}${mp[2]}-${mp[3]}.${mp[4]}` : `${mp[1]}${mp[2]}-${mp[3]}`, k = v.replace(/[^A-Z0-9]/g,'');
    r.xe = XE.find(x=>x.replace(/[^A-Z0-9]/gi,'').toUpperCase()===k) || v; r.moi.xe = !XE.includes(r.xe); r.un.xe = un(mp[0]) || r.moi.xe; }
  const md = N.match(/(\d{1,2})\s*[\/\-.]\s*(\d{1,2})\s*[\/\-.]\s*(20\d{2})/) || N.match(/ngay\s*(\d{1,2})\s*thang\s*(\d{1,2})\s*nam\s*(20\d{2})/);
  if(md && +md[2]>=1 && +md[2]<=12 && +md[1]>=1 && +md[1]<=31) { const [y, sai] = namHopLe(md[3]); r.ngay = `${y}-${md[2].padStart(2,'0')}-${md[1].padStart(2,'0')}`; r.un.ngay = un(md[0]) || sai; }
  const mb = U.match(/\bBK\s*[-–]?\s*(\d{3,})/); if(mb){ r.booking = 'BK-'+mb[1]; r.un.booking = un(mb[0]); }
  const mdh = U.match(/\bDH\s*[-–]?\s*(\d{3,})/); if(mdh){ r.don = 'DH-'+mdh[1]; r.un.don = un(mdh[0]); }
  if(mode==='N'){ const mc = U.match(/\b(PO|PGH|PXK|DO|INV)\s*[-–]?\s*(\d[\d\-\/]{2,})/); r.ct = mc ? `${mc[1]}-${mc[2]}` : (lab(/\bso (chung tu|ct|phieu)\s*[:.]/)||'').split(/\s/)[0]; r.un.ct = un(r.ct); }
  const mt = U.match(/\bTUYEN\s*[:.]?\s*(T\d{2})\b/) || U.match(/\b(T\d{2})\b/); if(mt && TUYEN.some(t=>t.ma===mt[1])) r.tuyen = mt[1];
  // lái xe: ưu tiên chữ sau nhãn "Tài xế / Lái xe / Người giao", so với danh sách lái xe
  const lxTxt = lab(/(tai xe|lai xe( nhan hang)?|nguoi giao( hang)?|nguoi nhan)\s*[:\-–]/);
  const lxHit = LAIXE.filter(x=>khop(words(lxTxt||raw), x.ten)===1).sort((a,b)=>b.ten.length-a.ten.length)[0];
  if(lxHit) r.laixe = lxHit.ten; else if(lxTxt && /[a-z]{2}/i.test(lxTxt) && !/\d/.test(lxTxt)){ r.laixe = lxTxt.replace(/\s+/g,' '); r.moi.laixe = true; r.un.laixe = true; }
  // nguồn nhập / điểm giao
  const noiCand = mode==='N' ? [...new Set([...LN(r.loai).nguon, ...NPP.map(d=>d.ten)])] : [...NPP.map(d=>d.ten), ...LN(r.loai).nguon.filter(x=>!/trả về/i.test(x))];
  const noiTxt = lab(mode==='N' ? /(don vi giao|nguon( nhap)?|ben giao|noi giao|nha cung cap|giao tu)\s*[:\-–]/ : /(giao den|noi nhan|diem giao|giao cho|dia chi giao)\s*[:\-–]/);
  const noiHit = noiCand.filter(x=>khop(words(noiTxt||raw), x)===1).sort((a,b)=>b.length-a.length)[0];
  if(noiHit) r.noi = noiHit; else if(noiTxt){ r.noi = noiTxt; r.moi.noi = true; r.un.noi = true; }
  r.gc = lab(/ghi chu\s*[:\-–]/);
  const mbd = N.match(/booking\s*[:.]?\s*(\d{1,2})\s*[\/\-.]\s*(\d{1,2})\s*[\/\-.]\s*(20\d{2})/);
  if(mbd){ const [y, sai] = namHopLe(mbd[3]); r.ngayBK = `${y}-${mbd[2].padStart(2,'0')}-${mbd[1].padStart(2,'0')}`; r.un.booking = un(mbd[0]) || sai; }
  if(mode==='X' && !r.noi && r.tuyen){ const t = TUYEN.find(t=>t.ma===r.tuyen); r.noi = tuyenTxt(t); }
  if(mode==='X' && r.noi && r.moi.noi) r.moi.noi = false;   // nơi nhận gõ tự do, không thêm danh mục
  return r;
}
/* Mục bắt buộc trên phiếu đọc từ ảnh – mục nào không đọc được → cảnh báo đỏ, người dùng phải nhập tay mới lưu được */
const OCR_REQ = {N:['noi','ngay','xe','laixe'], X:['noi','ngay','don','xe','laixe']};
function ocrFields(r, N){
  return [['loai','Loại hàng', r.loai && cName(r.loai)], ['noi', N?'Nguồn nhập':'Tuyến giao / nơi nhận', r.noi, r.moi.noi], ['ngay','Ngày', r.ngay && fmtVN(r.ngay)],
    N ? ['booking','Ngày booking', r.ngayBK && fmtVN(r.ngayBK)] : ['don','Số đơn', r.don||r.booking],
    ['xe','Biển số xe', r.xe, r.moi.xe], ['laixe', N?'Tài xế':'Lái xe', r.laixe, r.moi.laixe], ['gc','Ghi chú', r.gc]];
}
function phanTich(){
  const r = OCR.res = docPhieu(ocrText.value, OCR.mode), N = OCR.mode==='N', pal = isPalC(r.loai||''), REQ = OCR_REQ[OCR.mode];
  if(!ocrText.value.trim()){ ocrRes.innerHTML = '<p class="note">Kết quả nhận diện sẽ hiện ở đây.</p>'; ocrFill.disabled = true; return; }
  const F = ocrFields(r, N);
  const cell = ([k,,v,moi]) => v
    ? `<span class="${r.un[k]?'warn-y':'ok-y'}">${r.un[k]?'⚠':'✔'}</span> ${esc(v)}${moi?' <span class="tag warn">mới – sẽ thêm vào danh mục</span>':''}${r.un[k]?' <span class="unsure-msg">chưa chắc chắn – kiểm tra</span>':''}`
    : REQ.includes(k) ? '<span class="miss-msg">⚠ Không đọc được – phải nhập tay</span>' : '<span class="ok-n">— không thấy</span>';
  const miss = F.filter(([k,,v])=>!v && REQ.includes(k)).length + r.lines.filter(l=>l.sl==null).length + r.unk.length*2 + (r.lines.length||r.unk.length ? 0 : 1);
  const unsure = F.filter(([k,,v])=>v && r.un[k]).length + r.lines.filter(l=>l.uSl||l.uMa).length;
  ocrRes.innerHTML = `<table><tr><th>Thông tin</th><th>Đọc được</th></tr>${F.map(f=>`<tr><td>${f[1]}</td><td>${cell(f)}</td></tr>`).join('')}</table>
    <table><tr><th>${pal?'Loại pallet':'Mặt hàng'}</th><th class="num">${pal&&N?'Tốt / hỏng':'SL'}</th>${pal?'':'<th>ĐVT</th><th>Số lô</th>'}</tr>${r.lines.map(l=>`<tr><td>${l.uMa?'<span class="warn-y">⚠</span> ':''}${esc(pName(l.ma))}</td>
      <td class="num">${l.sl==null?'<span class="miss-msg">⚠ không đọc được</span>':`<b class="${l.uSl?'unsure-msg':''}">${l.sl}${l.uSl?' ⚠':''}</b>`}${pal&&N?' / '+l.hong:''}</td>${pal?'':`<td>${l.dvt}</td><td>${esc(l.lo)||'—'}</td>`}</tr>`).join('')}
      ${r.unk.map(u=>`<tr><td colspan="4"><span class="miss-msg">⚠ Không nhận ra mặt hàng:</span> <i>${esc(u)}</i> – phải chọn tay</td></tr>`).join('')}
      ${r.lines.length||r.unk.length ? '' : `<tr><td colspan="4"><span class="miss-msg">⚠ Chưa đọc được dòng hàng nào – phải nhập tay</span></td></tr>`}</table>
    <p class="note">Đọc được ${F.filter(f=>f[2]).length}/${F.length} thông tin, ${r.lines.length} dòng hàng.
      ${miss?`<span class="miss-msg">${miss} mục không đọc được – sẽ tô đỏ, phải nhập tay trước khi lưu.</span>`:''} ${unsure?`<span class="unsure-msg">${unsure} mục chưa chắc chắn – tô cam.</span>`:''}</p>`;
  ocrFill.disabled = false;
}
const CARD = m => m==='N' ? nCard : xCard;
function ocrMark(el, kind, msg){
  if(!el) return;
  const box = el.closest('label') || el.closest('td'); el.classList.remove('ocr');
  el.classList.add(kind==='miss' ? 'ocr-miss' : 'ocr-unsure');
  box.querySelector('.ocr-msg')?.remove();
  box.insertAdjacentHTML('beforeend', `<small class="ocr-msg ${kind==='miss'?'miss-msg':'unsure-msg'}">⚠ ${msg || (kind==='miss' ? 'Không đọc được từ phiếu – nhập tay' : 'Đọc chưa chắc chắn – kiểm tra lại')}</small>`);
  const d = el.closest('details'); if(d) d.open = true;
}
function ocrUnmark(el){ el.classList.remove('ocr-miss','ocr-unsure'); (el.closest('label')||el.closest('td'))?.querySelector('.ocr-msg')?.remove(); }
const ocrFilled = el => el.value!=='' && el.value!=='__new__' && !(el.classList.contains('sl') && !(+el.value>0));
function clearOCRMarks(card){ card.querySelectorAll('.ocr-miss,.ocr-unsure').forEach(ocrUnmark); card.querySelectorAll('.ocr').forEach(e=>e.classList.remove('ocr')); updOcrAlert(card); }
function blankSel(sel){ if(![...sel.options].some(o=>o.value==='')) sel.insertAdjacentHTML('afterbegin','<option value="">— Chọn —</option>'); sel.value = ''; sel.dataset.prev = ''; }
const fieldName = el => { const lb = el.closest('label'); if(lb) return (lb.querySelector('span')?.textContent || lb.firstChild.textContent).replace('*','').trim();
  const td = el.closest('td'), tr = el.closest('tr'), th = td.closest('table').tHead?.rows[0]?.cells[td.cellIndex];
  return `${(th?.textContent.trim() || 'Dòng hàng')} (dòng ${[...tr.parentNode.rows].indexOf(tr)+1})`; };
function updOcrAlert(card){
  const box = card.querySelector('.ocr-alert'); if(!box) return;
  const m = card.querySelectorAll('.ocr-miss').length, u = card.querySelectorAll('.ocr-unsure').length;
  box.classList.toggle('show', !!(m||u));
  box.innerHTML = (m ? `<b>⚠ Còn ${m} mục không đọc được từ phiếu</b> (viền đỏ) – phải nhập tay trước khi lưu. ` : '<b>✔ Đã nhập đủ các mục còn thiếu.</b> ')
    + (u ? `<span>${u} mục đọc chưa chắc chắn (viền cam) – kiểm tra lại.</span>` : '') + (m||u ? ' <a class="lnk" onclick="denMucThieu(this)">Đến mục đầu tiên →</a>' : '');
}
function denMucThieu(a){ const c = a.closest('.fcard'), el = c.querySelector('.ocr-miss') || c.querySelector('.ocr-unsure'); if(!el) return;
  const d = el.closest('details'); if(d) d.open = true; el.scrollIntoView({block:'center', behavior:'smooth'}); setTimeout(()=>el.focus(), 300); }
/* Chặn lưu khi còn mục chưa đọc được; mục chưa chắc chắn → hỏi xác nhận */
function kiemOCR(card){
  card.querySelectorAll('.ocr-miss').forEach(el=>{ if(ocrFilled(el)) ocrUnmark(el); }); updOcrAlert(card);
  const miss = [...card.querySelectorAll('.ocr-miss')];
  if(miss.length){
    toast(`⚠ Phiếu đọc từ ảnh còn ${miss.length} mục chưa đọc được – vui lòng nhập tay: ${[...new Set(miss.map(fieldName))].join(', ')}`, 6000);
    miss.forEach(e=>{ e.classList.remove('shake'); void e.offsetWidth; e.classList.add('shake'); });
    const d = miss[0].closest('details'); if(d) d.open = true; miss[0].scrollIntoView({block:'center'}); miss[0].focus();
    return false;
  }
  const un = [...card.querySelectorAll('.ocr-unsure')];
  if(un.length && !confirm(`Còn ${un.length} mục đọc từ ảnh chưa chắc chắn (viền cam):\n- ${[...new Set(un.map(fieldName))].join('\n- ')}\n\nBạn đã kiểm tra lại các mục này và muốn lưu phiếu?`)) return false;
  return true;
}
function dienPhieu(){
  const r = OCR.res; if(!r) return;
  const N = OCR.mode==='N', mark = [], REQ = OCR_REQ[OCR.mode];
  const has = (sel,v) => [...sel.options].some(o=>o.value===v);
  const setSel = (sel, v) => { if(!sel || v==null || v==='' || !has(sel,v)) return false; sel.value = v; sel.dataset.prev = v; mark.push(sel); return true; };
  const setInp = (inp, v) => { if(!inp || v==null || v==='') return false; inp.value = v; mark.push(inp); return true; };
  if(r.xe && !XE.includes(r.xe)){ XE.push(r.xe); EXTRA.xe.push(r.xe); }
  if(r.laixe && !LAIXE.some(x=>x.ten===r.laixe)){ LAIXE.push({ten:r.laixe, xe:r.xe||'', tt:'Đang làm'}); saveDL(); }
  let EL, ok;
  if(N){
    chonLoai(r.loai);
    if(r.noi && r.moi.noi) ADD_SAVE.nguon({ten:r.noi});
    saveExtra(); refreshSelects(); mark.push(nLoaiSel);
    EL = {noi:nNguon, ngay:nNgay, booking:nBooking, xe:nXe, laixe:nNguoi};
    ok = {noi:setSel(nNguon, r.noi), ngay:setInp(nNgay, r.ngay), booking:setInp(nBooking, r.ngayBK), xe:setSel(nXe, r.xe), laixe:setSel(nNguoi, r.laixe)};
    setInp(nGc, r.gc); setInp(nDT, dtLX(r.laixe));
  } else {
    chonLoaiX(r.loai);
    saveExtra(); refreshSelects(); mark.push(xLoaiSel);
    EL = {noi:xNoi, ngay:xNgay, don:xDon, xe:xXe, laixe:xNguoi};
    ok = {noi:setInp(xNoi, r.noi)}; if(ok.noi) noiChange();
    Object.assign(ok, {ngay:setInp(xNgay, r.ngay), don:setInp(xDon, r.don||r.booking), xe:setSel(xXe, r.xe), laixe:setSel(xNguoi, r.laixe)});
    setInp(xGc, r.gc); setInp(xDT, dtLX(r.laixe));
  }
  // dòng hàng
  const tb = N ? nLines : xLines, add = N ? addLineN : addLineX;
  if(r.lines.length || r.unk.length) tb.innerHTML = '';
  r.lines.forEach(l=>{ add(); const tr = tb.rows[tb.rows.length-1], pl = tr.querySelector('.pl'), sl = tr.querySelector('.sl');
    setSel(pl, l.ma);
    if(N){ setSel(tr.querySelector('select.dvt'), l.dvt); setInp(tr.querySelector('.hong'), l.pal ? String(l.hong||0) : null); setInp(tr.querySelector('.lo'), l.lo); }
    else if(tr.querySelector('select.lo')){ fillLots(tr); setSel(tr.querySelector('select.lo'), l.lo); setSel(tr.querySelector('select.dvt'), l.dvt); }
    if(l.sl==null){ sl.value = ''; } else setInp(sl, String(l.sl));
    if(!N) updLine(tr);
    mark.forEach(e=>e.classList.add('ocr'));
    if(l.sl==null) ocrMark(sl, 'miss', 'Không đọc được số lượng – nhập tay'); else if(l.uSl) ocrMark(sl, 'unsure', 'Số lượng đọc chưa chắc chắn');
    if(l.uMa) ocrMark(pl, 'unsure', 'Tên hàng đọc chưa rõ – kiểm tra'); });
  r.unk.forEach(u=>{ add(); const tr = tb.rows[tb.rows.length-1], pl = tr.querySelector('.pl'), sl = tr.querySelector('.sl');
    blankSel(pl); sl.value = '';
    if(!N){ const lo = tr.querySelector('select.lo'); if(lo) lo.innerHTML = '<option value="">— chọn mặt hàng trước —</option>'; updLine(tr); }
    ocrMark(pl, 'miss', `Không nhận ra mặt hàng: "${esc(u.slice(0,40))}" – chọn tay`); ocrMark(sl, 'miss', 'Nhập số lượng'); });
  if(!r.lines.length && !r.unk.length){ const sl = tb.rows[0].querySelector('.sl'); sl.value = ''; ocrMark(sl, 'miss', 'Không đọc được dòng hàng nào – nhập tay'); }
  N ? updSumN() : updSumX();
  mark.forEach(e=>{ if(!e.classList.contains('ocr-miss') && !e.classList.contains('ocr-unsure')) e.classList.add('ocr'); const d = e.closest('details'); if(d) d.open = true; });
  if(r.un.loai) ocrMark(N?nLoaiSel:xLoaiSel, 'unsure', 'Không thấy tên hàng trên phiếu – kiểm tra loại hàng');
  // thông tin đầu phiếu: không đọc được → đỏ (bắt buộc nhập tay), chưa chắc chắn → cam
  REQ.forEach(k=>{ const el = EL[k]; if(!el) return;
    if(!ok[k]){ el.tagName==='SELECT' ? blankSel(el) : (el.value = ''); ocrMark(el, 'miss'); }
    else if(r.un[k]) ocrMark(el, 'unsure', r.moi[k] ? 'Mục mới đọc từ phiếu – kiểm tra chính tả' : null); });
  OCR.used = OCR.name ? OCR.mode : '';
  const card = CARD(OCR.mode); updOcrAlert(card);
  dongOCR(); go(N ? 'nhap' : 'xuat');
  const m = card.querySelectorAll('.ocr-miss').length;
  toast(m ? `⚠ Đã điền từ ảnh – còn ${m} mục không đọc được (viền đỏ), vui lòng nhập tay` : `✔ Đã điền ${mark.filter(e=>!e.closest('.lines')).length} thông tin + ${r.lines.length} dòng hàng – kiểm tra rồi lưu phiếu`, 5000);
}
// Người dùng sửa ô: bỏ tô vàng; ô đỏ đã có giá trị → bỏ cảnh báo; ô cam được sửa / chọn lại → coi như đã kiểm tra
['input','change'].forEach(ev=>document.addEventListener(ev, e=>{
  const el = e.target; if(!el.classList) return; el.classList.remove('ocr');
  if(el.classList.contains('ocr-unsure') && !el.classList.contains('ocr-miss')) ocrUnmark(el);
  setTimeout(()=>{ const card = el.closest?.('.fcard'); if(!card) return;
    card.querySelectorAll('.ocr-miss').forEach(x=>{ if(ocrFilled(x)) ocrUnmark(x); }); updOcrAlert(card); }, 0);
}, true));

/* ---------- ĐIỀU HƯỚNG (desktop: thanh trái · điện thoại: thanh dưới + menu trượt) ---------- */
const TITLES = {luutru:'Lưu trữ biên bản',baocao:'Báo cáo thừa / thiếu',dashboard:'Tổng quan',nhap:'Phiếu nhập kho',xuat:'Phiếu xuất kho',ton:'Tồn kho (N–X–T)',doisoat:'Thu hồi / trả về',lichsu:'Lịch sử giao dịch',dulieu:'Lái xe & nhân viên kho',danhmuc:'Danh mục'};
function go(id){
  document.querySelectorAll('.page').forEach(s=>s.classList.toggle('active',s.id===id));
  document.querySelectorAll('#nav a, #bnav a[data-page]').forEach(a=>a.classList.toggle('active',a.dataset.page===id));
  bnav.querySelector('[data-more]').classList.toggle('active', !['dashboard','nhap','xuat','ton'].includes(id));
  pageTitle.textContent = TITLES[id];
  filterWrap.style.visibility = ['nhap','xuat','danhmuc','dulieu'].includes(id) ? 'hidden' : 'visible';
  toggleSide(false); window.scrollTo(0,0);
}
function toggleSide(v){ document.querySelector('.app').classList.toggle('side-open', v); }
nav.addEventListener('click',e=>{const a=e.target.closest('a');if(a)go(a.dataset.page)});
bnav.addEventListener('click',e=>{const a=e.target.closest('a'); if(!a) return; a.dataset.page ? go(a.dataset.page) : toggleSide(true);});
function toast(m,ms=2600){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('show'),ms)}
function renderAll(){renderDashboard();renderTon();renderDoiSoat();renderLichSu();renderBaoCao();renderLuuTru();}

/* Gắn nhãn cột cho từng ô → trên điện thoại bảng hiển thị dạng thẻ */
function labelTables(){
  document.querySelectorAll('table.stack, table.lines').forEach(tb=>{
    const hs = [...(tb.tHead?.rows[0]?.cells||[])].map(th=>th.textContent.trim());
    tb.querySelectorAll('tbody tr').forEach(tr=>{ if(tr.cells.length!==hs.length) return;
      [...tr.cells].forEach((td,i)=>{ if(td.dataset.l!==hs[i]) td.dataset.l = hs[i]; }); });
  });
}
new MutationObserver(()=>{ cancelAnimationFrame(labelTables._r); labelTables._r = requestAnimationFrame(labelTables); })
  .observe(document.querySelector('.app'),{childList:true,subtree:true});

tFrom.value = fmtISO(new Date(today.getFullYear(),today.getMonth(),1)); tTo.value = TODAY;
fLoai.innerHTML = '<option value="">Tất cả loại hàng</option>' + LOAI.map(o=>opt(o.ma,o.ten)).join('');
lsPallet.innerHTML = '<option value="">Tất cả mặt hàng</option>' + [...PALLETS,...allHang()].map(p=>opt(p.ma,p.ten)).join('');
chonLoai(NLOAI); chonLoaiX(XLOAI); renderDanhMuc(); renderDuLieu(); renderCty(); renderAll(); labelTables();
