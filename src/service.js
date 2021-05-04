if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const path = require('path')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')

const initializePassport = require('./passport.config')
const { use } = require('passport')
initializePassport(
    passport,
    email => users.find(user => user.email == email),
    id => users.find(user => user.id == id)
)

const users = [];


app.set('view engine', 'ejs')
console.log(path.join(__dirname, './public'))
app.use(express.static(path.join(__dirname, './public')))
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

console.log('process', process.env.SESSION_SECRET)


app.get('/', checkAuthentication, (req, res) => {
    console.log(req)
    res.render('index.ejs', { name: req.user.name })
})

app.get('/login', (req, res) => {
    users.find(user => console.log(user))
    res.render('login.ejs')
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true

}))


app.get('/registre', async (req, res) => {
    res.render('registre.ejs')
})

app.post('/registre', async (req, res) => {

    try {
        const haspassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: haspassword
        })
        res.redirect('login')
    } catch (e) {
        console.log(e)
        res.render('registre.ejs')
    }
    console.log(users)
})

function checkAuthentication(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect('/login')
    }
}

app.listen(3005, () => {
    console.log('Servidor rodando')
})