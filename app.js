const express = require("express")
const session = require('express-session');
const { Int32 } = require('mongodb')

const { getDB,insertProduct,insertUser,deleteProduct,updateProduct,getAllProduct,getProductById,searchProduct,checkUserRole } = require('./detaildatabase');
const app = express();

app.use(session({ secret: '165@#5312', cookie: { maxAge: 70000 }, saveUninitialized: false, resave: false }))
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'hbs')

app.get('/', requireLogin, async (req, res) => {
    const allProducts = await getAllProduct();
    res.render('index', { data: allProducts, user: req.session["User"] })
})

app.post('/insert', async (req, res) => {
    const nameInput = req.body.txtName;
    const priceInput = req.body.txtPrice;
    const pictureInput = req.body.picture;
    const newProduct = { name: nameInput, price: Int32(priceInput), picture: pictureInput };
    await insertProduct(newProduct);
    res.redirect('/');
})
app.get('/delete', async (req, res) => {
    const idInput = req.query.id;
    await deleteProduct(idInput);
    res.redirect('/');
})

app.get('/edit', async (req, res) => {
    const idInput = req.query.id;
    const search_Product = await getProductById(idInput);
    res.render('edit', { product: search_Product })
})

app.post('/update', async (req, res) => {
    const id = req.body.id;
    const nameInput = req.body.txtName;
    const priceInput = req.body.txtPrice;
    const pictureInput = req.body.picture;
    await updateProduct(id, nameInput, priceInput, pictureInput);
    res.redirect('/');
})

app.get('/add', (req, res) => {
    res.render('detail')
})
app.get('/search', (req, res) => {
    res.render('searchpage')
})

app.get('/home', (req, res) => {
    res.redirect('/')
})
app.post('/search', async (req, res) => {
    const nameSearch = req.body.txtSearch;
    const allProducts = await searchProduct(nameSearch);
    res.render('index', { data: allProducts })
})

app.get('/nologin', requireLogin, (req, res) => {
    res.render('noLogin');
})

app.post('/register', async (req, res) => {
    const nameInput = req.body.txtName;
    const passInput = req.body.txtPassword;
    const roleInput = req.body.role;
    await insertUser({ name: nameInput, pass: passInput, role: roleInput })
    res.redirect('/login')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/doLogin', async (req, res) => {
    const nameInput = req.body.txtName;
    const passInput = req.body.txtPassword;
    const userRole = await checkUserRole(nameInput, passInput);
    if (userRole != "-1") {
        req.session["User"] = {
            name: nameInput,
            role: userRole
        }
    }
    res.redirect('/');
})
function requireLogin(req, res, next) {
    if (req.session["User"]) {
        return next()
    } else {
        res.redirect('/login')
    }

}
const PORT = process.env.PORT || 5001;
app.listen(PORT);
console.log('Server is running: ', PORT);
