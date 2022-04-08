const http = require('http')
const path = require('path')
const fs = require('fs')
const fsPromises = require('fs').promises

const PORT = process.env.PORT || 3500

const serveFile = async (filePath, contentType, response) => {
  try {
    const raw = await fsPromises.readFile(
      filePath,
      !contentType.includes('image') ? 'utf8' : '',
    )
    const data = contentType === 'application/json' ? JSON.parse(raw) : raw
    response.writeHead(filePath.includes('404.html') ? 404 : 200, {
      'Content-Type': contentType,
    }) // header 에 추가
    response.write('hey client! how are you doing?') // client body에 보냄
    response.end(
      contentType === 'application/json' ? JSON.stringify(data) : data,
    )
  } catch (err) {
    console.log(err)
    response.statusCode = 500
    response.end()
  }
}

const server = http.createServer((req, res) => {
  console.log('req.url;', req.url) // localhost:3500/{req.url}
  const extension = path.extname(req.url)
  console.log('extension :', extension) // 없음 @ html 이기 때문에
  let contentType

  switch (extension) {
    case '.css':
      contentType = 'text/css'
      break

    case '.js':
      contentType = 'text/javascript'
      break

    case '.json':
      contentType = 'application/json'
      break

    case '.jpg':
      contentType = 'image/jpeg'
      break

    case '.txt':
      contentType = 'text/plain'
      break
    default:
      contentType = 'text/html'
  }
  console.log('req.url.slice(-1) :', req.url.slice(-1))
  let filePath =
    contentType === 'text/html' && req.url === '/'
      ? path.join(__dirname, 'views', 'index.html')
      : contentType === 'text/html' && req.url.slice(-1) === '/'
      ? path.join(__dirname, 'views', req.url, 'index.html')
      : contentType === 'text/html'
      ? path.join(__dirname, 'views', req.url)
      : path.join(__dirname, req.url)
  console.log('filePath :', filePath) //  C:\Users\rhkrx\Desktop\곤줄박이\node\views\new-page
  if (!extension && req.url.slice(-1) !== '/') filePath += '.html'
  console.log('filePath :', filePath) // C:\Users\rhkrx\Desktop\곤줄박이\node\views\new-page.html
  const fileExists = fs.existsSync(filePath)
  console.log('fileExists?', fileExists) // yes @.html
  console.log('path.parse(filePath) : ', path.parse(filePath)) // filePath 분석
  console.log('path.parse(filePath).base : ', path.parse(filePath).base) //  {req.url}.html
  if (fileExists) {
    //serve the file
    serveFile(filePath, contentType, res)
  } else {
    //   redirect
    switch (path.parse(filePath).base) {
      case 'old-page.html':
        res.writeHead(301, { Location: '/new-page.html' })
        res.end()
        break

      case 'www-page.html':
        res.writeHead(301, { Location: '/' })
        res.end()
        break

      default:
        // serve a 404 response
        serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res)
    }
  }
})

server.listen(PORT, () => console.log('Server running on port : ' + PORT))
