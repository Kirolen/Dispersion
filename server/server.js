const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./Router/authRouter')
const cors = require('cors');
const PORT = process.env.PORT || 5000

const app = express()

app.use(cors())
app.use(express.json())
app.use("/auth", authRouter)


const start = async () => {
    try {
        await mongoose.connect("mongodb+srv://kostik:kostik@dispersioncluster.fy1nx.mongodb.net/?retryWrites=true&w=majority&appName=DispersionCluster")
        app.listen(PORT, () => console.log(`servers started on port ${PORT}`))
    }
    catch(error){
        console.log(error)
    }
}

start()