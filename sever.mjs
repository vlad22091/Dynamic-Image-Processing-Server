// server.mjs
import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import sharp from 'sharp';

// Назва нашої базової картинки, з якої будемо робити всі розміри
const BASE_IMAGE = './source.jpg'
;

const server = createServer(async (req, res) => {
  console.log('Отримано запит:', req.url);

  // Динамічна генерація Фавікону (32x32)
  if (req.url === '/favicon.ico') {
    if (existsSync(BASE_IMAGE)) {
      try {
        const faviconBuffer = await sharp(BASE_IMAGE)
          .resize(32, 32)
          .png()
          .toBuffer();

        res.writeHead(200, { 'Content-Type': 'image/png' });
        res.end(faviconBuffer);
      } catch (err) {
        res.writeHead(500);
        res.end('Помилка генерації фавікону');
      }
    } else {
      res.writeHead(404);
      res.end();
    }
    return;
  }

  // Динамічна зміна розміру по запиту /image/ШИРИНА/ВИСОТА
  if (req.url.startsWith('/image/')) {
    const parts = req.url.split('/');
    
    if (parts.length === 4) {
      // Витягуємо числа з масиву
      const width = parseInt(parts[2]);
      const height = parseInt(parts[3]);

      if (!isNaN(width) && !isNaN(height)) {
        
        // Перевіряємо, чи існує базова картинка
        if (!existsSync(BASE_IMAGE)) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('Базове зображення source.jpg не знайдено на сервері.');
          return;
        }

        try {
          // Обробляємо зображення за допомогою sharp
          const imageBuffer = await sharp(BASE_IMAGE)
            .resize(width, height, {
              fit: 'cover' // Зрізає зайве, щоб картинка заповнила задані розміри без спотворень
            })
            .jpeg({ quality: 80 }) // Зберігаємо у форматі JPEG з якістю 
            .toBuffer();

          // Відправляємо готову картинку в браузер
          res.writeHead(200, { 'Content-Type': 'image/jpeg' });
          res.end(imageBuffer);
          return;

        } catch (error) {
          console.error('Помилка sharp:', error);
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('Внутрішня помилка сервера під час обробки зображення.');
          return;
        }
      }
    }
    
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Неправильний формат! Використовуйте: /image/ШИРИНА/ВИСОТА (наприклад: /image/300/200)');
    return;
  }

  // Відповідь для головної сторінки 
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <h1>Сервер генерації картинок працює!</h1>
    <p>Спробуйте перейти за цими посиланнями:</p>
    <ul>
      <li><a href="/image/100/100">Картинка 100x100</a></li>
      <li><a href="/image/500/200">Картинка 500x200</a></li>
      <li><a href="/image/800/600">Картинка 800x600</a></li>
    </ul>
  `);
});

server.listen(3000, '127.0.0.1', () => {
  console.log('http://127.0.0.1:3000');
});