import express from 'express';

const app = express();
const PORT = 5000;

const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Caymus Calculator - Expo App</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    .container {
      max-width: 600px;
      padding: 40px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      text-align: center;
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 20px;
    }
    .emoji {
      font-size: 4rem;
      margin-bottom: 20px;
    }
    .alert {
      background: rgba(255, 193, 7, 0.2);
      border-left: 4px solid #ffc107;
      padding: 20px;
      margin: 30px 0;
      border-radius: 8px;
      text-align: left;
    }
    .alert h2 {
      margin-top: 0;
      font-size: 1.3rem;
    }
    code {
      background: rgba(0, 0, 0, 0.3);
      padding: 4px 8px;
      border-radius: 4px;
      font-family: 'Monaco', 'Courier New', monospace;
    }
    .steps {
      text-align: left;
      margin: 20px 0;
    }
    .steps li {
      margin: 10px 0;
      line-height: 1.6;
    }
    a {
      color: #ffc107;
      text-decoration: none;
      font-weight: bold;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="emoji">📱</div>
    <h1>Caymus Wine Tank Calculator</h1>
    <p>Esta es una aplicación nativa de React Native con Expo</p>
    
    <div class="alert">
      <h2>⚠️ Cómo usar esta app</h2>
      <p>Esta app móvil NO se ejecuta en el navegador. Para usarla:</p>
      <ol class="steps">
        <li>Abre una terminal en Replit</li>
        <li>Ejecuta el comando: <code>./start-expo.sh</code></li>
        <li>Escanea el QR code que aparece con <strong>Expo Go</strong> en tu iPhone</li>
        <li>¡La app se cargará en tu teléfono!</li>
      </ol>
    </div>
    
    <p><strong>Documentación completa:</strong> <code>mobile/INSTRUCCIONES-INICIO.md</code></p>
    <p><strong>Publicar en App Store:</strong> <code>mobile/README.md</code></p>
  </div>
</body>
</html>
`;

app.get('*', (req, res) => {
  res.send(html);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 Caymus Wine Tank Calculator - Expo App');
  console.log('');
  console.log('📱 IMPORTANTE: Esta es una app React Native con Expo');
  console.log('');
  console.log(`Servidor de información iniciado en http://0.0.0.0:${PORT}`);
  console.log('');
  console.log('Para ejecutar la app móvil, usa el comando:');
  console.log('  ./start-expo.sh');
  console.log('');
  console.log('Luego escanea el QR code con Expo Go en tu iPhone.');
  console.log('');
});
