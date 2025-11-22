const express = require('express')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const cors = require('cors')

const app = express()
const PORT = 3000

app.use(cors());

// ---------------------------
//  CONFIGURAÇÃO DA PASTA
// ---------------------------
const imagensDir = path.resolve('./bucket-raw')

if (!fs.existsSync(imagensDir)) {
  fs.mkdirSync(imagensDir, { recursive: true })
}

// ---------------------------
//  CONFIGURAÇÃO DO MULTER
// ---------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagensDir)
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname) // mantém o nome original
  }
})

const upload = multer({ storage })

// ---------------------------
//  ENDPOINT: UPLOAD
// ---------------------------
app.post('/upload', upload.single('arquivo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado.' })
  }

  res.status(200).json({
    mensagem: 'Upload realizado com sucesso!',
    arquivo: req.file.filename
  })
})

// ---------------------------
//  ENDPOINT: BUSCAR POR NOME
// ---------------------------
app.get('/arquivo/:filename', (req, res) => {
  const filename = req.params.filename
  const filePath = path.join(imagensDir, filename)

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Arquivo não encontrado.' })
  }

  res.setHeader('Content-Disposition', `inline; filename="${filename}"`)
  res.sendFile(filePath, err => {
    if (err) {
      console.error(err)
      return res.status(500).json({ error: 'Erro ao enviar o arquivo.' })
    }
  })
})

// ---------------------------
//  ENDPOINT: GET ALL ARQUIVOS
// ---------------------------
app.get('/arquivos', (req, res) => {
  fs.readdir(imagensDir, (err, files) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ error: 'Erro ao listar os arquivos.' })
    }

    res.status(200).json({
      quantidade: files.length,
      arquivos: files
    })
  })
})

// ---------------------------
//  INICIAR SERVIDOR
// ---------------------------
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})
