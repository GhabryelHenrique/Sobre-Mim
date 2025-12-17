const fs = require('fs');
const path = require('path');
const heicConvert = require('heic-convert');

async function convertHeicToJpg(inputPath, outputPath) {
  try {
    const inputBuffer = await fs.promises.readFile(inputPath);
    const outputBuffer = await heicConvert({
      buffer: inputBuffer,
      format: 'JPEG',
      quality: 0.9
    });

    await fs.promises.writeFile(outputPath, outputBuffer);
    console.log(`✓ Convertido: ${path.basename(inputPath)} -> ${path.basename(outputPath)}`);
    return true;
  } catch (error) {
    console.error(`✗ Erro ao converter ${inputPath}:`, error.message);
    return false;
  }
}

async function findAndConvertHeicFiles(directory) {
  try {
    const entries = await fs.promises.readdir(directory, { withFileTypes: true });
    let convertedCount = 0;

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        // Recursivamente procurar em subdiretórios
        convertedCount += await findAndConvertHeicFiles(fullPath);
      } else if (entry.isFile() && entry.name.toUpperCase().endsWith('.HEIC')) {
        // Converter arquivo HEIC
        const outputPath = fullPath.replace(/\.HEIC$/i, '.jpg');
        const success = await convertHeicToJpg(fullPath, outputPath);
        if (success) convertedCount++;
      }
    }

    return convertedCount;
  } catch (error) {
    console.error(`Erro ao processar diretório ${directory}:`, error.message);
    return 0;
  }
}

async function main() {
  const palestrasDir = path.join(__dirname, 'public', 'images', 'palestras');

  console.log('🔄 Iniciando conversão de arquivos HEIC para JPG...\n');
  console.log(`📁 Diretório: ${palestrasDir}\n`);

  if (!fs.existsSync(palestrasDir)) {
    console.error('❌ Diretório de palestras não encontrado!');
    process.exit(1);
  }

  const totalConverted = await findAndConvertHeicFiles(palestrasDir);

  console.log(`\n✅ Conversão concluída! Total de arquivos convertidos: ${totalConverted}`);
}

main();
