// 二维码生成（模拟App下载链接）
// 实际部署时，请将下面的URL替换为您的真实App下载地址

// 配置下载链接 - 请替换为您的真实链接
const APP_LINKS = {
    ios: 'https://apps.apple.com/app/id你的AppID',  // 替换为你的App Store链接
    android: 'https://play.google.com/store/apps/details?id=你的包名',  // 替换为你的Google Play链接
    apk: 'https://你的服务器.com/app.apk'  // 替换为你的APK直链
};

// 使用简单方式生成二维码（不需要外部库）
function generateSimpleQR(text, canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = 180;
    canvas.width = size;
    canvas.height = size;
    
    // 绘制白色背景
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);
    
    // 绘制黑色边框
    ctx.fillStyle = '#000000';
    
    // 模拟二维码样式（实际项目建议使用qrcode.js库）
    // 这里创建一个视觉上美观的模拟二维码
    const blockSize = size / 25;
    
    // 绘制三个定位方块
    function drawPositionSquare(x, y) {
        // 外层
        ctx.fillRect(x, y, blockSize * 7, blockSize * 7);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + blockSize, y + blockSize, blockSize * 5, blockSize * 5);
        ctx.fillStyle = '#000000';
        ctx.fillRect(x + blockSize * 2, y + blockSize * 2, blockSize * 3, blockSize * 3);
        ctx.fillStyle = '#000000';
    }
    
    ctx.fillStyle = '#000000';
    drawPositionSquare(blockSize, blockSize);
    drawPositionSquare(size - blockSize * 8, blockSize);
    drawPositionSquare(blockSize, size - blockSize * 8);
    
    // 绘制随机黑白块模拟二维码效果
    for (let i = 0; i < 400; i++) {
        const x = Math.floor(Math.random() * 23) * blockSize;
        const y = Math.floor(Math.random() * 23) * blockSize;
        if ((x < blockSize * 8 && y < blockSize * 8) || 
            (x > size - blockSize * 8 && y < blockSize * 8) ||
            (x < blockSize * 8 && y > size - blockSize * 8)) {
            continue;
        }
        ctx.fillStyle = Math.random() > 0.5 ? '#000000' : '#FFFFFF';
        ctx.fillRect(x + blockSize, y + blockSize, blockSize, blockSize);
    }
    
    // 中心添加图标
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(size/2 - blockSize*2, size/2 - blockSize*2, blockSize*4, blockSize*4);
    ctx.fillStyle = '#667eea';
    ctx.font = `${blockSize*2}px Arial`;
    ctx.fillText('📱', size/2 - blockSize, size/2 + blockSize/2);
    
    // 添加提示文字
    ctx.fillStyle = '#666666';
    ctx.font = '10px Arial';
    ctx.fillText('扫描下载', size/2 - 25, size - 5);
}

// 初始化二维码（默认iOS）
let currentPlatform = 'ios';

function updateQRCode(platform) {
    const url = APP_LINKS[platform];
    if (url) {
        generateSimpleQR(url, 'qrCanvas');
        // 在控制台输出真实链接（便于调试）
        console.log(`二维码指向: ${url}`);
    }
}

// 处理下载按钮点击
function handleDownload(platform) {
    const url = APP_LINKS[platform];
    if (url && url !== '#') {
        window.open(url, '_blank');
    } else {
        // 演示模式：弹出提示
        alert(`演示模式\n${platform.toUpperCase()} 下载链接：${url}\n\n正式部署时请替换为真实的App下载地址`);
    }
}

// 平台切换
function initPlatformSwitch() {
    const btns = document.querySelectorAll('.platform-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const platform = btn.dataset.platform;
            currentPlatform = platform;
            
            // 更新按钮样式
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 更新二维码
            updateQRCode(platform);
        });
    });
}

// 移动端底部栏控制
function initMobileBar() {
    const bar = document.getElementById('mobileDownloadBar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 300) {
            bar.classList.add('show');
        } else {
            bar.classList.remove('show');
        }
        lastScroll = currentScroll;
    });
    
    const mobileBtn = document.getElementById('mobileDownloadBtn');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // 检测设备类型
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            if (isIOS) {
                handleDownload('ios');
            } else {
                handleDownload('android');
            }
        });
    }
}

// 绑定所有下载按钮
function initDownloadButtons() {
    const iosBtn = document.getElementById('iosBtn');
    const androidBtn = document.getElementById('androidBtn');
    const iosDownloadBtn = document.getElementById('iosDownloadBtn');
    const androidDownloadBtn = document.getElementById('androidDownloadBtn');
    const apkBtn = document.getElementById('apkDownloadBtn');
    
    if (iosBtn) iosBtn.addEventListener('click', (e) => { e.preventDefault(); handleDownload('ios'); });
    if (androidBtn) androidBtn.addEventListener('click', (e) => { e.preventDefault(); handleDownload('android'); });
    if (iosDownloadBtn) iosDownloadBtn.addEventListener('click', (e) => { e.preventDefault(); handleDownload('ios'); });
    if (androidDownloadBtn) androidDownloadBtn.addEventListener('click', (e) => { e.preventDefault(); handleDownload('android'); });
    if (apkBtn) apkBtn.addEventListener('click', (e) => { e.preventDefault(); handleDownload('apk'); });
}

// 自动检测设备，推荐对应下载
function autoDetectDevice() {
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    
    if (isIOS) {
        // 可以显示iOS推荐提示
        console.log('检测到iOS设备');
    } else if (isAndroid) {
        console.log('检测到Android设备');
    }
}

// 页面加载完成
document.addEventListener('DOMContentLoaded', () => {
    updateQRCode('ios');
    initPlatformSwitch();
    initDownloadButtons();
    initMobileBar();
    autoDetectDevice();
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
