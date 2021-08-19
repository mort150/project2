const {MongoClient,ObjectId} = require('mongodb');

const URL = 'mongodb://localhost:27017';

async function getDB() {
    const client = await MongoClient.connect(URL);
    const dbo = client.db("STORE1DB");
    return dbo;
}
async function insertProduct(newProduct) {
    const dbo = await getDB();
    await dbo.collection("products").insertOne(newProduct);
}
async function insertUser(user) {
    const dbo = await getDB();
    await dbo.collection("users").insertOne(user);
}
async function deleteProduct(idInput) {
    const dbo = await getDB();
    await dbo.collection("products").deleteOne({ _id: ObjectId(idInput) });
}
async function updateProduct(id, nameInput, priceInput, pictureInput) {
    const dbo = await getDB();
    dbo.collection("products").updateOne({ _id: ObjectId(id) }, { $set: { name: nameInput, price: priceInput, picture: pictureInput } })
}
async function getAllProduct() {
    const dbo = await getDB();
    const allProducts = await dbo.collection("products").find({}).toArray();
    return allProducts;
}
async function getProductById(idInput) {
    const dbo = await getDB();
    return dbo.collection("products").findOne({ _id: ObjectId(idInput) });
}
async function searchProduct(nameSearch) {
    const dbo = await getDB();
    const allProducts = await dbo.collection("products").find({ name: nameSearch }).toArray();
    return allProducts;
}
async function checkUserRole(nameInput, passInput) {
    const dbo = await getDB();
    const user = await dbo.collection("users").findOne({ name: nameInput, pass: passInput });
    if (user == null) {
        return "-1"
    } else {
        return user.role;
    }
}
module.exports = {getDB,insertProduct,insertUser,deleteProduct,updateProduct,getAllProduct,getProductById,searchProduct,checkUserRole};