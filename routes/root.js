const express = require('express')
const router = express.Router()
const path = require('path')

router.get('^/$|/index(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})

router.get('/new-page(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'new-page.html'))
})

router.get('/old-page(.html)?', (req, res) => {
  res.redirect(301, '/new-page.html') // 302 by default (302 : temporary redirect, 301: permenet redirect )
})

module.exports = router
