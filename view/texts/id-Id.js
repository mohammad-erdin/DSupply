var Dic={};

Dic["new"]="Buat Baru";
Dic["refresh"]="Muat Ulang";
Dic["edit"]="Edit";
Dic["delete"]="Hapus";
Dic["deleteAll"]="Hapus Semua";
Dic["save"]="Simpan";
Dic["cancel"]="Batal";
Dic["close"]="Tutup";
Dic["show"]="Tampilkan";
Dic["clearFilter"]="Ulangi Filter";
Dic["showSR"]="Sub Rayon";
Dic["updateUser"]="Update account";


Dic["areYouSure"]="Apakah anda yakin ?";
Dic["deleteSekolah"]='Anda akan menghapus sekolah <b>{0}</b>.</br>Menghapus Sekolah akan menghapus seluruh data siswanya.<br>Tekan OK untuk melanjutkan.';
Dic["deleteSiswa"]='Anda akan menghapus siswa bernama <b>{0}</b>.</br>Tekan OK untuk melanjutkan.';
Dic["deleteSiswaAll"]='Anda akan menghapus semua siswa pada sekolah ini.</br>Tekan OK untuk melanjutkan.';

Dic["deleteUser"]='Anda akan menghapus User bernama <b>{0}</b>.</br>Tekan OK untuk melanjutkan.';

//invalid form validation
Dic["invalid"]="Proses penyimpanan tidak dapat dilakukam.<br>Mohon periksa kembali semua Field";
Dic["invalid-exist-paralel"]="Siswa dengan kombinasi PARALEL & Absen ini sudah ada";
Dic["invalid-exist-absen"]="Siswa dengan kombinasi Paralel & ABSEN ini sudah ada";
Dic["invalid-exist-kd_sek"]="Kode sekolah sudah ada";
Dic["invalid-exist-kd_rayon"]="Kode Rayon sudah ada";
Dic["invalid-exist-kd_prop"]="Kode Provinsi sudah ada";
Dic["invalid-exist-username"]="Username sudah ada";

Dic["invalid-old-password"]="Password lama salah";
Dic["invalid-password-2"]="Password tidak sama";


function _text(t) { 
	try {return Dic[t];} 
	catch(e){return '';}
}
