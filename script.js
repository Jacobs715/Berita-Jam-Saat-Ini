const hourHand = document.getElementById("hourHand");
const minuteHand = document.getElementById("minuteHand");
const secondHand = document.getElementById("secondHand");

const digitalTime = document.getElementById("digitalTime");
const dateText = document.getElementById("dateText");

const newsText = document.getElementById("newsText");
const newsTime = document.getElementById("newsTime");


// ==========================
// MASUKKAN API KEY GNEWS
// ==========================

const API_KEY = "c294949fd491007cea525c68595a7885";


// ==========================
// BERITA CADANGAN
// ==========================

let berita = [

"Perkembangan berita nasional Indonesia terbaru hari ini.",
"Informasi ekonomi dan kebijakan terbaru dari Indonesia.",
"Berita teknologi yang sedang ramai diperbincangkan.",
"Peristiwa penting yang menjadi perhatian masyarakat Indonesia.",
"Update olahraga dan hiburan populer tanah air."

];

let indexBerita = 0;
let menitTerakhir = -1;


// ==========================
// FORMAT WAKTU WIB
// ==========================

function getWIB(){

    const sekarang = new Date();

    const bagian = new Intl.DateTimeFormat("en-US",{
        timeZone:"Asia/Jakarta",
        hour12:false,
        hour:"2-digit",
        minute:"2-digit",
        second:"2-digit",
        weekday:"long",
        year:"numeric",
        month:"long",
        day:"numeric"
    }).formatToParts(sekarang);

    let data={};

    bagian.forEach(item=>{
        data[item.type]=item.value;
    });

    return{
        jam:Number(data.hour),
        menit:Number(data.minute),
        detik:Number(data.second),
        tanggal:`${data.weekday}, ${data.day} ${data.month} ${data.year}`
    };

}


// ==========================
// JAM ANALOG
// ==========================

function updateClock(){

    const w = getWIB();

    const hourDeg =
        (w.jam % 12) * 30 +
        w.menit * 0.5;

    const minuteDeg =
        w.menit * 6 +
        w.detik * 0.1;

    const secondDeg =
        w.detik * 6;

    hourHand.style.transform =
        `translateX(-50%) rotate(${hourDeg}deg)`;

    minuteHand.style.transform =
        `translateX(-50%) rotate(${minuteDeg}deg)`;

    secondHand.style.transform =
        `translateX(-50%) rotate(${secondDeg}deg)`;

    digitalTime.textContent =
        String(w.jam).padStart(2,"0")+":"+
        String(w.menit).padStart(2,"0")+":"+
        String(w.detik).padStart(2,"0");

    dateText.textContent = w.tanggal;


    // Jika menit berubah
    if(w.menit !== menitTerakhir){

        menitTerakhir = w.menit;

        gantiBerita();

    }

}


// ==========================
// GANTI BERITA
// ==========================

function gantiBerita(){

    if(berita.length===0)return;

    indexBerita++;

    if(indexBerita>=berita.length){
        indexBerita=0;
    }

    tampilkanBerita();

}


function tampilkanBerita(){

    const w = getWIB();

    newsText.style.animation="none";

    void newsText.offsetWidth;

    newsText.textContent = berita[indexBerita];

    newsText.style.animation="jalan 18s linear infinite";

    newsTime.textContent =
        `Di jam ${String(w.jam).padStart(2,"0")}:${String(w.menit).padStart(2,"0")} WIB • Berita sedang berlangsung di Indonesia`;

}


// ==========================
// AMBIL BERITA HOT
// ==========================

async function ambilBerita(){

    if(API_KEY==="c294949fd491007cea525c68595a7885"){

        console.log("API belum diisi");

        tampilkanBerita();

        return;

    }

    try{

        const url =
        `https://gnews.io/api/v4/top-headlines?category=nation&lang=id&country=id&max=10&apikey=${API_KEY}`;

        const response = await fetch(url);

        const data = await response.json();

        if(data.articles && data.articles.length>0){

            berita = data.articles.map(item =>
                item.title
            );

            indexBerita = 0;

            tampilkanBerita();

        }

    }

    catch(error){

        console.log("Gagal mengambil berita",error);

        tampilkanBerita();

    }

}


// ==========================
// MULAI
// ==========================

ambilBerita();

updateClock();

setInterval(updateClock,1000);


// cek pergantian menit

setInterval(()=>{

    const w = getWIB();

    if(w.detik===0){

        ambilBerita();

    }

},1000);