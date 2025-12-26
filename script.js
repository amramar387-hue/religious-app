// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // إخفاء شاشة التحميل بعد 2 ثانية
    setTimeout(function() {
        document.getElementById('loadingScreen').style.opacity = '0';
        document.getElementById('loadingScreen').style.visibility = 'hidden';
        
        // عرض شاشة تسجيل الدخول
        document.getElementById('loginScreen').style.display = 'flex';
    }, 2000);
    
    // تهيئة جميع عناصر التطبيق
    initApp();
});

// تهيئة التطبيق
function initApp() {
    // تحديث التاريخ الهجري والميلادي
    updateDate();
    
    // تحديث الذكر اليومي
    updateDailyReminder();
    
    // تحديث سؤال اليوم
    updateDailyQuestion();
    
    // تهيئة أحداث الأزرار
    initButtons();
    
    // تهيئة التنقل
    initNavigation();
    
    // تحديث مواقيت الصلاة
    updatePrayerTimes();
    
    // تهيئة البوصلة
    initCompass();
}

// تحديث التاريخ
function updateDate() {
    const dateElement = document.getElementById('currentDate');
    const now = new Date();
    
    // التاريخ الميلادي
    const gregorianDate = now.toLocaleDateString('ar-SA', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // التاريخ الهجري (تقريبي)
    const hijriDate = getHijriDate(now);
    
    dateElement.textContent = `${gregorianDate} | ${hijriDate}`;
}

// حساب التاريخ الهجري (تقريبي)
function getHijriDate(gregorianDate) {
    // هذا حساب تقريبي، في التطبيق الحقيقي يجب استخدام مكتبة دقيقة
    const hijriMonthNames = [
        'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 
        'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 
        'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
    ];
    
    // تحويل تقريبي من الميلادي إلى الهجري
    const hijriYear = Math.floor((gregorianDate.getFullYear() - 622) * 1.03);
    const hijriMonth = hijriMonthNames[gregorianDate.getMonth()];
    const hijriDay = gregorianDate.getDate();
    
    return `${hijriDay} ${hijriMonth} ${hijriYear} هـ`;
}

// تحديث الذكر اليومي
function updateDailyReminder() {
    const reminderText = document.getElementById('reminderText');
    const reminderSource = document.getElementById('reminderSource');
    
    // اختيار ذكر عشوائي بناء على يوم الشهر
    const today = new Date().getDate();
    const index = today % dailyReminders.length;
    const reminder = dailyReminders[index];
    
    reminderText.textContent = reminder.text;
    reminderSource.textContent = reminder.source;
}

// تحديث سؤال اليوم
function updateDailyQuestion() {
    const questionElement = document.getElementById('dailyQuestion');
    
    // اختيار سؤال عشوائي بناء على يوم السنة
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const index = dayOfYear % dailyQuestions.length;
    
    questionElement.textContent = dailyQuestions[index];
}

// تحديث مواقيت الصلاة
function updatePrayerTimes() {
    // هذا مثال بمواقيت افتراضية
    // في التطبيق الحقيقي، يجب الحصول على مواقيت الصلاة بناء على موقع المستخدم
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // تحديد الصلاة الحالية والقادمة
    const prayerTimes = [
        {name: 'الفجر', hour: 4, minute: 30},
        {name: 'الشروق', hour: 5, minute: 45},
        {name: 'الظهر', hour: 12, minute: 15},
        {name: 'العصر', hour: 15, minute: 45},
        {name: 'المغرب', hour: 18, minute: 30},
        {name: 'العشاء', hour: 20, minute: 0}
    ];
    
    let currentPrayerIndex = -1;
    let nextPrayerIndex = -1;
    
    for (let i = 0; i < prayerTimes.length; i++) {
        const prayer = prayerTimes[i];
        const prayerTime = prayer.hour * 60 + prayer.minute;
        const currentTime = currentHour * 60 + currentMinute;
        
        if (currentTime >= prayerTime) {
            currentPrayerIndex = i;
        } else {
            nextPrayerIndex = i;
            break;
        }
    }
    
    // إذا لم توجد صلاة قادمة (بعد العشاء)، تكون الصلاة القادمة هي الفجر
    if (nextPrayerIndex === -1) {
        nextPrayerIndex = 0;
    }
    
    // تحديث البادج الخاص بالصلاة القادمة
    const nextPrayerBadge = document.getElementById('nextPrayer');
    const nextPrayer = prayerTimes[nextPrayerIndex];
    
    // حساب الوقت المتبقي للصلاة القادمة
    const nextPrayerTime = nextPrayer.hour * 60 + nextPrayer.minute;
    const currentTime = currentHour * 60 + currentMinute;
    let timeRemaining = nextPrayerTime - currentTime;
    
    // إذا كانت الصلاة القادمة هي الفجر وكان الوقت بعد منتصف الليل
    if (nextPrayerIndex === 0 && timeRemaining < 0) {
        timeRemaining += 24 * 60; // إضافة 24 ساعة
    }
    
    const hoursRemaining = Math.floor(timeRemaining / 60);
    const minutesRemaining = timeRemaining % 60;
    
    if (hoursRemaining > 0) {
        nextPrayerBadge.textContent = `${nextPrayer.name} بعد ${hoursRemaining} س`;
    } else {
        nextPrayerBadge.textContent = `${nextPrayer.name} بعد ${minutesRemaining} د`;
    }
}

// تهيئة البوصلة
function initCompass() {
    const compass = document.querySelector('.compass');
    const needle = document.querySelector('.needle');
    
    // في التطبيق الحقيقي، يجب استخدام API الجيولوكيشن لتحديد اتجاه القبلة
    // هذا مثال مع اتجاه افتراضي
    
    // زاوية القبلة (جنوب شرق)
    const qiblaAngle = 115;
    
    // تدوير البوصلة لتعيين اتجاه القبلة
    compass.style.transform = `rotate(${qiblaAngle}deg)`;
    needle.style.transform = `rotate(${-qiblaAngle}deg)`;
    
    // تحديث معلومات القبلة
    document.querySelector('.qibla-info p:first-child strong').textContent = 'جنوب شرق';
    document.querySelector('.qibla-info p:last-child strong').textContent = `${qiblaAngle}°`;
}

// تهيئة أحداث الأزرار
function initButtons() {
    // زر تحديث الذكر
    document.getElementById('refreshReminder').addEventListener('click', function() {
        updateDailyReminder();
        
        // تأثير دوران الأيقونة
        this.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            this.style.transform = 'rotate(0deg)';
        }, 300);
    });
    
    // زر فتح القائمة الجانبية
    document.getElementById('menuBtn').addEventListener('click', function() {
        document.getElementById('sidebar').style.right = '0';
    });
    
    // زر إغلاق القائمة الجانبية
    document.getElementById('closeSidebar').addEventListener('click', function() {
        document.getElementById('sidebar').style.right = '-300px';
    });
    
    // زر فتح الإشعارات
    document.getElementById('notificationBtn').addEventListener('click', function() {
        document.getElementById('notificationsPanel').style.left = '0';
    });
    
    // زر إغلاق الإشعارات
    document.getElementById('closeNotifications').addEventListener('click', function() {
        document.getElementById('notificationsPanel').style.left = '-350px';
    });
    
    // زر تسجيل الدخول بفيسبوك
    document.getElementById('facebookLogin').addEventListener('click', function() {
        loginWithFacebook();
    });
    
    // زر تسجيل الدخول بجوجل
    document.getElementById('googleLogin').addEventListener('click', function() {
        loginWithGoogle();
    });
    
    // زر الدخول كزائر
    document.getElementById('guestLogin').addEventListener('click', function() {
        loginAsGuest();
    });
    
    // زر تسجيل الخروج
    document.getElementById('logoutBtn').addEventListener('click', function() {
        logout();
    });
    
    // زر تحديد اتجاه القبلة
    document.getElementById('findQibla').addEventListener('click', function() {
        findQiblaDirection();
    });
    
    // أحداث أزرار الأذكار
    const zekrButtons = document.querySelectorAll('.zekr-done');
    zekrButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('active');
            this.innerHTML = this.classList.contains('active') 
                ? '<i class="fas fa-check-circle"></i>' 
                : '<i class="far fa-check-circle"></i>';
        });
    });
}

// تهيئة التنقل
function initNavigation() {
    // التنقل السفلي
    const navItems = document.querySelectorAll('.nav-item');
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    
    function setActiveNav(targetId) {
        // إزالة النشاط من جميع العناصر
        navItems.forEach(item => item.classList.remove('active'));
        sidebarLinks.forEach(link => link.parentElement.classList.remove('active'));
        
        // إضافة النشاط للعنصر المحدد
        navItems.forEach(item => {
            if (item.getAttribute('href') === targetId) {
                item.classList.add('active');
            }
        });
        
        sidebarLinks.forEach(link => {
            if (link.getAttribute('href') === targetId) {
                link.parentElement.classList.add('active');
            }
        });
        
        // إغلاق القائمة الجانبية عند النقر على رابط
        document.getElementById('sidebar').style.right = '-300px';
    }
    
    // أحداث التنقل السفلي
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            setActiveNav(targetId);
            
            // التمرير إلى القسم المطلوب
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // أحداث روابط القائمة الجانبية
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            setActiveNav(targetId);
            
            // التمرير إلى القسم المطلوب
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // التنقل عند التمرير
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                setActiveNav(`#${sectionId}`);
            }
        });
    });
}

// تسجيل الدخول بفيسبوك
function loginWithFacebook() {
    // في التطبيق الحقيقي، هنا يجب تنفيذ OAuth مع فيسبوك
    // هذا محاكاة فقط
    alert('سيتم توجيهك إلى صفحة تسجيل الدخول بفيسبوك. في التطبيق الحقيقي، سيتم تنفيذ عملية OAuth الكاملة.');
    
    // محاكاة تسجيل الدخول الناجح
    simulateLogin('مستخدم فيسبوك', 'user@facebook.com');
}

// تسجيل الدخول بجوجل
function loginWithGoogle() {
    // في التطبيق الحقيقي، هنا يجب تنفيذ OAuth مع جوجل
    // هذا محاكاة فقط
    alert('سيتم توجيهك إلى صفحة تسجيل الدخول بجوجل. في التطبيق الحقيقي، سيتم تنفيذ عملية OAuth الكاملة.');
    
    // محاكاة تسجيل الدخول الناجح
    simulateLogin('مستخدم جوجل', 'user@gmail.com');
}

// الدخول كزائر
function loginAsGuest() {
    simulateLogin('زائر', 'guest@example.com');
}

// محاكاة تسجيل الدخول
function simulateLogin(name, email) {
    // تحديث معلومات المستخدم
    document.getElementById('userName').textContent = name;
    document.getElementById('userEmail').textContent = email;
    
    // تحديث صورة المستخدم
    const userImages = document.querySelectorAll('.user-info img, .user-profile img');
    userImages.forEach(img => {
        img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2c786c&color=fff`;
    });
    
    // إخفاء شاشة تسجيل الدخول
    document.getElementById('loginScreen').style.display = 'none';
    
    // عرض التطبيق الرئيسي
    document.getElementById('mainApp').style.display = 'flex';
    
    // عرض رسالة ترحيب
    setTimeout(() => {
        alert(`مرحباً ${name}! تم تسجيل دخولك بنجاح.`);
    }, 500);
}

// تسجيل الخروج
function logout() {
    // إخفاء التطبيق الرئيسي
    document.getElementById('mainApp').style.display = 'none';
    
    // إغلاق القائمة الجانبية
    document.getElementById('sidebar').style.right = '-300px';
    
    // إظهار شاشة تسجيل الدخول
    document.getElementById('loginScreen').style.display = 'flex';
    
    // عرض رسالة
    alert('تم تسجيل خروجك بنجاح.');
}

// تحديد اتجاه القبلة
function findQiblaDirection() {
    // في التطبيق الحقيقي، هنا يجب استخدام API الجيولوكيشن
    // هذا محاكاة فقط
    
    alert('جاري تحديد موقعك...');
    
    // محاكاة الحصول على الموقع
    setTimeout(() => {
        const confirmation = confirm('تم تحديد موقعك. هل تريد تفعيل البوصلة الذكية؟');
        
        if (confirmation) {
            // محاكاة تفعيل الجيروسكوب للبوصلة
            alert('تم تفعيل البوصلة الذكية. قم بتدوير هاتفك لرؤية اتجاه القبلة بدقة.');
            
            // تحديث البوصلة
            const randomAngle = Math.floor(Math.random() * 360);
            const compass = document.querySelector('.compass');
            const needle = document.querySelector('.needle');
            
            compass.style.transform = `rotate(${randomAngle}deg)`;
            needle.style.transform = `rotate(${-randomAngle}deg)`;
            
            // تحديث معلومات القبلة
            const directions = ['شمال', 'شمال شرق', 'شرق', 'جنوب شرق', 'جنوب', 'جنوب غرب', 'غرب', 'شمال غرب'];
            const directionIndex = Math.floor(randomAngle / 45);
            document.querySelector('.qibla-info p:first-child strong').textContent = directions[directionIndex];
            document.querySelector('.qibla-info p:last-child strong').textContent = `${randomAngle}°`;
        }
    }, 1000);
}

// تحديث التطبيق كل دقيقة
setInterval(() => {
    updateDate();
    updatePrayerTimes();
}, 60000);
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js")
    .then(() => console.log("Service Worker شغال ✅"))
    .catch(err => console.log("خطأ:", err));
}