//1.Render song
//2.Scroll Top
//3.Play / pause / seek
//4.CD rotate
//5.Next / prev
//6.Random song
//7.Next / Repeat when ended
//8.Active song
//9.Scroll active song into view
//10.Play song when click

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PlAYER_STORAGE_KEY = "Album-Player";

const progress = $('#progress');
const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const platBtn = $('.btn-toggle-play');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
    currentIndex : 0,
    isPlaying:false,
    isRandom:false,
    isRepeat:false,
    config:JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name:"Biển xanh sâu thẳm",
            singer:"Lil’Knight ft. Binz",
            path:"./music/song1.mp3",
            img:"./img/song1.jpg"
        },
        {
            name:"Nói dối",
            singer:"Ronboogz ",
            path:"./music/song2.mp3",
            img:"./img/song2.jpg"
        },
        {
            name:"Bạn đời",
            singer:"Karik ft. Gducky",
            path:"./music/song3.mp3",
            img:"./img/song3.jpg"
        },
        {
            name:"Wish",
            singer:"Gducky",
            path:"./music/song4.mp3",
            img:"./img/song4.jpg"
        },
        {
            name:"Khi cơn mơ dần phai",
            singer:"Tez ft. Myra Trần",
            path:"./music/song5.mp3",
            img:"./img/song5.jpg"
        },
        {
            name:"Rolling Down",
            singer:"Captain",
            path:"./music/song6.mp3",
            img:"./img/song6.jpg"
        },
        {
            name:"Hai đứa nhóc",
            singer:"Ronboogz ",
            path:"./music/song7.mp3",
            img:"./img/song7.jpg"
        },
        {
            name:"Chịu cách nói mình thua",
            singer:"Rhyder ft. Ban x Coolkid",
            path:"./music/song8.mp3",
            img:"./img/song8.jpg"
        },
        {
            name:"Nụ hôn Bisou",
            singer:"Mike",
            path:"./music/song9.mp3",
            img:"./img/song9.jpg"
        },
        {
            name:"Đánh đổi",
            singer:"Obito ft. Rpt MCK",
            path:"./music/song10.mp3",
            img:"./img/song10.jpg"
        }
    ],
    setconfig:function(key,value){
        this.config[key] = value
        localStorage.setItem(PlAYER_STORAGE_KEY,JSON.stringify(this.config))
    },
    render: function(){
        const htmls = this.songs.map((song,index) => {
            const isActive = index === this.currentIndex ? 'active' : ''; // Kiểm tra xem index có là currentIndex không
            return `      
            <div class="song ${isActive}" data-index="${index}">
                  <div class="thumb"
                      style="background-image: url('${song.img}')">
                  </div>
                  <div class="body">
                      <h3 class="title">${song.name}</h3>
                      <p class="author">${song.singer}</p>
                  </div>
                  <div class="option">
                      <i class="fas fa-ellipsis-h"></i>
                  </div>
            </div>
          `;
        })
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function(){
        Object.defineProperty(this,'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    handlerEvent: function(){
        const _this = this
        const cdwidth = cd.offsetWidth

        //Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration: 10000, // 10 giây
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        //Xử lý phóng to, thu nhỏ cd
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newcdWidth = cdwidth - scrollTop
            
            cd.style.width = newcdWidth > 0 ?  newcdWidth + 'px' : 0
            cd.style.opacity = newcdWidth / cdwidth

        }

        //Xử lý khi click play
        platBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause()
            }else{
                audio.play()
            }
        }

        //Khi song được play
        audio.onplay = function(){
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        //Khi song được bị pause
        audio.onpause = function(){
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration){
                progress.value = (audio.currentTime / audio.duration) * 100;
            }
        };
        //Khi tua bài hát
        progress.oninput = function() {
            var seekTime = audio.duration * (progress.value / 100);
            audio.currentTime = seekTime;
        };
        //Khi next bài hát
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.randomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        //Khi prev bài hát
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.randomSong()
            }else{
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        //Xử lý random song
        randomBtn.onclick = function(){
            _this.isRandom = !_this.isRandom
            _this.setconfig('isRandom',_this.isRandom)
            randomBtn.classList.toggle('active',_this.isRandom)

            // Kiểm tra nếu đang ở chế độ random thì tắt chế độ repeat
            if (_this.isRandom && _this.isRepeat) {
                _this.isRepeat = false;
                repeatBtn.classList.remove('active');
            }
        }
        //Xử lý repeat song
        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat
            _this.setconfig('isRepeat',_this.isRepeat)
            repeatBtn.classList.toggle('active',_this.isRepeat)

            // Kiểm tra nếu đang ở chế độ repeat thì tắt chế độ random
            if (_this.isRepeat && _this.isRandom) {
                _this.isRandom = false;
                randomBtn.classList.remove('active');
            }
        }

        //Xử lý audio khi bài hát kết thúc
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            }else{
                nextBtn.click()
            }
        }
        //Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e){ 
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')){
                //Xử lý khi click vào song
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
            }
        }
    },
    scrollToActiveSong: function(){
        setTimeout(() => {
            const activeSong = $(".song.active");
            if (this.currentIndex === 0) {
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else if (activeSong) {
                activeSong.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
        }, 300);
    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0 ){
            this.currentIndex = this.songs.length-1
        }
        this.loadCurrentSong()
    },
    randomSong: function(){
        let newIndex
        if (this.playedSongs.length === this.songs.length) {
            this.playedSongs = []; // Nếu đã phát qua tất cả các bài hát, reset danh sách đã phát
        }
        do{
            newIndex = Math.floor(Math.random() * this.songs.length);
        }while(this.playedSongs.includes(newIndex))
        this.currentIndex = newIndex
        this.loadCurrentSong()
        this.playedSongs.push(newIndex)
    },
    start: function(){
        //Gán cấu hình từ config vào ứng dụng
        this.loadConfig()
        //Tạo mảng hạn chế lặp bài khi random
        this.playedSongs = []
        //Định nghĩa các thuộc tính cho Object
        this.defineProperties()
        //Lắng nghe xử lý các sự kiện
        this.handlerEvent()
        //Tải thông tin bài hát đầu tiên vào UI Khi chạy ứng dụng
        this.loadCurrentSong()
        //Render playlist
        this.render()
        
    }
}

app.start()