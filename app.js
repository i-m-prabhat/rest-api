const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 5000

mongoose.connect('mongodb://0.0.0.0:27017/productdb', { useNewUrlParser: true, useUnifiedTopology: true }).then(() =>
{
    console.log("connected with mongodb");
}).catch((err) =>
{
    console.log(err);
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json())


const productSchema = new mongoose.Schema({ name: String, description: String, price: Number },
    { versionKey: false }
)

productModel = new mongoose.model("products", productSchema)

//create product
app.post("/api/createproduct", async (req, res) =>
{
    const Product = await productModel.create(req.body);

    res.status(200).json({
        success: true,
        Product
    })
})


// Read product 

app.get("/api/readproduct", async (req, res) =>
{
    const allProduct = await productModel.find();

    res.status(200).json({
        status: true,
        allProduct
    })
})


// Update Product 

app.put('/api/updateproduct/:id', async (req, res) =>
{
    let updatedProduct = await productModel.findById(req.params.id);

    updatedProduct = await productModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        useFindAndModify: false,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        updatedProduct
    })
})


// Delete Product 
app.delete('/api/deleteproduct/:id', async (req, res) =>
{
    const deleteProduct = await productModel.findById(req.params.id);

    if (!deleteProduct)
    {
        return res.status(500).json({
            status: false,
            message: "Product not found"
        })
    }

    await deleteProduct.deleteOne();

    res.status(200).json({
        success: true,
        message: "Product is deleted successfully"
    })
})

app.get("/", (req, res, next) =>
{
    res.send("Hello world")
})

app.listen(PORT, () =>
{
    console.log("Server Started on PORT", PORT);
})