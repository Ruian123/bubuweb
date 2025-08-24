// 导航功能
(function() {
    // 获取当前页面的文件名
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    
    // 获取所有导航链接
    const navLinks = document.querySelectorAll('#navigation a');
    
    // 为当前页面的链接添加active类
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
})();

// 首页滑动展示功能
function initSlider() {
    // 检查是否在首页
    if (!document.querySelector('.slider')) return;
    
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    
    // 更新滑动位置
    function updateSlider() {
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    
    // 下一张
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlider();
    }
    
    // 上一张
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlider();
    }
    
    // 触摸开始
    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
    }
    
    // 触摸结束
    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }
    
    // 处理滑动
    function handleSwipe() {
        const swipeThreshold = 50; // 最小滑动距离
        
        if (touchStartX - touchEndX > swipeThreshold) {
            // 向左滑动
            nextSlide();
        } else if (touchEndX - touchStartX > swipeThreshold) {
            // 向右滑动
            prevSlide();
        }
    }
    
    // 绑定按钮事件
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // 绑定触摸事件
    slider.addEventListener('touchstart', handleTouchStart);
    slider.addEventListener('touchend', handleTouchEnd);
    
    // 自动播放
    setInterval(nextSlide, 5000);
}

// 留言板功能
function initMessageBoard() {
    // 检查是否在留言板页面
    if (!document.getElementById('message-form')) return;
    
    // 从localStorage加载留言
    loadMessages();
    
    // 绑定表单提交事件
    document.getElementById('message-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 获取表单数据
        const name = document.getElementById('name').value;
        const message = document.getElementById('message').value;
        
        // 验证数据
        if (!name || !message) {
            alert('请填写所有字段');
            return;
        }
        
        // 创建留言对象
        const messageObj = {
            id: Date.now(),
            name: name,
            content: message,
            date: new Date().toLocaleString('zh-CN')
        };
        
        // 保存留言
        saveMessage(messageObj);
        
        // 清空表单
        this.reset();
        
        // 重新加载留言
        loadMessages();
    });
}

// 保存留言到localStorage
function saveMessage(message) {
    // 获取现有留言
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    
    // 添加新留言
    messages.push(message);
    
    // 保存到localStorage
    localStorage.setItem('messages', JSON.stringify(messages));
}

// 从localStorage加载留言
function loadMessages() {
    // 获取留言
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    
    // 获取留言容器
    const container = document.getElementById('messages-container');
    
    // 清空容器
    container.innerHTML = '';
    
    // 如果没有留言，显示提示
    if (messages.length === 0) {
        container.innerHTML = '<p>还没有留言，快来抢沙发吧！</p>';
        return;
    }
    
    // 按时间倒序排列
    messages.reverse();
    
    // 添加留言到容器
    messages.forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.innerHTML = `
            <div class="message-header">
                <span class="message-author">${msg.name}</span>
                <span class="message-date">${msg.date}</span>
            </div>
            <div class="message-content">
                ${msg.content}
            </div>
        `;
        container.appendChild(messageElement);
    });
}

// 页面加载完成后初始化功能
document.addEventListener('DOMContentLoaded', function() {
    // 初始化导航
    // (已经在上面的匿名函数中处理)
    
    // 初始化滑动展示
    initSlider();
    
    // 初始化留言板
    initMessageBoard();
});