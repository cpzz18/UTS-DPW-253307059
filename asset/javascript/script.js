function initMarquee() {
    var container = document.getElementById('marqueeList');
    if (!container) return;

    var testimonials = [
        { rating: 5, text: "Luar biasa. Proses pendaftaran sangat mudah dan transparan. Anak saya sekarang berkembang pesat di SGN.", name: "Bapak Ahmad", role: "Orang Tua Kelas 7" },
        { rating: 5, text: "Fasilitas modern dan guru-guru sangat profesional. SGN pilihan terbaik untuk masa depan anak.", name: "Ibu Siti", role: "Orang Tua Kelas 9" },
        { rating: 4, text: "Sistem online yang user-friendly, semua informasi jadwal jelas. Sangat direkomendasikan.", name: "Bapak Budi", role: "Orang Tua Kelas 10" },
        { rating: 5, text: "Guru-guru sangat ramah dan profesional. Anak saya betah belajar di SGN.", name: "Ibu Rina", role: "Orang Tua Kelas 8" },
        { rating: 5, text: "Kurikulum internasional membuat anak saya siap bersaing di era global.", name: "Bapak Hendra", role: "Orang Tua Kelas 11" }
    ];

    function getStars(rating) {
        var stars = '';
        for (var i = 1; i <= 5; i++) stars += i <= rating ? '★' : '☆';
        return stars;
    }

    function createCard(data) {
        var card = document.createElement('div');
        card.className = 'testimonial-card-marquee';
        card.innerHTML = '<div class="rating">' + getStars(data.rating) + '</div>' +
            '<p>"' + data.text + '"</p>' +
            '<div class="author">' +
                '<div class="avatar">' + data.name.charAt(0) + '</div>' +
                '<div class="author-info">' +
                    '<strong>' + data.name + '</strong>' +
                    '<span>' + data.role + '</span>' +
                '</div>' +
            '</div>';
        return card;
    }

    container.innerHTML = '';
    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < testimonials.length; j++) {
            container.appendChild(createCard(testimonials[j]));
        }
    }
}

function showToast(msg, type) {
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.className = 'toast ' + (type === 'error' ? 'error' : 'success') + ' show';
    setTimeout(function() { toast.className = 'toast'; }, 3000);
}

function animateCounter(el, target) {
    var current = 0;
    var inc = target / 50;
    var timer = setInterval(function() {
        current += inc;
        if (current >= target) { el.textContent = target; clearInterval(timer); }
        else { el.textContent = Math.floor(current); }
    }, 20);
}

function initCounters() {
    var counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                animateCounter(entry.target, parseInt(entry.target.getAttribute('data-count'), 10));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(function(c) { observer.observe(c); });
}

function initAccordion() {
    document.querySelectorAll('.accordion-header').forEach(function(header) {
        header.addEventListener('click', function() {
            this.parentElement.classList.toggle('active');
        });
    });
}

var currentStep = 1;
var totalSteps = 3;

function updateFormSteps() {
    for (var i = 1; i <= totalSteps; i++) {
        var step = document.getElementById('step' + i);
        if (step) step.classList.remove('active');
    }
    var curr = document.getElementById('step' + currentStep);
    if (curr) curr.classList.add('active');

    document.querySelectorAll('.progress-step').forEach(function(step, idx) {
        if (idx + 1 === currentStep) step.classList.add('active');
        else step.classList.remove('active');
    });
}

function goToStep(step) {
    if (step < 1 || step > totalSteps) return;
    if (step > currentStep && !validateCurrentStep()) return;
    currentStep = step;
    updateFormSteps();
    if (currentStep === 3) updatePreview();
}

function validateCurrentStep() {
    if (currentStep === 1) {
        var name = document.getElementById('fullname');
        var nik = document.getElementById('nik');
        if (!name.value.trim()) { showToast('Nama Lengkap tidak boleh kosong!', 'error'); name.focus(); return false; }
        if (!nik.value.trim()) { showToast('NIK tidak boleh kosong!', 'error'); nik.focus(); return false; }
        if (nik.value.trim().length !== 16 || isNaN(nik.value.trim())) { showToast('NIK harus 16 digit angka!', 'error'); nik.focus(); return false; }
    }
    if (currentStep === 2) {
        var jalur = document.getElementById('jalur');
        if (!jalur.value) { showToast('Silakan pilih Jalur Pendaftaran!', 'error'); jalur.focus(); return false; }
    }
    return true;
}

function updatePreview() {
    var name = document.getElementById('fullname');
    var nik = document.getElementById('nik');
    var tempat = document.getElementById('tempat_lahir');
    var tgl = document.getElementById('tanggal_lahir');
    var jalurSelect = document.getElementById('jalur');
    var asal = document.getElementById('asal_sekolah');

    var pName = document.getElementById('preview_nama');
    var pNik = document.getElementById('preview_nik');
    var pLahir = document.getElementById('preview_lahir');
    var pJalur = document.getElementById('preview_jalur');
    var pSekolah = document.getElementById('preview_sekolah');

    if (pName) pName.textContent = name ? (name.value.trim() || '-') : '-';
    if (pNik) pNik.textContent = nik ? (nik.value.trim() || '-') : '-';
    if (pLahir) pLahir.textContent = (tempat?.value.trim() || '-') + ', ' + (tgl?.value || '-');
    if (pJalur && jalurSelect) pJalur.textContent = jalurSelect.options[jalurSelect.selectedIndex]?.text || '-';
    if (pSekolah) pSekolah.textContent = asal ? (asal.value.trim() || '-') : '-';
}

function handleFormSubmit() {
    var name = document.getElementById('fullname');
    var nik = document.getElementById('nik');
    var jalur = document.getElementById('jalur');
    var confirmBox = document.getElementById('confirmData');
    var submitBtn = document.getElementById('submitBtn');

    if (!name.value.trim()) { showToast('Nama Lengkap tidak boleh kosong!', 'error'); goToStep(1); return; }
    if (!nik.value.trim() || nik.value.trim().length !== 16 || isNaN(nik.value.trim())) { showToast('NIK harus 16 digit angka!', 'error'); goToStep(1); return; }
    if (!jalur.value) { showToast('Silakan pilih Jalur Pendaftaran!', 'error'); goToStep(2); return; }
    if (!confirmBox.checked) { showToast('Silakan konfirmasi data!', 'error'); return; }

    showToast('Pendaftaran BERHASIL! Selamat ' + name.value.trim(), 'success');
    document.getElementById('registrationForm').reset();
    currentStep = 1;
    updateFormSteps();
    if (submitBtn) submitBtn.disabled = true;
}

function initForm() {
    document.querySelectorAll('.btn-next').forEach(function(btn) {
        btn.addEventListener('click', function() { goToStep(parseInt(this.getAttribute('data-next'), 10)); });
    });
    document.querySelectorAll('.btn-prev').forEach(function(btn) {
        btn.addEventListener('click', function() { goToStep(parseInt(this.getAttribute('data-prev'), 10)); });
    });

    var confirmBox = document.getElementById('confirmData');
    var submitBtn = document.getElementById('submitBtn');
    if (confirmBox && submitBtn) {
        confirmBox.addEventListener('change', function() { submitBtn.disabled = !this.checked; });
    }

    var nikInput = document.getElementById('nik');
    if (nikInput) {
        nikInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '').slice(0, 16);
            var fb = this.parentElement.querySelector('.input-feedback');
            if (fb) {
                if (this.value.length === 16) { fb.textContent = 'NIK valid'; fb.className = 'input-feedback success'; }
                else if (this.value.length > 0) { fb.textContent = 'NIK harus 16 digit (' + this.value.length + '/16)'; fb.className = 'input-feedback error'; }
                else { fb.textContent = ''; }
            }
        });
    }

    var nameInput = document.getElementById('fullname');
    if (nameInput) {
        nameInput.addEventListener('input', function() {
            var fb = this.parentElement.querySelector('.input-feedback');
            if (fb && this.value.trim().length > 0) { fb.textContent = 'Nama lengkap terisi'; fb.className = 'input-feedback success'; }
            else if (fb) { fb.textContent = ''; }
        });
    }
}

function initTimelineAnimation() {
    var steps = document.querySelectorAll('.timeline-step');
    var cards = document.querySelectorAll('.detail-card');
    if (!steps.length || !cards.length) return;

    steps.forEach(function(step) {
        step.addEventListener('mouseenter', function() {
            var stepNum = parseInt(this.getAttribute('data-step'), 10);
            cards.forEach(function(card) {
                if (parseInt(card.getAttribute('data-step'), 10) === stepNum) {
                    card.style.transform = 'translateX(10px)';
                    card.style.boxShadow = 'var(--shadow-lg)';
                }
            });
        });
        step.addEventListener('mouseleave', function() {
            cards.forEach(function(card) {
                card.style.transform = '';
                card.style.boxShadow = '';
            });
        });
    });
}

function initScrollReveal() {
    var elements = document.querySelectorAll('.fade-in');
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(function(el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
}

function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', function() {
        btn.classList.toggle('show', window.scrollY > 300);
    });
    btn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function initModal() {
    var modal = document.getElementById('modalSyarat');
    var daftarBtn = document.getElementById('daftarBtn');
    var agree = document.getElementById('agreeTerms');
    var confirmBtn = document.getElementById('confirmBtn');
    var cancelBtn = document.getElementById('cancelBtn');
    var closeBtn = document.querySelector('.modal-close');

    if (!modal || !daftarBtn) return;

    function openModal() { modal.classList.add('show'); if (agree) agree.checked = false; if (confirmBtn) confirmBtn.disabled = true; }
    function closeModal() { modal.classList.remove('show'); }
    function redirect() { window.location.href = 'form.html'; }

    daftarBtn.addEventListener('click', function(e) { e.preventDefault(); openModal(); });
    if (agree) agree.addEventListener('change', function() { confirmBtn.disabled = !this.checked; });
    if (confirmBtn) confirmBtn.addEventListener('click', function() { closeModal(); redirect(); });
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', function(e) { if (e.target === modal) closeModal(); });
}

document.addEventListener('DOMContentLoaded', function() {
    initScrollReveal();
    initAccordion();
    initTimelineAnimation();
    initCounters();
    initMarquee();
    initBackToTop();
    initModal();

    if (document.getElementById('registrationForm')) initForm();

    var pageHeader = document.querySelector('.page-header');
    if (pageHeader) {
        pageHeader.style.opacity = '0';
        pageHeader.style.transform = 'translateY(30px)';
        setTimeout(function() {
            pageHeader.style.transition = 'all 0.6s ease-out';
            pageHeader.style.opacity = '1';
            pageHeader.style.transform = 'translateY(0)';
        }, 100);
    }

    var submitBtn = document.getElementById('submitBtn');
    if (submitBtn) submitBtn.addEventListener('click', handleFormSubmit);
});