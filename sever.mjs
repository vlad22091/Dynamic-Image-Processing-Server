// server.mjs
import express from 'express';
import { existsSync } from 'node:fs';
import sharp from 'sharp';

const app = express();
const BASE_IMAGE = './source.jpg';

// Логування всіх запитів
app.use((req, res, next) => {
  console.log('Отримано запит:', req.url);
  next(); // Передаємо керування наступним маршрутам
});

// Динамічна генерація Фавікону (32x32)
app.get('/favicon.ico', async (req, res) => {
  if (!existsSync(BASE_IMAGE)) {
    return res.status(404).end(); // Express сам розуміє, що треба завершити відповідь
  }

  try {
    const faviconBuffer = await sharp(BASE_IMAGE)
      .resize(32, 32)
      .png()
      .toBuffer();

    // res.type() автоматично виставляє потрібний Content-Type
    res.type('png').send(faviconBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Помилка генерації фавікону');
  }
});

//Динамічна зміна розміру по запиту /image/ШИРИНА/ВИСОТА
app.get('/image/:width/:height', async (req, res) => {

  const width = Number(req.params.width);
  const height = Number(req.params.height);

  if (!Number.isInteger(width) || !Number.isInteger(height)) {
    return res.status(400).send('Помилка: Ширина та висота мають бути цілими числами (наприклад: /image/300/200).');
  }

  if (width < 10 || height < 10) {
    return res.status(400).send('Помилка: Розмір занадто малий. Мінімальний розмір: 10x10 пікселів.');
  }

  if (width > 4000 || height > 4000) {
    return res.status(400).send('Помилка: Розмір занадто великий. Максимальний дозволений розмір: 4000x4000 пікселів.');
  }

  //  ОБРОБКА ЗОБРАЖЕННЯ

  if (!existsSync(BASE_IMAGE)) {
    return res.status(404).send('Базове зображення source.jpg не знайдено на сервері.');
  }

  try {
    const imageBuffer = await sharp(BASE_IMAGE)
      .resize(width, height, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toBuffer();

    res.type('jpeg').send(imageBuffer);

  } catch (error) {
    console.error('Помилка sharp:', error);
    res.status(500).send('Внутрішня помилка сервера під час обробки зображення.');
  }
});

//  Відповідь для головної сторінки
app.get('/', (req, res) => {
  // Express автоматично розуміє, що це HTML, і сам ставить Content-Type
  res.send(`
    <h1>Сервер генерації картинок працює на Express!</h1>
    <p>Спробуйте перейти за цими посиланнями:</p>
    <ul>
      <li><a href="/image/100/100">Картинка 100x100</a></li>
      <li><a href="/image/500/200">Картинка 500x200</a></li>
      <li><a href="/image/800/600">Картинка 800x600</a></li>
    </ul>
  `);
});

// Запускаємо сервер
app.listen(3000, '127.0.0.1', () => {
  console.log(' Express сервер працює! http://127.0.0.1:3000');
});
